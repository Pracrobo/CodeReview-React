import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

// 현재 모드 감지 함수
function getThemeMode() {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * 마크다운 렌더러 컴포넌트
 * rehype-highlight와 highlight.js를 사용한 코드 하이라이팅
 */
export default function MarkdownRenderer({
  children,
  className = '',
  showCopyButton = true,
  ...props
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  // 코드 복사 함수
  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('코드 복사 실패:', err);
    }
  };

  // 다크/라이트 모드에 따라 highlight.js 스타일 동적으로 적용
  useEffect(() => {
    // 기존 highlight.js 스타일 제거
    const removeHljsStyle = () => {
      document
        .querySelectorAll('link[data-hljs-theme]')
        .forEach((el) => el.remove());
    };

    // 현재 모드에 맞는 스타일 적용
    const applyHljsStyle = (mode) => {
      removeHljsStyle();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.setAttribute('data-hljs-theme', 'true');
      link.href =
        mode === 'dark' ? '/styles/github-dark.css' : '/styles/github.css';
      document.head.appendChild(link);
    };

    let mode = getThemeMode();
    applyHljsStyle(mode);

    // 모드 변경 감지
    const observer = new MutationObserver(() => {
      const newMode = getThemeMode();
      if (newMode !== mode) {
        mode = newMode;
        applyHljsStyle(mode);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      removeHljsStyle();
      observer.disconnect();
    };
  }, []);

  // 마크다운 컴포넌트 커스터마이징
  const markdownComponents = {
    // 코드 블록 렌더링
    pre({ children, ...props }) {
      const codeElement = children?.props;
      const code = codeElement?.children;
      const language = codeElement?.className?.replace('language-', '') || '';
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <div className="relative group">
          <div className="flex items-center justify-between bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-4 py-2 text-xs rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <span className="font-medium">
              {language ? language.toUpperCase() : '코드'}
            </span>
            {showCopyButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-800 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => copyToClipboard(code, codeId)}
                title="코드 복사"
              >
                {copiedCode === codeId ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
          {/* 코드 블록 */}
          <pre
            {...props}
            className="!mt-0 !rounded-t-none overflow-x-auto bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 p-4 text-sm leading-relaxed"
          >
            {children}
          </pre>
        </div>
      );
    },

    // 인라인 코드 스타일링
    code({ inline, children, ...props }) {
      return inline ? (
        <code
          {...props}
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {children}
        </code>
      ) : (
        <code {...props}>{children}</code>
      );
    },

    // 표 스타일링
    table({ children, ...props }) {
      return (
        <div className="overflow-x-auto my-4">
          <table
            {...props}
            className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            {children}
          </table>
        </div>
      );
    },

    // 표 헤더 스타일링
    thead({ children, ...props }) {
      return (
        <thead
          {...props}
          className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          {children}
        </thead>
      );
    },

    // 표 셀 스타일링
    th({ children, ...props }) {
      return (
        <th
          {...props}
          className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {children}
        </th>
      );
    },

    td({ children, ...props }) {
      return (
        <td
          {...props}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
        >
          {children}
        </td>
      );
    },

    // 인용문 스타일링
    blockquote({ children, ...props }) {
      return (
        <blockquote
          {...props}
          className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 py-2"
        >
          {children}
        </blockquote>
      );
    },

    // 링크 스타일링
    a({ children, href, ...props }) {
      return (
        <a
          {...props}
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },

    // 제목 스타일링
    h1({ children, ...props }) {
      return (
        <h1
          {...props}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        >
          {children}
        </h1>
      );
    },

    h2({ children, ...props }) {
      return (
        <h2
          {...props}
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-3"
        >
          {children}
        </h2>
      );
    },

    h3({ children, ...props }) {
      return (
        <h3
          {...props}
          className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2"
        >
          {children}
        </h3>
      );
    },

    // 리스트 스타일링
    ul({ children, ...props }) {
      return (
        <ul
          {...props}
          className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 my-3"
        >
          {children}
        </ul>
      );
    },

    ol({ children, ...props }) {
      return (
        <ol
          {...props}
          className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 my-3"
        >
          {children}
        </ol>
      );
    },

    // 구분선 스타일링
    hr({ ...props }) {
      return (
        <hr
          {...props}
          className="my-6 border-0 border-t border-gray-200 dark:border-gray-700"
        />
      );
    },
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={markdownComponents}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
