import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowLeft, Eye, Database, Key, Server, CheckCircle2 } from 'lucide-react';
import Logo from '../components/common/Logo';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-cream via-white to-gray-50 border-b border-gray-200/60 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Shield size={16} className="text-emerald-700" />
            Data Protection & Privacy
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Effective Date: October 11, 2026 • Last Updated: October 2026
          </p>
        </div>
      </div>

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Introduction */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            1. Our Commitment to Your Privacy
          </h2>
          <p>
            At <strong>CafeVibes</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we take your privacy and the security of your cafe
            data seriously. This Privacy Policy describes how we collect, use, store, and safeguard your personal information
            when you access our restaurant point-of-sale platform, cloud kitchen systems, and online customer storefront.
          </p>
          <p>
            We are committed to transparent data practices, least-privilege system architecture, and rigorous protection
            against unauthorized disclosure.
          </p>
        </div>

        {/* Section 2: Demo Mode Isolation Guarantee */}
        <div className="bg-amber-50/70 border border-amber-300/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <Shield size={20} className="text-amber-700" />
            2. Demo Environments Data Guarantee
          </h2>
          <p className="text-amber-900 text-sm">
            When you explore CafeVibes using our public <strong>Admin Demo</strong> or <strong>Customer Demo</strong>:
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-amber-950/80">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span><strong>Zero Data Collection in Demo Mode:</strong> No personally identifiable information (PII), payment card information, or browser telemetry is harvested or sold.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span><strong>Isolated Synthetic Dataset:</strong> The menu items, table statuses, orders, and financial figures displayed in demo mode are synthetic in-memory fixtures. They do not reference or expose real restaurant records.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span><strong>Local Guest State:</strong> Items added to the demo cart or simulated checkouts exist solely in your temporary browser session and are never saved to our production database.</span>
            </div>
          </div>
        </div>

        {/* Section 3: Information We Collect */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Database size={20} className="text-primary" />
            3. Information We Collect (Registered Users)
          </h2>
          <p>
            For authorized cafe administrators and staff operating production accounts, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li><strong>Account Information:</strong> Name, business email address, role (administrator, cashier, barista), and hashed credentials.</li>
            <li><strong>Restaurant Profile Data:</strong> Cafe name, store address, currency settings, tax rates, and receipt headers.</li>
            <li><strong>Operational & Transaction Data:</strong> POS bills, table assignments, kitchen ticket timestamps, and daily register shift reconciliations.</li>
            <li><strong>Authentication Logs:</strong> IP address, user-agent details, and session timestamps used solely for security auditing and rate limiting.</li>
          </ul>
        </div>

        {/* Section 4: How We Use Information */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Server size={20} className="text-primary" />
            4. How We Use Your Information
          </h2>
          <p>
            We use collected data strictly to deliver and maintain restaurant operations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>To process and synchronize live POS orders with Kitchen Display System (KDS) terminals.</li>
            <li>To generate analytical daily revenue graphs and category sales summaries.</li>
            <li>To enforce access control rules and prevent unauthorized account takeover.</li>
            <li>To comply with statutory accounting and tax receipt obligations.</li>
          </ul>
          <p className="text-xs text-gray-500 font-semibold pt-1">
            We never sell, rent, or monetize your restaurant or customer data to third-party advertisers.
          </p>
        </div>

        {/* Section 5: Security Standards */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key size={20} className="text-primary" />
            5. Security & Encryption Standards
          </h2>
          <p>
            We implement comprehensive technical and organizational safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li><strong>Password Security:</strong> Passwords are hashed using one-way bcrypt with work factor 12 before database storage. Plaintext passwords are never logged or stored.</li>
            <li><strong>Token Authentication:</strong> Sessions utilize cryptographically signed JSON Web Tokens (JWT) transmitted over secure HTTPS channels with HttpOnly, SameSite cookie protection.</li>
            <li><strong>Data in Transit & At Rest:</strong> All communications are encrypted with TLS 1.3. Production MongoDB data is hosted in encrypted Atlas clusters.</li>
            <li><strong>Zero Sensitive Secrets Exposure:</strong> Database connection strings, API tokens, and private keys remain exclusively in server-side environment variables and are never bundled into frontend source maps.</li>
          </ul>
        </div>

        {/* Section 6: Cookies and Sessions */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            6. Cookies and Storage
          </h2>
          <p className="text-sm text-gray-600">
            We use strictly necessary cookies and browser local storage for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Maintaining authenticated staff sessions across page navigation.</li>
            <li>Preserving user interface preferences (table plan zoom, demo mode indicators).</li>
            <li>Maintaining the temporary client-side guest cart during Customer Demo sessions.</li>
          </ul>
        </div>

        {/* Section 7: User Rights */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900">7. Your Data Rights</h2>
          <p className="text-sm text-gray-600">
            Registered restaurant operators have the right to request access to, export, or permanently delete their store data and employee profiles.
            Requests can be submitted directly through store settings or by emailing our privacy team at:
          </p>
          <p className="text-sm font-semibold text-primary">
            privacy@cafevibes.com
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <p>© 2026 CafeVibes Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-primary font-bold">Privacy Policy</Link>
            <Link to="/demo" className="hover:text-primary transition-colors">Demo Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
