# ShambaNi Platform Enhancements - Integration Guide

**Branch:** `shambani-enhancements`  
**Generated:** July 5, 2026  
**Purpose:** Add chatbot, buyer registration, legal pages, admin extensions, and fix critical credibility issues

---

## What Was Added

| Component | Files | Purpose |
|---|---|---|
| **Chatbot** | `src-components/chatbot/ShambaNiChatbot.jsx` + `.css` | Multi-language (EN/LG/SW) support widget for farmers & buyers |
| **Buyer Registration** | `src-components/buyer-registration/BuyerRegistration.jsx` + `.css` | 4-step signup for schools, hospitals, restaurants, hotels, companies, individuals |
| **Legal Pages** | `src-components/legal-pages/LegalPages.jsx` + `.css` | Privacy Policy, Terms of Service, Cookie Consent (DPPA 2019 compliant) |
| **Admin Extensions** | `src-components/admin-extensions/dashboardExtensions.js` | RBAC, verification queues, district analytics, CSV export |
| **Funder Report** | `funder-report/FUNDER-READINESS-ASSESSMENT.md` | Complete partnership strategy for Government of Uganda |
| **Visualizations** | `funder-report/images/fig1-4.png` | Competitive landscape, gap analysis, market opportunity charts |

---

## Step-by-Step Integration

### Step 1: Copy Components to Your Source Project

Your GitHub repo (`ReaganLutwa/Shambani-market`) contains the **built/deployed** files. You need to add these components to your **React source project** (the one you run `npm run build` on locally).

```bash
# In your local React source project (NOT the deployed repo):
mkdir -p src/components/ShambaNiChatbot
mkdir -p src/components/BuyerRegistration
mkdir -p src/components/LegalPages
mkdir -p src/admin/extensions

# Copy files from this branch
cp src-components/chatbot/ShambaNiChatbot.jsx src/components/ShambaNiChatbot/
cp src-components/chatbot/ShambaNiChatbot.css src/components/ShambaNiChatbot/
cp src-components/buyer-registration/BuyerRegistration.jsx src/components/BuyerRegistration/
cp src-components/buyer-registration/BuyerRegistration.css src/components/BuyerRegistration/
cp src-components/legal-pages/LegalPages.jsx src/components/LegalPages/
cp src-components/legal-pages/LegalPages.css src/components/LegalPages/
cp src-components/admin-extensions/dashboardExtensions.js src/admin/extensions/
```

### Step 2: Add Chatbot + Cookie Consent to App

In your main `App.js` (or `App.jsx`):

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShambaNiChatbot from './components/ShambaNiChatbot/ShambaNiChatbot';
import { CookieConsentBanner, PrivacyPolicy, TermsOfService } from './components/LegalPages/LegalPages';
import BuyerRegistration from './components/BuyerRegistration/BuyerRegistration';
// ... your existing imports

