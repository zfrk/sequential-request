import { SequentialRequest } from "..";

test("Check params", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
  };

  const operations: IOpRequest[] = [
    {
      GET: "/todos/1",
      HEADERS: {
        customHeader: "test",
      },
    },
  ];

  const myFetch = jest.fn((url, params) => {
    expect(url).toEqual("https://someurl.com/todos/1");

    expect(params).toEqual({
      headers: { customHeader: "test" },
      method: "GET",
    });

    return Promise.resolve({
      json: () => Promise.resolve({}),
      headers: {
        "content-type": "application/json",
      },
      ok: true,
      status: 200,
    });
  });

  const seqreq = new SequentialRequest(config, operations, myFetch);

  await seqreq.execute();
  expect(myFetch).toBeCalledTimes(1);
});

test("Config headers params", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
    DEFAULT: {
      HEADERS: {
        "content-type": "application/json",
        "x-overwrite-this": "old value",
      },
    },
    DEFAULT_GET: {
      HEADERS: {
        "x-get-header": "my custom get header",
        "x-overwrite-this": "new value",
      },
    },
  };

  const operations: IOpRequest[] = [
    {
      GET: "/todos/1",
      HEADERS: {
        "x-custom-header": "test",
      },
    },
  ];

  const myFetch = jest.fn((url, params) => {
    expect(url).toEqual("https://someurl.com/todos/1");

    expect(params).toEqual({
      body: undefined,
      headers: {
        "content-type": "application/json",
        "x-custom-header": "test",
        "x-get-header": "my custom get header",
        "x-overwrite-this": "new value",
      },
      method: "GET",
    });

    return Promise.resolve({
      json: () => Promise.resolve({}),
      headers: {
        "content-type": "application/json",
      },
      ok: true,
      status: 200,
    });
  });
  const seqreq = new SequentialRequest(config, operations, myFetch);

  await seqreq.execute();
  expect(myFetch).toBeCalledTimes(1);
});
