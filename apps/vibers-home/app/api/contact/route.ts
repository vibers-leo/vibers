import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { reportToAdmin } from '@/lib/admin/reporter';

// Firebase 클라이언트 SDK (서버 사이드에서도 사용 가능)
function getDb() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  return getFirestore(app);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, inquiryType, message } = body;

    // 필수 필드 검증
    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 연락처는 필수입니다.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const contactData = {
      name,
      phone,
      inquiryType: inquiryType || '기타',
      message: message || '',
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Firestore에 문의 저장
    await addDoc(collection(db, 'contacts'), contactData);

    // 중앙 어드민에 보고 (Webhook)
    await reportToAdmin('CONTACT_INQUIRY', contactData);

    return NextResponse.json({ success: true, message: '문의가 접수되었습니다.' });
  } catch (error) {
    console.error('문의 저장 실패:', error);
    return NextResponse.json(
      { error: '문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
