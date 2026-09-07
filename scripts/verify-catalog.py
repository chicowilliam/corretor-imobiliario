"""Smoke checks for the Phase 2 catalog route."""
from playwright.sync_api import sync_playwright, expect

BASE = 'http://localhost:3000'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f'{BASE}/imoveis', wait_until='networkidle', timeout=120000)
    expect(page.get_by_role('heading', level=1)).to_contain_text('ritmo.')
    expect(page.locator('#catalogo article')).to_have_count(5)
    page.get_by_label('Seu próximo passo').select_option('RENT')
    page.get_by_role('button', name='Ver imóveis').click()
    page.wait_for_url('**/imoveis?**purpose=RENT**', timeout=60000)
    expect(page.locator('#catalogo article')).to_have_count(2)
    page.get_by_label('Onde você quer viver').select_option('area-jardins')
    page.get_by_role('button', name='Ver imóveis').click()
    expect(page.get_by_role('heading', name='Vamos ampliar o olhar?')).to_be_visible(timeout=60000)
    page.get_by_role('link', name='Limpar filtros e ver o catálogo').click()
    expect(page.locator('#catalogo article')).to_have_count(5)
    page.get_by_role('button', name='Conhecer Casa entre jardins').first.click()
    expect(page.get_by_role('dialog', name='Casa entre jardins')).to_be_visible()
    page.keyboard.press('Escape')
    print('Catalog filters, empty state and preview: OK', flush=True)
    browser.close()
