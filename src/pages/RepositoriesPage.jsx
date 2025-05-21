"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertCircle, Github, Plus, Search, Star, GitFork, Clock } from "lucide-react"
import DashboardLayout from "../components/dashboard-layout"
import { mockRepositories, mockStarredRepositories } from "../lib/mock-data"

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [repositories, setRepositories] = useState(mockRepositories)
  const [starredRepositories, setStarredRepositories] = useState(mockStarredRepositories)

  const toggleStar = (e, repoId) => {
    e.preventDefault()
    e.stopPropagation()

    // 저장소 목록 업데이트
    const updatedRepositories = repositories.map((repo) => {
      if (repo.id === repoId) {
        return { ...repo, isStarred: !repo.isStarred }
      }
      return repo
    })
    setRepositories(updatedRepositories)

    // 즐겨찾기 목록 업데이트
    const repo = repositories.find((r) => r.id === repoId)
    if (repo) {
      if (repo.isStarred) {
        // 즐겨찾기 해제
        setStarredRepositories(starredRepositories.filter((r) => r.id !== repoId))
      } else {
        // 즐겨찾기 추가
        setStarredRepositories([...starredRepositories, { ...repo, isStarred: true }])
      }
    }
  }

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredStarredRepositories = starredRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderRepositoryCard = (repo) => (
    <Card key={repo.id} className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            <CardTitle className="text-base font-medium">{repo.name}</CardTitle>
            {repo.isNew && <Badge className="bg-green-500">NEW</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={repo.isPrivate ? "outline" : "secondary"}>{repo.isPrivate ? "비공개" : "공개"}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => toggleStar(e, repo.id)}>
              <Star className={`h-4 w-4 ${repo.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10">{repo.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
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
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>마지막 분석: {repo.lastAnalyzed}</span>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">저장소</h1>
            <p className="text-muted-foreground">분석한 GitHub 저장소 목록을 확인하세요</p>
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
                  <CardContent className="flex flex-col items-center justify-center h-full p-6">
                    <div className="rounded-full bg-purple-100 p-3 mb-4">
                      <Plus className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-center text-muted-foreground mb-4">
                      새 GitHub 저장소를 분석하고 AI의 도움을 받아보세요
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/dashboard">저장소 추가하기</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Github className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery ? "검색 결과가 없습니다" : "아직 분석한 저장소가 없습니다"}
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {searchQuery
                      ? "다른 검색어로 다시 시도해보세요"
                      : "GitHub 저장소 URL을 입력하여 AI 분석을 시작해보세요"}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link to="/dashboard">첫 저장소 분석하기</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="starred">
            {filteredStarredRepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStarredRepositories.map((repo) => (
                  <Link to={`/repository/${repo.id}`} key={repo.id}>
                    {renderRepositoryCard(repo)}
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-amber-100 p-3 mb-4">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery ? "검색 결과가 없습니다" : "즐겨찾기한 저장소가 없습니다"}
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {searchQuery
                      ? "다른 검색어로 다시 시도해보세요"
                      : "저장소 목록에서 별표 아이콘을 클릭하여 자주 사용하는 저장소를 즐겨찾기하세요"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
