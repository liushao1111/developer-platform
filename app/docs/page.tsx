'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic, Terminal, Database, Bot, UserCheck, Building2, Code,
  Zap, Smartphone, Globe, ArrowRight, Check, Copy,
  ChevronRight, FileText, ExternalLink, AlertCircle, Info, List,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string }
interface NavSection { title: string; badge?: string; items: NavItem[] }

// ─── Sidebar nav structure ────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'quickstart', label: 'Quickstart' },
    ],
  },
  {
    title: 'Personal Access',
    badge: 'No sign-in required',
    items: [
      { id: 'personal-intro', label: 'Introduction' },
      { id: 'personal-rest', label: 'REST API' },
      { id: 'personal-mcp', label: 'MCP Server' },
      { id: 'personal-cli', label: 'CLI' },
    ],
  },
  {
    title: 'Embedded SDK',
    items: [
      { id: 'sdk-intro', label: 'Introduction' },
      { id: 'sdk-ios', label: 'iOS Integration' },
      { id: 'sdk-android', label: 'Android Integration' },
    ],
  },
  {
    title: 'OAuth API',
    items: [
      { id: 'oauth-intro', label: 'Introduction' },
      { id: 'oauth-flow', label: 'Authorization Flow' },
      { id: 'oauth-scopes', label: 'Scopes & Permissions' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { id: 'ref-transcripts', label: 'Transcripts' },
      { id: 'ref-files', label: 'Files' },
      { id: 'ref-devices', label: 'Devices' },
      { id: 'ref-notes', label: 'Notes' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ id: 'changelog', label: 'Changelog' }],
  },
];

// ─── Shared UI components ─────────────────────────────────────────────────────

