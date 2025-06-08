import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  ArrowLeft,
  Github,
  MessageSquare,
  ThumbsUp,
  Code,
  Copy,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard-layout';
import { NotificationContext } from '../contexts/notificationContext';
import issueService from '../services/issueService';

export default function IssuePage() {
  const { id: repoId, issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useContext(NotificationContext);
  console.log(`알림 연결 상태: ${isConnected ? '연결됨' : '끊김'}`);

  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      const result = await issueService.getIssueDetail(repoId, issueId);
      if (result.success) {
        setIssue({
          ...result.data,
          repoName:
            result.data.repoName ||
            (result.data.repoFullName
              ? result.data.repoFullName.split('/')[1]
              : ''),
          user: result.data.author,
          createdAt: result.data.createdAtGithub,
          labels: [],
          comments: [],
          aiAnalysis: {
            summary: result.data.summaryGpt || 'AI 요약 정보 없음',
            relatedFiles: [],
            codeSnippets: [],
            suggestion: '',
          },
        });
        // 이슈 상세 조회 시 최근 본 이슈로 저장
        if (result.data.issueId) {
          issueService.saveRecentIssue(result.data.issueId);
        }
      }
      setLoading(false);
    };
    fetchIssue();
  }, [repoId, issueId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">이슈 정보를 불러오는 중...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!issue) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-red-600">이슈를 찾을 수 없습니다</div>
          <Button asChild>
            <Link to={`/repository/${repoId}`}>저장소로 돌아가기</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* 이슈 헤더 */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to={`/repository/${repoId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <h1 className="text-xl font-bold tracking-tight truncate">
                <Link to={`/repository/${repoId}`} className="hover:underline">
                  {issue.repoName}
                </Link>
                <span className="mx-1">/</span>
                <span>이슈 #{issueId}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* 이슈 제목 및 상태 */}
        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={issue.state === 'open' ? 'default' : 'secondary'}
                  className={`px-3 py-1 ${
                    issue.state === 'open' ? 'bg-green-600' : ''
                  }`}
                >
                  {issue.state === 'open' ? '열림' : '닫힘'}
                </Badge>
                <h2 className="text-xl font-semibold">{issue.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  #{issueId}
                </span>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <a
                    href={`https://github.com/${issue.repoFullName}/issues/${issueId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub에서 보기
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* 이슈 본문 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/4">
              {/* 이슈 작성자 정보 및 본문 */}
              <div className="border-b">
                <div className="flex p-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {issue.user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{issue.user}</span>
                      <span className="text-sm text-muted-foreground">
                        작성일: {issue.createdAt}
                      </span>
                    </div>
                    <div className="mt-2 prose prose-sm max-w-none">
                      {issue.body.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {issue.labels.map((label) => (
                        <Badge
                          key={label.name}
                          variant="outline"
                          className="bg-opacity-10"
                          style={{
                            backgroundColor: `${label.color}20`,
                            borderColor: label.color,
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 섹션 */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4">
                  댓글 ({issue.comments.length})
                </h3>
                <div className="space-y-4">
                  {issue.comments.map((comment, index) => (
                    <div key={index} className="border rounded-lg">
                      <div className="bg-muted/30 p-2 px-4 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-gray-600">
                              {comment.user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {comment.user}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-sm">{comment.body}</p>
                      </div>
                      <div className="px-4 py-2 border-t bg-muted/20">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>답글</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 댓글 입력 폼 */}
                <div className="mt-6 border rounded-lg overflow-hidden">
                  <div className="p-2 bg-muted/30 border-b">
                    <span className="text-sm font-medium">댓글 작성</span>
                  </div>
                  <div className="p-4">
                    <textarea
                      className="w-full border rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="이슈에 대한 댓글을 작성하세요..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <Button>댓글 작성</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 - AI 분석 결과 */}
            <div className="md:w-1/4 p-4 border-l">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">AI 분석 요약</h3>
                  <p className="text-sm text-muted-foreground">
                    {issue.aiAnalysis.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">관련 파일</h3>
                  <ul className="space-y-2">
                    {issue.aiAnalysis.relatedFiles.map((file, index) => (
                      <li key={index}>
                        <a
                          href={`https://github.com/${issue.repoFullName}/blob/main/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Code className="h-3.5 w-3.5" />
                          <span>{file.path}</span>
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          관련도: {file.relevance}%
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">코드 스니펫</h3>
                  <Tabs defaultValue="snippet1" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="snippet1" className="flex-1 text-xs">
                        스니펫 1
                      </TabsTrigger>
                      <TabsTrigger value="snippet2" className="flex-1 text-xs">
                        스니펫 2
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="snippet1" className="mt-2">
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                          <pre className="text-xs">
                            <code>
                              {issue.aiAnalysis.codeSnippets[0]
                                ? issue.aiAnalysis.codeSnippets[0].code
                                : ''}
                            </code>
                          </pre>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-muted-foreground">
                            {issue.aiAnalysis.codeSnippets[0]
                              ? issue.aiAnalysis.codeSnippets[0].file
                              : ''}
                          </span>
                          <span className="text-primary">
                            관련도:{' '}
                            {issue.aiAnalysis.codeSnippets[0]
                              ? issue.aiAnalysis.codeSnippets[0].relevance
                              : ''}
                            %
                          </span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="snippet2" className="mt-2">
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                          <pre className="text-xs">
                            <code>
                              {issue.aiAnalysis.codeSnippets[1]
                                ? issue.aiAnalysis.codeSnippets[1].code
                                : ''}
                            </code>
                          </pre>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-muted-foreground">
                            {issue.aiAnalysis.codeSnippets[1]
                              ? issue.aiAnalysis.codeSnippets[1].file
                              : ''}
                          </span>
                          <span className="text-primary">
                            관련도:{' '}
                            {issue.aiAnalysis.codeSnippets[1]
                              ? issue.aiAnalysis.codeSnippets[1].relevance
                              : ''}
                            %
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">AI 해결 제안</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {issue.aiAnalysis.suggestion}
                  </p>
                  <Button size="sm" className="w-full">
                    AI 코드 수정 제안 보기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
