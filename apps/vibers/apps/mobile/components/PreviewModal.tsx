import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { X, RefreshCcw, ExternalLink, Smartphone, Code, Eye, FileCode } from 'lucide-react-native';

interface CodeFile {
  path: string;
  content: string;
}

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  files: CodeFile[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ visible, onClose, files }) => {
  const [mode, setMode] = useState<'preview' | 'code'>('preview');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // 정적 HTML 프리뷰 생성을 위한 코드 정제 로직
  const cleanCodeForPreview = (code: string) => {
    // 1. Import 문 제거
    let cleaned = code.replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '');
    // 2. Export default 제거 (함수 바디만 남김)
    cleaned = cleaned.replace(/export\s+default\s+function\s+\w+\s*\(\)\s*\{/g, '<div>');
    cleaned = cleaned.replace(/return\s*\(/g, '');
    cleaned = cleaned.replace(/\);?\s*\}\s*$/g, '</div>');
    return cleaned;
  };

  const generatePreviewHtml = () => {
    const entryFile = files.find(f => f.path.endsWith('.tsx') || f.path.endsWith('.html')) || files[0];
    const rawContent = entryFile ? entryFile.content : '<h1>No Preview Available</h1>';
    const isReact = rawContent.includes('import React') || rawContent.includes('export default');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          <style>
            body { background-color: #000; color: #fff; margin: 0; padding: 0; min-height: 100vh; font-family: sans-serif; overflow-x: hidden; }
            .vibe-wrapper { padding: 20px; animation: slideIn 0.5s ease-out; }
            @keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            ::-webkit-scrollbar { display: none; }
          </style>
        </head>
        <body>
          <div id="vibe-root" class="vibe-wrapper">
            ${isReact ? cleanCodeForPreview(rawContent) : rawContent}
          </div>
        </body>
      </html>
    `;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleArea}>
                <View style={styles.iconBox}>
                  {mode === 'preview' ? <Smartphone size={14} color="#39FF14" /> : <FileCode size={14} color="#39FF14" />}
                </View>
                <View>
                    <Text style={styles.headerTitle}>{mode === 'preview' ? 'vibers Preview' : 'Source Code'}</Text>
                    <Text style={styles.headerSubtitle}>{files.length} Files Synthesized</Text>
                </View>
            </View>
            
            <View style={styles.controlArea}>
                <View style={styles.tabBar}>
                  <TouchableOpacity 
                    onPress={() => setMode('preview')}
                    style={[styles.tabItem, mode === 'preview' && styles.activeTabItem]}
                  >
                    <Eye size={16} color={mode === 'preview' ? "#000" : "rgba(255,255,255,0.4)"} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setMode('code')}
                    style={[styles.tabItem, mode === 'code' && styles.activeTabItem]}
                  >
                    <Code size={16} color={mode === 'code' ? "#000" : "rgba(255,255,255,0.4)"} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <X size={20} color="#fff" />
                </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {mode === 'preview' ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: generatePreviewHtml() }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => <View style={styles.loading}><ActivityIndicator color="#39FF14" /></View>}
          />
        ) : (
          <View style={styles.codeContainer}>
             <ScrollView horizontal style={styles.fileSwitcher} showsHorizontalScrollIndicator={false}>
                {files.map((file, i) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => setSelectedFileIndex(i)}
                    style={[styles.fileTab, selectedFileIndex === i && styles.activeFileTab]}
                  >
                    <Text style={[styles.fileTabText, selectedFileIndex === i && styles.activeFileTabText]}>
                      {file.path.split('/').pop()}
                    </Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
             <ScrollView style={styles.codeScroll}>
                <Text style={styles.codeText}>{files[selectedFileIndex]?.content}</Text>
             </ScrollView>
          </View>
        )}

        <View style={styles.footer}>
            <View style={styles.syncStatus}>
                <View style={[styles.dot, { backgroundColor: mode === 'preview' ? '#39FF14' : '#007AFF' }]} />
                <Text style={styles.syncText}>{mode === 'preview' ? 'RENDER ENGINE ACTIVE' : 'EDITOR MODE ACTIVE'}</Text>
            </View>
            {mode === 'preview' && (
              <TouchableOpacity style={styles.actionBtn}>
                  <ExternalLink size={14} color="#000" />
                  <Text style={styles.actionText}>SHARE VIBE</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { backgroundColor: '#0a0a0a', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerContent: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  titleArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 32, height: 32, backgroundColor: 'rgba(57, 255, 20, 0.1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  headerSubtitle: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold' },
  controlArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tabBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 },
  tabItem: { width: 36, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  activeTabItem: { backgroundColor: '#39FF14' },
  closeBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  webview: { flex: 1, backgroundColor: '#000' },
  loading: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  codeContainer: { flex: 1, backgroundColor: '#050505' },
  fileSwitcher: { maxHeight: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10 },
  fileTab: { paddingHorizontal: 16, justifyContent: 'center', height: 50, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeFileTab: { borderBottomColor: '#39FF14' },
  fileTabText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' },
  activeFileTabText: { color: '#fff' },
  codeScroll: { flex: 1, padding: 20 },
  codeText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'monospace' },
  footer: { height: 70, backgroundColor: '#0a0a0a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  syncStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  syncText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 8, fontWeight: 'black', letterSpacing: 1.5 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#39FF14', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  actionText: { color: '#000', fontSize: 10, fontWeight: '900' }
});
