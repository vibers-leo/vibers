'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalMonthly: 0,
    totalYearly: 0,
    activeCount: 0,
    nextRenewal: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // AI Conversation state
  const [conversationDialogOpen, setConversationDialogOpen] = useState(false);

  const loadData = async () => {
    try {
      // TODO: Implement data loading
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      toast.error('데이터 로딩 실패', {
        description: '구독 정보를 불러오는데 실패했습니다.',
      });
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <Image
              src="/icons/세모폰 기본.png"
              alt="Loading"
              width={120}
              height={120}
              className="animate-pulse"
            />
            <p className="text-center mt-4 text-brand font-medium">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm pb-20">
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        {/* Header with 세모 character */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/세모폰 기본.png"
              alt="세모구독"
              width={80}
              height={80}
              className="drop-shadow-brand"
            />
            <div>
              <h1 className="text-4xl md:text-5xl text-dark font-bold">
                세모구독
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                세상의 모든 구독을 한눈에 ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              size="lg"
              onClick={handleRefresh}
              className={refreshing ? 'animate-spin' : ''}
            >
              🔄
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setConversationDialogOpen(true)}
            >
              💬 AI와 대화하기
            </Button>

            <Button
              variant="secondary"
              size="lg"
            >
              ➕ 직접 추가
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">월간 비용</h3>
              <Image src="/icons/카드.png" alt="카드" width={32} height={32} />
            </div>
            <div className="text-3xl font-bold text-dark">
              ₩{stats.totalMonthly.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              평균 월 지출
            </p>
          </Card>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">연간 비용</h3>
              <Image src="/icons/차트.png" alt="차트" width={32} height={32} />
            </div>
            <div className="text-3xl font-bold text-dark">
              ₩{stats.totalYearly.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              연간 예상 지출
            </p>
          </Card>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">활성 구독</h3>
              <Image src="/icons/목록.png" alt="목록" width={32} height={32} />
            </div>
            <div className="text-3xl font-bold text-dark">
              {stats.activeCount}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              구독 중인 서비스
            </p>
          </Card>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">다음 갱신</h3>
              <Image src="/icons/캘린더.png" alt="캘린더" width={32} height={32} />
            </div>
            <div className="text-3xl font-bold text-dark">
              {stats.nextRenewal ? 'D-?' : '-'}
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {stats.nextRenewal
                ? new Date(stats.nextRenewal).toLocaleDateString('ko-KR')
                : '갱신 예정 없음'}
            </p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full max-w-2xl">
            <TabsTrigger value="list" className="flex-1">
              📋 리스트
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1">
              📅 캘린더
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">
              📊 분석
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="mt-6 space-y-6">
            {subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TODO: Render subscription cards */}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-brand/30 bg-white/50">
                <div className="py-20">
                  <div className="text-center max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                      <Image
                        src="/icons/세모폰 기본.png"
                        alt="세모구독"
                        width={120}
                        height={120}
                        className="animate-pulse drop-shadow-brand"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-dark mb-3">
                      구독을 추가해보세요!
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      AI와 대화하며 쉽고 빠르게 구독 서비스를 추가하고<br />
                      맞춤 절약 팁을 받아보세요 ✨
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="primary"
                        size="xl"
                        onClick={() => setConversationDialogOpen(true)}
                      >
                        💬 AI와 대화하기
                      </Button>
                      <Button
                        variant="outlined"
                        size="xl"
                      >
                        ➕ 직접 추가
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                      💡 "넷플릭스, 유튜브 프리미엄..." 처럼 자연스럽게 말하기만 하면 됩니다
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="mt-6">
            <Card className="shadow-md">
              <div className="py-20 text-center">
                <Image
                  src="/icons/캘린더 앱.png"
                  alt="캘린더"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <p className="text-lg text-gray-600">
                  캘린더 기능 준비 중...
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="shadow-md">
              <div className="py-20 text-center">
                <Image
                  src="/icons/차트2.png"
                  alt="분석"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <p className="text-lg text-gray-600">
                  분석 기능 준비 중...
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
