import fitz

doc_en = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_en.pdf")
doc_bn = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")

print("Doc EN page count:", len(doc_en))
print("Doc BN page count:", len(doc_bn))

for i in [10, 50, 100, 150, 200]:
    p_en = doc_en.load_page(i)
    p_bn = doc_bn.load_page(i)
    print(f"Page {i+1}: EN text length={len(p_en.get_text())}, images={len(p_en.get_images())} | BN text length={len(p_bn.get_text())}, images={len(p_bn.get_images())}")
