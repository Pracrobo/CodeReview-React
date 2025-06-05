import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  AlertCircle,
  Github,
  Plus,
  Search,
  Star,
  GitFork,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard-layout';
import {
  getUserRepositories,
  removeRepositoryFromTracking,
  updateFavoriteStatus,
} from '../services/repositoryService';
import { transformRepositoryData } from '../utils/dataTransformers';
import { getLanguageColor } from '../utils/languageUtils';

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [favoriteRepositories, setFavoriteRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 저장소 목록 로드
  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getUserRepositories();

      if (result.success) {
        const transformedRepos = result.data.map(transformRepositoryData);
        setRepositories(transformedRepos);

        // 즐겨찾기 필터링
        const favorite = transformedRepos.filter((repo) => repo.isFavorite);
        setFavoriteRepositories(favorite);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('저장소 목록을 불러오는데 실패했습니다.');
      console.error('저장소 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavoriteStatus = async (e, repoId) => {
    e.preventDefault();
    e.stopPropagation();

    const repo = repositories.find((r) => r.id === repoId);
    if (!repo) return;

    try {
      const result = await updateFavoriteStatus(repoId, !repo.isFavorite);
      if (result.success) {
        const updatedRepositories = repositories.map((repo) =>
          repo.id === repoId ? { ...repo, isFavorite: !repo.isFavorite } : repo
        );
        setRepositories(updatedRepositories);

        if (repo.isFavorite) {
          setFavoriteRepositories(
            favoriteRepositories.filter((r) => r.id !== repoId)
          );
        } else {
          setFavoriteRepositories([
            ...favoriteRepositories,
            { ...repo, isFavorite: true },
          ]);
        }
      } else {
        alert(result.message || '즐겨찾기 상태 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.error('즐겨찾기 상태 업데이트 오류:', err);
      alert('즐겨찾기 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteRepository = async (e, githubRepoId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('정말로 이 저장소를 삭제하시겠습니까?')) return;

    try {
      const result = await removeRepositoryFromTracking(githubRepoId);

      if (result.success) {
        // 성공 시 목록 새로고침
        await loadRepositories();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('저장소 삭제에 실패했습니다.');
      console.error('저장소 삭제 오류:', err);
    }
  };

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFavoriteRepositories = favoriteRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRepositoryCard = (repo) => (
    <Card key={repo.id} className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Github className="h-5 w-5" />
          <CardTitle className="text-base font-medium">{repo.name}</CardTitle>
          {repo.isNew && <Badge className="bg-green-500">NEW</Badge>}
          {repo.analysisStatus === 'completed' && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              분석완료
            </Badge>
          )}
          {repo.analysisStatus === 'analyzing' && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              분석중
            </Badge>
          )}
          <Badge variant={repo.isPrivate ? 'outline' : 'secondary'}>
            {repo.isPrivate ? '비공개' : '공개'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => toggleFavoriteStatus(e, repo.id)}
          >
            <Star
              className={`h-4 w-4 ${
                repo.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
              }`}
            />
          </Button>
        </div>
        <CardDescription className="line-clamp-2 h-10">
          {repo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{repo.issues}개 이슈</span>
          </div>
        </div>
        {/* 주요 언어 표시 */}
        {repo.language && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <span className="font-medium">{repo.language}</span>
              {repo.languagePercentage && (
                <span className="text-muted-foreground">
                  {repo.languagePercentage.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>마지막 분석: {repo.lastAnalyzed}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-red-600 hover:text-red-800"
          onClick={(e) => handleDeleteRepository(e, repo.githubRepoId)}
        >
          삭제
        </Button>
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">저장소 목록을 불러오는 중...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-red-600">오류가 발생했습니다</div>
          <div className="text-sm text-gray-600">{error}</div>
          <Button onClick={loadRepositories}>다시 시도</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">저장소</h1>
            <p className="text-muted-foreground">
              분석한 GitHub 저장소 목록을 확인하세요
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="저장소 검색"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">모든 저장소</TabsTrigger>
            <TabsTrigger value="starred">즐겨찾기</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {filteredRepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRepositories.map((repo) => (
                  <Link to={`/repository/${repo.id}`} key={repo.id}>
                    {renderRepositoryCard(repo)}
                  </Link>
                ))}

                <Card className="h-full border-dashed">
                  <Link to="/dashboard" state={{ from: 'repositories' }}>
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 pt-4">
                      <div className="rounded-full bg-purple-100 p-3 mb-4">
                        <Plus className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold leading-none tracking-tight mb-2">
                        저장소 추가하기
                      </h3>
                      <p className="text-center text-muted-foreground">
                        새 GitHub 저장소를 분석하고 AI의 도움을 받아보세요
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 pt-6">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Github className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery
                      ? '검색 결과가 없습니다'
                      : '아직 분석한 저장소가 없습니다'}
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {searchQuery
                      ? '다른 검색어로 다시 시도해보세요'
                      : 'GitHub 저장소 URL을 입력하여 AI 분석을 시작해보세요'}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link to="/dashboard">저장소 분석하기</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="starred">
            {filteredFavoriteRepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavoriteRepositories.map((repo) => (
                  <Link to={`/repository/${repo.id}`} key={repo.id}>
                    {renderRepositoryCard(repo)}
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 pt-6">
                  <div className="rounded-full bg-amber-100 p-3 mb-4">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery
                      ? '검색 결과가 없습니다'
                      : '즐겨찾기한 저장소가 없습니다'}
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {searchQuery
                      ? '다른 검색어로 다시 시도해보세요'
                      : '저장소 목록에서 별표 아이콘을 클릭하여 자주 사용하는 저장소를 즐겨찾기하세요'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
