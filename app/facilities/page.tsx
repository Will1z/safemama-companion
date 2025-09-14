"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/ui/BottomNav';
import { ArrowLeft, MapPin, Phone, Navigation, Clock, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

interface Facility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  services: string[];
  phone: string | null;
  address: string;
  distance?: number;
}

export default function FacilitiesPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        track('facility_locator_location_accessed', { 
          lat: location.lat, 
          lng: location.lng 
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enable location services.');
        // Fallback to Lagos coordinates
        setUserLocation({ lat: 6.5244, lng: 3.3792 });
      }
    );
  };

  // Fetch facilities from the database
  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/facilities');
      if (!response.ok) {
        throw new Error('Failed to fetch facilities');
      }
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Fallback to mock data
      const mockFacilities: Facility[] = [
        {
          id: '1',
          name: 'Lagos University Teaching Hospital',
          lat: 6.5244,
          lng: 3.3792,
          services: ['delivery', 'csection', 'blood_bank'],
          phone: '+234-1-7749304',
          address: 'Idi-Araba, Surulere, Lagos'
        },
        {
          id: '2',
          name: 'Lagos State University Teaching Hospital',
          lat: 6.5895,
          lng: 3.2582,
          services: ['delivery', 'csection', 'blood_bank'],
          phone: '+234-1-7345678',
          address: 'Ikeja, Lagos'
        },
        {
          id: '3',
          name: 'National Orthopaedic Hospital Igbobi',
          lat: 6.5244,
          lng: 3.3847,
          services: ['delivery', 'csection', 'blood_bank'],
          phone: '+234-1-7940234',
          address: 'Igbobi, Lagos'
        }
      ];
      setFacilities(mockFacilities);
    }
  };

  // Calculate distances and sort facilities
  useEffect(() => {
    if (userLocation && facilities.length > 0) {
      const facilitiesWithDistance = facilities.map(facility => ({
        ...facility,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          facility.lat,
          facility.lng
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setFacilities(facilitiesWithDistance);
      setLoading(false);
    }
  }, [userLocation, facilities.length]);

  useEffect(() => {
    getUserLocation();
    fetchFacilities();
  }, []);

  const openInMaps = (facility: Facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(url, '_blank');
    track('facility_directions_opened', { facilityId: facility.id, facilityName: facility.name });
  };

  const callFacility = (facility: Facility) => {
    if (facility.phone) {
      window.open(`tel:${facility.phone}`, '_self');
      track('facility_called', { facilityId: facility.id, facilityName: facility.name });
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'delivery': return '👶';
      case 'csection': return '🏥';
      case 'blood_bank': return '🩸';
      default: return '🏥';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Facility Locator</h1>
                <p className="text-xs text-white/80">Find nearest healthcare facilities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Location Status */}
        {error && (
          <Card className="mb-6 border-[rgb(var(--destructive))]">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-[rgb(var(--destructive-foreground))]">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {!userLocation && !error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground mb-3">
                  Getting your location to find the nearest facilities...
                </p>
                <Button onClick={getUserLocation} variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Enable Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilities List */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading facilities...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {facilities.map((facility, index) => (
              <Card key={facility.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                        <span>{facility.name}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{facility.address}</p>
                    </div>
                    {facility.distance && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {facility.distance.toFixed(1)} km
                        </div>
                        <div className="text-xs text-muted-foreground">away</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {facility.services.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-[rgb(var(--primary))]/10 rounded-full text-xs"
                      >
                        <span>{getServiceIcon(service)}</span>
                        <span className="capitalize">{service.replace('_', ' ')}</span>
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openInMaps(facility)}
                      className="flex-1"
                      size="sm"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    {facility.phone && (
                      <Button
                        onClick={() => callFacility(facility)}
                        variant="outline"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Emergency Notice */}
        <Card className="mt-6 border-[rgb(var(--destructive))]">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-[rgb(var(--destructive-foreground))] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[rgb(var(--destructive-foreground))] mb-2">
                  Emergency Notice
                </h3>
                <p className="text-sm text-[rgb(var(--destructive-foreground))]/80 mb-3">
                  In case of emergency, call your local emergency number immediately. 
                  This facility locator is for informational purposes only.
                </p>
                <Button
                  asChild
                  variant="danger"
                  size="sm"
                >
                  <Link href="/help">
                    <Heart className="w-4 h-4 mr-2" />
                    Emergency Help
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
