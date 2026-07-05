/**
 * ShambaNi - For Buyers Landing Page
 * Mirrors the "For Farmers" section structure
 * Explains how buying works, benefits, and CTA to register
 * 
 * File: src/pages/ForBuyers.jsx
 */

import React from 'react';
import './ForBuyers.css';

const BUYER_BENEFITS = [
  {
    icon: '🌱',
    title: 'Farm-Fresh Produce',
    desc: 'Buy directly from verified farmers. No middlemen means fresher produce at better prices.'
  },
  {
    icon: '✅',
    title: 'Verified Suppliers',
    desc: 'Every farmer is identity-verified with NIRA ID. See ratings, reviews, and farm photos before you buy.'
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'Farmers set their own prices. Compare multiple sellers and negotiate directly. No hidden markups.'
  },
  {
    icon: '📱',
    title: 'Multiple Payment Options',
    desc: 'Pay with MTN Mobile Money, Airtel Money, PayPal, or bank transfer. Secure escrow until delivery.'
  },
  {
    icon: '🚚',
    title: 'Flexible Delivery',
    desc: 'Choose farmer delivery, pickup, or third-party logistics. Schedule recurring orders for your institution.'
  },
  {
    icon: '📊',
    title: 'Order Tracking & Reports',
    desc: 'Track all orders, download purchase reports, and manage procurement budgets in one dashboard.'
  }
];

const BUYER_TYPES = [
  {
    icon: '🏫',
    title: 'Schools',
    desc: 'Feeding programs, boarding schools, universities. Bulk pricing and scheduled deliveries available.',
    cta: 'Register as School'
  },
  {
    icon: '🏥',
    title: 'Hospitals',
    desc: 'Patient meals, staff cafeterias. HACCP-compliant suppliers with quality-assured fresh produce.',
    cta: 'Register as Hospital'
  },
  {
    icon: '🍽️',
    title: 'Restaurants',
    desc: 'Daily fresh ingredients for your kitchen. Reliable supply chains from local farmers.',
    cta: 'Register as Restaurant'
  },
  {
    icon: '🏨',
    title: 'Hotels & Lodges',
    desc: 'Premium quality produce for guest dining. Consistent supply and competitive wholesale pricing.',
    cta: 'Register as Hotel'
  },
  {
    icon: '🏢',
    title: 'Companies',
    desc: 'Corporate cafeterias and canteens. Bulk orders with invoicing and credit terms available.',
    cta: 'Register as Company'
  },
  {
    icon: '🏠',
    title: 'Individuals & Families',
    desc: 'Buy fresh produce for your home. Small orders welcome. Same-day delivery in select areas.',
    cta: 'Register as Individual'
  }
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create Your Account',
    desc: 'Register as a buyer in under 2 minutes. Tell us what you need and how much.'
  },
  {
    step: '2',
    title: 'Browse Verified Farmers',
    desc: 'Search by product, district, or farmer rating. View profiles with photos and reviews.'
  },
  {
    step: '3',
    title: 'Place Your Order',
    desc: 'Select products, quantities, and delivery preferences. Get instant price quotes.'
  },
  {
    step: '4',
    title: 'Pay Securely',
    desc: 'Payment is held in escrow. The farmer only gets paid after you confirm delivery.'
  },
  {
    step: '5',
    title: 'Receive & Confirm',
    desc: 'Inspect your delivery. Confirm receipt to release payment. Rate your experience.'
  }
];

