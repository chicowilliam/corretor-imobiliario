"""Production-browser regression checks for the cinematic sequence.

Uses the existing Playwright tooling; mobile is emulation, not a physical phone.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("MOTION_TEST_URL", "http://127.0.0.1:3001")
OUT = Path("artifacts/cinematic")
OUT.mkdir(parents=True, exist_ok=True)
expect.set_options(timeout=30000)

PHASES = """(() => {
 window.openingPhases = [];
 new MutationObserver(records => {
   for (const r of records) if (r.attributeName === 'data-opening-phase') {
     const phase = r.oldValue;
     if (!phase) continue;
     if (window.openingPhases.at(-1)?.phase !== phase)
       window.openingPhases.push({phase, time:performance.now()});
   }
 }).observe(document, {subtree:true, attributes:true, attributeOldValue:true, attributeFilter:['data-opening-phase']});
})()"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=False)
    context = browser.new_context(viewport={"width":1440,"height":960})
    context.set_default_timeout(60000)
    context.add_init_script(PHASES)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until="domcontentloaded", timeout=180000)
    page.wait_for_function("['complete','fallback'].includes(document.querySelector('.hero')?.dataset.openingPhase)")
    phases = page.evaluate("[...window.openingPhases,{phase:document.querySelector('.hero').dataset.openingPhase,time:performance.now()}]")
    if phases[-1]["phase"] == "fallback":
        print("Cold entry fallback", phases, errors, flush=True)
        page.wait_for_timeout(5000)
        page.reload(wait_until="domcontentloaded")
        page.wait_for_function("['complete','fallback'].includes(document.querySelector('.hero')?.dataset.openingPhase)")
        phases = page.evaluate("[...window.openingPhases,{phase:document.querySelector('.hero').dataset.openingPhase,time:performance.now()}]")
    assert phases[-1]["phase"] == "complete", (phases, errors)
    sequence = [item["phase"] for item in phases]
    assert all(item in sequence for item in ["drawing","focus","headline","support","cta"]), sequence
    assert sequence.index("focus") < sequence.index("headline") < sequence.index("cta"), sequence
    expect(page.locator("#home-title")).to_be_visible()
    expect(page.locator(".hero-opening")).not_to_be_visible()
    assert page.locator("[data-wordmark-path]").count() == 11
    assert page.locator(".hero-split-line").count() == 0, "SplitText must restore original markup"
    page.screenshot(path=str(OUT/"hero-desktop.png"))
    page.mouse.move(1100, 450)
    page.wait_for_timeout(800)
    assert page.locator(".hero-pointer-layer").evaluate("el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41)") > 0
    print("Opening sequence and cursor parallax: OK", flush=True)

    # User action effects: default facts stay legible, hover owns inner transforms.
    card = page.locator("#selecao .property-card").first
    card.scroll_into_view_if_needed()
    page.wait_for_timeout(1500)
    ratios = page.locator(".property-image").evaluate_all("els=>els.map(el=>({ratio:el.clientWidth/el.clientHeight,fit:getComputedStyle(el.querySelector('img')).objectFit,position:getComputedStyle(el.querySelector('img')).objectPosition}))")
    assert all(abs(item["ratio"]-.8)<.02 and item["fit"]=="cover" for item in ratios), ratios
    facts = card.locator(".property-facts > div")
    assert all(v=="1" for v in facts.evaluate_all("els=>els.map(el=>getComputedStyle(el).opacity)"))
    card.evaluate("""el=>{
      window.factChanges=[];
      window.factObserver=new MutationObserver(()=>window.factChanges.push(
        [...el.querySelectorAll('.property-facts > div,.property-price')].map(x=>getComputedStyle(x).opacity)));
      window.factObserver.observe(el,{attributes:true,subtree:true,attributeFilter:['style']});
    }""")
    box = card.bounding_box()
    page.mouse.move(box["x"]+box["width"]*.7, box["y"]+100)
    page.wait_for_timeout(1200)
    samples = page.evaluate("window.factObserver.disconnect(); window.factChanges")
    assert any(len(set(sample))>1 for sample in samples), "No cascade detected"
    assert card.locator(".property-card-depth").evaluate("el=>getComputedStyle(el).transform").startswith("matrix3d")
    page.mouse.move(5, 5)
    page.wait_for_timeout(400)
    assert all(v=="1" for v in facts.evaluate_all("els=>els.map(el=>getComputedStyle(el).opacity)"))
    assert page.locator("a").evaluate_all("els=>els.every(el=>el.querySelector('.draw-underline'))")
    link = page.get_by_role("link", name="Ver o catálogo", exact=True)
    link.hover()
    expect(link).to_have_attribute("data-draw-enhanced","")
    assert link.locator(".draw-underline path").get_attribute("style")
    button = page.locator(".search-submit")
    button.hover()
    expect(button.locator(".button-content")).to_have_attribute("data-expanded","")
    page.wait_for_timeout(350)
    assert button.locator(".button-icon").evaluate("el=>getComputedStyle(el).justifySelf") == "end"
    page.keyboard.press("Tab")
    expect(button.locator(".button-content")).not_to_have_attribute("data-expanded","")
    print("Card cascade, framing, DrawSVG links and Flip buttons: OK", flush=True)

    page.get_by_role("navigation",name="Navegação principal").get_by_role("link",name="Imóveis",exact=True).click()
    page.wait_for_url("**/imoveis")
    expect(page.locator(".route-veil")).to_have_count(0)
    expect(page.locator(".site-header")).to_have_attribute("data-hero-header","false")
    page.get_by_role("link",name="Voltar à home",exact=True).click()
    page.wait_for_url(BASE+"/")
    page.wait_for_timeout(6000)
    expect(page.locator("#home-title")).to_be_visible()
    expect(page.locator(".hero-opening")).not_to_be_visible()

    # Changing the preference during entry cannot leave hidden text behind.
    page.reload(wait_until="domcontentloaded")
    page.emulate_media(reduced_motion="reduce")
    expect(page.locator("#home-title")).to_be_visible()
    expect(page.locator(".hero-opening")).not_to_be_visible()
    assert page.locator(".hero-focus-layer").evaluate("el=>getComputedStyle(el).filter") == "none"
    page.emulate_media(reduced_motion="no-preference")
    page.reload(wait_until="domcontentloaded")
    page.keyboard.press("Tab")
    expect(page.locator("#home-title")).to_be_visible()
    expect(page.locator(".hero-opening")).not_to_be_visible()
    print("Routes, keyboard escape and preference changes: OK", flush=True)

    context.close()
    browser.close()
    assert not errors, errors
    (OUT/"checks.json").write_text(json.dumps({"status":"passed","phases":phases,"frames":ratios,"browser_errors":errors},indent=2),encoding="utf-8")
    print("Cinematic interactions: OK. Run verify-cinematic-fallbacks.py for visual/mobile/fallback checks.",flush=True)
