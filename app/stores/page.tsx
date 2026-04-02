'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { stores, type Store } from '@/data/stores';
import { calculateDistance, isCapitalArea } from '@/lib/distance';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreDetailModal from '@/components/StoreDetailModal';
import StoreActionButtons from '@/components/StoreActionButtons';
import { SwipeableStoreCard } from '@/components/ui/SwipeableStoreCard';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { haptics } from '@/lib/haptics';

const NaverMap = dynamic(() => import('@/components/NaverMap'), { ssr: false });

interface StoreWithDistance extends Store {
  distance?: number;
}

export default function StoresPage() {
  const [allStores, setAllStores] = useState<StoreWithDistance[]>(stores);
  const [filteredStores, setFilteredStores] = useState<StoreWithDistance[]>(stores);
  const [nearestStores, setNearestStores] = useState<StoreWithDistance[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('전체');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationState, setLocationState] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');
  const [locationError, setLocationError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const regions = useMemo(() => ['전체', '서울', '경기', '인천'], []);

  const openStoreDetail = useCallback((store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  }, []);

  const closeStoreDetail = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStore(null), 300);
  }, []);

  // 지역 필터링 (2단계: region + subRegion)
  useEffect(() => {
    if (selectedRegion === '전체') {
      setFilteredStores(allStores);
    } else if (selectedSubRegion === '전체') {
      // 대분류만 선택 (예: 서울 전체)
      setFilteredStores(allStores.filter((store) => store.region === selectedRegion));
    } else {
      // 소분류 선택 (예: 서울 동부)
      setFilteredStores(
        allStores.filter(
          (store) => store.region === selectedRegion && store.subRegion === selectedSubRegion
        )
      );
    }
  }, [selectedRegion, selectedSubRegion, allStores]);

  // 내 위치 가져오기
  const getMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('브라우저가 위치 서비스를 지원하지 않습니다.');
      setLocationState('error');
      return;
    }

    setLocationState('loading');
    setLocationError('');

    const startTime = Date.now();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // 모든 매장에 거리 계산
        const storesWithDistance = stores.map((store) => ({
          ...store,
          distance: calculateDistance(latitude, longitude, store.lat, store.lng),
        }));

        // 거리순 정렬
        storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setAllStores(storesWithDistance);

        // 수도권 사용자인 경우 가장 가까운 3개 매장 찾기
        const capitalAreaStores = storesWithDistance.filter((store) =>
          isCapitalArea(store.region)
        );

        if (capitalAreaStores.length > 0) {
          setNearestStores(capitalAreaStores.slice(0, 3));
        } else {
          // 수도권이 아닌 경우 전체에서 가장 가까운 3개
          setNearestStores(storesWithDistance.slice(0, 3));
        }

        // 최소 1초 딜레이 보장 (UX 개선)
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setLocationState('success');
        }, remainingTime);
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        let errorMessage = '위치 정보를 가져올 수 없습니다.';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = '위치 정보를 사용할 수 없습니다.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = '위치 요청 시간이 초과되었습니다. 다시 시도해주세요.';
        }

        setLocationError(errorMessage);

        // 에러도 최소 1초 후 표시 (일관성 유지)
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          setLocationState('error');
        }, remainingTime);
      }
    );
  }, []);

  // Pull-to-Refresh 핸들러
  const handleRefresh = useCallback(async () => {
    // 위치 권한을 받은 상태라면 위치 재갱신
    if (locationState === 'success') {
      return new Promise<void>((resolve) => {
        getMyLocation();
        setTimeout(resolve, 1000);
      });
    }
    // 그 외의 경우 간단히 새로고침
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        window.location.reload();
        resolve();
      }, 800);
    });
  }, [locationState, getMyLocation]);

  return (
    <>
      <Header />
      <main id="main-content" style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }} className="min-h-screen bg-gray-100">
        {/* Hero */}
        <section className="bg-white pt-[100px] md:pt-[120px] pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/상점1.png"
                alt="매장 찾기"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">매장 찾기</h1>
                <p className="text-base md:text-lg text-gray-600">
                  전국 50개 이상의 세모폰 매장을 찾아보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        <PullToRefresh onRefresh={handleRefresh} disabled={viewMode === 'map'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* 내 위치 기반 검색 */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8">
          {/* Step 1: Initial - 권한 요청 */}
          {locationState === 'initial' && (
            <div className="text-center py-12 relative">
              {/* 배경 장식 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <Image src="/icons/선물.png" alt="" width={80} height={80} className="absolute top-4 left-8 w-16 h-16 object-contain animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                <Image src="/icons/하트.png" alt="" width={70} height={70} className="absolute top-8 right-12 w-14 h-14 object-contain animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
                <Image src="/icons/ok.png" alt="" width={70} height={70} className="absolute bottom-8 left-16 w-14 h-14 object-contain animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
              </div>

              {/* 메인 아이콘 */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-brand rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand/30 to-brand/10 rounded-full blur-xl"></div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <Image
                    src="/icons/지도핀2.png"
                    alt="위치 찾기"
                    width={120}
                    height={120}
                    className="w-28 h-28 object-contain drop-shadow-2xl animate-bounce"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                내 주변 가까운 매장 찾기
              </h2>

              <div className="inline-flex items-center gap-2 bg-brand/10 px-4 py-2 rounded-full mb-4">
                <Image src="/icons/선물.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                <span className="text-sm font-bold text-gray-800">
                  가장 가까운 <span className="text-brand">매장 3곳</span>을 찾아드립니다
                </span>
              </div>

              <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
                위치 권한을 허용하면 최적의 매장을 추천해드려요
              </p>

              <button
                onClick={getMyLocation}
                className="group relative inline-flex items-center gap-3 text-black px-12 md:px-16 py-5 md:py-6 rounded-full text-xl md:text-2xl font-black shadow-[0_8px_30px_rgba(254,229,0,0.5)] hover:shadow-[0_16px_50px_rgba(254,229,0,0.7)] hover:-translate-y-2 transition-all duration-300"
                style={{ backgroundColor: '#FEE500' }}
              >
                <Image src="/icons/지도핀.png" alt="" width={28} height={28} className="relative w-7 h-7 object-contain group-hover:scale-110 transition-transform" />
                <span className="relative">내 위치에서 찾기</span>
                <svg className="relative w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="mt-6 text-center text-xs text-gray-500">
                🔒 위치 정보는 가까운 매장 찾기에만 사용되며 저장되지 않습니다
              </div>

              <p className="text-sm text-brand font-bold mt-3">
                📍 서울·경기·인천 지역 서비스 중
              </p>
            </div>
          )}

          {/* Step 2: Loading - 위치 확인 중 (화려한 모달) */}
          {locationState === 'loading' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative py-16 px-6"
            >
              {/* 배경 장식 */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 rounded-3xl"></div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-brand/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-hover/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

              <div className="relative text-center">
                {/* 로딩 아이콘 영역 */}
                <div className="relative inline-block mb-8">
                  {/* 회전하는 외부 링 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-brand/30 border-t-brand rounded-full animate-spin"></div>
                  </div>

                  {/* 중앙 아이콘 */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand/10 rounded-full blur-xl animate-pulse"></div>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <Image
                        src="/icons/지도핀.png"
                        alt="검색 중"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain drop-shadow-lg"
                      />
                    </motion.div>
                  </div>

                  {/* 점점이 효과 */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2.5 h-2.5 bg-brand rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2.5 h-2.5 bg-brand rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2.5 h-2.5 bg-brand rounded-full"
                    ></motion.div>
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-black text-gray-900 mb-3"
                >
                  가까운 성지를 찾고 있어요
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base md:text-lg text-gray-600 mb-6"
                >
                  위치 정보를 기반으로<br className="md:hidden" />
                  최적의 매장을 찾고 있습니다
                </motion.p>

                {/* 진행 상태 배지 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-brand/20"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand/30 rounded-full blur-md animate-pulse"></div>
                    <Image
                      src="/icons/나침반.png"
                      alt=""
                      width={24}
                      height={24}
                      className="relative w-6 h-6 object-contain"
                    />
                  </div>
                  <span className="text-sm md:text-base font-bold text-gray-900">
                    위치 분석 중...
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success - 결과 표시 */}
          {locationState === 'success' && (
            <div>
              <div className="mb-8 text-center relative">
                {/* 성공 아이콘 */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <Image
                    src="/icons/ok.png"
                    alt="찾기 성공"
                    width={80}
                    height={80}
                    className="relative w-20 h-20 object-contain drop-shadow-lg"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  내 주변 가까운 매장을 찾았어요!
                </h2>
                <p className="text-base text-gray-600 mb-2">
                  위치 정보를 기반으로 가까운 매장을 표시합니다
                </p>

                {/* 장식 배지 */}
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mt-2">
                  <Image src="/icons/지도핀.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                  <span className="text-sm font-bold text-green-700">위치 기반 추천</span>
                </div>
              </div>

              {/* 가까운 매장 3개 */}
              {nearestStores.length > 0 && (
                <div>
                  <div className="mb-6 bg-gradient-to-r from-brand/10 to-transparent p-4 rounded-2xl border-l-4 border-brand">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-brand rounded-full blur-md opacity-50"></div>
                        <Image src="/icons/선물.png" alt="" width={40} height={40} className="relative w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
                          가장 가까운 매장
                          <span className="text-lg font-bold text-brand">TOP 3</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">거리순으로 정렬되었습니다</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {nearestStores.map((store, index) => (
                      <div
                        key={store.id}
                        className="relative bg-white rounded-3xl border-2 border-gray-100 hover:border-brand overflow-hidden transition-all duration-300 hover:shadow-brand-card group"
                      >
                        {/* 배경 장식 */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                        {/* 순위 배지 - 더 크고 화려하게 */}
                        <div className="absolute top-5 left-5 z-10">
                          <div className="relative">
                            <div className={`absolute inset-0 rounded-full blur-md ${
                              index === 0 ? 'bg-yellow-400' :
                              index === 1 ? 'bg-gray-300' :
                              'bg-orange-600'
                            } opacity-50`}></div>
                            <div className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center font-black shadow-xl ${
                              index === 0 ? 'bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black' :
                              index === 1 ? 'bg-gradient-to-br from-[#E8E8E8] via-[#C0C0C0] to-[#A8A8A8] text-white' :
                              'bg-gradient-to-br from-[#CD7F32] via-[#B8860B] to-[#8B4513] text-white'
                            } border-4 border-white`}>
                              <span className="text-xs font-bold">TOP</span>
                              <span className="text-2xl">{index + 1}</span>
                            </div>
                            {/* 왕관 아이콘 (1등만) */}
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2">
                                <span className="text-2xl">👑</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 거리 배지 */}
                        {store.distance !== undefined && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="px-4 py-2 bg-black/90 text-[#F2C811] rounded-full font-bold text-base backdrop-blur-sm">
                              {store.distance}km
                            </div>
                          </div>
                        )}

                        <div className="p-6 pt-24">
                          {/* 매장명 */}
                          <h4 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-brand transition-colors flex items-center gap-2">
                            <Image src="/icons/건물.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                            {store.name}
                          </h4>

                          {/* 주소 */}
                          <div className="flex items-start gap-3 mb-3 bg-gray-50 p-3 rounded-xl">
                            <div className="flex-shrink-0 w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                              <Image src="/icons/지도핀.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed pt-1">{store.address}</p>
                          </div>

                          {/* 전화번호 */}
                          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl">
                            <div className="flex-shrink-0 w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="text-base text-gray-700 font-bold pt-1">{store.phone}</span>
                          </div>

                          {/* 액션 버튼 */}
                          <StoreActionButtons
                            store={store}
                            variant="default"
                            onStoreInfoClick={() => openStoreDetail(store)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Error - 에러 화면 */}
          {locationState === 'error' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                위치를 가져올 수 없습니다
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
                {locationError}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={getMyLocation}
                  className="inline-flex items-center justify-center gap-2 bg-brand text-black px-6 py-3 rounded-full font-bold shadow-brand hover:bg-primary-hover hover:shadow-brand-hover hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
                >
                  <Image src="/icons/다시시도.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  다시 시도
                </button>
                <button
                  onClick={() => setLocationState('initial')}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-full font-bold hover:bg-gray-200 transition-colors"
                >
                  ← 처음으로
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 지도/리스트 뷰 전환 */}
        <div className="bg-gradient-to-br from-white via-brand/5 to-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col gap-6">
            {/* 뷰 모드 전환 - 더 크고 화려하게 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icons/빈지도 1.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">보기 모드</h3>
              </div>
              <div className="flex gap-3 bg-gray-100 p-2 rounded-2xl">
                <motion.button
                  onClick={() => {
                    haptics.light();
                    setViewMode('map');
                  }}
                  className={`relative flex-1 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
                    viewMode === 'map'
                      ? 'text-black shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {viewMode === 'map' && (
                    <motion.div
                      layoutId="activeViewMode"
                      className="absolute inset-0 bg-brand rounded-xl shadow-brand"
                      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Image
                      src="/icons/빈지도 1.png"
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-base md:text-lg">지도 보기</span>
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    haptics.light();
                    setViewMode('list');
                  }}
                  className={`relative flex-1 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
                    viewMode === 'list'
                      ? 'text-black shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {viewMode === 'list' && (
                    <motion.div
                      layoutId="activeViewMode"
                      className="absolute inset-0 bg-brand rounded-xl shadow-brand"
                      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Image
                      src="/icons/목록.png"
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-base md:text-lg">리스트 보기</span>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* 지역 필터 - 태그 클라우드 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icons/지도핀.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">지역 선택</h3>
              </div>

              <div className="space-y-3">
                {/* 전체 버튼 */}
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => {
                      haptics.light();
                      setSelectedRegion('전체');
                      setSelectedSubRegion('전체');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedRegion === '전체'
                        ? 'bg-brand text-black shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📍 전체
                  </motion.button>
                </div>

                {/* 서울 */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-1">서울</div>
                  <div className="flex flex-wrap gap-2">
                    {['전체', '동부', '서부'].map((sub) => (
                      <motion.button
                        key={`서울-${sub}`}
                        onClick={() => {
                          haptics.light();
                          setSelectedRegion('서울');
                          setSelectedSubRegion(sub);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedRegion === '서울' && selectedSubRegion === sub
                            ? 'bg-brand text-black shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sub}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 경기 */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-1">경기</div>
                  <div className="flex flex-wrap gap-2">
                    {['전체', '부천남부', '부천북부', '성남/분당', '기타'].map((sub) => (
                      <motion.button
                        key={`경기-${sub}`}
                        onClick={() => {
                          haptics.light();
                          setSelectedRegion('경기');
                          setSelectedSubRegion(sub);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedRegion === '경기' && selectedSubRegion === sub
                            ? 'bg-brand text-black shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sub}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 인천 */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-1">인천</div>
                  <div className="flex flex-wrap gap-2">
                    {['전체', '남부', '북부', '서부', '송도'].map((sub) => (
                      <motion.button
                        key={`인천-${sub}`}
                        onClick={() => {
                          haptics.light();
                          setSelectedRegion('인천');
                          setSelectedSubRegion(sub);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedRegion === '인천' && selectedSubRegion === sub
                            ? 'bg-brand text-black shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sub}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 뷰 */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-6">
            <div style={{ height: '600px' }}>
              <NaverMap
                stores={filteredStores}
                userLocation={userLocation}
                onStoreClick={(store) => {
                  openStoreDetail(store);
                }}
                focusRegion={selectedRegion !== '전체'}
                selectedRegion={selectedRegion}
                selectedSubRegion={selectedSubRegion}
              />
            </div>
          </div>
        )}

        {/* 매장 리스트 */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredStores.map((store, index) => (
            <SwipeableStoreCard
              key={store.id}
              onCall={() => {
                haptics.medium();
                window.location.href = `tel:${store.phone}`;
              }}
              onNavigate={() => {
                haptics.medium();
                window.open(`https://map.naver.com/v5/search/${encodeURIComponent(store.address)}`, '_blank');
              }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-[#F2C811] hover:shadow-brand-card transition-all duration-300 flex flex-col"
            >
              {/* 카드 헤더 - 로고 배경 */}
              <div className="relative h-32 bg-gradient-to-br from-[#F2C811] to-[#D4AD00] flex items-center justify-center">
                <img
                  src="/images/logo/기본로고.png"
                  alt="세모폰"
                  className="h-16 w-16 object-contain opacity-90"
                />
                {/* 거리 배지 */}
                {store.distance !== undefined && (
                  <div className="absolute top-3 right-3 bg-black/80 text-[#F2C811] px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                    {store.distance}km
                  </div>
                )}
                {/* 순위 배지 (가까운 3개) */}
                {nearestStores.some(s => s.id === store.id) && (
                  <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    #{nearestStores.findIndex(s => s.id === store.id) + 1}
                  </div>
                )}
              </div>

              {/* 카드 내용 */}
              <div className="p-4 md:p-6 flex flex-col flex-1">
                {/* 매장명 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                    <Image
                      src="/icons/건물.png"
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 line-clamp-2 group-hover:text-brand transition-colors">
                    {store.name}
                  </h3>
                </div>

                {/* 주소 */}
                <div className="mb-2 bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">주소</p>
                  <p className="text-sm text-gray-900 leading-relaxed line-clamp-2">{store.address}</p>
                </div>

                {/* 전화번호 */}
                <div className="mb-3 bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">연락처</p>
                  <p className="text-sm text-gray-900 font-bold">{store.phone}</p>
                </div>

                {/* 지역 태그 */}
                <div className="mb-3">
                  <span className="inline-block bg-gradient-to-r from-brand/10 to-brand/5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-800">
                    {store.region}
                  </span>
                </div>

                {/* 액션 버튼 — 하단 고정 */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <StoreActionButtons
                    store={store}
                    variant="compact"
                    onStoreInfoClick={() => openStoreDetail(store)}
                  />
                </div>
              </div>
              </div>
            </SwipeableStoreCard>
          ))}
          </div>
        )}

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">해당 지역에 매장이 없습니다.</p>
          </div>
        )}
          </div>
        </PullToRefresh>
      </main>
    <Footer />

    {/* 매장 상세 모달 */}
    <StoreDetailModal
      store={selectedStore}
      isOpen={isModalOpen}
      onClose={closeStoreDetail}
    />
    </>
  );
}
