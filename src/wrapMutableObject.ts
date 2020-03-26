import {
  Accessor,
  getAccessor,
} from 'gqless';

const wrapperMap = new WeakMap<object, object>();

const isMutableObject = (x: unknown) => {
  try {
    return x !== null && typeof x === 'object' && !!getAccessor(x);
  } catch (e) {
    return false;
  }
};

const proxyHandler = {
  get(target: object, property: string) {
    const value = Reflect.get(target, property);
    if (typeof value === 'function' && Array.isArray(target)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arrayFunc = Array.prototype[property as any];
      // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
      return arrayFunc.bind(wrapMutableObject(target));
    }
    if (typeof value === 'function' || isMutableObject(value)) {
      // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
      return wrapMutableObject(value);
    }
    return value;
  },
  apply(target: Function, thisArg: unknown, argsList: unknown[]) {
    const value = Reflect.apply(target, thisArg, argsList);
    if (typeof value === 'function' || isMutableObject(value)) {
      // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
      return wrapMutableObject(value);
    }
    return value;
  },
};

export const wrapMutableObject = <T extends object>(obj: T): T => {
  let wrapper = wrapperMap.get(obj);
  if (!wrapper) {
    wrapper = new Proxy(obj, proxyHandler);
    wrapperMap.set(obj, wrapper);
  }
  return wrapper as T;
};

export const notifyMutation = (accessor: Accessor) => {
  if (typeof accessor.data === 'object') {
    const newWrapper = new Proxy(accessor.data, proxyHandler);
    wrapperMap.set(accessor.data, newWrapper);
  }
  if (accessor.parent) {
    notifyMutation(accessor.parent);
  }
};
