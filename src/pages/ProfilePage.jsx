import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import DashboardLayout from '../components/dashboard-layout';
import { useNavigate } from 'react-router-dom';
import { removeAuthStorage } from '../utils/auth';
import useTabQuery from '../hooks/use-tabquery';

// 날짜 포맷 함수 추가
function formatKoreanDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 남은 기간을 "D-30 (30일 23:59:12 남음)" 형식으로 가독성 좋게 표시하는 함수
function getRemainDetail(expireDateString) {
  if (!expireDateString) return '';
  const now = new Date();
  const expire = new Date(expireDateString);
  const diff = expire - now;
  if (diff <= 0) return '만료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 2자리수로 포맷팅
  const pad = (n) => n.toString().padStart(2, '0');

  // days가 0이면 일수 생략
  if (days > 0) {
    return `D-${days} (${days}일 ${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음)`;
  } else {
    return `D-0 (${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음)`;
  }
}

export default function ProfilePage() {
  const [currentPlan, setCurrentPlan] = useState('loading');
  const [proPlanExpiresAt, setProPlanExpiresAt] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [username, setUsername] = useState('사용자');
  const [email, setEmail] = useState('이메일');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCanceled, setIsCanceled] = useState(false); // 구독 취소 상태
  const [tabValue, setTabValue] = useTabQuery('account');
  const location = useLocation();

  // 사용자 정보 및 구독 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentPlan('free');
      return;
    }
    fetch('http://localhost:3001/payment/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || '사용자');
        setEmail(data.email || '이메일');
        setAvatarUrl(data.avatarUrl || '');
        if (data.isProPlan) {
          setCurrentPlan('pro');
          setProPlanExpiresAt(data.proPlanExpiresAt);
          setIsCanceled(false);
          if (data.proPlanExpiresAt) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expire = new Date(data.proPlanExpiresAt);
            expire.setHours(0, 0, 0, 0);
            const left = Math.max(
              0,
              Math.ceil((expire - today) / (1000 * 60 * 60 * 24))
            );
            setDaysLeft(left);
          }
        } else {
          setCurrentPlan('free');
          setProPlanExpiresAt(null);
          setDaysLeft(0);
          setIsCanceled(false);
        }
      })
      .catch(() => {
        setCurrentPlan('free');
      });
  }, [location]); // location이 바뀔 때마다 실행

  // Toss Payments 결제 함수
  const handleProPayment = async () => {
    try {
      // TossPayments 스크립트가 없으면 동적으로 추가
      if (!window.TossPayments) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.tosspayments.com/v1/payment';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || import.meta.env.REACT_APP_TOSS_CLIENT_KEY;
      if (!clientKey) {
        alert('결제 시스템 설정에 문제가 있습니다. 관리자에게 문의하세요.');
        return;
      }

      const tossPayments = window.TossPayments(clientKey);

      await tossPayments.requestPayment('카드', {
        amount: 10000,
        orderId: `pro-${username}-${Date.now()}`,
        orderName: 'AIssue Pro 플랜 월간 구독',
        successUrl: `${window.location.origin}/pro-payment/success`,
        failUrl: `${window.location.origin}/pro-payment/fail`,
        customerEmail: email,
        customerName: username,
      });
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    removeAuthStorage();

    try {
      await fetch('/auth/github/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (e) {
      console.error('로그아웃 중 오류 발생:', e);
    }

    navigate('/');
  };

  // 구독 취소
  const handleCancelSubscription = async () => {
    // 실제로는 구독 취소 API 호출 필요
    setIsCanceled(true);
  };

  // 재구독
  const handleResubscribe = async () => {
    // 실제로는 재구독 API 호출 필요
    setIsCanceled(false);
    setCurrentPlan('pro');
    // 만료일을 오늘로부터 30일 뒤로 임시 설정 (실제는 서버에서 받아야 함)
    const newExpire = new Date();
    newExpire.setHours(0, 0, 0, 0); // 시각을 0시로 맞춤
    newExpire.setDate(newExpire.getDate() + 30); // 30일 뒤
    setProPlanExpiresAt(newExpire.toISOString());
    setDaysLeft(30);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 프로필</h1>
          <p className="text-muted-foreground">
            계정 정보 관리 및 구독 플랜 설정
          </p>
        </div>
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList>
            <TabsTrigger value="account">계정 정보</TabsTrigger>
            <TabsTrigger value="subscription">구독 관리</TabsTrigger>
          </TabsList>

          {/* 계정 정보 탭 */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>프로필 정보</CardTitle>
                <CardDescription>
                  GitHub 계정과 연동된 프로필 정보입니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <h3 className="font-medium">{username}</h3>
                    <p className="text-sm text-muted-foreground">@{username}</p>
                  </div>
                </div>

                <div className="space-y-2">
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
                      <div className="flex">
                        <Input
                          id="github"
                          value={`@${username}`}
                          readOnly
                          className="rounded-r-none"
                        />
                        <Button
                          variant="outline"
                          className="rounded-l-none border-l-0"
                          asChild
                        >
                          <a
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </Button>
              </CardFooter>
            </Card>

            <Alert className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground mr-2" />
              <div>
                <AlertTitle className="font-semibold mb-1">알림</AlertTitle>
                <AlertDescription className="text-sm text-slate-700 dark:text-slate-300">
                  계정 정보는{' '}
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    GitHub 계정
                  </span>
                  과 연동되어 있습니다.
                  <br />
                  일부 정보(프로필 사진, 닉네임, 이메일 등)는 GitHub에서만
                  변경할 수 있습니다.
                  <br />
                  <span className="text-slate-500 dark:text-slate-400">
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>
                        프로필 이미지를 변경하려면 GitHub에서 이미지를
                        수정하세요.
                      </li>
                      <li>
                        이메일, 닉네임 등 개인정보도 GitHub에서 변경 후 다시
                        로그인하면 반영됩니다.
                      </li>
                      <li>
                        계정 연동 해제 시, 서비스 이용이 제한될 수 있습니다.
                      </li>
                    </ul>
                  </span>
                </AlertDescription>
              </div>
            </Alert>
          </TabsContent>

          {/* 구독 관리 탭 */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>현재 구독 플랜</CardTitle>
                <CardDescription>
                  {currentPlan === 'loading'
                    ? '구독 정보를 불러오는 중입니다...'
                    : '현재 사용 중인 구독 플랜 정보입니다'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 사용량 섹션 (바 그래프 스타일) */}
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-4 flex flex-col gap-4">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">이번 달 사용량</div>
                  <div className="flex flex-col gap-4"> {/* md:flex-row 및 md:gap-8 제거 */}
                    {/* 저장소 분석 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">저장소 분석</span>
                        <span className="text-xs font-semibold text-white">2/3</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                          style={{ width: `${(2 / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                    {/* AI 챗봇 메시지 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">AI 챗봇 메시지</span>
                        <span className="text-xs font-semibold text-white">15/100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                          style={{ width: `${(15 / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    사용량은 매월 1일 초기화됩니다.
                  </div>
                </div>

                {/* 구독 플랜 뱃지 및 안내 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={currentPlan === 'pro' || currentPlan === 'free' ? 'outline' : 'default'}
                      className={
                        currentPlan === 'pro'
                          ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800'
                          : currentPlan === 'free'
                            ? '' // 기본 outline 스타일 사용
                            : 'bg-gray-100 text-gray-800' // 로딩 또는 알 수 없는 상태
                      }
                    >
                      {currentPlan === 'free'
                        ? '무료 플랜'
                        : currentPlan === 'pro'
                          ? 'Pro 플랜'
                          : ''}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentPlan === 'free'
                        ? '월 3개 저장소 분석'
                        : '월 30개 이상 저장소 분석'}
                    </span>
                  </div>
                  {currentPlan === 'pro' && !isCanceled && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200 transition-colors cursor-pointer hover:bg-yellow-100 hover:text-yellow-900 hover:border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-900 dark:hover:text-yellow-100 dark:hover:border-yellow-500"
                    >
                      활성
                    </Badge>
                  )}
                  {currentPlan === 'pro' && isCanceled && (
                    <Badge
                      variant="outline"
                      className="bg-gray-200 text-gray-800 border-gray-600 transition-colors cursor-pointer hover:bg-gray-300 hover:text-black hover:border-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-gray-500"
                    >
                      만료 예정
                    </Badge>
                  )}
                </div>

                {/* Pro 플랜일 때만 구독 정보 표시 */}
                {currentPlan === 'pro' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Pro 플랜 만료일:</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-white">
                        {proPlanExpiresAt
                          ? `${formatKoreanDate(proPlanExpiresAt)}`
                          : '정보 없음'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        남은 구독 기간:
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-white">
                        {getRemainDetail(proPlanExpiresAt)}
                      </span>
                    </div>
                    {isCanceled && (
                      <Alert className="mt-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm text-indigo-800 dark:text-indigo-100">
                          구독이 취소되었습니다. 만료일까지 Pro 혜택이 유지됩니다.
                        </span>
                      </Alert>
                    )}
                  </div>
                )}

                {/* 무료 플랜 안내 메시지 */}
                {currentPlan === 'free' && (
                  <Alert className="mt-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Pro 플랜으로 업그레이드하면 더 많은 저장소 분석과 고급 기능을 이용할 수 있습니다.
                    </span>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                {currentPlan === 'free' ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    onClick={handleProPayment}
                  >
                    Pro 플랜으로 업그레이드
                  </Button>
                ) : currentPlan === 'pro' && !isCanceled ? (
                  <div className="w-full flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      onClick={handleProPayment}
                    >
                      구독 1개월 연장
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-100"
                      onClick={handleCancelSubscription}
                    >
                      구독 취소
                    </Button>
                  </div>
                ) : currentPlan === 'pro' && isCanceled ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    onClick={handleProPayment}
                  >
                    Pro 플랜 재구독
                  </Button>
                ) : null}
              </CardFooter>
            </Card>

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
                  <div className="grid grid-cols-3 bg-muted/50">
                    <div className="p-4 font-medium">기능</div>
                    <div className="p-4 text-center font-medium border-l">
                      <div className="text-sm">무료 플랜</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ₩0/월
                      </div>
                    </div>
                    {/* Pro 플랜 헤더: 라이트 모드 배경을 bg-indigo-100으로 변경, 다크 모드는 유지 */}
                    <div className="p-4 text-center font-medium border-l bg-indigo-100 dark:bg-indigo-900/30">
                      <div className="text-sm text-indigo-700 dark:text-indigo-300">Pro 플랜</div>
                      <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">
                        ₩10,000/월
                      </div>
                    </div>
                  </div>

                  {/* 저장소 분석 */}
                  <div className="grid grid-cols-3 border-t">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium">저장소 분석</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          월간 분석 가능한 저장소 수
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <span className="font-medium">3개</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <span className="font-medium text-indigo-700 dark:text-indigo-300">
                        30개 이상
                      </span>
                    </div>
                  </div>

                  {/* 이슈-코드 매칭 */}
                  <div className="grid grid-cols-3 border-t">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium">이슈-코드 매칭</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          이슈와 관련된 코드 분석 수준
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <div className="flex items-center">
                        <span className="mr-2">기본 수준</span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <div className="flex items-center text-indigo-700 dark:text-indigo-300">
                        <span className="mr-2">고급 분석</span>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/70 dark:text-indigo-300 dark:border-indigo-700">
                          고급
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI 챗봇 */}
                  <div className="grid grid-cols-3 border-t">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium">AI 챗봇</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          월간 사용 가능한 메시지 수
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l">
                      <div className="flex items-center">
                        <span>100 메시지</span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l bg-indigo-50 dark:bg-indigo-900/30">
                      <div className="flex items-center text-indigo-700 dark:text-indigo-300">
                        <span className="font-medium">무제한</span>
                      </div>
                    </div>
                  </div>

                  {/* 비공개 저장소 */}
                  <div className="grid grid-cols-3 border-t">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium">비공개 저장소</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          비공개 GitHub 저장소 지원
                        </div>
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
                  <div className="grid grid-cols-3 border-t">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium">우선 지원</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          문의 및 지원 요청 우선 처리
                        </div>
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
    </DashboardLayout>
  );
}
