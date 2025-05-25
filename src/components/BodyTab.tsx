import { ApiEndpoint } from "../types";

export default function BodyTab({ endpoint }: { endpoint: ApiEndpoint }) {
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
    <div>
      {endpoint.requestBody ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Request Body</h3>
            {endpoint.requestBody.required && (
              <span className="badge badge-error badge-xs">required</span>
            )}
          </div>
          <div>
            <span className="text-sm text-base-content/70">Content Type: </span>
            <code className="text-sm">{endpoint.requestBody.contentType}</code>
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
  );
}
