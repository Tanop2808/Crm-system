import { User, Mail, Shield, Key } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">Your Profile</h1>
        <p className="text-[14px] text-on-surface-variant">
          Manage your personal information and account security.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="col-span-1">
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant mb-4">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlrSBr9K441pwz5cBLVYEAMBhpzY7GGqp-aLUuV4IdTL9yl2sQqcoE_iWkz_oBdVTbefdIftnBjvv5OWhm0GjhVPA6v8jTTKP8K4mm4co7edP_fTVrbcJ8q85YhphWwFPdXg92skOAjEL2u7Rqib_N7LqnGQnn0aaUZMAzhvNB23fD7te4Y2C9prXpTGqqI-ccXCe4Cbr85LcVYkF_gX3Y7taOCOnWByFdu9NykHTeg1F9WGEjyPGmg4MRtjJvcxq9eGha9QzduMAo"
              />
            </div>
            <h2 className="text-lg font-semibold text-on-surface">Alex Support</h2>
            <p className="text-sm text-on-surface-variant mb-4">Senior Support Agent</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
              <Shield size={12} />
              Admin Access
            </span>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Personal Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant flex items-center gap-1.5">
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="Alex Support" 
                  className="w-full h-10 px-3 border border-outline-variant rounded bg-surface text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant flex items-center gap-1.5">
                  <Mail size={14} /> Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="alex@supportdesk.crm" 
                  readOnly
                  className="w-full h-10 px-3 border border-outline-variant rounded bg-surface-container text-on-surface-variant text-[14px] cursor-not-allowed"
                />
              </div>
              <button className="mt-4 px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded hover:bg-primary transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Security</h3>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-on-surface mb-1 flex items-center gap-1.5">
                  <Key size={14} className="text-on-surface-variant" /> Password
                </p>
                <p className="text-[13px] text-on-surface-variant">Last changed 3 months ago</p>
              </div>
              <button className="px-4 py-2 border border-outline-variant text-on-surface-variant text-xs font-semibold rounded hover:bg-surface-container transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
