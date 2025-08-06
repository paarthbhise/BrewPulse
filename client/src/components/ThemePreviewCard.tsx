import { motion } from 'framer-motion';
import { Coffee, Wifi, Battery, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Theme } from '@/context/ThemeContext';

interface ThemePreviewCardProps {
  theme: Theme;
  name: string;
  description: string;
  colors: [string, string];
  isActive: boolean;
  onSelect: () => void;
}

export function ThemePreviewCard({ theme, name, description, colors, isActive, onSelect }: ThemePreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20 
      }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
        isActive ? 'ring-2 ring-offset-2 ring-offset-bg-primary' : ''
      }`}
      style={{
        background: colors[0],
        '--tw-ring-color': isActive ? colors[1] : 'transparent'
      } as React.CSSProperties}
      onClick={onSelect}
      data-testid={`preview-card-${theme}`}
    >
      {/* Neural pattern background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${colors[1]} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${colors[1]} 0%, transparent 50%)
          `
        }}
      />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div 
          className="absolute top-0 left-[-100%] w-full h-full group-hover:left-[100%] transition-all duration-1000"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors[1]}20, transparent)`
          }}
        />
      </div>
      
      <div className="relative z-10 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 
              className="text-lg font-semibold"
              style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
            >
              {name}
            </h3>
            <p 
              className="text-sm opacity-75"
              style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
            >
              {description}
            </p>
          </div>
          
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 rounded-full"
              style={{ background: colors[1] }}
            />
          )}
        </div>

        {/* Mock Dashboard Preview */}
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="p-3 rounded-lg backdrop-blur-sm border"
              style={{ 
                backgroundColor: `${colors[1]}15`,
                borderColor: `${colors[1]}30`
              }}
            >
              <div className="flex items-center space-x-2">
                <Coffee 
                  className="w-4 h-4" 
                  style={{ color: colors[1] }}
                />
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
                  >
                    24
                  </div>
                  <div 
                    className="text-xs opacity-60"
                    style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
                  >
                    Machines
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="p-3 rounded-lg backdrop-blur-sm border"
              style={{ 
                backgroundColor: `${colors[1]}15`,
                borderColor: `${colors[1]}30`
              }}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp 
                  className="w-4 h-4" 
                  style={{ color: colors[1] }}
                />
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
                  >
                    $2.4k
                  </div>
                  <div 
                    className="text-xs opacity-60"
                    style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
                  >
                    Revenue
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mock machine status */}
          <div 
            className="p-3 rounded-lg backdrop-blur-sm border"
            style={{ 
              backgroundColor: `${colors[1]}10`,
              borderColor: `${colors[1]}20`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors[1] }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: theme === 'arctic-ice' ? colors[0] : '#ffffff' }}
                >
                  Coffee Station Alpha
                </span>
              </div>
              <Wifi 
                className="w-3 h-3" 
                style={{ color: colors[1] }}
              />
            </div>
            
            {/* Progress bars */}
            <div className="mt-2 space-y-1">
              {[75, 60, 90].map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="flex-1 h-1 rounded-full opacity-30"
                    style={{ backgroundColor: colors[1] }}
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: colors[1],
                        width: `${value}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <div 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: colors[0] }}
            />
            <div 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: colors[1] }}
            />
          </div>
          
          <Badge 
            className="text-xs border-0"
            style={{ 
              backgroundColor: `${colors[1]}20`,
              color: theme === 'arctic-ice' ? colors[0] : '#ffffff'
            }}
          >
            Preview
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}