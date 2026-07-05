/**
 * ShambaNi Admin Dashboard Extensions
 * Role-based access, transaction analytics, district reporting, verification workflows
 * 
 * File: src/admin/extensions/dashboardExtensions.js
 * GitHub: shambani-market/shambani-market.africa
 */

// ============================================
// 1. ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================

const ROLES = {
  SUPER_ADMIN: {
    level: 1,
    permissions: [
      'farmers.view', 'farmers.verify', 'farmers.delete',
      'buyers.view', 'buyers.verify', 'buyers.delete',
      'transactions.view', 'transactions.export',
      'analytics.view', 'analytics.export',
      'users.manage', 'users.create_admin',
      'settings.manage', 'system.logs'
    ]
  },
  ADMIN: {
    level: 2,
    permissions: [
      'farmers.view', 'farmers.verify',
      'buyers.view', 'buyers.verify',
      'transactions.view',
      'analytics.view'
    ]
  },
  VERIFIER: {
    level: 3,
    permissions: [
      'farmers.view', 'farmers.verify',
      'buyers.view', 'buyers.verify'
    ]
  },
  AUDITOR: {
    level: 4,
    permissions: [
      'farmers.view', 'buyers.view',
      'transactions.view', 'analytics.view'
    ]
  }
};

function hasPermission(userRole, permission) {
  const role = ROLES[userRole];
  if (!role) return false;
  return role.permissions.includes(permission) || role.permissions.includes('*');
}

function canAccess(userRole, requiredLevel) {
  const role = ROLES[userRole];
  if (!role) return false;
  return role.level <= requiredLevel;
}

// ============================================
// 2. ADMIN DASHBOARD API ENDPOINTS (Node.js/Express)
// ============================================

/**
 * Express route handlers for admin dashboard
 * Add these to your existing Express app
 */

