import clone from "lodash/clone";
import toPath from "lodash/toPath";
import * as yup from "yup";

export const isObject = (obj) => obj !== null && typeof obj === "object";
export const isInteger = (obj) => String(Math.floor(Number(obj))) === obj;

function getIn(obj, key, def, p) {
  const path = toPath(key);
  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}

export function setIn(obj, path, value) {
  let res = clone(obj); // this keeps inheritance when obj is a class
  let resVal = res;
  let i = 0;
  let pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    let currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}

export const handleValidation = (fieldData, setValidationRunning) => {
  const result = fieldData.validate(fieldData, setValidationRunning);
  if ((result ?? "") === "") {
    return null;
  } else if (typeof result !== "string") {
    return "Invalid error type: expected string";
  }
  return result;
};

const validationConfig = {
  abortEarly: false,
  strict: true,
};

export const yupValidationHelper = (schema) => (
  { value },
  setValidationRunning
) => {
  try {
    schema.validateSync(value ?? null, validationConfig);
    return "";
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return e.errors[0];
    }
    return e.message;
  }
};
