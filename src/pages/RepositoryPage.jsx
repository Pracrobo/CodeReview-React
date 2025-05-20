"use client"

import { Link, useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  GitFork,
  Clock,
  Info,
  Shield,
  FileText,
} from "lucide-react"
import DashboardLayout from "../components/dashboard-layout"
import { mockRepositoryDetails, mockIssues } from "../lib/mock-data"
import { Input } from "../components/ui/input"

export default function RepositoryPage() {
  const { id } = useParams()
  const repoId = id
  const repo = mockRepositoryDetails

  // 라이선스 정보 및 의무사항
  const licenseInfo = {
    MIT: {
      fullName: "MIT License",
      description: "간단하고 관대한 라이선스로, 저작권 및 라이선스 고지만 필요합니다.",
      permissions: ["상업적 사용", "수정", "배포", "개인 사용"],
      conditions: ["라이선스 및 저작권 고지 포함"],
      limitations: ["책임 면제", "보증 없음"],
      color: "blue",
    },
    Apache: {
      fullName: "Apache License 2.0",
      description: "특허권 부여와 함께 사용자에게 자유를 제공하는 라이선스입니다.",
      permissions: ["상업적 사용", "수정", "배포", "특허권 사용", "개인 사용"],
      conditions: ["라이선스 및 저작권 고지 포함", "상태 변경 명시"],
      limitations: ["상표권 사용 금지", "책임 면제", "보증 없음"],
      color: "orange",
    },
    GPL: {
      fullName: "GNU General Public License v3.0",
      description: "수정된 코드를 동일한 라이선스로 공개해야 하는 강력한 카피레프트 라이선스입니다.",
      permissions: ["상업적 사용", "수정", "배포", "특허권 사용", "개인 사용"],
      conditions: ["소스 코드 공개", "라이선스 및 저작권 고지 포함", "동일한 라이선스 사용", "상태 변경 명시"],
      limitations: ["책임 면제", "보증 없음"],
      color: "green",
    },
  }

  // 현재 저장소의 라이선스 정보 (예시로 MIT 사용)
  const currentLicense = licenseInfo.MIT

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <h1 className="text-2xl font-bold tracking-tight">{repo.name}</h1>
              <Badge variant={repo.isPrivate ? "outline" : "secondary"}>{repo.isPrivate ? "비공개" : "공개"}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>마지막 분석: {repo.lastAnalyzed}</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <a href={`https://github.com/${repo.fullName}`} target="_blank" rel="noopener noreferrer">
                GitHub에서 보기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="issues">이슈 목록</TabsTrigger>
            <TabsTrigger value="chatbot">AI 챗봇</TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>README 요약</CardTitle>
                  <CardDescription>AI가 분석한 저장소의 README 요약입니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p>{repo.readmeSummary}</p>
                    <h3 className="text-lg font-medium mt-4">주요 기능</h3>
                    <ul>
                      {repo.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a
                      href={`https://github.com/${repo.fullName}/blob/main/README.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      전체 README 보기
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">저장소 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">주요 언어</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {repo.languages.map((lang) => (
                          <Badge
                            key={lang.name}
                            variant="outline"
                            className="bg-opacity-10"
                            style={{ backgroundColor: `${lang.color}20`, borderColor: lang.color }}
                          >
                            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: lang.color }}></span>
                            {lang.name} {lang.percentage}%
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 라이선스 정보 개선 */}
                    <div className="pt-2">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm font-medium">라이선스</div>
                      </div>

                      <div className="mt-2 p-3 rounded-md border bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={`bg-${currentLicense.color}-50 text-${currentLicense.color}-700 border-${currentLicense.color}-200`}
                          >
                            {currentLicense.fullName}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3">{currentLicense.description}</p>

                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 mb-1">
                              <Shield className="h-3 w-3" />
                              <span>허용 사항</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {currentLicense.permissions.map((permission, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 mb-1">
                              <Info className="h-3 w-3" />
                              <span>조건</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {currentLicense.conditions.map((condition, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 text-xs font-medium text-red-600 mb-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>제한 사항</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {currentLicense.limitations.map((limitation, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                  {limitation}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-center">
                          <a
                            href={`https://github.com/${repo.fullName}/blob/main/LICENSE`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            전체 라이선스 보기
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">최근 업데이트</div>
                      <div className="text-sm text-muted-foreground mt-1">{repo.lastUpdated}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">이슈 통계</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">열린 이슈</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {repo.openIssues}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">닫힌 이슈</span>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {repo.closedIssues}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pull Requests</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {repo.pullRequests}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 이슈 목록 탭 */}
          <TabsContent value="issues" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {mockIssues.map((issue) => (
                <Link to={`/repository/${repoId}/issue/${issue.number}`} key={issue.id}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium">
                          #{issue.number} {issue.title}
                        </CardTitle>
                        <Badge
                          variant={issue.state === "open" ? "default" : "secondary"}
                          className={issue.state === "open" ? "bg-green-500" : ""}
                        >
                          {issue.state === "open" ? "열림" : "닫힘"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {issue.user} 님이 {issue.createdAt}에 작성
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{issue.body}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {issue.labels.map((label) => (
                          <Badge
                            key={label.name}
                            variant="outline"
                            className="bg-opacity-10"
                            style={{ backgroundColor: `${label.color}20`, borderColor: label.color }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* AI 챗봇 탭 */}
          <TabsContent value="chatbot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>컨트리뷰션 가이드 AI 챗봇</CardTitle>
                <CardDescription>저장소의 컨트리뷰션 문서를 학습한 AI 챗봇에게 질문하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
                  <div className="bg-primary-foreground p-3 rounded-lg max-w-[80%] self-start">
                    <p className="text-sm">
                      안녕하세요! {repo.name} 저장소에 대해 어떤 것이든 물어보세요. 컨트리뷰션 방법, 코딩 컨벤션, PR
                      작성 방법 등에 대해 답변해 드릴 수 있습니다.
                    </p>
                  </div>

                  <div className="bg-primary p-3 rounded-lg max-w-[80%] text-primary-foreground self-end">
                    <p className="text-sm">이 프로젝트에 기여하려면 어떻게 해야 하나요?</p>
                  </div>

                  <div className="bg-primary-foreground p-3 rounded-lg max-w-[80%] self-start">
                    <p className="text-sm">{repo.name} 프로젝트에 기여하는 방법은 다음과 같습니다:</p>
                    <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                      <li>저장소를 포크(Fork)하세요.</li>
                      <li>새 브랜치를 생성하세요 (예: `feature/your-feature-name`).</li>
                      <li>변경사항을 커밋하세요.</li>
                      <li>브랜치를 푸시하세요.</li>
                      <li>Pull Request를 생성하세요.</li>
                    </ol>
                    <p className="text-sm mt-2">
                      자세한 내용은{" "}
                      <a
                        href={`https://github.com/${repo.fullName}/blob/main/CONTRIBUTING.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        CONTRIBUTING.md
                      </a>{" "}
                      파일을 참고하세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="질문을 입력하세요..." className="flex-1" />
                  <Button>전송</Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">무료 플랜: 이번 달 남은 메시지 82/100</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
