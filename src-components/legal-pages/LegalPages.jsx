/**
 * ShambaNi Legal Pages & Cookie Consent
 * Compliant with Uganda Data Protection and Privacy Act 2019
 * Components: PrivacyPolicy, TermsOfService, CookieConsentBanner
 * 
 * File: src/components/LegalPages/LegalPages.jsx
 * GitHub: shambani-market/shambani-market.africa
 */

import React, { useState, useEffect } from 'react';
import './LegalPages.css';

// ============================================
// COOKIE CONSENT BANNER
// ============================================
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('shambani_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('shambani_cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('shambani_cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <div className="cookie-text">
          <strong>🍪 We value your privacy</strong>
          <p>
            ShambaNi uses cookies to enhance your experience, analyze site traffic, 
            and support our marketplace operations. By continuing, you agree to our{' '}
            <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.
            This notice complies with Uganda's Data Protection and Privacy Act 2019.
          </p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn essential" onClick={acceptEssential}>
            Essential Only
          </button>
          <button className="cookie-btn accept" onClick={acceptAll}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRIVACY POLICY PAGE
// ============================================
export function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-effective">Effective Date: July 5, 2026 | Last Updated: July 5, 2026</p>
        
        <div className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            ShambaNi (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates shambani-market.africa, 
            a digital marketplace connecting farmers and buyers across East Africa. 
            This Privacy Policy explains how we collect, use, store, and protect your personal data 
            in compliance with the <strong>Uganda Data Protection and Privacy Act 2019</strong> (DPPA 2019), 
            the <strong>EU General Data Protection Regulation (GDPR)</strong> where applicable, 
            and other relevant data protection frameworks.
          </p>
          <p>
            By using our platform, you consent to the collection and use of your personal data 
            as described in this policy. If you do not agree with this policy, please do not use our services.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Data Controller Information</h2>
          <p>
            <strong>Data Controller:</strong> ShambaNi Marketplace Ltd<br/>
            <strong>Registered Address:</strong> Mpigi, Uganda<br/>
            <strong>Contact Email:</strong> privacy@shambani-market.africa<br/>
            <strong>Data Protection Officer (DPO):</strong> Reagan Lutwama<br/>
            <strong>DPO Contact:</strong> dpo@shambani-market.africa
          </p>
          <p>
            Under Section 4 of the DPPA 2019, we are registered as a data controller 
            with the National Information Technology Authority-Uganda (NITA-U) and the 
            Uganda Communications Commission (UCC).
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Information We Collect</h2>
          <h3>3.1 Farmer Registration Data</h3>
          <ul>
            <li><strong>Identity Data:</strong> Full name, National ID (NIRA) number, date of birth, gender</li>
            <li><strong>Contact Data:</strong> Phone number, email address, physical address, district</li>
            <li><strong>Visual Data:</strong> Profile photograph, NIRA ID document photograph</li>
            <li><strong>Farm Data:</strong> Farm location, farm size, crops/livestock produced, production capacity</li>
            <li><strong>Financial Data:</strong> Mobile money account details (MTN/Airtel), bank account information (optional)</li>
            <li><strong>Transaction Data:</strong> Sales history, product listings, pricing information, buyer reviews</li>
          </ul>
          
          <h3>3.2 Buyer Registration Data</h3>
          <ul>
            <li><strong>Identity Data:</strong> Contact person name, organization name (for institutional buyers)</li>
            <li><strong>Contact Data:</strong> Phone number, email address, physical address, district</li>
            <li><strong>Organizational Data:</strong> Registration number, tax ID, organization type (school/hospital/restaurant/hotel/company)</li>
            <li><strong>Procurement Data:</strong> Volume requirements, product preferences, delivery preferences</li>
            <li><strong>Transaction Data:</strong> Purchase history, order details, payment records</li>
          </ul>

          <h3>3.3 Automatically Collected Data</h3>
          <ul>
            <li><strong>Device Data:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, search queries</li>
            <li><strong>Location Data:</strong> General geographic location (derived from IP, with consent for precise location)</li>
            <li><strong>Cookie Data:</strong> See our Cookie Policy below</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. How We Use Your Data</h2>
          <p>We process your personal data for the following lawful purposes under Section 5 of the DPPA 2019:</p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Legal Basis (DPPA 2019)</th>
                <th>Data Categories</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>User registration and account management</td>
                <td>Consent (Section 5(a))</td>
                <td>Identity, Contact</td>
              </tr>
              <tr>
                <td>Farmer identity verification (NIRA ID check)</td>
                <td>Legal obligation (Section 5(d))</td>
                <td>Identity, Visual</td>
              </tr>
              <tr>
                <td>Marketplace transactions and payments</td>
                <td>Performance of contract (Section 5(b))</td>
                <td>Contact, Financial, Transaction</td>
              </tr>
              <tr>
                <td>Fraud prevention and platform security</td>
                <td>Legitimate interest (Section 5(f))</td>
                <td>Identity, Device, Usage</td>
              </tr>
              <tr>
                <td>Government reporting (MAAIF/PDM data sharing)</td>
                <td>Public interest (Section 5(e))</td>
                <td>Farm, Transaction (aggregated/anonymized)</td>
              </tr>
              <tr>
                <td>Platform analytics and improvement</td>
                <td>Legitimate interest (Section 5(f))</td>
                <td>Usage, Device (anonymized)</td>
              </tr>
              <tr>
                <td>Customer support and communication</td>
                <td>Consent (Section 5(a))</td>
                <td>Contact, Identity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="legal-section">
          <h2>5. Two-Tier Data Architecture</h2>
          <p>ShambaNi implements a two-tier data protection system to maximize trust while protecting privacy:</p>
          
          <h3>Tier 1: Public Profile Data (Buyer-Facing)</h3>
          <p>Visible to all marketplace users:</p>
          <ul>
            <li>Profile photograph (farmer only)</li>
            <li>Verified badge status</li>
            <li>Farmer/buyer name and district</li>
            <li>Sales/purchase history and ratings</li>
            <li>Active product listings and prices</li>
          </ul>

          <h3>Tier 2: Secure Admin Storage (ID Verification)</h3>
          <p>Stored encrypted, accessible only to authorized ShambaNi administrators:</p>
          <ul>
            <li>National ID number and ID document photograph</li>
            <li>Mobile money registration name</li>
            <li>Exact farm GPS coordinates (where provided)</li>
            <li>Bank account details (if provided)</li>
            <li>Verification timestamp and auditor identity</li>
          </ul>
          <p><strong>Critical:</strong> NIRA ID documents and ID numbers are NEVER displayed to buyers or other farmers. 
          They are used solely for verification and compliance purposes.</p>
        </div>

        <div className="legal-section">
          <h2>6. Data Sharing and Third Parties</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul>
            <li><strong>Government Partners (MAAIF, PDM Secretariat):</strong> Aggregated, anonymized farmer registry data for national agricultural planning, with your explicit consent during registration.</li>
            <li><strong>Payment Processors (MTN Mobile Money, Airtel Money, PayPal):</strong> Necessary transaction data to process payments.</li>
            <li><strong>Telecom Partners (for USSD *220#):</strong> Phone numbers only, for USSD service delivery.</li>
            <li><strong>Logistics Partners (when requested):</strong> Delivery address and contact details, only with your explicit consent per delivery.</li>
            <li><strong>Legal Authorities:</strong> When required by court order or applicable law.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>7. Data Security Measures</h2>
          <p>In compliance with Part IV of the DPPA 2019, we implement the following security measures:</p>
          <ul>
            <li><strong>Encryption:</strong> All data transmitted via HTTPS (TLS 1.3). Sensitive data at rest encrypted using AES-256.</li>
            <li><strong>Access Controls:</strong> Role-based access control (RBAC) for admin staff. Multi-factor authentication for all admin accounts.</li>
            <li><strong>Audit Trails:</strong> Complete logging of all data access, modifications, and deletions.</li>
            <li><strong>Secure Infrastructure:</strong> Cloud hosting with ISO 27001 certified providers.</li>
            <li><strong>Regular Assessments:</strong> Quarterly vulnerability scans and annual penetration testing.</li>
            <li><strong>Staff Training:</strong> All staff complete data protection training before accessing personal data.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>8. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary:</p>
          <table className="legal-table">
            <thead>
              <tr><th>Data Category</th><th>Retention Period</th><th>Basis</th></tr>
            </thead>
            <tbody>
              <tr><td>Account registration data</td><td>Duration of account + 2 years</td><td>Contract performance</td></tr>
              <tr><td>NIRA ID verification documents</td><td>Duration of account + 5 years</td><td>Legal compliance</td></tr>
              <tr><td>Transaction records</td><td>7 years</td><td>Tax/legal requirements</td></tr>
              <tr><td>Usage/analytics data</td><td>2 years (anonymized after 1 year)</td><td>Legitimate interest</td></tr>
              <tr><td>Deleted account data</td><td>30 days after deletion request</td><td>Data subject right (Section 16)</td></tr>
            </tbody>
          </table>
        </div>

        <div className="legal-section">
          <h2>9. Your Rights Under DPPA 2019</h2>
          <p>As a data subject, you have the following rights:</p>
          <ul>
            <li><strong>Right to Access (Section 14):</strong> Request a copy of all personal data we hold about you.</li>
            <li><strong>Right to Rectification (Section 16):</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure / Right to be Forgotten (Section 16):</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Object (Section 17):</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Right to Data Portability:</strong> Request your data in a machine-readable format.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (does not affect prior lawful processing).</li>
            <li><strong>Right to Lodge a Complaint:</strong> File a complaint with NITA-U or UCC if you believe your rights have been violated.</li>
          </ul>
          <p>To exercise any of these rights, contact our DPO at <strong>dpo@shambani-market.africa</strong> or submit a request through your account settings. We will respond within 21 days as required by law.</p>
        </div>

        <div className="legal-section">
          <h2>10. Cookie Policy</h2>
          <p>ShambaNi uses the following categories of cookies:</p>
          <table className="legal-table">
            <thead>
              <tr><th>Category</th><th>Purpose</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr><td>Essential</td><td>Authentication, security, session management</td><td>Session - 1 year</td></tr>
              <tr><td>Preferences</td><td>Language selection, display preferences</td><td>1 year</td></tr>
              <tr><td>Analytics</td><td>Google Analytics - understand platform usage</td><td>2 years</td></tr>
              <tr><td>Marketing</td><td>Social media integration, campaign tracking</td><td>1 year</td></tr>
            </tbody>
          </table>
          <p>You can manage cookie preferences at any time by clicking the "Cookie Settings" link in the footer.</p>
        </div>

        <div className="legal-section">
          <h2>11. Contact Us</h2>
          <p>
            For privacy-related inquiries, data subject requests, or to contact our Data Protection Officer:<br/><br/>
            <strong>Email:</strong> privacy@shambani-market.africa<br/>
            <strong>DPO Email:</strong> dpo@shambani-market.africa<br/>
            <strong>Physical Address:</strong> Mpigi, Uganda<br/>
            <strong>Platform:</strong> shambani-market.africa
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TERMS OF SERVICE PAGE
// ============================================
export function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="legal-effective">Effective Date: July 5, 2026</p>

        <div className="legal-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using ShambaNi (shambani-market.africa), you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access the platform.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Definitions</h2>
          <ul>
            <li><strong>&quot;Platform&quot;</strong> refers to the ShambaNi website, mobile applications, and USSD service (*220#).</li>
            <li><strong>&quot;Farmer&quot;</strong> refers to any user who lists agricultural produce for sale.</li>
            <li><strong>&quot;Buyer&quot;</strong> refers to any user who purchases produce through the platform.</li>
            <li><strong>&quot;Institutional Buyer&quot;</strong> refers to registered organizations (schools, hospitals, restaurants, hotels, companies, NGOs, government).</li>
            <li><strong>&quot;Transaction&quot;</strong> refers to any purchase or sale conducted through the platform.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Eligibility and Registration</h2>
          <p><strong>For Farmers:</strong></p>
          <ul>
            <li>Must be at least 18 years of age</li>
            <li>Must possess a valid Uganda National ID (NIRA) or equivalent from Kenya, Tanzania, or Rwanda</li>
            <li>Must provide accurate farm and contact information</li>
            <li>Must complete verification process including profile photo and ID document submission</li>
            <li>Must have an active mobile money account (MTN or Airtel)</li>
          </ul>
          <p><strong>For Buyers:</strong></p>
          <ul>
            <li>Must be at least 18 years of age (or authorized representative of an organization)</li>
            <li>Must provide accurate contact and organizational information</li>
            <li>Institutional buyers must provide valid registration documentation</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Platform Commission and Fees</h2>
          <ul>
            <li>ShambaNi charges a <strong>2.5% commission</strong> on each successful transaction.</li>
            <li>This commission is automatically deducted from the seller's payment.</li>
            <li>No upfront fees, subscription fees, or listing fees for farmers.</li>
            <li>No fees for buyer registration or browsing.</li>
            <li>Payment processing fees charged by mobile money operators (MTN/Airtel) are separate and borne by the respective parties.</li>
            <li>ShambaNi reserves the right to adjust commission rates with 30 days notice.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Farmer Obligations</h2>
          <p>By listing produce on ShambaNi, farmers agree to:</p>
          <ul>
            <li>Provide accurate descriptions, quantities, and quality information for all listed products</li>
            <li>Maintain product quality standards appropriate for the stated category</li>
            <li>Honor confirmed orders and deliver within agreed timeframes</li>
            <li>Update product availability status promptly</li>
            <li>Comply with all applicable agricultural and food safety regulations</li>
            <li>Not engage in price manipulation, artificial scarcity, or deceptive practices</li>
            <li>Respond to buyer inquiries within 24 hours during business days</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Buyer Obligations</h2>
          <p>By purchasing through ShambaNi, buyers agree to:</p>
          <ul>
            <li>Honor confirmed orders and make payment according to agreed terms</li>
            <li>Provide accurate delivery information</li>
            <li>Inspect produce upon delivery and report issues within 24 hours</li>
            <li>Not engage in fraudulent orders or payment disputes without valid cause</li>
            <li>Comply with institutional procurement policies (for institutional buyers)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>7. Verification System</h2>
          <p>ShambaNi operates a two-tier verification system:</p>
          <ul>
            <li><strong>Tier 1 (Public):</strong> Profile photo, name, district, sales history, and verified badge are visible to all users.</li>
            <li><strong>Tier 2 (Secure):</strong> NIRA ID number, ID document photo, and mobile money registration name are stored encrypted and accessible only to authorized ShambaNi administrators.</li>
          </ul>
          <p>Verification typically takes 24-48 hours. ShambaNi reserves the right to reject verification applications that contain fraudulent or inaccurate information.</p>
        </div>

        <div className="legal-section">
          <h2>8. Payments and Disputes</h2>
          <ul>
            <li>All payments are processed through integrated mobile money (MTN/Airtel) or PayPal.</li>
            <li>ShambaNi holds payments in escrow until delivery is confirmed by the buyer.</li>
            <li>Disputes must be raised within 48 hours of delivery.</li>
            <li>ShambaNi will mediate disputes based on evidence provided by both parties.</li>
            <li>In cases of fraud or severe violation, accounts may be suspended immediately.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>9. Intellectual Property</h2>
          <p>
            All content on the ShambaNi platform, including logos, branding, software, and design, 
            is the property of ShambaNi Marketplace Ltd and protected by Ugandan and international 
            intellectual property laws. Users may not copy, modify, distribute, or create derivative 
            works without express written permission.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            ShambaNi acts as a marketplace facilitator and is not a party to transactions between 
            farmers and buyers. We do not guarantee the quality, safety, or legality of products listed. 
            Our total liability shall not exceed the amount of commission paid on the disputed transaction.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the 
            Republic of Uganda. Any disputes shall be subject to the exclusive jurisdiction of 
            the courts of Uganda.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, contact us at:<br/>
            <strong>Email:</strong> legal@shambani-market.africa<br/>
            <strong>Platform:</strong> shambani-market.africa
          </p>
        </div>
      </div>
    </div>
  );
}
