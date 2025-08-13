import {
  maybePromise,
  obj,
  oAss,
  head,
  log,
  isArr,
  headAttr,
  headType,
  _htmlHead,
  oLen,
} from "../@";
import { Dom, dom } from "../dom";
import { Huntr } from "../huntr";

export { websocket } from "./wss";
export { Html } from "./html";

/**
 * Render body if import was not available or returns undefined/voic
 */
type doc_t = { args?: obj<any>; data?: obj<any> };

export class doc<T extends doc_t = obj<any>> extends head {
  lang: string = "en";
  static route: string = "/";
  import?: any;
  async fetch?(): Promise<obj<any>>;
  head?(): maybePromise<void>;
  body?(): maybePromise<Huntr | Dom | string>;
  _data: T["data"] = {};

  constructor(
    public path: string,
    public args: T["args"] = {},
    public id: string = "",
    public status?: number,
  ) {
    super();
  }
  async loader() {
    if (this.import) {
      try {
        const cimp = (await this.import) as { default?: (args: any) => any };
        if (cimp.default) {
          this.import = await cimp.default({ ...this.args, ...this.data });
        } else {
          this.import = undefined;
        }
      } catch (error) {
        log.e = ["import", { error: "loader" }];
        this.import = undefined;
        return [];
      }
    }

    if (this.body) {
      //
      const CD = await this.body();
      return isArr(CD) ? CD : [CD];
    }

    if (this.import) {
      const CD = this.import;
      return isArr(CD) ? CD : [CD];
    }

    return [];
  }
  getHead(head: headAttr = {}, ...toMap: headType[]) {
    //
    const rh = new _htmlHead();
    if (oLen(head)) rh.head = head;

    rh.id = this.id;

    const TORA = rh.head;

    toMap.forEach((tf) => {
      TORA.map(tf);
    });

    DOC(rh, this);

    return TORA;
  }
  set data(data: obj<any>) {
    oAss(this._data as {}, data);
  }
  get data(): T["data"] {
    return this._data;
  }
}

export class defaultError extends doc<{}> {
  body() {
    return dom("div", {}, this.path + " not found...");
  }
}

function DOC(rh: _htmlHead, doc: doc) {
  const { link, script, meta, title, base, description, css } = doc;
  rh.head = {
    title,
    base,
    meta,
    link,
    script,
  };

  if (description) {
    rh.head = {
      meta: [
        {
          name: "description",
          content: description,
        },
      ],
    };
  }

  if (css) {
    const isc = isArr(css) ? css : [css];
    const mp = isc.map((mm) => ({
      rel: `preload stylesheet`,
      href: mm,
      as: "style",
    }));

    rh.head = {
      link: [...mp],
    };
  }
}
