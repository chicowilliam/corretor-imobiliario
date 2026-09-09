"use client";

import Image from "next/image";
import { useId, useState, useSyncExternalStore } from "react";
import { PropertyPreview } from "@/components/property/PropertyPreview";
import type { Property } from "@/types/property";
import styles from "./CuratedSelection.module.css";

const desktopSnapshot = () => matchMedia("(min-width: 900px)").matches;
const serverSnapshot = () => false;
function subscribe(notify: () => void) {
  const query = matchMedia("(min-width: 900px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const number = (value: number) => String(value).padStart(2, "0");

export function CuratedSelection({ properties, whatsapp }: { properties: Property[]; whatsapp: string | null }) {
  const [selected, setSelected] = useState(0);
  const desktop = useSyncExternalStore(subscribe, desktopSnapshot, serverSnapshot);
  const id = useId();
  return <div className={styles.selection}>
    <div className={styles.stage}>
      {properties.map((property, index) => <article key={property.id} id={`${id}-${index}`} className={styles.property} data-active={selected === index} inert={desktop && selected !== index} aria-hidden={desktop && selected !== index ? true : undefined} aria-label={property.name}>
        <PropertyPreview property={property} whatsapp={whatsapp} className={styles.image} showArrow={false}>
          <Image src={property.media.cover.src} alt={property.media.cover.alt} fill loading="lazy" sizes="(max-width: 899px) 100vw, 67vw" style={{ objectPosition: property.media.card?.objectPosition }} />
          <span className={styles.imageAction}>Explorar imóvel <span aria-hidden="true">↗</span></span>
        </PropertyPreview>
        <div className={styles.details}>
          <p className={styles.index}>{number(index + 1)} <span>/ {number(properties.length)}</span></p>
          <h3 className="display">{property.name}</h3>
          <p className={styles.location}>{property.neighborhood}<span> · {property.city}</span></p>
          <dl className={styles.facts}>
            <div><dt>Metragem</dt><dd>{property.area.toLocaleString("pt-BR")} <span>m²</span></dd></div>
            <div><dt>Quartos</dt><dd>{property.bedrooms ?? "—"}</dd></div>
            <div><dt>Suítes</dt><dd>{property.suites ?? "—"}</dd></div>
          </dl>
          <p className={styles.phrase}>{property.title}</p>
          <PropertyPreview property={property} whatsapp={whatsapp} className={`text-link ${styles.explore}`}>Explorar imóvel</PropertyPreview>
        </div>
      </article>)}
    </div>
    <nav className={styles.navigation} aria-label="Escolher imóvel da curadoria">{properties.map((property, index) => <button key={property.id} type="button" aria-pressed={selected === index} aria-controls={`${id}-${index}`} onClick={() => setSelected(index)} onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index); }}><span>{number(index + 1)}</span><span>{property.name}</span><span aria-hidden="true">↗</span></button>)}</nav>
  </div>;
}
