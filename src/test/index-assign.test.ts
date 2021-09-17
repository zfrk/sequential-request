import { Headers } from "node-fetch";
import { SequentialRequest } from "..";

test("Assign command", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    INITIAL_CONTEXT: {
      variable1: "deneme",
    },
  };

  const operations: IOpRequest[] = [
    {
      POST: "/",
      BODY: {},
      ASSIGN: {
        assignedVariable: "= $.RESPONSE.BODY.responseValue",
      },
    },
  ];

  const myFetch = jest.fn((url, params) => {
    return Promise.resolve({
      text: () =>
        Promise.resolve(
          JSON.stringify({
            responseValue: "responseText",
          }),
        ),
      headers: new Headers({
        "content-type": "application/json",
      }),
      ok: true,
      status: 200,
    });
  });

  const seqreq = new SequentialRequest(config, operations, myFetch);

  const response = await seqreq.execute();
  expect(response).toMatchObject({
    variable1: "deneme",
    assignedVariable: "responseText",
  });
});

test("Assign string value deeply", async () => {
  const config: IOpConfig = {
    VERSION: "0.0.1",
    INITIAL_CONTEXT: {
      variable1: "deneme",
    },
  };

  const operations: IOpRequest[] = [
    {
      POST: "/",
      BODY: {},
      ASSIGN: "= $.RESPONSE.BODY",
    },
  ];

  const myFetch = jest.fn((url, params) => {
    return Promise.resolve({
      text: () =>
        Promise.resolve(
          JSON.stringify({
            responseValue: "responseText",
          }),
        ),
      headers: new Headers({
        "content-type": "application/json",
      }),
      ok: true,
      status: 200,
    });
  });

  const seqreq = new SequentialRequest(config, operations, myFetch);

  const response = await seqreq.execute();
  expect(response).toMatchObject({
    variable1: "deneme",
    responseValue: "responseText",
  });
});
