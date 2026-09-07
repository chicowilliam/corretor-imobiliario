"""Browser regression checks for the Navbar + Hero motion delivery.

Run against `npm run dev` or `npm start`: python scripts/verify-motion.py
Uses the existing Python Playwright tooling; adds no application dependency.
"""
import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("MOTION_TEST_URL", "http://127.0.0.1:3000")
ARTIFACTS = Path("artifacts/motion")
ARTIFACTS.mkdir(parents=True, exist_ok=True)
expect.set_options(timeout=30000)


def settled(page):
    expect(page.locator(".hero-title")).to_be_visible()
    page.wait_for_function("document.fonts.status === 'loaded'")
    page.wait_for_timeout(1300)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    desktop = browser.new_context(viewport={"width": 1440, "height": 960}, device_scale_factor=1, reduced_motion="no-preference")
    page = desktop.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    print("Opening Home", flush=True)
    page.goto(BASE, wait_until="domcontentloaded", timeout=300000)
    settled(page)
    print({"reduced": page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"), "errors": errors}, flush=True)
    expect(page.locator("html")).to_have_class(re.compile(r".*lenis.*"))
    expect(page.get_by_role("heading", level=1)).to_contain_text("Lugares que")
    assert page.locator(".hero").bounding_box()["y"] == 0, "Header must overlay hero"
    assert page.get_by_role("navigation", name="Navegação principal").get_by_role("link").count() == 5
    page.screenshot(path=str(ARTIFACTS / "desktop-hero.png"), caret="initial")
    print("Home hydrated; checking scroll interpolation", flush=True)

    opacities = []
    for position in (0, 24, 48, 72, 96, 160):
        page.evaluate("y => window.scrollTo({ top: y, behavior: 'instant' })", position)
        page.wait_for_timeout(160)
        opacities.append(float(page.locator(".header-glass").evaluate("el => getComputedStyle(el).opacity")))
    assert opacities[0] < .01 and opacities[-1] > .99, opacities
    assert all(a < b for a, b in zip(opacities[:4], opacities[1:5])), opacities
    assert .2 < opacities[2] < .8, "Transition must interpolate, not switch"
    page.screenshot(path=str(ARTIFACTS / "desktop-scrolled.png"), caret="initial")
    assert page.locator("[data-hero-media]").evaluate("el => new DOMMatrix(getComputedStyle(el).transform).m42") > 0

    page.get_by_role("button", name="Vamos conversar", exact=True).first.click()
    expect(page.get_by_role("dialog", name="Vamos conversar")).to_be_visible()
    page.wait_for_timeout(100)
    assert "lenis-stopped" in page.locator("html").get_attribute("class")
    before = page.evaluate("window.scrollY")
    page.mouse.wheel(0, 600)
    page.wait_for_timeout(250)
    assert page.evaluate("window.scrollY") == before, "Modal must lock background scroll"
    page.keyboard.press("Escape")
    expect(page.get_by_role("button", name="Vamos conversar", exact=True).first).to_be_focused()
    print("Navbar, parallax and modal scroll lock: OK", flush=True)

    page.get_by_role("navigation", name="Navegação principal").get_by_role("link", name="Imóveis", exact=True).click()
    page.wait_for_url("**/imoveis", wait_until="domcontentloaded", timeout=300000)
    page.wait_for_timeout(300)
    expect(page.locator(".site-header")).to_have_attribute("data-hero-header", "false")
    assert float(page.locator(".header-glass").evaluate("el => getComputedStyle(el).opacity")) == 1
    assert page.locator(".header-spacer").count() == 1
    page.go_back(wait_until="domcontentloaded")
    settled(page)
    expect(page.locator(".site-header")).to_have_attribute("data-hero-header", "true")
    page.get_by_role("navigation", name="Navegação principal").get_by_role("link", name="Meu olhar").click()
    page.wait_for_timeout(1800)
    about_top = page.locator("#sobre").bounding_box()["y"]
    assert 95 <= about_top < 180, f"Anchor hidden by header: {about_top}"

    page.evaluate("window.scrollTo({ top: 0, behavior: 'instant' })")
    page.emulate_media(reduced_motion="reduce")
    expect(page.locator("html")).not_to_have_class(re.compile(r".*lenis.*"))
    assert page.locator("[data-hero-media]").evaluate("el => getComputedStyle(el).transform") == "none"
    assert page.locator(".hero-video").get_attribute("src") is None
    page.emulate_media(reduced_motion="no-preference")
    expect(page.locator("html")).to_have_class(re.compile(r".*lenis.*"))
    print("Routes, anchors and live reduced-motion preference: OK", flush=True)
    desktop.close()

    # A failed film must never remove or cover the loaded still image.
    fallback = browser.new_context(viewport={"width": 1440, "height": 960}, reduced_motion="no-preference")
    fallback.route("**/*.mp4", lambda route: route.abort())
    static = fallback.new_page()
    static.on("pageerror", lambda error: errors.append(str(error)))
    static.goto(BASE, wait_until="domcontentloaded", timeout=120000)
    settled(static)
    static.wait_for_function("document.querySelector('.hero-poster').naturalWidth > 0")
    expect(static.locator(".hero-video")).to_have_attribute("data-playing", "false")
    assert float(static.locator(".hero-video").evaluate("el => getComputedStyle(el).opacity")) == 0
    static.screenshot(path=str(ARTIFACTS / "video-fallback.png"), caret="initial", timeout=120000)
    print("Blocked-video poster fallback: OK", flush=True)
    fallback.close()

    mobile = browser.new_context(**playwright.devices["iPhone 13"], reduced_motion="reduce")
    small = mobile.new_page()
    small.on("pageerror", lambda error: errors.append(str(error)))
    small.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    small.goto(BASE, wait_until="domcontentloaded", timeout=120000)
    settled(small)
    assert small.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Mobile horizontal overflow"
    assert small.locator(".hero-title").bounding_box()["y"] > 80
    assert "lenis" not in small.locator("html").get_attribute("class")
    assert small.locator(".hero-video").get_attribute("src") is None
    small.screenshot(path=str(ARTIFACTS / "mobile-reduced-motion.png"), caret="initial", timeout=120000)
    small.set_viewport_size({"width": 320, "height": 700})
    assert small.evaluate("document.documentElement.scrollWidth <= innerWidth"), "320px horizontal overflow"
    small.set_viewport_size({"width": 390, "height": 844})
    small.get_by_role("button", name="Abrir menu").click()
    menu = small.get_by_role("dialog", name="Menu principal")
    expect(menu).to_be_visible()
    small.keyboard.press("Escape")
    expect(small.get_by_role("button", name="Abrir menu")).to_be_focused()
    small.get_by_role("button", name="Abrir menu").click()
    menu.get_by_role("link", name="Imóveis", exact=True).click()
    small.wait_for_url("**/imoveis", wait_until="domcontentloaded", timeout=300000)
    expect(menu).not_to_be_visible()
    expect(small.locator(".site-header")).to_have_attribute("data-hero-header", "false")
    mobile.close()

    # Progressive enhancement: the title and poster exist without client JavaScript.
    native = browser.new_context(java_script_enabled=False, viewport={"width": 1440, "height": 960})
    plain = native.new_page()
    plain.goto(BASE, wait_until="domcontentloaded", timeout=120000)
    expect(plain.get_by_role("heading", level=1)).to_be_visible()
    expect(plain.locator(".hero-poster")).to_be_visible()
    assert not errors, errors
    report = {"navbar_opacities": opacities, "anchor_top": about_top, "page_errors": errors, "checks": "desktop, mobile, navigation, modal lock, anchor, reduced motion, blocked video, no JavaScript"}
    (ARTIFACTS / "checks.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2), flush=True)
    browser.close()
