import urllib.request
import ssl

url = "https://i0.wp.com/iqrabaonline.org/wp-content/uploads/2022/08/IQRA-logo-HD.png"
dst = r"C:\Users\DELL\.gemini\antigravity\scratch\quran_recitation_portal\iqra_logo.png"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx) as response, open(dst, 'wb') as out_file:
        out_file.write(response.read())
    print("DOWNLOAD SUCCESSFUL FROM iqrabaonline.org")
except Exception as e:
    print(f"FAILED: {e}")
