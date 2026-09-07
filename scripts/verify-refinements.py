"""Integrated UI checks and a local-machine frame-time sample.

MOTION_TEST_URL may point at `next start` for a production measurement.
CPU throttling and mobile emulation are explicitly not physical phone tests.
"""
import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('MOTION_TEST_URL', 'http://127.0.0.1:3000')
OUT = Path('artifacts/refinements')
OUT.mkdir(parents=True, exist_ok=True)
expect.set_options(timeout=30000)

FRAME_SAMPLE = """async ({duration, mixed}) => {
  const samples = [], tasks = [], stages = {};
  let last, start;
  const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(e => e.duration)));
  observer.observe({type: 'longtask'});
  await new Promise(resolve => {
    function tick(now) {
      const delta = last === undefined ? 0 : now-last;
      if (start === undefined) { start = now; last = now; }
      else { samples.push(now-last); last = now; }
      if (mixed) {
        window.dispatchEvent(new WheelEvent('wheel', {deltaY: delta * 1.2, bubbles: true, cancelable: true}));
        const x = innerWidth * (.3 + .12 * Math.sin((now-start)/350));
        const y = innerHeight * .58;
        const target = document.elementFromPoint(x,y);
        const section = target?.closest('section');
        const name = section?.id || section?.classList[0] || 'footer';
        if (delta > 0) (stages[name] ||= []).push(delta);
        target?.dispatchEvent(new PointerEvent('pointermove', {
          clientX:x, clientY:y, pointerType:'mouse', bubbles:true
        }));
      }
      if (now-start < duration) requestAnimationFrame(tick); else resolve();
    }
    requestAnimationFrame(tick);
  });
  observer.disconnect();
  const sorted = [...samples].sort((a,b)=>a-b);
  const p = n => sorted[Math.min(sorted.length-1, Math.floor(sorted.length*n))];
  return {frames:samples.length, median_ms:p(.5), p95_ms:p(.95), p99_ms:p(.99),
    average_fps:1000/(samples.reduce((a,b)=>a+b,0)/samples.length),
    frames_over_16_7_ms:samples.filter(n=>n>16.8).length,
    frames_over_33_ms:samples.filter(n=>n>33.4).length,
    long_tasks_ms:tasks, scrollY, stages:Object.fromEntries(Object.entries(stages).map(([name, values])=> {
      const ordered = values.sort((a,b)=>a-b);
      return [name, {frames:values.length, p95_ms:ordered[Math.floor(ordered.length*.95)]}];
    }))};
}"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 960}, reduced_motion='no-preference')
    context.set_default_timeout(120000)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
    page.goto(BASE, wait_until='domcontentloaded', timeout=300000)
    expect(page.locator('html')).to_have_class(re.compile('.*lenis.*'))
    page.wait_for_function("document.fonts.status === 'loaded'")
    page.wait_for_timeout(1200)
    assert page.locator('.hero').bounding_box()['y'] == 0
    print('Home ready', flush=True)

    page.evaluate("document.querySelector('#selecao').scrollIntoView()")
    cards = page.locator('#selecao .property-card')
    expect(cards).to_have_count(3)
    page.wait_for_timeout(1400)
    delays = cards.evaluate_all("cards => cards.map(c=>Number(c.dataset.revealDelay))")
    assert len(set(delays)) > 1, f'No perceptible sequence: {delays}'
    frames = page.locator('#selecao .property-image').evaluate_all("els => els.map(el=>({ratio:el.clientWidth/el.clientHeight, position:getComputedStyle(el.querySelector('img')).objectPosition, fit:getComputedStyle(el.querySelector('img')).objectFit}))")
    assert all(abs(frame['ratio']-4/5)<.02 and frame['fit']=='cover' for frame in frames), frames
    card = cards.first
    box = card.bounding_box()
    page.mouse.move(box['x']+box['width']*.75, box['y']+box['height']*.3)
    page.wait_for_timeout(600)
    tilt = card.locator('.property-card-depth').evaluate('el=>getComputedStyle(el).transform')
    assert tilt != 'none' and tilt.startswith('matrix3d'), tilt
    assert card.locator('.card-media').evaluate('el=>new DOMMatrix(getComputedStyle(el).transform).a') > 1.01
    assert page.locator('html').get_attribute('data-custom-cursor') == 'true'
    page.screenshot(path=str(OUT/'cards-desktop.png'), caret='initial', timeout=120000)
    card.get_by_role('button').click()
    expect(page.get_by_role('dialog')).to_be_visible()
    page.keyboard.press('Escape')
    assert page.locator('html').get_attribute('data-custom-cursor') is None
    print('Tilt, zoom, stagger, crop and keyboard cursor fallback: OK', flush=True)

    page.evaluate("""() => {
      window.countSamples = [];
      window.counterObserver = new MutationObserver(() => window.countSamples.push(
        [...document.querySelectorAll('[data-count-value]')].map(el=>el.textContent)));
      window.counterObserver.observe(document.querySelector('#sobre'), {subtree:true, childList:true});
      document.querySelector('#sobre').scrollIntoView();
    }""")
    page.wait_for_timeout(1700)
    counts = page.evaluate('window.counterObserver.disconnect(); window.countSamples')
    assert any(0 < int(sample[1]) < 140 for sample in counts), counts
    expect(page.locator('[data-count-value="12"]')).to_have_text('12')
    expect(page.locator('[data-count-value="140"]')).to_have_text('140')
    assert page.locator('.depth-mask').evaluate('el=>new DOMMatrix(getComputedStyle(el).transform).m42') == 0
    page.screenshot(path=str(OUT/'advisor-desktop.png'), caret='initial', timeout=120000)

    button = page.locator('.search-submit')
    button.scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    box = button.bounding_box()
    page.mouse.move(box['x']+box['width']*.8, box['y']+box['height']*.65, steps=8)
    page.wait_for_timeout(400)
    assert button.evaluate('el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41)') > 1
    page.keyboard.press('Tab')
    assert button.evaluate('el=>getComputedStyle(el).transform') == 'none'
    missing = page.locator('a').evaluate_all("""links=>links.filter(link=> {
      return ![link, ...link.querySelectorAll('.header-ink-dark')].some(
        el=>getComputedStyle(el, '::after').content !== 'none');
    }).map(link=>link.textContent)""")
    assert not missing, missing
    print('Counters, photo mask, magnetism and all link underlines: OK', flush=True)

    page.get_by_role('navigation', name='Navegação principal').get_by_role('link', name='Imóveis', exact=True).click()
    expect(page.locator('.route-veil')).to_be_visible()
    page.wait_for_url('**/imoveis', wait_until='domcontentloaded', timeout=300000)
    expect(page.locator('.route-veil')).to_have_count(0)
    expect(page.locator('.site-header')).to_have_attribute('data-hero-header', 'false')
    page.get_by_label('Seu próximo passo').select_option('RENT')
    page.get_by_role('button', name='Ver imóveis').click()
    page.wait_for_url('**/imoveis?**', wait_until='domcontentloaded', timeout=120000)
    expect(page.locator('#catalogo article')).to_have_count(2)
    expect(page.locator('.route-veil')).to_have_count(0)
    page.get_by_role('link', name='Voltar à home').click()
    page.wait_for_url(BASE+'/', wait_until='domcontentloaded', timeout=120000)
    expect(page.locator('.route-veil')).to_have_count(0)
    page.go_back(wait_until='domcontentloaded')
    expect(page.locator('.site-header')).to_have_attribute('data-hero-header', 'false')
    expect(page.locator('.route-veil')).to_have_count(0)
    page.go_forward(wait_until='domcontentloaded')
    expect(page.locator('.site-header')).to_have_attribute('data-hero-header', 'true')
    expect(page.locator('.route-veil')).to_have_count(0)
    print('Route transitions, query filters, back and forward: OK', flush=True)

    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    page.wait_for_timeout(1000)
    for offset in range(0, page.evaluate('document.documentElement.scrollHeight'), 700):
        page.evaluate("y=>scrollTo({top:y,behavior:'instant'})", offset)
        page.wait_for_timeout(160)
    # Explicitly visit/decode lazy media before the full-page visual artifact.
    for card in page.locator('.property-card').all():
        card.scroll_into_view_if_needed()
        card.locator('img').evaluate("img => img.decode()")
        page.wait_for_timeout(1100)
    page.locator('.advisor-photo').scroll_into_view_if_needed()
    page.locator('.advisor-photo img').evaluate("img => img.decode()")
    page.wait_for_function("new DOMMatrix(getComputedStyle(document.querySelector('.depth-mask')).transform).m42 === 0")
    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    page.screenshot(path=str(OUT/'home-complete.png'), full_page=True, caret='initial', timeout=120000)
    page.reload(wait_until='domcontentloaded', timeout=120000)
    expect(page.locator('html')).to_have_class(re.compile('.*lenis.*'))
    page.wait_for_timeout(1200)
    session = context.new_cdp_session(page)
    gpu = page.evaluate("""() => {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unavailable';
    }""")
    idle = page.evaluate(FRAME_SAMPLE, {'duration': 2200, 'mixed': False})
    combined = page.evaluate(FRAME_SAMPLE, {'duration': 5500, 'mixed': True})
    session.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    stress = page.evaluate(FRAME_SAMPLE, {'duration': 5500, 'mixed': True})
    session.send('Emulation.setCPUThrottlingRate', {'rate': 1})
    gpu_info = browser.new_browser_cdp_session().send('SystemInfo.getInfo')['gpu']
    performance = {'url':BASE, 'browser':browser.version, 'mode':'headless, real local CPU; presentation to a physical 120Hz display not measured',
                   'gpu_features':gpu_info.get('featureStatus'),
                   'renderer':gpu, 'idle':idle, 'integrated_motion':combined, 'cpu_4x_simulation':stress}
    (OUT/'performance.json').write_text(json.dumps(performance, indent=2), encoding='utf-8')
    print(json.dumps(performance, indent=2), flush=True)
    context.close()

    mobile = browser.new_context(**p.devices['iPhone 13'], reduced_motion='reduce')
    mobile.set_default_timeout(120000)
    small = mobile.new_page()
    small.on('pageerror', lambda error: errors.append(str(error)))
    small.goto(BASE, wait_until='domcontentloaded', timeout=120000)
    expect(small.get_by_role('heading', level=1)).to_be_visible()
    small.evaluate("document.querySelector('#selecao').scrollIntoView()")
    small.wait_for_timeout(1000)
    assert small.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert small.locator('.property-card-depth').first.evaluate('el=>getComputedStyle(el).transform') == 'none'
    assert small.locator('.site-cursor').evaluate('el=>getComputedStyle(el).display') == 'none'
    assert all(float(v)==1 for v in small.locator('.property-card').evaluate_all('els=>els.map(el=>getComputedStyle(el).opacity)'))
    small.locator('.property-card').first.locator('img').evaluate("img => img.decode()")
    small.screenshot(path=str(OUT/'cards-mobile-reduced.png'), caret='initial', timeout=120000)
    small.evaluate("document.querySelector('#sobre').scrollIntoView()")
    expect(small.locator('[data-count-value="140"]')).to_have_text('140')
    assert small.locator('.depth-mask').evaluate('el=>getComputedStyle(el).transform') == 'none'
    small.get_by_role('button', name='Abrir menu').click()
    small.get_by_role('dialog', name='Menu principal').get_by_role('link', name='Imóveis', exact=True).click()
    small.wait_for_url('**/imoveis', wait_until='domcontentloaded', timeout=120000)
    expect(small.locator('.route-veil')).to_have_count(0)
    mobile.close()
    assert not errors, errors
    (OUT/'checks.json').write_text(json.dumps({'status':'passed','delays':delays,'frames':frames,'browser_errors':errors}, indent=2), encoding='utf-8')
    print('Mobile / reduced motion: OK. Browser errors: 0', flush=True)
    browser.close()
