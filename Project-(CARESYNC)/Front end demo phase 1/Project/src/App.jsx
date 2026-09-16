import React, { useState, useEffect } from 'react';
import DoctorConsole from './components/DoctorConsole';
import PatientView from './components/PatientView';
import { DatabaseZap, ShieldAlert, User, Lock, LogOut, Building2, HeartHandshake, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [userRole, setUserRole] = useState('guest'); 
  const [guestView, setGuestView] = useState('home'); // 'home' or 'login'
  const [loginTab, setLoginTab] = useState('doctor'); 
  const [patientLoginId, setPatientLoginId] = useState('');
  const [doctorPasscode, setDoctorPasscode] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [serverStatus, setServerStatus] = useState('Connecting...');

  // Fetch live data from local backend server
  useEffect(() => {
    fetch('http://localhost:3001/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setServerStatus('Connected to Local JSON');
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(err => {
        console.error("Server offline:", err);
        setServerStatus('Server Offline - Run node server.js');
      });
  }, []);

  // Direct JSON File Auto-Save Sync Engine
  const syncToJSONFile = (updatedPatients) => {
    setPatients(updatedPatients);
    fetch('http://localhost:3001/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPatients)
    }).catch(err => console.error("Failed to write to JSON file:", err));
  };

  const handleDoctorLogin = (e) => {
    e.preventDefault();
    if (doctorPasscode === '1234') {
      setUserRole('doctor');
      setLoginError('');
      setDoctorPasscode('');
    } else {
      setLoginError('Invalid Authorization Passcode.');
    }
  };

  const handlePatientLogin = (e) => {
    e.preventDefault();
    const matched = patients.find(p => p.id.toUpperCase() === patientLoginId.trim().toUpperCase());
    if (matched) {
      setSelectedId(matched.id);
      setUserRole('patient');
      setLoginError('');
      setPatientLoginId('');
    } else {
      setLoginError('Admission ID not recognized in database.');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setGuestView('home');
    setLoginError('');
  };

  // CRITICAL PROTECTION LAYER: Protects against uninitialized or empty data arrays on startup
  const activePatient = patients.find(p => p.id === selectedId) || patients[0] || {
    id: '',
    name: 'Syncing Clinical Registry...',
    vitals: { days: [], bpm: [], systolicBP: [], diastolicBP: [], spo2: [] },
    diet: { carbs: 0, protein: 0, fats: 0, fiber: 0 },
    medications: [],
    bloodTests: {},
    radiology: {}
  };

  // --- PUBLIC GUEST HUB (HOME & LOGIN) ---
  if (userRole === 'guest') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP ENTERPRISE NAVBAR */}
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => setGuestView('home')}>
            <div style={{ background: 'linear-gradient(135deg, #0d9488, #115e59)', color: '#ffffff', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Building2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f766e', letterSpacing: '-0.02em' }}>St. Jude Alpha</span>
              <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748b', fontWeight: 600, marginTop: '-2px' }}>Medical Center</span>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={() => setGuestView('home')} style={{ background: 'none', border: 'none', color: guestView === 'home' ? '#0f766e' : '#64748b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Home</button>
            <button onClick={() => setGuestView('login')} style={{ background: '#0f766e', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: '0.2s' }}>
              Secure Portal Login <ArrowRight size={14} />
            </button>
          </nav>
        </header>

        {/* 1. INTERACTIVE MEDICAL CENTER HOME PAGE VIEW */}
        {guestView === 'home' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* HERO CINEMATIC SECTION */}
            <section style={{ 
              position: 'relative', 
              background: 'linear-gradient(rgba(15, 118, 110, 0.88), rgba(17, 94, 89, 0.95)), url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80")', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              color: '#ffffff', 
              padding: '5rem 2rem', 
              textAlign: 'center' 
            }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Next-Gen Clinical Environment</span>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '1rem 0', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Precision Healthcare Met with Advanced Telemetry Tracking</h1>
                <p style={{ fontSize: '1.05rem', color: '#ccfbf1', lineHeight: 1.6, margin: '0 0 2rem 0', opacity: 0.95 }}>Welcome to St. Jude Alpha's digital registry workspace. We provide world-class emergency operations, localized critical diagnostic tracking, and real-time electronic telemetry data exchange for outpatients.</p>
                <button onClick={() => setGuestView('login')} style={{ background: '#ffffff', color: '#0f766e', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  Access Clinical Records Portal
                </button>
              </div>
            </section>

            {/* LIVE SYSTEM STATE & STATS TICKER */}
            <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 2rem' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700 }}>
                  <DatabaseZap size={14} /> {serverStatus}
                </div>
                <div style={{ display: 'flex', gap: '3rem' }}>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f766e', display: 'block' }}>99.98%</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Uptime Clinical Engine</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f766e', display: 'block' }}>14,500+</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Discharges Generated</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f766e', display: 'block' }}>ISO-27001</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Encrypted Framework</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CLINICAL CORE VALUES & PICTURE CARDS */}
            <section style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 2rem', width: '100%', boxSizing: 'border-box' }}>
              <h2 style={{ textAlign: 'center', color: '#1e293b', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 2.5rem 0' }}>Comprehensive Integrated Medical Ecosystems</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                {/* CARD 1: DOCTORS OPERATIONS */}
                <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80" alt="Physicians Council" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f766e', marginBottom: '0.5rem' }}>
                      <Stethoscope size={16} />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Physician Command consoles</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>Our specialized ward environment provides managing consultants full override control to modify patient records, map shift telemetry timelines, alter dynamic pharmacy arrays, and append laboratory evaluations seamlessly.</p>
                  </div>
                </div>

                {/* CARD 2: PATIENT ENGAGEMENT */}
                <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80" alt="Patient Monitoring" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f766e', marginBottom: '0.5rem' }}>
                      <HeartHandshake size={16} />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Empowered Patient Transparency</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>Patients are given complete access to review continuous cardiovascular indicators, physiological timeline metrics, historical radiology reports, macro nutritional structures, and custom printing portals.</p>
                  </div>
                </div>

                {/* CARD 3: DATA INTEGRITY */}
                <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80" alt="Data Core Server" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f766e', marginBottom: '0.5rem' }}>
                      <ShieldCheck size={16} />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Direct Automated File Syncing</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>Eliminate manual client file migration entirely. Every change made across clinical interfaces runs through our local Node server layer, modifying core database profiles immediately on disk.</p>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* 2. ENHANCED SECURE SECURE LOGIN GATEWAY VIEW */}
        {guestView === 'login' && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #e2e8f0 100%)' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: '#ffffff', borderRadius: '1.25rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden', border: '1px solid #e4e4e7' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #0f766e, #115e59)', padding: '2.25rem 1.5rem', textAlign: 'center', color: '#ffffff' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Clinical Network Gateway</h1>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: '#ccfbf1', opacity: 0.9 }}>Identity Verification Protocol Required</p>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
                <button 
                  onClick={() => { setLoginTab('doctor'); setLoginError(''); }}
                  style={{ flex: 1, padding: '1.1rem', border: 'none', background: loginTab === 'doctor' ? '#ffffff' : 'transparent', color: loginTab === 'doctor' ? '#0f766e' : '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', borderBottom: loginTab === 'doctor' ? '2.5px solid #0f766e' : '2.5px solid transparent' }}
                >
                  Medical Consultant
                </button>
                <button 
                  onClick={() => { setLoginTab('patient'); setLoginError(''); }}
                  style={{ flex: 1, padding: '1.1rem', border: 'none', background: loginTab === 'patient' ? '#ffffff' : 'transparent', color: loginTab === 'patient' ? '#0f766e' : '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', borderBottom: loginTab === 'patient' ? '2.5px solid #0f766e' : '2.5px solid transparent' }}
                >
                  Patient Outpatient
                </button>
              </div>

              {/* Form Payload Entry Fields */}
              <div style={{ padding: '2.25rem 1.75rem' }}>
                {loginError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '0.85rem', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                    <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                    <span>{loginError}</span>
                  </div>
                )}

                {loginTab === 'doctor' ? (
                  <form onSubmit={handleDoctorLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Security Authorization Token</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                        <input 
                          type="password" 
                          placeholder="Provide token code (1234)" 
                          value={doctorPasscode} 
                          onChange={e => setDoctorPasscode(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', transition: '0.2s' }}
                        />
                      </div>
                    </div>
                    <button type="submit" style={{ background: '#0f766e', color: '#ffffff', padding: '0.8rem', borderRadius: '0.5rem', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13,148,136,0.2)' }}>
                      Unlock Medical Desk Terminal
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePatientLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Electronic Chart ID Number</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <User size={16} style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8' }} />
                        <input 
                          type="text" 
                          placeholder="e.g., ADM-XXXXX" 
                          value={patientLoginId} 
                          onChange={e => setPatientLoginId(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', transition: '0.2s' }}
                        />
                      </div>
                    </div>
                    <button type="submit" style={{ background: '#0f766e', color: '#ffffff', padding: '0.8rem', borderRadius: '0.5rem', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(13,148,136,0.2)' }}>
                      Verify Database Identity
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PRIVATE REGISTERED INTERNAL SYSTEM WORKSPACE (DOCTOR OR PATIENT) ---
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Universal Workspace Header Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 1.75rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f766e, #115e59)', color: '#ffffff', padding: '0.55rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <DatabaseZap size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.01em' }}>MediDocs Central Core</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              Session Privileges: <span style={{ color: '#0d9488', fontWeight: 800, textTransform: 'uppercase' }}>{userRole} environment</span>
            </p>
          </div>
        </div>
        
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.55rem 1.15rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}>
          <LogOut size={14} /> Clear Secure Session
        </button>
      </div>

      {/* Primary Container Distribution Mapping */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {userRole === 'doctor' ? (
          <DoctorConsole 
            patients={patients} 
            selectedId={selectedId} 
            onSelectId={setSelectedId} 
            onUpdatePatients={syncToJSONFile} 
          />
        ) : (
          <PatientView 
    patient={activePatient} 
    onUpdatePatients={syncToJSONFile} 
    allPatients={patients} 
  />
        )}
      </div>
    </div>
  );
}