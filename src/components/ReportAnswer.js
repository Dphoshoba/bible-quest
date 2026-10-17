import React from 'react';

const REPORT_EMAIL = 'davidoshoba@gmail.com';

// "Report this answer" link shown under every AI-written answer (Google Play's AI content policy
// expects an in-app way to flag bad AI output). It opens the parent's email app with the answer
// pre-filled; nothing is sent or stored by the app itself.
function ReportAnswer({ text, source }) {
  const subject = encodeURIComponent('Bible Quest: report an AI answer');
  const body = encodeURIComponent(
    `Please tell us what was wrong with this answer:\n\n\n---\nWhere: ${source}\nAI answer: ${String(text || '').slice(0, 600)}`
  );
  return (
    <a
      href={`mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`}
      style={{ display: 'inline-block', marginLeft: 8, fontSize: 13, color: '#b71c1c', textDecoration: 'underline' }}
    >
      🚩 Report this answer
    </a>
  );
}

export default ReportAnswer;
