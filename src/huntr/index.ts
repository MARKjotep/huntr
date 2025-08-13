import { Router } from "../router";
import { Html, doc } from "../doc";
import {
  _htmlHead,
  headAttr,
  headType,
  isWindow,
  log,
  makeID,
  Mapper,
  maybePromise,
  oAss,
} from "../@";
import { Render, renderConfig } from "../render";

/*
-------------------------

-------------------------
*/

export interface serverRender {
  path: string;
  status?: number;
  data?: Record<string, any>;
}

interface hunterConfig {
  base?: string;
  pushState?: boolean;
}

export class Huntr extends Router {
  //
  render: (
    x?: renderConfig,
  ) => maybePromise<(x: serverRender) => maybePromise<string | undefined>>;
  declare huntr: this;
  constructor(a?: hunterConfig) {
    super();
    /**
     *
     * wrap with div or treat it as DOM.. use the cnfig as its property
     */
    this.render = async (x = {}) => {
      const { id, data, class: _class } = x;
      //
      if (isWindow) {
        //
        const _data: obj<string> = {};
        const path = window.location.pathname;
        const bodyElement = document.body.id;

        const R = new Render(this, path, x);

        /*
        -------------------------
        
        -------------------------
        */
        return () => undefined;
      }

      return async ({ path, data = {}, status }: serverRender) => {
        //
        let _ID = makeID(4);
        let _HD: headType = new Mapper();
        let _hds: headAttr = {};
        const rh = new _htmlHead();

        const R = new Render(this, path, x, status);

        if (id) _ID = id;

        const innr = await R.doc(_ID, data);

        return new Html().body();
      };
    };

    const TH = this;
    oAss(this, {
      get huntr() {
        return this;
      },
    });
  }

  load() {}
}

const { route, render, huntr } = new Huntr();

@route("/")
class xx extends doc {
  head() {
    this.title = "hello world!";
  }
  body() {
    return "???";
  }
}

log.i = await (
  await render({})
)({
  path: "/",
});
