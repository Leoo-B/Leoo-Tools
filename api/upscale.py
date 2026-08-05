from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
import io
from PIL import Image
from miragic_sdk import MiragicSDK

app = FastAPI()
sdk = MiragicSDK()

@app.post("/api/upscale")
async def upscale_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload gambar dulu!")

    try:
        image_data = await file.read()
        if len(image_data) == 0:
            raise HTTPException(status_code=400, detail="File kosong")
            
        input_image = Image.open(io.BytesIO(image_data))
        upscaled = sdk.upscale_image(input_image, scale_factor=2)
        
        img_bytes = io.BytesIO()
        upscaled.save(img_bytes, format='PNG')
        img_bytes = img_bytes.getvalue()
        
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
