import fitz
import os
from PIL import Image

doc_bn = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")
doc_en = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_en.pdf")

print("--- Checking drawings, images and text blocks for Pages 9 to 16 ---")
for p in range(9, 17):
    p_bn = doc_bn.load_page(p - 1)
    p_en = doc_en.load_page(p - 1)
    
    drawings_bn = len(p_bn.get_drawings())
    images_bn = len(p_bn.get_images())
    
    drawings_en = len(p_en.get_drawings())
    images_en = len(p_en.get_images())
    
    print(f"Page {p:02d}: BN (drawings={drawings_bn}, images={images_bn}) | EN (drawings={drawings_en}, images={images_en})")
