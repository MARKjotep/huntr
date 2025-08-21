import { bind, isWindow, log, makeID, oAss } from "../@";
import type { headType } from "../@";
import { $, dom, MainDom, renderedDom, Wizard } from "../dom";
import { State, Stateful, StateHook } from "../stateful";
import { doc, docLoader, headLoader } from "./doc";
import { HTML } from "./html";
import { Router } from "./router";

export { doc };
export { content } from "./content";
export { Tabs } from "./tabs";

export { websocket, socket } from "./wss";
/**
 * To make sure only one Huntr is running
 */

export interface renderConfig {
  class?: string | string[];
  id?: string;
  data?: any;
  isDev?: boolean;
}

interface _Huntr {
  base?: string;
}

class minElements extends Router {
  id: string;
  data: obj<any>;
  protected path: Stateful<string>;
  protected _root: Stateful<any[]>;
  constructor(base: string = "") {
    super(base);
    this.id = makeID(6);
    this.path = State("/");
    this._root = State([]);
    this.data = {};
  }
  @bind Main(a: attr) {
    return dom("main", {}, this._root);
  }
  @bind A(a: attr, ...ctx: ctx[]) {
    const { on, ..._a } = a;
    const _path = this.path;
    const _e: events = {
      ...(on || {}),
      click(e) {
        e.preventDefault();
        const href = $(this).path;
        _path.value = href;
      },
    };
    return dom("a", { on: _e, ..._a }, ...ctx);
  }
}

export interface serverRender {
  path: string;
  error?: number;
  data?: Record<string, any>;
}

export class Huntr extends minElements {
  constructor({ base }: _Huntr = {}) {
    super(base);
  }
  @bind async render(x: renderConfig = {}) {
    const { id, data, class: _class, isDev = false } = x;
    if (isWindow) {
      //
      let winloc = window.location.pathname;
      if (isDev) {
        winloc = winloc.replace(/^\/|\/$/g, "");
      }
      this.path.value = winloc;
      //
      const bodyElement = document.body.id;
      this.id = bodyElement;

      const [_, RND] = await HeadAndCTX.call(this, this.path.value, _class);

      Wizard.push(RND.oz);

      requestAnimationFrame(() => {
        Wizard.stage;
        this.init(data);
      });

      return () => {};
    }
    /**
     *
     */
    return async ({ path, data = {}, error = 0 }: serverRender) => {
      if (id) {
        this.id = id;
      }
      const [_FHEAD, RND] = await HeadAndCTX.call(
        this,
        path,
        _class,
        error,
        data,
        true,
      );

      return new HTML(this.lang, _FHEAD).body(RND.ctx, this.id);
    };
  }
  private async init(data = {}) {
    let id = this.id;
    StateHook(
      async (path) => {
        //
        const [_BODY, _FHEAD] = await forClient.call(this, path, data);

        await headLoader(_FHEAD, id);

        this._root.value = _BODY;
      },
      [this.path],
      { id },
    );
  }
}

async function forClient(
  this: Huntr,
  path: string,
  data: obj<any> = {},
  isServer: boolean = false,
  error?: number,
): Promise<ReturnType<typeof docLoader>> {
  const CLS = this.storage.getRoute(path, error);
  oAss(CLS, { path, data });

  return await docLoader.call(this, CLS, isServer);
}

async function HeadAndCTX(
  this: Huntr,
  path: string,
  _class?: string | string[],
  _error?: number,
  data: obj<any> = {},
  isServer: boolean = false,
): Promise<[headType, renderedDom]> {
  //
  const [_BODY, _FHEAD] = await forClient.call(
    this,
    path,
    data,
    isServer,
    _error,
  );
  this._root.value = _BODY;
  const RND = await MainDom(this._root, this.id, _class);
  return [_FHEAD, RND];
}
