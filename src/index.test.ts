import { executeBatch } from ".";
import fetch from "node-fetch";

test("Simple request", async () => {
  const config: OpConfig = {
    VERSION: "0.0.1",
    BASE: `https://jsonplaceholder.typicode.com`,
    INITIAL_CONTEXT: {
      test: "deneme",
    },
  };

  const operations: OpRequest[] = [
    {
      GET: "/todos/1",
    },
  ];
  const response = await executeBatch(config, operations, fetch);

  expect(response).toEqual({
    test: "deneme",
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  });
});

test.skip("Multistep test", async () => {
  const config: OpConfig = {
    VERSION: "0.0.1",
    BASE: `https://jsonplaceholder.typicode.com/`,
    INITIAL_CONTEXT: {
      test: "deneme",
    },
  };

  const operations: OpRequest[] = [
    {
      POST: "/Person",
      HEADERS: {
        CustomHeader: "value",
      },
      BODY: {
        FirstName: "John",
        LastName: "Doe",
      },
    },
    {
      PUT: "/Person",
      BODY: {
        _id: "$._id",
        Age: 42,
      },
    },
    {
      POST: "/Phone",
      BODY: {
        Entity1Id: "$._id",
        Type: "Home",
        Number: "+0123456789",
      },
    },
    {
      GET: "/Person('John Doe')/Phone",
      SAVEAS: "JOHN_PHONE",
    },
    {
      PUT: "/Phone",
      BODY: {
        _id: "$.JOHN_PHONE._id",
        Number: "+9087654321",
      },
    },
    {
      GET: "/Person",
      CHECK: "= $.STATUS_CODE < 300",
    },
  ];

  const result = executeBatch(config, operations, fetch);

  expect(result).toBeTruthy();
});