export default function ForBuyers() {
  return (
    <div className="for-buyers-page">
      {/* Hero */}
      <section className="buyers-hero">
        <div className="hero-content">
          <span className="hero-badge">For Buyers</span>
          <h1>Fresh From the Farm — Direct to Your Door</h1>
          <p>
            Connect with verified farmers across Uganda, Kenya, Tanzania, and Rwanda. 
            Whether you run a school, hospital, restaurant, or just want quality food for your family — 
            ShambaNi brings the market to you.
          </p>
          <div className="hero-buttons">
            <a href="/buyer-register" className="btn-primary">Register as Buyer</a>
            <a href="/browse-produce" className="btn-secondary">Browse Produce</a>
          </div>
          <div className="hero-trust">
            <span>✓ No registration fees</span>
            <span>✓ Verified farmers only</span>
            <span>✓ Secure escrow payments</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="produce-showcase">
            <span className="produce-item">🍅</span>
            <span className="produce-item">🍌</span>
            <span className="produce-item">🥚</span>
            <span className="produce-item">🥛</span>
            <span className="produce-item">🌽</span>
            <span className="produce-item">🐔</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="buyers-benefits">
        <div className="section-header">
          <h2>Why Buy on ShambaNi?</h2>
          <p>The smarter way to source fresh produce across East Africa</p>
        </div>
        <div className="benefits-grid">
          {BUYER_BENEFITS.map((b, i) => (
            <div className="benefit-card" key={i}>
              <span className="benefit-icon">{b.icon}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer Types */}
      <section className="buyer-types">
        <div className="section-header">
          <h2>Who Can Buy?</h2>
          <p>ShambaNi serves all types of buyers — from institutions to households</p>
        </div>
        <div className="types-grid">
          {BUYER_TYPES.map((t, i) => (
            <div className="type-card" key={i}>
              <span className="type-icon">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <a href="/buyer-register" className="type-cta">{t.cta} →</a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How Buying Works</h2>
          <p>Simple, secure, and transparent — from order to delivery</p>
        </div>
        <div className="steps-container">
          {HOW_IT_WORKS.map((s, i) => (
            <div className="step-item" key={i}>
              <div className="step-number">{s.step}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < HOW_IT_WORKS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Commission */}
      <section className="buyer-pricing">
        <div className="pricing-card">
          <h2>Zero Cost to Buyers</h2>
          <div className="pricing-highlight">
            <span className="price">0%</span>
            <span className="price-label">Buyer Commission</span>
          </div>
          <p>
            ShambaNi charges <strong>2.5% per transaction</strong> — paid by the seller, not you. 
            There are no registration fees, no monthly subscriptions, and no hidden costs.
          </p>
          <div className="pricing-compare">
            <div className="compare-item shambani">
              <strong>ShambaNi</strong>
              <span>2.5% (seller pays)</span>
            </div>
            <div className="compare-item vs">vs</div>
            <div className="compare-item traditional">
              <strong>Traditional Middlemen</strong>
              <span>30-40% markup</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="buyers-cta">
        <h2>Start Buying Fresh Today</h2>
        <p>Join thousands of buyers across East Africa who source directly from farmers.</p>
        <div className="cta-buttons">
          <a href="/buyer-register" className="btn-primary-large">Create Buyer Account</a>
          <a href="/browse-produce" className="btn-outline-large">Browse Available Produce</a>
        </div>
        <p className="cta-note">Registration takes under 2 minutes. No credit card required.</p>
      </section>

      {/* FAQ */}
      <section className="buyers-faq">
        <div className="section-header">
          <h2>Common Questions</h2>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <h4>Is there a minimum order quantity?</h4>
            <p>No minimum for individual buyers. Institutional buyers can negotiate bulk pricing directly with farmers.</p>
          </div>
          <div className="faq-item">
            <h4>How do I know the farmers are trustworthy?</h4>
            <p>Every farmer is verified with their National ID (NIRA). You can see their profile photo, farm details, sales history, and buyer ratings before placing an order.</p>
          </div>
          <div className="faq-item">
            <h4>What if the produce quality is poor?</h4>
            <p>Inspect your delivery before confirming receipt. If quality doesn't match the listing, reject the delivery and your payment stays in escrow. Report issues within 24 hours.</p>
          </div>
          <div className="faq-item">
            <h4>Can I set up recurring orders?</h4>
            <p>Yes — institutional buyers (schools, hospitals, restaurants) can schedule weekly or monthly recurring deliveries with preferred farmers.</p>
          </div>
          <div className="faq-item">
            <h4>Do you deliver outside Uganda?</h4>
            <p>ShambaNi operates in Uganda, Kenya, Tanzania, and Rwanda. Delivery arrangements are made directly between buyer and farmer. Cross-border logistics can be coordinated for bulk orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
