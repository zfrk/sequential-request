import jsonata from "jsonata";
import { mergeDeepRight } from "ramda";
import { Request } from "./Request";
import { getRequestMethod } from "./methodHelper";
import { DEFAULT_CONFIG } from "./constants";
import * as setCookieParser from "set-cookie-parser";
import deep_update from "./utils/deep_update";
import Logger from "./Logger";
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
    const calculatedPath = deep_update({ target: path }, replacer).target;
    const url = `${this.config.BASE_URL}${calculatedPath}`;

    const configGenerator = this.getMethodBasedDefaultGenerator(method);

    const methodBasedConfig = configGenerator(requestData);
    // Logger.enable([]);
    Logger.title(method, url);

    let stringBody;
    if (typeof body === "string") {
      stringBody = body;
    } else if (typeof body === "object") {
      stringBody = JSON.stringify(body, replacer);
    }

    const headers = SequentialRequest.bindHeaders(methodBasedConfig.HEADERS || {}, replacer);

    const params = {
      method,
      body: stringBody,
      headers,
    };

    const response: Response = await this.handler(url, params);
    Logger.status(response.status, response.statusText);
    Logger.requestHeaders(headers);
    Logger.requestBody(stringBody);

    const responseText = await response.text();
    let responseBody: IOpPlainObject | string = {};

    try {
      responseBody = JSON.parse(responseText);
    } catch (error) {
      responseBody = responseText;
    }

    const cookieString = response.headers.get("set-cookie");
    const cookies = setCookieParser
      .splitCookiesString(cookieString || "")
      .map((x: string) => setCookieParser.parseString(x))
      .reduce((acc, x) => ({ ...acc, [x.name]: x }), {});

    const responseContext = {
      HEADERS: SequentialRequest.convertHeaderToObject(response.headers),
      COOKIES: cookies,
      BODY: responseBody,
      STATUS_CODE: response.status,
      STATUS_TEXT: response.statusText,
      STATUS_OK: response.ok,
    };

    Logger.responseHeaders(responseContext.HEADERS);
    Logger.verbose("Cookies: %O", cookies);
    Logger.responseBody(responseBody);

    const afterResponseContext = { ...currentContext, RESPONSE: responseContext };

    let replacedContext: any = {};
    if (methodBasedConfig.ASSIGN) {
      const responseReplacer = this.createReplacer(afterResponseContext, {});
      replacedContext = deep_update(
        {
          target: methodBasedConfig.ASSIGN,
        },
        responseReplacer,
      ).target;
    }
    await new Promise((resolve) => setTimeout(resolve, methodBasedConfig.DELAY));

    const finalContext = { ...afterResponseContext, ...replacedContext };

    Logger.context(finalContext);
    return this.handleRequest(finalContext);
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

  private static bindHeaders(headers: IOpRequestHeaders, replacer: OpContextReplacer) {
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

  private static convertHeaderToObject(header: Headers) {
    const result: IOpResponseHeaders = {};
    header.forEach((value, key) => {
      result[(key + "").toUpperCase()] = value;
    });
    return result;
  }
}
