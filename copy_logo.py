import shutil

src = r"C:\Users\DELL\.gemini\antigravity\brain\38ed324a-a23e-415d-8952-323769159b68\.user_uploaded\media_1786690863285.png"
dst = r"C:\Users\DELL\.gemini\antigravity\scratch\quran_recitation_portal\iqra_logo.png"

shutil.copyfile(src, dst)
print("COPIED SUCCESSFULLY")
