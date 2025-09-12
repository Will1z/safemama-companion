'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Heart, Save, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PregnancyData {
  userId: string;
  dueDate: string;
  lmpDate: string;
  timezone: string;
}

interface PregnancyStatus {
  gaWeeks: number | null;
  trimester: number | null;
  effectiveDueDate: string | null;
  daysToDue: number | null;
}

export default function PregnancySettingsPage() {
  const [formData, setFormData] = useState<PregnancyData>({
    userId: '',
    dueDate: '',
    lmpDate: '',
    timezone: 'Africa/Lagos'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<PregnancyStatus | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Auto-fill userId from session
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoadingUser(false);
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        userId: user.id
      }));
      
      // Try to load existing pregnancy data
      try {
        const response = await fetch(`/api/user/pregnancy?userId=${user.id}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_SAFEMAMA_API_KEY || ''
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.data) {
            setFormData(prev => ({
              ...prev,
              dueDate: result.data.dueDate || '',
              lmpDate: result.data.lmpDate || '',
              timezone: result.data.timezone || 'Africa/Lagos'
            }));
            
            setPregnancyStatus({
              gaWeeks: result.data.gaWeeks,
              trimester: result.data.trimester,
              effectiveDueDate: result.data.effectiveDueDate,
              daysToDue: result.data.daysToDue
            });
          }
        }
      } catch (error) {
        console.error('Error loading existing pregnancy data:', error);
      }
      
      setIsLoadingUser(false);
    };
    
    loadUser();
  }, []);

  const handleInputChange = (field: keyof PregnancyData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.userId.trim()) {
      toast.error('User ID is required');
      return false;
    }
    
    if (!formData.dueDate && !formData.lmpDate) {
      toast.error('Please provide either a due date or last period date');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/pregnancy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_SAFEMAMA_API_KEY || ''
        },
        body: JSON.stringify({
          userId: formData.userId,
          dueDate: formData.dueDate || null,
          lmpDate: formData.lmpDate || null,
          timezone: formData.timezone
        })
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to update pregnancy data');
      }

      if (result.data) {
        setPregnancyStatus({
          gaWeeks: result.data.gaWeeks,
          trimester: result.data.trimester,
          effectiveDueDate: result.data.effectiveDueDate,
          daysToDue: result.data.daysToDue
        });
        
        toast.success('Pregnancy data updated successfully!');
      }
    } catch (error) {
      console.error('Error updating pregnancy data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update pregnancy data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">Pregnancy Settings</h1>
          </div>
          <p className="text-gray-600">
            Loading your pregnancy information...
          </p>
        </div>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pregnancy Settings</h1>
        </div>
        <p className="text-gray-600">
          Set your pregnancy information to get personalized content and track your journey.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Pregnancy Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                placeholder="Enter your user ID"
                disabled={!!formData.userId}
                required
              />
              <p className="text-xs text-gray-500">
                {formData.userId ? 'Auto-filled from your session' : 'Your unique identifier in the system'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Your expected delivery date
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lmpDate">Last Period Date</Label>
                <Input
                  id="lmpDate"
                  type="date"
                  value={formData.lmpDate}
                  onChange={(e) => handleInputChange('lmpDate', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  First day of your last menstrual period
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">Africa/Lagos (Nigeria)</SelectItem>
                  <SelectItem value="Africa/Abidjan">Africa/Abidjan (Ghana)</SelectItem>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi (Kenya)</SelectItem>
                  <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (South Africa)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Helpful Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• If unsure of due date, pick the first day of your last period</li>
                    <li>• We'll calculate your due date automatically from your last period</li>
                    <li>• You can update this information anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Pregnancy Information'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {pregnancyStatus && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Pregnancy Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-700">Gestational Age</Label>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {pregnancyStatus.gaWeeks} weeks
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-700">Trimester</Label>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {pregnancyStatus.trimester === 1 ? 'First' : 
                   pregnancyStatus.trimester === 2 ? 'Second' : 
                   pregnancyStatus.trimester === 3 ? 'Third' : 'Unknown'}
                </Badge>
              </div>
              
              {pregnancyStatus.effectiveDueDate && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-green-700">Effective Due Date</Label>
                  <p className="text-sm text-green-600">
                    {new Date(pregnancyStatus.effectiveDueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {pregnancyStatus.daysToDue !== null && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-green-700">Days to Due Date</Label>
                  <p className="text-sm text-green-600">
                    {pregnancyStatus.daysToDue} days remaining
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
