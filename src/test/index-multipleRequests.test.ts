import { SequentialRequest } from "..";

test("Two simple get request", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
  };

  const operations: IOpRequest[] = [
    {
      GET: "/query_1",
    },
    {
      GET: "/query_2",
    },
  ];

  const myFetch = jest.fn((url: string, params) => {
    const id = url.split("query")[1];

    return Promise.resolve({
      json: () =>
        Promise.resolve({
          [id]: `myID: ${id}`,
        }),
    });
  });

  const seqreq = new SequentialRequest(config, operations, myFetch);

  const context = await seqreq.execute();
  expect(myFetch).toBeCalledTimes(2);
  expect(context).toEqual({ _1: "myID: _1", _2: "myID: _2" });
});
