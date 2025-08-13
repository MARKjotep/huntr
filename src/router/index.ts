import { Storage, MinStorage, makeID } from "../@";
import { doc, websocket } from "../doc";

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

/**
 * Extend the storage
 */
export class Router {
  protected storage: Storage<ClientPath> = new Storage();
  protected errorStorage: Storage<ClientPath> = new Storage();
  protected wssStorage: Storage<SocketPath> = new Storage();
  public base: string;
  /** --------------------
   * @route
   * string | int | float | file | uuid
   * - /url/\<string:hell>
   */
  route: (path: string) => <Q extends typeof doc>(f: Q) => Q;
  error: (...codes: number[]) => <Q extends typeof doc>(f: Q) => Q;
  wss: (path: string) => <Q extends typeof websocket>(f: Q) => Q;

  constructor(base: string = "") {
    this.base = base ? (base.startsWith("/") ? base : `/${base}`) : "";

    this.route = (path) => (f) => {
      f.route = path;
      this.storage.set(new ClientPath(path, makeID(6), f));
      return f;
    };

    this.error = (...codes: number[]) => {
      return <Q extends typeof doc>(f: Q): Q => {
        if (codes.length) {
          codes.forEach((cd) => {
            this.errorStorage.set(new ClientPath(cd.toString(), makeID(5), f));
          });
        } else {
          this.errorStorage.set(new ClientPath("404", makeID(5), f));
        }
        return f;
      };
    };

    this.wss = (path) => (f) => {
      f.route = path;
      this.wssStorage.set(new SocketPath(path, makeID(6), f));
      return f;
    };
  }

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
