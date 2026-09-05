"""Compress existing licensed footage and extract its poster. No AI generation."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'artifacts' / 'media-tools'))
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
source = ROOT / 'artifacts' / 'architecture-source.mp4'
subprocess.run([ffmpeg, '-y', '-i', str(source), '-t', '12', '-an', '-vf', 'scale=1280:-2,fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-movflags', '+faststart', str(ROOT / 'public' / 'videos' / 'architecture-loop.mp4')], check=True)
subprocess.run([ffmpeg, '-y', '-ss', '0.2', '-i', str(source), '-frames:v', '1', '-vf', 'scale=1920:-2', '-q:v', '3', str(ROOT / 'public' / 'images' / 'hero-poster.jpg')], check=True)
