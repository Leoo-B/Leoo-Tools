from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
import io
from PIL import Image
from miragic_sdk import MiragicSDK
import os

app = FastAPI()

# Inisialisasi SDK (model bakal di-download pertama kali dipake)
sdk = MiragicSDK()

@app.post("/api/upscale")
async def upscale_image(file: UploadFile = File(...)):
    # Cek apakah file yang diupload adalah gambar
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload gambar dulu bro!")

    try:
        # Baca file yang diupload
        image_data = await file.read()
        input_image = Image.open(io.BytesIO(image_data))

        # Upscale pake Miragic SDK (2x)
        upscaled_image = sdk.upscale_image(input_image, scale_factor=2)

        # Ubah hasil ke bytes
        img_bytes = io.BytesIO()
        upscaled_image.save(img_bytes, format='PNG')
        img_bytes = img_bytes.getvalue()

        # Balikin hasil sebagai gambar PNG
        return Response(content=img_bytes, media_type="image/png")

    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error: {str(e)}")
