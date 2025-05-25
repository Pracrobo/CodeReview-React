// 대시보드 페이지에서 사용할 저장소 목록 데이터
export const mockRepositories = [
  {
    id: '1',
    name: 'react-query',
    fullName: 'tanstack/react-query',
    description: '🤖 강력한 비동기 상태 관리 및 서버 상태 유틸리티 라이브러리',
    stars: 35200,
    forks: 2100,
    issues: 42,
    isPrivate: false,
    lastAnalyzed: '2023-05-15',
    isStarred: false,
    isNew: false,
  },
  {
    id: '2',
    name: 'next.js',
    fullName: 'vercel/next.js',
    description: 'React 프레임워크로 풀스택 웹 애플리케이션을 구축하세요',
    stars: 98700,
    forks: 24300,
    issues: 156,
    isPrivate: false,
    lastAnalyzed: '2023-05-18',
    isStarred: true,
    isNew: false,
  },
  {
    id: '3',
    name: 'my-project',
    fullName: 'honggildong/my-project',
    description: '개인 프로젝트 저장소',
    stars: 5,
    forks: 1,
    issues: 8,
    isPrivate: true,
    lastAnalyzed: '2023-05-19',
    isStarred: false,
    isNew: true,
  },
];

// 분석 중인 저장소 목록
export const mockAnalyzingRepositories = [
  {
    id: '4',
    name: 'typescript',
    fullName: 'microsoft/typescript',
    description:
      'TypeScript는 JavaScript의 슈퍼셋으로, 타입을 추가한 프로그래밍 언어입니다.',
    progress: 65,
    startedAt: '2023-05-20T10:30:00Z',
    estimatedCompletion: '2023-05-20T11:15:00Z',
  },
  {
    id: '5',
    name: 'react',
    fullName: 'facebook/react',
    description: '사용자 인터페이스를 만들기 위한 JavaScript 라이브러리',
    progress: 30,
    startedAt: '2023-05-20T10:45:00Z',
    estimatedCompletion: '2023-05-20T11:30:00Z',
  },
];

// 즐겨찾기한 저장소 목록
export const mockStarredRepositories = [
  {
    id: '2',
    name: 'next.js',
    fullName: 'vercel/next.js',
    description: 'React 프레임워크로 풀스택 웹 애플리케이션을 구축하세요',
    stars: 98700,
    forks: 24300,
    issues: 156,
    isPrivate: false,
    lastAnalyzed: '2023-05-18',
    isStarred: true,
    isNew: false,
  },
  {
    id: '6',
    name: 'react',
    fullName: 'facebook/react',
    description: '사용자 인터페이스를 만들기 위한 JavaScript 라이브러리',
    stars: 203500,
    forks: 42300,
    issues: 1024,
    isPrivate: false,
    lastAnalyzed: '2023-05-10',
    isStarred: true,
    isNew: false,
  },
];

// 저장소 상세 페이지에서 사용할 저장소 상세 데이터
export const mockRepositoryDetails = {
  id: '1',
  name: 'react-query',
  fullName: 'tanstack/react-query',
  description: '🤖 강력한 비동기 상태 관리 및 서버 상태 유틸리티 라이브러리',
  stars: 35200,
  forks: 2100,
  issues: 42,
  openIssues: 28,
  closedIssues: 1254,
  pullRequests: 15,
  isPrivate: false,
  lastAnalyzed: '2023-05-15',
  lastUpdated: '2023-05-20',
  license: 'MIT',
  isStarred: false,
  isNew: false,
  languages: [
    { name: 'TypeScript', percentage: 87, color: '#3178c6' },
    { name: 'JavaScript', percentage: 10, color: '#f1e05a' },
    { name: 'HTML', percentage: 3, color: '#e34c26' },
  ],
  readmeSummary:
    'React Query는 React 애플리케이션에서 서버 상태를 가져오고, 캐싱하고, 동기화하고, 업데이트하는 작업을 쉽게 만들어주는 라이브러리입니다. 복잡한 상태 관리 코드 없이도 비동기 데이터를 효율적으로 관리할 수 있습니다.',
  features: [
    '서버 상태 캐싱 및 자동 업데이트',
    '병렬 및 종속 쿼리 지원',
    '페이지네이션 및 무한 스크롤 지원',
    '낙관적 업데이트 및 롤백',
    '자동 가비지 컬렉션 및 캐시 관리',
  ],
};

