import { Huntr } from "..";
import {
  _htmlHead,
  head,
  headAttr,
  headType,
  htmlHead,
  isArr,
  isFN,
  isModule,
  log,
  oAss,
  V,
} from "../../@";
import { maybePromise } from "../../@";
import { LINK } from "./link";
import { META } from "./meta";
import { SCRPT } from "./script";

export interface docObj {
  args?: obj<any>;
  data?: obj<any>;
}

export class doc<T extends docObj = obj<obj<any>>> extends head {
  path: string = "";
  data: T["data"] = {};
  args: T["args"] = {};
  fetch?(): maybePromise<obj<any>>;
  head?(): maybePromise<void>;
  body?(): maybePromise<any>;
}

export async function docLoader(
  this: Huntr,
  _doc: doc,
  isServer: boolean = false,
): Promise<[any[], headType]> {
  if (!isServer && _doc.fetch) {
    oAss(_doc.data, await _doc.fetch());
  }
  await _doc.head?.();

  return [getBody(await _doc.body?.()), getHeads.call(this, _doc)];
}

export function getBody(v?: any): any[] {
  let val: any = v || "";
  if (isModule(v)) {
    const vd = v.default;
    val = isFN(vd) ? vd() : vd;
  }
  return isArr(val) ? val : [val];
}

function getHeads(this: Huntr, _doc: doc) {
  const mh = new htmlHead({
    push: { rt: this.id },
  });

  mh.htmlHead = structuredClone(this.htmlHead);

  mh.head(_doc as headAttr);

  return mh.htmlHead;
}

export async function headLoader(head: headType, id: string) {
  //

  document.title = head.get("title") || "";

  Unload(await LINK(head.get("link"), id));
  Unload(await SCRPT(head.get("script")));
  const unl = await META(head.get("meta"));
  Unload(unl);
}

export const Unload = (un: (() => void)[]) => {
  un.forEach((un) => un());
};
