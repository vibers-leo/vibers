/**
 * vibers-mobile/services/stt.ts
 *
 * Speech-to-Text 추상화 레이어
 * API 선택은 보류 중이며, 현재는 시뮬레이션 모드로 동작합니다.
 * 향후 Google Cloud STT, Whisper, Clova 등으로 교체 가능합니다.
 */

export interface STTResult {
  text: string;
  confidence: number;
  language: string;
}

export interface STTProvider {
  name: string;
  transcribe(audioUri: string, language?: string): Promise<STTResult>;
}

/**
 * Simulation provider - returns placeholder text for development/testing
 */
const SimulationProvider: STTProvider = {
  name: 'simulation',
  async transcribe(_audioUri: string, _language?: string): Promise<STTResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const samplePrompts = [
      '네온 그린 테마의 멋진 프로필 카드를 만들어줘.',
      '모던한 SaaS 랜딩 페이지를 디자인해줘.',
      '대시보드 레이아웃을 만들어줘, 차트랑 통계 카드 포함해서.',
      '로그인 폼을 만들어줘, 글래스모피즘 스타일로.',
    ];

    return {
      text: samplePrompts[Math.floor(Math.random() * samplePrompts.length)],
      confidence: 0.95,
      language: 'ko-KR',
    };
  },
};

/**
 * Google Cloud Speech-to-Text provider (placeholder for future implementation)
 */
const GoogleSTTProvider: STTProvider = {
  name: 'google',
  async transcribe(_audioUri: string, language: string = 'ko-KR'): Promise<STTResult> {
    // TODO: Implement Google Cloud STT
    // 1. Read audio file from uri
    // 2. Send to Google Cloud Speech-to-Text API
    // 3. Parse response
    throw new Error('Google STT provider not yet implemented. Configure API key in settings.');
  },
};

/**
 * Whisper (OpenAI) provider (placeholder for future implementation)
 */
const WhisperProvider: STTProvider = {
  name: 'whisper',
  async transcribe(_audioUri: string, _language?: string): Promise<STTResult> {
    // TODO: Implement OpenAI Whisper API
    throw new Error('Whisper provider not yet implemented. Configure API key in settings.');
  },
};

// Available providers registry
const providers: Record<string, STTProvider> = {
  simulation: SimulationProvider,
  google: GoogleSTTProvider,
  whisper: WhisperProvider,
};

// Current active provider
let activeProvider: STTProvider = SimulationProvider;

/**
 * Set the active STT provider
 */
export function setSTTProvider(providerName: string): void {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown STT provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }
  activeProvider = provider;
}

/**
 * Get the current active provider name
 */
export function getSTTProviderName(): string {
  return activeProvider.name;
}

/**
 * Transcribe audio file to text using the active provider
 */
export async function transcribeAudio(
  audioUri: string,
  language: string = 'ko-KR'
): Promise<STTResult> {
  return activeProvider.transcribe(audioUri, language);
}
