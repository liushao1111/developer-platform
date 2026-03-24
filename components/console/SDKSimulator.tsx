'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  CheckCircle,
  Bluetooth,
  Wifi,
  Mic,
  MicOff,
  FileText,
} from 'lucide-react';

type Lang = 'swift' | 'kotlin';

interface Stage {
  id: string;
  title: string;
  description: string;
  swift: string;
  kotlin: string;
}

const STAGES: Stage[] = [
  {
    id: 'init',
    title: 'Initialize SDK',
    description: 'Configure the SDK with your client ID',
    swift: `import PlaudSDK

// Call once in AppDelegate
PlaudSDK.configure(
    clientId: "pk_live_abc123…",
    environment: .production
)

print("Plaud SDK ready")`,
    kotlin: `import ai.plaud.sdk.PlaudSDK

// Call once in Application.onCreate()
PlaudSDK.configure(
    context = applicationContext,
    clientId = "pk_live_abc123…",
    environment = PlaudEnvironment.PRODUCTION
)

Log.d("Plaud", "SDK ready")`,
  },
  {
    id: 'scan',
    title: 'Scan Devices',
    description: 'Discover nearby NotePin devices over BLE',
    swift: `let scanner = PlaudSDK.scanner

scanner.onDeviceDiscovered = { device in
    print("Found \\(device.name) · \\(device.rssi) dBm")
}

scanner.startScan()
// Call scanner.stopScan() when done`,
    kotlin: `val scanner = PlaudSDK.scanner

scanner.onDeviceDiscovered = { device ->
    Log.d("Plaud",
        "Found \${device.name} · \${device.rssi} dBm")
}

scanner.startScan()
// Call scanner.stopScan() when done`,
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Pair and connect to a selected device',
    swift: `scanner.connect(to: device) { result in
    switch result {
    case .success(let conn):
        let d = conn.device
        print("\\(d.serialNumber) · \\(d.battery)%")
        // store conn for recorder & file sync
    case .failure(let err):
        print("Connection failed: \\(err)")
    }
}`,
    kotlin: `scanner.connect(device) { result ->
    result.fold(
        onSuccess = { conn ->
            val d = conn.device
            Log.d("Plaud",
                "\${d.serialNumber} · \${d.battery}%")
            // store conn for recorder & file sync
        },
        onFailure = { err ->
            Log.e("Plaud", "Failed: \$err")
        }
    )
}`,
  },
  {
    id: 'record',
    title: 'Record Audio',
    description: 'Start and stop a recording session on the device',
    swift: `let recorder = connection.recorder

recorder.start { error in
    guard error == nil else {
        print("Error: \\(error!)")
        return
    }
    print("Recording started")
}

// Later — stop when the user is done
recorder.stop { file in
    print("Saved: \\(file.id) · \\(file.duration)s")
}`,
    kotlin: `val recorder = connection.recorder

recorder.start { error ->
    if (error != null) {
        Log.e("Plaud", "\$error")
        return@start
    }
    Log.d("Plaud", "Recording started")
}

// Later — stop when the user is done
recorder.stop { file ->
    Log.d("Plaud",
        "Saved: \${file.id} · \${file.duration}s")
}`,
  },
  {
    id: 'transcribe',
    title: 'Sync & Transcribe',
    description: 'Pull recordings off the device and get AI transcripts',
    swift: `PlaudSDK.files.sync(
    from: connection,
    onProgress: { pct in
        print("Syncing \\(Int(pct * 100))%")
    },
    completion: { files in
        files.first?.transcribe(
            language: "en"
        ) { result in
            print(result.text)
            // result.speakers, .segments
        }
    }
)`,
    kotlin: `PlaudSDK.files.sync(
    connection = connection,
    onProgress = { pct ->
        Log.d("Plaud",
            "Syncing \${(pct * 100).toInt()}%")
    },
    onComplete = { files ->
        files.firstOrNull()?.transcribe(
            language = "en"
        ) { result ->
            Log.d("Plaud", result.text)
            // result.speakers, .segments
        }
    }
)`,
  },
];

