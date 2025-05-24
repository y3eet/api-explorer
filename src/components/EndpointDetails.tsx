import { useState } from "react";
import { ApiEndpoint } from "../types";
import { getMethodColor } from "../lib/utils";

interface EndpointDetailsProps {
  endpoint: ApiEndpoint;
  onClose: () => void;
}

export default function EndpointDetails({
  endpoint,
  onClose,
}: EndpointDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    "parameters" | "body" | "responses"
  >("parameters");

  const renderSchema = (schema: any) => {
    if (!schema)
      return <span className="text-base-content/50">No schema defined</span>;

    return (
      <pre className="bg-base-200 p-3 rounded text-xs overflow-auto">
        {JSON.stringify(schema, null, 2)}
      </pre>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered mb-4">
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
          {activeTab === "parameters" && (
            <div className="space-y-4">
              {endpoint.parameters?.path &&
                endpoint.parameters.path.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Path Parameters</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.path.map((param, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm">
                              {param.name}
                            </span>
                            {param.required && (
                              <span className="badge badge-error badge-xs">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-base-content/70">
                            {param.description}
                          </p>
                          {param.schema && (
                            <div className="mt-2">
                              <span className="text-xs text-base-content/50">
                                Type:{" "}
                              </span>
                              <code className="text-xs">
                                {(param.schema as any).type}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {endpoint.parameters?.query &&
                endpoint.parameters.query.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Query Parameters</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.query.map((param, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm">
                              {param.name}
                            </span>
                            {param.required && (
                              <span className="badge badge-error badge-xs">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-base-content/70">
                            {param.description}
                          </p>
                          {param.schema && (
                            <div className="mt-2">
                              <span className="text-xs text-base-content/50">
                                Type:{" "}
                              </span>
                              <code className="text-xs">
                                {(param.schema as any).type}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {endpoint.parameters?.header &&
                endpoint.parameters.header.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Headers</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.header.map((param, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm">
                              {param.name}
                            </span>
                            {param.required && (
                              <span className="badge badge-error badge-xs">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-base-content/70">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {endpoint.parameters?.cookie &&
                endpoint.parameters.cookie.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Cookies</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.cookie.map((param, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm">
                              {param.name}
                            </span>
                            {param.required && (
                              <span className="badge badge-error badge-xs">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-base-content/70">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {!endpoint.parameters && (
                <p className="text-base-content/50">No parameters required</p>
              )}
            </div>
          )}

          {activeTab === "body" && (
            <div>
              {endpoint.requestBody ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Request Body</h3>
                    {endpoint.requestBody.required && (
                      <span className="badge badge-error badge-xs">
                        required
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-base-content/70">
                      Content Type:{" "}
                    </span>
                    <code className="text-sm">
                      {endpoint.requestBody.contentType}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Schema:</h4>
                    {renderSchema(endpoint.requestBody.schema)}
                  </div>
                </div>
              ) : (
                <p className="text-base-content/50">No request body required</p>
              )}
            </div>
          )}

          {activeTab === "responses" && (
            <div className="space-y-4">
              {Object.entries(endpoint.responses).map(
                ([statusCode, response]) => (
                  <div key={statusCode} className="bg-base-200 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold">{statusCode}</span>
                      <span
                        className={`badge ${
                          statusCode.startsWith("2")
                            ? "badge-success"
                            : statusCode.startsWith("4")
                            ? "badge-warning"
                            : statusCode.startsWith("5")
                            ? "badge-error"
                            : "badge-info"
                        }`}
                      >
                        {statusCode.startsWith("2")
                          ? "Success"
                          : statusCode.startsWith("4")
                          ? "Client Error"
                          : statusCode.startsWith("5")
                          ? "Server Error"
                          : "Info"}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/70 mb-3">
                      {response.description}
                    </p>
                    {response.schema && (
                      <div>
                        <h5 className="font-medium mb-2">Response Schema:</h5>
                        {renderSchema(response.schema)}
                      </div>
                    )}
                    {response.headers &&
                      Object.keys(response.headers).length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium mb-2">
                            Response Headers:
                          </h5>
                          <div className="space-y-1">
                            {Object.entries(response.headers).map(
                              ([headerName, headerSpec]) => (
                                <div key={headerName} className="text-sm">
                                  <code>{headerName}</code>
                                  {(headerSpec as any).description && (
                                    <span className="text-base-content/70 ml-2">
                                      - {(headerSpec as any).description}
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