function App() {
  return (
    <BrowserRouter>
      {/* Your existing routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse-produce" element={<BrowseProduce />} />

        {/* NEW: Add these routes */}
        <Route path="/buyer-register" element={<BuyerRegistration />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* ... your other routes */}
      </Routes>

      {/* NEW: Add these components at the bottom */}
      <ShambaNiChatbot />
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
```

### Step 3: Add "Register as Buyer" Button to Homepage

On your homepage hero section, add a second CTA button next to "List Your Farm":

```jsx
<div className="hero-buttons">
  <a href="/browse-produce" className="btn-primary">Browse Fresh Produce</a>
  <a href="/buyer-register" className="btn-secondary">Register as Buyer</a>
  <a href="/list-farm" className="btn-outline">List Your Farm</a>
</div>
```

### Step 4: CRITICAL FIXES - Do These Before Government Meeting

#### Fix 4A: Replace "0+" Counters

Find where you render stats like `0+ Active Farmers`. Replace with:

```jsx
// Option 1: Show real data (even if small)
<div className="stats-bar">
  <div className="stat">
    <span className="stat-number">{verifiedFarmers}</span>
    <span className="stat-label">Verified Farmers</span>
  </div>
  <div className="stat">
    <span className="stat-number">{activeBuyers}</span>
    <span className="stat-label">Active Buyers</span>
  </div>
  <div className="stat">
    <span className="stat-number">{districtsCovered}</span>
    <span className="stat-label">Districts</span>
  </div>
</div>

// Option 2: Hide entirely until you have meaningful numbers
{verifiedFarmers >= 10 && (
  <div className="stats-bar">...</div>
)}
```

#### Fix 4B: Hide Personal Phone Number

Replace the WhatsApp direct link on your homepage:

```jsx
// REMOVE this:
<a href="https://wa.me/256708813419">WhatsApp</a>

// ADD this - use the chatbot instead:
// (The chatbot already has WhatsApp fallback built-in)
// Or create a simple contact form:
<a href="/contact">Contact Us</a>
```

**In the chatbot code** (`ShambaNiChatbot.jsx`), replace the phone number:
```jsx
// Line ~220: Change this:
const phone = '256708813419';
// To a business number or remove WhatsApp fallback entirely
```

#### Fix 4C: Add Footer Links to Legal Pages

Add to your footer:

```jsx
<footer>
  {/* ... existing footer content ... */}
  <div className="footer-legal">
    <a href="/privacy">Privacy Policy</a>
    <span>|</span>
    <a href="/terms">Terms of Service</a>
    <span>|</span>
    <a href="#" onClick={() => { localStorage.removeItem('shambani_cookie_consent'); window.location.reload(); }}>
      Cookie Settings
    </a>
  </div>
  <p className="copyright">2026 ShambaNi Marketplace. All rights reserved.</p>
</footer>
```

### Step 5: Backend Integration (Node.js/Express)

Add the admin API routes from `dashboardExtensions.js` to your Express app:

```js
// In your main server file (e.g., server.js or app.js)
const adminRoutes = require('./src/admin/extensions/dashboardExtensions');

// Add after your existing routes
app.use('/api/admin', adminRoutes);
```

Create the required database tables:

```sql
-- Buyers table (add to your existing schema)
CREATE TABLE buyers (
  id SERIAL PRIMARY KEY,
  buyer_type VARCHAR(50) NOT NULL, -- school, hospital, restaurant, hotel, company, ngo, government, individual
  organization_name VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  district VARCHAR(100),
  address TEXT,
  registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  procurement_volume VARCHAR(50),
  product_categories TEXT[], -- array of categories
  delivery_preference VARCHAR(100),
  payment_method VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by INTEGER,
  verification_notes TEXT,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  performed_by INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 6: Build and Deploy

```bash
# After integrating all components:
npm run build

# Deploy the new build to your hosting (GitHub Pages, Netlify, Vercel, etc.)
# If using GitHub Pages, commit the new build and push to main
git add .
git commit -m "Add chatbot, buyer registration, legal pages, admin enhancements"
git push origin main
```

---

## Component Details

### Chatbot Features
- **3 Languages:** English, Luganda, Swahili (toggle in header)
- **Auto-detects user type:** Farmer or Buyer based on conversation
- **Knowledge base:** Registration, payments, USSD, verification, delivery
- **Quick action buttons:** One-click common questions
- **WhatsApp fallback:** Escalates to human support
- **Mobile responsive:** Adapts to full-screen on mobile

### Buyer Registration Features
- **8 buyer types:** School, Hospital, Restaurant, Hotel, Company, NGO, Government, Individual
- **4-step wizard:** Type > Contact > Preferences > Account
- **Procurement volume:** Helps match with appropriate farmers
- **Product categories:** Multi-select interest areas
- **Delivery preferences:** Farmer delivery, pickup, third-party
- **Validation:** Real-time form validation with helpful errors

### Legal Pages Features
- **DPPA 2019 Compliant:** Full Uganda Data Protection Act compliance
- **Two-tier data architecture:** Explains what buyers see vs. what admin stores
- **Data subject rights:** All 7 rights under DPPA 2019 explained
- **Cookie consent:** Granular consent with localStorage persistence
- **Retention policy:** Clear data retention periods

### Admin Extensions Features
- **Role-based access:** Super Admin, Admin, Verifier, Auditor
- **Verification queue:** Approve/reject farmers and buyers with notes
- **District analytics:** Transaction volumes by district
- **Transaction trends:** 7/30/90-day reporting
- **CSV export:** For government reporting
- **Audit logging:** Full compliance trail

---

## Quick Reference: Homepage Fixes Checklist

| Issue | Current State | Fix | Effort |
|---|---|---|---|
| "0+ Active Farmers" counter | Shows placeholder zeros | Show real data or hide counter | 10 min |
| Personal phone exposed | `wa.me/256708813419` on homepage | Replace with chatbot or contact form | 15 min |
| No Privacy Policy | Missing entirely | Add `/privacy` route + link in footer | 5 min (component ready) |
| No Terms of Service | Missing entirely | Add `/terms` route + link in footer | 5 min (component ready) |
| No Cookie Consent | Missing entirely | Import `CookieConsentBanner` in App.js | 2 min |
| No buyer registration | Only farmer signup exists | Add `/buyer-register` route + button on hero | 10 min |
| No chatbot | No support channel | Import `ShambaNiChatbot` in App.js | 2 min |

**Total time to fix all critical issues: ~1 hour**

---

## After Deployment - Government Meeting Prep

1. **Verify the site loads** at shambani-market.africa
2. **Test buyer registration** flow end-to-end
3. **Test chatbot** with a few questions
4. **Verify legal pages** are accessible at `/privacy` and `/terms`
5. **Confirm cookie banner** appears for new visitors
6. **Check that your phone number is no longer visible** on the homepage
7. **Register 5-10 real farmers** before the meeting (creates social proof)
8. **Print the funder report** (`funder-report/FUNDER-READINESS-ASSESSMENT.md`) to bring to the meeting

---

## Support

For questions about integration, contact:
- **Platform:** shambani-market.africa
- **Email:** support@shambani-market.africa

**IMPORTANT: Revoke the GitHub Personal Access Token used for this push immediately after confirming all files are in place.**
