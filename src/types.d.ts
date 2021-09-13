interface IOpConfig {
  INITIAL_CONTEXT?: IOpPlainObject;
  VERSION?: string;
  BASE_URL?: string;
  ENV?: IOpPlainObject | IOpPlainObject[];
  DEFAULT?: Partial<IOpRequestBase>;
  DEFAULT_GET?: Partial<IOpRequestGET>;
  DEFAULT_HEAD?: Partial<IOpRequestHEAD>;
  DEFAULT_POST?: Partial<IOpRequestPOST>;
  DEFAULT_PUT?: Partial<IOpRequestPUT>;
  DEFAULT_DELETE?: Partial<IOpRequestDELETE>;
  DEFAULT_PATCH?: Partial<IOpRequestPATCH>;
  DEFAULT_OPTIONS?: Partial<IOpRequestOPTIONS>;
  DEFAULT_CONNECT?: Partial<IOpRequestCONNECT>;
  DEFAULT_TRACE?: Partial<IOpRequestTRACE>;
}

interface IOpPlainObject {
  [id: string]: any;
}

interface IOpRequestBase {
  CHECK?: string;
  DEBUG?: string | string[];
  HEADERS?: IOpRequestHeaders;
  DELAY?: number;
  ASSIGN?: string | IOpPlainObject;
  SAVEAS?: string;
  SET?: IOpPlainObject;
}

interface IOpRequestGET extends IOpRequestBase {
  GET: string;
}

interface IOpRequestHEAD extends IOpRequestBase {
  HEAD: string;
}

interface IOpRequestPOST extends IOpRequestBase {
  POST: string;
  BODY?: IOpPlainObject | string;
}

interface IOpRequestPUT extends IOpRequestBase {
  PUT: string;
  BODY?: IOpPlainObject | string;
}

interface IOpRequestDELETE extends IOpRequestBase {
  DELETE: string;
}

interface IOpRequestPATCH extends IOpRequestBase {
  PATCH: string;
  BODY?: IOpPlainObject | string;
}

interface IOpRequestOPTIONS extends IOpRequestBase {
  OPTIONS: string;
}

interface IOpRequestCONNECT extends IOpRequestBase {
  CONNECT: string;
}

interface IOpRequestTRACE extends IOpRequestBase {
  TRACE: string;
}

interface IOpRequestMethodData {
  method: OpRequestMethod;
  path: string;
  body?: string | IOpPlainObject;
}

interface IOpRequestHeaders {
  [id: string]: string;
}

interface IOpResponseHeaders {
  [id: string]: string;
}

type IOpMethodDefaultGenerator = {
  [method in OpRequestMethod]?: (requestData: IOpRequest) => IOpRequest;
};

type IOpRequest =
  | IOpRequestGET
  | IOpRequestHEAD
  | IOpRequestPOST
  | IOpRequestPUT
  | IOpRequestDELETE
  | IOpRequestPATCH
  | IOpRequestOPTIONS
  | IOpRequestCONNECT
  | IOpRequestTRACE;

declare type OpRequestHandler = (url: string, params: any) => Promise<any>;

declare type OpRequestMethod =
  | "POST"
  | "PUT"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "CONNECT"
  | "PATCH"
  | "TRACE"
  | "GET";

declare type OpContextReplacer = (key: string, value: any) => any;
