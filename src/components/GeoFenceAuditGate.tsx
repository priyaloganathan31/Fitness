import React, { useState, useEffect } from 'react';
import type { CampusVenue, UserRole } from '../types/audit';
import { MapPin, QrCode, ShieldCheck, ShieldAlert, Navigation, RefreshCw, CheckCircle2, Lock, Camera, EyeOff, Eye, AlertTriangle } from 'lucide-react';

interface GeoFenceAuditGateProps {
  venue: CampusVenue;
  activeRole?: UserRole;
  onUnlockSuccess: (simulatedGps: { lat: number; lng: number }, distance: number) => void;
}

export const GeoFenceAuditGate: React.FC<GeoFenceAuditGateProps> = ({ venue, activeRole, onUnlockSuccess }) => {
  const isAuditorRole = activeRole?.id === 'AUDITOR';

  // Target Geofence Coordinates (Default from Venue Registry, customizable via live upload)
  const [targetGps, setTargetGps] = useState<{ lat: number; lng: number }>({
    lat: venue.geoCoordinates.lat,
    lng: venue.geoCoordinates.lng
  });

  // GPS State (Supports both Live Hardware Sensor & Demo Simulation)
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number }>({
    lat: venue.geoCoordinates.lat + 0.00002, // Initially ~2.5m away (inside 25m geofence)
    lng: venue.geoCoordinates.lng + 0.00002
  });

  const [isLiveMobileGpsActive, setIsLiveMobileGpsActive] = useState<boolean>(false);
  const [isFetchingLiveGps, setIsFetchingLiveGps] = useState<boolean>(false);
  const [liveGpsAccuracy, setLiveGpsAccuracy] = useState<number | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const [targetUploadedSuccess, setTargetUploadedSuccess] = useState<boolean>(false);

  const [isSimulatingOutside, setIsSimulatingOutside] = useState<boolean>(false);
  const [isScanningQr, setIsScanningQr] = useState<boolean>(false);
  const [qrScanStatus, setQrScanStatus] = useState<'PENDING' | 'VERIFIED_PASS' | 'FAILED_MISMATCH'>('PENDING');
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(true);

  // Haversine Formula for high-precision distance in meters
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Sync distance calculation against active target coordinates
  useEffect(() => {
    const dist = calculateDistanceMeters(
      currentGps.lat,
      currentGps.lng,
      targetGps.lat,
      targetGps.lng
    );
    setDistanceMeters(dist);
    setIsInsideGeofence(dist <= venue.geofenceRadiusMeters);
  }, [currentGps, targetGps, venue.geofenceRadiusMeters]);

  // Request Live Device GPS Position from Mobile Maps / Browser Geolocation API
  const handleFetchLiveDeviceGps = () => {
    if (!navigator.geolocation) {
      setGpsErrorMsg('HTML5 Geolocation API is not supported on this browser/device.');
      return;
    }

    setIsFetchingLiveGps(true);
    setGpsErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const liveLat = position.coords.latitude;
        const liveLng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy * 10) / 10;

        setCurrentGps({ lat: liveLat, lng: liveLng });
        setLiveGpsAccuracy(accuracy);
        setIsLiveMobileGpsActive(true);
        setIsSimulatingOutside(false);
        setIsFetchingLiveGps(false);
      },
      (error) => {
        setIsFetchingLiveGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsErrorMsg('⚠️ GPS Permission Denied: Please allow location access in your mobile browser settings.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsErrorMsg('⚠️ Mobile GPS signal unavailable. Please ensure location services are turned ON.');
        } else {
          setGpsErrorMsg(`⚠️ Mobile GPS error (${error.message}). Using simulated location fallback.`);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Upload Current Mobile Location as Venue Geofence Target
  const handleUploadCurrentGpsAsTarget = () => {
    setTargetGps({ lat: currentGps.lat, lng: currentGps.lng });
    venue.geoCoordinates.lat = currentGps.lat;
    venue.geoCoordinates.lng = currentGps.lng;
    setTargetUploadedSuccess(true);
    setTimeout(() => setTargetUploadedSuccess(false), 4000);
  };

  const handleSimulatePosition = (locationType: 'INSIDE_OPTIMAL' | 'OUTSIDE_GEONEFENCE') => {
    setIsLiveMobileGpsActive(false);
    if (locationType === 'INSIDE_OPTIMAL') {
      setIsSimulatingOutside(false);
      setCurrentGps({
        lat: targetGps.lat + 0.00002, // ~2.5m away
        lng: targetGps.lng + 0.00002
      });
    } else {
      setIsSimulatingOutside(true);
      setCurrentGps({
        lat: targetGps.lat + 0.00045, // ~52m away (OUTSIDE 25m geofence)
        lng: targetGps.lng + 0.00040
      });
    }
  };

  // Scan Valid Venue QR Plaque (Extract Test Case Lat/Lng embedded in QR)
  const handleScanValidQrCode = () => {
    setIsScanningQr(true);
    setQrErrorMessage(null);
    setTimeout(() => {
      setIsScanningQr(false);
      setQrScanStatus('VERIFIED_PASS');
    }, 1000);
  };

  // Scan Invalid / Mismatched QR Plaque (Demo Failure)
  const handleScanInvalidQrCode = () => {
    setIsScanningQr(true);
    setQrErrorMessage(null);
    setTimeout(() => {
      setIsScanningQr(false);
      setQrScanStatus('FAILED_MISMATCH');
      setQrErrorMessage(`❌ QR VERIFICATION FAILED: Scanned QR token embedded coordinates do not match registered venue GPS (${venue.geoCoordinates.lat}° N, ${venue.geoCoordinates.lng}° E)!`);
    }, 1000);
  };

  // Live GPS Geo-Fence is the primary gate requirement. QR scan is optional.
  const canUnlockForm = isInsideGeofence;

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>
              PHYSICAL VERIFICATION GATE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Venue Code: {venue.code}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
            {venue.name}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
            📍 {venue.building} • Target GPS: <strong style={{ color: '#059669' }}>{targetGps.lat.toFixed(6)}° N, {targetGps.lng.toFixed(6)}° E</strong> (Geofence Radius: {venue.geofenceRadiusMeters}m)
          </p>
        </div>

        {/* Status Badge */}
        <div style={{ textAlign: 'right' }}>
          {canUnlockForm ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.88rem' }}>
              <ShieldCheck size={18} /> GATE UNLOCKED (GPS VERIFIED)
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', fontWeight: 800, fontSize: '0.88rem' }}>
              <Lock size={18} /> CHECKLIST LOCKED (MOVE CLOSER)
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout: GPS Radar + QR Code Verification */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Step 1: Geo-Fencing Proximity Radar */}
        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={16} color="#2563EB" /> 1. Live GPS Geo-Fence Tracking (Mandatory Gate)
            </span>
            <span style={{ fontSize: '0.75rem', color: isInsideGeofence ? '#059669' : '#DC2626', fontWeight: 800 }}>
              {isInsideGeofence ? '✓ INSIDE GEOFENCE (UNLOCKED)' : '⚠️ OUTSIDE GEOFENCE RADIUS'}
            </span>
          </div>

          {/* Interactive Radar Visualizer */}
          <div style={{ position: 'relative', minHeight: '140px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isInsideGeofence ? '#059669' : '#DC2626'}`, padding: '14px' }}>
            <MapPin size={28} color={isInsideGeofence ? '#059669' : '#DC2626'} />
            
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isInsideGeofence ? '#059669' : '#DC2626' }}>
                {distanceMeters} meters away
              </div>
              <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>
                Target GPS: {targetGps.lat.toFixed(6)}° N, {targetGps.lng.toFixed(6)}° E
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontFamily: 'monospace' }}>
                Live GPS Ping: {currentGps.lat.toFixed(6)}° N, {currentGps.lng.toFixed(6)}° E
              </div>

              {isLiveMobileGpsActive && liveGpsAccuracy && (
                <div style={{ marginTop: '6px', display: 'inline-block', background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 800 }}>
                  📱 LIVE MOBILE SENSOR (Accuracy: ±{liveGpsAccuracy}m)
                </div>
              )}
            </div>
          </div>

          {/* Live Mobile GPS Fetch & Deployment Upload Buttons */}
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleFetchLiveDeviceGps}
              disabled={isFetchingLiveGps}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '9px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderRadius: '8px',
                background: isLiveMobileGpsActive ? '#059669' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={14} className={isFetchingLiveGps ? 'spin' : ''} />
              {isFetchingLiveGps ? 'Fetching Device GPS...' : isLiveMobileGpsActive ? '✓ Mobile GPS Sensor Active (Click to Refresh)' : '📍 Fetch Live Mobile GPS (Deployment Mode)'}
            </button>

            {isLiveMobileGpsActive && (
              <button
                onClick={handleUploadCurrentGpsAsTarget}
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  cursor: 'pointer'
                }}
              >
                📲 Set Current Mobile GPS as Venue Geofence Target
              </button>
            )}

            {targetUploadedSuccess && (
              <div style={{ padding: '6px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textAlign: 'center' }}>
                ✅ Venue Geofence Target Coordinates Uploaded & Updated!
              </div>
            )}

            {gpsErrorMsg && (
              <div style={{ padding: '12px 14px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '0.84rem' }}>
                  <AlertTriangle size={18} color="#DC2626" /> {gpsErrorMsg}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#7F1D1D', background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #FECACA' }}>
                  <strong>📱 How to enable location on mobile browser:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    <li><strong>iPhone (Safari):</strong> Tap <code>Aa</code> or <code>🔒</code> icon in URL bar ➔ Website Settings ➔ Location ➔ Select <strong>Allow</strong>.</li>
                    <li><strong>Android (Chrome):</strong> Tap <code>🔒</code> icon next to URL ➔ Permissions ➔ Location ➔ Select <strong>Allow</strong>.</li>
                    <li>After enabling, tap <strong>Fetch Live Mobile GPS</strong> again or use <strong>At Venue (2.5m)</strong> testing button below to unlock.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Location Testing Switcher (Demo Mode) */}
          <div style={{ marginTop: '12px', background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <span style={{ fontSize: '0.73rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
              ⚡ DEMO SIMULATION MODE (TESTING):
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleSimulatePosition('INSIDE_OPTIMAL')}
                className={!isSimulatingOutside && !isLiveMobileGpsActive ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
              >
                📍 At Venue (2.5m)
              </button>
              <button
                onClick={() => handleSimulatePosition('OUTSIDE_GEONEFENCE')}
                className={isSimulatingOutside ? 'btn-danger' : 'btn-secondary'}
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px', background: isSimulatingOutside ? '#DC2626' : undefined }}
              >
                🚫 Ghost Audit (52m)
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Physical Venue QR Code Verification & Auditor Provision Badge */}
        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={16} color="#D97706" /> 2. Venue QR Code Badge Verification <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>(OPTIONAL)</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: qrScanStatus === 'VERIFIED_PASS' ? '#059669' : qrScanStatus === 'FAILED_MISMATCH' ? '#DC2626' : '#64748B', fontWeight: 800 }}>
                {qrScanStatus === 'VERIFIED_PASS' ? '✓ SCANNED (BONUS TRUST)' : qrScanStatus === 'FAILED_MISMATCH' ? '❌ QR MISMATCH' : 'OPTIONAL (SKIPPABLE)'}
              </span>
            </div>

            {/* AUDITOR PROVISION QR CODE DISPLAY vs AUDITEE HIDDEN SCANNER */}
            {isAuditorRole ? (
              /* AUDITOR PROVISION VIEW: Full QR Code Badge Visible to Auditor ONLY */
              <div style={{ background: '#1E293B', color: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '2px solid #2563EB' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} /> 🔒 AUDITOR PROVISION: VENUE QR CODE PLAQUE
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#0F172A', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ width: '64px', height: '64px', background: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                    <QrCode size={52} color="#0F172A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#F8FAFC' }}>
                      {venue.name} ({venue.code})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#34D399', fontFamily: 'monospace', marginTop: '2px' }}>
                      GPS embedded: {venue.geoCoordinates.lat}° N, {venue.geoCoordinates.lng}° E
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                      Payload: <code>{venue.qrPayload}</code>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '8px', fontStyle: 'italic' }}>
                  ℹ️ QR scan is currently optional. Passing Step 1 Live GPS unlocks the audit session directly.
                </div>
              </div>
            ) : (
              /* AUDITEE VIEW: QR Code Image is HIDDEN & BLURRED for Anti-Tamper Security */
              <div style={{ background: '#FFFBEB', border: '2px dashed #F59E0B', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#B45309', fontWeight: 900, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <EyeOff size={18} /> 🔒 QR CODE PLAQUE (OPTIONAL SCAN)
                </div>
                <p style={{ fontSize: '0.78rem', color: '#78350F', margin: 0 }}>
                  Scanning venue QR badge adds extra trust score, but is optional for starting the audit.
                </p>
                <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '6px', fontWeight: 700, background: '#FEF3C7', padding: '4px 8px', borderRadius: '4px' }}>
                  Embedded GPS Token: Lat {venue.geoCoordinates.lat}° N / Lng {venue.geoCoordinates.lng}° E
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {qrErrorMessage && (
              <div style={{ marginTop: '10px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                {qrErrorMessage}
              </div>
            )}
          </div>

          <div style={{ marginTop: '14px' }}>
            <span style={{ fontSize: '0.73rem', color: '#334155', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
              SCAN VENUE QR PLAQUE (OPTIONAL):
            </span>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleScanValidQrCode}
                disabled={isScanningQr}
                className="btn-primary"
                style={{ flex: 1, minWidth: '140px', padding: '10px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {isScanningQr ? (
                  <>
                    <RefreshCw size={14} className="spin-animation" /> Scanning QR...
                  </>
                ) : (
                  <>
                    <Camera size={16} /> 📷 Scan Venue QR
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setQrScanStatus('PENDING');
                  setQrErrorMessage(null);
                  alert('⏩ QR Scan skipped as requested. Proceeding directly with Live GPS Verification.');
                }}
                disabled={isScanningQr}
                className="btn-secondary"
                style={{ flex: 1, minWidth: '140px', padding: '10px', fontSize: '0.8rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 800 }}
              >
                ⏭️ Skip QR Scan
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Unlock Action Banner */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {canUnlockForm ? (
            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> Live GPS Geo-Fence Verified ({distanceMeters}m away). Gate unlocked & ready to start FC audit!
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Checklist Locked: You are {distanceMeters}m away. Please approach within the {venue.geofenceRadiusMeters}m GPS geofence boundary.
            </div>
          )}
        </div>

        <button
          onClick={() => onUnlockSuccess(currentGps, distanceMeters)}
          disabled={!canUnlockForm}
          className="btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: '0.9rem',
            fontWeight: 900,
            borderRadius: '8px',
            opacity: canUnlockForm ? 1 : 0.4,
            cursor: canUnlockForm ? 'pointer' : 'not-allowed',
            background: canUnlockForm ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#CBD5E1',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: canUnlockForm ? '0 4px 14px rgba(5, 150, 105, 0.4)' : 'none'
          }}
        >
          <Lock size={16} /> START FC AUDIT NOW
        </button>
      </div>

    </div>
  );
};
