import  { SequentialRequest } from "..";

const myFetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        id: 1,
        text: "lorem ipsum",
      }),
    headers: {},
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
    BASE: `https://someurl.com`,
  };

  const operations: OpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest( config,operations,myFetch);
  
  const response = await seqreq.execute();

  expect(response).toEqual({
    id: 1,
    text: "lorem ipsum",
  });
});

test("Deep initial context", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    BASE: `https://someurl.com`,
    INITIAL_CONTEXT: {
      test: "deneme",
      a: {
        b: "c",
      },
    },
  };

  const operations: OpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest( config,operations,myFetch);
  const response = await  await seqreq.execute();

  expect(response).toEqual({
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
    BASE: `https://someurl.com`,
    INITIAL_CONTEXT: {
      id: "xyz",
    },
  };

  const operations: OpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];

  const seqreq = new SequentialRequest( config,operations,myFetch);
  const response = await seqreq.execute();

  expect(response).toEqual({
    id: 1,
    text: "lorem ipsum",
  });
});
