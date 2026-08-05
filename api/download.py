from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import yt_dlp

app = FastAPI()

ALLOWED_PLATFORMS = {"tiktok", "youtube", "instagram", "facebook"}

# Domain whitelist per platform, biar orang gak pakai endpoint ini
# buat download sembarang situs.
PLATFORM_DOMAINS = {
    "tiktok": ["tiktok.com"],
    "youtube": ["youtube.com", "youtu.be"],
    "instagram": ["instagram.com"],
    "facebook": ["facebook.com", "fb.watch"],
}


class DownloadRequest(BaseModel):
    platform: str
    url: HttpUrl


@app.post("/api/download")
async def download_media(payload: DownloadRequest):
    platform = payload.platform.lower()
    url = str(payload.url)

    if platform not in ALLOWED_PLATFORMS:
        raise HTTPException(status_code=400, detail="Platform tidak didukung.")

    domains = PLATFORM_DOMAINS[platform]
    if not any(d in url for d in domains):
        raise HTTPException(
            status_code=400,
            detail=f"Link tidak cocok dengan platform {platform}."
        )

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "format": "best[ext=mp4]/best",
        "noplaylist": True,
        # Jangan download file ke disk, cukup ambil metadata + direct URL-nya.
        "skip_download": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Gagal ambil data media: {e}")

    if not info:
        raise HTTPException(status_code=422, detail="Media tidak ditemukan.")

    download_url = info.get("url")
    if not download_url and info.get("formats"):
        # fallback: ambil format terakhir (biasanya kualitas tertinggi)
        download_url = info["formats"][-1].get("url")

    if not download_url:
        raise HTTPException(status_code=422, detail="Tidak ada link download yang bisa diambil.")

    return {
        "title": info.get("title", "Media"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "download_url": download_url,
    }
