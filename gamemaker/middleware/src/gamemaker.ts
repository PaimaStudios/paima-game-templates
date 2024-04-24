/**
 * Prepend 'gml' to JS-side accesses to turn them into GM-like accesses.
 */
const GM_TO_JS: ProxyHandler<object> = {
  get(target, p, receiver) {
    return gmToJs(Reflect.get(target, 'gml' + String(p), receiver));
  },
  set(target, p, newValue, receiver): boolean {
    return Reflect.set(target, 'gml' + String(p), newValue, receiver);
  },
};
/**
 * Wrap a GameMaker object or function transparently for JS.
 */
function gmToJs(obj: unknown): unknown {
  if (obj instanceof Function) {
    const name = `${gmToJs.name}(${obj.name})`;
    return {
      // Ritual to let our dynamic name show up in debuggers.
      [name](...args: unknown[]) {
        // Supply null for first two _inst and _other args that GM always expects.
        return gmToJs(obj(null, null, ...args.map(jsToGm)));
      }
    }[name];
  } else if (obj !== null && typeof obj === 'object') {
    return new Proxy(obj, GM_TO_JS);
  } else {
    return obj;
  }
}

/**
 * Strip the 'gml' prefix from GM-side accesses to turn them into JS-like accesses.
 */
const JS_TO_GM: ProxyHandler<object> = {
  get(target, p, receiver) {
    if (p === '__yyIsGMLObject')
      return true;
    return jsToGm(Reflect.get(target, String(p).replace(/^gml/, ''), receiver), target);
  },
  set(target, p, newValue, receiver): boolean {
    return Reflect.set(target, String(p).replace(/^gml/, ''), newValue, receiver);
  },
};
/**
 * Wrap a JS object or function transparently for GameMaker.
 * @param target The receiver to bind to, if {@link obj} is a function.
 */
export function jsToGm(obj: unknown, target?: unknown): unknown {
  if (obj instanceof Function) {
    // JS functions must be pre-bound to their receiver.
    const name = `${jsToGm.name}(${obj.name})`;
    return {
      // Ritual to let our dynamic name show up in debuggers.
      [name](_inst: unknown, _other: unknown, ...args: unknown[]) {
        // Ignore first two _inst and _other args that GM always adds.
        return jsToGm(obj.apply(target, args.map(gmToJs)) /* no target here */);
      }
    }[name];
  } else if (obj !== null && typeof obj === 'object') {
    return new Proxy(obj, JS_TO_GM);
  } else {
    return obj;
  }
}
