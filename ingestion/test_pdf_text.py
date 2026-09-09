import fitz

doc_en = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_en.pdf")
doc_bn = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")

print("--- English Page 115 (Mole chapter) ---")
p_en = doc_en.load_page(114) # 0-indexed page 115
print(p_en.get_text()[:600])

print("\n--- Bengali Page 115 (Mole chapter) ---")
p_bn = doc_bn.load_page(114) # 0-indexed page 115
print(p_bn.get_text()[:600])
