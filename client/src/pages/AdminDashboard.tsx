import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Coffee, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Activity,
  DollarSign,
  BarChart3,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSelector } from '@/components/ThemeSelector';
import type { Machine } from '@shared/schema';

interface AdminStats {
  totalMachines: number;
  onlineMachines: number;
  offlineMachines: number;
  maintenanceMachines: number;
  totalRevenue: string;
  todayRevenue: string;
  totalCups: number;
  todayCups: number;
  averageUptime: number;
  lowStockAlerts: number;
  maintenanceAlerts: number;
  revenueGrowth: number;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'technician';
  lastLogin: string;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch admin stats
  const { data: adminStats, isLoading: loadingStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000,
  });

  // Fetch machines with admin details
  const { data: machines, isLoading: loadingMachines } = useQuery<Machine[]>({
    queryKey: ['/api/admin/machines'],
    refetchInterval: 30000,
  });

  // Mock users data (in real app, would be API call)
  const users: SystemUser[] = [
    { id: '1', name: 'John Admin', email: 'john@coffeeops.com', role: 'admin', lastLogin: '2024-01-15T10:30:00Z', status: 'active' },
    { id: '2', name: 'Sarah Tech', email: 'sarah@coffeeops.com', role: 'technician', lastLogin: '2024-01-15T09:15:00Z', status: 'active' },
    { id: '3', name: 'Mike Operator', email: 'mike@coffeeops.com', role: 'operator', lastLogin: '2024-01-14T16:45:00Z', status: 'inactive' },
  ];

  const statsCards = [
    {
      title: 'Total Machines',
      value: adminStats?.totalMachines || 0,
      icon: Coffee,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary',
    },
    {
      title: 'Revenue Today',
      value: `$${adminStats?.todayRevenue || '0.00'}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
    },
    {
      title: 'System Uptime',
      value: `${adminStats?.averageUptime || 99.2}%`,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Active Alerts',
      value: (adminStats?.lowStockAlerts || 0) + (adminStats?.maintenanceAlerts || 0),
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background patterns */}
      <div className="fixed inset-0 neural-pattern opacity-15 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-text-secondary">System administration and monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="glass px-4 py-2">
              <Activity className="w-3 h-3 mr-1" />
              System Online
            </Badge>
            <Button variant="outline" className="glass" data-testid="button-refresh">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <ThemeSelector />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass premium-glow p-6 rounded-2xl"
              data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bgColor} bg-opacity-20 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass p-1 space-x-1">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="machines" className="flex items-center space-x-2">
                <Coffee className="w-4 h-4" />
                <span>Machines</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-text-primary">
                      <TrendingUp className="w-5 h-5" />
                      <span>Revenue Analytics</span>
                    </CardTitle>
                    <CardDescription>Daily revenue over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center glass rounded-xl">
                      <p className="text-text-secondary">Chart visualization would go here</p>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-text-primary">
                      <Activity className="w-5 h-5" />
                      <span>System Health</span>
                    </CardTitle>
                    <CardDescription>Real-time system monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">API Response Time</span>
                        <Badge variant="secondary" className="bg-green-500 bg-opacity-20 text-green-500">
                          45ms
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Database Connection</span>
                        <Badge variant="secondary" className="bg-green-500 bg-opacity-20 text-green-500">
                          Healthy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Active Sessions</span>
                        <Badge variant="secondary" className="bg-blue-500 bg-opacity-20 text-blue-500">
                          24
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Machines Tab */}
            <TabsContent value="machines" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-text-primary">Machine Management</h2>
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Search machines..."
                    className="glass w-64"
                    data-testid="input-search-machines"
                  />
                  <Button className="gradient-accent" data-testid="button-add-machine">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Machine
                  </Button>
                </div>
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent-primary bg-opacity-10">
                      <tr>
                        <th className="text-left p-4 font-medium text-text-primary">Machine</th>
                        <th className="text-left p-4 font-medium text-text-primary">Status</th>
                        <th className="text-left p-4 font-medium text-text-primary">Location</th>
                        <th className="text-left p-4 font-medium text-text-primary">Revenue</th>
                        <th className="text-left p-4 font-medium text-text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingMachines ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} className="border-t border-glass-border">
                            <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                            <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                            <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                            <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                            <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                          </tr>
                        ))
                      ) : (
                        machines?.slice(0, 5).map((machine) => (
                          <tr key={machine.id} className="border-t border-glass-border hover:bg-accent-primary hover:bg-opacity-5">
                            <td className="p-4">
                              <div className="font-medium text-text-primary">{machine.name}</div>
                              <div className="text-sm text-text-secondary">ID: {machine.id.slice(0, 8)}</div>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={machine.status === 'online' ? 'default' : 'secondary'}
                                className={
                                  machine.status === 'online' 
                                    ? 'bg-green-500 bg-opacity-20 text-green-500'
                                    : 'bg-red-500 bg-opacity-20 text-red-500'
                                }
                              >
                                {machine.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-text-secondary">{machine.location}</td>
                            <td className="p-4 text-text-primary font-medium">${machine.revenueToday}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" data-testid={`button-edit-${machine.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" data-testid={`button-delete-${machine.id}`}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-text-primary">User Management</h2>
                <Button className="gradient-accent" data-testid="button-add-user">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent-primary bg-opacity-10">
                      <tr>
                        <th className="text-left p-4 font-medium text-text-primary">User</th>
                        <th className="text-left p-4 font-medium text-text-primary">Role</th>
                        <th className="text-left p-4 font-medium text-text-primary">Last Login</th>
                        <th className="text-left p-4 font-medium text-text-primary">Status</th>
                        <th className="text-left p-4 font-medium text-text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-glass-border hover:bg-accent-primary hover:bg-opacity-5">
                          <td className="p-4">
                            <div className="font-medium text-text-primary">{user.name}</div>
                            <div className="text-sm text-text-secondary">{user.email}</div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className={
                                user.role === 'admin' 
                                  ? 'bg-purple-500 bg-opacity-20 text-purple-500'
                                  : user.role === 'technician'
                                  ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                                  : 'bg-gray-500 bg-opacity-20 text-gray-500'
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4 text-text-secondary">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'secondary'}
                              className={
                                user.status === 'active' 
                                  ? 'bg-green-500 bg-opacity-20 text-green-500'
                                  : 'bg-red-500 bg-opacity-20 text-red-500'
                              }
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" data-testid={`button-edit-user-${user.id}`}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" data-testid={`button-delete-user-${user.id}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-text-primary">
                      <Settings className="w-5 h-5" />
                      <span>System Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Auto Backup</span>
                        <Badge variant="secondary" className="bg-green-500 bg-opacity-20 text-green-500">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Maintenance Mode</span>
                        <Badge variant="secondary" className="bg-gray-500 bg-opacity-20 text-gray-500">
                          Disabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">API Rate Limiting</span>
                        <Badge variant="secondary" className="bg-blue-500 bg-opacity-20 text-blue-500">
                          1000/hour
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-text-primary">
                      <Download className="w-5 h-5" />
                      <span>Export Data</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-text-secondary text-sm">
                      Export system data for backup or analysis
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full glass" data-testid="button-export-machines">
                        Export Machine Data
                      </Button>
                      <Button variant="outline" className="w-full glass" data-testid="button-export-analytics">
                        Export Analytics
                      </Button>
                      <Button variant="outline" className="w-full glass" data-testid="button-export-logs">
                        Export System Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}