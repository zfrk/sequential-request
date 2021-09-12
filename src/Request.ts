export abstract class Request {
  protected config: IOpConfig;
  protected requests: IOpRequest[];
  protected fetchHandler: OpRequestHandler | undefined;
  protected counter = 0;

  protected readonly BINDING_REGEX = /^= .{1,}/m;
  protected readonly handler;

  /**
   * @constructor
   * @param ***** Some Info about param
   */
  protected constructor(config: IOpConfig, requests: IOpRequest[], fetchHandler: OpRequestHandler) {
    this.config = config;
    this.requests = requests;
    this.fetchHandler = fetchHandler;
    this.handler = this.fetchHandler;
  }
  /**
   * Some Info :)
   * @returns Promise<any>
   * @public
   */
  public abstract execute(): Promise<any>;

  /**
   * Some Info :)
   * @param ***** Some Info about param
   * @returns Promise<{}>
   * @protected
   */
  protected abstract handleRequest(currentContext: IOpPlainObject): Promise<{}>;
}
