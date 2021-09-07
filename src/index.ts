import fetch from "node-fetch";
import { getRequestMethod } from "./methodHelper";
import jsonata = require("jsonata");

const SIMPLE_BINDING = /^\$\.([.\w])+$/m;
const COMPLEX_BINDING = /^= .{1,}/m;

export default async function seqreq(
  config: OpConfig,
  requests: OpRequest[],
  fetchHandler?: OpRequestHandler,
): Promise<any> {
  const handler = fetchHandler || globalThis.fetch || fetch;
  const initialContext = { ...config.INITIAL_CONTEXT };
  let counter = 0;

  if (requests.length < 1) {
    return initialContext;
  }

  return handleRequest(initialContext);

  async function handleRequest(currentContext: OpContext): Promise<{}> {
    const requestData = requests[counter++];
    if (!requestData) {
      return currentContext;
    }

    const replacer = createReplacer(currentContext, {});

    const { method, path, body } = getRequestMethod(requestData, replacer);
    const url = `${config.BASE || ""}${path}`;
    const headers = bindHeaders(
      {
        ...config.DEFAULT_HEADERS?.ALL,
        ...config.DEFAULT_HEADERS?.[method],
        ...requestData.HEADERS,
      },
      replacer,
    );

    const params = {
      method,
      body,
      headers,
    };

    const responseContext = await handler(url, params).then((res) => res.json());

    return handleRequest({ ...currentContext, ...responseContext });
  }
}

function createReplacer(context: OpContext, environment: {}) {
  return (k: string, v: any) => {
    if (typeof v === "string" && v.length > 2) {
      let expression;
      if (SIMPLE_BINDING.test(v)) {
        expression = jsonata(v);
      } else if (COMPLEX_BINDING.test(v.trim())) {
        expression = jsonata(v.substr(2).trim());
      }
      if (expression) {
        const result = expression.evaluate(context);
        return result;
      }
    }
    return v;
  };
}

function bindHeaders(headers: OpRequestHeaders, replacer: OpContextReplacer) {
  return Object.entries(headers)
    .map(([key, value]) => [key, replacer(key, value)])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
