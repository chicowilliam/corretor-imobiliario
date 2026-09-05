from pathlib import Path
from urllib.request import urlopen, Request
import re

ROOT = Path(__file__).resolve().parents[1] / 'public' / 'fonts'
for name, family in [('editorial', 'Cormorant+Garamond:wght@400..600'), ('editorial-italic', 'Cormorant+Garamond:ital,wght@1,400'), ('interface', 'Manrope:wght@400..600')]:
    request = Request('https://fonts.googleapis.com/css2?family=' + family + '&display=swap', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
    css = urlopen(request, timeout=30).read().decode()
    urls = re.findall(r'url\((https://[^)]+\.woff2)\)', css)
    if not urls:
        print('No WOFF2 for', name, flush=True)
        continue
    data = urlopen(urls[-1], timeout=30).read()
    (ROOT / (name + '.woff2')).write_bytes(data)
    print(name, len(data), flush=True)
