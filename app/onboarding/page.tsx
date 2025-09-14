"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { formatPhone } from '@/lib/phone';
import { weeksFromLMP } from '@/lib/gestation';
import { track } from '@/lib/analytics';

const steps = [
  'Personal Information',
  'Pregnancy Details', 
  'Emergency Contacts',
  'Consent & Preferences'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    country: 'NG',
    lmp: '',
    parity: 0,
    riskFlags: {} as Record<string, boolean>,
    customRiskFactors: [] as string[],
    emergencyContact: {
      name: '',
      phone: ''
    },
    consent: {
      data: false,
      sms: false,
      whatsapp: false,
      share: false
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // TODO: Submit form data to API
    console.log('Completing onboarding:', formData);
    track('onboarding_completed');
    router.push('/dashboard');
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
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Labels */}
      <div className="w-full bg-secondary/20 px-4 py-2">
        <ul className="flex justify-between text-xs text-gray-600 mb-2">
          {["Info","Pregnancy","Contacts","Consent"].map((l,i)=>(
            <li key={l} className={i<=currentStep ? "font-medium text-[rgb(var(--primary-foreground))]" : ""}>{l}</li>
          ))}
        </ul>
        <div 
          className="h-2 bg-accent transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
            {steps[currentStep]}
          </h1>
          <p className="text-muted-foreground">
            Let's get you set up for a safe and healthy pregnancy journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 0 && "Tell us about yourself"}
              {currentStep === 1 && "Your pregnancy information"}
              {currentStep === 2 && "Emergency contact details"}
              {currentStep === 3 && "Privacy and communication preferences"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name *</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                      placeholder="+234 XXX XXX XXXX"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full h-12 px-3 border border-input rounded-xl bg-background"
                  >
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                    <option value="GH">Ghana</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Pregnancy Details */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lmp">Last Menstrual Period (LMP) *</Label>
                  <Input
                    id="lmp"
                    type="date"
                    value={formData.lmp}
                    onChange={(e) => setFormData({...formData, lmp: e.target.value})}
                    className="h-12"
                  />
                  {formData.lmp && (() => {
                    const weeks = weeksFromLMP(formData.lmp);
                    return weeks !== null ? (
                      <p className="text-sm text-muted-foreground">
                        You're ~ <strong>{weeks} weeks</strong>.
                      </p>
                    ) : null;
                  })()}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parity">Number of previous pregnancies</Label>
                  <Input
                    id="parity"
                    type="number"
                    min="0"
                    value={formData.parity}
                    onChange={(e) => setFormData({...formData, parity: parseInt(e.target.value)})}
                    className="h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Risk factors (check all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'diabetes',
                      'hypertension', 
                      'preeclampsia_history',
                      'multiple_pregnancy',
                      'advanced_maternal_age'
                    ].map((risk) => (
                      <div key={risk} className="flex items-center space-x-2">
                        <Checkbox
                          id={risk}
                          checked={formData.riskFlags[risk] || false}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData, 
                              riskFlags: {...formData.riskFlags, [risk]: !!checked}
                            })
                          }
                        />
                        <Label htmlFor={risk} className="text-sm">
                          {risk.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Manual Risk Factor Input */}
                  <div className="space-y-3">
                    <Label>Additional risk factors (if any)</Label>
                    <div className="space-y-2">
                      {formData.customRiskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={factor}
                            onChange={(e) => {
                              const newFactors = [...formData.customRiskFactors];
                              newFactors[index] = e.target.value;
                              setFormData({...formData, customRiskFactors: newFactors});
                            }}
                            placeholder="Enter risk factor"
                            className="h-10"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newFactors = formData.customRiskFactors.filter((_, i) => i !== index);
                              setFormData({...formData, customRiskFactors: newFactors});
                            }}
                            className="h-10 w-10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData, 
                            customRiskFactors: [...formData.customRiskFactors, '']
                          });
                        }}
                        className="h-10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Risk Factor
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Emergency Contacts */}
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData, 
                        emergencyContact: {...formData.emergencyContact, name: e.target.value}
                      })}
                      placeholder="Contact person's name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData, 
                        emergencyContact: {...formData.emergencyContact, phone: formatPhone(e.target.value)}
                      })}
                      placeholder="+234 XXX XXX XXXX"
                      className="h-12"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Consent & Preferences */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataConsent"
                      checked={formData.consent.data}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          consent: {...formData.consent, data: !!checked}
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="dataConsent" className="text-sm font-medium">
                        Data Collection & Processing *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to SafeMama collecting and processing my health data for monitoring and care coordination.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="smsConsent"
                      checked={formData.consent.sms}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          consent: {...formData.consent, sms: !!checked}
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="smsConsent" className="text-sm font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive health reminders, appointment notifications, and emergency alerts via SMS.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="whatsappConsent"
                      checked={formData.consent.whatsapp}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          consent: {...formData.consent, whatsapp: !!checked}
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="whatsappConsent" className="text-sm font-medium">
                        WhatsApp Messages
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates and communicate with healthcare providers via WhatsApp.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="shareConsent"
                      checked={formData.consent.share}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          consent: {...formData.consent, share: !!checked}
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="shareConsent" className="text-sm font-medium">
                        Emergency Data Sharing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Allow sharing of critical health information with emergency responders and healthcare providers when needed.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!formData.consent.data}
              className="bg-accent hover:bg-accent/90"
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  function isStepValid(): boolean {
    switch (currentStep) {
      case 0:
        return !!(formData.displayName.trim() && formData.phone.trim());
      case 1:
        return !!formData.lmp.trim();
      case 2:
        return !!(formData.emergencyContact.name.trim() && formData.emergencyContact.phone.trim());
      case 3:
        return formData.consent.data;
      default:
        return true;
    }
  }
}