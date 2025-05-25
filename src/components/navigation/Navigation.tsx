import { ReactNode } from "react";
import Sidebar from "./Sidebar";
export default function Navigation({ children }: { children: ReactNode }) {
  return (
    <div className="flex ml-90">
      <Sidebar />
      <>{children}</>
    </div>
  );
}
