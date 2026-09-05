import type { Property } from "@/types/property";

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function formatMoney(cents: number): string {
  return formatter.format(cents / 100);
}

export function propertyPrice(property: Pick<Property, "priceVisibility" | "price" | "purpose">): string {
  if (property.priceVisibility === "ON_REQUEST" || property.price === null) return "Valor sob consulta";
  return `${formatMoney(property.price)}${property.purpose === "RENT" ? " / mês" : ""}`;
}
