"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };
const subscribe = () => () => {};
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function SelectField({ id, name, label, options, defaultValue = "", icon }: {
  id: string; name: string; label: string; options: Option[]; defaultValue?: string; icon: ReactNode;
}) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState(defaultValue);
  const selected = Math.max(0, options.findIndex(option => option.value === value));
  const [active, setActive] = useState(selected);
  const [open, setOpen] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const typed = useRef({ text: "", time: 0 });
  const listId = id + "-options";

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const option = document.getElementById(listId + "-" + active);
    const list = option?.parentElement;
    if (!option || !list) return;
    const itemBox = option.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (itemBox.top < listBox.top) list.scrollTop -= listBox.top - itemBox.top;
    else if (itemBox.bottom > listBox.bottom) list.scrollTop += itemBox.bottom - listBox.bottom;
  }, [active, open, listId]);

  function choose(index: number) {
    setValue(options[index].value);
    setActive(index);
    setOpen(false);
    button.current?.focus({ preventScroll: true });
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    setKeyboard(true);
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive(index => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 :
        !open ? selected : Math.max(0, Math.min(options.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active); else { setActive(selected); setOpen(true); }
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = performance.now();
      typed.current = { text: now - typed.current.time > 700 ? event.key : typed.current.text + event.key, time: now };
      const match = options.findIndex(option => normalize(option.label).startsWith(normalize(typed.current.text)));
      if (match >= 0) { setActive(match); setOpen(true); }
    }
  }

  return <div ref={root} className="search-field select-field" data-open={open} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <label id={id + "-label"} htmlFor={id}>{label}</label>
    <select id={enhanced ? id + "-native" : id} name={name} value={value} onChange={event => setValue(event.target.value)}
      hidden={enhanced} aria-hidden={enhanced || undefined} tabIndex={enhanced ? -1 : undefined}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {enhanced ? <>
      <button ref={button} id={id} type="button" className="select-trigger" role="combobox" aria-haspopup="listbox"
        aria-labelledby={id + "-label " + id + "-value"} aria-expanded={open} aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? listId + "-" + active : undefined} onKeyDown={keyDown}
        onClick={() => { setKeyboard(false); setActive(selected); setOpen(!open); }}>
        <span className="select-kind" aria-hidden="true">{icon}</span><span id={id + "-value"}>{options[selected].label}</span>
        <ChevronDown className="select-chevron" size={14} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open ? <motion.div className="select-panel" key="options" initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: reduced || keyboard ? 0 : .18, ease: [.22, 1, .36, 1] }}>
          <div id={listId} role="listbox" aria-labelledby={id + "-label"} className="select-options" data-lenis-prevent>
            {options.map((option, index) => <button key={option.value} type="button" role="option" tabIndex={-1}
              id={listId + "-" + index} aria-selected={value === option.value} data-active={index === active}
              onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)}>
              <span>{option.label}</span>{value === option.value ? <Check size={14} aria-hidden="true" /> : null}
            </button>)}
          </div>
        </motion.div> : null}
      </AnimatePresence>
    </> : null}
  </div>;
}
