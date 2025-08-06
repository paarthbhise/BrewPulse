import { useParams, Link } from 'wouter';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RemoteBrewModal } from '@/components/RemoteBrewModal';
import { ProgressRing } from '@/components/ProgressRing';
import { 
  ArrowLeft, 
  Coffee, 
  MapPin, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import type { Machine, Brew, Analytics } from '@shared/schema';

export default function MachineDetail() {
  const params = useParams();
  const machineId = params.id;
  const [isBrewModalOpen, setIsBrewModalOpen] = useState(false);

  // Fetch machine data
  const { data: machine, isLoading: loadingMachine } = useQuery<Machine>({
    queryKey: ['/api/machines', machineId],
    enabled: !!machineId,
    refetchInterval: 30000,
  });

  // Fetch machine brews
  const { data: brews, isLoading: loadingBrews } = useQuery<Brew[]>({
    queryKey: ['/api/brews', machineId],
    enabled: !!machineId,
    refetchInterval: 10000, // Poll more frequently for brew status
  });

  // Fetch machine analytics
  const { data: analytics, isLoading: loadingAnalytics } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics', machineId],
    enabled: !!machineId,
  });

  if (loadingMachine) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Machine Not Found</h1>
          <p className="text-text-secondary mb-6">The requested machine could not be found.</p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--success)';
      case 'offline': return 'var(--error)';
      case 'maintenance': return 'var(--warning)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="w-5 h-5" />;
      case 'offline': return <WifiOff className="w-5 h-5" />;
      case 'maintenance': return <AlertTriangle className="w-5 h-5" />;
      default: return null;
    }
  };

  const recentBrews = brews?.slice(0, 10) || [];
  const weeklyAnalytics = analytics?.slice(-7) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{machine.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{machine.location}</span>
              </div>
              <Badge 
                variant="secondary"
                className="flex items-center space-x-1"
                style={{ 
                  backgroundColor: `${getStatusColor(machine.status)}20`,
                  color: getStatusColor(machine.status),
                  border: `1px solid ${getStatusColor(machine.status)}40`
                }}
              >
                {getStatusIcon(machine.status)}
                <span className="capitalize">{machine.status}</span>
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsBrewModalOpen(true)}
          disabled={machine.status !== 'online'}
          className="gradient-accent"
          data-testid="button-remote-brew"
        >
          <Coffee className="w-4 h-4 mr-2" />
          Remote Brew
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supply Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="text-text-primary">Supply Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <ProgressRing 
                      percentage={machine.coffeeBeans} 
                      size={80}
                      color={machine.coffeeBeans < 30 ? 'var(--error)' : 'var(--success)'}
                    />
                    <p className="text-sm font-medium text-text-primary mt-3">Coffee Beans</p>
                    <p className="text-xs text-text-secondary">{machine.coffeeBeans}% remaining</p>
                  </div>
                  
                  <div className="text-center">
                    <ProgressRing 
                      percentage={machine.milk} 
                      size={80}
                      color={machine.milk < 30 ? 'var(--error)' : 'var(--success)'}
                    />
                    <p className="text-sm font-medium text-text-primary mt-3">Milk</p>
                    <p className="text-xs text-text-secondary">{machine.milk}% remaining</p>
                  </div>
                  
                  <div className="text-center">
                    <ProgressRing 
                      percentage={machine.water} 
                      size={80}
                      color={machine.water < 30 ? 'var(--error)' : 'var(--success)'}
                    />
                    <p className="text-sm font-medium text-text-primary mt-3">Water</p>
                    <p className="text-xs text-text-secondary">{machine.water}% remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Brews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="text-text-primary">Recent Brews</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBrews ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : recentBrews.length > 0 ? (
                  <div className="space-y-3">
                    {recentBrews.map((brew) => (
                      <div 
                        key={brew.id}
                        className="flex items-center justify-between p-3 glass rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Coffee className="w-4 h-4 text-accent-primary" />
                          <div>
                            <p className="text-sm font-medium text-text-primary capitalize">
                              {brew.coffeeType.replace('-', ' ')}
                            </p>
                            {brew.customerName && (
                              <p className="text-xs text-text-secondary">
                                for {brew.customerName}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant="secondary"
                            className={`${
                              brew.status === 'completed' 
                                ? 'bg-green-500 bg-opacity-20 text-green-400'
                                : brew.status === 'brewing'
                                ? 'bg-blue-500 bg-opacity-20 text-blue-400' 
                                : brew.status === 'failed'
                                ? 'bg-red-500 bg-opacity-20 text-red-400'
                                : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                            }`}
                          >
                            {brew.status}
                          </Badge>
                          <p className="text-xs text-text-secondary mt-1">
                            {new Date(brew.createdAt || '').toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No brews recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="text-text-primary">Today's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-secondary">Cups Served</span>
                  </div>
                  <span className="text-lg font-semibold text-text-primary">
                    {machine.cupsToday}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-secondary">Revenue</span>
                  </div>
                  <span className="text-lg font-semibold text-text-primary">
                    ${machine.revenueToday}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-secondary">Last Seen</span>
                  </div>
                  <span className="text-sm text-text-primary">
                    {new Date(machine.lastSeen || '').toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Maintenance Alert */}
          {(machine.coffeeBeans < 30 || machine.milk < 30 || machine.water < 30) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-glass-border border-warning">
                <CardHeader>
                  <CardTitle className="text-warning flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Maintenance Required</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-secondary mb-4">
                    This machine has low supply levels and needs attention.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-warning text-warning hover:bg-warning hover:bg-opacity-20"
                    data-testid="button-schedule-maintenance"
                  >
                    Schedule Maintenance
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Remote Brew Modal */}
      <RemoteBrewModal
        isOpen={isBrewModalOpen}
        onClose={() => setIsBrewModalOpen(false)}
        machines={[machine]}
        selectedMachine={machine}
      />
    </div>
  );
}
