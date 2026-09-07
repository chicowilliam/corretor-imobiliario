"""Export the existing licensed local font as SVG outlines; no runtime font tool."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path('artifacts/font-outline-tools').resolve()))
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont('public/fonts/editorial.woff2')
if 'fvar' in font:
    font = instantiateVariableFont(font, {'wght': 400}, inplace=False)
glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
scale = 100 / font['head'].unitsPerEm
x, paths = 10, []
for char in 'TOMÁS AVELAR':
    glyph = glyphs[cmap[ord(char)]]
    pen = SVGPathPen(glyphs, ntos=lambda n: str(round(n, 2)))
    glyph.draw(TransformPen(pen, (scale, 0, 0, -scale, x, 105)))
    if pen.getCommands():
        paths.append(pen.getCommands())
    x += glyph.width * scale + 4
print(json.dumps({'viewBox': f'0 0 {round(x+6,2)} 125', 'paths': paths}))
