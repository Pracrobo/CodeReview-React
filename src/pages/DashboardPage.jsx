import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { AlertCircle, Clock, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import DashboardLayout from '../components/dashboard-layout';
import { mockAnalyzingRepositories, mockRepositories } from '../lib/mock-data';

export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [analyzingRepositories, setAnalyzingRepositories] = useState(
    mockAnalyzingRepositories
  );
  const [newRepositories, setNewRepositories] = useState(
    mockRepositories.filter((repo) => repo.isNew)
  );

  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from === 'repositories') {
      inputRef.current?.focus();
    }
  }, [location]);

  const handleAnalyzeRepo = (e) => {
    e.preventDefault();

    if (!repoUrl.trim() || !repoUrl.includes('github.com')) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsAnalyzing(true);

    // 실제로는 저장소 분석 API를 호출하지만, 현재는 테스트를 위해 타이머 후 상태 변경
    setTimeout(() => {
      setIsAnalyzing(false);
      setRepoUrl('');

      // 분석 중인 저장소에 추가
      const repoName = repoUrl.split('/').pop() || 'unknown-repo';
      const newRepo = {
        id: `new-${Date.now()}`,
        name: repoName,
        fullName: repoUrl.replace('https://github.com/', ''),
        description: '분석 중인 저장소',
        progress: 5,
        startedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 30 * 60000).toISOString(), // 30분 후
      };

      setAnalyzingRepositories([newRepo, ...analyzingRepositories]);
    }, 1500);
  };

  // 남은 시간 계산 함수
  const getRemainingTime = (estimatedCompletion) => {
    const remaining = new Date(estimatedCompletion).getTime() - Date.now();
    if (remaining <= 0) return '완료 예정';

    const minutes = Math.floor(remaining / 60000);
    return `약 ${minutes}분 남음`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground">
            GitHub 저장소를 분석하고 이슈를 AI로 해결해보세요
          </p>
        </div>

        {/* 저장소 분석 입력 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>GitHub 저장소 분석</CardTitle>
            <CardDescription>
              분석하고 싶은 GitHub 저장소의 URL을 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyzeRepo} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="GitHub 저장소 URL 입력 (예: https://github.com/username/repo)"
                  className="pl-9"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? '분석 중...' : '분석하기'}
              </Button>
            </form>

            {showError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>
                  유효한 GitHub 저장소 URL을 입력해주세요. (예:
                  https://github.com/username/repo)
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 분석 중인 저장소 */}
        {analyzingRepositories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">분석 중인 저장소</h2>
            <div className="grid grid-cols-1 gap-4">
              {analyzingRepositories.map((repo) => (
                <Card key={repo.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">
                          {repo.name}
                        </CardTitle>
                        <CardDescription>{repo.fullName}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600"
                      >
                        분석 중
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>진행률: {repo.progress}%</span>
                        <span>
                          {getRemainingTime(repo.estimatedCompletion)}
                        </span>
                      </div>
                      <Progress value={repo.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
                        분석이 완료되면 알림을 보내드립니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 새로운 저장소 */}
        {newRepositories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">새로 분석된 저장소</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newRepositories.map((repo) => (
                <Link to={`/repository/${repo.id}`} key={repo.id}>
                  <Card className="h-full transition-all hover:shadow-md dark:hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base font-medium dark:text-white">
                            {repo.name}
                          </CardTitle>
                          <Badge className="bg-green-500 dark:bg-green-600">
                            NEW
                          </Badge>
                        </div>
                        <Badge
                          variant={repo.isPrivate ? 'outline' : 'secondary'}
                          className={
                            repo.isPrivate
                              ? 'dark:border-gray-600 dark:text-gray-300'
                              : 'dark:bg-gray-600 dark:text-gray-200'
                          }
                        >
                          {repo.isPrivate ? '비공개' : '공개'}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 h-10 dark:text-gray-300">
                        {repo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>분석 완료: {repo.lastAnalyzed}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 분석 중인 저장소와 새 저장소가 모두 없는 경우 */}
        {analyzingRepositories.length === 0 && newRepositories.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mb-4 dark:bg-purple-900/30">
                <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">
                분석할 저장소를 추가해보세요
              </h3>
              <p className="text-center text-muted-foreground mb-4 dark:text-gray-300">
                GitHub 저장소 URL을 입력하여 AI 분석을 시작해보세요
              </p>
              <Button onClick={() => document.querySelector('input').focus()}>
                첫 저장소 분석하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
