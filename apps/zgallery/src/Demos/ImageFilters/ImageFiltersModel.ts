import { FilterToken, css_blur, css_brightness, css_contrast,  pct, px, Atom, atom } from "zaffre";
import { grayscaleFilter, hueRotationFilter, inversionFilter } from "zaffre";
import { opacityFilter, saturationFilter, sepiaFilter, } from "zaffre";

export type FilterSpec = {
  title: string;
  value: Atom<number>;
  max: number,
  css: (val: number) => FilterToken;
}
export class ImageFiltersModel {
  imageSrc = atom("image.flowers");
  imageFiles = atom<File[]>([], { action: (files) => this.imageSrc.set(URL.createObjectURL(files[0])) });

  filters: FilterSpec[] = [
    { title: "Blur", value: atom(0), max: 4, css: (val) => css_blur(px(val)) },
    { title: "Brightness", value: atom(100), max: 100, css: (val) => css_brightness(pct(val)) },
    { title: "Contrast", value: atom(100), max: 100, css: (val) => css_contrast(pct(val)) },
    { title: "Invert", value: atom(0), max: 100, css: (val) => inversionFilter(pct(val)) },
    { title: "Saturation", value: atom(100), max: 100, css: (val) => saturationFilter(pct(val)) },
    { title: "Grayscale", value: atom(0), max: 100, css: (val) => grayscaleFilter(pct(val)) },
    { title: "Hue-Rotate", value: atom(0), max: 180, css: (val) => hueRotationFilter(val) },
    { title: "Opacity", value: atom(100), max: 100, css: (val) => opacityFilter(pct(val)) },
    { title: "Sepia", value: atom(0), max: 100, css: (val) => sepiaFilter(pct(val)) },
  ];

  filter = atom(() => this.filters.map((spec) => spec.css(spec.value.get())));

}
