//
// lazyinit - a useful Typescript decorator for lazy creation of properties
//

export const lazyinit = (target: any, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  const setValue = (that: any, val: any): any => {
    Object.defineProperty(that === target ? target : that, propertyName, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: val,
    });
    return val;
  }
  return {
    get(): any {
      return setValue(this, descriptor.get?.call(this));
    },
  };
}
