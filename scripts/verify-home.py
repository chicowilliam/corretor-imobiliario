"""Browser verification, using the environment's Python Playwright installation."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / 'artifacts'
ARTIFACTS.mkdir(exist_ok=True)
BASE = 'http://localhost:3000'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until='networkidle', timeout=120000)
    expect(page.get_by_role('heading', level=1)).to_contain_text('sentido.')
    expect(page.locator('#selecao article')).to_have_count(3)
    expect(page.locator('.hero-video')).not_to_have_attribute('src')
    assert page.locator('.hero-poster').evaluate('(img) => img.complete && img.naturalWidth > 0')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(ARTIFACTS / 'home-desktop.png'), full_page=True)
    print('Desktop, poster and reduced motion: OK', flush=True)

    page.get_by_label('Seu próximo passo').select_option('RENT')
    page.get_by_role('button', name='Encontrar meu lugar').click()
    page.wait_for_url('**purpose=RENT**', timeout=60000)
    expect(page.locator('#selecao article')).to_have_count(2)
    page.get_by_label('Onde você quer viver').select_option('area-jardins')
    page.get_by_role('button', name='Encontrar meu lugar').click()
    expect(page.get_by_role('heading', name='Vamos ampliar o olhar?')).to_be_visible(timeout=60000)
    page.get_by_role('link', name='Limpar busca e ver a seleção').click()
    expect(page.locator('#selecao article')).to_have_count(5)
    print('Search, empty state and recovery: OK', flush=True)

    page.get_by_role('button', name='Conhecer Casa entre jardins').first.click()
    dialog = page.get_by_role('dialog', name='Casa entre jardins')
    expect(dialog).to_be_visible()
    dialog.get_by_role('button', name='Conversar sobre este imóvel').click()
    expect(dialog.get_by_role('textbox', name='Sua mensagem')).to_have_value('Olá, Tomás! Tenho interesse no imóvel “Casa entre jardins” (TA-001), em Jardim Europa. Gostaria de conversar sobre uma visita.')
    expect(dialog.get_by_text('nenhum contato será enviado.', exact=False)).to_be_visible()
    page.keyboard.press('Escape')
    expect(dialog).not_to_be_visible()
    print('Property preview, contextual message and Escape: OK', flush=True)

    page.get_by_role('button', name='Próximo depoimento').click()
    expect(page.get_by_text('Helena M.')).to_be_visible()
    page.get_by_role('button', name='Depoimento anterior').click()
    expect(page.get_by_text('Marina & André')).to_be_visible()
    print('Testimonial controls: OK', flush=True)

    page.get_by_role('button', name='Conhecer Entre o concreto e a natureza').click()
    expect(page.get_by_role('dialog').get_by_text('Valor sob consulta')).to_be_visible()
    page.keyboard.press('Escape')

    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(BASE, wait_until='networkidle')
    page.get_by_role('button', name='Abrir menu').click()
    expect(page.get_by_role('dialog', name='Menu principal')).to_be_visible()
    page.get_by_role('dialog', name='Menu principal').get_by_role('link', name='Meu olhar').click()
    expect(page.get_by_role('dialog', name='Menu principal')).not_to_be_visible()
    assert page.evaluate('document.body.style.overflow') == ''
    page.goto(BASE, wait_until='networkidle')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(ARTIFACTS / 'home-mobile.png'), full_page=True)
    page.set_viewport_size({'width': 320, 'height': 740})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(ARTIFACTS / 'home-mobile-320.png'), full_page=True)
    print('Mobile menu, 390px and 320px overflow: OK', flush=True)

    failed_video = browser.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='no-preference')
    failed_video.route('**/*.mp4', lambda route: route.abort())
    fallback = failed_video.new_page()
    fallback.goto(BASE, wait_until='networkidle')
    expect(fallback.locator('.hero-video')).to_have_attribute('data-playing', 'false')
    assert fallback.locator('.hero-poster').evaluate('(img) => img.complete && img.naturalWidth > 0')
    fallback.screenshot(path=str(ARTIFACTS / 'hero-video-fallback.png'))
    print('Video network failure fallback: OK', flush=True)
    failed_video.close()

    static_context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    static_page = static_context.new_page()
    static_page.goto(BASE, wait_until='networkidle')
    expect(static_page.get_by_role('heading', level=1)).to_be_visible()
    assert static_page.locator('.hero-poster').evaluate('(img) => img.complete && img.naturalWidth > 0')
    print('No-JavaScript hero fallback: OK', flush=True)
    static_context.close()
    (ARTIFACTS / 'browser-errors.json').write_text(json.dumps(errors, indent=2), encoding='utf-8')
    assert not errors, errors
    context.close()
    browser.close()
    print('Browser checks passed.', flush=True)
