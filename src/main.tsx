import React, { Component, ErrorInfo, ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Setup global window error listeners to capture any early runtime failures
window.addEventListener("error", (event) => {
  const errorPayload = {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack || "No stack trace available",
    href: window.location.href
  };

  console.error("Captured uncaught window error:", errorPayload);

  fetch("/api/log-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(errorPayload)
  }).catch((err) => console.error("Failed to transmit error to diagnostic logger:", err));

  // Dynamically inject error banner to avoid silent black/blank screens
  showFloatingErrorBanner("Uncaught JS Exception", `${event.message} in ${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener("unhandledrejection", (event) => {
  const reasonStr = String(event.reason?.message || event.reason || "");
  if (
    reasonStr.toLowerCase().includes("websocket") ||
    reasonStr.toLowerCase().includes("vite") ||
    reasonStr.toLowerCase().includes("hmr")
  ) {
    // Ignore development-only HMR websocket/Vite promise rejections without suppressing real runtime errors
    return;
  }

  const errorPayload = {
    message: reasonStr,
    source: "unhandledrejection",
    stack: event.reason?.stack || "No stack trace available",
    href: window.location.href
  };

  console.error("Captured unhandled rejection:", errorPayload);

  fetch("/api/log-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(errorPayload)
  }).catch((err) => console.error("Failed to transmit promise error to logger:", err));

  showFloatingErrorBanner("Unhandled Promise Rejection", String(event.reason?.message || event.reason));
});

function showFloatingErrorBanner(title: string, message: string) {
  let banner = document.getElementById("diagnostic-error-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "diagnostic-error-banner";
    banner.style.position = "fixed";
    banner.style.bottom = "20px";
    banner.style.right = "20px";
    banner.style.zIndex = "999999";
    banner.style.maxWidth = "400px";
    banner.style.backgroundColor = "#7f1d1d";
    banner.style.color = "#fef2f2";
    banner.style.padding = "16px";
    banner.style.borderRadius = "8px";
    banner.style.border = "1px solid #ef4444";
    banner.style.fontFamily = "monospace";
    banner.style.fontSize = "11px";
    banner.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.5)";
    banner.style.maxHeight = "300px";
    banner.style.overflowY = "auto";
    document.body.appendChild(banner);
  }
  const heading = document.createElement("div");
  heading.style.fontWeight = "bold";
  heading.style.color = "#fca5a5";
  heading.style.marginBottom = "4px";
  heading.innerText = `⚠️ ${title}`;

  const body = document.createElement("div");
  body.innerText = message;
  body.style.whiteSpace = "pre-wrap";

  banner.appendChild(heading);
  banner.appendChild(body);
  banner.appendChild(document.createElement("hr"));
  const hr = banner.querySelector("hr");
  if (hr) {
    hr.style.borderColor = "#ef4444";
    hr.style.margin = "8px 0";
  }
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public props!: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary caught crash:", error, errorInfo);
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack || errorInfo.componentStack,
        href: window.location.href,
        source: "React ErrorBoundary"
      })
    }).catch((err) => console.error("Failed to send ErrorBoundary event to backend:", err));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "30px",
          backgroundColor: "#111827",
          color: "#f3f4f6",
          fontFamily: "monospace",
          fontSize: "13px",
          minHeight: "100vh",
          boxSizing: "border-box",
          lineHeight: "1.6"
        }}>
          <h1 style={{ color: "#ef4444", fontSize: "22px", margin: "0 0 16px 0", borderBottom: "1px solid #374151", paddingBottom: "10px" }}>
            🚨 React Render Crash Caught
          </h1>
          <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
            <strong>Component Error:</strong> <span style={{ color: "#fca5a5" }}>{this.state.error?.message}</span>
          </p>
          <p style={{ color: "#9ca3af", margin: "0 0 10px 0" }}>Stack Trace:</p>
          <pre style={{
            backgroundColor: "#1f2937",
            padding: "20px",
            borderRadius: "8px",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            margin: "0",
            border: "1px solid #374151"
          }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
