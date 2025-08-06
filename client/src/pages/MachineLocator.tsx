import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { InteractiveMap } from '@/components/InteractiveMap';
import { MachineCard } from '@/components/MachineCard';
import { RemoteBrewModal } from '@/components/RemoteBrewModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, MapPin, List } from 'lucide-react';
import type { Machine } from '@shared/schema';

export default function MachineLocator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [isBrewModalOpen, setIsBrewModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>();

  // Fetch machines data
  const { data: machines, isLoading } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
    refetchInterval: 30000,
  });

  // Filter and search machines
  const filteredMachines = useMemo(() => {
    if (!machines) return [];
    
    return machines.filter(machine => {
      const matchesSearch = 
        machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || machine.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [machines, searchQuery, statusFilter]);

  const handleRemoteBrew = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsBrewModalOpen(true);
  };

  const handleMapMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    // Auto-scroll to machine in list view
    if (view === 'list') {
      const element = document.querySelector(`[data-testid="card-machine-${machine.id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const statusCounts = useMemo(() => {
    if (!machines) return { all: 0, online: 0, offline: 0, maintenance: 0 };
    
    return {
      all: machines.length,
      online: machines.filter(m => m.status === 'online').length,
      offline: machines.filter(m => m.status === 'offline').length,
      maintenance: machines.filter(m => m.status === 'maintenance').length,
    };
  }, [machines]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-text-primary">Machine Locator</h1>
        <p className="text-text-secondary text-lg">Find and manage coffee machines across all locations</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-xl mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10 border-glass-border"
                data-testid="input-search"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="glass border-glass-border w-full sm:w-48" data-testid="select-status-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="glass border-glass-border">
                <SelectItem value="all">
                  All ({statusCounts.all})
                </SelectItem>
                <SelectItem value="online">
                  Online ({statusCounts.online})
                </SelectItem>
                <SelectItem value="offline">
                  Offline ({statusCounts.offline})
                </SelectItem>
                <SelectItem value="maintenance">
                  Maintenance ({statusCounts.maintenance})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('map')}
              className={view === 'map' ? 'gradient-accent' : ''}
              data-testid="button-map-view"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className={view === 'list' ? 'gradient-accent' : ''}
              data-testid="button-list-view"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-accent-primary bg-opacity-20 text-accent-primary">
              {filteredMachines.length} results
            </Badge>
            {searchQuery && (
              <span className="text-sm text-text-secondary">
                for "{searchQuery}"
              </span>
            )}
          </div>
          
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-text-secondary hover:text-text-primary"
              data-testid="button-clear-search"
            >
              Clear search
            </Button>
          )}
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {view === 'map' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[600px]">
            {/* Map */}
            <div className="xl:col-span-2">
              {isLoading ? (
                <Skeleton className="w-full h-full rounded-xl" />
              ) : (
                <InteractiveMap 
                  machines={filteredMachines}
                  onMachineClick={handleMapMachineClick}
                  height="100%"
                />
              )}
            </div>

            {/* Machine List Sidebar */}
            <div className="space-y-4 overflow-y-auto max-h-[600px]">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))
              ) : filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => (
                  <motion.div
                    key={machine.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 glass rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedMachine?.id === machine.id 
                        ? 'border-accent-primary bg-accent-primary bg-opacity-10' 
                        : 'hover:border-accent-primary'
                    }`}
                    onClick={() => setSelectedMachine(machine)}
                    data-testid={`item-machine-${machine.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-text-primary">{machine.name}</h3>
                        <p className="text-sm text-text-secondary">{machine.location}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`${
                          machine.status === 'online' 
                            ? 'bg-green-500 bg-opacity-20 text-green-400'
                            : machine.status === 'offline'
                            ? 'bg-red-500 bg-opacity-20 text-red-400'
                            : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                        }`}
                      >
                        {machine.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Today: {machine.cupsToday} cups
                      </span>
                      <span className="text-text-secondary">
                        ${machine.revenueToday}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-text-secondary">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No machines found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : filteredMachines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : (
              <div className="text-center py-12">
                <div className="text-text-secondary">
                  <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg mb-2">No machines found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
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
  );
}
