import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DICOM Insight API is running" });
});

// Placeholder routes for future implementation
app.post("/api/upload", (req, res) => {
  res.json({ message: "Upload endpoint - to be implemented" });
});

app.get("/api/files", (req, res) => {
  res.json({ files: [] });
});

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error("Error:", err);
  res.status(status).json({ message });
});

// Export for Vercel
export default app; 