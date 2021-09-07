interface IOpConfig {
  INITIAL_CONTEXT?: IOpContext;
  VERSION?: string;
  BASE?: string;
  ENV?: {} | {}[];
  DEFAULT_HEADERS?: {
    ALL?: IOpRequestHeaders;
    GET?: IOpRequestHeaders;
    HEAD?: IOpRequestHeaders;
    POST?: IOpRequestHeaders;
    PUT?: IOpRequestHeaders;
    DELETE?: IOpRequestHeaders;
    PATCH?: IOpRequestHeaders;
    OPTIONS?: IOpRequestHeaders;
    CONNECT?: IOpRequestHeaders;
    TRACE?: IOpRequestHeaders;
  };
  DEFAULT_DELAY?: Number;
}

interface IOpContext {
  [id: string]: any;
}

interface IOpRequestBase {
  CHECK?: string;
  HEADERS?: IOpRequestHeaders;
  DELAY?: Number;
  ASSIGN_TO?: string;
}

interface IOpRequestGET extends IOpRequestBase {
  GET: string;
}

interface IOpRequestHEAD extends IOpRequestBase {
  HEAD: string;
}

interface IOpRequestPOST extends IOpRequestBase {
  POST: string;
  BODY?: {} | string;
}

interface IOpRequestPUT extends IOpRequestBase {
  PUT: string;
  BODY?: {} | string;
}

interface IOpRequestDELETE extends IOpRequestBase {
  DELETE: string;
}

interface IOpRequestPATCH extends IOpRequestBase {
  PATCH: string;
  BODY?: {} | string;
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
  body?: string;
}

interface IOpRequestHeaders {
  [id: string]: string;
}

interface OpResponseHeaders {
  [id: string]: string;
}

type OpRequest =
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
