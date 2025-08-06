import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMachineSchema, insertBrewSchema, insertAnalyticsSchema, insertUserSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Machines
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:id", async (req, res) => {
    try {
      const machine = await storage.getMachine(req.params.id);
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      res.json(machine);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch machine" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const validatedData = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(validatedData);
      res.status(201).json(machine);
    } catch (error) {
      res.status(400).json({ message: "Invalid machine data" });
    }
  });

  app.put("/api/machines/:id", async (req, res) => {
    try {
      const updates = insertMachineSchema.partial().parse(req.body);
      const machine = await storage.updateMachine(req.params.id, updates);
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      res.json(machine);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/machines/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMachine(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Machine not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete machine" });
    }
  });

  // Brews
  app.get("/api/brews", async (req, res) => {
    try {
      const machineId = req.query.machineId as string;
      const brews = machineId 
        ? await storage.getBrewsByMachine(machineId)
        : await storage.getBrews();
      res.json(brews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brews" });
    }
  });

  app.post("/api/brews", async (req, res) => {
    try {
      const validatedData = insertBrewSchema.parse(req.body);
      const brew = await storage.createBrew(validatedData);
      res.status(201).json(brew);
    } catch (error) {
      res.status(400).json({ message: "Invalid brew data" });
    }
  });

  app.get("/api/brews/:id", async (req, res) => {
    try {
      const brews = await storage.getBrews();
      const brew = brews.find(b => b.id === req.params.id);
      if (!brew) {
        return res.status(404).json({ message: "Brew not found" });
      }
      res.json(brew);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brew" });
    }
  });

  // Analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const machineId = req.query.machineId as string;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const analytics = await storage.getAnalytics(machineId, days);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalyticsEntry(validatedData);
      res.status(201).json(analytics);
    } catch (error) {
      res.status(400).json({ message: "Invalid analytics data" });
    }
  });

  // User Settings
  app.get("/api/user-settings/:userId", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(req.params.userId);
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.post("/api/user-settings", async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const machines = await storage.getMachines();
      const totalMachines = machines.length;
      const onlineMachines = machines.filter(m => m.status === "online").length;
      const lowStockMachines = machines.filter(m => 
        m.coffeeBeans < 30 || m.milk < 30 || m.water < 30
      ).length;
      const totalRevenue = machines.reduce((sum, m) => sum + parseFloat(m.revenueToday || "0"), 0);

      res.json({
        totalMachines,
        onlineMachines,
        lowStockMachines,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Admin API routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const machines = await storage.getMachines();
      const totalMachines = machines.length;
      const onlineMachines = machines.filter(m => m.status === "online").length;
      const offlineMachines = machines.filter(m => m.status === "offline").length;
      const maintenanceMachines = machines.filter(m => m.status === "maintenance").length;
      const lowStockAlerts = machines.filter(m => 
        m.coffeeBeans < 30 || m.milk < 30 || m.water < 30
      ).length;
      
      const totalRevenue = machines.reduce((sum, m) => sum + parseFloat(m.revenueToday || "0"), 0);
      const todayRevenue = totalRevenue.toFixed(2);
      const totalCups = machines.reduce((sum, m) => sum + (m.cupsToday || 0), 0);

      res.json({
        totalMachines,
        onlineMachines,
        offlineMachines,
        maintenanceMachines,
        totalRevenue: (totalRevenue * 30).toFixed(2), // Mock monthly revenue
        todayRevenue,
        totalCups: totalCups * 30, // Mock monthly cups
        todayCups: totalCups,
        averageUptime: 99.2,
        lowStockAlerts,
        maintenanceAlerts: maintenanceMachines,
        revenueGrowth: 12.5
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/machines", async (req, res) => {
    try {
      const machines = await storage.getMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin machines" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
