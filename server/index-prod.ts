import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";
import { fileURLToPath } from "node:url";

import express, { type Express } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Debug logging helper
function debugLog(msg: string) {
  try {
    const logPath = path.resolve(__dirname, "debug.log");
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {
    console.error("Failed to write to log file:", e);
  }
}

(async () => {
  try {
    debugLog("Starting application...");
    debugLog(`Node Version: ${process.version}`);
    debugLog(`NODE_ENV: ${process.env.NODE_ENV}`);

    // Dynamic import for dotenv
    try {
      const dotenv = await import("dotenv");
      dotenv.config();
      debugLog("Loaded .env file");
    } catch (e) {
      debugLog("Could not load dotenv (module not found?), skipping .env loading");
    }

    debugLog(`DATABASE_URL present: ${!!process.env.DATABASE_URL}`);

    if (!process.env.DATABASE_URL) {
      debugLog("CRITICAL: DATABASE_URL is missing!");
    }

    // Dynamic import for app
    const { default: runApp } = await import("./app");
    await runApp(serveStatic);
    debugLog("Application started successfully");
  } catch (e: any) {
    debugLog(`FATAL ERROR: ${e.message}`);
    debugLog(e.stack);
    process.exit(1);
  }
})();
