import { ApiEndpoint } from "../types";

export default function ResponseTab({ endpoint }: { endpoint: ApiEndpoint }) {
  const renderSchema = (schema: any) => {
    if (!schema)
      return <span className="text-base-content/50">No schema defined</span>;

    return (
      <pre className="bg-base-200 p-3 rounded text-xs">
        {JSON.stringify(schema, null, 2)}
      </pre>
    );
  };
  return (
    <div className="space-y-4">
      {Object.entries(endpoint.responses).map(([statusCode, response]) => (
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
          {response.headers && Object.keys(response.headers).length > 0 && (
            <div className="mt-3">
              <h5 className="font-medium mb-2">Response Headers:</h5>
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
      ))}
    </div>
  );
}
