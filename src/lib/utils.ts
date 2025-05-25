import { ApiEndpoint, RequestData } from "./../types";
export const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "badge-success";
    case "POST":
      return "badge-primary";
    case "PUT":
      return "badge-warning";
    case "DELETE":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export const generateSampleValue = (schema: any): any => {
  if (!schema) return null;

  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  switch (schema.type) {
    case "string":
      if (schema.format === "email") return "user@example.com";
      if (schema.format === "date") return "2024-01-01";
      if (schema.format === "date-time") return "2024-01-01T00:00:00Z";
      if (schema.format === "uuid")
        return "123e4567-e89b-12d3-a456-426614174000";
      return "sample string";
    case "number":
      return 123.45;
    case "integer":
      return 123;
    case "boolean":
      return true;
    case "object":
      return generateSampleData(schema);
    case "array":
      return [generateSampleValue(schema.items)];
    default:
      return null;
  }
};

export const generateSampleData = (schema: any): any => {
  if (!schema) return {};

  if (schema.type === "object" && schema.properties) {
    const obj: any = {};
    Object.keys(schema.properties).forEach((key) => {
      const prop = schema.properties[key];
      obj[key] = generateSampleValue(prop);
    });
    return obj;
  }

  if (schema.type === "array" && schema.items) {
    return [generateSampleValue(schema.items)];
  }

  return generateSampleValue(schema);
};

export const getDefaultValue = (schema: any): string => {
  if (!schema) return "";

  switch (schema.type) {
    case "string":
      return schema.example || schema.default || "";
    case "number":
    case "integer":
      return String(schema.example || schema.default || 0);
    case "boolean":
      return String(schema.example || schema.default || false);
    default:
      return schema.example || schema.default || "";
  }
};

export const buildUrl = (
  baseUrl: string,
  endpoint: ApiEndpoint,
  requestData: RequestData
): string => {
  let url = baseUrl + endpoint.path;

  // Replace path parameters
  Object.entries(requestData.pathParams).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  });

  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.entries(requestData.queryParams).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  if (queryParams.toString()) {
    url += "?" + queryParams.toString();
  }

  return url;
};