// ── Phone sub-screens ──────────────────────────────────────────────────────────

function PhoneInit() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
        <Mic size={20} className="text-indigo-400" />
      </div>
      <div className="text-center">
        <div className="text-[11px] font-bold text-white">Plaud SDK</div>
        <div className="text-[9px] text-slate-500 mt-0.5">v2.4.1</div>
      </div>
      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] text-emerald-400 font-medium">SDK Ready</span>
      </div>
    </div>
  );
}

const MOCK_DEVICES = [
  { serial: 'PLN-001A', rssi: -42, battery: 87 },
  { serial: 'PLN-003C', rssi: -61, battery: 12 },
  { serial: 'PLN-007B', rssi: -74, battery: 65 },
];

function PhoneScan({ count }: { count: number }) {
  return (
    <div className="p-2.5 flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-3">
        <Bluetooth size={10} className="text-indigo-400" />
        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wide">
          Scanning…
        </span>
        <div className="ml-auto flex items-end gap-0.5">
          {[6, 10, 14].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-indigo-400 transition-opacity duration-300"
              style={{ height: h, opacity: i < ((count % 3) + 1) ? 1 : 0.2 }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        {count === 0 && (
          <div className="flex items-center justify-center h-16">
            <div className="w-5 h-5 border border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        )}
        {MOCK_DEVICES.slice(0, count).map(d => (
          <div key={d.serial} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Mic size={9} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-medium text-white truncate">
                NotePin {d.serial}
              </div>
              <div className="text-[8px] text-slate-600">{d.rssi} dBm</div>
            </div>
            <div
              className={`text-[8px] font-medium ${d.battery < 20 ? 'text-red-400' : 'text-slate-500'}`}
            >
              {d.battery}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneConnect({ connecting, connected }: { connecting: boolean; connected: boolean }) {
  if (connecting) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Bluetooth size={14} className="text-indigo-400" />
          </div>
        </div>
        <div className="text-[9px] text-slate-400">Connecting to PLN-001A…</div>
      </div>
    );
  }
  if (connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2.5 px-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle size={18} className="text-emerald-400" />
        </div>
        <div className="text-[11px] font-semibold text-white">Connected</div>
        <div className="w-full bg-white/5 rounded-xl p-3 space-y-1.5">
          {[
            { label: 'Device', value: 'NotePin PLN-001A' },
            { label: 'Battery', value: '87%' },
            { label: 'Firmware', value: 'v2.4.1' },
            { label: 'Signal', value: '-42 dBm' },
          ].map(row => (
            <div key={row.label} className="flex justify-between">
              <span className="text-[8px] text-slate-500">{row.label}</span>
              <span className="text-[8px] text-slate-300 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-[9px] text-slate-600">Tap Next to connect</div>
    </div>
  );
}

function PhoneRecord({ recording, time, stopped }: { recording: boolean; time: number; stopped: boolean }) {
  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Deterministic animated waveform using time + index
  const barHeights = Array.from({ length: 18 }, (_, i) => {
    if (!recording) return 3;
    const t = time * 2.5;
    return 3 + Math.abs(Math.sin((i + t) * 0.7)) * 14 + Math.abs(Math.sin(i * 1.3 + t * 0.8)) * 8;
  });

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 pb-5">
      <div className="text-center mt-2">
        <div
          className={`text-[20px] font-mono font-bold tabular-nums ${
            recording ? 'text-white' : stopped ? 'text-emerald-400' : 'text-slate-600'
          }`}
        >
          {fmt(time)}
        </div>
        <div
          className={`text-[8px] mt-0.5 ${
            recording ? 'text-red-400' : stopped ? 'text-emerald-400' : 'text-slate-600'
          }`}
        >
          {recording ? 'Recording…' : stopped ? 'Saved' : 'Ready'}
        </div>
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-0.5 h-8">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-all duration-150 ${
              recording ? 'bg-red-400' : 'bg-slate-700'
            }`}
            style={{ height: h }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            recording
              ? 'bg-red-500/20 border-2 border-red-400/50'
              : stopped
              ? 'bg-emerald-500/20 border-2 border-emerald-400/50'
              : 'bg-white/5 border-2 border-white/20'
          }`}
        >
          {recording ? (
            <MicOff size={20} className="text-red-400" />
          ) : stopped ? (
            <CheckCircle size={20} className="text-emerald-400" />
          ) : (
            <Mic size={20} className="text-slate-500" />
          )}
        </div>
        <div className="text-[8px] text-slate-600">
          {recording ? 'Tap to stop' : stopped ? 'Recording saved' : 'Tap to record'}
        </div>
      </div>
    </div>
  );
}

function PhoneTranscribe({
  progress,
  showTranscript,
}: {
  progress: number;
  showTranscript: boolean;
}) {
  if (!showTranscript) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <Wifi size={14} className="text-indigo-400" />
        </div>
        <div className="text-[9px] text-slate-400">Syncing from device…</div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[8px] text-slate-600">{progress}%</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full p-2.5">
      <div className="flex items-center gap-1.5 mb-2">
        <FileText size={9} className="text-emerald-400" />
        <span className="text-[9px] text-emerald-400 font-medium">Transcript ready</span>
      </div>
      <div className="space-y-1.5">
        {[
          { speaker: 'Alex', text: "Good morning, let's start the weekly sync." },
          { speaker: 'Jamie', text: 'Sounds good. Q1 roadmap first?' },
          { speaker: 'Alex', text: 'Yes — hiring update after.' },
        ].map((line, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-1.5">
            <div className="text-[7px] font-bold text-indigo-300 mb-0.5">{line.speaker}</div>
            <div className="text-[8px] text-slate-400 leading-tight">{line.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SDKSimulator() {
  const [stage, setStage] = useState(0);
  const [lang, setLang] = useState<Lang>('swift');

  // Stage-specific state
  const [scanCount, setScanCount] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordStopped, setRecordStopped] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Reset + kick off stage animation
  useEffect(() => {
    setScanCount(0);
    setConnecting(false);
    setConnected(false);
    setRecording(false);
    setRecordStopped(false);
    setRecordTime(0);
    setSyncProgress(0);
    setShowTranscript(false);

    if (stage === 1) {
      const timers = [0, 1, 2].map(i =>
        window.setTimeout(() => setScanCount(n => n + 1), (i + 1) * 900)
      );
      return () => timers.forEach(clearTimeout);
    }
    if (stage === 2) {
      setConnecting(true);
      const t = window.setTimeout(() => {
        setConnecting(false);
        setConnected(true);
      }, 2200);
      return () => clearTimeout(t);
    }
    if (stage === 3) {
      const t = window.setTimeout(() => setRecording(true), 600);
      return () => clearTimeout(t);
    }
    if (stage === 4) {
      let p = 0;
      const interval = window.setInterval(() => {
        p = Math.min(p + 4, 100);
        setSyncProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          window.setTimeout(() => setShowTranscript(true), 600);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Recording timer
  useEffect(() => {
    if (!recording) return;
    const t = window.setInterval(() => setRecordTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const phoneContent = () => {
    switch (stage) {
      case 0: return <PhoneInit />;
      case 1: return <PhoneScan count={scanCount} />;
      case 2: return <PhoneConnect connecting={connecting} connected={connected} />;
      case 3: return <PhoneRecord recording={recording} time={recordTime} stopped={recordStopped} />;
      case 4: return <PhoneTranscribe progress={syncProgress} showTranscript={showTranscript} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ── Left: steps + code ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-white/10 min-w-0">

        {/* Step progress bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-0.5 overflow-x-auto flex-shrink-0">
          {STAGES.map((s, i) => (
            <div key={s.id} className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => setStage(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  stage === i
                    ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30'
                    : i < stage
                    ? 'text-emerald-400 hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
                }`}
              >
                {i < stage ? (
                  <CheckCircle size={11} />
                ) : (
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] leading-none ${
                      stage === i ? 'border-indigo-500/50' : 'border-slate-700'
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
                {s.title}
              </button>
              {i < STAGES.length - 1 && (
                <div
                  className={`w-4 h-px mx-0.5 flex-shrink-0 ${
                    i < stage ? 'bg-emerald-500/40' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage title + description */}
        <div className="px-6 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-base font-semibold text-white">{STAGES[stage].title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{STAGES[stage].description}</p>
        </div>

        {/* Code block */}
        <div className="px-6 flex-1 overflow-y-auto pb-4">
          <div className="flex gap-1 mb-2.5">
            {(['swift', 'kotlin'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  lang === l
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {l === 'swift' ? 'Swift' : 'Kotlin'}
              </button>
            ))}
          </div>
          <div className="bg-[#161b22] border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              <span className="ml-2 text-[10px] text-slate-600 font-mono">
                {lang === 'swift' ? 'ViewController.swift' : 'MainActivity.kt'}
              </span>
            </div>
            <div className="p-5 overflow-x-auto">
              <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
                {lang === 'swift' ? STAGES[stage].swift : STAGES[stage].kotlin}
              </pre>
            </div>
          </div>

          {/* Stop Recording action (stage 3 only) */}
          {stage === 3 && recording && (
            <button
              onClick={() => { setRecording(false); setRecordStopped(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
            >
              <MicOff size={13} /> Stop Recording
            </button>
          )}
        </div>

        {/* Nav buttons */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setStage(s => Math.max(0, s - 1))}
            disabled={stage === 0}
            className="text-sm text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          {stage < STAGES.length - 1 ? (
            <button
              onClick={() => setStage(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Next: {STAGES[stage + 1].title} <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => setStage(0)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <CheckCircle size={14} /> Restart Tour
            </button>
          )}
        </div>
      </div>

      {/* ── Right: phone preview ─────────────────────────────────────────────── */}
      <div className="w-[340px] flex-shrink-0 flex flex-col items-center justify-center bg-[#0a0c12] gap-6 py-8">
        <div className="text-[10px] text-slate-700 uppercase tracking-widest font-medium">
          Device Preview
        </div>

        {/* Phone shell */}
        <div className="relative w-[190px] h-[390px] rounded-[36px] border-[2.5px] border-white/15 bg-[#08090f] shadow-[0_0_60px_rgba(99,102,241,0.08)] flex flex-col overflow-hidden">
          {/* Status bar */}
          <div className="flex-shrink-0 h-6 flex items-center justify-between px-4">
            <span className="text-[7px] font-mono text-slate-600">9:41</span>
            <div className="w-10 h-2.5 bg-[#08090f] rounded-full border border-white/10" />
            <div className="flex items-center gap-0.5">
              <div className="w-2.5 h-1.5 border border-slate-700 rounded-[1px]" />
              <div className="w-1 h-1 rounded-full bg-emerald-400/60" />
            </div>
          </div>
          {/* Screen content */}
          <div className="flex-1 overflow-hidden">{phoneContent()}</div>
          {/* Home indicator */}
          <div className="flex-shrink-0 h-5 flex items-center justify-center">
            <div className="w-16 h-1 bg-white/15 rounded-full" />
          </div>
        </div>

        {/* Stage label */}
        <div className="text-center px-6">
          <div className="text-xs font-medium text-slate-400">{STAGES[stage].title}</div>
          <div className="text-[11px] text-slate-600 mt-0.5 leading-tight">
            {STAGES[stage].description}
          </div>
        </div>
      </div>
    </div>
  );
}
