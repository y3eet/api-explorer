import { ApiEndpoint } from "../types";

export default function ParametersTab({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <div>
      <div className="space-y-4">
        {endpoint.parameters?.path && endpoint.parameters.path.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Path Parameters</h3>
            <div className="space-y-2">
              {endpoint.parameters.path.map((param, index) => (
                <div key={index} className="bg-base-200 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm">{param.name}</span>
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

        {endpoint.parameters?.query && endpoint.parameters.query.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Query Parameters</h3>
            <div className="space-y-2">
              {endpoint.parameters.query.map((param, index) => (
                <div key={index} className="bg-base-200 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm">{param.name}</span>
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
                      <span className="font-mono text-sm">{param.name}</span>
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
                      <span className="font-mono text-sm">{param.name}</span>
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
    </div>
  );
}
