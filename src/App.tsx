import { useApiEndpoint } from "./components/ApiProvider";
import EndpointTester from "./components/EndpointTester";

function App() {
  const { selectedEndpoint } = useApiEndpoint();
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full gap-12">
      {selectedEndpoint && <EndpointTester endpoint={selectedEndpoint} />}
    </div>
  );
}

export default App;
