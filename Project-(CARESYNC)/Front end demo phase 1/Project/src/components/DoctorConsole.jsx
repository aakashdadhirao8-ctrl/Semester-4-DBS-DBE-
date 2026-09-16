import React, { useState, useEffect } from 'react';
import { User, Save, Apple, Users, Pill, FileText, Plus, Trash2, ShieldAlert, Award, Activity, UserPlus } from 'lucide-react';
import RenderCharts from './Charts';

export default function DoctorConsole({ patients = [], selectedId, onSelectId, onUpdatePatients }) {
  const activePatient = patients.find(p => p.id === selectedId) || patients[0];

  // Core Demographics
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notesText, setNotesText] = useState('');
  const [readyToDischarge, setReadyToDischarge] = useState(false);
  
  // Diet & Meds
  const [carbs, setCarbs] = useState(40);
  const [protein, setProtein] = useState(30);
  const [fats, setFats] = useState(20);
  const [fiber, setFiber] = useState(10);
  const [medications, setMedications] = useState([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  
  // Vitals State
  const [vitals, setVitals] = useState({ days: [], bpm: [], systolicBP: [], diastolicBP: [], spo2: [] });
  const [newDay, setNewDay] = useState('');
  const [newBpm, setNewBpm] = useState('');
  const [newSys, setNewSys] = useState('');
  const [newDia, setNewDia] = useState('');
  const [newSpo2, setNewSpo2] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state ONLY when switching patients
  useEffect(() => {
    const current = patients.find(p => p.id === selectedId) || patients[0];
    if (current) {
      setName(current.name || '');
      setAge(current.age || '');
      setGender(current.gender || '');
      setStatus(current.status || '');
      setDischargeDate(current.dischargeDate || '');
      setDiagnosis(current.diagnosis || '');
      setNotesText(current.notes || '');
      setMedications(current.medications || []);
      setReadyToDischarge(!!current.readyToDischarge);
      setCarbs(current.diet?.carbs || 40);
      setProtein(current.diet?.protein || 30);
      setFats(current.diet?.fats || 20);
      setFiber(current.diet?.fiber || 10);
      setVitals(current.vitals || { days: [], bpm: [], systolicBP: [], diastolicBP: [], spo2: [] });
      setSaveSuccess(false);
    }
  }, [selectedId]);

  if (!activePatient) return <div style={{ padding: '2rem', textAlign: 'center' }}>Syncing Clinical Registry Core...</div>;

  const totalMacroSum = Number(carbs) + Number(protein) + Number(fats) + Number(fiber);
  const isBudgetValid = totalMacroSum === 100;

  const handleAddVital = () => {
    if (!newDay) return alert("Please enter a Day/Time label (e.g., 'Day 3' or '14:00')");
    setVitals(prev => ({
      days: [...prev.days, newDay],
      bpm: [...prev.bpm, Number(newBpm) || 0],
      systolicBP: [...prev.systolicBP, Number(newSys) || 0],
      diastolicBP: [...prev.diastolicBP, Number(newDia) || 0],
      spo2: [...prev.spo2, Number(newSpo2) || 0]
    }));
    setNewDay(''); setNewBpm(''); setNewSys(''); setNewDia(''); setNewSpo2('');
  };

  const handleAddNewPatient = () => {
    const newId = `ADM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPatient = {
      id: newId,
      name: "New Admission",
      age: 0,
      gender: "Unspecified",
      dischargeDate: "TBD",
      status: "Admitted / Evaluating",
      diagnosis: "Pending Diagnostics",
      readyToDischarge: false,
      patientConsentedDischarge: false,
      medications: [],
      notes: "",
      vitals: { days: ["Admit"], bpm: [80], systolicBP: [120], diastolicBP: [80], spo2: [98] },
      diet: { carbs: 40, protein: 30, fats: 20, fiber: 10 },
      bloodTests: { "WBC": "Pending", "RBC": "Pending", "Hemoglobin": "Pending" },
      radiology: { modality: "Pending", findings: "No scans ordered." }
    };
    onUpdatePatients([...patients, newPatient]);
    onSelectId(newId);
  };

  const handleGlobalSave = (e) => {
    if (e) e.preventDefault();
    if (!isBudgetValid) return;

    const updated = patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          name, 
          age: Number(age), 
          gender,
          status: readyToDischarge && p.patientConsentedDischarge ? "Fully Discharged" : status,
          dischargeDate,
          diagnosis,
          notes: notesText,
          medications,
          readyToDischarge,
          vitals,
          diet: { carbs: Number(carbs), protein: Number(protein), fats: Number(fats), fiber: Number(fiber) }
        };
      }
      return p;
    });
    onUpdatePatients(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', width: '100%' }}>
      
      {/* SIDEBAR WARD REGISTRY */}
      <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingBottom: '0.5rem', color: '#0f766e', borderBottom: '1px solid #f1f5f9' }}>
          <Users size={16} />
          <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Ward Registry</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectId(p.id)}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '0.6rem', border: p.id === activePatient.id ? '1px solid #0d9488' : '1px solid #e2e8f0', background: p.id === activePatient.id ? '#f0fdfa' : '#ffffff', textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{p.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                {p.readyToDischarge && p.patientConsentedDischarge ? "🟢 Checked Out" : `ID: ${p.id}`}
              </div>
            </button>
          ))}
        </div>
        <button onClick={handleAddNewPatient} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', color: '#475569', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
          <UserPlus size={16} /> Register Patient
        </button>
      </div>

      {/* CORE WORKSTATION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* TOP PANEL CONTROL (Now a live-sync display instead of a hidden input) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#ccfbf1', color: '#0f766e', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><User size={22} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{name || "Unnamed Patient"}</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live Profile • ID: {activePatient.id}</span>
            </div>
          </div>
          <button onClick={handleGlobalSave} disabled={!isBudgetValid} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isBudgetValid ? '#0f766e' : '#94a3b8', color: '#ffffff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
            <Save size={16} /> {saveSuccess ? 'Saved' : 'Save System Manifest'}
          </button>
        </div>

        {/* WORKFLOW DISCHARGE BLOCK */}
        <div style={{ background: readyToDischarge ? '#f0fdf4' : '#fff7ed', borderRadius: '1rem', border: readyToDischarge ? '1px solid #bbf7d0' : '1px solid #ffedd5', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {readyToDischarge ? <Award size={24} color="#16a34a" /> : <ShieldAlert size={24} color="#ea580c" />}
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Discharge Tracking Sequence</h4>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#475569' }}>
                {readyToDischarge ? "Authorized. Patient can execute checkout from portal." : "Locked. Enable button below to dispatch authorization."}
              </p>
            </div>
          </div>
          <button onClick={() => setReadyToDischarge(!readyToDischarge)} style={{ background: readyToDischarge ? '#dc2626' : '#16a34a', color: '#ffffff', border: 'none', padding: '0.55rem 1.15rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            {readyToDischarge ? "Revoke Ready Status" : "MARK READY"}
          </button>
        </div>

        {/* DEMOGRAPHICS & PRESCRIPTIONS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* FIXED DEMOGRAPHICS CARD */}
          <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}><FileText size={18} color="#0f766e" /> Demographics</h3>
            
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>FULL NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter patient name..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>AGE</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>GENDER</label>
                <input type="text" value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }} />
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>DIAGNOSIS</label>
              <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}><Pill size={18} color="#8b5cf6" /> Prescriptions</h3>
            <div style={{ flex: 1, overflowY: 'auto', background: '#fafafa', borderRadius: '0.5rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px' }}>
              {medications.map((med, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                  <span><strong>{med.name}</strong> - {med.dosage}</span>
                  <button onClick={() => setMedications(medications.filter((_, i) => i !== idx))} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.4rem' }}>
              <input type="text" placeholder="Med" value={newMedName} onChange={e => setNewMedName(e.target.value)} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.8rem' }} />
              <input type="text" placeholder="Dose" value={newMedDosage} onChange={e => setNewMedDosage(e.target.value)} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.8rem' }} />
              <button onClick={() => { if(newMedName && newMedDosage) { setMedications([...medications, {name: newMedName, dosage: newMedDosage}]); setNewMedName(''); setNewMedDosage(''); } }} style={{ background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '0.25rem', padding: '0.4rem', cursor: 'pointer' }}><Plus size={14} /></button>
            </div>
          </div>
        </div>

        {/* DIET TARGETS */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}><Apple size={18} color="#0d9488" /> Macro Target Matrix</h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isBudgetValid ? '#166534' : '#b91c1c' }}>Total: {totalMacroSum}%</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[['Carbs', carbs, setCarbs], ['Protein', protein, setProtein], ['Fats', fats, setFats], ['Fiber', fiber, setFiber]].map(([label, val, setVal], i) => (
              <div key={i}>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>{label}</label>
                <input type="number" value={val} onChange={e => setVal(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>

        {/* VITALS / TELEMETRY ENTRY */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}><Activity size={18} color="#2563eb" /> Append Telemetry Reading</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>Adding a reading here will automatically plot a new point on the patient's charts below.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>Time/Label</label>
              <input type="text" placeholder="e.g. Day 4" value={newDay} onChange={e => setNewDay(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>BPM</label>
              <input type="number" placeholder="85" value={newBpm} onChange={e => setNewBpm(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>SYS BP</label>
              <input type="number" placeholder="120" value={newSys} onChange={e => setNewSys(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>DIA BP</label>
              <input type="number" placeholder="80" value={newDia} onChange={e => setNewDia(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>SpO2 (%)</label>
              <input type="number" placeholder="98" value={newSpo2} onChange={e => setNewSpo2(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleAddVital} style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.25rem', padding: '0.4rem 1rem', fontWeight: 700, cursor: 'pointer', height: '31px' }}>
              Add
            </button>
          </div>
        </div>

        {/* INTEGRATED CHARTS SYSTEM */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '0.5rem' }}>
          <RenderCharts vitals={vitals} diet={{ carbs, protein, fats, fiber }} />
        </div>

      </div>
    </div>
  );
}