import type { Machine, Brew, Analytics } from '@shared/schema';

export const api = {
  // Machines
  async getMachines(): Promise<Machine[]> {
    const response = await fetch('/api/machines');
    if (!response.ok) throw new Error('Failed to fetch machines');
    return response.json();
  },

  async getMachine(id: string): Promise<Machine> {
    const response = await fetch(`/api/machines/${id}`);
    if (!response.ok) throw new Error('Failed to fetch machine');
    return response.json();
  },

  async updateMachine(id: string, updates: Partial<Machine>): Promise<Machine> {
    const response = await fetch(`/api/machines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update machine');
    return response.json();
  },

  // Brews
  async getBrews(machineId?: string): Promise<Brew[]> {
    const url = machineId ? `/api/brews?machineId=${machineId}` : '/api/brews';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch brews');
    return response.json();
  },

  async createBrew(brewData: { machineId: string; coffeeType: string; customerName?: string }): Promise<Brew> {
    const response = await fetch('/api/brews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brewData),
    });
    if (!response.ok) throw new Error('Failed to create brew');
    return response.json();
  },

  // Analytics
  async getAnalytics(machineId?: string, days?: number): Promise<Analytics[]> {
    const params = new URLSearchParams();
    if (machineId) params.append('machineId', machineId);
    if (days) params.append('days', days.toString());
    
    const response = await fetch(`/api/analytics?${params}`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalMachines: number;
    onlineMachines: number;
    lowStockMachines: number;
    totalRevenue: string;
  }> {
    const response = await fetch('/api/dashboard/stats');
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },
};
