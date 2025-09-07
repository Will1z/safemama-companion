'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { Smile, Frown, Meh, Heart, Zap, Coffee } from 'lucide-react';
import { toast } from 'sonner';

interface MoodCheckinProps {
  userId: string;
}

const moodOptions = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
  { id: 'calm', label: 'Calm', icon: Heart, color: 'text-green-500' },
  { id: 'tired', label: 'Tired', icon: Coffee, color: 'text-blue-500' },
  { id: 'stressed', label: 'Stressed', icon: Zap, color: 'text-orange-500' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-purple-500' },
  { id: 'nauseous', label: 'Nauseous', icon: Meh, color: 'text-red-500' },
];

export function MoodCheckin({ userId }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select how you\'re feeling');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('mood_checkins')
        .insert({
          user_id: userId,
          mood: selectedMood,
          note: note.trim() || null,
        });

      if (error) {
        console.error('Error saving mood:', error);
        toast.error('Something went wrong. Please try again.');
        return;
      }

      setIsSubmitted(true);
      toast.success('Thank you for checking in!');
      
      // Reset form after a delay
      setTimeout(() => {
        setSelectedMood(null);
        setNote('');
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error saving mood check-in:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-pink-500" />
            How are you feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-4xl">💝</div>
            <p className="text-gray-700 font-medium">
              You are doing well. Small steps count.
            </p>
            <p className="text-sm text-gray-500">
              Thank you for taking care of yourself today.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-pink-500" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  size="sm"
                  className={`h-16 flex flex-col gap-1 ${
                    selectedMood === mood.id 
                      ? 'bg-pink-100 border-pink-300 text-pink-700' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <Icon className={`h-5 w-5 ${mood.color}`} />
                  <span className="text-xs">{mood.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label htmlFor="mood-note" className="text-sm font-medium text-gray-700">
              Anything you'd like to share? (optional)
            </label>
            <Textarea
              id="mood-note"
              placeholder="How are you feeling today? What's on your mind?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {note.length}/500
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save my check-in'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
