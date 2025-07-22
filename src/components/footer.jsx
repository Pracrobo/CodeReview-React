import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                CodeReview
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              AI를 활용하여 GitHub 저장소의 이슈 분석, 코드 추천 및 컨트리뷰션
              가이드를 제공하는 웹 서비스입니다. 개발자의 생산성 향상과 오픈소스
              참여 장벽 완화를 목표로 합니다.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Mai-Nova"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">제품</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/#features"
                  className="text-muted-foreground hover:text-foreground"
                >
                  기능
                </a>
              </li>
              <li>
                <a
                  href="/#pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  가격 정책
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Mai Nova. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground">
              개인정보 처리방침
            </Link>
            <Link to="/terms-of-service" className="hover:text-foreground">
              서비스 약관
            </Link>
            <Link to="/cookie-policy" className="hover:text-foreground">
              쿠키 정책
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
