import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 카드 */}
          <div className="flex items-center gap-3 bg-background border border-border rounded-xl shadow-md px-6 py-5 mb-8 transition-colors duration-200">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <ShieldCheck className="h-7 w-7 text-blue-500 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                개인정보 처리방침
              </h1>
              <p className="text-muted-foreground text-sm">
                최종 업데이트: 2025년 5월 20일
              </p>
            </div>
          </div>

          {/* 본문 카드 */}
          <div className="max-w-none bg-background border border-border rounded-2xl shadow-lg p-8 transition-colors duration-200 text-foreground">
            <p className="mb-6">
              Mai Nova(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보
              보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을
              준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자께서
              제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며,
              개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>

            <hr className="my-8" />

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              1. 개인정보의 처리목적
            </h2>
            <p className="mb-2">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>회원가입 및 관리: 회원가입 의사 확인, 회원제 서비스 제공</li>
              <li>
                서비스 제공: CodeReview 서비스 이용, GitHub 연동 서비스 제공
              </li>
              <li>결제 및 정산: 유료 서비스 이용에 따른 결제 처리</li>
              <li>고객지원: 문의사항 및 불만 처리, 공지사항 전달</li>
              <li>서비스 개선: 이용자 행태 분석을 통한 서비스 품질 향상</li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              2. 개인정보의 처리 및 보유기간
            </h2>
            <p className="mb-2">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>회원정보: 회원탈퇴 시까지</li>
              <li>결제정보: 결제일로부터 5년</li>
              <li>접속로그: 3개월</li>
              <li>고객문의: 문의 처리 완료 후 3년</li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              3. 개인정보의 제3자 제공
            </h2>
            <p className="mb-2">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-8 mb-2">
              3.1 개인정보 처리 위탁
            </h3>
            <p className="mb-2">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
              처리업무를 위탁하고 있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>GitHub: OAuth 인증 및 저장소 정보 연동</li>
              <li>Toss Payments: 결제 처리</li>
              <li>AWS: 클라우드 서버 호스팅</li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              4. 개인정보의 파기
            </h2>
            <p className="mb-6">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              5. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="mb-2">
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>개인정보 처리정지 요구권</li>
              <li>개인정보 열람요구권</li>
              <li>개인정보 정정·삭제요구권</li>
              <li>개인정보 처리정지 요구권</li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              6. 개인정보의 안전성 확보조치
            </h2>
            <p className="mb-2">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보를 저장하는 전산실, 자료보관실 등의 물리적 보안</li>
              <li>
                해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기
                위한 보안프로그램 설치
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              7. 개인정보 보호책임자
            </h2>
            <p className="mb-2">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>개인정보 보호책임자: Mai Nova 대표</li>
              <li>
                연락처:{' '}
                <span className="font-mono font-semibold">
                  privacy@Pracrobo.com
                </span>
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              8. 개인정보 처리방침 변경
            </h2>
            <p className="mb-6">
              이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </p>

            <div className="mt-10 p-4 rounded-lg border text-center font-semibold">
              본 방침은 2025년 5월 20일부터 시행됩니다.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
