import deep_update from "../../utils/deep_update";

test("replace string", () => {
  const input = {
    field1: "value1",
    field2: 2,
  };

  const expected = {
    field1: "replaced",
    field2: 2,
  };

  const replacer = (key: any, value: any) => {
    if (key === "field1") {
      return "replaced";
    }
    return value;
  };

  expect(deep_update(input, replacer)).toEqual(expected);
});

test("replace deep string", () => {
  const input = {
    field1: "value1",
    field2: 2,
    deep: {
      field3: 3,
      field4: false,
      deep_deep: {
        field5: 5,
      },
    },
  };

  const expected = {
    field1: "value1",
    field2: "2",
    deep: {
      field3: "3",
      field4: false,
      deep_deep: {
        field5: "5",
      },
    },
  };

  const replacer = (key: any, value: any) => {
    if (typeof value === "number") {
      return value + "";
    }
    return value;
  };

  expect(deep_update(input, replacer)).toEqual(expected);
});
