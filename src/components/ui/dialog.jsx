import React from 'react';

function useThemeMode() {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function Dialog({ open, onOpenChange, children }) {
  const mode = useThemeMode();

  // 라이트 모드: 오버레이 밝게, 글자색 진하게
  const bgOverlay =
    mode === 'dark'
      ? 'rgba(15, 13, 24, 0.85)'
      : 'rgba(240, 240, 250, 0.7)';
  const modalBg =
    mode === 'dark'
      ? '#18132a'
      : '#fff';
  const modalColor = mode === 'dark' ? '#f3e8ff' : '#232136';
  const borderColor = mode === 'dark' ? '#6d28d9' : '#a5b4fc';

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: bgOverlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s',
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        style={{
          background: modalBg,
          color: modalColor,
          borderRadius: 18,
          minWidth: 420,
          maxWidth: 560,
          padding: '44px 36px 28px 36px',
          boxShadow:
            mode === 'dark'
              ? '0 16px 48px 0 rgba(40,20,80,0.55)'
              : '0 8px 32px 0 rgba(40,20,80,0.18)',
          border: `1.5px solid ${borderColor}`,
          fontFamily: 'inherit',
          transition: 'background 0.3s, color 0.3s',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* mode prop을 context로 전달 */}
        <DialogModeContext.Provider value={mode}>
          {children}
        </DialogModeContext.Provider>
      </div>
    </div>
  );
}

// mode를 context로 전달
const DialogModeContext = React.createContext('light');

export function DialogHeader({ children }) {
  const mode = React.useContext(DialogModeContext);
  return (
    <div
      style={{
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 20,
        letterSpacing: '0.02em',
        color: mode === 'dark' ? '#f3e8ff' : '#232136',
        textShadow: mode === 'dark' ? '0 1px 8px #1e1b4b33' : 'none',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

export function DialogContent({ children }) {
  const mode = React.useContext(DialogModeContext);
  return (
    <div
      className="py-2"
      style={{
        fontSize: 16,
        color: mode === 'dark' ? '#f3e8ff' : '#232136',
        lineHeight: 1.7,
        textAlign: 'center',
        wordBreak: 'keep-all',
        padding: '0 12px',
      }}
    >
      {children}
    </div>
  );
}

export function DialogFooter({ children }) {
  const mode = React.useContext(DialogModeContext);
  const [hoverIdx, setHoverIdx] = React.useState(-1);

  const confirmBg = mode === 'dark' ? '#6d28d9' : '#6366f1';
  const confirmBgHover = mode === 'dark' ? '#7c3aed' : '#4f46e5';
  const confirmText = '#fff';

  const styledChildren = React.Children.map(children, (child, idx) => {
    if (!React.isValidElement(child)) return child;

    const baseStyle = {
      marginTop: 30,
      fontWeight: 600,
      fontFamily: 'inherit',
      fontSize: 15,
      letterSpacing: '0.01em',
      borderRadius: 8,
      padding: '8px 18px',
      transition: 'all 0.15s',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: 'none',
      borderWidth: 1.5,
      borderStyle: 'solid',
      marginLeft: idx > 0 ? 8 : 0,
    };

    if (child.props.variant === 'outline') {
      const isHover = hoverIdx === idx;
      return React.cloneElement(child, {
        style: {
          ...baseStyle,
          color: mode === 'dark' ? '#cbd5e1' : '#334155',
          borderColor: mode === 'dark' ? '#334155' : '#cbd5e1',
          background: isHover
            ? (mode === 'dark' ? '#334155' : '#e2e8f0')
            : (mode === 'dark' ? '#232136' : '#f1f5f9'),
        },
        onMouseEnter: () => setHoverIdx(idx),
        onMouseLeave: () => setHoverIdx(-1),
      });
    }
    const isHover = hoverIdx === idx;
    return React.cloneElement(child, {
      style: {
        ...baseStyle,
        color: confirmText,
        background: isHover ? confirmBgHover : confirmBg,
        borderColor: 'transparent',
        boxShadow: '0 2px 8px 0 rgba(124,58,237,0.12)',
        opacity: isHover ? 0.97 : 1,
        filter: isHover ? 'brightness(1.04)' : 'none',
      },
      onMouseEnter: () => setHoverIdx(idx),
      onMouseLeave: () => setHoverIdx(-1),
    });
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 14,
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      {styledChildren}
    </div>
  );
}