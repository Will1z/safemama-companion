"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Tile from '@/components/ui/Tile';
import { RiskBanner } from '@/components/ui/RiskBanner';
import { track } from '@/lib/analytics';
import BottomNav from '@/components/ui/BottomNav';
import { 
  Heart, 
  MessageCircle, 
  Activity, 
  Calendar,
  MapPin,
  FileText,
  Phone,
  Plus,
  Pill,
  Clock,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  User
} from 'lucide-react';
import Link from 'next/link';
import { DailyTipCard } from '@/components/companion/DailyTipCard';
import { MoodCheckin } from '@/components/companion/MoodCheckin';
import { BreathingExercise } from '@/components/companion/BreathingExercise';
import { PersonalizedPlan } from '@/components/companion/PersonalizedPlan';

// Mock data - replace with real data from Supabase
const mockData = {
  profile: {
    displayName: 'Sarah Johnson',
    weeks: 24,
    nextAppointment: '2024-01-15'
  },
  recentVitals: {
    bp: '120/80',
    weight: '65kg',
    temp: '36.8°C',
    date: '2024-01-10'
  },
  lastSymptom: {
    tier: 1 as 1 | 2 | 3,
    reason: 'Mild headache reported',
    date: '2024-01-10'
  },
  medications: [
    {
      id: 1,
      name: 'Folic Acid',
      dosage: '400mcg',
      frequency: 'Once daily',
      time: '8:00 AM',
      taken: false,
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 2,
      name: 'Iron Supplement',
      dosage: '65mg',
      frequency: 'Once daily',
      time: '2:00 PM',
      taken: true,
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 3,
      name: 'Prenatal Vitamins',
      dosage: '1 tablet',
      frequency: 'Once daily',
      time: '9:00 AM',
      taken: false,
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 4,
      name: 'Calcium',
      dosage: '1000mg',
      frequency: 'Twice daily',
      time: '10:00 AM, 6:00 PM',
      taken: false,
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 5,
      name: 'DHA Omega-3',
      dosage: '200mg',
      frequency: 'Once daily',
      time: '7:00 PM',
      taken: false,
      prescribedBy: 'Dr. Smith'
    }
  ]
};

