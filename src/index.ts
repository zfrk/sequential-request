import fetch from "node-fetch";
import { getRequestMethod } from "./methodHelper";

export async function executeBatch(
  config: OpConfig,
  requests: OpRequest[],
  fetchHandler: OpRequestHandler,
): Promise<any> {
  const handler = fetchHandler || globalThis.fetch || fetch;
  const initialContext = { ...config.INITIAL_CONTEXT };
  let counter = 0;
  if (requests.length < 1) {
    return initialContext;
  }

  return (async function handleRequest(currentContext) {
    const requestData = requests[counter++];
    const { method, path } = getRequestMethod(requestData);
    const url = `${config.BASE}${path}`;
    const params = {
      method,
    };

    const responseContext = await handler(url, params).then((res) => res.json());
    console.log({ url, params });

    return { ...currentContext, ...responseContext };
  })(initialContext);
}
