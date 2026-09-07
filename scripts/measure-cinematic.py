"""Short integrated sample in a real local Chrome window, without CPU emulation."""
import ast
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get("MOTION_TEST_URL", "http://127.0.0.1:3001")
OUT = Path("artifacts/cinematic")
OUT.mkdir(parents=True, exist_ok=True)
# Reuse the established sampler without executing that script's UI suite.
tree = ast.parse(Path("scripts/verify-refinements.py").read_text(encoding="utf-8"))
sample = next(ast.literal_eval(node.value) for node in tree.body
              if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == "FRAME_SAMPLE" for t in node.targets))
sample = sample.replace("let last, start;", "let last, start, lastCard;").replace(".3 + .12", ".5 + .4")
sample = sample.replace("const section = target?.closest('section');", """const card = target?.closest('.property-card');
        if (card !== lastCard) {
          lastCard?.dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'}));
          card?.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));
          lastCard = card;
        }
        const section = target?.closest('section');""")
with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=False)
    context = browser.new_context(viewport={"width":1280,"height":720})
    page = context.new_page()
    page.goto(BASE,wait_until="domcontentloaded",timeout=180000)
    page.wait_for_timeout(7000)
    idle = page.evaluate(sample,{"duration":3000,"mixed":False})
    integrated = page.evaluate(sample,{"duration":6500,"mixed":True})
    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    page.wait_for_function("!document.querySelector('.hero').hasAttribute('data-opening')",timeout=30000)
    page.wait_for_timeout(3000)
    settled_state = page.evaluate("""() => ({
      opening:document.querySelector('.hero').dataset.openingPhase,
      focusFilter:getComputedStyle(document.querySelector('.hero-focus-layer')).filter,
      videoReady:document.querySelector('video')?.readyState,
      videoPlaying:document.querySelector('video')?.paused === false,
      visibility:document.visibilityState
    })""")
    warm_idle = page.evaluate(sample,{"duration":3000,"mixed":False})
    warm_integrated = page.evaluate(sample,{"duration":6500,"mixed":True})
    gpu = browser.new_browser_cdp_session().send("SystemInfo.getInfo")["gpu"]
    report = {"browser":browser.version,"url":BASE,
              "method":"Local Chrome window, real local CPU/GPU, no throttling; RAF callback intervals, not externally measured displayed frames.",
              "viewport":"1280x720","gpu":gpu,"idle":idle,"integrated":integrated,
              "settled_state":settled_state,"warm_idle":warm_idle,"warm_integrated":warm_integrated}
    (OUT/"performance.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps({"idle":idle,"integrated":integrated,"settled_state":settled_state,"warm_idle":warm_idle,"warm_integrated":warm_integrated},indent=2),flush=True)
    context.close()
    browser.close()
