"""Focused fallback and visual checks, with bounded image waits."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("MOTION_TEST_URL", "http://127.0.0.1:3001")
OUT = Path("artifacts/cinematic")
OUT.mkdir(parents=True, exist_ok=True)
expect.set_options(timeout=30000)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=False)
    context = browser.new_context(viewport={"width":1440,"height":960}, reduced_motion="no-preference")
    page = context.new_page()
    page.set_default_timeout(30000)
    errors = []
    page.on("pageerror",lambda error:errors.append(str(error)))
    context.route("**/*.mp4*",lambda route:route.abort())
    page.goto(BASE,wait_until="domcontentloaded",timeout=120000)
    page.wait_for_timeout(6500)
    expect(page.locator("#home-title")).to_be_visible()
    expect(page.locator(".hero-opening")).not_to_be_visible()
    assert page.locator(".hero-poster").evaluate("img=>img.complete && img.naturalWidth>0")
    print("Failed video: poster and content visible",flush=True)
    for index,section in enumerate(page.locator("main section").all()):
        print("Visit section",index,section.get_attribute("id"),flush=True)
        section.scroll_into_view_if_needed()
        page.wait_for_timeout(1200)
    print("Decoding photographs",flush=True)
    for selector in [".property-card img",".advisor-photo img"]:
        for img in page.locator(selector).all():
            print("Photo",selector,img.get_attribute("alt"),flush=True)
            img.scroll_into_view_if_needed()
            try:
                page.wait_for_function("(src)=>[...document.images].some(img=>img.getAttribute('src')===src && img.complete && img.naturalWidth>0)",arg=img.get_attribute("src"),timeout=30000)
            except Exception:
                print("Photo failure",img.evaluate("img=>({complete:img.complete,width:img.naturalWidth,src:img.src,current:img.currentSrc,loading:img.loading,box:img.getBoundingClientRect().toJSON(),mask:document.querySelector('.depth-mask')?.getAttribute('style')})"),flush=True)
                page.screenshot(path=str(OUT/"photo-diagnostic.png"),timeout=60000)
                raise
            img.evaluate("img=>Promise.race([img.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,3000))])")
            page.wait_for_timeout(1200)
    expect(page.locator('[data-count-value="12"]')).to_have_text("12")
    expect(page.locator('[data-count-value="140"]')).to_have_text("140")
    page.wait_for_function("['.depth-mask','.depth-image'].every(s=>new DOMMatrix(getComputedStyle(document.querySelector(s)).transform).m42===0)")
    page.screenshot(path=str(OUT/"advisor-desktop.png"),timeout=60000)
    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    page.wait_for_timeout(800)
    page.screenshot(path=str(OUT/"home-complete.png"),full_page=True,timeout=60000)
    print("Full Home, counters and photo mask: OK",flush=True)
    context.close()

    for reduced in ["no-preference","reduce"]:
        context = browser.new_context(**p.devices["iPhone 13"],reduced_motion=reduced)
        small = context.new_page()
        small.on("pageerror",lambda error:errors.append(str(error)))
        small.goto(BASE,wait_until="domcontentloaded",timeout=120000)
        small.wait_for_timeout(6500)
        expect(small.locator("#home-title")).to_be_visible()
        expect(small.locator(".hero-opening")).not_to_be_visible()
        assert small.evaluate("document.documentElement.scrollWidth<=innerWidth")
        small.screenshot(path=str(OUT/("hero-mobile-"+reduced+".png")),timeout=60000)
        small.locator("#selecao").scroll_into_view_if_needed()
        small.wait_for_timeout(1500)
        assert small.locator(".property-card").first.evaluate("el=>getComputedStyle(el).opacity")=="1"
        if reduced=="reduce":
            assert small.locator(".property-card-depth").first.evaluate("el=>getComputedStyle(el).transform")=="none"
            assert small.locator(".hero-focus-layer").evaluate("el=>getComputedStyle(el).filter")=="none"
        small.screenshot(path=str(OUT/("cards-mobile-"+reduced+".png")),timeout=60000)
        small.get_by_role("button",name="Abrir menu",exact=True).click()
        small.get_by_role("dialog",name="Menu principal").get_by_role("link",name="Imóveis",exact=True).click()
        small.wait_for_url("**/imoveis",timeout=60000)
        expect(small.locator(".route-veil")).to_have_count(0)
        print("Mobile",reduced,": OK",flush=True)
        context.close()
    context = browser.new_context(java_script_enabled=False,viewport={"width":390,"height":844})
    plain = context.new_page()
    plain.goto(BASE,wait_until="domcontentloaded",timeout=120000)
    expect(plain.locator("#home-title")).to_be_visible()
    expect(plain.locator(".hero-opening")).not_to_be_visible()
    assert not errors,errors
    context.close()
    browser.close()
    (OUT/"fallback-checks.json").write_text(json.dumps({"status":"passed","javascript_errors":errors,"mobile":"iPhone 13 emulation, both motion preferences","no_javascript":"passed","failed_video":"passed","full_home":"passed"},indent=2),encoding="utf-8")
    print("No JS fallback: OK. JavaScript errors:",errors,flush=True)
