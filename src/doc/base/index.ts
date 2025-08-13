import { oAss, obj } from "../../@";

type doc_t = { args?: Record<string, any>; data?: Record<string, any> };

export class Base<T extends doc_t = obj<any>> {
  static route: string = "/";
  lang: string = "en";
  _data: T["data"] = {};
  set data(data: obj<any>) {
    oAss(this._data as {}, data);
  }
  get data(): T["data"] {
    return this._data;
  }
  constructor(
    public path: string,
    public args: T["args"] = {},
    public id: string,
    public status?: number,
  ) {}
}
