'use client';

import React, { useState } from 'react';
import { MessageSquare, BookOpen, ExternalLink, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

const faqs = [
  {
    q: 'How do I get a Plaud API key?',
    a: 'Go to Console → Account Settings → Personal API. Your API key is displayed there. You can also generate a new key at any time.',
  },
  {
    q: 'What is the difference between OAuth and SDK?',
    a: 'OAuth allows your app to access a user\'s Plaud data with their permission (like "Login with Plaud"). The SDK is for building native iOS/Android apps that connect directly to Plaud NotePin hardware via Bluetooth.',
  },
  {
    q: 'How many API calls can I make per minute?',
    a: 'The default rate limit is 60 requests/minute on the Free tier, 300/minute on Pro, and custom limits on Enterprise. Exceeding limits returns a 429 status.',
  },
  {
    q: 'How do I push OTA firmware updates to devices?',
    a: 'In your SDK app\'s Device Management tab, select the devices you want to update and click "Push OTA Update". You can target by tag group and schedule updates for off-peak hours.',
  },
  {
    q: 'Why is my app showing "In Review" status?',
    a: 'New apps with production OAuth scopes require a brief review (1-2 business days) before going live. Sandbox apps are available immediately without review.',
  },
];

export default function SupportPage() {
  const { addToast } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ message: 'Support ticket submitted! We\'ll respond within 24 hours.', type: 'success' });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-full">
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Support</h1>
      </div>

      <div className="px-8 py-6 max-w-4xl mx-auto">
        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <a href="#" className="bg-[#161b22] border border-white/10 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-start gap-3 group">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
              <BookOpen size={18} className="text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1">
                Documentation <ExternalLink size={11} className="text-slate-400" />
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Full API reference &amp; guides</div>
            </div>
          </a>
          <a href="#" className="bg-[#161b22] border border-white/10 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-start gap-3 group">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
              <MessageSquare size={18} className="text-purple-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1">
                Community Forum <ExternalLink size={11} className="text-slate-400" />
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Ask questions, share projects</div>
            </div>
          </a>
          <a href="#" className="bg-[#161b22] border border-white/10 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-start gap-3 group">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
              <Zap size={18} className="text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1">
                API Status <ExternalLink size={11} className="text-slate-400" />
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                <span className="text-emerald-600 font-medium">All systems operational</span>
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start justify-between p-4 text-left gap-3"
                  >
                    <span className="text-sm font-medium text-white">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Contact Support</h2>
            <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-slate-300 bg-[#161b22] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="general">General Question</option>
                    <option value="api">API Issue</option>
                    <option value="billing">Billing</option>
                    <option value="sdk">SDK / Hardware</option>
                    <option value="oauth">OAuth / App Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                    className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm bg-[#161b22] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail. Include any error messages, app IDs, and steps to reproduce."
                    rows={5}
                    required
                    className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm bg-[#161b22] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Send Message
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Typical response time: &lt; 24 hours for Pro, &lt; 48 hours for Free
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
