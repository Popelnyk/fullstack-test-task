import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ResourceTable from "./ResourceTable";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ResourceTable />
  </React.StrictMode>
);
