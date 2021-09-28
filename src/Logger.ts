import debug, { Debugger } from "debug";

const LOG_BASE = debug("seqreq");

class Logger {
  private debuggers: { [id in OpLoggerTypes]: Debugger };

  public constructor(private alwaysEnabled: OpLoggerTypes[] = ["STATUS", "TITLE"]) {
    this.debuggers = {
      CONTEXT: LOG_BASE.extend("CONTEXT"),
      REQ_BODY: LOG_BASE.extend("REQ_BODY"),
      REQ_HEADERS: LOG_BASE.extend("REQ_HEADERS"),
      RES_BODY: LOG_BASE.extend("RES_BODY"),
      RES_HEADERS: LOG_BASE.extend("RES_HEADERS"),
      STATUS: LOG_BASE.extend("STATUS"),
      TITLE: LOG_BASE.extend("TITLE"),
      LOG: LOG_BASE.extend("LOG"),
    };

    // tslint:disable-next-line: no-console
    Object.values(this.debuggers).forEach((d) => (d.log = console.log.bind(console)));
  }

  public enable(namespaces: OpLoggerTypes[]) {
    debug.enable(
      this.alwaysEnabled
        .concat(namespaces)
        .map((n) => `seqreq:${n.toUpperCase()}`)
        .join(","),
    );
  }

  public context(context: IOpPlainObject) {
    this.debuggers.CONTEXT("%O", context);
  }

  public requestHeaders(headers: IOpRequestHeaders) {
    this.debuggers.REQ_HEADERS("%O", headers);
  }

  public requestBody(body: object | string | undefined) {
    this.debuggers.REQ_BODY("%O", body);
  }

  public responseHeaders(headers: IOpResponseHeaders) {
    this.debuggers.RES_HEADERS("%O", headers);
  }

  public responseBody(body: object | string) {
    this.debuggers.RES_BODY("%O", body);
  }

  public status(statusCode: number, statusText: string) {
    this.debuggers.STATUS("%d => %s", statusCode, statusText);
  }

  public title(method: string, url: string) {
    this.debuggers.TITLE("%s: %s", method, url);
  }

  public verbose(formatter: any, ...args: any[]) {
    this.debuggers.LOG(formatter, ...args);
  }
}

export default new Logger();
