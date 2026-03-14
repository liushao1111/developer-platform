'use client';

import { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, Copy, Check } from 'lucide-react';

// ── Endpoint definitions ───────────────────────────────────────────────────────

type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface Param {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  description?: string;
}

interface Endpoint {
  id: string;
  method: Method;
  path: string;
  description: string;
  params: Param[];
  mockResponse: object;
  latencyMs: number;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'list-transcripts',
    method: 'GET',
    path: '/v1/transcripts',
    description: 'List all transcripts for the authenticated user, ordered by creation date.',
    params: [
      { name: 'limit', type: 'number', placeholder: '20', description: 'Max results to return (1–100)' },
      { name: 'offset', type: 'number', placeholder: '0', description: 'Pagination offset' },
      { name: 'status', type: 'select', options: ['', 'completed', 'processing', 'failed'], description: 'Filter by status' },
    ],
    mockResponse: {
      object: 'list',
      data: [
        { id: 'tr_aB3cD4', text: 'Good morning everyone, let\'s start the meeting...', duration: 3842, status: 'completed', created_at: '2026-03-11T09:30:00Z' },
        { id: 'tr_eF5gH6', text: 'The quarterly results show strong growth in...', duration: 2610, status: 'completed', created_at: '2026-03-10T14:15:00Z' },
      ],
      total: 48,
      has_more: true,
    },
    latencyMs: 142,
  },
  {
    id: 'get-transcript',
    method: 'GET',
    path: '/v1/transcripts/{id}',
    description: 'Retrieve a single transcript by its ID.',
    params: [
      { name: 'id', type: 'string', placeholder: 'tr_aB3cD4', required: true, description: 'Transcript ID' },
      { name: 'format', type: 'select', options: ['', 'json', 'srt', 'vtt', 'txt'], description: 'Output format' },
    ],
    mockResponse: {
      id: 'tr_aB3cD4',
      object: 'transcript',
      text: 'Good morning everyone, let\'s start the weekly sync. First agenda item...',
      duration: 3842,
      language: 'en',
      status: 'completed',
      speakers: [
        { id: 'sp_1', name: 'Speaker 1', words: 512 },
        { id: 'sp_2', name: 'Speaker 2', words: 347 },
      ],
      created_at: '2026-03-11T09:30:00Z',
    },
    latencyMs: 67,
  },
  {
    id: 'list-files',
    method: 'GET',
    path: '/v1/files',
    description: 'List audio files uploaded to the platform.',
    params: [
      { name: 'limit', type: 'number', placeholder: '20', description: 'Max results to return' },
      { name: 'purpose', type: 'select', options: ['', 'transcription', 'upload'], description: 'Filter by purpose' },
    ],
    mockResponse: {
      object: 'list',
      data: [
        { id: 'file_xY7zA8', filename: 'meeting-2026-03-11.m4a', size: 18432000, purpose: 'transcription', status: 'processed', created_at: '2026-03-11T09:25:00Z' },
        { id: 'file_bC9dE0', filename: 'interview-session.mp3', size: 9216000, purpose: 'transcription', status: 'processed', created_at: '2026-03-10T13:00:00Z' },
      ],
      total: 12,
      has_more: false,
    },
    latencyMs: 88,
  },
  {
    id: 'upload-file',
    method: 'POST',
    path: '/v1/files/upload',
    description: 'Upload an audio file for transcription. Supports m4a, mp3, wav, and mp4.',
    params: [
      { name: 'file', type: 'string', placeholder: 'audio.m4a', required: true, description: 'File name (simulated upload)' },
      { name: 'purpose', type: 'select', options: ['transcription', 'upload'], required: true, description: 'Upload purpose' },
    ],
    mockResponse: {
      id: 'file_nEw1f2',
      object: 'file',
      filename: 'audio.m4a',
      size: 5242880,
      purpose: 'transcription',
      status: 'uploaded',
      created_at: new Date().toISOString(),
    },
    latencyMs: 891,
  },
  {
    id: 'list-devices',
    method: 'GET',
    path: '/v1/devices',
    description: 'List Plaud NotePin devices linked to the authenticated account.',
    params: [
      { name: 'status', type: 'select', options: ['', 'active', 'low_battery', 'offline'], description: 'Filter by device status' },
    ],
    mockResponse: {
      object: 'list',
      data: [
        { serial: 'PLN-2024-001A', model: 'Plaud NotePin', battery: 87, firmware: 'v2.4.1', status: 'active', last_seen: '2 min ago' },
        { serial: 'PLN-2024-003C', model: 'Plaud NotePin', battery: 12, firmware: 'v2.4.0', status: 'low_battery', last_seen: '8 min ago' },
      ],
      total: 5,
    },
    latencyMs: 55,
  },
  {
    id: 'generate-note',
    method: 'POST',
    path: '/v1/notes/generate',
    description: 'Generate structured AI notes from an existing transcript.',
    params: [
      { name: 'transcript_id', type: 'string', placeholder: 'tr_aB3cD4', required: true, description: 'Source transcript ID' },
      { name: 'style', type: 'select', options: ['meeting_summary', 'action_items', 'bullet_points', 'narrative'], description: 'Note generation style' },
      { name: 'language', type: 'string', placeholder: 'en', description: 'Output language (ISO 639-1)' },
    ],
    mockResponse: {
      id: 'note_gH3iJ4',
      object: 'note',
      transcript_id: 'tr_aB3cD4',
      style: 'meeting_summary',
      content: '## Meeting Summary\n\n**Date:** March 11, 2026\n\n### Key Topics\n- Q1 roadmap review\n- Engineering hiring update\n- Product launch timeline\n\n### Action Items\n- [ ] Alex to finalize API docs by EOW\n- [ ] Jamie to schedule design review\n\n### Decisions\n- Launch date moved to April 15',
      created_at: new Date().toISOString(),
    },
    latencyMs: 1240,
  },
  {
    id: 'delete-file',
    method: 'DELETE',
    path: '/v1/files/{id}',
    description: 'Permanently delete a file. This action cannot be undone.',
    params: [
      { name: 'id', type: 'string', placeholder: 'file_xY7zA8', required: true, description: 'File ID to delete' },
    ],
    mockResponse: {
      id: 'file_xY7zA8',
      object: 'file',
      deleted: true,
    },
    latencyMs: 34,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<Method, string> = {
  GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
  PATCH: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const CODE_LANGS = ['cURL', 'JavaScript', 'Python'] as const;
type CodeLang = (typeof CODE_LANGS)[number];

function buildCurl(endpoint: Endpoint, params: Record<string, string>) {
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PATCH';
  let path = endpoint.path;
  const bodyParams: Record<string, string> = {};
  const queryParams: Record<string, string> = {};

  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    if (path.includes(`{${k}}`)) {
      path = path.replace(`{${k}}`, v);
    } else if (hasBody) {
      bodyParams[k] = v;
    } else {
      queryParams[k] = v;
    }
  }

  const qs = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `https://api.plaud.ai${path}${qs ? `?${qs}` : ''}`;

  const lines = [`curl -X ${endpoint.method} \\`, `  "${url}" \\`, `  -H "Authorization: Bearer $PLAUD_API_KEY" \\`, `  -H "Content-Type: application/json"`];
  if (hasBody && Object.keys(bodyParams).length > 0) {
    lines.push(`  -d '${JSON.stringify(bodyParams, null, 2)}'`);
  }
  return lines.join('\n');
}

function buildJs(endpoint: Endpoint, params: Record<string, string>) {
  let path = endpoint.path;
  const bodyParams: Record<string, string> = {};
  const queryParams: Record<string, string> = {};
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PATCH';

  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    if (path.includes(`{${k}}`)) {
      path = path.replace(`{${k}}`, v);
    } else if (hasBody) {
      bodyParams[k] = v;
    } else {
      queryParams[k] = v;
    }
  }

  const qs = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `https://api.plaud.ai${path}${qs ? `?${qs}` : ''}`;

  return `const response = await fetch("${url}", {
  method: "${endpoint.method}",
  headers: {
    "Authorization": \`Bearer \${process.env.PLAUD_API_KEY}\`,
    "Content-Type": "application/json",
  },${hasBody && Object.keys(bodyParams).length > 0 ? `\n  body: JSON.stringify(${JSON.stringify(bodyParams, null, 4)}),` : ''}
});

const data = await response.json();
console.log(data);`;
}

