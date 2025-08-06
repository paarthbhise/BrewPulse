import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Coffee, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const mockRevenueData = [
  { day: 'Mon', revenue: 125.50, cups: 42 },
  { day: 'Tue', revenue: 89.25, cups: 31 },
  { day: 'Wed', revenue: 156.75, cups: 52 },
  { day: 'Thu', revenue: 203.00, cups: 67 },
  { day: 'Fri', revenue: 178.50, cups: 58 },
  { day: 'Sat', revenue: 91.25, cups: 29 },
  { day: 'Sun', revenue: 67.75, cups: 23 },
];

const mockMachinePerformance = [
  { name: 'Office Tower A', revenue: 450.50, cups: 150, uptime: 99.2 },
  { name: 'Metro Station B', revenue: 389.75, cups: 128, uptime: 97.8 },
  { name: 'University Hub', revenue: 302.25, cups: 98, uptime: 98.5 },
  { name: 'Shopping Mall', revenue: 278.90, cups: 89, uptime: 95.3 },
];

const mockAlerts = [
  { id: 1, type: 'low-stock', message: 'Coffee beans running low at Office Tower A', severity: 'warning' },
  { id: 2, type: 'maintenance', message: 'Cleaning cycle overdue at Metro Station B', severity: 'info' },
  { id: 3, type: 'error', message: 'Payment system offline at University Hub', severity: 'error' },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const { data: adminStats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen neural-bg flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-primary mt-4">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neural-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
          <p className="text-text-secondary">Advanced metrics and insights for your coffee machine fleet</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
            <TabsList className="glass mb-6">
              <TabsTrigger value="24h" data-testid="tab-24h">24 Hours</TabsTrigger>
              <TabsTrigger value="7d" data-testid="tab-7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d" data-testid="tab-30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d" data-testid="tab-90d">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-accent-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">${adminStats?.totalRevenue}</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{adminStats?.revenueGrowth}% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Cups</CardTitle>
              <Coffee className="w-4 h-4 text-accent-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{adminStats?.totalCups}</div>
              <p className="text-xs text-text-secondary">
                {adminStats?.todayCups} today
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Active Machines</CardTitle>
              <BarChart3 className="w-4 h-4 text-accent-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{adminStats?.onlineMachines}</div>
              <p className="text-xs text-text-secondary">
                of {adminStats?.totalMachines} total
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Avg Uptime</CardTitle>
              <TrendingUp className="w-4 h-4 text-accent-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{adminStats?.averageUptime}%</div>
              <Progress value={adminStats?.averageUptime} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent-primary" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Machine Performance */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center">
                <Coffee className="w-5 h-5 mr-2 text-accent-primary" />
                Machine Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockMachinePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Notifications */}
        <Card className="glass border-0 mt-8">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-surface-light bg-surface-dark/50"
                  data-testid={`alert-${alert.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'error' ? 'bg-red-500' :
                      alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-text-primary">{alert.message}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      alert.severity === 'error' ? 'border-red-500 text-red-400' :
                      alert.severity === 'warning' ? 'border-yellow-500 text-yellow-400' : 
                      'border-blue-500 text-blue-400'
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}