export function isMethodGET(request: IOpRequest): request is IOpRequestGET {
  return !!(request as IOpRequestGET).GET;
}

export function isMethodPOST(request: IOpRequest): request is IOpRequestPOST {
  return !!(request as IOpRequestPOST).POST;
}

export function isMethodPUT(request: IOpRequest): request is IOpRequestPUT {
  return !!(request as IOpRequestPUT).PUT;
}

export function isMethodDELETE(request: IOpRequest): request is IOpRequestDELETE {
  return !!(request as IOpRequestDELETE).DELETE;
}

export function isMethodHEAD(request: IOpRequest): request is IOpRequestHEAD {
  return !!(request as IOpRequestHEAD).HEAD;
}

export function isMethodPATCH(request: IOpRequest): request is IOpRequestPATCH {
  return !!(request as IOpRequestPATCH).PATCH;
}

export function isMethodOPTIONS(request: IOpRequest): request is IOpRequestOPTIONS {
  return !!(request as IOpRequestOPTIONS).OPTIONS;
}

export function isMethodCONNECT(request: IOpRequest): request is IOpRequestCONNECT {
  return !!(request as IOpRequestCONNECT).CONNECT;
}

export function isMethodTRACE(request: IOpRequest): request is IOpRequestTRACE {
  return !!(request as IOpRequestTRACE).TRACE;
}

export function getRequestMethod(request: IOpRequest): IOpRequestMethodData {
  if (isMethodPOST(request)) {
    return { method: "POST", path: request.POST, body: request.BODY };
  } else if (isMethodPUT(request)) {
    return { method: "PUT", path: request.PUT, body: request.BODY };
  } else if (isMethodDELETE(request)) {
    return { method: "DELETE", path: request.DELETE };
  } else if (isMethodHEAD(request)) {
    return { method: "HEAD", path: request.HEAD };
  } else if (isMethodOPTIONS(request)) {
    return { method: "OPTIONS", path: request.OPTIONS };
  } else if (isMethodCONNECT(request)) {
    return { method: "CONNECT", path: request.CONNECT };
  } else if (isMethodPATCH(request)) {
    return { method: "PATCH", path: request.PATCH, body: request.BODY };
  } else if (isMethodTRACE(request)) {
    return { method: "TRACE", path: request.TRACE };
  }
  return { method: "GET", path: request.GET };
}
