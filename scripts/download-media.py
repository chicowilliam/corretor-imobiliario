"""Download existing editorial reference photographs. Does not generate imagery."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlopen, Request

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'public' / 'images'
DESTINATION.mkdir(parents=True, exist_ok=True)
PHOTOS = {
    'hero': 'photo-1613977257363-707ba9348227',
    'interior': 'photo-1600210492486-724fe5c67fb0',
    'apartment': 'photo-1600607687939-ce8a6c25118c',
    'courtyard': 'photo-1600047509807-ba8f99d2cdde',
    'loft': 'photo-1600607687920-4e2a09cf159d',
    'terrace': 'photo-1600566753086-00f18fb6b3ea',
    'agent': 'photo-1560250097-0b93528c311a',
}

def download(item):
    name, photo_id = item
    url = f'https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={1920 if name == "hero" else 1400}&q=85&fm=webp'
    path = DESTINATION / f'{name}.webp'
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=45) as response:
        path.write_bytes(response.read())
    print(name, path.stat().st_size, flush=True)

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=4) as executor:
        list(executor.map(download, PHOTOS.items()))
