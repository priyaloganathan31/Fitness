import React, { useState } from 'react';
import type { CampusVenue } from '../types/audit';
import { QrCode, Search, Download, Play, Plus, MapPin, X } from 'lucide-react';

interface LocationRegistryManagerProps {
  venues: CampusVenue[];
  onSelectVenueForAudit: (venue: CampusVenue) => void;
  onAddVenue?: (venue: CampusVenue) => void;
}

export const LocationRegistryManager: React.FC<LocationRegistryManagerProps> = ({
  venues,
  onSelectVenueForAudit,
  onAddVenue
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedQrVenue, setSelectedQrVenue] = useState<CampusVenue | null>(null);

  // New Venue Modal Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CampusVenue['category']>('Academic Buildings');
  const [newBuilding, setNewBuilding] = useState<string>('');
  const [newLat, setNewLat] = useState<number>(11.493954);
  const [newLng, setNewLng] = useState<number>(77.274503);
  const [newAuditor, setNewAuditor] = useState<string>('Prof. Auditor Incharge');
  const [newAuditee, setNewAuditee] = useState<string>('Department Facility Incharge');

  const filteredVenues = venues.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNewVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const padId = String(venues.length + 1).padStart(2, '0');
    const created: CampusVenue = {
      id: `FC-LOC-${padId}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      category: newCategory,
      building: newBuilding.trim() || 'Campus Main Sector',
      geoCoordinates: { lat: Number(newLat), lng: Number(newLng) },
      geofenceRadiusMeters: 20,
      qrPayload: `QR-FC-${newCode.trim().toUpperCase()}-SECURE-${newLat}-${newLng}`,
      assignedAuditor: newAuditor.trim(),
      assignedAuditee: newAuditee.trim(),
      scheduleFrequencyDays: 15,
      lastAuditDate: new Date().toISOString().split('T')[0],
      nextAuditDueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'SCHEDULED',
      activeTemplateId: newCategory === 'Media & Broadcasting' ? 'TMPL-BIT-FM-10' : 'TMPL-BIT-MED-24',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      totalCheckpoints: newCategory === 'Media & Broadcasting' ? 10 : 24
    };

    if (onAddVenue) {
      onAddVenue(created);
    }
    setShowAddModal(false);
    setNewName('');
    setNewCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
            CAMPUS AUDIT LOCATIONS REGISTRY
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
            Active Campus Fitness Certificate Venues
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
            Live GPS coordinates, 20m geo-fencing, QR code badge generator, and provision for adding new department audits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', color: '#065F46', fontWeight: 800 }}>
            🏥 <strong>Medical Center</strong> & 📻 <strong>FM Radio Station</strong>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={18} />
            <span>Add New Audit Venue</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, code (e.g. MED-CTR-01, CS-102)..."
            style={{ width: '100%', background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px 14px 10px 42px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}
          />
        </div>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
        >
          <option value="ALL">All 56 Campus Categories</option>
          <option value="Medical Facilities">Medical Facilities</option>
          <option value="Laboratories">Laboratories</option>
          <option value="Hostels & Residential">Hostels & Residential</option>
          <option value="Sports & Gymnasium">Sports & Gymnasium</option>
          <option value="Dining & Food Services">Dining & Food Services</option>
          <option value="Academic Buildings">Academic Buildings</option>
        </select>
      </div>

      {/* Venues Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredVenues.map(venue => {
          const isMedicalCenter = venue.id === 'FC-LOC-01';

          return (
            <div
              key={venue.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '14px',
                background: isMedicalCenter ? '#EFF6FF' : '#FFFFFF',
                border: isMedicalCenter ? '2px solid #2563EB' : '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                position: 'relative'
              }}
            >
              {isMedicalCenter && (
                <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#2563EB', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 900, padding: '2px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  PILOT SAMPLE LOCATION #1
                </span>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8', background: '#DBEAFE', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {venue.code}
                  </span>

                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: venue.status === 'PASSED_SELF_APPROVED' ? '#D1FAE5' : venue.status === 'IN_PROGRESS' ? '#DBEAFE' : '#FEF3C7', color: venue.status === 'PASSED_SELF_APPROVED' ? '#065F46' : venue.status === 'IN_PROGRESS' ? '#1E40AF' : '#92400E' }}>
                    {venue.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
                  {venue.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                  📍 {venue.building}
                </p>

                {/* Geo-Coordinates Box */}
                <div style={{ marginTop: '12px', background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Geo Coordinates:</span>
                    <strong style={{ color: '#2563EB', fontFamily: 'monospace' }}>
                      {venue.geoCoordinates.lat.toFixed(6)}° N, {venue.geoCoordinates.lng.toFixed(6)}° E
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>Geo-Fence Radius:</span>
                    <strong style={{ color: '#D97706' }}>{venue.geofenceRadiusMeters} meters</strong>
                  </div>

                  {/* Mobile Upload Target Action */}
                  <button
                    onClick={() => {
                      if (!navigator.geolocation) {
                        alert('HTML5 Geolocation API not supported on this device browser.');
                        return;
                      }
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          venue.geoCoordinates.lat = pos.coords.latitude;
                          venue.geoCoordinates.lng = pos.coords.longitude;
                          alert(`✅ Updated ${venue.name} target GPS to Live Mobile Location: ${pos.coords.latitude.toFixed(6)}° N, ${pos.coords.longitude.toFixed(6)}° E`);
                          setSearchQuery(searchQuery); // force re-render
                        },
                        (err) => alert(`GPS Error: ${err.message}`)
                      );
                    }}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '5px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#1D4ED8',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📍 Upload Live Mobile GPS as Target Location
                  </button>
                </div>

                {/* Scheduling & Auditor Details */}
                <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Auditor: <strong style={{ color: '#0F172A' }}>{venue.assignedAuditor}</strong></div>
                  <div>Auditee: <strong style={{ color: '#0F172A' }}>{venue.assignedAuditee}</strong></div>
                  <div>Frequency: <strong style={{ color: '#2563EB' }}>Every {venue.scheduleFrequencyDays} Days</strong> • Due: <strong style={{ color: '#D97706' }}>{venue.nextAuditDueDate}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                <button
                  onClick={() => setSelectedQrVenue(venue)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <QrCode size={14} /> Printable QR Badge
                </button>

                <button
                  onClick={() => onSelectVenueForAudit(venue)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: isMedicalCenter ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : undefined }}
                >
                  <Play size={14} /> Start Audit Gate
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Printable QR Code Badge Modal */}
      {selectedQrVenue && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', letterSpacing: '1px', textTransform: 'uppercase' }}>
              OFFICIAL COLLEGE INFRASTRUCTURE QR PLAQUE
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
              {selectedQrVenue.name}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Code: {selectedQrVenue.code} • Geo-Fence Radius: {selectedQrVenue.geofenceRadiusMeters}m
            </p>

            {/* QR Simulation Box */}
            <div style={{ margin: '20px auto', width: '180px', height: '180px', background: '#0F172A', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <QrCode size={150} color="#FFFFFF" />
            </div>

            <div style={{ fontSize: '0.72rem', color: '#334155', fontFamily: 'monospace', background: '#F8FAFC', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 700 }}>
              Payload: {selectedQrVenue.qrPayload}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedQrVenue(null)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Close</button>
              <button onClick={() => alert('Downloading official QR badge PDF for physical plaque printing...')} className="btn-primary" style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Download size={16} /> Download QR Plaque
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Audit Venue / Department Header Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Add New Audit Venue</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Create custom department / venue header for FC audits</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewVenue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Venue Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Central Library Auditorium / Civil Testing Lab"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Venue Code *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. LIB-AUD-01"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Category Header</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CampusVenue['category'])}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="Academic Buildings">Academic Buildings</option>
                    <option value="Medical Facilities">Medical Facilities</option>
                    <option value="Media & Broadcasting">Media & Broadcasting</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Hostels & Residential">Hostels & Residential</option>
                    <option value="Dining & Food Services">Dining & Food Services</option>
                    <option value="Sports & Gymnasium">Sports & Gymnasium</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Utility & Infrastructure">Utility & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Building & Floor Location</label>
                <input
                  type="text"
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
                  placeholder="e.g. Tagore Block, 2nd Floor"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newLat}
                    onChange={(e) => setNewLat(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newLng}
                    onChange={(e) => setNewLng(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Assigned Auditor</label>
                  <input
                    type="text"
                    value={newAuditor}
                    onChange={(e) => setNewAuditor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Facility Auditee</label>
                  <input
                    type="text"
                    value={newAuditee}
                    onChange={(e) => setNewAuditee(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Save Audit Venue
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