// Middleware: Check authentication and role
function requireAuth(minRole = 'VERIFIER') {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    
    try {
      // Verify JWT and extract user info
      const user = verifyToken(token); // Your existing JWT verify function
      if (!user) return res.status(401).json({ error: 'Invalid token' });
      if (!canAccess(user.role, ROLES[minRole].level)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// GET /api/admin/stats/overview - Dashboard overview stats
app.get('/api/admin/stats/overview', requireAuth('ADMIN'), async (req, res) => {
  try {
    const [farmerStats, buyerStats, transactionStats] = await Promise.all([
      db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verified = true THEN 1 ELSE 0 END) as verified,
          SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as new_this_week
        FROM farmers
      `),
      db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verified = true THEN 1 ELSE 0 END) as verified,
          SUM(CASE WHEN buyer_type = 'school' THEN 1 ELSE 0 END) as schools,
          SUM(CASE WHEN buyer_type = 'hospital' THEN 1 ELSE 0 END) as hospitals,
          SUM(CASE WHEN buyer_type = 'restaurant' THEN 1 ELSE 0 END) as restaurants,
          SUM(CASE WHEN buyer_type = 'hotel' THEN 1 ELSE 0 END) as hotels,
          SUM(CASE WHEN buyer_type = 'company' THEN 1 ELSE 0 END) as companies
        FROM buyers
      `),
      db.query(`
        SELECT 
          COUNT(*) as total_transactions,
          COALESCE(SUM(amount), 0) as total_volume,
          COALESCE(SUM(commission), 0) as total_commission,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
        FROM transactions
      `)
    ]);

    res.json({
      farmers: farmerStats.rows[0],
      buyers: buyerStats.rows[0],
      transactions: transactionStats.rows[0],
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview stats' });
  }
});

// GET /api/admin/farmers - List farmers with filters
app.get('/api/admin/farmers', requireAuth('VERIFIER'), async (req, res) => {
  try {
    const { status, district, verified, search, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT 
        f.id, f.name, f.phone, f.email, f.district, f.created_at,
        f.verified, f.verified_at, f.verified_by,
        f.profile_photo_url, f.farm_size, f.farm_location,
        COUNT(p.id) as product_count,
        COALESCE(SUM(t.amount), 0) as total_sales
      FROM farmers f
      LEFT JOIN products p ON p.farmer_id = f.id
      LEFT JOIN transactions t ON t.seller_id = f.id AND t.status = 'completed'
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (status) {
      query += ` AND f.status = $${paramIdx++}`;
      params.push(status);
    }
    if (district) {
      query += ` AND f.district = $${paramIdx++}`;
      params.push(district);
    }
    if (verified !== undefined) {
      query += ` AND f.verified = $${paramIdx++}`;
      params.push(verified === 'true');
    }
    if (search) {
      query += ` AND (f.name ILIKE $${paramIdx} OR f.phone ILIKE $${paramIdx} OR f.email ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    query += ` GROUP BY f.id ORDER BY f.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);
    res.json({ farmers: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// GET /api/admin/buyers - List buyers with filters
app.get('/api/admin/buyers', requireAuth('VERIFIER'), async (req, res) => {
  try {
    const { buyer_type, verified, district, search, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT 
        b.id, b.buyer_type, b.organization_name, b.contact_name,
        b.email, b.phone, b.district, b.address, b.procurement_volume,
        b.verified, b.created_at,
        COALESCE(SUM(t.amount), 0) as total_purchases,
        COUNT(t.id) as order_count
      FROM buyers b
      LEFT JOIN transactions t ON t.buyer_id = b.id AND t.status = 'completed'
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (buyer_type) {
      query += ` AND b.buyer_type = $${paramIdx++}`;
      params.push(buyer_type);
    }
    if (verified !== undefined) {
      query += ` AND b.verified = $${paramIdx++}`;
      params.push(verified === 'true');
    }
    if (district) {
      query += ` AND b.district = $${paramIdx++}`;
      params.push(district);
    }
    if (search) {
      query += ` AND (b.contact_name ILIKE $${paramIdx} OR b.organization_name ILIKE $${paramIdx} OR b.email ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    query += ` GROUP BY b.id ORDER BY b.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);
    res.json({ buyers: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});

// POST /api/admin/farmers/:id/verify - Verify a farmer
app.post('/api/admin/farmers/:id/verify', requireAuth('VERIFIER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // decision: 'approve' | 'reject'
    
    const result = await db.query(`
      UPDATE farmers 
      SET verified = $1, 
          verified_at = NOW(), 
          verified_by = $2,
          verification_notes = $3,
          status = $4
      WHERE id = $5
      RETURNING id, name, verified, verified_at
    `, [decision === 'approve', req.user.id, notes, decision === 'approve' ? 'active' : 'rejected', id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    // Send SMS notification to farmer
    await sendSMS(result.rows[0].phone, 
      decision === 'approve' 
        ? `Your ShambaNi account has been verified! You can now list products and receive orders.`
        : `Your ShambaNi verification was not approved. Reason: ${notes}. Please update your information and reapply.`
    );

    // Log audit trail
    await db.query(`
      INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, details, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [`farmer_${decision}`, 'farmer', id, req.user.id, JSON.stringify({ notes, decision })]);

    res.json({ success: true, farmer: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/admin/buyers/:id/verify - Verify a buyer
app.post('/api/admin/buyers/:id/verify', requireAuth('VERIFIER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;
    
    const result = await db.query(`
      UPDATE buyers 
      SET verified = $1, verified_at = NOW(), verified_by = $2, verification_notes = $3
      WHERE id = $4
      RETURNING id, contact_name, email, verified
    `, [decision === 'approve', req.user.id, notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Send email notification
    await sendEmail(result.rows[0].email, 
      decision === 'approve' ? 'ShambaNi Account Verified' : 'ShambaNi Verification Update',
      decision === 'approve' 
        ? `Your buyer account on ShambaNi has been verified! You can now browse and order from verified farmers.`
        : `Your verification requires additional information: ${notes}`
    );

    res.json({ success: true, buyer: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// GET /api/admin/analytics/districts - District-level analytics
app.get('/api/admin/analytics/districts', requireAuth('ADMIN'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.district,
        COUNT(DISTINCT f.id) as farmer_count,
        COUNT(DISTINCT b.id) as buyer_count,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(t.amount), 0) as transaction_volume,
        COUNT(DISTINCT t.id) as transaction_count
      FROM (
        SELECT DISTINCT district FROM farmers
        UNION
        SELECT DISTINCT district FROM buyers
      ) districts
      LEFT JOIN farmers f ON f.district = districts.district
      LEFT JOIN buyers b ON b.district = districts.district
      LEFT JOIN products p ON p.farmer_id = f.id
      LEFT JOIN transactions t ON (t.seller_id = f.id OR t.buyer_id = b.id) AND t.status = 'completed'
      GROUP BY districts.district
      ORDER BY transaction_volume DESC
    `);

    res.json({ districts: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch district analytics' });
  }
});

// GET /api/admin/analytics/transactions - Transaction trends
app.get('/api/admin/analytics/transactions', requireAuth('ADMIN'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const interval = period === '7d' ? '1 day' : period === '90d' ? '1 week' : '1 day';
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;

    const result = await db.query(`
      SELECT 
        DATE_TRUNC($1, created_at) as date,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as volume,
        COALESCE(SUM(commission), 0) as commission
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE_TRUNC($1, created_at)
      ORDER BY date ASC
    `, [interval === '1 week' ? 'week' : 'day']);

    res.json({ trends: result.rows, period });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction trends' });
  }
});

// GET /api/admin/export/farmers - Export farmer data (CSV)
app.get('/api/admin/export/farmers', requireAuth('ADMIN'), async (req, res) => {
  try {
    const { district, verified } = req.query;
    
    let query = `
      SELECT 
        f.name, f.phone, f.email, f.district, f.farm_location, f.farm_size,
        f.verified, f.created_at, f.verified_at,
        COUNT(p.id) as products_listed
      FROM farmers f
      LEFT JOIN products p ON p.farmer_id = f.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (district) {
      query += ` AND f.district = $${paramIdx++}`;
      params.push(district);
    }
    if (verified !== undefined) {
      query += ` AND f.verified = $${paramIdx++}`;
      params.push(verified === 'true');
    }

    query += ` GROUP BY f.id ORDER BY f.created_at DESC`;

    const result = await db.query(query, params);
    
    // Generate CSV
    const csvHeader = 'Name,Phone,Email,District,Farm Location,Farm Size,Verified,Created At,Products Listed\n';
    const csvRows = result.rows.map(r => 
      `"${r.name}","${r.phone}","${r.email}","${r.district}","${r.farm_location || ''}","${r.farm_size || ''}","${r.verified}","${r.created_at}","${r.products_listed}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=farmers_export_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvHeader + csvRows);
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// ============================================
// 3. REACT ADMIN DASHBOARD COMPONENT
// ============================================

/**
 * Key admin dashboard components to add to your React frontend
 * 
 * Usage:
 *   import { AdminDashboard, FarmerVerificationQueue, BuyerManagement, DistrictAnalytics } from './admin-extensions';
 */

export const AdminDashboardStats = ({ stats }) => (
  <div className="admin-stats-grid">
    <div className="stat-card farmers">
      <div className="stat-icon">👨‍🌾</div>
      <div className="stat-value">{stats.farmers?.total || 0}</div>
      <div className="stat-label">Total Farmers</div>
      <div className="stat-sub">
        <span className="verified">{stats.farmers?.verified || 0} verified</span>
        <span className="new">+{stats.farmers?.new_this_week || 0} this week</span>
      </div>
    </div>
    <div className="stat-card buyers">
      <div className="stat-icon">🏢</div>
      <div className="stat-value">{stats.buyers?.total || 0}</div>
      <div className="stat-label">Total Buyers</div>
      <div className="stat-sub">
        <span>{stats.buyers?.schools || 0} schools</span>
        <span>{stats.buyers?.hospitals || 0} hospitals</span>
      </div>
    </div>
    <div className="stat-card transactions">
      <div className="stat-icon">💰</div>
      <div className="stat-value">UGX {(stats.transactions?.total_volume / 1000000 || 0).toFixed(1)}M</div>
      <div className="stat-label">Total Volume</div>
      <div className="stat-sub">
        <span>{stats.transactions?.total_transactions || 0} transactions</span>
      </div>
    </div>
    <div className="stat-card commission">
      <div className="stat-icon">📊</div>
      <div className="stat-value">UGX {(stats.transactions?.total_commission / 1000000 || 0).toFixed(1)}M</div>
      <div className="stat-label">Commission Revenue</div>
      <div className="stat-sub">
        <span>2.5% avg rate</span>
      </div>
    </div>
  </div>
);

export const VerificationQueue = ({ items, type, onVerify }) => (
  <div className="verification-queue">
    <h3>{type === 'farmer' ? '👨‍🌾 Farmer' : '🏢 Buyer'} Verification Queue</h3>
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>District</th>
          <th>Submitted</th>
          <th>ID Document</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>
              <strong>{item.name || item.contact_name}</strong>
              <br/><small>{item.phone}</small>
            </td>
            <td>{item.district}</td>
            <td>{new Date(item.created_at).toLocaleDateString()}</td>
            <td>
              <a href={item.id_document_url} target="_blank" rel="noopener" className="doc-link">
                View ID
              </a>
            </td>
            <td>
              <button className="btn-approve" onClick={() => onVerify(item.id, 'approve')}>
                ✓ Approve
              </button>
              <button className="btn-reject" onClick={() => onVerify(item.id, 'reject')}>
                ✗ Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================
// 4. AUDIT LOGGING
// ============================================

async function logAudit(action, entityType, entityId, userId, details = {}) {
  await db.query(`
    INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, details, ip_address, user_agent, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  `, [action, entityType, entityId, userId, JSON.stringify(details)]);
}

// ============================================
// 5. UTILITY FUNCTIONS
// ============================================

function verifyToken(token) {
  // Your existing JWT verification logic
  // Return: { id, email, role, name } or null
}

async function sendSMS(phone, message) {
  // Integrate with MTN/Airtel SMS API or Twilio
  console.log(`SMS to ${phone}: ${message}`);
}

async function sendEmail(to, subject, body) {
  // Integrate with SendGrid, Mailgun, or AWS SES
  console.log(`Email to ${to}: ${subject}`);
}

module.exports = {
  ROLES,
  hasPermission,
  canAccess,
  requireAuth,
  logAudit,
  AdminDashboardStats,
  VerificationQueue
};
