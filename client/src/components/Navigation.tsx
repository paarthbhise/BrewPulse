import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ThemeSelector } from './ThemeSelector';
import { Coffee, MapPin, BarChart3, Home, Palette } from 'lucide-react';

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/locator', label: 'Locator', icon: MapPin },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/themes', label: 'Themes', icon: Palette },
  ];

  return (
    <nav className="glass border-b border-glass-border px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              data-testid="link-home"
            >
              <Coffee className="w-8 h-8 text-accent-primary" />
              <h1 className="text-2xl font-bold text-accent-primary">CoffeeOps</h1>
            </motion.div>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 transition-colors duration-200 font-medium cursor-pointer ${
                      isActive 
                        ? 'text-accent-primary' 
                        : 'text-text-secondary hover:text-accent-primary'
                    }`}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeSelector />
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <span className="text-sm font-medium hidden md:block text-text-primary">Admin User</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