function buildPython(endpoint: Endpoint, params: Record<string, string>) {
  let path = endpoint.path;
  const bodyParams: Record<string, string> = {};
  const queryParams: Record<string, string> = {};
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PATCH';

  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    if (path.includes(`{${k}}`)) {
      path = path.replace(`{${k}}`, v);
    } else if (hasBody) {
      bodyParams[k] = v;
    } else {
      queryParams[k] = v;
    }
  }

  const url = `https://api.plaud.ai${path}`;
  const qsStr = Object.keys(queryParams).length > 0 ? `\nparams = ${JSON.stringify(queryParams, null, 4)}` : '';
  const bodyStr = hasBody && Object.keys(bodyParams).length > 0 ? `\ndata = ${JSON.stringify(bodyParams, null, 4)}` : '';

  return `import os, requests

url = "${url}"
headers = {
    "Authorization": f"Bearer {os.environ['PLAUD_API_KEY']}",
    "Content-Type": "application/json",
}${qsStr}${bodyStr}

response = requests.${endpoint.method.toLowerCase()}(
    url,
    headers=headers,${Object.keys(queryParams).length > 0 ? '\n    params=params,' : ''}${hasBody && Object.keys(bodyParams).length > 0 ? '\n    json=data,' : ''}
)
print(response.json())`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SyntaxJson({ json }: { json: string }) {
  const lines = json.split('\n');
  return (
    <pre className="text-sm leading-relaxed font-mono">
      {lines.map((line, i) => {
        const colored = line
          .replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-indigo-400">"$1"</span>')
          .replace(/:\s*"([^"]*)"/g, ': <span class="text-emerald-400">"$1"</span>')
          .replace(/:\s*(true|false|null)/g, ': <span class="text-amber-400">$1</span>')
          .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-sky-400">$1</span>');
        return <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />;
      })}
    </pre>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handle} className="p-1.5 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [selectedId, setSelectedId] = useState(ENDPOINTS[0].id);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<{ data: object; latency: number; status: number } | null>(null);
  const [codeLang, setCodeLang] = useState<CodeLang>('cURL');
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({ Transcripts: true, Files: true, Devices: true, Notes: true });

  const endpoint = ENDPOINTS.find(e => e.id === selectedId)!;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setParamValues({});
    setResponse(null);
  };

  const handleRun = () => {
    const missing = endpoint.params.filter(p => p.required && !paramValues[p.name]);
    if (missing.length > 0) return;

    setIsRunning(true);
    setResponse(null);
    setTimeout(() => {
      const isError = endpoint.method === 'DELETE' && Math.random() > 0.85;
      setResponse({
        data: isError ? { error: { code: 'not_found', message: 'The requested resource does not exist.' } } : endpoint.mockResponse,
        latency: endpoint.latencyMs + Math.round(Math.random() * 40 - 20),
        status: isError ? 404 : endpoint.method === 'POST' ? 201 : 200,
      });
      setIsRunning(false);
    }, endpoint.latencyMs + 300);
  };

  const groups: Record<string, Endpoint[]> = {
    Transcripts: ENDPOINTS.filter(e => e.path.includes('transcript')),
    Files: ENDPOINTS.filter(e => e.path.includes('file')),
    Devices: ENDPOINTS.filter(e => e.path.includes('device')),
    Notes: ENDPOINTS.filter(e => e.path.includes('note')),
  };

  const codeSnippet =
    codeLang === 'cURL' ? buildCurl(endpoint, paramValues) :
    codeLang === 'JavaScript' ? buildJs(endpoint, paramValues) :
    buildPython(endpoint, paramValues);

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Top bar */}
      <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-white">API Playground</h1>
          <p className="text-sm text-slate-500 mt-0.5">Explore and test Plaud API endpoints with live mock responses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Base URL</span>
          <code className="text-xs font-mono bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-400">
            api.plaud.ai/v1
          </code>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — endpoint list */}
        <div className="w-60 border-r border-white/10 flex-shrink-0 overflow-y-auto py-3">
          {Object.entries(groups).map(([group, eps]) => (
            <div key={group} className="mb-1">
              <button
                onClick={() => setGroupOpen(g => ({ ...g, [group]: !g[group] }))}
                className="w-full flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
              >
                {groupOpen[group] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {group}
              </button>
              {groupOpen[group] && eps.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => handleSelect(ep.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left ${
                    selectedId === ep.id
                      ? 'bg-indigo-500/10 text-white border-r-2 border-indigo-500'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`text-[10px] font-bold w-12 text-center border rounded px-1 py-0.5 leading-none flex-shrink-0 ${METHOD_COLORS[ep.method]}`}>
                    {ep.method}
                  </span>
                  <span className="truncate font-mono text-xs">{ep.path.split('/').pop()}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request pane */}
          <div className="flex-1 overflow-y-auto px-6 py-5 border-r border-white/10">
            {/* Endpoint header */}
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-xs font-bold border rounded px-2 py-1 ${METHOD_COLORS[endpoint.method]}`}>
                {endpoint.method}
              </span>
              <code className="text-white font-mono text-sm">{endpoint.path}</code>
            </div>
            <p className="text-sm text-slate-400 mb-5">{endpoint.description}</p>

            {/* Parameters */}
            {endpoint.params.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Parameters</h3>
                <div className="space-y-3">
                  {endpoint.params.map(p => (
                    <div key={p.name}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        {p.name}
                        {p.required && <span className="text-red-400 ml-1">*</span>}
                        {p.description && <span className="text-slate-600 font-normal ml-2">{p.description}</span>}
                      </label>
                      {p.type === 'select' ? (
                        <select
                          value={paramValues[p.name] || ''}
                          onChange={e => setParamValues(v => ({ ...v, [p.name]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50"
                        >
                          {p.options!.map(opt => (
                            <option key={opt} value={opt} className="bg-[#161b22]">
                              {opt || '— select —'}
                            </option>
                          ))}
                        </select>
                      ) : p.type === 'textarea' ? (
                        <textarea
                          value={paramValues[p.name] || ''}
                          onChange={e => setParamValues(v => ({ ...v, [p.name]: e.target.value }))}
                          placeholder={p.placeholder}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 resize-none"
                        />
                      ) : (
                        <input
                          type={p.type === 'number' ? 'number' : 'text'}
                          value={paramValues[p.name] || ''}
                          onChange={e => setParamValues(v => ({ ...v, [p.name]: e.target.value }))}
                          placeholder={p.placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono placeholder-slate-700 focus:outline-none focus:border-indigo-500/50"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  Send Request
                </>
              )}
            </button>

            {/* Code snippet */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</h3>
                <div className="flex gap-1">
                  {CODE_LANGS.map(l => (
                    <button
                      key={l}
                      onClick={() => setCodeLang(l)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        codeLang === l
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 group">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={codeSnippet} />
                </div>
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">{codeSnippet}</pre>
              </div>
            </div>
          </div>

          {/* Response pane */}
          <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Response</h3>
              {response && (
                <div className="flex items-center gap-3 text-xs">
                  <span className={`flex items-center gap-1 font-medium ${response.status < 300 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {response.status < 300 ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {response.status}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock size={11} />
                    {response.latency}ms
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!response && !isRunning && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Play size={16} className="text-slate-600 ml-0.5" />
                  </div>
                  <p className="text-sm text-slate-600">Send a request to see the response</p>
                </div>
              )}
              {isRunning && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-500">Waiting for response…</p>
                </div>
              )}
              {response && !isRunning && (
                <div className="relative group">
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={JSON.stringify(response.data, null, 2)} />
                  </div>
                  <SyntaxJson json={JSON.stringify(response.data, null, 2)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
