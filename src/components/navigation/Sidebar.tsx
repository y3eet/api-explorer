import EndpointList from "../EndpointList";

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 w-90 h-screen bg-base-300 border-l border-base-300 flex flex-col z-50">
      <div className="p-4 border-b border-base-300">
        <h2 className="text-lg font-semibold mb-3">API Explorer</h2>

        <div className="form-control"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <EndpointList baseUrl="http://localhost:8001" />
        {/* <EndpointList urlEndpoint="http://localhost:8000" /> */}
      </div>
    </div>
  );
}
