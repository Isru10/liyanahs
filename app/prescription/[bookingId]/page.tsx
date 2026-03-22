"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Stethoscope, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrescriptionPage() {
  const params = useParams();
  const bookingId = params.bookingId;
  const supabase = createClient();

  const [prescription, setPrescription] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const[doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch Prescription
      const { data: presData } = await supabase.from('prescriptions').select('*').eq('booking_id', bookingId).single();
      // Fetch Booking Details
      const { data: bookData } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
      
      if (presData && bookData) {
        setPrescription(presData);
        setBooking(bookData);
        // Fetch Doctor Details
        const { data: docData } = await supabase.from('profiles').select('*').eq('id', bookData.doctor_id).single();
        setDoctor(docData);
      }
      setLoading(false);
    }
    fetchData();
  }, [bookingId, supabase]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

  if (!prescription) {
    return <div className="min-h-screen flex items-center justify-center">Prescription not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <Stethoscope className="mx-auto h-10 w-10 mb-2 opacity-80" />
          <h1 className="text-2xl font-bold">Official E-Prescription</h1>
          <p className="opacity-90">Liyana Health Care Telemedicine</p>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <p className="text-sm text-slate-500 font-medium">Patient Name</p>
              <p className="text-lg font-bold text-slate-900">{booking.patient_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Doctor</p>
              <p className="text-lg font-bold text-slate-900">Dr. {doctor?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Consultation Date</p>
              <p className="text-slate-900">{booking.appointment_date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Issued On</p>
              <p className="text-slate-900">{new Date(prescription.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Note */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
              <FileText className="text-blue-600" /> Medical Advice & Medication
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-800 leading-relaxed min-h-[150px]">
              {prescription.doctor_note}
            </div>
          </div>

          {/* Action */}
          <div className="mt-8 flex justify-center">
            <Button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" /> Download / Print PDF
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}