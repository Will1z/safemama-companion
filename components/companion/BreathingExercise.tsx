'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Wind, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startExercise = () => {
    setIsActive(true);
    setCount(4);
    setPhase('inhale');
  };

  const stopExercise = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCount(4);
    setPhase('inhale');
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else {
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Breathe out gently';
      default:
        return 'Breathe in slowly';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-green-100 border-green-300';
      case 'hold':
        return 'bg-blue-100 border-blue-300';
      case 'exhale':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-green-100 border-green-300';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                Breathing Exercise
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Take a moment to center yourself with this simple breathing exercise. 
                Follow the 4-4-4 pattern: breathe in for 4, hold for 4, breathe out for 4.
              </p>

              {isActive && (
                <div className="text-center space-y-4">
                  <div 
                    className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${getPhaseColor()}`}
                    style={{
                      transform: phase === 'inhale' ? 'scale(1.1)' : 
                                phase === 'hold' ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <span className="text-3xl font-bold text-gray-700">
                      {count}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">
                      {getPhaseText()}
                    </p>
                    <div className="flex justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${phase === 'inhale' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`w-3 h-3 rounded-full ${phase === 'hold' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <div className={`w-3 h-3 rounded-full ${phase === 'exhale' ? 'bg-purple-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!isActive ? (
                  <Button onClick={startExercise} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Breathing
                  </Button>
                ) : (
                  <Button onClick={stopExercise} variant="outline" className="flex-1">
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                This is a relaxation technique. If you feel dizzy, stop and breathe normally.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
