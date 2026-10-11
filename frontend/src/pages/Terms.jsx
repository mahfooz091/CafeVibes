import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, ArrowLeft, CheckCircle2, Lock, Scale, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';

const Terms = () => {
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Scale size={16} />
            Legal Agreement
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Effective Date: October 11, 2026 • Last Updated: October 2026
          </p>
        </div>
      </div>

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Summary Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            1. Agreement Overview
          </h2>
          <p>
            Welcome to <strong>CafeVibes</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of the CafeVibes restaurant point-of-sale (POS), kitchen display system (KDS),
            inventory and table plan management platform, customer ordering interface, and related APIs (collectively, the &quot;Service&quot;).
          </p>
          <p>
            By accessing or using CafeVibes, creating an account, or exploring our live demonstration environments, you agree
            to be bound by these Terms and our Privacy Policy. If you do not agree, you must not access or use the Service.
          </p>
        </div>

        {/* Section 2: Services Provided */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-primary" />
            2. Cafe Management Platform Services
          </h2>
          <p>
            CafeVibes delivers an integrated cloud software suite designed specifically for cafes and restaurants:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li><strong>Point of Sale (POS):</strong> Fast billing, digital orders, payment capture, and shift cash register tracking.</li>
            <li><strong>Kitchen Display System (KDS):</strong> Real-time ticket queueing, cook time monitoring, and live status dispatch.</li>
            <li><strong>Floor & Table Management:</strong> Visual interactive floor plans, dining section layouts, and live occupancy status.</li>
            <li><strong>Analytics & Financial Reports:</strong> Daily revenue, item category volume, payment reconciliation, and hourly throughput metrics.</li>
            <li><strong>Customer Digital Storefront:</strong> Online menu browsing, item customizers, and order dispatch workflows.</li>
          </ul>
        </div>

        {/* Section 3: Demo Environments & Safe Exploration */}
        <div className="bg-amber-50/70 border border-amber-300/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <Shield size={20} className="text-amber-700" />
            3. Demonstration Environments & Simulation Rules
          </h2>
          <p className="text-amber-900 text-sm">
            CafeVibes provides dedicated public demonstration experiences (<strong>Admin Demo</strong> and <strong>Customer Demo</strong>):
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-amber-950/80">
            <div className="flex items-start gap-2.5">
              <Lock size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <span><strong>Strict Read-Only Enforcement:</strong> Demo access is restricted to read-only simulation. All database mutation attempts (creation, updates, deletion) are permanently rejected by our server architecture with HTTP 403 Forbidden.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Lock size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <span><strong>Synthetic In-Memory Data:</strong> All demo metrics, customers, orders, menu items, and sales reports utilize fictional synthetic data. No real customer information or production records are queried or modified.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Lock size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <span><strong>No Real Financial Transactions:</strong> Simulated checkout, digital payments, and cash transactions in demo mode are non-financial simulations. No bank accounts or payment gateways are charged.</span>
            </div>
          </div>
        </div>

        {/* Section 4: Accounts and Security */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            4. Accounts, Authentication & Security
          </h2>
          <p>
            Authorized administrators and staff members are responsible for maintaining the confidentiality of their credentials.
            You agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>Provide accurate and up-to-date business information.</li>
            <li>Maintain strong, unique passwords conforming to our NIST-recommended security standards (minimum 8 characters).</li>
            <li>Promptly notify CafeVibes of any unauthorized account access or security anomalies.</li>
            <li>Accept full responsibility for all activities conducted under your credentials.</li>
          </ul>
        </div>

        {/* Section 5: Acceptable Use */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={20} className="text-primary" />
            5. Acceptable Use Policy
          </h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>Violate applicable local, national, or international consumer, food service, or financial regulations.</li>
            <li>Attempt to probe, scan, or exploit any vulnerability in our serverless functions, database, or network architecture.</li>
            <li>Execute automated scraping, denial of service (DoS), or unauthorized reverse engineering of the application bundles.</li>
            <li>Interfere with or bypass rate limiters, demo isolation controls, or security middleware.</li>
          </ul>
        </div>

        {/* Section 6: Limitation of Liability */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Scale size={20} className="text-primary" />
            6. Disclaimers and Limitation of Liability
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            In no event shall CafeVibes, its developers, or affiliates be liable for indirect, incidental, special, consequential,
            or punitive damages, including loss of profits, restaurant operational downtime, or data loss, resulting from
            your use or inability to use the Service.
          </p>
        </div>

        {/* Section 7: Contact */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900">7. Contact Information</h2>
          <p className="text-sm text-gray-600">
            If you have questions regarding these Terms or enterprise restaurant deployments, please contact our legal team at:
          </p>
          <p className="text-sm font-semibold text-primary">
            support@cafevibes.com
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <p>© 2026 CafeVibes Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-primary font-bold">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/demo" className="hover:text-primary transition-colors">Demo Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
