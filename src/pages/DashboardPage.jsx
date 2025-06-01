import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { AlertCircle, Clock, Search, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import DashboardLayout from '../components/dashboard-layout';
import {
  analyzeRepository,
  getAnalyzingRepositories,
  getRecentlyAnalyzedRepositories,
  getAnalysisStatus,
} from '../services/repositoryService';

export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analyzingRepositories, setAnalyzingRepositories] = useState([]);
  const [newRepositories, setNewRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    loadDashboardData();

    if (location.state?.from === 'repositories') {
      inputRef.current?.focus();
    }
  }, [location]);

  // 분석 중인 저장소 상태 폴링
  useEffect(() => {
    if (analyzingRepositories.length > 0) {
      const interval = setInterval(() => {
        checkAnalysisProgress();
      }, 5000); // 5초마다 상태 확인

      return () => clearInterval(interval);
    }
  }, [analyzingRepositories]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyzingResult, recentResult] = await Promise.all([
        getAnalyzingRepositories(),
        getRecentlyAnalyzedRepositories(),
      ]);

      if (analyzingResult.success) {
        setAnalyzingRepositories(analyzingResult.data);
      }

      if (recentResult.success) {
        setNewRepositories(recentResult.data);
      }
    } catch (error) {
      console.error('대시보드 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnalysisProgress = async () => {
    const updatedRepositories = [];
    let hasCompletedRepo = false;

    for (const repo of analyzingRepositories) {
      const statusResult = await getAnalysisStatus(repo.id);

      if (statusResult.success) {
        const updatedRepo = { ...repo, ...statusResult.data };

        if (updatedRepo.status === 'completed') {
          hasCompletedRepo = true;
          // 완료된 저장소는 새로운 저장소 목록으로 이동
          setNewRepositories((prev) => [updatedRepo, ...prev]);
        } else {
          updatedRepositories.push(updatedRepo);
        }
      } else {
        updatedRepositories.push(repo);
      }
    }

    setAnalyzingRepositories(updatedRepositories);

    // 완료된 저장소가 있으면 알림 표시
    if (hasCompletedRepo) {
      // 여기에 토스트 알림 등을 추가할 수 있습니다
      console.log('저장소 분석이 완료되었습니다!');
    }
  };

  const validateGitHubUrl = (url) => {
    const githubUrlPattern =
      /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/?$/;
    return githubUrlPattern.test(url.trim());
  };

  const handleAnalyzeRepo = async (e) => {
    e.preventDefault();

    if (!repoUrl.trim()) {
      setErrorMessage('GitHub 저장소 URL을 입력해주세요.');
      setShowError(true);
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      setErrorMessage(
        '유효한 GitHub 저장소 URL을 입력해주세요. (예: https://github.com/username/repo)'
      );
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsAnalyzing(true);

    try {
      const result = await analyzeRepository(repoUrl.trim());

      if (result.success) {
        setRepoUrl('');

        // 분석 시작된 저장소를 분석 중 목록에 추가
        const newAnalyzingRepo = {
          id: result.data.repositoryId,
          name: result.data.name,
          fullName: result.data.fullName,
          description: result.data.description || '분석 중인 저장소',
          progress: result.data.progress || 0,
          status: result.data.status || 'analyzing',
          startedAt: result.data.startedAt || new Date().toISOString(),
          estimatedCompletion: result.data.estimatedCompletion,
        };

        setAnalyzingRepositories((prev) => [newAnalyzingRepo, ...prev]);

        // 성공 메시지 표시 (선택사항)
        console.log('저장소 분석이 시작되었습니다:', result.message);
      } else {
        setErrorMessage(result.message);
        setShowError(true);
      }
    } catch (error) {
      console.error('저장소 분석 요청 오류:', error);
      setErrorMessage('저장소 분석 요청 중 오류가 발생했습니다.');
      setShowError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 남은 시간 계산 함수
  const getRemainingTime = (estimatedCompletion) => {
    if (!estimatedCompletion) return '계산 중...';

    const remaining = new Date(estimatedCompletion).getTime() - Date.now();
    if (remaining <= 0) return '완료 예정';

    const minutes = Math.floor(remaining / 60000);
    if (minutes < 1) return '곧 완료';
    return `약 ${minutes}분 남음`;
  };

  // 분석 완료된 저장소 클릭 시 페이지 이동
  const handleRepositoryClick = (repo) => {
    navigate(`/repository/${repo.id}`, {
      state: {
        from: 'dashboard',
        isNewlyAnalyzed: true,
      },
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">대시보드를 로드하는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                  disabled={isAnalyzing}
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
                <AlertDescription>{errorMessage}</AlertDescription>
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
                        <span>진행률: {repo.progress || 0}%</span>
                        <span>
                          {getRemainingTime(repo.estimatedCompletion)}
                        </span>
                      </div>
                      <Progress value={repo.progress || 0} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
                        분석이 완료되면 자동으로 새로운 저장소 목록으로
                        이동됩니다.
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
                <Card
                  key={repo.id}
                  className="h-full transition-all hover:shadow-md dark:hover:shadow-lg cursor-pointer"
                  onClick={() => handleRepositoryClick(repo)}
                >
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
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
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
                    </div>
                    <CardDescription className="line-clamp-2 h-10 dark:text-gray-300">
                      {repo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        분석 완료: {repo.lastAnalyzed || repo.completedAt}
                      </span>
                    </div>
                  </CardContent>
                </Card>
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
              <Button onClick={() => inputRef.current?.focus()}>
                첫 저장소 분석하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
