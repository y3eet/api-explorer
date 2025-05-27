import { Suspense, useState } from "react";
import EndpointList from "../EndpointList";
import Modal from "../Modal";
import { useApiEndpoint } from "../ApiProvider";
import SelectTheme from "../SelectTheme";
import { Github } from "lucide-react";

export default function Sidebar() {
  const { baseUrls, addBaseUrl } = useApiEndpoint();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="fixed left-0 top-0 w-90 h-screen bg-base-300 border-l border-base-300 flex flex-col z-50">
      <div className="p-3 border-b border-base-300">
        <div className="mb-3 flex items-center">
          <h2 className="text-lg font-semibold flex-1">API Explorer</h2>
          <div className="flex gap-1 items-center">
            <a
              href="https://github.com/y3eet/api-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-soft btn-sm hover:btn-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <SelectTheme />
          </div>
        </div>
        <div className="form-control">
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-sm btn-soft"
          >
            Add URL
          </button>
          <Modal open={modalOpen} onClickOutside={() => setModalOpen(false)}>
            <div className="p-4">
              <h3 className="text-lg font-semibold">Add API Base URL</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const url = formData.get("url") as string;
                  if (url) {
                    addBaseUrl(url);
                    setModalOpen(false);
                  }
                }}
              >
                <input
                  type="url"
                  name="url"
                  placeholder="https://api.example.com"
                  className="input input-bordered w-full mb-3"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add URL
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {baseUrls.map((url, i) => (
          <Suspense fallback={<>Loading</>} key={i}>
            <EndpointList baseUrl={url} />
          </Suspense>
        ))}

        {/* <EndpointList urlEndpoint="http://localhost:8000" /> */}
      </div>
    </div>
  );
}
