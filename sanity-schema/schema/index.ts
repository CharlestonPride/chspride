import * as documentTypes from "./documents";
import * as objectTypes from "./objects";
import * as fieldTypes from "./fields";

export const schemaTypes = [
  ...Object.values(documentTypes),
  ...Object.values(objectTypes),
  ...Object.values(fieldTypes),
];