// 이슈 목록 페이지에서 사용할 이슈 목록 데이터
export const mockIssues = [
  {
    id: '101',
    number: 1234,
    title: 'useQuery가 SSR에서 제대로 작동하지 않는 문제',
    body: 'Next.js 앱에서 useQuery를 사용할 때 SSR 중에 데이터를 가져오지 못하는 문제가 있습니다. 서버 컴포넌트에서 사용할 때 특히 문제가 됩니다.',
    state: 'open',
    user: 'user123',
    createdAt: '2023-05-10',
    repoName: 'react-query',
    repoId: '1',
    isPinned: true,
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'help wanted', color: '#0e8a16' },
    ],
  },
  {
    id: '102',
    number: 1235,
    title: 'useMutation 타입 추론 개선 제안',
    body: 'useMutation 훅의 타입 추론을 개선하여 더 나은 개발자 경험을 제공하면 좋겠습니다. 현재는 복잡한 제네릭 타입을 직접 지정해야 하는 경우가 많습니다.',
    state: 'open',
    user: 'devUser456',
    createdAt: '2023-05-12',
    repoName: 'react-query',
    repoId: '1',
    isPinned: false,
    labels: [
      { name: 'enhancement', color: '#a2eeef' },
      { name: 'typescript', color: '#3178c6' },
    ],
  },
  {
    id: '103',
    number: 1236,
    title: '문서에 React 18 관련 내용 추가 필요',
    body: 'React 18의 새로운 기능과 함께 React Query를 사용하는 방법에 대한 문서가 필요합니다. 특히 Suspense와의 통합에 대한 가이드가 있으면 좋겠습니다.',
    state: 'open',
    user: 'docWriter789',
    createdAt: '2023-05-14',
    repoName: 'react-query',
    repoId: '1',
    isPinned: false,
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'good first issue', color: '#7057ff' },
    ],
  },
  {
    id: '104',
    number: 1237,
    title: '캐시 무효화 API 개선',
    body: '특정 조건에서 캐시를 무효화하는 더 유연한 API가 필요합니다. 현재는 queryKey 기반으로만 무효화할 수 있어 제한적입니다.',
    state: 'closed',
    user: 'cacheExpert',
    createdAt: '2023-05-05',
    repoName: 'react-query',
    repoId: '1',
    isPinned: false,
    labels: [
      { name: 'enhancement', color: '#a2eeef' },
      { name: 'fixed', color: '#0e8a16' },
    ],
  },
  {
    id: '201',
    number: 45678,
    title: 'App Router에서 getStaticProps 대체 방법 문서화 필요',
    body: 'Next.js 13 App Router에서 기존 Pages Router의 getStaticProps를 대체하는 방법에 대한 명확한 문서가 필요합니다.',
    state: 'open',
    user: 'nextUser123',
    createdAt: '2023-05-16',
    repoName: 'next.js',
    repoId: '2',
    isPinned: true,
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'app-router', color: '#fbca04' },
    ],
  },
];

// 최근 본 이슈 목록
export const mockRecentIssues = [
  {
    id: '101',
    number: 1234,
    title: 'useQuery가 SSR에서 제대로 작동하지 않는 문제',
    repoName: 'react-query',
    repoId: '1',
    viewedAt: '2023-05-20',
    isPinned: true,
    body: 'Next.js 앱에서 useQuery를 사용할 때 SSR 중에 데이터를 가져오지 못하는 문제가 있습니다. 서버 컴포넌트에서 사용할 때 특히 문제가 됩니다.',
    state: 'open',
    user: 'user123',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'help wanted', color: '#0e8a16' },
    ],
  },
  {
    id: '201',
    number: 45678,
    title: 'App Router에서 getStaticProps 대체 방법 문서화 필요',
    repoName: 'next.js',
    repoId: '2',
    viewedAt: '2023-05-19',
    isPinned: true,
    body: 'Next.js 13 App Router에서 기존 Pages Router의 getStaticProps를 대체하는 방법에 대한 명확한 문서가 필요합니다.',
    state: 'open',
    user: 'nextUser123',
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'app-router', color: '#fbca04' },
    ],
  },
  {
    id: '102',
    number: 1235,
    title: 'useMutation 타입 추론 개선 제안',
    repoName: 'react-query',
    repoId: '1',
    viewedAt: '2023-05-18',
    isPinned: false,
    body: 'useMutation 훅의 타입 추론을 개선하여 더 나은 개발자 경험을 제공하면 좋겠습니다. 현재는 복잡한 제네릭 타입을 직접 지정해야 하는 경우가 많습니다.',
    state: 'open',
    user: 'devUser456',
    labels: [
      { name: 'enhancement', color: '#a2eeef' },
      { name: 'typescript', color: '#3178c6' },
    ],
  },
  {
    id: '103',
    number: 1236,
    title: '문서에 React 18 관련 내용 추가 필요',
    repoName: 'react-query',
    repoId: '1',
    viewedAt: '2023-05-17',
    isPinned: false,
    body: 'React 18의 새로운 기능과 함께 React Query를 사용하는 방법에 대한 문서가 필요합니다. 특히 Suspense와의 통합에 대한 가이드가 있으면 좋겠습니다.',
    state: 'open',
    user: 'docWriter789',
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'good first issue', color: '#7057ff' },
    ],
  },
];

