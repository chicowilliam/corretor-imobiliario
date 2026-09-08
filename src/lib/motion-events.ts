type Events = { scroll: Event; resize: UIEvent; keydown: KeyboardEvent; visibilitychange: Event };
type Subscription = { listeners: Set<EventListener>; stop: () => void };
const subscriptions = new Map<keyof Events, Subscription>();

/** One native listener per event, released when its last consumer leaves. */
export function subscribeMotionEvent<K extends keyof Events>(type: K, callback: (event: Events[K]) => void) {
  let subscription = subscriptions.get(type);
  if (!subscription) {
    const target = type === "keydown" || type === "visibilitychange" ? document : window;
    const listeners = new Set<EventListener>();
    let frame = 0;
    const dispatch = (event: Event) => {
      if (type !== "scroll") { listeners.forEach(listener => listener(event)); return; }
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        listeners.forEach(listener => listener(event));
      });
    };
    target.addEventListener(type, dispatch, { passive: true });
    subscription = { listeners, stop: () => {
      target.removeEventListener(type, dispatch);
      cancelAnimationFrame(frame);
    } };
    subscriptions.set(type, subscription);
  }
  const listener = callback as EventListener;
  subscription.listeners.add(listener);
  return () => {
    subscription.listeners.delete(listener);
    if (!subscription.listeners.size) {
      subscription.stop();
      if (subscriptions.get(type) === subscription) subscriptions.delete(type);
    }
  };
}
