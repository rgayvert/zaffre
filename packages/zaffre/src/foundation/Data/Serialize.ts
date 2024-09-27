
//
// 
//

export interface Serializable<T> {
  serializer(): Serializer<T>;
}
export interface Serializer<T> {
  serialize(t: T): string;
  deserialize(json: string): T;
}
class SimpleJSONSerializer<T> implements Serializer<T> {
  public static instance = new SimpleJSONSerializer();
  serialize(val: T): string {
    if (Array.isArray(val)) {
      const inner = val.map((v) => serializerFor(v).serialize(v)).join(",");
      return `[${inner}]`;
    } else {
      return JSON.stringify(val);
    }
  }
  deserialize(json: string): T {
    return JSON.parse(json);
  }
}

export function serializerFor(obj: any): Serializer<unknown> {
  return obj["serializer"] ? obj.serializer() : SimpleJSONSerializer.instance;
}
export function serialize(val: any): string {
  return serializerFor(val).serialize(val);
}
