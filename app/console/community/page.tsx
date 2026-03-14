'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Github,
  MessageSquare,
  ExternalLink,
  ArrowUpRight,
  Users,
  Bookmark,
  Megaphone,
  Star,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { showcaseApps } from '@/lib/mock-data';

// ── Mock data ──────────────────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    badge: 'New',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    title: 'Plaud API v1.4 released — Speaker Diarization & Note Styles',
    excerpt: 'The new release adds per-speaker transcript segments and four new AI note generation styles: meeting summary, action items, bullet points, and narrative.',
    date: 'Mar 10, 2026',
    author: 'Plaud Team',
  },
  {
    id: 'ann_2',
    badge: 'Update',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'SDK v2.4 for iOS & Android — BLE stability improvements',
    excerpt: 'This SDK update addresses BLE reconnection edge cases on iOS 18 and Android 15, plus reduces background battery usage by ~30%.',
    date: 'Feb 28, 2026',
    author: 'Plaud Team',
  },
  {
    id: 'ann_3',
    badge: 'Event',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'Plaud Dev Day — April 22, 2026 (Virtual)',
    excerpt: 'Join us for a full day of live demos, API deep dives, and community showcase sessions. Free to register.',
    date: 'Feb 20, 2026',
    author: 'Plaud Team',
  },
];

const DISCUSSIONS = [
  {
    id: 'disc_1',
    category: 'Q&A',
    categoryColor: 'bg-sky-500/10 text-sky-400',
    title: 'Best way to handle transcript pagination for large archives?',
    excerpt: 'I have users with 2,000+ recordings. Calling GET /v1/transcripts with offset is getting slow. Any recommendations?',
    author: 'dev_margaux',
    replies: 12,
    upvotes: 34,
    timeAgo: '2 hours ago',
    solved: true,
  },
  {
    id: 'disc_2',
    category: 'Show & Tell',
    categoryColor: 'bg-purple-500/10 text-purple-400',
    title: 'Built a real-time Slack bot that posts Plaud summaries on meeting end',
    excerpt: 'Using webhooks + OAuth API. Took about 3 days end-to-end. Happy to open-source if there\'s interest.',
    author: 'kylec_dev',
    replies: 28,
    upvotes: 91,
    timeAgo: '1 day ago',
    solved: false,
  },
  {
    id: 'disc_3',
    category: 'Bug Report',
    categoryColor: 'bg-red-500/10 text-red-400',
    title: 'POST /v1/files/upload returns 500 for .wav files > 100MB on iOS 17',
    excerpt: 'Reproducible on iPhone 12 Pro and 14. Same file uploads fine via web. Filed GitHub issue #1284.',
    author: 'tanaka_builds',
    replies: 6,
    upvotes: 15,
    timeAgo: '3 days ago',
    solved: false,
  },
  {
    id: 'disc_4',
    category: 'Q&A',
    categoryColor: 'bg-sky-500/10 text-sky-400',
    title: 'How to request access to the \'devices:write\' scope for production?',
    excerpt: 'My app needs to push firmware updates and the scope isn\'t available in the standard list. Is this enterprise-only?',
    author: 'priya_iot',
    replies: 4,
    upvotes: 8,
    timeAgo: '5 days ago',
    solved: true,
  },
  {
    id: 'disc_5',
    category: 'Idea',
    categoryColor: 'bg-amber-500/10 text-amber-400',
    title: 'Request: Streaming transcription via WebSocket',
    excerpt: 'Would love to see real-time transcript streaming for live recording use cases. Current polling approach adds 3–5s latency.',
    author: 'felix_rtc',
    replies: 19,
    upvotes: 147,
    timeAgo: '1 week ago',
    solved: false,
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: 'GitHub',
    sublabel: 'SDKs, samples & issue tracker',
    href: 'https://github.com/plaud',
    color: 'hover:border-white/30',
  },
  {
    icon: MessageSquare,
    label: 'Discord',
    sublabel: 'Chat with the community',
    href: '#',
    color: 'hover:border-indigo-500/40',
  },
];

