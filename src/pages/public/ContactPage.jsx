import React, { useState } from 'react';
import {
  Mail,
  Building,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Flame,
  Instagram,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Message sent! Our support team will get back to you shortly.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex justify-center mb-2">
          <BrandLogo size="md" showText={false} href="/" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch with Torchbearer AI
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Have a question, feedback, or want support for your opportunities or account? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-4 md:col-span-1">
          {/* Primary Email */}
          <a
            href="mailto:teamtorchbearerai@gmail.com"
            className="block p-5 bg-white hover:bg-amber-50/50 transition rounded-2xl border border-slate-200 hover:border-amber-300 shadow-card space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Official Support</h3>
            <p className="text-xs font-semibold text-amber-600 break-all">teamtorchbearerai@gmail.com</p>
            <p className="text-[11px] text-slate-400">Direct inbox for all student & partner inquiries</p>
          </a>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/torchbearer.ai?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="block p-5 bg-white hover:bg-pink-50/50 transition rounded-2xl border border-slate-200 hover:border-pink-300 shadow-card space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Instagram</h3>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition" />
            </div>
            <p className="text-xs font-semibold text-pink-600">@torchbearer.ai</p>
            <p className="text-[11px] text-slate-400">Daily opportunity alerts, tips & community</p>
          </a>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quality Moderation</h3>
            <p className="text-xs text-slate-500">Report broken links or issues via email</p>
            <p className="text-[11px] text-slate-400">Reviewed within 24 hours</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. The Torchbearer AI team will review your note and respond back to {formData.email} as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                >
                  <option value="General Inquiry">General Question / Inquiry</option>
                  <option value="Campus Ambassador">Campus Ambassador Program</option>
                  <option value="Placement Cell">College Placement Cell Verification</option>
                  <option value="Opportunity Submission">Submit Opportunity for Verification</option>
                  <option value="Report Bug">Report a Bug / Platform Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold border-0 shadow-md shadow-amber-500/25"
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
