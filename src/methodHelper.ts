function isMethodGET(request: OpRequest): request is OpRequestGET {
  return !!(request as OpRequestGET).GET;
}

function isMethodPOST(request: OpRequest): request is OpRequestPOST {
  return !!(request as OpRequestPOST).POST;
}

function isMethodPUT(request: OpRequest): request is OpRequestPUT {
  return !!(request as OpRequestPUT).PUT;
}

function isMethodDELETE(request: OpRequest): request is OpRequestDELETE {
  return !!(request as OpRequestDELETE).DELETE;
}

function isMethodHEAD(request: OpRequest): request is OpRequestHEAD {
  return !!(request as OpRequestHEAD).HEAD;
}

function isMethodPATCH(request: OpRequest): request is OpRequestPATCH {
  return !!(request as OpRequestPATCH).PATCH;
}

function isMethodOPTIONS(request: OpRequest): request is OpRequestOPTIONS {
  return !!(request as OpRequestOPTIONS).OPTIONS;
}

function isMethodCONNECT(request: OpRequest): request is OpRequestCONNECT {
  return !!(request as OpRequestCONNECT).CONNECT;
}

function isMethodTRACE(request: OpRequest): request is OpRequestTRACE {
  return !!(request as OpRequestTRACE).TRACE;
}

export function getRequestMethod(request: OpRequest): OpRequestMethodData {
  if (isMethodPOST(request)) {
    return { method: "POST", path: request.POST };
  } else if (isMethodPUT(request)) {
    return { method: "PUT", path: request.PUT };
  } else if (isMethodDELETE(request)) {
    return { method: "DELETE", path: request.DELETE };
  } else if (isMethodHEAD(request)) {
    return { method: "HEAD", path: request.HEAD };
  } else if (isMethodOPTIONS(request)) {
    return { method: "OPTIONS", path: request.OPTIONS };
  } else if (isMethodCONNECT(request)) {
    return { method: "CONNECT", path: request.CONNECT };
  } else if (isMethodPATCH(request)) {
    return { method: "PATCH", path: request.PATCH };
  } else if (isMethodTRACE(request)) {
    return { method: "TRACE", path: request.TRACE };
  }
  return { method: "GET", path: request.GET };
}
