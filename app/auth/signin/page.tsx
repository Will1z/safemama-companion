"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Check if this is the demo account
      if (formData.email === 'mama@mama.com' && formData.password === 'mama') {
        // First try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'mama@mama.com',
          password: 'mama',
        });

        if (signInError) {
          // If sign in fails, try to create the demo account
          console.log('Demo account sign in failed, attempting to create account:', signInError.message);
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'mama@mama.com',
            password: 'mama',
          });

          if (signUpError) {
            console.error('Demo account creation failed:', signUpError);
            setError('Demo account setup failed. Please try again or contact support.');
            track('sign_up_error', { error: signUpError.message });
          } else {
            console.log('Demo account created successfully');
            // Track successful sign up
            track('sign_up_success', { email: formData.email, isDemo: true });
            
            // Redirect to dashboard
            router.push('/dashboard');
          }
        } else {
          console.log('Demo account sign in successful');
          // Track successful sign in
          track('sign_in_success', { email: formData.email, isDemo: true });
          
          // Redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        // Regular user sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Sign in error:', error);
          setError('Invalid email or password. Please try again.');
          track('sign_in_failed', { email: formData.email });
        } else {
          console.log('User sign in successful');
          // Track successful sign in
          track('sign_in_success', { email: formData.email });
          
          // Redirect to dashboard
          router.push('/dashboard');
        }
      }
      
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Something went wrong. Please try again.');
      track('sign_in_error', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-semibold text-xl text-primary">SafeMama</span>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue your safe pregnancy journey
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-[rgb(var(--destructive))]/60 border border-[rgb(var(--destructive))] rounded-lg text-[rgb(var(--destructive-foreground))] text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Address</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email: 'mama@mama.com', password: 'mama' }));
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Use Demo
                    </button>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-input"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full h-12"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-[rgb(var(--info))]/60 border border-[rgb(var(--info))] rounded-lg">
            <p className="text-sm text-[rgb(var(--info-foreground))] mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="text-sm text-[rgb(var(--info-foreground))] font-mono bg-[rgb(var(--info))]/40 p-2 rounded">
              <div>Email: <strong>mama@mama.com</strong></div>
              <div>Password: <strong>mama</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
