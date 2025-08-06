import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ProgressRing } from './ProgressRing';
import { Button } from '@/components/ui/button';
import { Coffee, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import type { Machine } from '@shared/schema';

interface MachineCardProps {
  machine: Machine;
  onRemoteBrew: (machine: Machine) => void;
}

export function MachineCard({ machine, onRemoteBrew }: MachineCardProps) {
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
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLowStockItems = () => {
    const lowStock = [];
    if (machine.coffeeBeans < 30) lowStock.push('coffee beans');
    if (machine.milk < 30) lowStock.push('milk');
    if (machine.water < 30) lowStock.push('water');
    return lowStock;
  };

  const lowStockItems = getLowStockItems();
  const hasLowStock = lowStockItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`glass premium-glow p-6 rounded-2xl hover:border-accent-primary transition-all duration-500 cursor-pointer group relative overflow-hidden ${
        machine.status === 'offline' ? 'opacity-75' : ''
      }`}
      data-testid={`card-machine-${machine.id}`}
    >
      <div className="neural-pattern absolute inset-0 rounded-2xl" />
      <div className="relative z-10">
        <Link href={`/machine/${machine.id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors duration-200 mb-1">
              {machine.name}
            </h4>
            <p className="text-text-secondary text-sm">{machine.location}</p>
            {hasLowStock && (
              <div className="flex items-center space-x-1 mt-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-xs text-warning">
                  Low: {lowStockItems.join(', ')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(machine.status) }}
              data-testid={`status-${machine.status}`}
            />
            <div style={{ color: getStatusColor(machine.status) }}>
              {getStatusIcon(machine.status)}
            </div>
          </div>
        </div>

        {machine.status === 'offline' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <WifiOff className="w-8 h-8 text-error mb-2" />
            <span className="text-text-secondary text-sm">Machine Offline</span>
            <span className="text-text-secondary text-xs mt-1">
              Last seen: {new Date(machine.lastSeen || '').toLocaleTimeString()}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Supply Levels */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <ProgressRing 
                  percentage={machine.coffeeBeans} 
                  size={50}
                  color={machine.coffeeBeans < 30 ? 'var(--error)' : 'var(--success)'}
                />
                <p className="text-xs text-text-secondary mt-1">Beans</p>
              </div>
              
              <div className="text-center">
                <ProgressRing 
                  percentage={machine.milk} 
                  size={50}
                  color={machine.milk < 30 ? 'var(--error)' : 'var(--success)'}
                />
                <p className="text-xs text-text-secondary mt-1">Milk</p>
              </div>
              
              <div className="text-center">
                <ProgressRing 
                  percentage={machine.water} 
                  size={50}
                  color={machine.water < 30 ? 'var(--error)' : 'var(--success)'}
                />
                <p className="text-xs text-text-secondary mt-1">Water</p>
              </div>
            </div>
          </div>
        )}
        </Link>

        <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-glass-border">
        <div className="flex items-center space-x-4">
          <span className="text-text-secondary">
            Today: <span className="text-text-primary font-medium">{machine.cupsToday} cups</span>
          </span>
          <span className="text-text-secondary">
            Revenue: <span className="text-text-primary font-medium">${machine.revenueToday}</span>
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemoteBrew(machine);
          }}
          disabled={machine.status !== 'online'}
          className={`transition-colors duration-200 ${
            machine.status === 'online'
              ? 'text-accent-primary hover:text-accent-secondary hover:bg-accent-primary hover:bg-opacity-20'
              : 'text-text-secondary cursor-not-allowed'
          }`}
          data-testid={`button-remote-brew-${machine.id}`}
        >
          <Coffee className="w-4 h-4 mr-1" />
          {machine.status === 'online' ? 'Remote Brew' : 'Unavailable'}
        </Button>
        </div>
      </div>
    </motion.div>
  );
}
