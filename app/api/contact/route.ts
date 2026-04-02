import { NextResponse } from 'next/server';
import { sendContactNotification, ContactInquiry } from '@/lib/email';
import { sendContactNotificationSMS } from '@/lib/ppurio';
import admin from 'firebase-admin';

// Firebase Admin 초기화
if (!admin.apps.length) {
  const pk = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (pk && projectId && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey: pk.replace(/\\n/g, '\n') }),
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, email, message, storeName, type, resumeUrl, resumeFileName } = body;

    // 필수 필드 검증
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: '이름, 연락처, 문의내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (숫자만 10-11자리)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return NextResponse.json(
        { success: false, error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증 (선택사항)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const inquiry: ContactInquiry = {
      name,
      phone,
      email,
      message,
      storeName,
      type,
      resumeUrl: resumeUrl || '',
      resumeFileName: resumeFileName || '',
      ncpResumeUrl: '',
    };

    // Firestore에 문의 저장
    try {
      if (admin.apps.length) {
        await admin.firestore().collection('contacts').add({
          name, phone, email: email || '', message,
          storeName: storeName || '',
          type: type || 'general',
          resumeUrl: resumeUrl || '',
          resumeFileName: resumeFileName || '',
          ncpResumeUrl: '',
          status: 'pending',
          workflowStatus: 'received',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (e) { console.error('Firestore 저장 실패:', e); }

    // 환경변수 확인 (Resend 사용)
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY is missing. Email will NOT be sent.');

      // 개발 환경에서는 성공으로 처리
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 [DEV MODE] Contact inquiry received:', inquiry);
        return NextResponse.json({
          success: true,
          message: 'Development mode: Email configuration needed',
          warning: 'Configure RESEND_API_KEY to send real emails.'
        });
      }

      return NextResponse.json(
        { success: false, error: '이메일 설정이 완료되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 이메일 발송
    const emailResult = await sendContactNotification(inquiry);
    console.log('📧 Email result:', emailResult);

    // 뿌리오 SMS 발송 (병렬 처리)
    const smsResult = await sendContactNotificationSMS({
      name: inquiry.name,
      phone: inquiry.phone,
      storeName: inquiry.storeName,
    });
    console.log('📱 SMS result:', smsResult);

    // 이메일 또는 SMS 중 하나라도 성공하면 OK
    if (emailResult.success || smsResult.success) {
      const notifications: string[] = [];
      if (emailResult.success) notifications.push('이메일');
      if (smsResult.success) notifications.push('SMS');

      return NextResponse.json({
        success: true,
        message: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.',
        notifications: notifications.join(', ') + ' 알림 발송됨'
      });
    } else {
      // 둘 다 실패한 경우
      console.error('❌ Both email and SMS notification failed');
      return NextResponse.json(
        { success: false, error: '알림 발송에 실패했습니다. 전화로 문의해주세요.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Contact API error:', error);
    return NextResponse.json(
      { success: false, error: '문의 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
