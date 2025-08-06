import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MachineCard } from '@/components/MachineCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { RemoteBrewModal } from '@/components/RemoteBrewModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Wifi, AlertTriangle, DollarSign, Search, Plus } from 'lucide-react';
import type { Machine } from '@shared/schema';

export default function FacilityDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBrewModalOpen, setIsBrewModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>();

  // Fetch machines data
  const { data: machines, isLoading: loadingMachines } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: loadingStats } = useQuery<{
    totalMachines: number;
    onlineMachines: number;
    lowStockMachines: number;
    totalRevenue: string;
  }>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000,
  });

  const filteredMachines = machines?.filter(machine =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleRemoteBrew = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsBrewModalOpen(true);
  };

  const handleMapMachineClick = (machine: Machine) => {
    // Scroll to machine card or open details
    const element = document.querySelector(`[data-testid="card-machine-${machine.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background patterns */}
      <div className="fixed inset-0 neural-pattern opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            Coffee Facility Dashboard
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Monitor and manage your coffee vending machines with intelligent real-time control
          </p>
        </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <div className="glass p-6 rounded-xl" data-testid="stat-total-machines">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Total Machines</p>
                  <p className="text-2xl font-bold text-text-primary">{stats?.totalMachines || 0}</p>
                </div>
                <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl" data-testid="stat-online-machines">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Online</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                    {stats?.onlineMachines || 0}
                  </p>
                </div>
                <Wifi className="w-6 h-6" style={{ color: 'var(--success)' }} />
              </div>
            </div>

            <div className="glass p-6 rounded-xl" data-testid="stat-low-stock">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Low Stock</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                    {stats?.lowStockMachines || 0}
                  </p>
                </div>
                <AlertTriangle className="w-6 h-6" style={{ color: 'var(--warning)' }} />
              </div>
            </div>

            <div className="glass p-6 rounded-xl" data-testid="stat-revenue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Revenue Today</p>
                  <p className="text-2xl font-bold text-text-primary">${stats?.totalRevenue || '0.00'}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" style={{ color: 'var(--success)' }} />
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Machine Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-text-primary">Machine Status</h2>
            <Badge variant="secondary" className="bg-accent-primary bg-opacity-20 text-accent-primary">
              {filteredMachines.length} machines
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <Input
                placeholder="Search machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10 border-glass-border"
                data-testid="input-search-machines"
              />
            </div>
            <Button className="gradient-accent" data-testid="button-add-machine">
              <Plus className="w-4 h-4 mr-2" />
              Add Machine
            </Button>
          </div>
        </div>

        {/* Machine Grid */}
        {loadingMachines ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMachines.map((machine, index) => (
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MachineCard machine={machine} onRemoteBrew={handleRemoteBrew} />
              </motion.div>
            ))}
          </div>
        )}

        {!loadingMachines && filteredMachines.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-text-secondary">
              {searchQuery ? 'No machines found matching your search.' : 'No machines available.'}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-text-primary">Machine Locations</h2>
        {machines && (
          <InteractiveMap 
            machines={machines} 
            onMachineClick={handleMapMachineClick}
            height="400px"
          />
        )}
      </motion.div>

      {/* Remote Brew Modal */}
      <RemoteBrewModal
        isOpen={isBrewModalOpen}
        onClose={() => {
          setIsBrewModalOpen(false);
          setSelectedMachine(undefined);
        }}
        machines={machines || []}
        selectedMachine={selectedMachine}
      />
      </div>
    </div>
  );
}
