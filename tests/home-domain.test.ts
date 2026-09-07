import assert from "node:assert/strict";
import test from "node:test";
import { filterHomeProperties, isPublicListing } from "../src/domain/property/filters.ts";
import { createWhatsAppLink } from "../src/lib/whatsapp/create-link.ts";
import type { Property } from "../src/types/property.ts";

const items = [
  { id: "sale", status: "EXCLUSIVE", collection: "PUBLIC", purpose: "SALE", areaId: "jardins", type: "HOUSE" },
  { id: "rent", status: "JUST_LISTED", collection: "PUBLIC", purpose: "RENT", areaId: "vila", type: "APARTMENT" },
  { id: "draft", status: "DRAFT", collection: "PUBLIC", purpose: "SALE", areaId: "jardins", type: "HOUSE" },
  { id: "private", status: "PUBLISHED", collection: "PRIVATE", purpose: "SALE", areaId: "jardins", type: "HOUSE" },
] as Property[];

test("Home search excludes unpublished and private listings", () => {
  assert.deepEqual(filterHomeProperties(items, {}).map((item) => item.id), ["sale", "rent"]);
});

test("Home search intersects purpose, area and property type", () => {
  assert.deepEqual(filterHomeProperties(items, { purpose: "RENT", areaId: "vila", type: "APARTMENT" }).map((item) => item.id), ["rent"]);
  assert.deepEqual(filterHomeProperties(items, { purpose: "RENT", areaId: "jardins" }), []);
});

test("Catalog filters reuse the same public listing rules", () => {
  assert.deepEqual(filterHomeProperties(items, { purpose: "SALE" }).map((item) => item.id), ["sale"]);
  assert.equal(filterHomeProperties(items, { type: "HOUSE" }).every((item) => item.collection === "PUBLIC"), true);
});

test("Sold, archived and off-market properties are not active Home listings", () => {
  for (const status of ["SOLD", "RENTED", "ARCHIVED", "OFF_MARKET", "COMING_SOON"] as const) {
    assert.equal(isPublicListing({ ...items[0], status }), false);
  }
});

test("Missing and invalid contacts never produce a WhatsApp destination", () => {
  assert.equal(createWhatsAppLink(null, "Olá"), null);
  assert.equal(createWhatsAppLink("123", "Olá"), null);
});

test("Contextual WhatsApp message retains property name and punctuation", () => {
  const url = createWhatsAppLink("+55 (11) 99999-9999", "Olá! Tenho interesse em Casa & Jardim.");
  assert.ok(url);
  assert.equal(new URL(url).pathname, "/5511999999999");
  assert.equal(new URL(url).searchParams.get("text"), "Olá! Tenho interesse em Casa & Jardim.");
});
