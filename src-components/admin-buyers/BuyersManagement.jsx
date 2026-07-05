/**
 * ShambaNi Admin Dashboard - Buyers Management Section
 * Adds Buyers to admin sidebar + unified verification for farmers AND buyers
 * Includes: Buyer list, buyer verification queue, buyer details view
 * 
 * File: src/admin/components/BuyersManagement.jsx
 * GitHub: shambani-market/shambani-market.africa
 */

import React, { useState, useEffect } from 'react';
import './BuyersManagement.css';

// ===== BUYER TYPE BADGES =====
const BUYER_TYPE_CONFIG = {
  school: { label: 'School', color: '#3498db', icon: '🏫' },
  hospital: { label: 'Hospital', color: '#e74c3c', icon: '🏥' },
  restaurant: { label: 'Restaurant', color: '#f39c12', icon: '🍽️' },
  hotel: { label: 'Hotel', color: '#9b59b6', icon: '🏨' },
  company: { label: 'Company', color: '#1abc9c', icon: '🏢' },
  ngo: { label: 'NGO', color: '#e67e22', icon: '🤝' },
  government: { label: 'Government', color: '#2c3e50', icon: '🏛️' },
  individual: { label: 'Individual', color: '#95a5a6', icon: '🏠' }
};

const VERIFICATION_STATUS = {
  pending: { label: 'Pending', color: '#f39c12', bg: '#fef5e7' },
  approved: { label: 'Verified', color: '#27ae60', bg: '#e8f8f5' },
  rejected: { label: 'Rejected', color: '#e74c3c', bg: '#fdedec' },
  under_review: { label: 'Under Review', color: '#3498db', bg: '#ebf5fb' }
};

// ===== MOCK DATA (replace with API calls) =====
const MOCK_BUYERS = [
  {
    id: 1,
    buyer_type: 'school',
    organization_name: 'Kampala Junior School',
    contact_name: 'Grace Nakato',
    email: 'nakato.g@kampalajunior.ac.ug',
    phone: '+256 701 234 567',
    country: 'UG',
    region: 'central',
    district: 'Kampala',
    address: 'Plot 45, Nakasero Road, Kampala',
    registration_number: 'URSB-2024-001',
    procurement_volume: 'medium',
    product_categories: ['Vegetables', 'Fruits', 'Dairy'],
    delivery_preference: 'farmer_delivery',
    payment_method: 'bank_transfer',
    status: 'pending',
    verification_notes: '',
    verified_at: null,
    verified_by: null,
    created_at: '2026-07-01T10:30:00Z',
    total_orders: 0,
    total_spent: 0
  },
  {
    id: 2,
    buyer_type: 'hospital',
    organization_name: 'Mengo Hospital',
    contact_name: 'Dr. Paul Mukasa',
    email: 'procurement@mengohospital.or.ug',
    phone: '+256 772 345 678',
    country: 'UG',
    region: 'central',
    district: 'Kampala',
    address: 'Mengo Hill Road, Kampala',
    registration_number: 'MOH-UG-00234',
    procurement_volume: 'large',
    product_categories: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Poultry'],
    delivery_preference: 'third_party',
    payment_method: 'bank_transfer',
    status: 'pending',
    verification_notes: '',
    verified_at: null,
    verified_by: null,
    created_at: '2026-07-02T14:15:00Z',
    total_orders: 0,
    total_spent: 0
  },
  {
    id: 3,
    buyer_type: 'restaurant',
    organization_name: 'The Lawns Restaurant',
    contact_name: 'Sarah Achieng',
    email: 'info@thelawns.co.ke',
    phone: '+254 712 456 789',
    country: 'KE',
    region: 'nairobi',
    district: 'Nairobi City',
    address: 'Lower Kabete Road, Nairobi',
    registration_number: 'BRS-KE-5567',
    procurement_volume: 'medium',
    product_categories: ['Vegetables', 'Livestock', 'Spices'],
    delivery_preference: 'pickup',
    payment_method: 'mtn_momo',
    status: 'approved',
    verification_notes: 'Verified - business registration confirmed',
    verified_at: '2026-07-03T09:00:00Z',
    verified_by: 'Admin Reagan',
    created_at: '2026-06-28T11:00:00Z',
    total_orders: 3,
    total_spent: 1250000
  },
  {
    id: 4,
    buyer_type: 'individual',
    organization_name: null,
    contact_name: 'Mary Nantume',
    email: 'mary.nantume@gmail.com',
    phone: '+256 788 901 234',
    country: 'UG',
    region: 'central',
    district: 'Wakiso',
    address: 'Kira Town, Wakiso',
    registration_number: null,
    procurement_volume: 'small',
    product_categories: ['Vegetables', 'Fruits'],
    delivery_preference: 'farmer_delivery',
    payment_method: 'mtn_momo',
    status: 'approved',
    verification_notes: 'Phone verified via OTP',
    verified_at: '2026-07-01T08:30:00Z',
    verified_by: 'System',
    created_at: '2026-06-30T16:45:00Z',
    total_orders: 1,
    total_spent: 45000
  }
];

