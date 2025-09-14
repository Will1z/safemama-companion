'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AuthGate } from '@/components/ui/AuthGate';
import { 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Heart,
  X,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Mock clinic data
const mockClinics = [
  {
    id: 1,
    name: "City Medical Center",
    address: "123 Main St, City, State 12345",
    phone: "+1-555-0123",
    distance: "0.8 miles",
    waitTime: "15 min",
    rating: 4.8
  },
  {
    id: 2,
    name: "Women's Health Clinic",
    address: "456 Oak Ave, City, State 12345", 
    phone: "+1-555-0456",
    distance: "1.2 miles",
    waitTime: "30 min",
    rating: 4.6
  },
  {
    id: 3,
    name: "Family Care Associates",
    address: "789 Pine St, City, State 12345",
    phone: "+1-555-0789",
    distance: "2.1 miles", 
    waitTime: "45 min",
    rating: 4.4
  }
];

// Mock emergency contacts
const emergencyContacts = [
  {
    name: "Emergency Services",
    phone: "911",
    type: "Emergency"
  },
  {
    name: "Poison Control",
    phone: "1-800-222-1222", 
    type: "Poison Control"
  },
  {
    name: "OB/GYN On-Call",
    phone: "+1-555-HELP",
    type: "Medical"
  }
];

export function RiskCards() {
  const [showLowRiskModal, setShowLowRiskModal] = useState(false);
  const [showModerateRiskModal, setShowModerateRiskModal] = useState(false);
  const [showHighRiskModal, setShowHighRiskModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [savedContacts, setSavedContacts] = useState<string[]>([]);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com?q=${encodedAddress}`, '_blank');
  };

  const handleSaveContact = (contact: string) => {
    setSavedContacts(prev => [...prev, contact]);
  };

  const handleSetReminders = () => {
    setShowReminderModal(true);
  };

  const handleBookAppointment = () => {
    setShowBookingModal(true);
  };

  const handleModerateRisk = () => {
    setShowModerateRiskModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Low Risk Card */}
        <Card 
          className="risk-tier-1 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          onClick={() => setShowLowRiskModal(true)}
        >
          <CardContent className="p-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-slate-800">Low Risk - Monitor</h3>
            </div>
            <p className="text-sm text-slate-700">
              Self care and monitor. Continue with regular check-ups and maintain healthy habits.
            </p>
          </CardContent>
        </Card>

        {/* Moderate Risk Card */}
        <Card 
          className="risk-tier-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          onClick={handleModerateRisk}
        >
          <CardContent className="p-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[rgb(var(--warning))] text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-slate-900">Moderate Risk - Visit clinic within 24 hours</h3>
            </div>
            <p className="text-sm text-slate-800">
              Enhanced monitoring recommended. Schedule an appointment with your healthcare provider soon.
            </p>
          </CardContent>
        </Card>

        {/* High Risk Card */}
        <Card 
          className="risk-tier-3 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          onClick={() => setShowHighRiskModal(true)}
        >
          <CardContent className="p-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[rgb(var(--destructive))] text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-[rgb(var(--destructive-foreground))]">High Risk - Seek immediate care</h3>
            </div>
            <p className="text-sm text-[rgb(var(--destructive-foreground))]">
              Go to the nearest equipped facility now. Immediate medical attention required.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Risk Modal */}
      <Dialog open={showLowRiskModal} onOpenChange={setShowLowRiskModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Low Risk - Self Care Tips
            </DialogTitle>
            <DialogDescription>
              Here are some helpful tips for monitoring your health at home.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[rgb(var(--success))]/60 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[rgb(var(--success-foreground))] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[rgb(var(--success-foreground))]">Continue regular check-ups</h4>
                  <p className="text-sm text-[rgb(var(--success-foreground))]/80">Keep your scheduled prenatal appointments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-[rgb(var(--info))]/60 rounded-lg">
                <Clock className="w-5 h-5 text-[rgb(var(--info-foreground))] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[rgb(var(--info-foreground))]">Monitor symptoms</h4>
                  <p className="text-sm text-[rgb(var(--info-foreground))]/80">Track any changes in your condition daily</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-[rgb(var(--accent))]/60 rounded-lg">
                <Heart className="w-5 h-5 text-[rgb(var(--accent-foreground))] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[rgb(var(--accent-foreground))]">Maintain healthy habits</h4>
                  <p className="text-sm text-[rgb(var(--accent-foreground))]/80">Eat well, stay hydrated, and get adequate rest</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowLowRiskModal(false)} 
                variant="outline" 
                className="flex-1"
              >
                Close
              </Button>
              <AuthGate 
                reason="Set reminders"
                onAuthed={handleSetReminders}
              >
                <Button className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Reminders
                </Button>
              </AuthGate>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Moderate Risk Modal */}
      <Dialog open={showModerateRiskModal} onOpenChange={setShowModerateRiskModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[rgb(var(--warning-foreground))]" />
              Nearby Healthcare Facilities
            </DialogTitle>
            <DialogDescription>
              Find a clinic near you for your appointment within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {mockClinics.map((clinic) => (
              <Card key={clinic.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground">{clinic.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {clinic.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {clinic.waitTime} wait
                        </span>
                        <span>⭐ {clinic.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCall(clinic.phone)}
                      className="flex-1"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDirections(clinic.address)}
                      className="flex-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <AuthGate 
                      reason="Book appointment"
                      onAuthed={handleBookAppointment}
                    >
                      <Button size="sm" className="flex-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Book
                      </Button>
                    </AuthGate>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* High Risk Modal */}
      <Dialog open={showHighRiskModal} onOpenChange={setShowHighRiskModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[rgb(var(--destructive-foreground))]" />
              Emergency Response
            </DialogTitle>
            <DialogDescription>
              Immediate action required. Choose the most appropriate option for your situation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCall(contact.phone)}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <AuthGate 
                      reason="Save emergency contact"
                      onAuthed={() => handleSaveContact(contact.name)}
                    >
                      <Button 
                        size="sm" 
                        variant={savedContacts.includes(contact.name) ? "primary" : "outline"}
                        disabled={savedContacts.includes(contact.name)}
                      >
                        {savedContacts.includes(contact.name) ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Heart className="w-3 h-3 mr-1" />
                        )}
                        {savedContacts.includes(contact.name) ? 'Saved' : 'Save'}
                      </Button>
                    </AuthGate>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={() => handleDirections('nearest hospital emergency room')}
                className="w-full"
                variant="danger"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearest Emergency Facility
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Setup Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Health Reminders</DialogTitle>
            <DialogDescription>
              Configure reminders to help you stay on track with your health monitoring.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Reminder setup feature coming soon!
              </p>
            </div>
            
            <Button 
              onClick={() => setShowReminderModal(false)} 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule your appointment with the healthcare provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Appointment booking feature coming soon!
              </p>
            </div>
            
            <Button 
              onClick={() => setShowBookingModal(false)} 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
