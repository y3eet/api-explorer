import { ParameterObject } from "openapi3-ts/oas30";

export type ApiEndpoint = {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  path: string;
  description: string;
  parameters?: {
    path?: ParameterObject[];
    query?: ParameterObject[];
    header?: ParameterObject[];
    cookie?: ParameterObject[];
  };
  requestBody?: {
    required: boolean;
    contentType: string;
    schema: any;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: any;
      headers?: { [key: string]: any };
    };
  };
  security?: any[];
};
