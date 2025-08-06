import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/hooks/useTheme';
import { 
  TrendingUp, 
  TrendingDown, 
  Coffee, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import type { Machine, Analytics } from '@shared/schema';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMachine, setSelectedMachine] = useState('all');
  const { theme } = useTheme();

  // Fetch machines for filter dropdown
  const { data: machines } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
  });

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics', selectedMachine === 'all' ? undefined : selectedMachine, parseInt(timeRange)],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery<{
    totalMachines: number;
    onlineMachines: number;
    lowStockMachines: number;
    totalRevenue: string;
  }>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000,
  });

  // Get theme colors for charts
  const getThemeColors = () => {
    const root = document.documentElement;
    const primary = getComputedStyle(root).getPropertyValue('--accent-primary').trim();
    const secondary = getComputedStyle(root).getPropertyValue('--accent-secondary').trim();
    const success = getComputedStyle(root).getPropertyValue('--success').trim();
    const warning = getComputedStyle(root).getPropertyValue('--warning').trim();
    const error = getComputedStyle(root).getPropertyValue('--error').trim();
    
    return {
      primary: `hsl(${primary})`,
      secondary: `hsl(${secondary})`,
      success: `hsl(${success})`,
      warning: `hsl(${warning})`,
      error: `hsl(${error})`,
      text: getComputedStyle(root).getPropertyValue('--text-primary').trim(),
      textSecondary: getComputedStyle(root).getPropertyValue('--text-secondary').trim(),
    };
  };

  const colors = getThemeColors();

  // Process analytics data for charts
  const processedData = useMemo(() => {
    if (!analytics) return { daily: [], coffee: [], revenue: [], hourly: [] };

    // Daily trends
    const dailyMap = new Map();
    analytics.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, cups: 0, revenue: 0 });
      }
      const day = dailyMap.get(date);
      day.cups += entry.cups;
      day.revenue += parseFloat(entry.revenue);
    });

    // Coffee type distribution
    const coffeeMap = new Map();
    analytics.forEach(entry => {
      const type = entry.coffeeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!coffeeMap.has(type)) {
        coffeeMap.set(type, { name: type, value: 0, revenue: 0 });
      }
      const coffee = coffeeMap.get(type);
      coffee.value += entry.cups;
      coffee.revenue += parseFloat(entry.revenue);
    });

    // Peak hours analysis
    const hourlyMap = new Map();
    for (let hour = 0; hour < 24; hour++) {
      hourlyMap.set(hour, { hour: `${hour}:00`, cups: 0 });
    }
    
    // Simulate hourly distribution based on coffee service patterns
    analytics.forEach(entry => {
      const simulatedHours = [7, 8, 9, 10, 11, 13, 14, 15, 16]; // Peak coffee hours
      simulatedHours.forEach(hour => {
        const hourData = hourlyMap.get(hour);
        hourData.cups += Math.floor(entry.cups / simulatedHours.length);
      });
    });

    return {
      daily: Array.from(dailyMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      coffee: Array.from(coffeeMap.values()).sort((a, b) => b.value - a.value),
      revenue: Array.from(dailyMap.values()).map(d => ({ ...d, revenue: d.revenue })),
      hourly: Array.from(hourlyMap.values()).filter(h => h.cups > 0),
    };
  }, [analytics]);

  // Calculate trends
  const trends = useMemo(() => {
    if (processedData.daily.length < 2) return { cups: 0, revenue: 0 };
    
    const recent = processedData.daily.slice(-3);
    const previous = processedData.daily.slice(-6, -3);
    
    if (recent.length === 0 || previous.length === 0) return { cups: 0, revenue: 0 };
    
    const recentAvg = recent.reduce((sum, d) => sum + d.cups, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.cups, 0) / previous.length;
    const cupsChange = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    
    const recentRevenue = recent.reduce((sum, d) => sum + d.revenue, 0) / recent.length;
    const previousRevenue = previous.reduce((sum, d) => sum + d.revenue, 0) / previous.length;
    const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    
    return { cups: cupsChange, revenue: revenueChange };
  }, [processedData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border border-glass-border">
          <p className="text-text-primary font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-text-secondary text-sm">
              {entry.name}: {entry.name.includes('Revenue') ? `$${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary text-lg">Comprehensive insights into your coffee operations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedMachine} onValueChange={setSelectedMachine}>
            <SelectTrigger className="glass border-glass-border w-48" data-testid="select-machine-filter">
              <SelectValue placeholder="Select machine" />
            </SelectTrigger>
            <SelectContent className="glass border-glass-border">
              <SelectItem value="all">All Machines</SelectItem>
              {machines?.map((machine) => (
                <SelectItem key={machine.id} value={machine.id}>
                  {machine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="glass border-glass-border w-40" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-glass-border">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="glass border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Cups</p>
                <p className="text-2xl font-bold text-text-primary">
                  {processedData.daily.reduce((sum, d) => sum + d.cups, 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {trends.cups >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-xs ${trends.cups >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(trends.cups).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Coffee className="w-8 h-8 text-accent-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-text-primary">
                  ${processedData.revenue.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
                </p>
                <div className="flex items-center mt-1">
                  {trends.revenue >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-xs ${trends.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(trends.revenue).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Avg per Day</p>
                <p className="text-2xl font-bold text-text-primary">
                  {processedData.daily.length > 0 
                    ? Math.round(processedData.daily.reduce((sum, d) => sum + d.cups, 0) / processedData.daily.length)
                    : 0
                  }
                </p>
                <p className="text-xs text-text-secondary mt-1">cups per day</p>
              </div>
              <Users className="w-8 h-8 text-accent-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Active Machines</p>
                <p className="text-2xl font-bold text-text-primary">{stats?.onlineMachines || 0}</p>
                <p className="text-xs text-text-secondary mt-1">of {stats?.totalMachines || 0} total</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Usage Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-glass-border h-96">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Daily Usage Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={processedData.daily}>
                    <defs>
                      <linearGradient id="cupsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.textSecondary} opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis stroke={colors.textSecondary} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cups"
                      stroke={colors.primary}
                      fillOpacity={1}
                      fill="url(#cupsGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-glass-border h-96">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Revenue Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={processedData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.textSecondary} opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis stroke={colors.textSecondary} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={colors.success}
                      strokeWidth={3}
                      dot={{ fill: colors.success, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors.success }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Coffee Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-glass-border h-96">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5" />
                <span>Popular Drinks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={processedData.coffee}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {processedData.coffee.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[colors.primary, colors.success, colors.warning, colors.error][index % 4]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: colors.text, fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Peak Hours Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-glass-border h-96">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Peak Usage Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={processedData.hourly}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.textSecondary} opacity={0.3} />
                    <XAxis 
                      dataKey="hour" 
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis stroke={colors.textSecondary} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="cups" 
                      fill={colors.warning}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Coffee Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-glass-border">
          <CardHeader>
            <CardTitle className="text-text-primary">Coffee Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {processedData.coffee.map((coffee, index) => (
                  <div 
                    key={coffee.name}
                    className="flex items-center space-x-4 p-4 glass rounded-lg"
                  >
                    <div className="text-2xl">
                      {coffee.name === 'Espresso' ? '☕' : 
                       coffee.name === 'Latte' ? '🥛' : 
                       coffee.name === 'Cappuccino' ? '🍫' : '🧊'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">{coffee.name}</div>
                      <div className="text-sm text-text-secondary">
                        {coffee.value.toLocaleString()} cups • ${coffee.revenue.toFixed(2)}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="bg-accent-primary bg-opacity-20 text-accent-primary"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
