import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="glass px-4 py-2 rounded-xl hover:bg-accent-primary hover:bg-opacity-20 transition-all duration-200 flex items-center space-x-2"
        data-testid="button-theme-toggle"
      >
        <div 
          className="w-4 h-4 rounded-full"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme?.colors[0]}, ${currentTheme?.colors[1]})`
          }}
        />
        <span className="text-sm font-medium hidden md:block">{currentTheme?.name}</span>
        <span className="text-sm font-medium md:hidden">Theme</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 glass rounded-xl p-4 min-w-[280px] z-50"
              data-testid="dropdown-theme-selector"
            >
              <h3 className="text-sm font-semibold text-text-primary mb-3">Choose Theme</h3>
              <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-start space-y-2 p-4 rounded-xl transition-all duration-300 group ${
                      theme === themeOption.id 
                        ? 'bg-accent-primary bg-opacity-20 border border-accent-primary shadow-lg' 
                        : 'glass hover:border-accent-primary hover:bg-accent-primary hover:bg-opacity-10'
                    }`}
                    data-testid={`button-theme-${themeOption.id}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/20"
                            style={{ background: themeOption.colors[0] }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/20"
                            style={{ background: themeOption.colors[1] }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                            {themeOption.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {themeOption.description}
                          </div>
                        </div>
                      </div>
                      {theme === themeOption.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full gradient-accent"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