// 이슈 상세 페이지에서 사용할 이슈 상세 데이터
export const mockIssueDetails = {
  id: '101',
  number: 1234,
  title: 'useQuery가 SSR에서 제대로 작동하지 않는 문제',
  body: "Next.js 앱에서 useQuery를 사용할 때 SSR 중에 데이터를 가져오지 못하는 문제가 있습니다. 서버 컴포넌트에서 사용할 때 특히 문제가 됩니다.\n\n재현 단계:\n1. Next.js 13 앱 라우터 프로젝트 생성\n2. 서버 컴포넌트에서 useQuery 사용 시도\n3. 'useQuery는 클라이언트 컴포넌트에서만 사용할 수 있습니다' 오류 발생\n\n예상 동작: SSR 중에도 데이터를 가져올 수 있어야 합니다.",
  state: 'open',
  user: 'user123',
  createdAt: '2023-05-10',
  repoName: 'react-query',
  repoFullName: 'tanstack/react-query',
  isPinned: true,
  labels: [
    { name: 'bug', color: '#d73a4a' },
    { name: 'help wanted', color: '#0e8a16' },
  ],
  comments: [
    {
      user: 'maintainer456',
      body: '이 문제는 React Query가 React 훅을 사용하기 때문에 발생합니다. Next.js 13의 서버 컴포넌트에서는 React 훅을 사용할 수 없습니다. 대신 클라이언트 컴포넌트에서 useQuery를 사용하거나, 서버 컴포넌트에서는 직접 fetch를 사용해야 합니다.',
      createdAt: '2023-05-11',
      likes: 5,
    },
    {
      user: 'user123',
      body: "이해했습니다. 그렇다면 서버 컴포넌트와 함께 사용할 수 있는 별도의 API를 제공하는 것이 좋을 것 같습니다. 예를 들어 'getQueryData'와 같은 함수를 제공하면 어떨까요?",
      createdAt: '2023-05-12',
      likes: 2,
    },
    {
      user: 'contributor789',
      body: '관련 PR을 작업 중입니다. Next.js 13 앱 라우터와 함께 사용할 수 있는 새로운 API를 추가할 예정입니다. 다음 주에 PR을 제출할 수 있을 것 같습니다.',
      createdAt: '2023-05-15',
      likes: 8,
    },
  ],
  aiAnalysis: {
    summary:
      '이 이슈는 React Query의 useQuery 훅이 Next.js 13의 서버 컴포넌트에서 작동하지 않는 문제에 관한 것입니다. 이는 React 훅이 서버 컴포넌트에서 지원되지 않기 때문에 발생하는 제한사항입니다.',
    relatedFiles: [
      {
        path: 'src/useQuery.ts',
        relevance: 95,
      },
      {
        path: 'src/core/queryClient.ts',
        relevance: 80,
      },
      {
        path: 'examples/nextjs/pages/index.tsx',
        relevance: 75,
      },
    ],
    codeSnippets: [
      {
        file: 'src/useQuery.ts',
        code: 'export function useQuery(options) {\n  const queryClient = useQueryClient()\n  // React 훅 사용\n  const [state, setState] = React.useState()\n  \n  // 이 부분이 서버 컴포넌트에서 문제가 됨\n  React.useEffect(() => {\n    // 데이터 페칭 로직\n  }, [])\n  \n  return state\n}',
        relevance: 95,
      },
      {
        file: 'examples/nextjs/pages/index.tsx',
        code: "// Next.js 페이지 컴포넌트\nexport default function Home() {\n  // 클라이언트 사이드에서만 작동\n  const { data, isLoading } = useQuery({\n    queryKey: ['todos'],\n    queryFn: fetchTodos,\n  })\n  \n  if (isLoading) return <div>로딩 중...</div>\n  \n  return (\n    <div>\n      {data.map(todo => (\n        <div key={todo.id}>{todo.title}</div>\n      ))}\n    </div>\n  )\n}",
        relevance: 85,
      },
    ],
    suggestion:
      "이 문제를 해결하기 위해서는 Next.js 13 앱 라우터에서 'use client' 지시문을 사용하여 클라이언트 컴포넌트를 명시적으로 선언하고, 그 안에서 useQuery를 사용해야 합니다. 또는 서버 컴포넌트에서 사용할 수 있는 별도의 데이터 페칭 API를 개발하는 것이 좋을 것 같습니다.",
  },
};
