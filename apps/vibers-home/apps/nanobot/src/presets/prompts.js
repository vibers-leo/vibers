// Product category presets for /상세페이지 command
export const PRODUCT_PRESETS = {
  의류: {
    name: '패션 의류',
    basePrompt:
      '{{productName}} 상품 상세페이지 이미지, 전문적인 모델 착용샷, 스튜디오 조명, ' +
      '흰색 배경, 고급스러운 느낌, 패션 잡지 품질, 4K, 상업용 사진',
    emoji: '👕',
  },
  식품: {
    name: '식품',
    basePrompt:
      '{{productName}} 상품 상세페이지, 신선하고 맛있어 보이는 배치, 자연광, 밝은 배경, ' +
      '식욕을 돋우는 색감, 상업용 식품 사진, 4K, 프리미엄',
    emoji: '🍽️',
  },
  전자제품: {
    name: '전자제품',
    basePrompt:
      '{{productName}} 상품 상세페이지, 최신 기술 감, 미니멀 디자인, 중립적 배경, ' +
      '프로페셔널 조명, 반사광 표현, 고급스러운 분위기, 4K',
    emoji: '📱',
  },
  뷰티: {
    name: '뷰티 & 화장품',
    basePrompt:
      '{{productName}} 상품 상세페이지, 럭셔리한 느낌, 부드러운 조명, 진주광택, ' +
      '고급 배경, 광택 있는 제품 표현, 뷰티 광고 품질, 4K',
    emoji: '💄',
  },
  생활용품: {
    name: '생활용품',
    basePrompt:
      '{{productName}} 상품 상세페이지, 일상 속 사용 장면, 따뜻한 조명, 자연스러운 배경, ' +
      '기능성 강조, 실용적이고 신뢰감 있는 분위기, 4K',
    emoji: '🏠',
  },
};

// Style presets for /스타일 command
export const STYLE_PRESETS = {
  minimalist: {
    label: '미니멀',
    description: '심플하고 깔끔한 스타일',
    emoji: '⚪',
    stylePrompt: ', 미니멀 디자인, 흰색 배경, 무채색, 심플한 구성, 모던',
  },
  luxury: {
    label: '럭셔리',
    description: '고급스럽고 우아한 스타일',
    emoji: '✨',
    stylePrompt: ', 럭셔리한 느낌, 금색 악센트, 검은색 배경, 글로시 텍스처, 프리미엄, 세련된',
  },
  casual: {
    label: '캐주얼',
    description: '친근하고 일상적인 스타일',
    emoji: '☀️',
    stylePrompt: ', 캐주얼 감성, 따뜻한 톤, 자연스러운 배경, 편안한 분위기, 친근한',
  },
  natural: {
    label: '내추럴',
    description: '친환경적이고 자연스러운 스타일',
    emoji: '🌿',
    stylePrompt: ', 자연 친화적, 초록색 요소, 오르간식 형태, 지속가능성 강조, 친환경',
  },
};

export function getProductPreset(category) {
  return PRODUCT_PRESETS[category] || PRODUCT_PRESETS.의류;
}

export function getStylePrompt(stylePreset) {
  const style = STYLE_PRESETS[stylePreset];
  return style ? style.stylePrompt : '';
}

export function getStyleLabel(stylePreset) {
  const style = STYLE_PRESETS[stylePreset];
  return style ? style.label : '캐주얼';
}
