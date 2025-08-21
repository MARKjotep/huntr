import { Storage, MinStorage, makeID, htmlHead, addBASE } from "../@";
import { doc, websocket } from "../doc";
import { $, dom } from "../dom";
import { aAttr } from "../dom/attr";
import { State, Stateful } from "../stateful";

export class BasePath<T> extends MinStorage {
  constructor(
    path: string,
    public id: string,
    public cls: T,
  ) {
    super(path);
  }
}

export class ClientPath extends BasePath<typeof doc> {}

export class SocketPath extends BasePath<typeof websocket> {}

export class Stormy {
  storage: Storage<ClientPath> = new Storage();
  errorStorage: Storage<ClientPath> = new Storage();
  wssStorage: Storage<SocketPath> = new Storage();
  constructor() {}
  getRoute(path: string) {
    return this.storage.get(path);
  }
  getWss(path: string) {
    return this.wssStorage.get(path);
  }
  getError(code: number) {
    return this.errorStorage.get(code.toString());
  }
}

/**
 * Extend the storage
 */

export class Router extends htmlHead {
  id: string = makeID(6);
  storage = new Stormy();
  public base: string;
  protected _root = State<any[]>([]);
  public path = State("/");
  protected lastPath = State("/");
  /** --------------------
   * @route
   * string | int | float | file | uuid
   * - /url/\<string:hell>
   */
  route: (path: string) => <Q extends typeof doc>(f: Q) => Q;
  error: (...codes: number[]) => <Q extends typeof doc>(f: Q) => Q;
  wss: (path: string) => <Q extends typeof websocket>(f: Q) => Q;
  A: (a: aAttr, ...ctx: ctx[]) => dom;
  constructor(base: string = "") {
    super(true);
    this.base = base ? (base.startsWith("/") ? base : `/${base}`) : "";
    this.path.value = this.base;
    this.route = (path) => (f) => {
      const fph = addBASE(this.base, path);

      f.route = fph;
      this.storage.storage.set(new ClientPath(fph, makeID(6), f));
      return f;
    };

    this.error = (...codes: number[]) => {
      return <Q extends typeof doc>(f: Q): Q => {
        if (codes.length) {
          codes.forEach((cd) => {
            const fph = addBASE(this.base, cd.toString());

            this.storage.errorStorage.set(new ClientPath(fph, makeID(5), f));
          });
        } else {
          this.storage.errorStorage.set(new ClientPath("404", makeID(5), f));
        }
        return f;
      };
    };

    this.wss = (path) => (f) => {
      const fph = addBASE(this.base, path);

      f.route = fph;
      this.storage.wssStorage.set(new SocketPath(fph, makeID(6), f));
      return f;
    };
    this.A = (a, ...ctx) => {
      if (this.base) {
        if (a.href && !String(a.href).startsWith(this.base)) {
          a.href = addBASE(this.base, a.href.toString());
        }
      }
      return customAnchor(a, this.path, this.lastPath, ctx);
    };
  }
}

function customAnchor(
  a: aAttr,
  path: Stateful<string>,
  last: Stateful<string>,
  ...ctx: ctx[]
) {
  const _e: events<HTMLAnchorElement> = {
    click(e) {
      e.preventDefault();
      const _E = $(this);
      const PT = _E.path;

      last.value = path.value;
      path.value = PT;
    },
  };
  return dom("a", { ...a, on: { ..._e } }, ...ctx);
}
