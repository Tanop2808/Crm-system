import { Bell, Shield, Palette, Layout, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">Account Settings</h1>
        <p className="text-[14px] text-on-surface-variant">
          Customize your workspace, notifications, and application preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column: Navigation Sidebar */}
        <div className="col-span-1 hidden md:block">
          <nav className="flex flex-col gap-2 sticky top-24">
            <button className="text-left px-4 py-2 text-sm font-semibold rounded-md bg-surface-container text-primary flex items-center gap-2">
              <SettingsIcon size={16} /> General
            </button>
            <button className="text-left px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-container/50 transition-colors flex items-center gap-2">
              <Bell size={16} /> Notifications
            </button>
            <button className="text-left px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-container/50 transition-colors flex items-center gap-2">
              <Palette size={16} /> Appearance
            </button>
            <button className="text-left px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-container/50 transition-colors flex items-center gap-2">
              <Shield size={16} /> Privacy
            </button>
          </nav>
        </div>

        {/* Right Column: Settings Content */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Workspace Settings */}
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
              <Layout size={16} className="text-secondary" />
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Workspace Preferences</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[14px] font-semibold text-on-surface">Language</h4>
                  <p className="text-[13px] text-on-surface-variant">Select the default language for your dashboard interface.</p>
                </div>
                <select className="h-9 px-3 border border-outline-variant rounded bg-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>English (US)</option>
                  <option>Spanish (ES)</option>
                  <option>French (FR)</option>
                </select>
              </div>

              <hr className="border-outline-variant" />

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[14px] font-semibold text-on-surface">Timezone</h4>
                  <p className="text-[13px] text-on-surface-variant">Used for ticket timestamps and reports.</p>
                </div>
                <select className="h-9 px-3 border border-outline-variant rounded bg-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Device Management */}
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
              <Smartphone size={16} className="text-secondary" />
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Active Sessions</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-on-surface">MacBook Pro (macOS)</span>
                  <span className="text-[12px] text-on-surface-variant">Chrome • Last active: Just now (This session)</span>
                </div>
                <span className="text-[11px] font-semibold bg-success-container/20 text-success px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-on-surface">iPhone 13 (iOS)</span>
                  <span className="text-[12px] text-on-surface-variant">Safari • Last active: 2 hours ago</span>
                </div>
                <button className="text-[12px] font-semibold text-error hover:bg-error-container/20 px-3 py-1.5 rounded transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

// Simple internal icon for the sidebar
function SettingsIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
