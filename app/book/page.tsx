"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarCheck, User, Mail, Video } from "lucide-react";
import { toast } from "sonner";

export default function BookingPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const[availabilities, setAvailabilities] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  
  const [name, setName] = useState("");
  const[email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const[isSuccess, setIsSuccess] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const supabase = createClient();

  // Fetch Doctors on load
  useEffect(() => {
    async function fetchDoctors() {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'doctor');
      if (data) setDoctors(data);
    }
    fetchDoctors();
  }, [supabase]);

  // Fetch Time Slots when a doctor is selected
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDoctor) return;
      const { data } = await supabase
        .from('availabilities')
        .select('*')
        .eq('doctor_id', selectedDoctor.id)
        .eq('is_booked', false) // Only show available slots
        .order('available_date', { ascending: true });
      if (data) setAvailabilities(data);
    }
    fetchSlots();
  }, [selectedDoctor, supabase]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return  toast.error("Please select a time slot.", { description: "Please select a time slot." });
    
    setIsLoading(true);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: name,
          patientEmail: email,
          doctorId: selectedDoctor.id,
          availabilityId: selectedSlot.id,
          date: selectedSlot.available_date,
          time: selectedSlot.time_slot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setMeetingLink(data.booking.meeting_link);
      } else {
          toast.error("Booking failed", { description: data.error });

        
      }
    } catch (error) {
                toast.error("Booking failed", { description: "Something went wrong" });

    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CalendarCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
          <p className="text-slate-600">
            We have sent an email to <strong>{email}</strong> with your appointment details and video link.
          </p>
          <div className="pt-6 border-t border-slate-100">
            <Button className="w-full h-12 text-lg" asChild>
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                <Video className="mr-2 h-5 w-5" /> Join Video Call Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-slate-600 mt-2">Select a doctor and an available time slot below.</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleBooking} className="space-y-6">
            
            {/* Step 1: Select Doctor */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">1. Select Doctor</Label>
              {doctors.length === 0 ? (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  loading Doctor !!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map(doc => (
                    <div 
                      key={doc.id}
                      onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedDoctor?.id === doc.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <h3 className="font-semibold text-slate-900">Dr. {doc.name}</h3>
                      <p className="text-sm text-slate-500">General Practice</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Time Slot */}
            {selectedDoctor && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Label className="text-base font-semibold">2. Select Available Time</Label>
                {availabilities.length === 0 ? (
                  <p className="text-sm text-slate-500">loading appointment slots ..........</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availabilities.map(slot => (
                      <div 
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 text-center rounded-lg border cursor-pointer text-sm font-medium transition-colors ${selectedSlot?.id === slot.id ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        <div className="mb-1">{new Date(slot.available_date).toLocaleDateString()}</div>
                        <div>{slot.time_slot}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Details */}
            {selectedSlot && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Label className="text-base font-semibold">3. Your Details</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Abebe Bikila" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="patient@example.com" />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Confirm Booking"}
                </Button>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}