export default function DashboardPage() {
  const [data, setData] = useState(mockData);
  const [currentWeek, setCurrentWeek] = useState(24);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [isMedicationsExpanded, setIsMedicationsExpanded] = useState(true);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    prescribedBy: ''
  });

  const getWeekMessage = (week: number) => {
    if (week < 12) return "First trimester - Your baby is developing rapidly";
    if (week < 28) return "Second trimester - You might feel your baby's first movements";
    return "Third trimester - Your baby is preparing for birth";
  };

  const toggleMedicationTaken = (medicationId: number) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.id === medicationId ? { ...med, taken: !med.taken } : med
      )
    }));
    track('medication_taken', { medicationId });
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency && newMedication.time) {
      const medication = {
        id: Date.now(),
        name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        time: newMedication.time,
        taken: false,
        prescribedBy: newMedication.prescribedBy || 'Dr. Smith'
      };
      
      setData(prev => ({
        ...prev,
        medications: [...prev.medications, medication]
      }));
      
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        prescribedBy: ''
      });
      setShowAddMedication(false);
      track('medication_added', { medicationName: medication.name });
    }
  };

  const removeMedication = (medicationId: number) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== medicationId)
    }));
    track('medication_removed', { medicationId });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl font-bold">
                Welcome back, {data.profile.displayName}
              </h1>
              <p className="text-white/80">
                Week {currentWeek} • {getWeekMessage(currentWeek)}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{currentWeek}</div>
              <div className="text-sm text-white/80">weeks</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Risk Banner - First Priority */}
        {data.lastSymptom && (
          <RiskBanner
            tier={data.lastSymptom.tier}
            reason={data.lastSymptom.reason}
          />
        )}


        {/* Upcoming - Second Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Upcoming</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div>
                  <div className="font-medium">Next ANC Visit</div>
                  <div className="text-sm text-gray-700 font-medium">{data.profile.nextAppointment}</div>
                </div>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications - New Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <button
                onClick={() => setIsMedicationsExpanded(!isMedicationsExpanded)}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Pill className="w-5 h-5 text-primary" />
                <span>My Medications</span>
                {isMedicationsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddMedication(!showAddMedication)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Medication
              </Button>
            </CardTitle>
          </CardHeader>
          {isMedicationsExpanded ? (
            <CardContent>
            <div className="space-y-3">
              {/* Add Medication Form */}
              {showAddMedication && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medication name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 400mcg)"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Once daily)"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 8:00 AM)"
                      value={newMedication.time}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Prescribed by (optional)"
                    value={newMedication.prescribedBy}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={addMedication} size="sm">
                      Add Medication
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddMedication(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Medication List */}
              {data.medications.map((medication) => (
                <div 
                  key={medication.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    medication.taken 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      medication.taken ? 'bg-green-500' : 'bg-primary'
                    }`}>
                      {medication.taken ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Pill className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.dosage} • {medication.frequency}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {medication.time} • {medication.prescribedBy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={medication.taken ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => toggleMedicationTaken(medication.id)}
                    >
                      {medication.taken ? 'Taken' : 'Mark Taken'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          ) : (
            <CardContent>
              <div className="text-center py-4">
                <div className="text-sm text-gray-600">
                  {data.medications.length} medication{data.medications.length !== 1 ? 's' : ''} • {data.medications.filter(med => med.taken).length} taken today
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Click to expand and manage medications
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Recent Vitals - Third Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Vitals</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/vitals" className="flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => track('vitals_logged', { type: 'bp' })}
              >
                <div className="font-vitals text-lg font-semibold text-primary">
                  {data.recentVitals.bp}
                </div>
                <div className="text-xs text-gray-600 font-medium">Blood Pressure</div>
              </button>
              <button 
                className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => track('vitals_logged', { type: 'weight' })}
              >
                <div className="font-vitals text-lg font-semibold text-primary">
                  {data.recentVitals.weight}
                </div>
                <div className="text-xs text-gray-600 font-medium">Weight</div>
              </button>
              <button 
                className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => track('vitals_logged', { type: 'temp' })}
              >
                <div className="font-vitals text-lg font-semibold text-primary">
                  {data.recentVitals.temp}
                </div>
                <div className="text-xs text-gray-600 font-medium">Temperature</div>
              </button>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="font-vitals text-lg font-semibold text-primary">
                  {data.recentVitals.date.slice(-5)}
                </div>
                <div className="text-xs text-gray-600 font-medium">Last Updated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companion Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Companion</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DailyTipCard 
              userProfile={{
                due_date: '2024-07-15', // Mock data - replace with real profile data
                last_period_date: '2023-10-01'
              }}
              userConditions={['anemia']} // Mock data - replace with real conditions
            />
            
            <MoodCheckin userId="mock-user-id" />
          </div>
          
          <BreathingExercise />
          
          <PersonalizedPlan 
            userProfile={{
              due_date: '2024-07-15',
              last_period_date: '2023-10-01'
            }}
            userConditions={['anemia']}
            userHistory={{
              parity: 0,
              previous_complications: 'None'
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Tile
            tone="neutral"
            href="/learn"
            title="Learn"
            subtitle="Education topics"
            icon={<BookOpen className="w-6 h-6 text-[#1C3D3A]" />}
          />
          <Tile
            tone="accent"
            href="/community"
            title="Community"
            subtitle="Connect with others"
            icon={<Users className="w-6 h-6 text-[#1C3D3A]" />}
          />
          <Tile
            tone="neutral"
            href="/me"
            title="Profile"
            subtitle="Update settings"
            icon={<User className="w-6 h-6 text-[#1C3D3A]" />}
          />
          <Tile
            tone="warn"
            href="/help"
            title="Help"
            subtitle="Get support"
            icon={<Phone className="w-6 h-6 text-[#4A3A00]" />}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}