function CodeBlock({ language, code, filename }: { language: string; code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-slate-500" />
          <span className="text-xs text-slate-400 font-mono">{filename || language}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-[#0d1117] text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning' | 'success'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  };
  const icons = { info: Info, warning: AlertCircle, success: Check };
  const Icon = icons[type];
  return (
    <div className={`flex gap-3 p-4 rounded-xl border my-4 ${styles[type]}`}>
      <Icon size={16} className="flex-shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-700 text-slate-300',
    green: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
}

function Method({ method }: { method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-400',
    POST: 'bg-emerald-500/20 text-emerald-400',
    PUT: 'bg-amber-500/20 text-amber-400',
    DELETE: 'bg-red-500/20 text-red-400',
    PATCH: 'bg-purple-500/20 text-purple-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${colors[method]}`}>
      {method}
    </span>
  );
}

function ParamRow({ name, type, def, desc }: { name: string; type: string; def: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-2.5 border-b border-white/5 last:border-0">
      <code className="text-xs font-mono text-indigo-400 w-24 flex-shrink-0">{name}</code>
      <code className="text-xs font-mono text-slate-500 w-16 flex-shrink-0">{type}</code>
      <code className="text-xs font-mono text-slate-500 w-12 flex-shrink-0">{def}</code>
      <span className="text-xs text-slate-400">{desc}</span>
    </div>
  );
}

// ─── Section content ──────────────────────────────────────────────────────────

function SectionOverview({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Plaud Developer Platform</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-8">
        Build voice-first applications on top of Plaud NotePin — professional audio hardware with AI-powered transcription, notes, and more.
      </p>

      <h2 className="text-xl font-semibold text-white mb-4">Choose your integration path</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          {
            title: 'Personal Access', badge: 'No sign-in required', badgeColor: 'green',
            desc: 'Access your own Plaud recordings using your existing consumer account. Ideal for personal automation, scripts, and AI tools.',
            links: [{ label: 'REST API', id: 'personal-rest' }, { label: 'MCP Server', id: 'personal-mcp' }, { label: 'CLI', id: 'personal-cli' }],
          },
          {
            title: 'Embedded SDK', badge: 'Developer account', badgeColor: 'blue',
            desc: 'Embed Plaud hardware capabilities into your iOS or Android app. Full control over recording and device management.',
            links: [{ label: 'iOS', id: 'sdk-ios' }, { label: 'Android', id: 'sdk-android' }],
          },
          {
            title: 'OAuth API', badge: 'Developer account', badgeColor: 'blue',
            desc: 'Build apps that access Plaud data on behalf of your users via OAuth 2.0. For SaaS products and third-party integrations.',
            links: [{ label: 'Authorization Flow', id: 'oauth-flow' }, { label: 'Scopes', id: 'oauth-scopes' }],
          },
        ].map(card => (
          <div key={card.title} className="bg-[#161b22] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between mb-3 gap-2">
              <h3 className="text-white font-semibold">{card.title}</h3>
              <Badge color={card.badgeColor}>{card.badge}</Badge>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{card.desc}</p>
            <div className="space-y-1">
              {card.links.map(link => (
                <button key={link.id} onClick={() => onNav(link.id)} className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ChevronRight size={12} />{link.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-3">Base URL</h2>
      <CodeBlock language="bash" code="https://api.plaud.ai/v1" />

      <h2 className="text-xl font-semibold text-white mb-4 mt-8">Authentication overview</h2>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#161b22]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Method</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Header</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Used with</th>
            </tr>
          </thead>
          <tbody>
            {[
              { method: 'Personal Key', header: 'Authorization: Bearer pk_...', used: 'Personal Access (REST API)' },
              { method: 'OAuth Token', header: 'Authorization: Bearer oa_...', used: 'OAuth API' },
              { method: 'SDK Credentials', header: 'X-Client-ID + X-Client-Secret', used: 'Embedded SDK' },
            ].map(row => (
              <tr key={row.method} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 text-white font-medium">{row.method}</td>
                <td className="px-4 py-3 font-mono text-slate-300 text-xs">{row.header}</td>
                <td className="px-4 py-3 text-slate-400">{row.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4 mt-8">Rate limits</h2>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#161b22]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Plan</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Requests / month</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Burst</th>
            </tr>
          </thead>
          <tbody>
            {[
              { plan: 'Free', rpm: '500', burst: '10 req/s' },
              { plan: 'Pro', rpm: '50,000', burst: '100 req/s' },
              { plan: 'Enterprise', rpm: 'Unlimited', burst: 'Custom' },
            ].map(row => (
              <tr key={row.plan} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 text-white font-medium">{row.plan}</td>
                <td className="px-4 py-3 text-slate-300">{row.rpm}</td>
                <td className="px-4 py-3 text-slate-400">{row.burst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionQuickstart() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Quickstart</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">Get up and running in under 5 minutes.</p>
      <Callout type="info">
        <strong>No developer account needed for Personal Access.</strong> If you just want to query your own recordings, follow Option A.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Option A — Personal Access (fastest)</h2>
      <CodeBlock language="bash" filename="terminal" code={`# 1. Install the Plaud CLI
npm install -g @plaud/cli

# 2. Log in with your Plaud consumer account
plaud login

# 3. Generate a personal key
plaud keys create --name "my-script"

# 4. Make your first API call
curl https://api.plaud.ai/v1/transcripts \\
  -H "Authorization: Bearer pk_your_key_here"`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-8">Option B — OAuth API (user-facing apps)</h2>
      <p className="text-slate-400 text-sm mb-3">Register a developer account, create an OAuth app, and exchange credentials for tokens:</p>
      <CodeBlock language="bash" filename="terminal" code={`# Exchange an auth code for an access token
curl -X POST https://api.plaud.ai/oauth/token \\
  -d grant_type=authorization_code \\
  -d code=AUTH_CODE \\
  -d client_id=plaud_client_xxx \\
  -d client_secret=sk_live_xxx \\
  -d redirect_uri=https://yourapp.com/callback`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-8">Option C — Embedded SDK (mobile apps)</h2>
      <CodeBlock language="swift" filename="Package.swift" code={`.package(url: "https://github.com/plaud/plaud-ios-sdk", from: "2.0.0")

// Or via CocoaPods
pod 'PlaudSDK', '~> 2.0'`} />
    </div>
  );
}

function SectionPersonalIntro() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Personal Access</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-4">
        Personal Access lets you query your own Plaud recordings without registering a developer account. Use your existing Plaud consumer account.
      </p>
      <Callout type="success">
        <strong>No developer platform sign-in required.</strong> Just your regular Plaud account.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-4 mt-6">When to use Personal Access</h2>
      <ul className="space-y-2.5 text-slate-400 text-sm">
        {[
          'Building personal automation scripts (shell, Python, Node.js)',
          'Integrating your own recordings into AI tools via MCP (Claude, Cursor, Windsurf)',
          'Creating personal dashboards or data exports',
          'Running CLI commands to batch-process recordings',
          'Prototyping before registering a developer app',
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />{item}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-white mb-4 mt-8">Three access methods</h2>
      <div className="space-y-3">
        {[
          { icon: Database, title: 'REST API', desc: 'Direct HTTP calls from any language using a personal key.' },
          { icon: Bot, title: 'MCP Server', desc: 'Use Plaud as a tool in Claude, Cursor, Windsurf, and other MCP-compatible AI assistants.' },
          { icon: Terminal, title: 'CLI', desc: 'Terminal commands for scripts, shell automation, and quick queries.' },
        ].map(item => (
          <div key={item.title} className="flex items-start gap-4 p-4 bg-[#161b22] border border-white/10 rounded-xl">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon size={16} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionPersonalRest() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">REST API</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">
        Make direct HTTP calls to the Plaud API using a personal access key tied to your consumer account.
      </p>

      <h2 className="text-xl font-semibold text-white mb-3">Get your personal key</h2>
      <CodeBlock language="bash" filename="terminal" code={`plaud login
plaud keys create --name "my-project"
# → pk_live_AbCdEfGhIjKlMnOpQrStUvWxYz`} />
      <Callout type="warning">
        Personal keys start with <code className="bg-white/10 px-1 rounded text-xs font-mono">pk_</code>. Keep them secret — they grant full read access to your recordings.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Authentication</h2>
      <CodeBlock language="bash" code={`curl https://api.plaud.ai/v1/transcripts \\
  -H "Authorization: Bearer pk_live_your_key_here" \\
  -H "Content-Type: application/json"`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Available endpoints</h2>
      <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 mb-6 space-y-0">
        {[
          { method: 'GET' as const, path: '/v1/transcripts', desc: 'List all transcripts' },
          { method: 'GET' as const, path: '/v1/transcripts/{id}', desc: 'Get a specific transcript' },
          { method: 'GET' as const, path: '/v1/files', desc: 'List all recording files' },
          { method: 'GET' as const, path: '/v1/files/{id}', desc: 'Get a specific file' },
          { method: 'GET' as const, path: '/v1/devices', desc: 'List connected Plaud devices' },
          { method: 'GET' as const, path: '/v1/notes', desc: 'List AI-generated notes' },
        ].map((e, i, arr) => (
          <div key={e.path} className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
            <Method method={e.method} />
            <code className="text-sm text-slate-200 font-mono flex-1">{e.path}</code>
            <span className="text-sm text-slate-400">{e.desc}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-3">Example: List transcripts</h2>
      <CodeBlock language="bash" filename="terminal" code={`curl "https://api.plaud.ai/v1/transcripts?limit=5&order=desc" \\
  -H "Authorization: Bearer pk_live_your_key"`} />
      <CodeBlock language="json" filename="response.json" code={`{
  "data": [
    {
      "id": "tr_abc123",
      "title": "Q3 Sales Review",
      "text": "Good morning everyone, let's get started...",
      "duration": 3742,
      "language": "en",
      "created_at": "2026-03-11T09:30:00Z",
      "file_id": "f_xyz789"
    }
  ],
  "has_more": true,
  "next_cursor": "cur_abc"
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Example in Python</h2>
      <CodeBlock language="python" filename="example.py" code={`import requests

PLAUD_KEY = "pk_live_your_key_here"
BASE = "https://api.plaud.ai/v1"

resp = requests.get(
    f"{BASE}/transcripts",
    headers={"Authorization": f"Bearer {PLAUD_KEY}"},
    params={"limit": 10}
)
transcripts = resp.json()["data"]

for t in transcripts:
    print(f"{t['title']} ({t['duration']}s)")`} />
    </div>
  );
}

function SectionPersonalMcp() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">MCP Server</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-4">
        The Plaud MCP Server exposes your recordings as tools to any MCP-compatible AI assistant — Claude, Cursor, Windsurf, and more.
      </p>
      <Callout type="success">
        No developer account needed. Uses your personal Plaud key.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Install</h2>
      <CodeBlock language="bash" filename="terminal" code="npm install -g @plaud/mcp-server" />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Configure with Claude Desktop</h2>
      <p className="text-slate-400 text-sm mb-2">
        Add to <code className="bg-white/10 px-1 rounded text-xs font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>:
      </p>
      <CodeBlock language="json" filename="claude_desktop_config.json" code={`{
  "mcpServers": {
    "plaud": {
      "command": "plaud-mcp",
      "env": {
        "PLAUD_KEY": "pk_live_your_key_here"
      }
    }
  }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Configure with Cursor</h2>
      <CodeBlock language="json" filename=".cursor/mcp.json" code={`{
  "servers": {
    "plaud": {
      "command": "plaud-mcp",
      "env": {
        "PLAUD_KEY": "pk_live_your_key_here"
      }
    }
  }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Available MCP tools</h2>
      <div className="space-y-0 bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
        {[
          { name: 'plaud_list_transcripts', desc: 'List recent transcripts with optional date filter and search query.' },
          { name: 'plaud_get_transcript', desc: 'Fetch the full text of a specific transcript by ID.' },
          { name: 'plaud_search_transcripts', desc: 'Semantic search across all transcripts.' },
          { name: 'plaud_list_files', desc: 'List recording files with metadata.' },
          { name: 'plaud_get_notes', desc: 'Retrieve AI-generated notes and action items for a recording.' },
        ].map((tool, i, arr) => (
          <div key={tool.name} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
            <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded flex-shrink-0">{tool.name}</code>
            <span className="text-sm text-slate-400">{tool.desc}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Example prompts</h2>
      <div className="space-y-2">
        {[
          'Summarize my recordings from last week',
          'What action items came out of my meeting with the sales team?',
          'Find all transcripts that mention "budget"',
          'Create a report from my 3 most recent recordings',
        ].map(prompt => (
          <div key={prompt} className="flex items-center gap-2 p-3 bg-[#161b22] border border-white/10 rounded-xl text-sm text-slate-300">
            <Bot size={14} className="text-indigo-400 flex-shrink-0" />
            &ldquo;{prompt}&rdquo;
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionPersonalCli() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">CLI</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-4">
        The Plaud CLI gives you terminal access to your recordings — perfect for shell scripts, automation, and quick queries.
      </p>
      <Callout type="success">No developer account needed. Log in with your Plaud consumer account.</Callout>

      <h2 className="text-xl font-semibold text-white mb-3 mt-4">Install</h2>
      <CodeBlock language="bash" filename="terminal" code={`# npm
npm install -g @plaud/cli

# Homebrew
brew install plaud/tap/plaud

# Verify
plaud --version  # → plaud/2.1.0`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Authentication</h2>
      <CodeBlock language="bash" filename="terminal" code={`plaud login
# Opens browser → authenticate with your Plaud account
# Stores credentials in ~/.config/plaud/credentials`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Commands</h2>
      {[
        {
          group: 'Transcripts',
          cmds: [
            { cmd: 'plaud transcripts list', desc: 'List recent transcripts' },
            { cmd: 'plaud transcripts get <id>', desc: 'Get transcript text' },
            { cmd: 'plaud transcripts search <q>', desc: 'Search across transcripts' },
            { cmd: 'plaud transcripts export --format json', desc: 'Export as JSON / CSV' },
          ],
        },
        {
          group: 'Files',
          cmds: [
            { cmd: 'plaud files list', desc: 'List recording files' },
            { cmd: 'plaud files download <id>', desc: 'Download an audio file' },
          ],
        },
        {
          group: 'Keys',
          cmds: [
            { cmd: 'plaud keys list', desc: 'List personal keys' },
            { cmd: 'plaud keys create --name <n>', desc: 'Create a new personal key' },
            { cmd: 'plaud keys revoke <id>', desc: 'Revoke a personal key' },
          ],
        },
      ].map(group => (
        <div key={group.group} className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">{group.group}</h3>
          <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
            {group.cmds.map((c, i) => (
              <div key={c.cmd} className={`flex items-center gap-4 px-4 py-2.5 ${i < group.cmds.length - 1 ? 'border-b border-white/5' : ''}`}>
                <code className="text-xs font-mono text-slate-200 w-60 flex-shrink-0">{c.cmd}</code>
                <span className="text-xs text-slate-500">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Example: Weekly digest script</h2>
      <CodeBlock language="bash" filename="weekly_digest.sh" code={`#!/bin/bash
START=$(date -v-7d +%Y-%m-%d)
END=$(date +%Y-%m-%d)

echo "=== Plaud Weekly Digest ($START → $END) ==="

plaud transcripts list \\
  --from $START \\
  --to $END \\
  --format json | jq -r '.data[] | "\\(.created_at[:10]) — \\(.title)"'`} />
    </div>
  );
}

function SectionSdkIntro() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Embedded SDK</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-4">
        The Plaud Embedded SDK lets you integrate Plaud NotePin hardware directly into your iOS or Android app — controlling recording, syncing audio, and managing devices programmatically.
      </p>
      <Callout type="info">
        The SDK requires a developer account. <Link href="/signup" className="text-indigo-400 underline">Create one free</Link>.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-4 mt-6">Use cases</h2>
      <ul className="space-y-2.5 text-slate-400 text-sm mb-8">
        {[
          'Medical scribe apps — capture patient notes with automatic SOAP structuring',
          'Sales coaching tools — real-time audio analysis overlaid on conversations',
          'Field operations — manage fleets of Plaud devices across teams',
          'Enterprise note-taking — custom in-app recording UI with Plaud hardware',
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />{item}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-white mb-4">SDK capabilities</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          { title: 'Device Discovery', desc: 'Scan for and connect to nearby Plaud devices via Bluetooth' },
          { title: 'Recording Control', desc: 'Start, stop, and pause recordings programmatically' },
          { title: 'Audio Sync', desc: 'Stream or batch-sync audio from device to your app' },
          { title: 'Transcription', desc: 'Trigger on-device or cloud transcription' },
          { title: 'Device Management', desc: 'Monitor battery, firmware, and connectivity status' },
          { title: 'Event Hooks', desc: 'Subscribe to recording events and status changes' },
        ].map(cap => (
          <div key={cap.title} className="p-4 bg-[#161b22] border border-white/10 rounded-xl">
            <h3 className="text-white font-medium text-sm mb-1">{cap.title}</h3>
            <p className="text-xs text-slate-400">{cap.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSdkIos() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">iOS Integration</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">
        Integrate the Plaud SDK into your iOS app using Swift Package Manager or CocoaPods.
      </p>

      <h2 className="text-xl font-semibold text-white mb-3">Requirements</h2>
      <ul className="text-sm text-slate-400 space-y-1 mb-6">
        <li>• iOS 15.0+</li><li>• Xcode 14+</li><li>• Swift 5.7+</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mb-3">Installation</h2>
      <CodeBlock language="swift" filename="Package.swift" code={`.package(url: "https://github.com/plaud/plaud-ios-sdk", from: "2.0.0")`} />
      <p className="text-xs text-slate-500 -mt-2 mb-1">Or via CocoaPods:</p>
      <CodeBlock language="ruby" filename="Podfile" code={`pod 'PlaudSDK', '~> 2.0'`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Initialize the SDK</h2>
      <CodeBlock language="swift" filename="MyApp.swift" code={`import PlaudSDK

@main
struct MyApp: App {
    init() {
        PlaudSDK.initialize(
            clientId: "plaud_client_your_id",
            clientSecret: "sk_live_your_secret"
        )
    }
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Connect a device and record</h2>
      <CodeBlock language="swift" filename="RecordingViewModel.swift" code={`import PlaudSDK

class RecordingViewModel: ObservableObject {
    @Published var devices: [PlaudDevice] = []

    func scanForDevices() {
        PlaudSDK.shared.startScan { [weak self] device in
            self?.devices.append(device)
        }
    }

    func startRecording(on device: PlaudDevice) async throws {
        try await device.startRecording()
    }

    func stopAndTranscribe(_ device: PlaudDevice) async throws -> Transcript {
        let recording = try await device.stopRecording()
        return try await recording.transcribe()
    }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Required permissions</h2>
      <p className="text-sm text-slate-400 mb-2">Add to your <code className="bg-white/10 px-1 rounded text-xs font-mono">Info.plist</code>:</p>
      <CodeBlock language="xml" filename="Info.plist" code={`<key>NSBluetoothAlwaysUsageDescription</key>
<string>Required to connect to Plaud NotePin</string>
<key>NSMicrophoneUsageDescription</key>
<string>Required for audio recording</string>`} />
    </div>
  );
}

function SectionSdkAndroid() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Android Integration</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">
        Integrate the Plaud SDK into your Android app using Gradle.
      </p>

      <h2 className="text-xl font-semibold text-white mb-3">Requirements</h2>
      <ul className="text-sm text-slate-400 space-y-1 mb-6">
        <li>• Android 8.0 (API 26)+</li><li>• Kotlin 1.8+</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mb-3">Installation</h2>
      <CodeBlock language="groovy" filename="build.gradle" code={`dependencies {
    implementation 'ai.plaud:sdk-android:2.0.0'
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Initialize</h2>
      <CodeBlock language="kotlin" filename="Application.kt" code={`class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        PlaudSDK.init(
            context = this,
            clientId = "plaud_client_your_id",
            clientSecret = "sk_live_your_secret"
        )
    }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Scan and record</h2>
      <CodeBlock language="kotlin" filename="RecordingActivity.kt" code={`class RecordingActivity : AppCompatActivity() {
    private val sdk = PlaudSDK.shared

    override fun onResume() {
        super.onResume()
        sdk.startScan { device ->
            runOnUiThread { onDeviceFound(device) }
        }
    }

    private fun onDeviceFound(device: PlaudDevice) {
        lifecycleScope.launch {
            device.connect()
            device.startRecording()
            // ... later
            val transcript = device.stopAndTranscribe()
            showTranscript(transcript.text)
        }
    }
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Required permissions</h2>
      <CodeBlock language="xml" filename="AndroidManifest.xml" code={`<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />`} />
    </div>
  );
}

function SectionOauthIntro() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">OAuth API</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-4">
        The OAuth API lets you access Plaud data on behalf of your users. Use this when building SaaS products, third-party integrations, or any app where users grant your app access to their Plaud account.
      </p>
      <Callout type="info">
        OAuth apps require a developer account. <Link href="/signup" className="text-indigo-400 underline">Create one free</Link>.
      </Callout>

      <h2 className="text-xl font-semibold text-white mb-4 mt-6">When to use OAuth</h2>
      <ul className="space-y-2.5 text-slate-400 text-sm mb-8">
        {[
          "Your app accesses data belonging to other Plaud users (not your own)",
          "You're building a SaaS product that integrates with Plaud",
          "You need to push data to CRMs or note apps on a user's behalf",
          "You want to display Plaud data inside your own product",
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />{item}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-white mb-4">OAuth 2.0 flow overview</h2>
      <div className="space-y-3">
        {[
          { step: '1', title: 'Register your app', desc: 'Create an OAuth app in the Console and get your client_id and client_secret.' },
          { step: '2', title: 'Redirect user to Plaud', desc: 'Redirect the user to the Plaud authorization URL with your client_id and requested scopes.' },
          { step: '3', title: 'User grants access', desc: 'The user logs into Plaud and approves access for your app.' },
          { step: '4', title: 'Exchange code for token', desc: 'Plaud redirects back to your redirect_uri with an auth code. Exchange it for an access token.' },
          { step: '5', title: 'Make API calls', desc: 'Use the access token to make authenticated API calls on behalf of the user.' },
        ].map(s => (
          <div key={s.step} className="flex gap-4 p-4 bg-[#161b22] border border-white/10 rounded-xl">
            <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400">{s.step}</div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionOauthFlow() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Authorization Flow</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">
        Step-by-step guide to implementing OAuth 2.0 with Plaud.
      </p>

      <h2 className="text-xl font-semibold text-white mb-3">Step 1 — Redirect to authorization</h2>
      <CodeBlock language="bash" code={`GET https://api.plaud.ai/oauth/authorize
  ?client_id=plaud_client_your_id
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=transcripts:read+files:read+notes:read
  &state=random_csrf_token`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Step 2 — Handle callback</h2>
      <p className="text-slate-400 text-sm mb-2">
        Plaud redirects to your <code className="bg-white/10 px-1 rounded text-xs font-mono">redirect_uri</code>:
      </p>
      <CodeBlock language="bash" code={`GET https://yourapp.com/callback
  ?code=AUTH_CODE_HERE
  &state=random_csrf_token`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Step 3 — Exchange code for token</h2>
      <CodeBlock language="bash" filename="terminal" code={`curl -X POST https://api.plaud.ai/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "code=AUTH_CODE_HERE" \\
  -d "client_id=plaud_client_your_id" \\
  -d "client_secret=sk_live_your_secret" \\
  -d "redirect_uri=https://yourapp.com/callback"`} />
      <CodeBlock language="json" filename="response.json" code={`{
  "access_token": "oa_live_AbCdEfGhIjKlMnOpQrSt",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt_live_UvWxYzAbCdEfGhIjKl",
  "scope": "transcripts:read files:read notes:read"
}`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Step 4 — Make API calls</h2>
      <CodeBlock language="bash" filename="terminal" code={`curl https://api.plaud.ai/v1/transcripts \\
  -H "Authorization: Bearer oa_live_AbCdEfGhIjKlMnOpQrSt"`} />

      <h2 className="text-xl font-semibold text-white mb-3 mt-6">Refresh tokens</h2>
      <CodeBlock language="bash" filename="terminal" code={`curl -X POST https://api.plaud.ai/oauth/token \\
  -d "grant_type=refresh_token" \\
  -d "refresh_token=rt_live_your_refresh_token" \\
  -d "client_id=plaud_client_your_id" \\
  -d "client_secret=sk_live_your_secret"`} />
    </div>
  );
}

function SectionOauthScopes() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Scopes & Permissions</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">
        Scopes define what data your app can access on behalf of users. Request only the scopes your app needs.
      </p>

      <h2 className="text-xl font-semibold text-white mb-4">Available scopes</h2>
      <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-6">
        {[
          { scope: 'files:read', desc: "Read access to the user's recording files", risk: 'low' },
          { scope: 'files:write', desc: 'Upload and delete recording files', risk: 'medium' },
          { scope: 'transcripts:read', desc: 'Read access to transcripts', risk: 'low' },
          { scope: 'transcripts:write', desc: 'Create and edit transcripts', risk: 'medium' },
          { scope: 'notes:read', desc: 'Read AI-generated notes and action items', risk: 'low' },
          { scope: 'notes:write', desc: 'Create and edit notes', risk: 'medium' },
          { scope: 'devices:read', desc: 'Read device list and status', risk: 'low' },
          { scope: 'devices:write', desc: 'Control device settings and firmware updates', risk: 'high' },
          { scope: 'account:read', desc: 'Read basic account info (name, email)', risk: 'low' },
        ].map((s, i, arr) => (
          <div key={s.scope} className={`flex items-center gap-4 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
            <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded w-36 flex-shrink-0">{s.scope}</code>
            <span className="text-sm text-slate-400 flex-1">{s.desc}</span>
            <Badge color={s.risk === 'low' ? 'green' : s.risk === 'medium' ? 'amber' : 'red'}>{s.risk}</Badge>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Best practices</h2>
      <ul className="space-y-2.5 text-slate-400 text-sm">
        {[
          "Request the minimum scopes your app needs",
          "Use read-only scopes when you don't need to write data",
          "Be transparent with users about what data you're accessing",
          "Never store raw access tokens in client-side code",
        ].map(tip => (
          <li key={tip} className="flex items-start gap-2">
            <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />{tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionRefTranscripts() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">API Reference — Transcripts</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-8">
        Endpoints for accessing and managing transcripts.
      </p>

      {/* GET /v1/transcripts */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/transcripts</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">List transcripts for the authenticated user.</p>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Query parameters</h3>
        <div className="bg-[#161b22] border border-white/10 rounded-xl mb-4">
          <ParamRow name="limit" type="integer" def="20" desc="Number of results (max 100)" />
          <ParamRow name="cursor" type="string" def="—" desc="Pagination cursor from previous response" />
          <ParamRow name="order" type="string" def="desc" desc='"asc" or "desc" by created_at' />
          <ParamRow name="from" type="string" def="—" desc="ISO 8601 date filter start" />
          <ParamRow name="to" type="string" def="—" desc="ISO 8601 date filter end" />
          <ParamRow name="q" type="string" def="—" desc="Full-text search query" />
        </div>
        <CodeBlock language="json" filename="200 OK" code={`{
  "data": [
    {
      "id": "tr_abc123",
      "title": "Q3 Sales Review",
      "text": "Good morning everyone...",
      "duration": 3742,
      "language": "en",
      "speaker_count": 4,
      "created_at": "2026-03-11T09:30:00Z",
      "file_id": "f_xyz789"
    }
  ],
  "has_more": true,
  "next_cursor": "cur_def456"
}`} />
      </div>

      {/* GET /v1/transcripts/{id} */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/transcripts/{'{id}'}</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">Retrieve a specific transcript including speaker segments.</p>
        <CodeBlock language="json" filename="200 OK" code={`{
  "id": "tr_abc123",
  "title": "Q3 Sales Review",
  "text": "Good morning everyone, let's review the numbers...",
  "segments": [
    { "speaker": "Speaker 1", "start": 0, "end": 12.4, "text": "Good morning everyone" },
    { "speaker": "Speaker 2", "start": 13.1, "end": 24.8, "text": "Thanks for joining" }
  ],
  "duration": 3742,
  "language": "en",
  "speaker_count": 4,
  "file_id": "f_xyz789",
  "created_at": "2026-03-11T09:30:00Z"
}`} />
      </div>
    </div>
  );
}

function SectionRefFiles() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">API Reference — Files</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-8">Endpoints for accessing and uploading recording files.</p>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/files</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">List recording files.</p>
        <CodeBlock language="json" filename="200 OK" code={`{
  "data": [
    {
      "id": "f_xyz789",
      "filename": "meeting-2026-03-11.m4a",
      "size": 48291032,
      "duration": 3742,
      "format": "m4a",
      "device_serial": "PLN-2024-001A",
      "created_at": "2026-03-11T09:30:00Z",
      "transcript_id": "tr_abc123"
    }
  ]
}`} />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="POST" />
          <code className="text-slate-200 font-mono text-sm">/v1/files/upload</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">Upload an audio file for transcription.</p>
        <CodeBlock language="bash" filename="terminal" code={`curl -X POST https://api.plaud.ai/v1/files/upload \\
  -H "Authorization: Bearer pk_live_your_key" \\
  -F "file=@recording.m4a" \\
  -F "language=en" \\
  -F "transcribe=true"`} />
        <CodeBlock language="json" filename="201 Created" code={`{
  "id": "f_newfile123",
  "filename": "recording.m4a",
  "status": "processing",
  "transcript_id": null
}`} />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="DELETE" />
          <code className="text-slate-200 font-mono text-sm">/v1/files/{'{id}'}</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">Delete a recording file.</p>
        <CodeBlock language="json" filename="200 OK" code={`{ "deleted": true, "id": "f_xyz789" }`} />
      </div>
    </div>
  );
}

function SectionRefDevices() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">API Reference — Devices</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-8">Endpoints for managing connected Plaud NotePin devices.</p>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/devices</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">List all devices associated with the account.</p>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Query parameters</h3>
        <div className="bg-[#161b22] border border-white/10 rounded-xl mb-4">
          <ParamRow name="status" type="string" def="—" desc='"active" | "low_battery" | "offline"' />
          <ParamRow name="tag" type="string" def="—" desc="Filter by device tag" />
        </div>
        <CodeBlock language="json" filename="200 OK" code={`{
  "data": [
    {
      "serial": "PLN-2024-001A",
      "model": "Plaud NotePin",
      "status": "active",
      "battery": 87,
      "firmware": "v2.4.1",
      "last_seen": "2026-03-11T09:43:00Z",
      "tags": ["field", "team-a"]
    }
  ]
}`} />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/devices/{'{serial}'}</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">Get details for a specific device.</p>
      </div>
    </div>
  );
}

function SectionRefNotes() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">API Reference — Notes</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-8">
        Endpoints for AI-generated notes, summaries, and action items.
      </p>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="POST" />
          <code className="text-slate-200 font-mono text-sm">/v1/notes/generate</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">Generate AI notes from a transcript.</p>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Request body</h3>
        <div className="bg-[#161b22] border border-white/10 rounded-xl mb-4">
          <ParamRow name="transcript_id" type="string" def="required" desc="ID of the transcript to process" />
          <ParamRow name="template" type="string" def="meeting" desc='"meeting" | "soap" | "interview" | "custom"' />
          <ParamRow name="include_action_items" type="boolean" def="true" desc="Extract action items from the transcript" />
        </div>
        <CodeBlock language="bash" filename="terminal" code={`curl -X POST https://api.plaud.ai/v1/notes/generate \\
  -H "Authorization: Bearer pk_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transcript_id": "tr_abc123",
    "template": "meeting",
    "include_action_items": true
  }'`} />
        <CodeBlock language="json" filename="200 OK" code={`{
  "id": "note_ghi456",
  "transcript_id": "tr_abc123",
  "summary": "The team reviewed Q3 sales performance...",
  "action_items": [
    { "text": "Follow up with ACME Corp by March 20", "assignee": "Alex" },
    { "text": "Update CRM with new pipeline numbers", "assignee": "Jamie" }
  ],
  "key_topics": ["Q3 results", "pipeline review", "ACME Corp"],
  "created_at": "2026-03-11T09:45:00Z"
}`} />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Method method="GET" />
          <code className="text-slate-200 font-mono text-sm">/v1/notes</code>
        </div>
        <p className="text-slate-400 text-sm mb-4">List all generated notes.</p>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Query parameters</h3>
        <div className="bg-[#161b22] border border-white/10 rounded-xl mb-4">
          <ParamRow name="transcript_id" type="string" def="—" desc="Filter by transcript" />
          <ParamRow name="limit" type="integer" def="20" desc="Number of results (max 100)" />
        </div>
      </div>
    </div>
  );
}

function SectionChangelog() {
  const releases = [
    {
      version: 'v2.1.0', date: 'March 2026', tag: 'Latest', tagColor: 'green',
      changes: [
        { type: 'new', text: 'MCP Server — integrate Plaud with Claude, Cursor, and Windsurf' },
        { type: 'new', text: 'Personal Access keys support expiry dates and IP allowlists' },
        { type: 'improved', text: 'Transcript search now supports semantic queries' },
        { type: 'improved', text: 'SDK: reduced BLE connection time by 40%' },
      ],
    },
    {
      version: 'v2.0.0', date: 'January 2026', tag: '', tagColor: '',
      changes: [
        { type: 'breaking', text: 'REST API base path changed from /api/ to /v1/' },
        { type: 'new', text: 'OAuth API — build apps for other Plaud users' },
        { type: 'new', text: 'CLI tool — install via npm or Homebrew' },
        { type: 'new', text: 'Android SDK beta' },
        { type: 'improved', text: 'Notes API supports SOAP, STAR, and custom templates' },
      ],
    },
    {
      version: 'v1.5.0', date: 'October 2025', tag: '', tagColor: '',
      changes: [
        { type: 'new', text: 'Devices API — manage Plaud NotePin fleet' },
        { type: 'new', text: 'Speaker diarization added to transcripts' },
        { type: 'improved', text: 'iOS SDK performance improvements' },
        { type: 'fixed', text: 'Fixed pagination cursor bug in /v1/files' },
      ],
    },
  ];
  const typeColors: Record<string, string> = {
    new: 'text-emerald-400 bg-emerald-500/10',
    improved: 'text-blue-400 bg-blue-500/10',
    fixed: 'text-amber-400 bg-amber-500/10',
    breaking: 'text-red-400 bg-red-500/10',
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Changelog</h1>
      <p className="text-lg text-slate-400 leading-relaxed mb-10">Recent updates to the Plaud Developer Platform.</p>
      <div className="space-y-10">
        {releases.map(release => (
          <div key={release.version} className="relative pl-6 border-l-2 border-white/10">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-[#0d1117] border-2 border-indigo-500 rounded-full" />
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-white">{release.version}</h2>
              {release.tag && <Badge color={release.tagColor as 'green'}>{release.tag}</Badge>}
              <span className="text-sm text-slate-500">{release.date}</span>
            </div>
            <ul className="space-y-2">
              {release.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className={`flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 ${typeColors[c.type]}`}>
                    {c.type}
                  </span>
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SectionContent({ id, onNav }: { id: string; onNav: (id: string) => void }) {
  switch (id) {
    case 'overview': return <SectionOverview onNav={onNav} />;
    case 'quickstart': return <SectionQuickstart />;
    case 'personal-intro': return <SectionPersonalIntro />;
    case 'personal-rest': return <SectionPersonalRest />;
    case 'personal-mcp': return <SectionPersonalMcp />;
    case 'personal-cli': return <SectionPersonalCli />;
    case 'sdk-intro': return <SectionSdkIntro />;
    case 'sdk-ios': return <SectionSdkIos />;
    case 'sdk-android': return <SectionSdkAndroid />;
    case 'oauth-intro': return <SectionOauthIntro />;
    case 'oauth-flow': return <SectionOauthFlow />;
    case 'oauth-scopes': return <SectionOauthScopes />;
    case 'ref-transcripts': return <SectionRefTranscripts />;
    case 'ref-files': return <SectionRefFiles />;
    case 'ref-devices': return <SectionRefDevices />;
    case 'ref-notes': return <SectionRefNotes />;
    case 'changelog': return <SectionChangelog />;
    default: return <SectionOverview onNav={onNav} />;
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeId, setActiveId] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-white/10 h-14">
        <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mic size={14} className="text-white" />
              </div>
              <span className="text-white font-bold">Plaud</span>
              <span className="text-xs text-slate-500 font-medium border border-slate-600 rounded px-1.5 py-0.5">Platform</span>
            </Link>
            <div className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <span className="text-white font-medium">Docs</span>
              <Link href="/#showcase" className="text-slate-400 hover:text-white transition-colors">Showcase</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium hidden md:block">Sign In</Link>
            <Link href="/signup" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 fixed top-14 bottom-0 left-0 overflow-y-auto bg-[#0d1117] border-r border-white/10 py-6 px-4">
          <nav className="space-y-6">
            {navSections.map(section => (
              <div key={section.title}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{section.title}</span>
                  {section.badge && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full leading-none">
                      {section.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNav(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeId === item.id
                            ? 'bg-indigo-500/15 text-indigo-300 font-medium'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-60 min-h-screen">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
            <SectionContent id={activeId} onNav={handleNav} />

            {/* Prev / Next navigation */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
              {(() => {
                const allItems = navSections.flatMap(s => s.items);
                const idx = allItems.findIndex(i => i.id === activeId);
                const prev = idx > 0 ? allItems[idx - 1] : null;
                const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;
                return (
                  <>
                    <div className="flex-1">
                      {prev && (
                        <button onClick={() => handleNav(prev.id)} className="flex flex-col items-start group">
                          <span className="text-xs text-slate-500 mb-1">← Previous</span>
                          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{prev.label}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 flex justify-end">
                      {next && (
                        <button onClick={() => handleNav(next.id)} className="flex flex-col items-end group">
                          <span className="text-xs text-slate-500 mb-1">Next →</span>
                          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{next.label}</span>
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
