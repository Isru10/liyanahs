"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stethoscope, Clock, ShieldCheck, Video, HeartPulse, FileText, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 sm:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Stethoscope size={24} />
          <span>Liyana Health</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <a href="#services" className="hover:text-blue-600 transition">Services</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>
        <div className="flex gap-4">
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/login">Doctor Login</Link>
          </Button>
          <Button asChild>
            <Link href="/book">Book Now</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-24 pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
          
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-2 shadow-sm border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Ethiopias Premium Telemedicine
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Consult Top Doctors <br className="hidden sm:block" />
              <span className="text-blue-600">From Your Home.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Skip the waiting room. Connect with certified medical professionals instantly via secure video calls and receive your e-prescription directly to your email.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/book">Book an Appointment</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold" asChild>
                <a href="#services">Explore Services</a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 2. ABOUT SECTION */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Redefining Healthcare Access in Ethiopia</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                At Liyana Health Care, we believe quality healthcare should be accessible to everyone, no matter where they are. Our telemedicine platform bridges the gap between patients and top-tier doctors.
              </p>
              <ul className="space-y-4">
                {[
                  "Verified, highly qualified doctors",
                  "Strict patient data confidentiality",
                  "Available 7 days a week"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-green-500 h-6 w-6" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative">
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                <HeartPulse size={120} className="text-blue-100" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-3xl"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. SERVICES SECTION */}
        <section id="services" className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Can Help You</h2>
              <p className="text-slate-600 text-lg">Comprehensive virtual care tailored to your needs.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Video, title: "Video Consultations", desc: "Face-to-face secure video calls with your doctor directly from your browser." },
                { icon: FileText, title: "E-Prescriptions", desc: "Instant digital prescriptions sent to your email right after your session ends." },
                { icon: Clock, title: "Flexible Booking", desc: "Choose a time slot that works best for your busy schedule without the hassle." }
              ].map((srv, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <srv.icon className="text-blue-600 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{srv.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{srv.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PRICING SECTION */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 text-lg mb-12">No hidden fees. Pay only for the time you need.</p>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border border-blue-100 rounded-3xl p-8 sm:p-12 shadow-sm max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Flat Rate</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Standard Consultation</h3>
              <div className="my-6">
                <span className="text-5xl font-extrabold text-blue-600">500</span>
                <span className="text-xl text-slate-500 font-medium"> ETB</span>
                <span className="text-slate-500"> / session</span>
              </div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 h-5 w-5" /> 30-Minute Video Call</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 h-5 w-5" /> Specialist Doctor Access</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 h-5 w-5" /> Official E-Prescription</li>
              </ul>
              <Button size="lg" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/book">Book Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 5. CONTACT SECTION */}
        <section id="contact" className="py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6">We are Here to Help</h2>
              <p className="text-slate-400 text-lg mb-8">Have questions about our telemedicine platform or need technical support? Reach out to us.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 p-3 rounded-full"><Phone className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm text-slate-400">Call Us</p>
                    <p className="font-semibold">+251 911 234 567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 p-3 rounded-full"><Mail className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm text-slate-400">Email Us</p>
                    <p className="font-semibold">support@liyanahealth.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 p-3 rounded-full"><MapPin className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="font-semibold">Bole, Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Send us a message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for contacting us!"); }}>
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <input type="text" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <input type="email" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Message</label>
                  <textarea rows={4} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
              </form>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-950 py-8 text-center border-t border-slate-800 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Liyana Health Care Telemedicine. All rights reserved.</p>
      </footer>
    </div>
  );
}