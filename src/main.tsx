import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ipcRenderer } from "electron";
import { getSqlite3 } from "./better-sqlite3";
import { SystemContextProvider } from "./context/SystemContext.tsx";
import "./index.css";

// document.getElementById('app')!.innerHTML = `
// <h1>Hi there 👋</h1>
// <p>Now, you can use better-sqlite3 in Renderer process.</p>
// `

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SystemContextProvider>
      <App />
    </SystemContextProvider>
  </React.StrictMode>
);

ipcRenderer.invoke("get-database-path").then((dbpath) => {
  console.log("==>", dbpath);
  const db = getSqlite3(dbpath);
  console.log("[better-sqlite3]", db.pragma("journal_mode = WAL"));
});

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");
