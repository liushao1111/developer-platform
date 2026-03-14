export type AppType = 'oauth' | 'sdk';
export type AppStatus = 'active' | 'sandbox' | 'in_review' | 'suspended';
export type DeviceStatus = 'active' | 'low_battery' | 'offline';

export interface OAuthApp {
  id: string;
  type: 'oauth';
  name: string;
  description: string;
  status: AppStatus;
  clientId: string;
  clientSecret: string;
  homepageUrl: string;
  redirectUris: string[];
  scopes: string[];
  contactEmail: string;
  privacyPolicyUrl: string;
  logoUrl: string;
  createdAt: string;
  lastActive: string;
  authorizedUsers: number;
  apiCallsToday: number;
  apiCallsTotal: number;
  errorRate: number;
  lastCall: string;
}

export interface SDKApp {
  id: string;
  type: 'sdk';
  name: string;
  description: string;
  status: AppStatus;
  clientId: string;
  clientSecret: string;
  platform: 'ios' | 'android' | 'both';
  bundleId: string;
  useCase: string;
  mode: 'sandbox' | 'production';
  createdAt: string;
  lastActive: string;
  activeDevices: number;
  lowBatteryDevices: number;
  offlineDevices: number;
  apiCallsToday: number;
  apiCallsTotal: number;
  errorRate: number;
}

export type Application = OAuthApp | SDKApp;

export interface Device {
  serial: string;
  model: string;
  status: DeviceStatus;
  battery: number;
  firmware: string;
  lastSeen: string;
  tags: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  statusCode: number;
  latency: number;
  requestId: string;
}

export interface AuthorizedUser {
  userId: string;
  authorizedDate: string;
  scopes: string[];
  lastActive: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
}

export const mockUser = {
  id: 'usr_a1b2c3d4',
  name: 'Alex Johnson',
  email: 'alex@acmecorp.com',
  avatarInitials: 'AJ',
};

export const mockApplications: Application[] = [
  {
    id: 'app_meet01',
    type: 'oauth',
    name: 'MeetingBot',
    description: 'Automatically captures meeting audio and generates transcripts with action items.',
    status: 'active',
    clientId: 'plaud_client_meet01_abc123def456',
    clientSecret: 'mock_secret_meet01_xxxxxxxxxxxxxxxxxxxx',
    homepageUrl: 'https://meetingbot.io',
    redirectUris: ['https://meetingbot.io/callback', 'https://meetingbot.io/auth/redirect'],
    scopes: ['files:read', 'transcripts:read', 'notes:read'],
    contactEmail: 'dev@meetingbot.io',
    privacyPolicyUrl: 'https://meetingbot.io/privacy',
    logoUrl: '',
    createdAt: '2025-01-15T10:30:00Z',
    lastActive: '2026-03-11T09:45:00Z',
    authorizedUsers: 247,
    apiCallsToday: 1204,
    apiCallsTotal: 48320,
    errorRate: 0.2,
    lastCall: '2 min ago',
  },
  {
    id: 'app_rec01',
    type: 'sdk',
    name: 'RecorderApp iOS',
    description: 'Native iOS application for professional audio recording with AI transcription.',
    status: 'sandbox',
    clientId: 'plaud_client_rec01_xyz789ghi012',
    clientSecret: 'mock_secret_rec01_xxxxxxxxxxxxxxxxxxxx',
    platform: 'ios',
    bundleId: 'com.acme.recorderapp',
    useCase: 'Professional audio recording for field journalists and researchers requiring high-quality transcription.',
    mode: 'sandbox',
    createdAt: '2025-02-20T14:00:00Z',
    lastActive: '2026-03-10T16:22:00Z',
    activeDevices: 23,
    lowBatteryDevices: 3,
    offlineDevices: 2,
    apiCallsToday: 891,
    apiCallsTotal: 12450,
    errorRate: 0.5,
  },
  {
    id: 'app_reca01',
    type: 'sdk',
    name: 'RecorderApp Android',
    description: 'Android companion app for Plaud NotePin devices.',
    status: 'in_review',
    clientId: 'plaud_client_reca01_jkl345mno678',
    clientSecret: 'mock_secret_reca01_xxxxxxxxxxxxxxxxxxxx',
    platform: 'android',
    bundleId: 'com.acme.recorderapp.android',
    useCase: 'Android companion for Plaud NotePin with offline recording support.',
    mode: 'sandbox',
    createdAt: '2025-03-05T09:15:00Z',
    lastActive: '2026-03-09T11:00:00Z',
    activeDevices: 0,
    lowBatteryDevices: 0,
    offlineDevices: 0,
    apiCallsToday: 0,
    apiCallsTotal: 0,
    errorRate: 0,
  },
];

export const mockDevices: Device[] = [
  { serial: 'PLN-2024-001A', model: 'Plaud NotePin', status: 'active', battery: 87, firmware: 'v2.4.1', lastSeen: '2 min ago', tags: ['field', 'team-a'] },
  { serial: 'PLN-2024-002B', model: 'Plaud NotePin', status: 'active', battery: 92, firmware: 'v2.4.1', lastSeen: '5 min ago', tags: ['office'] },
  { serial: 'PLN-2024-003C', model: 'Plaud NotePin', status: 'low_battery', battery: 12, firmware: 'v2.4.0', lastSeen: '8 min ago', tags: ['field', 'team-b'] },
  { serial: 'PLN-2024-004D', model: 'Plaud NotePin', status: 'low_battery', battery: 8, firmware: 'v2.4.1', lastSeen: '15 min ago', tags: ['team-a'] },
  { serial: 'PLN-2024-005E', model: 'Plaud NotePin', status: 'offline', battery: 0, firmware: 'v2.3.9', lastSeen: '2 hours ago', tags: ['office'] },
];

