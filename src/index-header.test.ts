import { executeBatch } from ".";

test("Check params", async () => {
  const config: OpConfig = {
    VERSION: "0.0.1",
    BASE: `https://someurl.com`,
  };

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

  const operations: OpRequest[] = [
    {
      GET: "/todos/1",
      HEADERS: {
        customHeader: "test",
      },
    },
  ];

  await executeBatch(config, operations, myFetch);
  expect(myFetch).toBeCalledTimes(1);
});
