import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Coffee, Milk, Snowflake, Zap } from 'lucide-react';
import type { Machine } from '@shared/schema';

interface RemoteBrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: Machine[];
  selectedMachine?: Machine;
}

const COFFEE_TYPES = [
  { id: 'espresso', name: 'Espresso', icon: Coffee, description: 'Strong and bold' },
  { id: 'latte', name: 'Latte', icon: Milk, description: 'Smooth and creamy' },
  { id: 'cappuccino', name: 'Cappuccino', icon: Zap, description: 'Rich and frothy' },
  { id: 'iced-coffee', name: 'Iced Coffee', icon: Snowflake, description: 'Cool and refreshing' },
];

export function RemoteBrewModal({ isOpen, onClose, machines, selectedMachine }: RemoteBrewModalProps) {
  const [selectedMachineId, setSelectedMachineId] = useState(selectedMachine?.id || '');
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onlineMachines = machines.filter(m => m.status === 'online');

  const createBrewMutation = useMutation({
    mutationFn: async (brewData: { machineId: string; coffeeType: string; customerName?: string }) => {
      const response = await apiRequest('POST', '/api/brews', brewData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Brew Started!",
        description: "Your coffee is being prepared. Customer will be notified when ready.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/machines'] });
      queryClient.invalidateQueries({ queryKey: ['/api/brews'] });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Brew Failed",
        description: "Unable to start brewing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setSelectedMachineId(selectedMachine?.id || '');
    setSelectedCoffeeType('');
    setCustomerName('');
    onClose();
  };

  const handleStartBrew = () => {
    if (!selectedMachineId || !selectedCoffeeType) {
      toast({
        title: "Missing Information",
        description: "Please select a machine and coffee type.",
        variant: "destructive",
      });
      return;
    }

    createBrewMutation.mutate({
      machineId: selectedMachineId,
      coffeeType: selectedCoffeeType,
      customerName: customerName || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-md border-glass-border" data-testid="modal-remote-brew">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Remote Brew
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Machine Selection */}
          <div className="space-y-2">
            <Label htmlFor="machine-select" className="text-sm font-medium text-text-primary">
              Select Machine
            </Label>
            <Select 
              value={selectedMachineId} 
              onValueChange={setSelectedMachineId}
              data-testid="select-machine"
            >
              <SelectTrigger className="glass border-glass-border">
                <SelectValue placeholder="Choose a machine..." />
              </SelectTrigger>
              <SelectContent className="glass border-glass-border">
                {onlineMachines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span>{machine.name}</span>
                      <span className="text-text-secondary text-sm">- {machine.location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coffee Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-text-primary">Coffee Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {COFFEE_TYPES.map((coffee) => {
                const Icon = coffee.icon;
                return (
                  <motion.button
                    key={coffee.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCoffeeType(coffee.id)}
                    className={`glass p-4 rounded-lg transition-all duration-200 text-center group ${
                      selectedCoffeeType === coffee.id
                        ? 'border-accent-primary bg-accent-primary bg-opacity-20'
                        : 'hover:border-accent-primary hover:bg-accent-primary hover:bg-opacity-10'
                    }`}
                    data-testid={`button-coffee-${coffee.id}`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-accent-primary" />
                    <div className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                      {coffee.name}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {coffee.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium text-text-primary">
              Customer Name (Optional)
            </Label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Enter customer name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="glass border-glass-border"
              data-testid="input-customer-name"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 glass border-glass-border hover:bg-error hover:bg-opacity-20"
              data-testid="button-cancel-brew"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartBrew}
              disabled={createBrewMutation.isPending || !selectedMachineId || !selectedCoffeeType}
              className="flex-1 gradient-accent hover:opacity-90"
              data-testid="button-start-brew"
            >
              {createBrewMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Coffee className="w-4 h-4 mr-2" />
                  Start Brewing
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
