import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPresentationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all presentations
  app.get("/api/presentations", async (_req, res) => {
    try {
      const presentations = await storage.getPresentations();
      res.json(presentations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentations" });
    }
  });

  // Get a single presentation
  app.get("/api/presentations/:id", async (req, res) => {
    try {
      const presentation = await storage.getPresentation(req.params.id);
      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      res.json(presentation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentation" });
    }
  });

  // Create a new presentation
  app.post("/api/presentations", async (req, res) => {
    try {
      const validatedData = insertPresentationSchema.parse(req.body);
      const presentation = await storage.createPresentation(validatedData);
      res.status(201).json(presentation);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid presentation data", details: error });
      }
      res.status(500).json({ error: "Failed to create presentation" });
    }
  });

  // Update a presentation
  app.patch("/api/presentations/:id", async (req, res) => {
    try {
      const validatedData = insertPresentationSchema.parse(req.body);
      const presentation = await storage.updatePresentation(req.params.id, validatedData);
      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      res.json(presentation);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid presentation data", details: error });
      }
      res.status(500).json({ error: "Failed to update presentation" });
    }
  });

  // Delete a presentation
  app.delete("/api/presentations/:id", async (req, res) => {
    try {
      const success = await storage.deletePresentation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete presentation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
