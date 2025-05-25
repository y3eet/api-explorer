import { useState, useEffect } from "react";
import { ApiEndpoint, RequestData, ResponseData } from "../types";
import {
  buildUrl,
  generateSampleData,
  getDefaultValue,
  getMethodColor,
} from "../lib/utils";
import { Trash2 } from "lucide-react";
import ParametersTab from "./ParametersTab";
import BodyTab from "./BodyTab";
import ResponseTab from "./ResponseTab";
import { useApiEndpoint } from "./ApiProvider";

interface EndpointTesterProps {
  endpoint: ApiEndpoint;
}

export default function EndpointTester({ endpoint }: EndpointTesterProps) {
  const [activeTab, setActiveTab] = useState<
    "parameters" | "body" | "responses" | "test"
  >("test");

  const [requestData, setRequestData] = useState<RequestData>({
    pathParams: {},
    queryParams: {},
    headers: { "Content-Type": "application/json" },
    body: "",
  });

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState(endpoint.baseUrl);

  // Initialize request data with default values based on schema
  useEffect(() => {
    const initialData: RequestData = {
      pathParams: {},
      queryParams: {},
      headers: { "Content-Type": "application/json" },
      body: "",
    };

    // Initialize path parameters
    if (endpoint.parameters?.path) {
      endpoint.parameters.path.forEach((param) => {
        if (param.required) {
          const schema = param.schema as any;
          initialData.pathParams[param.name] = getDefaultValue(schema);
        }
      });
    }

    // Initialize query parameters
    if (endpoint.parameters?.query) {
      endpoint.parameters.query.forEach((param) => {
        if (param.required) {
          const schema = param.schema as any;
          initialData.queryParams[param.name] = getDefaultValue(schema);
        }
      });
    }

    // Initialize headers
    if (endpoint.parameters?.header) {
      endpoint.parameters.header.forEach((param) => {
        if (param.required) {
          initialData.headers[param.name] = "";
        }
      });
    }

    // Initialize request body
    if (endpoint.requestBody?.required && endpoint.requestBody.schema) {
      initialData.body = JSON.stringify(
        generateSampleData(endpoint.requestBody.schema),
        null,
        2
      );
    }

    setRequestData(initialData);
  }, [endpoint]);

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const url = buildUrl(baseUrl, endpoint, requestData);
      const options: RequestInit = {
        method: endpoint.method,
        headers: { ...requestData.headers },
      };

      if (
        endpoint.method !== "GET" &&
        endpoint.method !== "HEAD" &&
        requestData.body
      ) {
        options.body = requestData.body;
      }

      const fetchResponse = await fetch(url, options);

      const responseHeaders: { [key: string]: string } = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData;
      const contentType = fetchResponse.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await fetchResponse.json();
      } else {
        responseData = await fetchResponse.text();
      }

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data: responseData,
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePathParam = (name: string, value: string) => {
    setRequestData((prev) => ({
      ...prev,
      pathParams: { ...prev.pathParams, [name]: value },
    }));
  };

  const updateQueryParam = (name: string, value: string) => {
    setRequestData((prev) => ({
      ...prev,
      queryParams: { ...prev.queryParams, [name]: value },
    }));
  };

  const updateHeader = (name: string, value: string) => {
    setRequestData((prev) => ({
      ...prev,
      headers: { ...prev.headers, [name]: value },
    }));
  };

  const removeHeader = (name: string) => {
    setRequestData((prev) => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[name];
      return { ...prev, headers: newHeaders };
    });
  };

  const addHeader = () => {
    const name = prompt("Header name:");
    if (name) {
      updateHeader(name, "");
    }
  };
  const { deleteApi } = useApiEndpoint();

  return (
    <>
      <div className="rounded-lg max-w-4xl w-full mx-4 h-full card card-border bg-base-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{endpoint.name}</h2>
                <div className={`badge ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </div>
              </div>
              <code className="bg-base-200 px-2 py-1 rounded">
                {endpoint.path}
              </code>
              {endpoint.description && (
                <p className="text-base-content/70 mt-2">
                  {endpoint.description}
                </p>
              )}
            </div>
            <button
              className="btn btn-ghost btn-square btn-sm text-error"
              title="Remove endpoint"
              onClick={() => deleteApi(endpoint.id)}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered mb-4">
            <button
              className={`tab ${activeTab === "test" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("test")}
            >
              🧪 Test API
            </button>
            <button
              className={`tab ${
                activeTab === "parameters" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("parameters")}
            >
              Parameters
            </button>
            <button
              className={`tab ${activeTab === "body" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("body")}
            >
              Request Body
            </button>
            <button
              className={`tab ${activeTab === "responses" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("responses")}
            >
              Responses
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "test" && (
            <div className="space-y-6">
              {/* Base URL */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Base URL</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:3000"
                />
              </div>

              {/* URL Preview */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Request URL</span>
                </label>
                <code className="bg-base-200 p-2 rounded block text-sm break-all">
                  {buildUrl(baseUrl, endpoint, requestData)}
                </code>
              </div>

              {/* Path Parameters */}
              {endpoint.parameters?.path &&
                endpoint.parameters.path.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Path Parameters</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.path.map((param, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <label className="label min-w-24">
                            <span className="label-text">{param.name}</span>
                            {param.required && (
                              <span className="text-error">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            value={requestData.pathParams[param.name] || ""}
                            onChange={(e) =>
                              updatePathParam(param.name, e.target.value)
                            }
                            placeholder={
                              param.description || `Enter ${param.name}`
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Query Parameters */}
              {endpoint.parameters?.query &&
                endpoint.parameters.query.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Query Parameters</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.query.map((param, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <label className="label min-w-24">
                            <span className="label-text">{param.name}</span>
                            {param.required && (
                              <span className="text-error">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            value={requestData.queryParams[param.name] || ""}
                            onChange={(e) =>
                              updateQueryParam(param.name, e.target.value)
                            }
                            placeholder={
                              param.description || `Enter ${param.name}`
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Headers */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Headers</h3>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={addHeader}
                  >
                    Add Header
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(requestData.headers).map(([name, value]) => (
                    <div key={name} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          removeHeader(name);
                          updateHeader(newName, value);
                        }}
                        placeholder="Header name"
                      />
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={value}
                        onChange={(e) => updateHeader(name, e.target.value)}
                        placeholder="Header value"
                      />
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => removeHeader(name)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              {(endpoint.method === "POST" ||
                endpoint.method === "PUT" ||
                endpoint.method === "PATCH") && (
                <div>
                  <h3 className="font-semibold mb-2">Request Body</h3>
                  <textarea
                    className="textarea textarea-bordered w-full h-32"
                    value={requestData.body}
                    onChange={(e) =>
                      setRequestData((prev) => ({
                        ...prev,
                        body: e.target.value,
                      }))
                    }
                    placeholder="Enter request body (JSON)"
                  />
                </div>
              )}

              {/* Execute Button */}
              <div className="flex gap-2">
                <button
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  onClick={executeRequest}
                  disabled={loading}
                >
                  {loading ? "Sending..." : `Send ${endpoint.method} Request`}
                </button>
              </div>

              {/* Response */}
              {response && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Response</h3>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`badge ${
                        response.status >= 200 && response.status < 300
                          ? "badge-success"
                          : response.status >= 400
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                  </div>

                  {/* Error */}
                  {response.error && (
                    <div className="alert alert-error mb-3">
                      <span>{response.error}</span>
                    </div>
                  )}

                  {/* Response Headers */}
                  {Object.keys(response.headers).length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Response Headers:</h4>
                      <pre className="bg-base-200 p-2 rounded text-xs">
                        {Object.entries(response.headers)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join("\n")}
                      </pre>
                    </div>
                  )}

                  {/* Response Body */}
                  {response.data !== null && (
                    <div>
                      <h4 className="font-medium mb-1">Response Body:</h4>
                      <pre className="bg-base-200 p-3 rounded text-sm max-h-96">
                        {typeof response.data === "string"
                          ? response.data
                          : JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "parameters" && <ParametersTab endpoint={endpoint} />}

          {activeTab === "body" && <BodyTab endpoint={endpoint} />}

          {activeTab === "responses" && <ResponseTab endpoint={endpoint} />}
        </div>
      </div>
    </>
  );
}
