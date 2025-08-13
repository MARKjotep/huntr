import { $ } from "../$";
import {
  _htmlHead,
  headAttr,
  headType,
  isPlainObject,
  isWindow,
  log,
  makeID,
  Mapper,
  oLen,
} from "../@";
import { defaultError, doc } from "../doc";
import { Huntr } from "../huntr";

export interface renderConfig {
  class?: string | string[];
  id?: string;
  data?: any;
}

export let routeHeads = new Mapper<string, headType>();

export class Render {
  cls: InstanceType<typeof doc>;
  constructor(
    private app: Huntr,
    public path: string,
    a: renderConfig,
    private status?: number,
  ) {
    //
    this.cls = this.class(path, status);
  }
  private class(path: string, error?: number) {
    const [clientP, args] = this.app.getRoute(path);
    if (clientP && !error) {
      const { cls, id } = clientP;
      return new cls(path, args, id);
    } else {
      return loadERROR.call(this.app, path, error || getErrorCode());
    }
  }
  protected async fetch(CL?: doc<{}>) {
    if (CL) {
      try {
        if (CL.fetch) {
          const dt = await CL.fetch();
          if (isPlainObject(dt) && oLen(dt)) {
            CL.data = dt;
          }
        }
      } catch (e) {
        log.e = ["class fetch", { error: "fetch" }];
      }
    }
  }
  processHead() {}
  docHead() {}

  private async defHead(head: headAttr) {
    const rh = new _htmlHead();
    if (oLen(head)) rh.head = head;
    // rh.head.map(this.htmlHead);
    return rh.head;
  }
  async doc(id: string, data: obj<string> = {}, inner: string[] = []) {
    const TCL = this.cls;
    TCL.data = data;

    await this.fetch(TCL);

    log.i = TCL;
    return [];
  }
}

function loadERROR(this: Huntr, _path: string, _error: number = 404) {
  const [clientP, args] = this.getError(_error ?? 0);
  if (clientP) {
    const { cls, id } = clientP;
    return new cls(_path, args, id, _error);
  } else {
    const ndoc = new defaultError(_path, args, makeID(5));
    ndoc.title = `error ${_error}`;
    return ndoc;
  }
}

export function getErrorCode() {
  if (isWindow) {
    return parseInt($(`meta[name="error"]`)?.attr.get("content") ?? "200");
  }
  return 404;
}
