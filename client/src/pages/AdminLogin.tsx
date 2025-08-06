import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Coffee, Lock, User, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid email/password
      if (data.email && data.password.length >= 6) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        // In a real app, you'd redirect to the admin dashboard
        window.location.href = '/admin';
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      {/* Background patterns */}
      <div className="fixed inset-0 neural-pattern opacity-20 pointer-events-none" />
      
      {/* Floating theme selector */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeSelector />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex items-center space-x-3 mb-6 cursor-pointer"
            >
              <div className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center">
                <Coffee className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">CoffeeOps</h1>
                <Badge variant="secondary" className="glass text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Portal
                </Badge>
              </div>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Welcome Back
            </h2>
            <p className="text-text-secondary">
              Sign in to access the admin dashboard
            </p>
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass premium-glow p-8 rounded-3xl"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-primary font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@coffeeops.com"
                          className="glass pl-12 h-12 border-glass-border focus:border-accent-primary transition-colors"
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-primary font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="glass pl-12 pr-12 h-12 border-glass-border focus:border-accent-primary transition-colors"
                          data-testid="input-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent-primary hover:bg-opacity-20"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-text-secondary" />
                          ) : (
                            <Eye className="w-4 h-4 text-text-secondary" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-glass-border text-accent-primary focus:ring-accent-primary focus:ring-opacity-50"
                    data-testid="checkbox-remember"
                  />
                  <span className="text-text-secondary">Remember me</span>
                </label>
                
                <Link href="/forgot-password">
                  <span className="text-accent-primary hover:text-accent-secondary cursor-pointer font-medium">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="gradient-accent w-full h-12 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Sign In to Admin</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Demo credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 glass rounded-xl border border-accent-primary border-opacity-30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-accent-primary">Demo Credentials</span>
            </div>
            <div className="text-xs text-text-secondary space-y-1">
              <p>Email: admin@coffeeops.com</p>
              <p>Password: admin123</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-text-secondary text-sm"
        >
          <p>
            Need access? Contact your system administrator
          </p>
          <Link href="/" className="text-accent-primary hover:text-accent-secondary font-medium">
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}