export const mockLogs: LogEntry[] = [
  { id: 'log_001', timestamp: '2026-03-11T09:43:21Z', endpoint: 'GET /v1/transcripts', statusCode: 200, latency: 142, requestId: 'req_aB3cD4eF5g' },
  { id: 'log_002', timestamp: '2026-03-11T09:41:05Z', endpoint: 'POST /v1/files/upload', statusCode: 200, latency: 891, requestId: 'req_hI6jK7lM8n' },
  { id: 'log_003', timestamp: '2026-03-11T09:38:44Z', endpoint: 'GET /v1/transcripts/tr_abc', statusCode: 200, latency: 67, requestId: 'req_oP9qR0sT1u' },
  { id: 'log_004', timestamp: '2026-03-11T09:35:12Z', endpoint: 'POST /v1/notes/generate', statusCode: 429, latency: 12, requestId: 'req_vW2xY3zA4b' },
  { id: 'log_005', timestamp: '2026-03-11T09:31:58Z', endpoint: 'GET /v1/devices', statusCode: 200, latency: 55, requestId: 'req_cD5eF6gH7i' },
  { id: 'log_006', timestamp: '2026-03-11T09:28:30Z', endpoint: 'GET /v1/files', statusCode: 200, latency: 88, requestId: 'req_jK8lM9nO0p' },
  { id: 'log_007', timestamp: '2026-03-11T09:25:17Z', endpoint: 'DELETE /v1/files/f_xyz', statusCode: 404, latency: 34, requestId: 'req_qR1sT2uV3w' },
  { id: 'log_008', timestamp: '2026-03-11T09:20:44Z', endpoint: 'GET /v1/transcripts', statusCode: 200, latency: 122, requestId: 'req_xY4zA5bC6d' },
];

export const mockAuthorizedUsers: AuthorizedUser[] = [
  { userId: '0x4a3b2c1d...8e7f', authorizedDate: '2026-01-12', scopes: ['files:read', 'transcripts:read'], lastActive: '2 hours ago' },
  { userId: '0x9b8c7d6e...5f4a', authorizedDate: '2026-01-28', scopes: ['transcripts:read', 'notes:read'], lastActive: '1 day ago' },
  { userId: '0x3c2d1e0f...4a3b', authorizedDate: '2026-02-03', scopes: ['files:read', 'transcripts:read', 'notes:read'], lastActive: '3 days ago' },
  { userId: '0x7d6e5f4a...2c1b', authorizedDate: '2026-02-15', scopes: ['transcripts:read'], lastActive: '1 week ago' },
  { userId: '0x1e0f9a8b...6d5c', authorizedDate: '2026-02-22', scopes: ['files:read'], lastActive: '2 weeks ago' },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv_mar2026', date: 'Mar 1, 2026', amount: 49.00, status: 'paid' },
  { id: 'inv_feb2026', date: 'Feb 1, 2026', amount: 49.00, status: 'paid' },
  { id: 'inv_jan2026', date: 'Jan 1, 2026', amount: 42.30, status: 'paid' },
];

export const showcaseApps = [
  {
    id: 'sc_1',
    title: 'Meeting Minutes Bot',
    description: 'Auto-post Plaud summaries to Notion after each recording. Uses your own Plaud account — no app registration needed.',
    tags: ['Official'],
    apiType: 'Personal Access',
    category: 'personal',
    badge: 'official',
  },
  {
    id: 'sc_2',
    title: 'Weekly Report Generator',
    description: 'CLI script that pulls this week\'s recordings, runs AI summarization, and emails a digest every Friday.',
    tags: ['Community'],
    apiType: 'Personal Access',
    category: 'personal',
    badge: 'community',
  },
  {
    id: 'sc_3',
    title: 'Sales Coach App',
    description: 'Mobile app showing real-time coaching overlaid on Plaud recording — built with the Embedded SDK.',
    tags: ['Official'],
    apiType: 'SDK',
    category: 'sdk',
    badge: 'official',
  },
  {
    id: 'sc_4',
    title: 'Medical Scribe',
    description: 'Structured SOAP note generation from recorder audio. iOS app with full Plaud hardware control via SDK.',
    tags: ['Community'],
    apiType: 'SDK',
    category: 'sdk',
    badge: 'community',
  },
  {
    id: 'sc_5',
    title: 'CRM Auto-Logger',
    description: 'Push Plaud meeting summaries into HubSpot or Salesforce on behalf of your users via OAuth.',
    tags: ['Official'],
    apiType: 'OAuth API',
    category: 'oauth',
    badge: 'official',
  },
  {
    id: 'sc_6',
    title: 'Research Transcriber',
    description: 'Academic tool for qualitative researchers — bulk transcript export with speaker diarization via OAuth.',
    tags: ['Community'],
    apiType: 'OAuth API',
    category: 'oauth',
    badge: 'community',
  },
];

export const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    description: 'For hobbyists and explorers',
    features: [
      '500 API calls/month',
      '60 min audio processing',
      '1 OAuth app',
      '0 SDK devices',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For startups and teams',
    features: [
      '50,000 API calls/month',
      '2,000 min audio processing',
      '5 OAuth apps',
      '50 SDK devices',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For scale and compliance',
    features: [
      'Unlimited API calls',
      'Unlimited audio processing',
      'Unlimited OAuth apps',
      'Unlimited SDK devices',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];