// ===== BUYER LIST COMPONENT =====
export function BuyersList() {
  const [buyers, setBuyers] = useState(MOCK_BUYERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const filtered = buyers.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = !search || 
      b.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.organization_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: buyers.length,
    pending: buyers.filter(b => b.status === 'pending').length,
    approved: buyers.filter(b => b.status === 'approved').length,
    rejected: buyers.filter(b => b.status === 'rejected').length,
    institutional: buyers.filter(b => ['school','hospital','restaurant','hotel','company','ngo','government'].includes(b.buyer_type)).length,
    individual: buyers.filter(b => b.buyer_type === 'individual').length
  };

  return (
    <div className="buyers-management">
      <div className="buyers-header">
        <h2>Buyers Management</h2>
        <p>Manage and verify buyers across East Africa</p>
      </div>

      {/* Stats Cards */}
      <div className="buyers-stats">
        <div className="stat-card total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Buyers</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending Verification</span>
        </div>
        <div className="stat-card approved">
          <span className="stat-value">{stats.approved}</span>
          <span className="stat-label">Verified</span>
        </div>
        <div className="stat-card institutional">
          <span className="stat-value">{stats.institutional}</span>
          <span className="stat-label">Institutional</span>
        </div>
        <div className="stat-card individual">
          <span className="stat-value">{stats.individual}</span>
          <span className="stat-label">Individual</span>
        </div>
      </div>

      {/* Filters */}
      <div className="buyers-filters">
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Buyers' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Verified' },
            { key: 'rejected', label: 'Rejected' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="tab-count">{buyers.filter(b => b.status === tab.key).length}</span>
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, organization, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Buyers Table */}
      <div className="buyers-table-wrapper">
        <table className="buyers-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Type</th>
              <th>Location</th>
              <th>Volume</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(buyer => {
              const typeConfig = BUYER_TYPE_CONFIG[buyer.buyer_type];
              const statusConfig = VERIFICATION_STATUS[buyer.status];
              return (
                <tr key={buyer.id}>
                  <td>
                    <div className="buyer-info">
                      <span className="buyer-name">{buyer.contact_name}</span>
                      {buyer.organization_name && (
                        <span className="buyer-org">{buyer.organization_name}</span>
                      )}
                      <span className="buyer-contact">{buyer.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="buyer-type-badge" style={{ background: typeConfig.color + '20', color: typeConfig.color, borderColor: typeConfig.color }}>
                      {typeConfig.icon} {typeConfig.label}
                    </span>
                  </td>
                  <td>
                    <span className="buyer-location">
                      {BUYER_TYPE_CONFIG[buyer.country]?.label || buyer.country} · {buyer.district}
                    </span>
                  </td>
                  <td>
                    <span className="procurement-volume">{buyer.procurement_volume}</span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td>
                    <span className="date">{new Date(buyer.created_at).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <button className="btn-view" onClick={() => setSelectedBuyer(buyer)}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Buyer Detail Modal */}
      {selectedBuyer && (
        <BuyerDetailModal
          buyer={selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          onVerify={(id, decision, notes) => {
            setBuyers(prev => prev.map(b => 
              b.id === id ? { ...b, status: decision, verification_notes: notes, verified_at: new Date().toISOString() } : b
            ));
            setSelectedBuyer(null);
          }}
        />
      )}
    </div>
  );
}

// ===== BUYER DETAIL / VERIFICATION MODAL =====
function BuyerDetailModal({ buyer, onClose, onVerify }) {
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const typeConfig = BUYER_TYPE_CONFIG[buyer.buyer_type];

  const handleVerify = (decision) => {
    onVerify(buyer.id, decision, notes);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content buyer-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {typeConfig.icon} {buyer.organization_name || buyer.contact_name}
            <span className="status-badge" style={{ 
              background: VERIFICATION_STATUS[buyer.status].bg, 
              color: VERIFICATION_STATUS[buyer.status].color 
            }}>
              {VERIFICATION_STATUS[buyer.status].label}
            </span>
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Details</button>
          <button className={activeTab === 'verification' ? 'active' : ''} onClick={() => setActiveTab('verification')}>Verification</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>

        {activeTab === 'details' && (
          <div className="modal-body">
            <div className="detail-grid">
              <div className="detail-group">
                <h4>Contact Information</h4>
                <p><strong>Name:</strong> {buyer.contact_name}</p>
                {buyer.organization_name && <p><strong>Organization:</strong> {buyer.organization_name}</p>}
                <p><strong>Email:</strong> {buyer.email}</p>
                <p><strong>Phone:</strong> {buyer.phone}</p>
              </div>
              <div className="detail-group">
                <h4>Location</h4>
                <p><strong>Country:</strong> {buyer.country}</p>
                <p><strong>Region:</strong> {buyer.region}</p>
                <p><strong>District:</strong> {buyer.district}</p>
                <p><strong>Address:</strong> {buyer.address}</p>
              </div>
              <div className="detail-group">
                <h4>Business Details</h4>
                <p><strong>Type:</strong> {typeConfig.label}</p>
                {buyer.registration_number && <p><strong>Reg. Number:</strong> {buyer.registration_number}</p>}
                <p><strong>Procurement Volume:</strong> {buyer.procurement_volume}</p>
                <p><strong>Payment Method:</strong> {buyer.payment_method}</p>
              </div>
              <div className="detail-group">
                <h4>Preferences</h4>
                <p><strong>Categories:</strong> {buyer.product_categories?.join(', ')}</p>
                <p><strong>Delivery:</strong> {buyer.delivery_preference}</p>
                <p><strong>Total Orders:</strong> {buyer.total_orders}</p>
                <p><strong>Total Spent:</strong> UGX {buyer.total_spent?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="modal-body">
            <div className="verification-section">
              <h4>Verification Checklist</h4>
              
              {buyer.buyer_type !== 'individual' && (
                <>
                  <div className="check-item">
                    <input type="checkbox" id="reg-doc" />
                    <label htmlFor="reg-doc">Organization registration document reviewed</label>
                  </div>
                  <div className="check-item">
                    <input type="checkbox" id="tax-id" />
                    <label htmlFor="tax-id">Tax ID verified (if applicable)</label>
                  </div>
                </>
              )}
              
              <div className="check-item">
                <input type="checkbox" id="phone-ver" defaultChecked />
                <label htmlFor="phone-ver">Phone number verified</label>
              </div>
              <div className="check-item">
                <input type="checkbox" id="email-ver" />
                <label htmlFor="email-ver">Email domain validated</label>
              </div>
              <div className="check-item">
                <input type="checkbox" id="address-ver" />
                <label htmlFor="address-ver">Physical address confirmed</label>
              </div>

              {buyer.buyer_type === 'school' && (
                <div className="check-item">
                  <input type="checkbox" id="ministry" />
                  <label htmlFor="ministry">Ministry of Education registration confirmed</label>
                </div>
              )}
              {buyer.buyer_type === 'hospital' && (
                <div className="check-item">
                  <input type="checkbox" id="moh" />
                  <label htmlFor="moh">Ministry of Health license confirmed</label>
                </div>
              )}

              <div className="verification-notes">
                <label>Verification Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about verification process..."
                  rows={3}
                />
              </div>

              {buyer.status === 'pending' && (
                <div className="verification-actions">
                  <button className="btn-approve" onClick={() => handleVerify('approved')}>
                    ✓ Approve Buyer
                  </button>
                  <button className="btn-reject" onClick={() => handleVerify('rejected')}>
                    ✗ Reject Buyer
                  </button>
                </div>
              )}

              {buyer.verified_at && (
                <div className="verification-history">
                  <p><strong>Verified on:</strong> {new Date(buyer.verified_at).toLocaleString()}</p>
                  <p><strong>Verified by:</strong> {buyer.verified_by}</p>
                  {buyer.verification_notes && (
                    <p><strong>Notes:</strong> {buyer.verification_notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="modal-body">
            <p>Order history will appear here once the buyer places orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== UNIFIED VERIFICATION QUEUE =====
export function UnifiedVerificationQueue() {
  // Combines farmer + buyer verification into one view
  const [tab, setTab] = useState('farmers');
  const [farmers] = useState([
    { id: 1, name: 'John Kato', type: 'farmer', district: 'Mukono', status: 'pending', submitted: '2026-07-04' },
    { id: 2, name: 'Sarah Namukwaya', type: 'farmer', district: 'Wakiso', status: 'pending', submitted: '2026-07-05' }
  ]);
  const [buyers] = useState(MOCK_BUYERS.filter(b => b.status === 'pending'));

  const totalPending = farmers.length + buyers.length;

  return (
    <div className="unified-verification">
      <div className="verification-header">
        <h2>Verification Queue</h2>
        <span className="pending-badge">{totalPending} pending</span>
      </div>

      <div className="verification-tabs">
        <button className={tab === 'farmers' ? 'active' : ''} onClick={() => setTab('farmers')}>
          👨‍🌾 Farmers ({farmers.length})
        </button>
        <button className={tab === 'buyers' ? 'active' : ''} onClick={() => setTab('buyers')}>
          🏢 Buyers ({buyers.length})
        </button>
      </div>

      {tab === 'farmers' && (
        <div className="verification-list">
          {farmers.map(f => (
            <div key={f.id} className="verification-item">
              <div className="item-info">
                <strong>{f.name}</strong>
                <span>{f.district}</span>
              </div>
              <div className="item-actions">
                <button className="btn-approve-sm">✓</button>
                <button className="btn-reject-sm">✗</button>
                <button className="btn-view-sm">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'buyers' && (
        <div className="verification-list">
          {buyers.map(b => {
            const typeConfig = BUYER_TYPE_CONFIG[b.buyer_type];
            return (
              <div key={b.id} className="verification-item">
                <div className="item-info">
                  <strong>{b.contact_name}</strong>
                  {b.organization_name && <span>{b.organization_name}</span>}
                  <span className="buyer-type-tag" style={{ color: typeConfig.color }}>
                    {typeConfig.icon} {typeConfig.label}
                  </span>
                </div>
                <div className="item-actions">
                  <button className="btn-approve-sm">✓</button>
                  <button className="btn-reject-sm">✗</button>
                  <button className="btn-view-sm">View</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BuyersList;
