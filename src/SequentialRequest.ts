import jsonata from "jsonata";
import { mergeDeepRight } from "ramda";
import { Request } from "./Request";
import { getRequestMethod } from "./methodHelper";
import { DEFAULT_CONFIG } from "./constants";
export class SequentialRequest extends Request {
  constructor(config: IOpConfig, requests: IOpRequest[], fetchHandler: OpRequestHandler) {
    super(mergeDeepRight(DEFAULT_CONFIG, config) as IOpConfig, requests, fetchHandler);
  }

  public async execute(): Promise<any> {
    const initialContext = { ...this.config.INITIAL_CONTEXT };
    if (this.requests.length < 1) {
      return initialContext;
    }

    return await this.handleRequest(initialContext);
  }

  protected async handleRequest(currentContext: IOpPlainObject): Promise<{}> {
    const requestData = this.requests[this.counter++];
    if (!requestData) {
      return currentContext;
    }

    const replacer = this.createReplacer(currentContext, {});

    const { method, path, body } = getRequestMethod(requestData);

    const configGenerator = this.getMethodBasedDefaultGenerator(method);

    const methodBasedConfig = configGenerator(requestData);

    let stringBody;
    if (typeof body === "string") {
      stringBody = body;
    } else if (typeof body === "object") {
      stringBody = JSON.stringify(body, replacer);
    }

    const url = `${this.config.BASE_URL}${path}`;
    const headers = this.bindHeaders(methodBasedConfig.HEADERS || {}, replacer);

    const params = {
      method,
      body: stringBody,
      headers,
    };

    const responseContext = await this.handler(url, params).then((res) => res.json());

    return this.handleRequest({ ...currentContext, ...responseContext });
  }

  private createReplacer(context: IOpPlainObject, environment: {}) {
    return (k: string, v: any) => {
      if (typeof v === "string" && v.length > 2) {
        let expression;
        if (this.BINDING_REGEX.test(v.trim())) {
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

  private bindHeaders(headers: IOpRequestHeaders, replacer: OpContextReplacer) {
    return Object.entries(headers)
      .map(([key, value]) => [key, replacer(key, value)])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  private getMethodBasedDefaultGenerator(
    methodName: OpRequestMethod,
  ): (requestData: IOpRequest) => IOpRequest {
    const key = ("DEFAULT_" + methodName) as keyof IOpConfig;
    const selected = this.config[key] as IOpRequest;
    const merged = mergeDeepRight(this.config.DEFAULT || {}, selected) as any;
    return mergeDeepRight(merged || {}) as (requestData: IOpRequest) => IOpRequest;
  }
}
