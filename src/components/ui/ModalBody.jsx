import React from 'react';

export default function ModalBody({ icon, title, description, warning }) {
  const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 0 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {icon && (
          <div
            style={{
              background: mode === 'dark' ? '#2e1065' : '#f3e8ff',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            {icon}
          </div>
        )}
        <div
          style={{
            fontWeight: 700,
            fontSize: 20,
            color: mode === 'dark' ? '#c4b5fd' : '#6d28d9',
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: mode === 'dark' ? '#e0e7ef' : '#232136',
            fontSize: 16,
            lineHeight: 1.7,
            marginBottom: warning ? 10 : 0,
            whiteSpace: 'pre-line',
          }}
        >
          {description}
        </div>
        {warning && (
          <div
            style={{
              color: mode === 'dark' ? '#f87171' : '#b91c1c',
              fontWeight: 600,
              fontSize: 15,
              marginTop: 2,
            }}
          >
            {warning}
          </div>
        )}
      </div>
    </div>
  );
}