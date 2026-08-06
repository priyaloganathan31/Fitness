import React, { useState } from 'react';
import type { QuestionTemplate, PredefinedQuestion, VenueCategory } from '../types/audit';
import { FilePlus, Upload, FileText, CheckCircle2, Plus, Trash2, Save } from 'lucide-react';

interface TemplateManagerProps {
  templates: QuestionTemplate[];
  onSaveTemplate: (template: QuestionTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onSaveTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(templates[0] || null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // New Template Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<VenueCategory>('Medical Facilities');
  const [questions, setQuestions] = useState<PredefinedQuestion[]>([
    {
      id: `Q-INIT-1`,
      section: '1. Safety & Compliance',
      questionText: 'Is the primary emergency exit unblocked and emergency lighting functional?',
      description: 'Test emergency lighting push button.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH'
    }
  ]);

  // CSV/JSON File Upload simulated state
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);

  const handleAddQuestionRow = () => {
    const newQ: PredefinedQuestion = {
      id: `Q-NEW-${Date.now()}-${questions.length + 1}`,
      section: '1. Infrastructure Integrity',
      questionText: '',
      description: '',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM'
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestionRow = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleUpdateQuestionRow = (id: string, field: keyof PredefinedQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleSaveNewTemplate = () => {
    if (!title.trim() || questions.length === 0) return;

    const newTmpl: QuestionTemplate = {
      id: `TMPL-CUSTOM-${Date.now()}`,
      title: title,
      description: description || 'Custom Auditor Created Predefined Checklist Template',
      venueCategory: category,
      createdBy: 'Prof. Dr. K. Ramanathan (Auditor)',
      createdAt: new Date().toISOString().split('T')[0],
      questions: questions.filter(q => q.questionText.trim().length > 0)
    };

    onSaveTemplate(newTmpl);
    setSelectedTemplate(newTmpl);
    setIsCreatingNew(false);
    setTitle('');
    setDescription('');
  };

  const handleSimulateFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatusMessage(`Parsing "${file.name}" CSV/JSON template structure...`);
      setTimeout(() => {
        const parsedQuestions: PredefinedQuestion[] = [
          {
            id: `Q-CSV-1`,
            section: '1. Imported Equipment Check',
            questionText: 'Verify emergency power generator diesel fuel level is above 75% capacity.',
            isMandatory: true,
            requiresPhotoIfNo: true,
            priority: 'HIGH'
          },
          {
            id: `Q-CSV-2`,
            section: '2. Imported Hygiene Standards',
            questionText: 'Check all automated water taps and drainage traps for zero leakage.',
            isMandatory: true,
            requiresPhotoIfNo: true,
            priority: 'MEDIUM'
          }
        ];
        setTitle(file.name.replace(/\.[^/.]+$/, "") + " Checklist Template");
        setDescription(`Imported from ${file.name} on ${new Date().toLocaleDateString()}`);
        setQuestions(parsedQuestions);
        setIsCreatingNew(true);
        setUploadStatusMessage(`✓ Successfully imported ${parsedQuestions.length} predefined questions from file!`);
      }, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
            AUDITOR TEMPLATE MANAGEMENT
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
            Predefined Question Templates & CSV/JSON Uploader
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
            Create, edit, and upload fitness certificate predefined checklist questions for college venues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* CSV/JSON File Upload Input */}
          <label className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', fontWeight: 800 }}>
            <Upload size={16} /> Upload CSV / JSON Template
            <input type="file" accept=".csv,.json" onChange={handleSimulateFileUpload} style={{ display: 'none' }} />
          </label>

          <button
            onClick={() => {
              setIsCreatingNew(true);
              setSelectedTemplate(null);
            }}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Create Custom Template
          </button>
        </div>
      </div>

      {uploadStatusMessage && (
        <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {uploadStatusMessage}
        </div>
      )}

      {/* Main Grid: Template List Sidebar + Detailed Template Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Template Catalog */}
        <div className="glass-panel" style={{ padding: '20px', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#2563EB" /> Predefined Checklist Catalog ({templates.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {templates.map(tmpl => {
              const isSelected = selectedTemplate?.id === tmpl.id && !isCreatingNew;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setIsCreatingNew(false);
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? '#EFF6FF' : '#F8FAFC',
                    border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1D4ED8', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px' }}>
                      {tmpl.venueCategory}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>{tmpl.questions.length} Checkpoints</span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>
                    {tmpl.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px' }}>
                    By: {tmpl.createdBy} • {tmpl.createdAt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Template Preview or Creation Form */}
        <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
          {isCreatingNew ? (
            /* Create / Edit Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FilePlus size={20} /> Create New Predefined Checklist Template
                </h3>
                <button onClick={() => setIsCreatingNew(false)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Cancel</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Template Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Medical Center Emergency & Health Fitness Checklist"
                    style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Target Venue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VenueCategory)}
                    style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="Medical Facilities">Medical Facilities</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Hostels & Residential">Hostels & Residential</option>
                    <option value="Sports & Gymnasium">Sports & Gymnasium</option>
                    <option value="Dining & Food Services">Dining & Food Services</option>
                    <option value="Academic Buildings">Academic Buildings</option>
                  </select>
                </div>
              </div>

              {/* Quick Load Preset Buttons */}
              <div style={{ background: '#EFF6FF', padding: '12px 16px', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1E40AF', marginBottom: '8px' }}>
                  ⚡ Quick Load Domain Preset Checklist (1-Click Fill):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const tmpl = templates.find(t => t.id === 'TMPL-BIT-MED-24') || templates[0];
                      if (tmpl) {
                        setTitle(tmpl.title + " (Custom Copy)");
                        setDescription(tmpl.description);
                        setCategory(tmpl.venueCategory);
                        setQuestions([...tmpl.questions]);
                      }
                    }}
                    style={{ background: '#FFFFFF', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🏥 Medical Center (24 Qs)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmpl = templates.find(t => t.id === 'TMPL-FOOD-001');
                      if (tmpl) {
                        setTitle(tmpl.title + " (Custom Copy)");
                        setDescription(tmpl.description);
                        setCategory(tmpl.venueCategory);
                        setQuestions([...tmpl.questions]);
                      }
                    }}
                    style={{ background: '#FFFFFF', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🍲 Food Safety & Kitchen (8 Qs)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmpl = templates.find(t => t.id === 'TMPL-LAB-001');
                      if (tmpl) {
                        setTitle(tmpl.title + " (Custom Copy)");
                        setDescription(tmpl.description);
                        setCategory(tmpl.venueCategory);
                        setQuestions([...tmpl.questions]);
                      }
                    }}
                    style={{ background: '#FFFFFF', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🔬 Cleanroom & Lab Safety (6 Qs)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmpl = templates.find(t => t.id === 'TMPL-HST-001');
                      if (tmpl) {
                        setTitle(tmpl.title + " (Custom Copy)");
                        setDescription(tmpl.description);
                        setCategory(tmpl.venueCategory);
                        setQuestions([...tmpl.questions]);
                      }
                    }}
                    style={{ background: '#FFFFFF', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🏢 Hostel Fire Safety (5 Qs)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Description & Scope</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Compliance requirements and mandatory inspection scope..."
                  style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                />
              </div>

              {/* Predefined Questions Editor */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Predefined Audit Questions ({questions.length})</label>
                  <button onClick={handleAddQuestionRow} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {questions.map((q, idx) => (
                    <div key={q.id} style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={q.section}
                          onChange={(e) => handleUpdateQuestionRow(q.id, 'section', e.target.value)}
                          placeholder="Section Name (e.g. 1. Safety)"
                          style={{ flex: 1, background: '#FFFFFF', color: '#1D4ED8', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}
                        />
                        <select
                          value={q.priority}
                          onChange={(e) => handleUpdateQuestionRow(q.id, 'priority', e.target.value)}
                          style={{ background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          <option value="HIGH">HIGH Priority</option>
                          <option value="MEDIUM">MEDIUM Priority</option>
                          <option value="LOW">LOW Priority</option>
                        </select>
                        <button onClick={() => handleRemoveQuestionRow(q.id)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => handleUpdateQuestionRow(q.id, 'questionText', e.target.value)}
                        placeholder={`Question #${idx + 1} text...`}
                        style={{ width: '100%', background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', padding: '8px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
                      />

                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={q.requiresPhotoIfNo}
                            onChange={(e) => handleUpdateQuestionRow(q.id, 'requiresPhotoIfNo', e.target.checked)}
                          /> Mandatory Photo Proof if answered NO
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveNewTemplate}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                >
                  <Save size={18} /> Save & Register Template
                </button>
              </div>
            </div>
          ) : selectedTemplate ? (
            /* View Mode */
            <div>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                  {selectedTemplate.venueCategory}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
                  {selectedTemplate.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  {selectedTemplate.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px', display: 'flex', gap: '16px' }}>
                  <span>Created By: <strong style={{ color: '#0F172A' }}>{selectedTemplate.createdBy}</strong></span>
                  <span>Date: <strong style={{ color: '#0F172A' }}>{selectedTemplate.createdAt}</strong></span>
                  <span>Checkpoints: <strong style={{ color: '#2563EB' }}>{selectedTemplate.questions.length}</strong></span>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>
                Predefined Checklist Questions ({selectedTemplate.questions.length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedTemplate.questions.map((q, idx) => (
                  <div key={q.id} style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#1D4ED8', fontWeight: 800 }}>
                        {q.section}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: q.priority === 'HIGH' ? '#DC2626' : '#D97706', fontWeight: 800 }}>
                        {q.priority} PRIORITY
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                      Q{idx + 1}. {q.questionText}
                    </div>
                    {q.description && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        {q.description}
                      </div>
                    )}
                    {q.requiresPhotoIfNo && (
                      <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '6px', fontWeight: 700 }}>
                        📷 Mandatory Photo Proof Enforced on "NO"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
