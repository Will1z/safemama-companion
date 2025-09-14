'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Pill, Heart, Stethoscope, Clock } from 'lucide-react';
import { currentTrimester, getTrimesterInfo } from '@/lib/trimester';
import { LegalNote } from '@/components/LegalNote';

interface PersonalizedPlanProps {
  userProfile?: {
    due_date?: string;
    last_period_date?: string;
  };
  userConditions?: string[];
  userHistory?: {
    parity?: number;
    previous_complications?: string;
  };
}

export function PersonalizedPlan({ 
  userProfile, 
  userConditions = [], 
  userHistory 
}: PersonalizedPlanProps) {
  const trimester = currentTrimester(userProfile?.due_date, userProfile?.last_period_date);
  const trimesterInfo = getTrimesterInfo(trimester);

  // Generate personalized recommendations
  const getRecommendations = () => {
    const recommendations = [];

    // Visit reminders based on trimester
    if (trimester === 1) {
      recommendations.push({
        id: 'anc-visit-1',
        type: 'visit',
        title: 'First ANC Visit',
        description: 'Schedule your first antenatal care visit if you haven\'t already',
        frequency: 'Once',
        icon: Calendar,
        priority: 'high'
      });
    } else if (trimester === 2) {
      recommendations.push({
        id: 'anc-visit-2',
        type: 'visit',
        title: 'Regular ANC Visits',
        description: 'Continue with monthly antenatal care visits',
        frequency: 'Monthly',
        icon: Calendar,
        priority: 'medium'
      });
    } else if (trimester === 3) {
      recommendations.push({
        id: 'anc-visit-3',
        type: 'visit',
        title: 'Frequent ANC Visits',
        description: 'Increase to bi-weekly visits as you approach your due date',
        frequency: 'Every 2 weeks',
        icon: Calendar,
        priority: 'high'
      });
    }

    // Condition-specific recommendations
    if (userConditions.includes('anemia') || userConditions.includes('iron deficiency')) {
      recommendations.push({
        id: 'iron-supplement',
        type: 'medication',
        title: 'Iron Supplement',
        description: 'Consider iron supplements as recommended by your healthcare provider',
        frequency: 'Daily',
        icon: Pill,
        priority: 'high'
      });
    }

    if (userConditions.includes('hypertension') || userConditions.includes('high blood pressure')) {
      recommendations.push({
        id: 'bp-monitoring',
        type: 'monitoring',
        title: 'Blood Pressure Check',
        description: 'Monitor your blood pressure regularly',
        frequency: 'Weekly',
        icon: Stethoscope,
        priority: 'high'
      });
    }

    if (userConditions.includes('diabetes') || userConditions.includes('gestational diabetes')) {
      recommendations.push({
        id: 'glucose-monitoring',
        type: 'monitoring',
        title: 'Blood Sugar Monitoring',
        description: 'Check your blood sugar levels as advised by your doctor',
        frequency: 'As prescribed',
        icon: Stethoscope,
        priority: 'high'
      });
    }

    // General recommendations
    recommendations.push({
      id: 'folic-acid',
      type: 'medication',
      title: 'Folic Acid',
      description: 'Continue taking folic acid supplements',
      frequency: 'Daily',
      icon: Pill,
      priority: 'medium'
    });

    if (trimester >= 2) {
      recommendations.push({
        id: 'kick-counting',
        type: 'monitoring',
        title: 'Fetal Movement',
        description: 'Start counting baby kicks daily',
        frequency: 'Daily',
        icon: Heart,
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return Calendar;
      case 'medication':
        return Pill;
      case 'monitoring':
        return Stethoscope;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Your Personalized Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                {trimesterInfo.name} ({trimesterInfo.weeks})
              </h3>
              <p className="text-sm text-blue-700">
                {trimesterInfo.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Your Recommendations</h4>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec) => {
                    const Icon = getTypeIcon(rec.type);
                    return (
                      <div key={rec.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-gray-900">{rec.title}</h5>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(rec.priority)}`}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                          <p className="text-xs text-gray-500">Frequency: {rec.frequency}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Complete your profile to get personalized recommendations.
                </p>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                Update My Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <LegalNote />
    </div>
  );
}
