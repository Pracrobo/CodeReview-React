import { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { AlertCircle, Clock, Pin, PinOff, Search } from 'lucide-react';
import DashboardLayout from '../components/dashboard-layout';
import { NotificationContext } from '../contexts/notificationContext';
import repositoryService from '../services/repositoryService';
import issueService from '../services/issueService';

const PAGE_SIZE = 20;

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentIssues, setRecentIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [allIssuesPage, setAllIssuesPage] = useState(0);
  const [allIssuesHasMore, setAllIssuesHasMore] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const { isConnected } = useContext(NotificationContext);
  console.log(`알림 연결 상태: ${isConnected ? '연결됨' : '끊김'}`);

  // 여러 저장소 id를 가져오는 함수 (예시: 내 트래킹 저장소)
  const [repoIds, setRepoIds] = useState([]);

  useEffect(() => {
    // 내 저장소 목록에서 repoId만 추출
    const fetchRepoIds = async () => {
      const result = await repositoryService.getUserRepositories();
      if (result.success) {
        setRepoIds(result.data.map((repo) => repo.repoId));
      }
    };
    fetchRepoIds();
  }, []);

  // 모든 이슈 불러오기 (무한 스크롤/페이지네이션)
  const fetchAllIssues = useCallback(
    async (reset = false) => {
      if (loadingAll || repoIds.length === 0) return;
      setLoadingAll(true);
      const page = reset ? 0 : allIssuesPage;
      const result = await issueService.getIssuesByRepoIds({
        repoIds,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchQuery,
      });
      if (result.success) {
        const newIssues = result.data.map((issue) => ({
          ...issue,
          repoName:
            issue.repoName ||
            (issue.repoFullName ? issue.repoFullName.split('/')[1] : ''), // 저장소명 보정
          viewedAt: issue.viewedAt || issue.createdAtGithub || '',
          isPinned: false,
          labels: issue.labels || [],
        }));
        setAllIssues((prev) => (reset ? newIssues : [...prev, ...newIssues]));
        setAllIssuesHasMore(newIssues.length === PAGE_SIZE);
        setAllIssuesPage(reset ? 1 : page + 1);
      }
      setLoadingAll(false);
    },
    [repoIds, allIssuesPage, searchQuery, loadingAll]
  );

  // 최근 본 이슈 불러오기
  const fetchRecentIssues = useCallback(async () => {
    setLoadingRecent(true);
    const result = await issueService.getRecentIssues({
      limit: PAGE_SIZE,
      offset: 0,
    });
    if (result.success) {
      setRecentIssues(
        result.data.map((issue) => ({
          ...issue,
          repoName:
            issue.repoName ||
            (issue.repoFullName ? issue.repoFullName.split('/')[1] : ''),
          isPinned: false,
          labels: issue.labels || [],
        }))
      );
    }
    setLoadingRecent(false);
  }, []);

  // 검색어 변경/저장소 변경 시 이슈 목록 초기화
  useEffect(() => {
    setAllIssues([]);
    setAllIssuesPage(0);
    setAllIssuesHasMore(true);
    if (repoIds.length > 0) fetchAllIssues(true);
  }, [repoIds, searchQuery]);

  // 최근 본 이슈 최초 로딩
  useEffect(() => {
    fetchRecentIssues();
  }, []);

  // 무한 스크롤: 스크롤 하단 도달 시 추가 로딩
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        allIssuesHasMore &&
        !loadingAll
      ) {
        fetchAllIssues();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchAllIssues, allIssuesHasMore, loadingAll]);

  // 핀 고정/해제 (localStorage 활용 예시)
  const togglePin = (issueId) => {
    setRecentIssues((prev) =>
      prev.map((issue) =>
        issue.issueId === issueId
          ? { ...issue, isPinned: !issue.isPinned }
          : issue
      )
    );
    setAllIssues((prev) =>
      prev.map((issue) =>
        issue.issueId === issueId
          ? { ...issue, isPinned: !issue.isPinned }
          : issue
      )
    );
  };

  const filteredIssues = allIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.repoName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 고정된 이슈를 상단에 표시
  const sortIssues = (issues) => {
    return [...issues].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        new Date(b.viewedAt || b.createdAtGithub || 0).getTime() -
        new Date(a.viewedAt || a.createdAtGithub || 0).getTime()
      );
    });
  };

  const sortedRecentIssues = sortIssues(recentIssues);
  const sortedAllIssues = useMemo(
    () => sortIssues(filteredIssues),
    [filteredIssues]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">
              이슈
            </h1>
            <p className="text-muted-foreground dark:text-gray-300">
              최근 본 이슈와 모든 이슈를 확인하고 관리하세요
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="이슈 검색"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">최근 본 이슈</TabsTrigger>
            <TabsTrigger value="all">모든 이슈</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            {loadingRecent ? (
              <div className="text-center py-8">
                최근 본 이슈를 불러오는 중...
              </div>
            ) : sortedRecentIssues.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedRecentIssues.map((issue) => (
                  <Card
                    key={issue.issueId}
                    className="transition-all hover:shadow-md dark:hover:shadow-lg"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            >
                              {issue.repoName}
                            </Badge>
                            <Badge
                              variant={
                                issue.state === 'open' ? 'default' : 'secondary'
                              }
                              className={
                                issue.state === 'open'
                                  ? 'bg-green-500 dark:bg-green-600'
                                  : 'dark:bg-gray-600 dark:text-gray-200'
                              }
                            >
                              {issue.state === 'open' ? '열림' : '닫힘'}
                            </Badge>
                            <CardDescription className="dark:text-gray-400">
                              #{issue.githubIssueNumber}
                            </CardDescription>
                          </div>
                          <Link
                            to={`/repository/${issue.repoId}/issue/${issue.githubIssueNumber}`}
                          >
                            <CardTitle className="text-base font-medium hover:text-primary dark:text-white dark:hover:text-purple-400">
                              {issue.title}
                            </CardTitle>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault();
                              togglePin(issue.issueId);
                            }}
                          >
                            {issue.isPinned ? (
                              <Pin className="h-4 w-4 fill-purple-600 text-purple-600" />
                            ) : (
                              <PinOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 dark:text-gray-300">
                        {issue.body}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {issue.labels.map((label) => (
                          <Badge
                            key={label.name}
                            variant="outline"
                            className="bg-opacity-10 dark:border-opacity-50"
                            style={{
                              backgroundColor: `${label.color}20`,
                              borderColor: label.color,
                            }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="dark:text-gray-400">
                          마지막 조회: {issue.viewedAt}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 pt-4">
                  <div className="rounded-full bg-purple-100 p-3 mb-4 dark:bg-purple-900/30">
                    <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 dark:text-white">
                    최근 본 이슈가 없습니다
                  </h3>
                  <p className="text-center text-muted-foreground mb-4 dark:text-gray-300">
                    저장소에서 이슈를 확인하면 이 곳에 표시됩니다
                  </p>
                  <Button asChild>
                    <Link to="/dashboard">저장소 목록으로 이동</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="all" className="space-y-4">
            {loadingAll && allIssues.length === 0 ? (
              <div className="text-center py-8">이슈를 불러오는 중...</div>
            ) : sortedAllIssues.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedAllIssues.map((issue) => (
                  <Card
                    key={issue.issueId}
                    className="transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            >
                              {issue.repoName}
                            </Badge>
                            <Badge
                              variant={
                                issue.state === 'open' ? 'default' : 'secondary'
                              }
                              className={
                                issue.state === 'open'
                                  ? 'bg-green-500 dark:bg-green-600'
                                  : 'dark:bg-gray-600 dark:text-gray-200'
                              }
                            >
                              {issue.state === 'open' ? '열림' : '닫힘'}
                            </Badge>
                            <CardDescription className="dark:text-gray-400">
                              #{issue.githubIssueNumber}
                            </CardDescription>
                          </div>
                          <Link
                            to={`/repository/${issue.repoId}/issue/${issue.githubIssueNumber}`}
                          >
                            <CardTitle className="text-base font-medium hover:text-primary dark:text-white dark:hover:text-purple-400">
                              {issue.title}
                            </CardTitle>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault();
                              togglePin(issue.issueId);
                            }}
                          >
                            {issue.isPinned ? (
                              <Pin className="h-4 w-4 fill-purple-600 text-purple-600" />
                            ) : (
                              <PinOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 dark:text-gray-300">
                        {issue.body}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {issue.labels.map((label) => (
                          <Badge
                            key={label.name}
                            variant="outline"
                            className="bg-opacity-10 dark:border-opacity-50"
                            style={{
                              backgroundColor: `${label.color}20`,
                              borderColor: label.color,
                            }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="dark:text-gray-400">
                          {issue.author} 님이 {issue.createdAtGithub}에 작성
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {allIssuesHasMore && (
                  <div className="text-center py-4">
                    <Button
                      onClick={() => fetchAllIssues()}
                      disabled={loadingAll}
                    >
                      더 불러오기
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 pt-4">
                  <div className="rounded-full bg-purple-100 p-3 mb-4 dark:bg-purple-900/30">
                    <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 dark:text-white">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-center text-muted-foreground mb-4 dark:text-gray-300">
                    다른 검색어로 다시 시도해보세요
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
