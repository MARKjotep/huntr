/*
-------------------------

-------------------------
*/

interface appType {
  base?: string;
}

interface renderApp {
  class?: string | string[];
  id?: string;
  data?: any;
}

class head {}

/**
 * Render body if import was not available or returns undefined/voic
 */
class doc extends head {
  import?: any;
  async fetch?(): Promise<Record<string, any>>;
  head() {}
  body() {}
}

function acv() {}

// Render will wrap it into a div --
class Huntr {
  constructor(a?: appType) {}
  /**
   *
   * wrap with div or treat it as DOM.. use the cnfig as its property
   */
  async render(x?: renderApp) {}
}

const APP = new Huntr({
  base: "",
});

APP.render({
  class: "",
  id: "",
});

const HUN2 = new Huntr();

// @route("/")
class acd extends doc {
  head() {
    //
    return {};
  }
  body() {
    /**
     * when Huntr is returned, then pass the route as its base url.
     * return "render"
     */
    return HUN2;
  }
}
