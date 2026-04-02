'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useInquiries, WORKFLOW_STEPS, type Inquiry, type InquiryNote } from '@/hooks/useInquiries';
import { Phone, Mail, MessageSquare, X, Plus, Save, Trash2, Clock, Send, Loader2 } from 'lucide-react';

const formatPhone = (p: string) => {
  const d = (p || '').replace(/\D/g, '');
  return d.length === 11 ? d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : p;
};

const NOTE_TAGS = ['', '1차 상담', '2차 상담', '3차 상담', '매장방문', '계약', '기타'];

export default function InquiriesPage() {
  const { inquiries, loading, updateInquiry, deleteInquiry } = useInquiries();
  const [selected, setSelected] = useState<Inquiry | null>(null);

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
          <span className="text-sm text-gray-500">{inquiries.length}건</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">아직 문의가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => {
              const date = inq.createdAt?.toDate?.() ? inq.createdAt.toDate() : new Date(inq.createdAt);
              const wf = WORKFLOW_STEPS.find(s => s.status === (inq.workflowStatus || inq.status));
              const label = wf?.label || (inq.status === 'pending' ? '대기' : inq.status || '접수');
              const color = wf ? `${wf.color} text-white` : 'bg-amber-100 text-amber-700';

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelected(inq)}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-yellow-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{inq.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formatPhone(inq.phone)}
                        </span>
                        {inq.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inq.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>{label}</span>
                      <p className="text-[10px] text-gray-400 mt-1">{date.toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                  {inq.message && (
                    <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap line-clamp-4">
                      {inq.message}
                    </div>
                  )}
                  {inq.storeName && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-medium rounded-md">
                      {inq.storeName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 관리 모달 */}
        {selected && (
          <InquiryModal
            inquiry={selected}
            onClose={() => setSelected(null)}
            onUpdate={async (updated) => {
              await updateInquiry(updated.id, updated);
              setSelected({ ...selected, ...updated });
            }}
            onDelete={async () => {
              await deleteInquiry(selected.id);
              setSelected(null);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// ──────────────────────────────────────
// 문의 관리 모달
// ──────────────────────────────────────
function InquiryModal({
  inquiry,
  onClose,
  onUpdate,
  onDelete,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [currentStatus, setCurrentStatus] = useState(inquiry.workflowStatus || 'received');
  const [notes, setNotes] = useState<InquiryNote[]>(inquiry.notes || []);
  const [newNote, setNewNote] = useState('');
  const [noteTag, setNoteTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.status === currentStatus);

  const getNextCallNum = () => {
    return notes.filter((n) => n.tag?.includes('상담')).length + 1;
  };

  const handleStatusChange = async (status: string) => {
    setCurrentStatus(status);
    await onUpdate({ workflowStatus: status });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: InquiryNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      tag: noteTag || undefined,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ notes, workflowStatus: currentStatus });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-yellow-50 to-amber-50 flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">문의 관리</h3>
            <p className="text-sm text-gray-500">{inquiry.name} · {formatPhone(inquiry.phone)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => { setDeleting(true); await onDelete(); }}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽: 고객 정보 + 문의 내용 */}
          <div className="w-1/3 border-r p-6 overflow-y-auto bg-gray-50/50">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">고객 정보</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-mono">{formatPhone(inquiry.phone)}</span>
                  </div>
                  {inquiry.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{inquiry.email}</span>
                    </div>
                  )}
                  {inquiry.storeName && (
                    <div className="mt-2 p-3 bg-white rounded-lg border">
                      <div className="text-xs text-gray-400 mb-1">관심 매장</div>
                      <div className="text-sm font-medium">{inquiry.storeName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">문의 내용</h4>
                <div className="p-4 bg-white rounded-xl border text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {inquiry.message || '내용 없음'}
                </div>
                <div className="text-[10px] text-gray-400 mt-2">
                  접수: {(() => { try { return (inquiry.createdAt?.toDate?.() || new Date(inquiry.createdAt)).toLocaleString('ko-KR'); } catch { return '-'; } })()}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 단계 + 메모 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b text-sm font-bold text-yellow-700">
              진행 및 상담 관리
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* 워크플로우 */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  진행 단계 (클릭 시 자동 저장)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const isActive = step.status === currentStatus;
                    const isPast = i < currentStepIndex;
                    return (
                      <button
                        key={step.status}
                        onClick={() => handleStatusChange(step.status)}
                        className={`p-4 rounded-xl text-xs font-medium transition-all border-2 ${
                          isActive
                            ? `${step.color} text-white border-transparent shadow-lg scale-[1.02]`
                            : isPast
                            ? 'bg-gray-50 text-gray-500 border-gray-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-yellow-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200/50'}`}>
                            STEP {i + 1}
                          </span>
                        </div>
                        <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                          {step.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 상담 메모 */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  상담 메모
                </h4>

                <div className="space-y-3 mb-6">
                  {notes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-xl border hover:border-yellow-200 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        {note.tag && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            note.tag.includes('상담') ? 'bg-blue-100 text-blue-700' :
                            note.tag === '매장방문' ? 'bg-green-100 text-green-700' :
                            note.tag === '계약' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {note.tag}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {new Date(note.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm bg-gray-50/50 rounded-xl border border-dashed">
                      작성된 메모가 없습니다.
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {['', `${getNextCallNum()}차 상담`, '매장방문', '계약', '기타'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNoteTag(noteTag === tag ? '' : tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          noteTag === tag ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag || '태그 없음'}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={noteTag ? `[${noteTag}] 내용을 기록하세요...` : '통화 내용, 진행 사항 등을 기록하세요...'}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none resize-none text-sm"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {noteTag ? `[${noteTag}] 메모 추가` : '메모 추가'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm">
            닫기 (ESC)
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="h-5 w-5" />
            {saving ? '저장 중...' : '메모 및 변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
