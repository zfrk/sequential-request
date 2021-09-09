export abstract class Request {
  protected config: IOpConfig;
  protected requests: IOpRequest[];
  protected fetchHandler: OpRequestHandler | undefined;
  protected counter = 0;

  protected readonly SIMPLE_BINDING = /^\$\.([.\w])+$/m;
  protected readonly COMPLEX_BINDING = /^= .{1,}/m;
  protected readonly handler;

  /**
   * @constructor
   * @param ***** Some Info about param
   */
  protected constructor(
    config: IOpConfig,
    requests: IOpRequest[],
    fetchHandler?: OpRequestHandler,
  ) {
    this.config = config;
    this.requests = requests;
    this.fetchHandler = fetchHandler;
    this.handler = this.fetchHandler || globalThis.fetch || fetch;
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
  protected abstract handleRequest(currentContext: IOpContext): Promise<{}>;
}
