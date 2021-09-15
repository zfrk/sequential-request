import { Headers } from "node-fetch";
import { SequentialRequest } from "..";

const myFetch = jest.fn(() =>
  Promise.resolve({
    text: () =>
      Promise.resolve(
        JSON.stringify({
          id: 1,
          text: "lorem ipsum",
        }),
      ),
    headers: new Headers({}),
    ok: true,
    status: 200,
  }),
);

beforeEach(() => {
  myFetch.mockClear();
});

test("Without initial context", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
  };

  const operations: IOpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest(config, operations, myFetch);

  const response = await seqreq.execute();

  expect(response).toMatchObject({
    id: 1,
    text: "lorem ipsum",
  });
});

test("Deep initial context", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
    INITIAL_CONTEXT: {
      test: "deneme",
      a: {
        b: "c",
      },
    },
  };

  const operations: IOpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest(config, operations, myFetch);
  const response = await await seqreq.execute();

  expect(response).toMatchObject({
    test: "deneme",
    a: {
      b: "c",
    },
    id: 1,
    text: "lorem ipsum",
  });
});

test("Overwrite existing data", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE_URL: `https://someurl.com`,
    INITIAL_CONTEXT: {
      id: "xyz",
    },
  };

  const operations: IOpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest(config, operations, myFetch);
  const response = await seqreq.execute();

  expect(response).toMatchObject({
    id: 1,
    text: "lorem ipsum",
  });
});
