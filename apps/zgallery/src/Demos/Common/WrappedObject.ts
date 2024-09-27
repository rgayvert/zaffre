import { View } from "zaffre";

/**
 * #WrappedObject
 *   - wraps around an arbitrary object, provides a readable title and description
 *     for the object and its "children"
 *   - used by DOM component as an inspector of a View
 */
export function wrap(obj: any, name: string): WrappedObject {
  return new WrappedObject(obj, name);
}
export function wrapView(view: View): WrappedObject {
  return new WrappedObject(view, view.zname);
}

export class WrappedObject {
  constructor(
    public obj: any,
    public name: string
  ) {}

  title(): string {
    const n = this.name ? `${this.name}: ` : "";
    return `${n}${this.description()}`;
  }
  childKeys(): string[] {
    const obj = this.obj;
    if (!obj || typeof obj === "function" || typeof obj === "string") {
      return [];
    } else {
      const keys = Object.keys(obj).sort();
      return [...keys.filter((k) => k[0] !== "_"), ...keys.filter((k) => k[0] === "_")];
    }
  }

  children(): WrappedObject[] {
    return this.childKeys().map((key) => wrap(this.obj[key], key));
  }
  description(): string {
    const obj = this.obj;
    const type = typeof obj;
    if (obj === undefined) {
      return "undefined";
    } else if (obj === null) {
      return "null";
    } else if (typeof obj === "string") {
      return `"${obj}"`;
    } else if (!obj || ["number", "boolean", "function"].includes(type)) {
      return obj.toString();
    } else if (Array.isArray(obj)) {
      return `Array(${obj.length})`;
    } else if (obj instanceof Set) {
      return `Set(${obj.size})`;
    } else if (obj instanceof Map) {
      return `Map(${obj.size})`;
    } else if (obj.constructor.name === "Object") {
      return "{...}";
    } else {
      return obj.constructor.name;
    }
  }
}
