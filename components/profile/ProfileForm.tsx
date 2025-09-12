'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Save, User, Calendar, Globe, Heart } from 'lucide-react';

interface Profile {
  id: string;
  full_name?: string;
  due_date?: string;
  last_period_date?: string;
  language?: string;
  default_clinician_email?: string;
}

interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  is_emergency: boolean;
}

interface PregnancyHistory {
  id: string;
  parity?: number;
  previous_complications?: string;
  conditions?: string;
}

interface ProfileFormProps {
  initialProfile?: Profile | null;
  initialHistory?: PregnancyHistory | null;
  initialContacts?: EmergencyContact[] | null;
  userId: string;
}

const commonConditions = [
  'anemia',
  'hypertension',
  'diabetes',
  'gestational diabetes',
  'iron deficiency',
  'high blood pressure',
  'thyroid issues',
  'asthma',
  'depression',
  'anxiety',
];

export function ProfileForm({ initialProfile, initialHistory, initialContacts, userId }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || '',
    due_date: initialProfile?.due_date || '',
    last_period_date: initialProfile?.last_period_date || '',
    language: initialProfile?.language || 'en',
    default_clinician_email: initialProfile?.default_clinician_email || '',
    parity: initialHistory?.parity || 0,
    previous_complications: initialHistory?.previous_complications || '',
    conditions: initialHistory?.conditions ? initialHistory.conditions.split(', ') : [],
    emergency_contact_name: initialContacts?.find(c => c.is_emergency)?.name || '',
    emergency_contact_phone: initialContacts?.find(c => c.is_emergency)?.phone || '',
  });

  const supabase = createClient();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: formData.full_name || null,
          due_date: formData.due_date || null,
          last_period_date: formData.last_period_date || null,
          language: formData.language,
          default_clinician_email: formData.default_clinician_email || null,
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update profile. Please try again.');
        return;
      }

      // Update pregnancy history
      const { error: historyError } = await supabase
        .from('pregnancy_history')
        .upsert({
          user_id: userId,
          parity: formData.parity || 0,
          previous_complications: formData.previous_complications || null,
          conditions: formData.conditions.length > 0 ? formData.conditions.join(', ') : null,
        });

      if (historyError) {
        console.error('Error updating pregnancy history:', historyError);
        toast.error('Failed to update pregnancy history. Please try again.');
        return;
      }

      // Update emergency contact
      if (formData.emergency_contact_name && formData.emergency_contact_phone) {
        // First, remove existing emergency contacts
        await supabase
          .from('contacts')
          .delete()
          .eq('user_id', userId)
          .eq('is_emergency', true);

        // Insert new emergency contact
        const { error: contactError } = await supabase
          .from('contacts')
          .insert({
            user_id: userId,
            name: formData.emergency_contact_name,
            phone: formData.emergency_contact_phone,
            is_emergency: true,
          });

        if (contactError) {
          console.error('Error updating emergency contact:', contactError);
          toast.error('Failed to update emergency contact. Please try again.');
          return;
        }
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="yo">Yoruba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_clinician_email">Default Clinician Email (Optional)</Label>
            <Input
              id="default_clinician_email"
              type="email"
              value={formData.default_clinician_email}
              onChange={(e) => handleInputChange('default_clinician_email', e.target.value)}
              placeholder="doctor@clinic.com"
            />
            <p className="text-xs text-gray-500">
              Set your doctor's email address to make sending health reports easier. You can always override this when sending reports.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                placeholder="+1234567890"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            This contact will be used in emergency situations and can be called from the Help page.
          </p>
        </CardContent>
      </Card>

      {/* Pregnancy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-pink-500" />
            Pregnancy Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_period_date">Last Period Date</Label>
              <Input
                id="last_period_date"
                type="date"
                value={formData.last_period_date}
                onChange={(e) => handleInputChange('last_period_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parity">Number of Previous Pregnancies</Label>
            <Input
              id="parity"
              type="number"
              min="0"
              value={formData.parity}
              onChange={(e) => handleInputChange('parity', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous_complications">Previous Complications (optional)</Label>
            <Textarea
              id="previous_complications"
              value={formData.previous_complications}
              onChange={(e) => handleInputChange('previous_complications', e.target.value)}
              placeholder="Describe any previous pregnancy complications..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Select any conditions that apply to you. This helps us provide personalized recommendations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={formData.conditions.includes(condition)}
                  onCheckedChange={() => handleConditionToggle(condition)}
                />
                <Label htmlFor={condition} className="text-sm">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
