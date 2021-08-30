interface OpConfig {
  INITIAL_CONTEXT?: Object;
  VERSION?: string;
  BASE?: string;
  DEFAULT_DELAY?: Number;
}

interface OpRequestBase {
  CHECK?: string;
  HEADERS?: Object;
  DELAY?: Number;
  SAVEAS?: string;
}

interface OpRequestGET extends OpRequestBase {
  GET: string;
}

interface OpRequestHEAD extends OpRequestBase {
  HEAD: string;
}

interface OpRequestPOST extends OpRequestBase {
  POST: string;
  BODY: Object | string;
}

interface OpRequestPUT extends OpRequestBase {
  PUT: string;
  BODY: Object | string;
}

interface OpRequestDELETE extends OpRequestBase {
  DELETE: string;
}

interface OpRequestPATCH extends OpRequestBase {
  PATCH: string;
  BODY: Object | string;
}

interface OpRequestOPTIONS extends OpRequestBase {
  OPTIONS: string;
}

interface OpRequestCONNECT extends OpRequestBase {
  CONNECT: string;
}

interface OpRequestTRACE extends OpRequestBase {
  TRACE: string;
}

interface OpRequestMethodData {
  method: OpRequestMethod;
  path: string;
}

type OpRequest =
  | OpRequestGET
  | OpRequestHEAD
  | OpRequestPOST
  | OpRequestPUT
  | OpRequestDELETE
  | OpRequestPATCH
  | OpRequestOPTIONS
  | OpRequestCONNECT
  | OpRequestTRACE;

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
