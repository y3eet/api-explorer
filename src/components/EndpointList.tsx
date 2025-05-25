import { ChevronDown, ChevronUp } from "lucide-react";
import {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from "openapi3-ts/oas30";
import { useEffect, useState } from "react";
import { ApiEndpoint } from "../types";
import { getMethodColor } from "../lib/utils";
import { useApiEndpoint } from "./ApiProvider";

export default function EndpointList({ baseUrl }: { baseUrl: string }) {
  async function fetchOpenAPI(): Promise<OpenAPIObject> {
    const res = await fetch(baseUrl + "/openapi.json");
    if (!res.ok) throw new Error(`Failed to fetch OpenAPI: ${res.statusText}`);
    const json = await res.json();
    return json as OpenAPIObject;
  }
  function resolveSchemaRef(ref: string, openApiSpec: OpenAPIObject): any {
    // Remove the "#/" prefix and split the path
    const path = ref.replace("#/", "").split("/");

    let current: any = openApiSpec;
    for (const segment of path) {
      current = current[segment];
      if (!current) {
        console.warn(`Could not resolve schema reference: ${ref}`);
        return null;
      }
    }

    return current;
  }
  // Enhanced function to recursively resolve all schema references
  function resolveSchema(schema: any, openApiSpec: OpenAPIObject): any {
    if (!schema) return null;

    // If it's a reference, resolve it
    if (schema.$ref) {
      const resolvedSchema = resolveSchemaRef(schema.$ref, openApiSpec);
      if (resolvedSchema) {
        // Recursively resolve the resolved schema in case it has nested references
        return resolveSchema(resolvedSchema, openApiSpec);
      }
      return null;
    }

    // If it's an object with properties, resolve each property
    if (schema.type === "object" && schema.properties) {
      const resolvedProperties: any = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        resolvedProperties[key] = resolveSchema(value, openApiSpec);
      }
      return {
        ...schema,
        properties: resolvedProperties,
      };
    }

    // If it's an array, resolve the items schema
    if (schema.type === "array" && schema.items) {
      return {
        ...schema,
        items: resolveSchema(schema.items, openApiSpec),
      };
    }

    // If it has allOf, anyOf, oneOf, resolve each schema
    if (schema.allOf) {
      return {
        ...schema,
        allOf: schema.allOf.map((s: any) => resolveSchema(s, openApiSpec)),
      };
    }

    if (schema.anyOf) {
      return {
        ...schema,
        anyOf: schema.anyOf.map((s: any) => resolveSchema(s, openApiSpec)),
      };
    }

    if (schema.oneOf) {
      return {
        ...schema,
        oneOf: schema.oneOf.map((s: any) => resolveSchema(s, openApiSpec)),
      };
    }

    // Return the schema as-is if no references to resolve
    return schema;
  }
  async function getEndpoints(): Promise<ApiEndpoint[]> {
    try {
      const spec = await fetchOpenAPI();
      const endpoints: ApiEndpoint[] = [];

      for (const [path, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        for (const method of [
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "options",
          "head",
        ] as const) {
          const operation = pathItem[method] as OperationObject;
          if (!operation) continue;

          // ...existing parameter extraction code...

          // Extract request body information with resolved schema
          let requestBody;
          if (operation.requestBody) {
            const reqBody = operation.requestBody as RequestBodyObject;
            const contentTypes = Object.keys(reqBody.content || {});
            const primaryContentType = contentTypes[0] || "application/json";
            const content = reqBody.content?.[primaryContentType];

            requestBody = {
              required: reqBody.required || false,
              contentType: primaryContentType,
              schema: content?.schema
                ? resolveSchema(content.schema, spec)
                : null,
            };
          }

          // Extract response information with resolved schemas
          const responses: { [statusCode: string]: any } = {};
          if (operation.responses) {
            for (const [statusCode, response] of Object.entries(
              operation.responses
            )) {
              const resp = response as ResponseObject;
              const contentTypes = Object.keys(resp.content || {});
              const primaryContentType = contentTypes[0];
              const content = primaryContentType
                ? resp.content?.[primaryContentType]
                : undefined;

              responses[statusCode] = {
                description: resp.description,
                schema: content?.schema
                  ? resolveSchema(content.schema, spec)
                  : null,
                headers: resp.headers,
              };
            }
          }

          // Also resolve parameter schemas
          const parameters = {
            path: [] as ParameterObject[],
            query: [] as ParameterObject[],
            header: [] as ParameterObject[],
            cookie: [] as ParameterObject[],
          };

          const allParameters = [
            ...(pathItem.parameters || []),
            ...(operation.parameters || []),
          ];

          allParameters.forEach((param) => {
            const parameter = param as ParameterObject;
            // Resolve parameter schema if it exists
            if (parameter.schema) {
              parameter.schema = resolveSchema(parameter.schema, spec);
            }

            if (parameter.in === "path") parameters.path.push(parameter);
            else if (parameter.in === "query") parameters.query.push(parameter);
            else if (parameter.in === "header")
              parameters.header.push(parameter);
            else if (parameter.in === "cookie")
              parameters.cookie.push(parameter);
          });

          endpoints.push({
            id: `${method}-${path}`,
            name: operation.summary || `${method.toUpperCase()} ${path}`,
            method: method.toUpperCase() as ApiEndpoint["method"],
            path: path,
            description: operation.description || operation.summary || "",
            parameters: Object.values(parameters).some((arr) => arr.length > 0)
              ? parameters
              : undefined,
            requestBody,
            responses,
            security: operation.security,
            baseUrl,
          });
        }
      }

      return endpoints;
    } catch (error) {
      console.error("Failed to fetch endpoints:", error);
      return [];
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [hidden, setHidden] = useState(false);

  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function fetchEndpoints() {
    if (baseUrl) {
      getEndpoints().then((result) => {
        if (result) setEndpoints(result);
        else setEndpoints([]);
      });
    }
  }

  useEffect(() => {
    fetchEndpoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  if (!baseUrl) {
    return (
      <div className="text-center text-base-content/50 mt-8">
        <p>No url endpoints provided</p>
      </div>
    );
  }
  const { setSelectedEndpoint } = useApiEndpoint();
  return (
    <>
      {/* Endpoints List */}
      <div className="flex flex-col justify-between mb-10 p-4 bg-base-200 rounded-lg border border-base-300">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-primary">URL: {baseUrl}</span>
          <button onClick={fetchEndpoints} className="btn btn-soft btn-sm">
            Refresh
          </button>
        </div>
        <div className="flex items-center my-3">
          <input
            type="text"
            placeholder="Search endpoints..."
            className="input input-sm input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>
        {!hidden && (
          <>
            <div className="space-y-2">
              {filteredEndpoints.map((endpoint) => (
                <div key={endpoint.id}>
                  <div
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-base-300"
                  >
                    <div className="card-body p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="card-title text-sm">{endpoint.name}</h3>
                        <div
                          className={`badge badge-sm ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </div>
                      </div>
                      <p className="text-xs text-base-content/70 mb-2">
                        {endpoint.description}
                      </p>
                      <code className="text-xs bg-base-200 p-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredEndpoints.length === 0 && (
          <div className="text-center text-base-content/50">
            <p>No endpoints found</p>
          </div>
        )}
      </div>
    </>
  );
}
