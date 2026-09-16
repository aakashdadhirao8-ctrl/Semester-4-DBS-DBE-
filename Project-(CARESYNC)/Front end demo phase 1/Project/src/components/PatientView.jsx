import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, ShieldAlert, Activity, Eye, Apple, Pill } from 'lucide-react';
import RenderCharts from './Charts';

export default function PatientView({ patient, onUpdatePatients, allPatients }) {
  const [consented, setConsented] = useState(false);

  // Sync state if it updates externally
  useEffect(() => {
    if (patient) setConsented(!!patient.patientConsentedDischarge);
  }, [patient]);

  if (!patient) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Patient Profile...</div>;

  const handlePatientSelfDischarge = () => {
    setConsented(true);
    
    const updatedRegistry = allPatients.map(p => {
      if (p.id === patient.id) {
        return { 
          ...p, 
          patientConsentedDischarge: true,
          status: "Fully Discharged" 
        };
      }
      return p;
    });
    
    onUpdatePatients(updatedRegistry);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* PATIENT HEADER - UPDATED STATUS BAR */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{patient.name}</h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{patient.age} yrs • {patient.gender} • ID: {patient.id}</span>
        </div>
        
        {/* Unmissable Status Badge Logic */}
        <div style={{ background: consented ? '#dcfce7' : '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700, border: consented ? '1px solid #bbf7d0' : 'none' }}>
          <span style={{ color: consented ? '#16a34a' : '#334155' }}>
            {consented ? '✅ FULLY DISCHARGED' : `Status: ${patient.status}`}
          </span>
        </div>
      </div>

      {/* DISCHARGE HANDSHAKE INTERFACE TICKET */}
      {patient.readyToDischarge ? (
        <div style={{ background: consented ? '#f0fdf4' : '#fff7ed', border: consented ? '1px solid #bbf7d0' : '1px solid #fed7aa', padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={28} color={consented ? "#16a34a" : "#ea580c"} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: consented ? '#14532d' : '#9a3412' }}>Your Discharge Papers are Ready!</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: consented ? '#15803d' : '#c2410c', fontWeight: 500 }}>
                {consented ? "Authorization signed. You are cleared to leave the facility." : "Your physician has cleared you. Review your file and click below to execute checkout consent."}
              </p>
            </div>
          </div>
          
          {!consented ? (
            <button
              onClick={handlePatientSelfDischarge}
              style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(22,163,74,0.2)' }}
            >
              EXECUTE DISCHARGE CONSENT
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', fontWeight: 700, fontSize: '0.85rem', background: '#bbf7d0', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
              <CheckCircle size={16} /> CHECKED OUT
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem 1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
          <ShieldAlert size={16} color="#94a3b8" /> Regular Ward Status: Complete recovery tracking checkpoints to unlock departure processing authorizations.
        </div>
      )}

      {/* CHARTS CONTAINER */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '1rem' }}>
        <RenderCharts vitals={patient.vitals} diet={patient.diet} />
      </div>

      {/* CLINICAL DATA SPLIT VIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* MEDICAL & DIET PLAN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Medications */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '1rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              <Pill size={16} color="#8b5cf6" /> Active Prescriptions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {patient.medications && patient.medications.length > 0 ? patient.medications.map((med, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{med.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{med.dosage}</div>
                </div>
              )) : (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No active medications.</div>
              )}
            </div>
          </div>

          {/* Diet Plan */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '1rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              <Apple size={16} color="#0d9488" /> Prescribed Macros
            </h4>
            <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{patient.diet?.carbs}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Carbs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{patient.diet?.protein}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Protein</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{patient.diet?.fats}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fats</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{patient.diet?.fiber}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fiber</div>
              </div>
            </div>
          </div>
        </div>

        {/* LABS & RADIOLOGY VAULT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '1rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              <Activity size={16} color="#2563eb" /> Blood Lab Results
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {patient.bloodTests && Object.entries(patient.bloodTests).map(([test, result]) => (
                <div key={test} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}>{test}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>{result}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              <Eye size={16} color="#0d9488" /> Imaging & Scans
            </h4>
            <div style={{ flex: 1, background: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569', lineHeight: 1.45 }}>
              <span style={{ display: 'block', fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Type: {patient.radiology?.modality || "Pending Scan"}</span>
              {patient.radiology?.findings}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}