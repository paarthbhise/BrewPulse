import { motion } from 'framer-motion';
import { ThemePreviewCard } from '@/components/ThemePreviewCard';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Sparkles, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ThemeShowcase() {
  const { theme, setTheme, themes } = useTheme();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background patterns */}
      <div className="fixed inset-0 neural-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center"
            >
              <Palette className="w-6 h-6 text-white" />
            </motion.div>
            <Badge variant="secondary" className="glass px-4 py-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Collection
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
            Theme Showcase
          </h1>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover our premium collection of professionally crafted themes. 
            Each theme features carefully selected color palettes, advanced glass morphism effects, 
            and sophisticated visual design patterns.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Eye className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-text-primary">Live Preview</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Settings className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-text-primary">Instant Switch</span>
            </div>
          </div>
        </motion.div>

        {/* Current Theme Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 rounded-3xl mb-16 premium-glow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Currently Active
              </h2>
              <p className="text-text-secondary">
                You're using the <span className="font-semibold text-accent-primary">{themes.find(t => t.id === theme)?.name}</span> theme
              </p>
            </div>
            <div 
              className="w-16 h-16 rounded-2xl border-4 border-accent-primary flex items-center justify-center"
              style={{ backgroundColor: themes.find(t => t.id === theme)?.colors[0] }}
            >
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: themes.find(t => t.id === theme)?.colors[1] }}
              />
            </div>
          </div>
          
          <div className="text-text-secondary">
            {themes.find(t => t.id === theme)?.description}
          </div>
        </motion.div>

        {/* Theme Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {themes.map((themeOption) => (
            <motion.div
              key={themeOption.id}
              variants={item}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ThemePreviewCard
                theme={themeOption.id}
                name={themeOption.name}
                description={themeOption.description}
                colors={themeOption.colors}
                isActive={theme === themeOption.id}
                onSelect={() => setTheme(themeOption.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 space-y-12"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Premium Theme Features
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Every theme includes advanced features designed for modern interfaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 gradient-accent rounded-2xl mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                Glass Morphism
              </h3>
              <p className="text-text-secondary text-sm">
                Advanced glass effects with backdrop blur, transparency layers, and dynamic borders
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 gradient-accent rounded-2xl mx-auto flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                Neural Patterns
              </h3>
              <p className="text-text-secondary text-sm">
                Subtle background patterns and shimmer effects that enhance depth and visual interest
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 gradient-accent rounded-2xl mx-auto flex items-center justify-center">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                Smart Colors
              </h3>
              <p className="text-text-secondary text-sm">
                Carefully crafted color palettes with perfect contrast ratios and accessibility
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <Button 
            size="lg" 
            className="gradient-accent px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore More Themes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}