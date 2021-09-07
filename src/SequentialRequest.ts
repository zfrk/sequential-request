import jsonata = require('jsonata');
import { Request } from './Request';
import { getRequestMethod } from './methodHelper';
class SequentialRequest extends Request {

  constructor(
    config: OpConfig,
    requests: OpRequest[],
    fetchHandler?: OpRequestHandler){
    
      super(config,requests,fetchHandler);
  }

  public async execute() : Promise<any> {

    const initialContext = { ...this.config.INITIAL_CONTEXT };
    if (this.requests.length < 1) {
      return initialContext;
    }

    return await this.handleRequest(initialContext);

  }

  protected async handleRequest(currentContext: OpContext) : Promise<{}> {
    const requestData = this.requests[this.counter++];
    if (!requestData) {
      return currentContext;
    }

    const replacer = this.createReplacer(currentContext, {});

    const { method, path, body } = getRequestMethod(requestData, replacer);
    const url = `${this.config.BASE}${path}`;
    const headers = this.bindHeaders(
      {
        ...this.config.DEFAULT_HEADERS?.ALL,
        ...this.config.DEFAULT_HEADERS?.[method],
        ...requestData.HEADERS,
      },
      replacer,
    );

    const params = {
      method,
      body,
      headers,
    };

    const responseContext = await this.handler(url, params).then((res) => res.json());

    return this.handleRequest({ ...currentContext, ...responseContext });
  }

  private createReplacer(context: OpContext, environment: {}) {
    return (k: string, v: any) => {
      if (typeof v === "string" && v.length > 2) {
        let expression;
        if (this.SIMPLE_BINDING.test(v)) {
          expression = jsonata(v);
        } else if (this.COMPLEX_BINDING.test(v.trim())) {
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
  
  private bindHeaders(headers: OpRequestHeaders, replacer: OpContextReplacer) {
    return Object.entries(headers)
      .map(([key, value]) => [key, replacer(key, value)])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

}
