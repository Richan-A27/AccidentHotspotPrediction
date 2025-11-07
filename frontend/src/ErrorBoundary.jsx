import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error caught by boundary:", error);
    console.error("❌ Error info:", errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "40px", 
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5"
        }}>
          <h2 style={{ color: "#d32f2f" }}>⚠️ Something went wrong</h2>
          <p style={{ color: "#666", margin: "20px 0" }}>
            {this.state.error?.message || "Unknown error occurred"}
          </p>
          {this.state.errorInfo && (
            <details style={{ margin: "20px 0", textAlign: "left", maxWidth: "600px" }}>
              <summary style={{ cursor: "pointer", color: "#007bff" }}>
                Error Details
              </summary>
              <pre style={{ 
                background: "#fff", 
                padding: "10px", 
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "12px"
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

