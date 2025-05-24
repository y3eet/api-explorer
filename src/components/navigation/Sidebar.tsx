import EndpointList from "../EndpointList";

export default function Sidebar() {
  return (
    <div className="w-90 h-screen bg-base-300 border-r border-base-300 flex flex-col">
      <div className="p-4 border-b border-base-300">
        <h2 className="text-lg font-semibold mb-3">API Explorer</h2>

        <div className="form-control">
          {/* <input
          type="text"
          placeholder="Search endpoints..."
          className="input input-bordered input-sm w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <EndpointList urlEndpoint="http://localhost:8001" />
        {/* <EndpointList urlEndpoint="http://localhost:8000" /> */}
      </div>
    </div>
  );
}
