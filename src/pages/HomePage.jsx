import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  ChevronDown,
  Code,
  MessageSquare,
  BarChart,
  Globe,
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 히어로 섹션 */}
      <section className="relative w-full py-24 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-700">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />
        <div className="container relative z-10 px-4 mx-auto">
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI로 GitHub 이슈 분석을 더 스마트하게
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Aissue는 AI를 활용하여 GitHub 저장소의 이슈를 분석하고, 관련
              코드를 추천하며, 컨트리뷰션 가이드를 제공하여 개발자의 생산성을
              향상시키는 서비스입니다.
            </p>
            <div className="flex flex-col gap-4 mt-10 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-700 hover:bg-white/90"
              >
                <Link to="/dashboard">무료로 시작하기</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white/20 text-white border-white hover:bg-white/30 font-medium"
              >
                <a href="#features">자세히 알아보기</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section
        id="features"
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container px-4 mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Aissue의 주요 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI 기술로 GitHub 이슈 해결을 혁신하는 4가지 핵심 기능을 소개합니다
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          {/* 기능 카드들 */}
          <div className="space-y-32">
            {/* 기능 1: 이슈-코드 매칭 */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* 텍스트 영역 */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                          <Code className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                          AI 매칭
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      AI 기반 이슈-코드 매칭
                    </h3>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      GitHub 이슈 내용을 AI가 깊이 분석하여 관련성이 높은 코드
                      스니펫, 파일, 함수를 자동으로 추천합니다. 더 이상 코드를
                      일일이 찾아보지 마세요.
                    </p>

                    <div className="space-y-4">
                      {[
                        '이슈 내용 기반 관련 코드 자동 추천',
                        '코드 구조 분석 및 의미 기반 검색',
                        '파일 경로, 코드 스니펫, 관련도 시각화',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 이미지 영역 */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100"></div>
                    <div className="relative p-8 lg:p-12 h-full flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <img
                          src="/이슈목록.png?height=300&width=400"
                          alt="이슈-코드 매칭 기능 예시"
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 기능 2: 컨트리뷰션 가이드 AI 챗봇 */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row-reverse">
                  {/* 텍스트 영역 */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                          AI 챗봇
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      컨트리뷰션 가이드 AI 챗봇
                    </h3>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      프로젝트의 컨트리뷰션 문서를 학습한 AI가 코딩 컨벤션, PR
                      작성 방법을 실시간으로 안내합니다. 복잡한 문서를 찾아볼
                      필요 없이 바로 질문하세요.
                    </p>

                    <div className="space-y-4">
                      {[
                        '프로젝트 문서 기반 맞춤형 답변',
                        '코딩 컨벤션, 기여 방법 안내',
                        '자연스러운 대화형 인터페이스',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 이미지 영역 */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100"></div>
                    <div className="relative p-8 lg:p-12 h-full flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <img
                          src="/저장소-AI챗봇.png?height=300&width=400"
                          alt="컨트리뷰션 가이드 AI 챗봇 예시"
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 기능 3: 다국어 한글화 지원 */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* 텍스트 영역 */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg">
                          <Globe className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                          다국어 지원
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      스마트 한글화 지원
                    </h3>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      영어나 다른 언어로 작성된 README, 이슈, 문서를 AI가 맥락을
                      고려하여 자연스러운 한국어로 번역합니다. 언어 장벽 없이
                      글로벌 프로젝트에 참여하세요.
                    </p>

                    <div className="space-y-4">
                      {[
                        '영문 README 및 문서 한글 번역',
                        '이슈 및 PR 내용 자동 한글화',
                        '기술 용어 맥락에 맞는 정확한 번역',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 이미지 영역 */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-100"></div>
                    <div className="relative p-8 lg:p-12 h-full flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <img
                          src="/이슈디테일.png?height=300&width=400"
                          alt="다국어 한글화 지원 예시"
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 기능 4: 저장소 분석 및 요약 */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row-reverse">
                  {/* 텍스트 영역 */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-700 flex items-center justify-center shadow-lg">
                          <BarChart className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          4
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 bg-fuchsia-100 text-fuchsia-700 text-sm font-medium rounded-full">
                          AI 분석
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      인텔리전트 저장소 분석
                    </h3>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      GitHub 저장소의 구조, 문서, 이슈를 AI가 종합 분석하여
                      프로젝트의 핵심 정보를 한눈에 파악할 수 있도록 정리해
                      드립니다.
                    </p>

                    <div className="space-y-4">
                      {[
                        'README AI 요약 및 원본 보기',
                        '주요 사용 언어, 라이선스 정보',
                        '이슈 목록 및 트렌드 분석',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-600 flex items-center justify-center mr-4 flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 이미지 영역 */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100 to-pink-100"></div>
                    <div className="relative p-8 lg:p-12 h-full flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <img
                          src="/저장소-이슈목록.png?height=300&width=400"
                          alt="저장소 분석 및 요약 예시"
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container px-4 mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              합리적인 요금제
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              무료 플랜으로 시작하여 Aissue의 핵심 기능을 체험해보세요. 더 많은
              저장소 분석과 고급 기능이 필요하다면 Pro 플랜으로
              업그레이드하세요.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 무료 플랜 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              {/* 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -mr-16 -mt-16 opacity-50"></div>

              <div className="relative">
                {/* 헤더 */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      무료 플랜
                    </h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mt-1">
                      시작하기 좋은
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-lg">
                  Aissue의 핵심 기능을 체험해보세요.
                </p>

                {/* 가격 */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">₩0</span>
                    <span className="text-xl text-gray-600 ml-2">/월</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">영원히 무료</p>
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-4 mb-8">
                  {[
                    '월 3개 공개 저장소 분석',
                    '기본 수준 이슈-코드 매칭',
                    'AI 챗봇 월 100 메시지 제한',
                    '공개 저장소만 지원',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg"
                >
                  <Link to="/dashboard">무료로 시작하기</Link>
                </Button>
              </div>
            </div>

            {/* Pro 플랜 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200 relative overflow-hidden">
              {/* 인기 배지 */}

              {/* 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>

              <div className="relative">
                {/* 헤더 */}
                <div className="flex items-center mb-6 mt-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pro 플랜
                    </h3>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full mt-1">
                      전문가용
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-lg">
                  더 많은 분석과 고급 기능을 이용하세요.
                </p>

                {/* 가격 */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      ₩10,000
                    </span>
                    <span className="text-xl text-gray-600 ml-2">/월</span>
                  </div>
                  <p className="text-sm text-purple-600 mt-1 font-medium">
                    월간 구독
                  </p>
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-4 mb-8">
                  {[
                    '월 30개 이상 저장소 분석',
                    '고급 이슈-코드 매칭 및 분석',
                    'AI 챗봇 무제한 사용',
                    '우선 지원 및 업데이트',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg"
                >
                  <Link to="/dashboard">Pro 시작하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            지금 바로 Aissue를 경험해보세요
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            AI의 힘으로 GitHub 이슈 분석과 코드 기여를 더 효율적으로
            만들어보세요. 무료 플랜으로 시작하여 Aissue의 가치를 직접
            확인하세요.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-700 hover:bg-white/90"
          >
            <Link to="/dashboard">무료로 시작하기</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
