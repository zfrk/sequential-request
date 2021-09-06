import seqreq from ".";

test("Two simple get request", async () => {
  const config: OpConfig = {
    VERSION: "0.0.1",
    BASE: `https://someurl.com`,
  };

  const operations: OpRequest[] = [
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

  const context = await seqreq(config, operations, myFetch);
  expect(myFetch).toBeCalledTimes(2);
  expect(context).toEqual({ _1: "myID: _1", _2: "myID: _2" });
});
