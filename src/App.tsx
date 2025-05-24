import { OpenAPIObject } from "openapi3-ts/oas30";
import { useState } from "react";
import Sidebar from "./components/navigation/Sidebar";

function App() {
  const [count, setCount] = useState(0);

  async function fetchOpenAPI(): Promise<OpenAPIObject> {
    const res = await fetch("http://localhost:8001/openapi.json");
    if (!res.ok) throw new Error(`Failed to fetch OpenAPI: ${res.statusText}`);
    const json = await res.json();
    return json as OpenAPIObject;
  }

  async function listEndpoints(api: OpenAPIObject) {
    const spec = api;

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
        const operation = pathItem[method];
        if (!operation) continue;

        console.log(
          `[${method.toUpperCase()}] ${path} → ${operation.summary || ""}`
        );
      }
    }
  }

  return (
    <>
      <button className="btn">Test</button>
    </>
  );
}

export default App;
