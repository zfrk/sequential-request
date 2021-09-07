function isMethodGET(request: OpRequest): request is IOpRequestGET {
  return !!(request as IOpRequestGET).GET;
}

function isMethodPOST(request: OpRequest): request is IOpRequestPOST {
  return !!(request as IOpRequestPOST).POST;
}

function isMethodPUT(request: OpRequest): request is IOpRequestPUT {
  return !!(request as IOpRequestPUT).PUT;
}

function isMethodDELETE(request: OpRequest): request is IOpRequestDELETE {
  return !!(request as IOpRequestDELETE).DELETE;
}

function isMethodHEAD(request: OpRequest): request is IOpRequestHEAD {
  return !!(request as IOpRequestHEAD).HEAD;
}

function isMethodPATCH(request: OpRequest): request is IOpRequestPATCH {
  return !!(request as IOpRequestPATCH).PATCH;
}

function isMethodOPTIONS(request: OpRequest): request is IOpRequestOPTIONS {
  return !!(request as IOpRequestOPTIONS).OPTIONS;
}

function isMethodCONNECT(request: OpRequest): request is IOpRequestCONNECT {
  return !!(request as IOpRequestCONNECT).CONNECT;
}

function isMethodTRACE(request: OpRequest): request is IOpRequestTRACE {
  return !!(request as IOpRequestTRACE).TRACE;
}

export function getRequestMethod(
  request: OpRequest,
  replacer: OpContextReplacer,
): IOpRequestMethodData {
  if (isMethodPOST(request)) {
    const body =
      typeof request.BODY === "string" ? request.BODY : JSON.stringify(request.BODY, replacer);
    return { method: "POST", path: request.POST, body };
  } else if (isMethodPUT(request)) {
    const body =
      typeof request.BODY === "string" ? request.BODY : JSON.stringify(request.BODY, replacer);
    return { method: "PUT", path: request.PUT, body };
  } else if (isMethodDELETE(request)) {
    return { method: "DELETE", path: request.DELETE };
  } else if (isMethodHEAD(request)) {
    return { method: "HEAD", path: request.HEAD };
  } else if (isMethodOPTIONS(request)) {
    return { method: "OPTIONS", path: request.OPTIONS };
  } else if (isMethodCONNECT(request)) {
    return { method: "CONNECT", path: request.CONNECT };
  } else if (isMethodPATCH(request)) {
    const body =
      typeof request.BODY === "string" ? request.BODY : JSON.stringify(request.BODY, replacer);
    return { method: "PATCH", path: request.PATCH, body };
  } else if (isMethodTRACE(request)) {
    return { method: "TRACE", path: request.TRACE };
  }
  return { method: "GET", path: request.GET };
}
