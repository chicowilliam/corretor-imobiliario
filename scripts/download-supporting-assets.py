"""Download existing fonts and video footage; no image generation."""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[1]
ASSETS = [
    ('public/fonts/CormorantGaramond-OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt'),
    ('public/fonts/Manrope-OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt'),
    ('artifacts/architecture-source.mp4', 'https://videos.pexels.com/video-files/32456138/13842188_3840_2160_60fps.mp4'),
]

def download(item):
    name, url = item
    destination = ROOT / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=90) as response:
            destination.write_bytes(response.read())
        print(name, destination.stat().st_size, flush=True)
    except Exception as error:
        print(name, str(error), flush=True)

with ThreadPoolExecutor(max_workers=4) as executor:
    list(executor.map(download, ASSETS))
