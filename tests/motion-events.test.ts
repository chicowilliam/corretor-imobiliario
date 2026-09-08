import assert from "node:assert/strict";
import test from "node:test";
import { subscribeMotionEvent } from "../src/lib/motion-events.ts";

test("motion subscriptions share listeners, coalesce scroll and release pending work", () => {
  const names = ["window", "document", "requestAnimationFrame", "cancelAnimationFrame"];
  const originals = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const target = new EventTarget();
  let added = 0;
  let removed = 0;
  const add = target.addEventListener.bind(target);
  const remove = target.removeEventListener.bind(target);
  target.addEventListener = (...args) => { added++; add(...args); };
  target.removeEventListener = (...args) => { removed++; remove(...args); };
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  Object.defineProperties(globalThis, {
    window: { configurable: true, value: target },
    document: { configurable: true, value: target },
    requestAnimationFrame: { configurable: true, value: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; } },
    cancelAnimationFrame: { configurable: true, value: (frame: number) => frames.delete(frame) },
  });
  const stops: (() => void)[] = [];
  try {
    let first = 0;
    let second = 0;
    stops.push(subscribeMotionEvent("scroll", () => first++), subscribeMotionEvent("scroll", () => second++));
    assert.equal(added, 1);
    target.dispatchEvent(new Event("scroll"));
    target.dispatchEvent(new Event("scroll"));
    assert.equal(frames.size, 1);
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback(0));
    assert.deepEqual([first, second], [1, 1]);
    stops[0]();
    target.dispatchEvent(new Event("scroll"));
    stops[1]();
    assert.equal(frames.size, 0);
    assert.equal(removed, 1);
    let keyboard = 0;
    stops.push(subscribeMotionEvent("keydown", () => keyboard++));
    target.dispatchEvent(new Event("keydown"));
    assert.equal(keyboard, 1, "keyboard feedback must remain synchronous");
  } finally {
    stops.forEach(stop => stop());
    names.forEach((name, index) => {
      if (originals[index]) Object.defineProperty(globalThis, name, originals[index]!);
      else Reflect.deleteProperty(globalThis, name);
    });
  }
});
