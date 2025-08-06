import { type User, type InsertUser, type Machine, type InsertMachine, type Brew, type InsertBrew, type Analytics, type InsertAnalytics, type UserSettings, type InsertUserSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Machines
  getMachines(): Promise<Machine[]>;
  getMachine(id: string): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: string, updates: Partial<InsertMachine>): Promise<Machine | undefined>;
  deleteMachine(id: string): Promise<boolean>;
  
  // Brews
  getBrews(): Promise<Brew[]>;
  getBrewsByMachine(machineId: string): Promise<Brew[]>;
  createBrew(brew: InsertBrew): Promise<Brew>;
  updateBrewStatus(id: string, status: string): Promise<Brew | undefined>;
  
  // Analytics
  getAnalytics(machineId?: string, days?: number): Promise<Analytics[]>;
  createAnalyticsEntry(analytics: InsertAnalytics): Promise<Analytics>;
  
  // User Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createOrUpdateUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private machines: Map<string, Machine>;
  private brews: Map<string, Brew>;
  private analytics: Map<string, Analytics>;
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.brews = new Map();
    this.analytics = new Map();
    this.userSettings = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      password: "admin123",
      role: "admin"
    };
    this.users.set(adminId, admin);

    // Create sample machines
    const machines: Machine[] = [
      {
        id: randomUUID(),
        name: "Downtown Office",
        location: "123 Business Ave",
        status: "online",
        latitude: "40.7128",
        longitude: "-74.0060",
        coffeeBeans: 85,
        milk: 30,
        water: 70,
        cupsToday: 42,
        revenueToday: "126.00",
        lastSeen: new Date(),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Tech Hub Lounge",
        location: "456 Innovation St",
        status: "online",
        latitude: "40.7589",
        longitude: "-73.9851",
        coffeeBeans: 92,
        milk: 78,
        water: 88,
        cupsToday: 67,
        revenueToday: "201.00",
        lastSeen: new Date(),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Campus Library",
        location: "789 University Dr",
        status: "offline",
        latitude: "40.7505",
        longitude: "-73.9934",
        coffeeBeans: 45,
        milk: 25,
        water: 60,
        cupsToday: 0,
        revenueToday: "0.00",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Retail Plaza",
        location: "321 Shopping Blvd",
        status: "maintenance",
        latitude: "40.7282",
        longitude: "-74.0776",
        coffeeBeans: 15,
        milk: 5,
        water: 45,
        cupsToday: 18,
        revenueToday: "54.00",
        lastSeen: new Date(),
        createdAt: new Date()
      }
    ];

    machines.forEach(machine => this.machines.set(machine.id, machine));

    // Create sample analytics data
    const machineIds = Array.from(this.machines.keys());
    const coffeeTypes = ["espresso", "latte", "cappuccino", "iced-coffee"];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      machineIds.forEach(machineId => {
        coffeeTypes.forEach(coffeeType => {
          const cups = Math.floor(Math.random() * 20) + 5;
          const pricePerCup = coffeeType === "latte" ? 4.5 : coffeeType === "cappuccino" ? 4.0 : coffeeType === "iced-coffee" ? 3.5 : 3.0;
          
          const analyticsEntry: Analytics = {
            id: randomUUID(),
            machineId,
            date,
            coffeeType,
            revenue: (cups * pricePerCup).toFixed(2),
            cups
          };
          
          this.analytics.set(analyticsEntry.id, analyticsEntry);
        });
      });
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Machines
  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const id = randomUUID();
    const machine: Machine = {
      ...insertMachine,
      id,
      createdAt: new Date(),
      lastSeen: new Date()
    };
    this.machines.set(id, machine);
    return machine;
  }

  async updateMachine(id: string, updates: Partial<InsertMachine>): Promise<Machine | undefined> {
    const machine = this.machines.get(id);
    if (!machine) return undefined;
    
    const updatedMachine = { ...machine, ...updates, lastSeen: new Date() };
    this.machines.set(id, updatedMachine);
    return updatedMachine;
  }

  async deleteMachine(id: string): Promise<boolean> {
    return this.machines.delete(id);
  }

  // Brews
  async getBrews(): Promise<Brew[]> {
    return Array.from(this.brews.values());
  }

  async getBrewsByMachine(machineId: string): Promise<Brew[]> {
    return Array.from(this.brews.values()).filter(brew => brew.machineId === machineId);
  }

  async createBrew(insertBrew: InsertBrew): Promise<Brew> {
    const id = randomUUID();
    const brew: Brew = {
      ...insertBrew,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.brews.set(id, brew);
    
    // Simulate brewing process
    setTimeout(() => {
      this.updateBrewStatus(id, "brewing");
      setTimeout(() => {
        this.updateBrewStatus(id, "completed");
      }, 30000); // Complete after 30 seconds
    }, 1000); // Start brewing after 1 second
    
    return brew;
  }

  async updateBrewStatus(id: string, status: string): Promise<Brew | undefined> {
    const brew = this.brews.get(id);
    if (!brew) return undefined;
    
    const updatedBrew = { ...brew, status };
    this.brews.set(id, updatedBrew);
    return updatedBrew;
  }

  // Analytics
  async getAnalytics(machineId?: string, days = 30): Promise<Analytics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.analytics.values()).filter(entry => {
      const matchesMachine = !machineId || entry.machineId === machineId;
      const withinDateRange = entry.date >= cutoffDate;
      return matchesMachine && withinDateRange;
    });
  }

  async createAnalyticsEntry(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { ...insertAnalytics, id };
    this.analytics.set(id, analytics);
    return analytics;
  }

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async createOrUpdateUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const existing = await this.getUserSettings(insertSettings.userId);
    
    if (existing) {
      const updated = { ...existing, ...insertSettings };
      this.userSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const settings: UserSettings = { ...insertSettings, id };
      this.userSettings.set(id, settings);
      return settings;
    }
  }
}

export const storage = new MemStorage();
