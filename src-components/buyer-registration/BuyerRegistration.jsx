/**
 * ShambaNi Buyer Registration Component
 * Supports Institutional Buyers (Schools, Hospitals, Restaurants, Hotels, Companies)
 * and Individual Buyers with role-based form fields
 * 
 * File: src/components/BuyerRegistration/BuyerRegistration.jsx
 * GitHub: shambani-market/shambani-market.africa
 */

import React, { useState } from 'react';
import './BuyerRegistration.css';

const BUYER_TYPES = [
  { id: 'school', label: 'School / Educational Institution', icon: '🏫' },
  { id: 'hospital', label: 'Hospital / Health Facility', icon: '🏥' },
  { id: 'restaurant', label: 'Restaurant / Catering', icon: '🍽️' },
  { id: 'hotel', label: 'Hotel / Lodge', icon: '🏨' },
  { id: 'company', label: 'Company / Corporate Cafeteria', icon: '🏢' },
  { id: 'ngo', label: 'NGO / Non-Profit Organization', icon: '🤝' },
  { id: 'government', label: 'Government Institution', icon: '🏛️' },
  { id: 'individual', label: 'Individual / Household', icon: '🏠' }
];

const PROCUREMENT_VOLUMES = [
  { value: 'small', label: 'Small (Under UGX 500K/month)' },
  { value: 'medium', label: 'Medium (UGX 500K - 5M/month)' },
  { value: 'large', label: 'Large (UGX 5M - 20M/month)' },
  { value: 'enterprise', label: 'Enterprise (Over UGX 20M/month)' }
];

