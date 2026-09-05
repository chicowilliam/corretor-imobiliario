export type ID = string;
export type ISODateTime = string;
export type Currency = "BRL";

export interface ImageAsset {
  id: ID;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string | null;
}

export interface VideoAsset {
  id: ID;
  src: string;
  poster: ImageAsset;
  title: string;
  captionsSrc: string | null;
}

export interface GeoPoint { lat: number; lng: number }

export interface SEO {
  title: string;
  description: string;
  socialImage: ImageAsset | null;
  noIndex: boolean;
}
