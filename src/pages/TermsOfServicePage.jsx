import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function TermsOfServicePage() {
  // 페이지 로드 시 최상단으로 스크롤
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
            <FileText className="h-7 w-7 text-green-500 dark:text-green-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">서비스 약관</h1>
              <p className="text-muted-foreground text-sm">
                최종 업데이트: 2025년 5월 20일
              </p>
            </div>
          </div>

          {/* 본문 카드 */}
          <div className="max-w-none bg-background border border-border rounded-2xl shadow-lg p-8 transition-colors duration-200 text-foreground">
            <p className="mb-6">
              본 서비스 약관은 Mai Nova(이하 "회사")가 운영하는 AIssue 서비스(이하
              "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>

            <hr className="my-8" />

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제1조 (목적)
            </h2>
            <p className="mb-6">
              본 약관은 Mai Nova(이하 "회사")가 제공하는 AIssue 서비스(이하
              "서비스")의 이용조건 및 절차, 회사와 회원간의 권리, 의무 및
              책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제2조 (정의)
            </h2>
            <p className="mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>
                "서비스"라 함은 회사가 제공하는 AI 기반 GitHub 이슈 분석 및 코드
                추천 서비스를 의미합니다.
              </li>
              <li>
                "회원"이라 함은 서비스에 접속하여 본 약관에 따라 회사와
                이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를
                의미합니다.
              </li>
              <li>
                "계정"이라 함은 회원의 식별과 서비스 이용을 위하여 회원이
                선정하고 회사가 승인하는 문자, 숫자 또는 특수문자의 조합을
                의미합니다.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제3조 (약관의 효력 및 변경)
            </h2>
            <p className="mb-6">
              본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을
              발생합니다. 회사는 합리적인 사유가 발생할 경우 관련 법령에
              위배되지 않는 범위에서 본 약관을 변경할 수 있으며, 약관이 변경되는
              경우 변경된 약관의 적용일자 및 변경사유를 명시하여 현행약관과 함께
              서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지
              공지합니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제4조 (이용계약의 체결)
            </h2>
            <p className="mb-6">
              이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의
              내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한
              신청에 대하여 승낙함으로써 체결됩니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제5조 (서비스의 제공 및 변경)
            </h2>
            <p className="mb-2">회사는 회원에게 아래와 같은 서비스를 제공합니다:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>GitHub 저장소 분석 서비스</li>
              <li>AI 기반 이슈-코드 매칭 서비스</li>
              <li>컨트리뷰션 가이드 AI 챗봇 서비스</li>
              <li>다국어 한글화 지원 서비스</li>
              <li>
                기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해
                회원에게 제공하는 일체의 서비스
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제6조 (서비스의 중단)
            </h2>
            <p className="mb-6">
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의
              두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할
              수 있습니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제7조 (회원의 의무)
            </h2>
            <p className="mb-2">회원은 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>신청 또는 변경시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제8조 (저작권의 귀속 및 이용제한)
            </h2>
            <p className="mb-6">
              회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에
              귀속합니다. 회원은 서비스를 이용함으로써 얻은 정보 중 회사에게
              지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판,
              배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게
              이용하게 하여서는 안됩니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제9조 (개인정보보호)
            </h2>
            <p className="mb-6">
              회사는 관련법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 이용에 대해서는 관련법령 및 회사의
              개인정보처리방침이 적용됩니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제10조 (회사의 의무)
            </h2>
            <p className="mb-6">
              회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를
              제공하기 위해서 노력합니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제11조 (면책조항)
            </h2>
            <p className="mb-6">
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제12조 (분쟁해결)
            </h2>
            <p className="mb-6">
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사소재지를 관할하는 법원을 관할 법원으로 합니다.
            </p>

            <h2 className="text-xl font-bold mt-10 mb-3 border-b pb-1">
              제13조 (기타)
            </h2>
            <p className="mb-6">
              본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한
              법률, 공정거래 위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.
            </p>

            <div className="mt-10 p-4 rounded-lg border text-center font-semibold">
              본 약관은 2025년 5월 20일부터 시행됩니다.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
