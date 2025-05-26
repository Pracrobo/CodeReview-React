import { useState } from 'react';
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
  CreditCard,
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

export default function ProfilePage() {
  const [currentPlan, _] = useState('free');
  const username = localStorage.getItem('username') || '사용자';
  const email = localStorage.getItem('email') || '이메일';
  const avatarUrl = localStorage.getItem('avatarUrl') || '';
  const navigate = useNavigate();

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 프로필</h1>
          <p className="text-muted-foreground">
            계정 정보 관리 및 구독 플랜 설정
          </p>
        </div>

        <Tabs defaultValue="account">
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

            <Alert className="mt-8 p-6 bg-gray-50 border border-gray-200 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-gray-500 mr-2" />
              <div>
                <AlertTitle className="font-semibold mb-1">알림</AlertTitle>
                <AlertDescription className="text-sm text-gray-700">
                  계정 정보는{' '}
                  <span className="font-medium text-gray-900">GitHub 계정</span>
                  과 연동되어 있습니다.
                  <br />
                  일부 정보(프로필 사진, 닉네임, 이메일 등)는 GitHub에서만
                  변경할 수 있습니다.
                  <br />
                  <span className="text-gray-500">
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
                  현재 사용 중인 구독 플랜 정보입니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={currentPlan === 'free' ? 'outline' : 'default'}
                      className={currentPlan === 'pro' ? 'bg-purple-600' : ''}
                    >
                      {currentPlan === 'free' ? '무료 플랜' : 'Pro 플랜'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentPlan === 'free'
                        ? '월 3개 저장소 분석'
                        : '월 30개 이상 저장소 분석'}
                    </span>
                  </div>
                  {currentPlan === 'pro' && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      활성
                    </Badge>
                  )}
                </div>

                {currentPlan === 'pro' && (
                  <div className="space-y-2">
                    <div className="text-sm">다음 결제일: 2023년 6월 15일</div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">**** **** **** 4242</span>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">사용량</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>저장소 분석</span>
                        <span>{currentPlan === 'free' ? '2/3' : '12/30+'}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: currentPlan === 'free' ? '66%' : '40%',
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>AI 챗봇 메시지</span>
                        <span>
                          {currentPlan === 'free' ? '82/100' : '무제한'}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: currentPlan === 'free' ? '82%' : '100%',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {currentPlan === 'free' ? (
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Pro 플랜으로 업그레이드
                  </Button>
                ) : (
                  <div className="w-full space-y-2">
                    <Button variant="outline" className="w-full">
                      결제 정보 변경
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      구독 취소
                    </Button>
                  </div>
                )}
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
                    <div className="p-4 text-center font-medium border-l bg-purple-50">
                      <div className="text-sm text-purple-700">Pro 플랜</div>
                      <div className="text-xs text-purple-600/70 mt-1">
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
                    <div className="p-4 flex items-center justify-center border-l bg-purple-50">
                      <span className="font-medium text-purple-700">
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
                    <div className="p-4 flex items-center justify-center border-l bg-purple-50">
                      <div className="flex items-center text-purple-700">
                        <span className="mr-2">고급 분석</span>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          고급
                        </Badge>
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
                    <div className="p-4 flex items-center justify-center border-l bg-purple-50">
                      <div className="flex items-center text-purple-700">
                        <span className="font-medium">무제한</span>
                        <Check className="ml-2 h-4 w-4" />
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
                    <div className="p-4 flex items-center justify-center border-l bg-purple-50">
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
                    <div className="p-4 flex items-center justify-center border-l bg-purple-50">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* 업그레이드 버튼 */}
                {currentPlan === 'free' && (
                  <div className="mt-6">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Pro 플랜으로 업그레이드
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
