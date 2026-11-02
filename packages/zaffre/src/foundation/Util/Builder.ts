
//
// Adapted from https://github.com/Vincent-Pang/builder-pattern

export type IBuilder<T> = {
  [k in keyof T]-?: ((arg: T[k]) => IBuilder<T>) & (() => T[k]);
}
& {
  build(): T;
};

type Clazz<T> = new(...args: unknown[]) => T;

/**
 * Create a Builder for a class. Returned objects will be of the class type.
 *
 * @param type the name of the class to instantiate.
 */
export function Builder<T>(type: Clazz<T>): IBuilder<T> {

  const built: Record<string, unknown> = {};

  const builder = new Proxy(
    {},
    {
      get(_target, prop) {
        if ('build' === prop) {
            const obj: T = new type();
            return () => Object.assign(obj as T & Record<string, unknown>, {...built});
        }

        return (...args: unknown[]): unknown => {
          // If no arguments passed return current value.
          if (0 === args.length) {
            return built[prop.toString()];
          }
          
          built[prop.toString()] = args[0];
          return builder;
        };
      }
    }
  );

  return builder as IBuilder<T>;
}
