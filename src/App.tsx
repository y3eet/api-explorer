import { useApiEndpoint } from "./components/ApiProvider";
import EndpointTester from "./components/EndpointTester";

function App() {
  const { apiEndpoints } = useApiEndpoint();
  return (
    <div className="flex flex-col items-center justify-center w-full gap-12">
      {apiEndpoints?.map((endpoint) => (
        <EndpointTester endpoint={endpoint} />
      ))}
    </div>
  );
}

export default App;
