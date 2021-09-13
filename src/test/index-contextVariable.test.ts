import { SequentialRequest } from "..";

test("Context variable in body", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
    INITIAL_CONTEXT: {
      variable1: "deneme",
    },
  };

  const operations: IOpRequest[] = [
    {
      POST: "/type/simple/binding",
      BODY: {
        test: "= $.variable1",
      },
    },
  ];

  const myFetch = jest.fn((url, params) => {
    expect(params.body).toEqual('{"test":"deneme"}');

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

test("Context variable in request headers", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
    DEFAULT_GET: {
      HEADERS: {
        "content-type": "= 'application/' & $.type",
      },
    },
    INITIAL_CONTEXT: {
      type: "json",
      customHeaderValue: "test is passed",
    },
  };

  const operations: IOpRequest[] = [
    {
      GET: "/simpleBinding",
      HEADERS: {
        "x-custom-header": "= $.customHeaderValue",
      },
    },
  ];

  const myFetch = jest.fn((url, params) => {
    expect(params.headers).toEqual({
      "x-custom-header": "test is passed",
      "content-type": "application/json",
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