export default function BuyerRegistration() {
  const [step, setStep] = useState(1);
  const [buyerType, setBuyerType] = useState('');
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    district: '',
    address: '',
    procurementVolume: '',
    productCategories: [],
    deliveryPreference: '',
    paymentMethod: '',
    registrationNumber: '', // For institutional buyers
    taxId: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isInstitutional = ['school', 'hospital', 'restaurant', 'hotel', 'company', 'ngo', 'government'].includes(buyerType);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!buyerType) newErrors.buyerType = 'Please select your buyer type';
    }
    
    if (step === 2) {
      if (isInstitutional && !formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\+?256[0-9]{9}$|^0[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Enter valid Uganda phone (+256... or 0...)';
      }
      if (!formData.district) newErrors.district = 'District is required';
    }
    
    if (step === 3) {
      if (!formData.procurementVolume) newErrors.procurementVolume = 'Please select procurement volume';
      if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one product category';
      if (!formData.deliveryPreference) newErrors.deliveryPreference = 'Select delivery preference';
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Select payment method';
      if (isInstitutional && !formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    }
    
    if (step === 4) {
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // API call to register buyer
      const response = await fetch('/api/buyers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerType,
          ...formData,
          registeredAt: new Date().toISOString(),
          status: 'pending_verification'
        })
      });
      
      if (response.ok) {
        setSuccess(true);
        // Send welcome email/SMS
        await fetch('/api/notifications/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, phone: formData.phone, name: formData.contactName })
        });
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const productCategories = [
    'Vegetables', 'Fruits', 'Grains', 'Livestock', 'Dairy', 
    'Spices', 'Nuts & Seeds', 'Root Crops', 'Poultry', 'Fish'
  ];

  const ugandaDistricts = [
    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Masaka', 'Mbarara', 'Gulu', 'Lira',
    'Arua', 'Fort Portal', 'Mbale', 'Soroti', 'Hoima', 'Kabale', 'Kasese'
  ];

  if (success) {
    return (
      <div className="buyer-registration">
        <div className="registration-success">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Welcome to ShambaNi, <strong>{formData.contactName}</strong>!</p>
          <p>Your {isInstitutional ? 'institutional' : 'buyer'} account is pending verification.</p>
          <div className="success-details">
            <p><strong>Account Type:</strong> {BUYER_TYPES.find(t => t.id === buyerType)?.label}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Verification Time:</strong> 24-48 hours</p>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => window.location.href = '/browse-produce'}>
              Browse Produce Now
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '/'}>
              Go to Homepage
            </button>
          </div>
          <p className="success-note">
            You'll receive a confirmation email and SMS once your account is verified.
            For urgent inquiries, contact support@shambani-market.africa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-registration">
      <div className="registration-header">
        <h1>Register as a Buyer on ShambaNi</h1>
        <p>Connect directly with verified farmers across East Africa</p>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`progress-step ${s === step ? 'active' : s < step ? 'completed' : ''}`}>
              <div className="step-number">{s < step ? '✓' : s}</div>
              <div className="step-label">
                {s === 1 ? 'Buyer Type' : s === 2 ? 'Contact Info' : s === 3 ? 'Preferences' : 'Account'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="registration-form">
        {/* Step 1: Buyer Type */}
        {step === 1 && (
          <div className="form-step">
            <h2>What type of buyer are you?</h2>
            <p className="step-description">This helps us match you with the right farmers and features.</p>
            
            <div className="buyer-type-grid">
              {BUYER_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`buyer-type-card ${buyerType === type.id ? 'selected' : ''}`}
                  onClick={() => setBuyerType(type.id)}
                >
                  <span className="buyer-type-icon">{type.icon}</span>
                  <span className="buyer-type-label">{type.label}</span>
                </button>
              ))}
            </div>
            {errors.buyerType && <span className="error-text">{errors.buyerType}</span>}
            
            <div className="form-navigation">
              <button className="btn-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            <p className="step-description">Tell us about {isInstitutional ? 'your organization' : 'yourself'}.</p>
            
            <div className="form-fields">
              {isInstitutional && (
                <div className="form-group">
                  <label>Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="e.g., Kampala Junior School"
                  />
                  {errors.organizationName && <span className="error-text">{errors.organizationName}</span>}
                </div>
              )}
              
              <div className="form-group">
                <label>Contact Person's Full Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="e.g., John Mukasa"
                />
                {errors.contactName && <span className="error-text">{errors.contactName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+256 708 123 456"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>District *</label>
                  <select name="district" value={formData.district} onChange={handleInputChange}>
                    <option value="">Select District</option>
                    {ugandaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <span className="error-text">{errors.district}</span>}
                </div>
                
                {isInstitutional && (
                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., URSB-12345"
                    />
                    {errors.registrationNumber && <span className="error-text">{errors.registrationNumber}</span>}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Physical Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., Plot 45, Kampala Road"
                />
              </div>
            </div>
            
            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button className="btn-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Procurement Preferences */}
        {step === 3 && (
          <div className="form-step">
            <h2>Procurement Preferences</h2>
            <p className="step-description">Help us understand your buying needs.</p>
            
            <div className="form-fields">
              <div className="form-group">
                <label>Monthly Procurement Volume *</label>
                <select name="procurementVolume" value={formData.procurementVolume} onChange={handleInputChange}>
                  <option value="">Select Volume</option>
                  {PROCUREMENT_VOLUMES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
                {errors.procurementVolume && <span className="error-text">{errors.procurementVolume}</span>}
              </div>
              
              <div className="form-group">
                <label>Product Categories of Interest *</label>
                <div className="category-grid">
                  {productCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-btn ${formData.productCategories.includes(cat) ? 'selected' : ''}`}
                      onClick={() => handleCategoryToggle(cat)}
                    >
                      {formData.productCategories.includes(cat) ? '✓ ' : ''}{cat}
                    </button>
                  ))}
                </div>
                {errors.productCategories && <span className="error-text">{errors.productCategories}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Preference *</label>
                  <select name="deliveryPreference" value={formData.deliveryPreference} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="farmer_delivery">Farmer delivers to me</option>
                    <option value="pickup">I pick up from farmer</option>
                    <option value="third_party">Third-party logistics</option>
                    <option value="flexible">Flexible</option>
                  </select>
                  {errors.deliveryPreference && <span className="error-text">{errors.deliveryPreference}</span>}
                </div>
                
                <div className="form-group">
                  <label>Preferred Payment Method *</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="airtel_money">Airtel Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  {errors.paymentMethod && <span className="error-text">{errors.paymentMethod}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button className="btn-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Account Security */}
        {step === 4 && (
          <div className="form-step">
            <h2>Create Your Account</h2>
            <p className="step-description">Set up your login credentials.</p>
            
            <div className="form-fields">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 characters"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                  />
                  <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *</span>
                </label>
                {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
              </div>
            </div>
            
            {errors.submit && <div className="error-banner">{errors.submit}</div>}
            
            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
