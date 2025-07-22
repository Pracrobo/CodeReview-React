import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  AlertCircle,
  Github,
  LogOut,
  User,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '../components/ui/dialog';
import useNotification from '../hooks/use-notification';
import authService from '../services/authService';
import ModalBody from '../components/ui/ModalBody';
import paymentService from '../services/paymentService';
import DashboardLayout from '../components/dashboard-layout';

// 날짜 포맷 함수
function formatKoreanDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', '')
    .replace(/\s?$/, '');
}

// 이용기간 포맷 함수 (끝나는 시간 1분 줄이기)
function formatPeriod(start, end) {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setMinutes(endDate.getMinutes() - 1); // 끝나는 시간 1분 줄이기
  return `${formatKoreanDateTime(startDate)} ~ ${formatKoreanDateTime(
    endDate
  )}`;
}

export default function ProfilePage() {
  const { isConnected } = useNotification();
  console.log(`알림 연결 상태: ${isConnected ? '연결됨' : '끊김'}`);

  // 쿼리 파라미터에서 tab 값 읽기
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'account';

  const [tabValue, setTabValue] = useState(initialTab);
  const [currentPlan, setCurrentPlan] = useState('loading');
  const [proPlanActivatedAt, setProPlanActivatedAt] = useState(null);
  const [proPlanExpiresAt, setProPlanExpiresAt] = useState(null);
  const [username, setUsername] = useState('사용자');
  const [email, setEmail] = useState('이메일');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCanceled, setIsCanceled] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [open, setOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [chatbotMessageCount, setChatbotMessageCount] = useState(0);
  const [analyzedRepositoryCount, setAnalyzedRepositoryCount] = useState(0);
  const [isProPlan, setIsProPlan] = useState(false); // ★ Pro 플랜 여부 상태 추가

  // 자동 로그아웃 처리 함수
  const handleAutoLogout = useCallback(async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    await authService.logout();
    window.location.replace('/');
  }, [logoutLoading]);

  // 사용자 정보 및 구독 정보 불러오기
  useEffect(() => {
    if (logoutLoading) return;
    async function fetchAndHandleUser() {
      if (!localStorage.getItem('accessToken')) {
        setCurrentPlan('free');
        setIsCanceled(false);
        setUsername('사용자');
        setEmail('이메일');
        setAvatarUrl('');
        return;
      }
      try {
        const result = await paymentService.paymentStatus();
        if (!result.success) throw new Error(result.message);
        const user = result.data;
        setUsername(user.username || '사용자');
        setEmail(user.email || '이메일');
        setAvatarUrl(user.avatarUrl || '');
        setCreatedAt(user.createdAt || '');
        setUpdatedAt(user.updatedAt || '');
        setProPlanActivatedAt(user.proPlanActivatedAt);
        setProPlanExpiresAt(user.proPlanExpiresAt);
        if (user.isProPlan) {
          setCurrentPlan('pro');
          setIsCanceled(false);
        } else {
          setCurrentPlan('free');
          setIsCanceled(false);
        }
      } catch (err) {
        if (err.status === 401 || err.status === 404) {
          await handleAutoLogout();
        }
      }
    }
    fetchAndHandleUser();
  }, [location, handleAutoLogout, logoutLoading]);

  // 결제 버튼 클릭 시
  const handleProPayment = async () => {
    try {
      if (!window.TossPayments) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.tosspayments.com/v1/payment';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
      if (!clientKey) {
        alert('결제 시스템 설정에 문제가 있습니다. 관리자에게 문의하세요.');
        return;
      }

      const tossPayments = window.TossPayments(clientKey);

      await tossPayments.requestPayment('카드', {
        amount: 10000,
        orderId: `${username}-${Date.now()}`,
        orderName: 'CodeReview Pro 플랜 월간 구독',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: email,
        customerName: username,
      });
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    await authService.logout();
    window.location.replace('/');
  };

  // 구독 취소
  const handleCancelSubscription = async () => {
    setIsCanceled(true);
  };

  // 탭 변경 시 URL 쿼리 파라미터도 변경
  const handleTabChange = (value) => {
    setTabValue(value);
    navigate(`/profile?tab=${value}`, { replace: true });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTabValue(params.get('tab') || 'account');
  }, [location.search]);

  // 월간 사용량 가져오기
  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await paymentService.getMonthlyUsage();
        if (res.success) {
          setChatbotMessageCount(res.chatbotMessageCount);
          setAnalyzedRepositoryCount(res.analyzedRepositoryCount);
          setIsProPlan(res.isProPlan);
        }
      } catch (e) {
        console.error('월간 사용량 조회 실패:', e);
        setChatbotMessageCount(0);
        setAnalyzedRepositoryCount(0);
        setIsProPlan(false);
      }
    }
    fetchUsage();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 프로필</h1>
          <p className="text-muted-foreground">
            계정 정보 관리 및 구독 플랜 설정
          </p>
        </div>
        <Tabs value={tabValue} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="account">계정 정보</TabsTrigger>
            <TabsTrigger value="subscription">구독 관리</TabsTrigger>
          </TabsList>

          {/* 계정 정보 탭 */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  프로필 정보
                  <Badge
                    variant="outline"
                    className="bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 hover:bg-slate-300 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white transition-colors"
                  >
                    GitHub 연동
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg text-slate-800 dark:text-slate-100">
                          {username}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-300">
                          @{username}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {email}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-medium">
                        이메일
                      </label>
                      <Input id="email" value={email} readOnly />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="github" className="text-sm font-medium">
                        GitHub 계정
                      </label>
                      {/* input.jsx와 완전히 동일한 스타일을 바깥 div에만 적용 */}
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <input
                          id="github"
                          value={`@${username}`}
                          readOnly
                          className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:ring-offset-0 p-0 m-0 rounded-r-none"
                          tabIndex={-1}
                          // Input 컴포넌트 대신 input 태그 직접 사용 (불필요한 ring 제거)
                        />
                        {/* username과 아이콘 사이 세로 구분선 */}
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 self-center" />
                        <a
                          href={`https://github.com/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={0}
                          className="flex items-center px-2 rounded-l-none border-l-0 bg-transparent outline-none focus:ring-0 focus:ring-offset-0 group"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                        >
                          <Github className="w-5 h-5 text-slate-500 group-hover:text-ring transition-colors" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-2 flex flex-row items-center justify-between gap-2 flex-wrap">
                    {/* 가입일 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
                        가입일
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-100 font-semibold">
                        {createdAt
                          ? new Date(createdAt)
                              .toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                              .replace(/\./g, '.')
                              .replace(',', '')
                              .replace(/\s?$/, '')
                          : '-'}
                      </span>
                    </div>
                    {/* 최근 활동 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
                        최근 활동
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-100 font-semibold">
                        {updatedAt
                          ? new Date(updatedAt)
                              .toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                              .replace(/\./g, '.')
                              .replace(',', '')
                              .replace(/\s?$/, '')
                          : '-'}
                      </span>
                    </div>
                    {/* 로그아웃 버튼 */}
                    <div>
                      <Button
                        variant="destructive"
                        className="gap-1"
                        onClick={() => setOpen(true)}
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Alert className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 flex items-center gap-4">
                    <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <div>
                      <AlertDescription className="text-sm text-indigo-800 dark:text-indigo-100">
                        <span className="font-medium">계정 정보</span>는{' '}
                        <span className="font-medium">GitHub 계정</span>과
                        연동되어 있으며, 일부 정보(프로필 사진, 닉네임, 이메일
                        등)는 <span className="font-medium">GitHub</span>에서만
                        변경할 수 있습니다.
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          <li>
                            프로필 사진, 닉네임, 이메일 등은 GitHub에서 수정해
                            주세요.
                          </li>
                          <li>
                            변경 후 다시 로그인하면 최신 정보가 반영됩니다.
                          </li>
                          <li>
                            계정 연동을 해제하면 서비스 이용이 제한될 수
                            있습니다.
                          </li>
                        </ul>
                      </AlertDescription>
                    </div>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 구독 관리 탭 */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  현재 구독 플랜
                  <Badge
                    variant={
                      currentPlan === 'pro' || currentPlan === 'free'
                        ? 'outline'
                        : 'default'
                    }
                    className={
                      currentPlan === 'pro'
                        ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800 hover:bg-purple-200 hover:text-purple-800 dark:hover:bg-purple-900 dark:hover:text-purple-100 transition-colors cursor-pointer'
                        : currentPlan === 'free'
                        ? 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 hover:bg-slate-300 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white transition-colors cursor-pointer'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {currentPlan === 'free'
                      ? '무료 플랜'
                      : currentPlan === 'pro'
                      ? 'Pro 플랜'
                      : ''}
                  </Badge>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {currentPlan === 'free'
                      ? '월 3개 저장소 분석'
                      : '월 30개 저장소 분석'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 사용량 섹션 */}
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-4 flex flex-col gap-4">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    이번 달 사용량
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* 저장소 분석 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          저장소 분석
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-white">
                          {isProPlan
                            ? `${analyzedRepositoryCount}/30`
                            : `${analyzedRepositoryCount}/3`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                          style={{
                            width: isProPlan
                              ? `${(analyzedRepositoryCount / 30) * 100}%`
                              : `${(analyzedRepositoryCount / 3) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    {/* AI 챗봇 메시지 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          AI 챗봇 메시지
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-white">
                          {isProPlan
                            ? `${chatbotMessageCount}/무제한`
                            : `${chatbotMessageCount}/100`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                          style={{
                            width: isProPlan
                              ? '100%'
                              : `${(chatbotMessageCount / 100) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    사용량은 매월 1일 초기화됩니다.
                  </div>
                </div>

                {/* Pro 플랜일 때만 구독 정보 표시 */}
                {currentPlan === 'pro' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Pro 플랜 이용기간 :
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-white">
                        {proPlanActivatedAt && proPlanExpiresAt
                          ? formatPeriod(proPlanActivatedAt, proPlanExpiresAt)
                          : '정보 없음'}
                      </span>
                    </div>
                    {/* 결제 정보 등 추가 가능 */}
                    {/* ... */}
                    {!isCanceled && (
                      <Alert className="mt-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm text-indigo-800 dark:text-indigo-100">
                          Pro 플랜은 매월 자동 결제되며, 다양한 프리미엄 기능과
                          혜택을 계속 이용하실 수 있습니다.
                        </span>
                      </Alert>
                    )}
                    {isCanceled && (
                      <Alert className="mt-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm text-indigo-800 dark:text-indigo-100">
                          구독이 취소되었습니다. 만료일까지 Pro 혜택이
                          유지됩니다.
                        </span>
                      </Alert>
                    )}
                  </div>
                )}

                {/* 무료 플랜 안내 메시지 */}
                {currentPlan === 'free' && (
                  <Alert className="mt-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm text-indigo-800 dark:text-indigo-100">
                      Pro 플랜으로 업그레이드하면 더 많은 저장소 분석과 고급
                      기능을 이용할 수 있습니다.
                    </span>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="relative">
                {currentPlan === 'free' ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-base py-3"
                    onClick={handleProPayment}
                  >
                    Pro 플랜으로 업그레이드
                  </Button>
                ) : currentPlan === 'pro' && isCanceled ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-base py-3"
                    onClick={handleProPayment}
                  >
                    Pro 플랜 재구독
                  </Button>
                ) : currentPlan === 'pro' && !isCanceled ? (
                  <div className="w-full flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-400 hover:text-red-500 px-3 py-1"
                      onClick={handleCancelSubscription}
                    >
                      구독 취소
                    </Button>
                  </div>
                ) : null}
              </CardFooter>
            </Card>

            {/* 플랜 비교 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>플랜 비교</CardTitle>
                <CardDescription>
                  무료 플랜과 Pro 플랜의 기능을 비교해보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  {/* 헤더 */}
                  <div className="grid grid-cols-3 bg-muted/50 text-center">
                    <div className="p-4 font-medium flex items-center justify-center">
                      기능
                    </div>
                    <div className="p-4 font-medium border-l flex flex-col items-center justify-center">
                      <div className="text-sm">무료 플랜</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ₩0/월
                      </div>
                    </div>
                    <div className="p-4 font-medium border-l bg-indigo-100 dark:bg-indigo-900/30 flex flex-col items-center justify-center">
                      <div className="text-sm text-indigo-700 dark:text-indigo-300">
                        Pro 플랜
                      </div>
                      <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">
                        ₩10,000/월
                      </div>
                    </div>
                  </div>

                  {/* 저장소 분석 */}
                  <div className="grid grid-cols-3 border-t text-center">
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="font-medium">저장소 분석</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        월간 분석 가능한 저장소 수
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <span className="font-medium">3개</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <span className="font-medium text-indigo-700 dark:text-indigo-300">
                        30개
                      </span>
                    </div>
                  </div>

                  {/* 이슈-코드 매칭 */}
                  <div className="grid grid-cols-3 border-t text-center">
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="font-medium">이슈-코드 매칭</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        이슈와 관련된 코드 분석 수준
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <span className="mr-2">기본 수준</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <div className="flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                        <span className="mr-2">고급 분석</span>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/70 dark:text-indigo-300 dark:border-indigo-700">
                          고급
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI 챗봇 */}
                  <div className="grid grid-cols-3 border-t text-center">
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="font-medium">AI 챗봇</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        월간 사용 가능한 메시지 수
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <span>100개 메시지</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <span className="font-medium text-indigo-700 dark:text-indigo-300">
                        무제한
                      </span>
                    </div>
                  </div>

                  {/* 비공개 저장소 */}
                  <div className="grid grid-cols-3 border-t text-center">
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="font-medium">비공개 저장소</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        비공개 GitHub 저장소 지원
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>

                  {/* 우선 지원 */}
                  <div className="grid grid-cols-3 border-t text-center">
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="font-medium">우선 지원</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        문의 및 지원 요청 우선 처리
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 로그아웃 다이얼로그 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <ModalBody
            icon={<AlertTriangle size={28} color="#f59e42" />}
            title="로그아웃"
            description={`로그아웃 시, 이 서비스에서만 로그아웃되며\nGitHub 계정 연동은 유지됩니다.\n계속 진행하시겠습니까?`}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={logoutLoading}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
