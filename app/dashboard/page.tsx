"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Video, Clock, LogOut, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null);
  const[profile, setProfile] = useState<any>(null);
  
  // Availability State
  const[date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const[isLoading, setIsLoading] = useState(true);

  // Prescription State
  const [activePrescription, setActivePrescription] = useState<string | null>(null);
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      // 1. Get logged in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // 2. Get Doctor Profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      // 3. Get Doctor's Bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("doctor_id", user.id)
        .order("appointment_date", { ascending: true });
      
      if (bookingsData) setBookings(bookingsData);
      setIsLoading(false);
    }
    loadDashboard();
  }, [router, supabase]);

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const { error } = await supabase.from("availabilities").insert([
      {
        doctor_id: user.id,
        available_date: date,
        time_slot: time,
        is_booked: false,
      },
    ]);

    if (error) {
      toast.error("Error adding availability", { description: error.message });
    } else {
      toast.success("Availability added! Patients can now book this slot.",{ description: "Patients can now book this time." });
      setDate("");
      setTime("");
    }
  };

  const handleSavePrescription = async (booking: any) => {
    if (!prescriptionNote.trim()) return toast.warning("Missing Note", { description: "Please write a prescription before saving." });

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          note: prescriptionNote,
          patientEmail: booking.patient_email,
          patientName: booking.patient_name,
        }),
      });

      if (res.ok) {
        toast.success("Prescription saved and emailed to patient!",{ description: "Prescription saved and emailed to patient." });
        setActivePrescription(null);
        setPrescriptionNote("");
        // Update UI to show completed without refreshing the page
        setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'completed' } : b));
      } else {
        const errorData = await res.json();
  toast.error("Failed to save", { description: errorData.error });
      }
    } catch (error) {
        toast.error("Something went wrong", { description: "Something went wrong" });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dr. {profile?.name}</h1>
          <p className="text-sm text-slate-500">Doctor Dashboard</p>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Set Availability */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" /> Set Availability
            </h2>
            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Input type="text" placeholder="10:00 AM - 10:30 AM" required value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Add Time Slot</Button>
            </form>
          </div>
        </div>

        {/* Right Column: Upcoming Bookings & Prescriptions */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" /> Consultations
            </h2>
            
            {bookings.length === 0 ? (
              <p className="text-slate-500 text-sm">No patients have booked yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  // Safely extract the Room ID for LiveKit. If the link is malformed, fallback to "#".
                  const roomLink = booking.meeting_link?.includes('/consultation/') 
                    ? `/consultation/${booking.meeting_link.split('/consultation/')[1]?.split('?')[0]}?name=Dr.${profile?.name}`
                    : '#';

                  return (
                    <div key={booking.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex flex-col gap-4">
                      
                      {/* Top Row: Patient Info & Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{booking.patient_name}</h3>
                          <p className="text-sm text-slate-600">{booking.patient_email}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-blue-700 bg-blue-100 w-fit px-2 py-1 rounded-md">
                            <Calendar size={14} /> {booking.appointment_date} | {booking.appointment_time}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {/* Only show "Join Call" if prescription isn't written yet */}
                          {booking.status !== 'completed' && (
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                              <a href={roomLink} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" /> Join Call
                              </a>
                            </Button>
                          )}
                          
                          {/* Show "Completed" or "Write Prescription" */}
                          {booking.status === 'completed' ? (
                            <span className="text-green-600 font-medium text-sm text-right flex items-center justify-end gap-1 mt-2">
                              <CheckCircle className="h-4 w-4" /> Completed
                            </span>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={() => setActivePrescription(activePrescription === booking.id ? null : booking.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" /> 
                              {activePrescription === booking.id ? "Cancel Note" : "Write Prescription"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expanding Bottom Row: Prescription Input Box */}
                      {activePrescription === booking.id && (
                        <div className="mt-2 p-4 border border-blue-200 bg-blue-50 rounded-lg animate-in fade-in slide-in-from-top-4">
                          <Label className="text-blue-900">Medical Advice & Prescription</Label>
                          <textarea
                            className="w-full mt-2 p-3 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            rows={4}
                            placeholder="e.g., Take Paracetamol 500mg twice a day. Drink plenty of water."
                            value={prescriptionNote}
                            onChange={(e) => setPrescriptionNote(e.target.value)}
                          ></textarea>
                          <Button 
                            onClick={() => handleSavePrescription(booking)} 
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving & Emailing..." : "Save & Send to Patient"}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}