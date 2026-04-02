"use client";

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  Globe, 
  Server,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { VIBERS_PROJECTS } from '@/lib/admin/projects';

// Helper to build hierarchy tree from paths
// e.g. 'dev/rails/dus' -> dev -> rails -> dus
const buildHierarchy = (projects: any[]) => {
  const root: any = { name: 'NCP Server', children: {}, type: 'root' };
  
  projects.forEach(project => {
    if (!project.path) return;
    
    const parts = project.path.split('/');
    let current = root;
    
    parts.forEach((part: string, index: number) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          children: {},
          type: index === parts.length - 1 ? 'project' : 'folder',
          projectData: index === parts.length - 1 ? project : null
        };
      }
      current = current.children[part];
    });
  });
  
  return root;
};

const ProjectNode = ({ node, depth = 0 }: { node: any, depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Object.keys(node.children).length > 0;
  const isProject = node.type === 'project';
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${
          isProject ? 'hover:bg-blue-50/50' : 'hover:bg-slate-50'
        }`}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1">
          {hasChildren ? (
            <span className="text-slate-400">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          ) : (
            <span className="w-4" />
          )}
          
          {isProject ? (
            <FileCode className="w-4 h-4 text-indigo-500" />
          ) : (
            <Folder className={`w-4 h-4 ${depth === 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          )}
          
          <span className={`text-sm ${isProject ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
            {isProject ? node.projectData.name : node.name}
          </span>

          {isProject && (
            <div className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              node.projectData.techStack === 'nextjs-only' ? 'bg-black text-white' : 'bg-rose-100 text-rose-700'
            }`}>
              {node.projectData.techStack.replace('-only', '').replace('-api', '').toUpperCase()}
            </div>
          )}
        </div>

        {isProject && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Globe className="w-3 h-3" />
              {node.projectData.domain}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-bold text-emerald-600">LIVE</span>
            </div>
          </div>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="mt-0.5">
          {Object.values(node.children).map((child: any, i) => (
            <ProjectNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProjectsHierarchyPage() {
  const [hierarchy, setHierarchy] = useState<any>(null);

  useEffect(() => {
    const tree = buildHierarchy(VIBERS_PROJECTS.filter(p => p.slug !== 'total'));
    setHierarchy(tree);
  }, []);

  if (!hierarchy) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">전체 프로젝트 현황 (NCP Hierarchy)</h1>
            <p className="text-sm text-[var(--admin-text-muted)]">NCP 서버의 실제 폴더 구조를 기반으로 배포된 서비스를 관리합니다.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" /> 8 Healthy
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-100">
            <AlertCircle className="w-4 h-4" /> 1 Error (DUS)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchy Tree Card */}
        <div className="lg:col-span-2 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> NCP Server Path Tree
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">root@vibers-ncp-01:~/dev</span>
          </div>
          
          <div className="space-y-1">
            {Object.values(hierarchy.children).map((node: any, i) => (
              <ProjectNode key={i} node={node} />
            ))}
          </div>
        </div>

        {/* Global Stats / Info Card */}
        <div className="space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> 최근 배포 내역
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Vibers', time: '방금 전', status: 'success' },
                { name: 'AI Recipe', time: '2시간 전', status: 'success' },
                { name: 'DUS', time: '1일 전', status: 'failed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors cursor-pointer">{item.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              배포 현황 전체 보기
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 shadow-xl text-white">
            <h3 className="text-sm font-bold opacity-60 mb-4 uppercase tracking-widest">Server Resources</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span>CPU Usage</span>
                  <span>12%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[12%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span>Memory</span>
                  <span>4.2GB / 16GB</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[26%]" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] opacity-40 uppercase font-bold">IP Address</span>
                  <span className="text-xs font-mono">101.202.34.11</span>
                </div>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold">NCP-SVR-01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