const FILTER_TABS = ['All', 'Q&A', 'Show & Tell', 'Bug Report', 'Idea'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const SHOWCASE_FILTER_TABS = ['All', 'Personal Access', 'SDK', 'OAuth API'] as const;
type ShowcaseFilter = (typeof SHOWCASE_FILTER_TABS)[number];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeDiscussionFilter, setActiveDiscussionFilter] = useState<FilterTab>('All');
  const [activeShowcaseFilter, setActiveShowcaseFilter] = useState<ShowcaseFilter>('All');

  const filteredDiscussions = activeDiscussionFilter === 'All'
    ? DISCUSSIONS
    : DISCUSSIONS.filter(d => d.category === activeDiscussionFilter);

  const filteredShowcase = activeShowcaseFilter === 'All'
    ? showcaseApps
    : showcaseApps.filter(a => a.apiType === activeShowcaseFilter);

  return (
    <div className="flex flex-col min-h-full bg-[#0d1117]">
      {/* Top bar */}
      <div className="px-8 py-5 border-b border-white/10 flex-shrink-0">
        <h1 className="text-xl font-semibold text-white">Community</h1>
        <p className="text-sm text-slate-500 mt-0.5">Connect with other developers building on the Plaud platform</p>
      </div>

      <div className="flex-1 px-8 py-6 space-y-8 overflow-y-auto">

        {/* ── Connect row ── */}
        <div className="grid grid-cols-2 gap-4">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 p-4 bg-[#161b22] border border-white/10 rounded-xl transition-colors ${link.color} group`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <link.icon size={20} className="text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-white">{link.label}</div>
                <div className="text-xs text-slate-500">{link.sublabel}</div>
              </div>
              <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>

        {/* ── Announcements ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-white">Announcements</h2>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.map(ann => (
              <div key={ann.id} className="flex gap-4 p-4 bg-[#161b22] border border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-semibold border rounded px-1.5 py-0.5 leading-none ${ann.badgeColor}`}>
                      {ann.badge}
                    </span>
                    <span className="text-xs text-slate-600">{ann.date}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{ann.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.excerpt}</p>
                </div>
                <ChevronRight size={15} className="text-slate-700 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Discussions ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={15} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Discussions</h2>
            </div>
            <a
              href="https://github.com/plaud/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              View all on GitHub
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mb-4 border-b border-white/10 pb-0">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDiscussionFilter(tab)}
                className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  activeDiscussionFilter === tab
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredDiscussions.map(disc => (
              <div
                key={disc.id}
                className="flex items-start gap-4 px-4 py-3 bg-[#161b22] border border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer group"
              >
                {/* Upvote */}
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
                  <ThumbsUp size={12} className="text-slate-600" />
                  <span className="text-xs text-slate-500 font-medium">{disc.upvotes}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 leading-none ${disc.categoryColor}`}>
                      {disc.category}
                    </span>
                    {disc.solved && (
                      <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded px-1.5 py-0.5 leading-none">
                        Solved
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors leading-snug">{disc.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{disc.excerpt}</p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={11} />
                    {disc.replies}
                  </div>
                  <span>{disc.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Developer Showcase ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={15} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Developer Showcase</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <Bookmark size={11} />
              Submit your app
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mb-4 border-b border-white/10 pb-0">
            {SHOWCASE_FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveShowcaseFilter(tab)}
                className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  activeShowcaseFilter === tab
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredShowcase.map(app => (
              <div
                key={app.id}
                className="flex flex-col gap-2 p-4 bg-[#161b22] border border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">{app.title}</h3>
                  <span className={`text-[10px] font-semibold border rounded px-1.5 py-0.5 leading-none flex-shrink-0 ${
                    app.badge === 'official'
                      ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}>
                    {app.badge === 'official' ? 'Official' : 'Community'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 flex-1">{app.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium bg-white/5 text-slate-500 rounded px-1.5 py-0.5 border border-white/10">
                    {app.apiType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Community stats ── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Registered Developers', value: '4,820', icon: Users },
              { label: 'Apps Published', value: '312', icon: Bookmark },
              { label: 'GitHub Stars', value: '2.1k', icon: Star },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-4 p-4 bg-[#161b22] border border-white/10 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={16} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
