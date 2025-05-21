import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>홈으로 돌아가기</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">쿠키 정책</h1>
            <p className="text-muted-foreground">최종 업데이트: 2023년 5월 20일</p>
          </div>

          <div className="prose prose-sm sm:prose max-w-none">
            <p>
              본 쿠키 정책은 Mai Nova(이하 "회사")가 운영하는 AIssue 서비스(이하 "서비스")에서 쿠키 및 유사 기술을
              어떻게 사용하는지에 대한 정보를 제공합니다. 이 정책을 통해 회사가 사용하는 쿠키의 유형, 목적, 관리 방법
              등을 안내드립니다.
            </p>

            <h2>1. 쿠키란 무엇인가요?</h2>
            <p>
              쿠키는 이용자가 웹사이트를 방문할 때 이용자의 컴퓨터나 모바일 기기에 저장되는 작은 텍스트 파일입니다.
              쿠키는 웹사이트가 이용자의 기기를 인식하고, 이용자의 선호도를 기억하며, 웹사이트 이용 경험을 개선하는 데
              도움을 줍니다. 쿠키는 이용자의 개인 정보를 수집하지 않으며, 이용자의 컴퓨터에 저장된 데이터를 손상시키거나
              감염시키지 않습니다.
            </p>

            <h2>2. 회사가 사용하는 쿠키의 유형</h2>
            <p>회사는 다음과 같은 유형의 쿠키를 사용합니다:</p>
            <ul>
              <li>
                <strong>필수 쿠키:</strong> 서비스의 기본 기능을 제공하고 보안을 유지하는 데 필요한 쿠키입니다. 이러한
                쿠키는 서비스 이용에 필수적이므로 비활성화할 수 없습니다.
              </li>
              <li>
                <strong>기능 쿠키:</strong> 이용자의 선호도와 설정을 기억하여 서비스 이용 경험을 개선하는 쿠키입니다.
                예를 들어, 언어 선택, 로그인 상태 유지 등의 기능을 제공합니다.
              </li>
              <li>
                <strong>분석 쿠키:</strong> 이용자가 서비스를 어떻게 이용하는지에 대한 정보를 수집하여 서비스 개선에
                활용하는 쿠키입니다. 이러한 쿠키는 이용자의 서비스 방문 횟수, 페이지 체류 시간, 오류 발생 여부 등의
                정보를 수집합니다.
              </li>
              <li>
                <strong>마케팅 쿠키:</strong> 이용자의 관심사에 맞는 광고를 제공하기 위해 사용되는 쿠키입니다. 이러한
                쿠키는 이용자의 브라우징 활동을 추적하여 이용자의 관심사를 파악하고, 관련 광고를 제공하는 데 사용됩니다.
              </li>
            </ul>

            <h2>3. 회사가 쿠키를 사용하는 목적</h2>
            <p>회사는 다음과 같은 목적으로 쿠키를 사용합니다:</p>
            <ul>
              <li>서비스 제공 및 운영: 로그인 상태 유지, 보안 강화, 오류 감지 및 수정</li>
              <li>서비스 개선: 이용자의 서비스 이용 패턴 분석을 통한 기능 개선 및 최적화</li>
              <li>맞춤형 경험 제공: 이용자의 선호도와 관심사에 맞는 콘텐츠 및 기능 제공</li>
              <li>마케팅 및 광고: 이용자의 관심사에 맞는 광고 제공 및 마케팅 효과 측정</li>
            </ul>

            <h2>4. 제3자 쿠키</h2>
            <p>회사는 서비스 개선 및 마케팅 목적으로 다음과 같은 제3자 쿠키를 사용할 수 있습니다:</p>
            <ul>
              <li>Google Analytics: 서비스 이용 통계 및 분석을 위해 사용</li>
              <li>GitHub: GitHub 계정 연동 및 인증을 위해 사용</li>
              <li>Toss Payments: 결제 처리를 위해 사용</li>
            </ul>
            <p>
              이러한 제3자 쿠키는 해당 제3자의 개인정보 처리방침 및 쿠키 정책에 따라 관리됩니다. 자세한 내용은 각
              제3자의 웹사이트를 참조하시기 바랍니다.
            </p>

            <h2>5. 쿠키 관리 방법</h2>
            <p>
              이용자는 브라우저 설정을 통해 쿠키를 관리할 수 있습니다. 대부분의 웹 브라우저는 기본적으로 쿠키를
              허용하도록 설정되어 있지만, 이용자는 브라우저 설정을 변경하여 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다
              확인을 요청하거나, 모든 쿠키를 거부할 수 있습니다. 단, 필수 쿠키를 비활성화할 경우 서비스의 일부 기능을
              이용할 수 없을 수 있습니다.
            </p>
            <p>주요 웹 브라우저의 쿠키 설정 방법은 다음과 같습니다:</p>
            <ul>
              <li>Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
              <li>Firefox: 설정 &gt; 개인 정보 및 보안 &gt; 쿠키 및 사이트 데이터</li>
              <li>Safari: 환경설정 &gt; 개인정보 보호 &gt; 쿠키 및 웹사이트 데이터</li>
              <li>Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터</li>
            </ul>

            <h2>6. 쿠키 정책 변경</h2>
            <p>
              회사는 필요에 따라 본 쿠키 정책을 변경할 수 있습니다. 쿠키 정책이 변경될 경우, 변경 사항을 서비스 내
              공지사항을 통해 안내하며, 변경된 정책은 공지한 날로부터 시행됩니다. 이용자는 정기적으로 쿠키 정책을
              확인하여 변경 사항을 확인하시기 바랍니다.
            </p>

            <h2>7. 문의하기</h2>
            <p>쿠키 사용에 관한 문의사항이 있으시면 다음 연락처로 문의해 주시기 바랍니다:</p>
            <ul>
              <li>이메일: privacy@mainova.com</li>
            </ul>

            <p className="mt-8">본 쿠키 정책은 2023년 5월 20일부터 시행됩니다.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
