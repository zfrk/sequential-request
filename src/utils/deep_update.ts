export default function deep_update(oObject: object, replacer: (key: any, value: any) => any) {
  return recursiveCopy("", oObject);

  function recursiveCopy(key: any, value: any) {
    let transformed: any;
    let clone: any;
    if (type_of(replacer) === "function") {
      transformed = replacer(key, value);
    } else {
      transformed = value;
    }
    if (is_primitive(transformed)) {
      clone = transformed;
    } else if (type_of(transformed) === "date") {
      clone = new Date(transformed.getTime());
    } else if (type_of(transformed) === "array") {
      clone = transformed.map(copyArrayObj);
    } else if (type_of(transformed) === "object") {
      const oDescriptors = Object.getOwnPropertyDescriptors(transformed);
      const oNewDescriptors: PropertyDescriptorMap = {};
      Object.entries(oDescriptors).forEach((aProps) => {
        const name = aProps[0];
        const oDescriptor = aProps[1];
        const transformedValue = transformed[name];
        const finalValue = recursiveCopy(name, transformedValue);
        if (finalValue !== undefined) {
          oDescriptor.value = finalValue;
          oNewDescriptors[name] = oDescriptor;
        }
      });
      clone = Object.create({}, oNewDescriptors);
    }
    return clone;
  }

  function copyArrayObj(value: any, index: any) {
    return recursiveCopy(index, value);
  }
}

const rTypeofMatch = /^\[object\s(.*)\]$/;

function type_of(value: any): string {
  return Object.prototype.toString.call(value)?.match(rTypeofMatch)?.[1].toLowerCase() || "unknown";
}

function is_primitive(value: any) {
  return value === null || /^[bsnu]/.test(typeof value);
}
