import React, { useEffect, useState } from 'react';

const isStandalone = () =>
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  window.navigator.standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

// Shows an "Install app" button where the browser supports it, or a short how-to on iPhone/iPad.
function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault(); // keep the event so the button can trigger it
      setPromptEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!promptEvent && !isIos()) return null;

  const install = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice.catch(() => {});
      setPromptEvent(null);
    } else {
      setShowIosTip((v) => !v);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '6px 0 10px', position: 'relative', zIndex: 1000 }}>
      <button
        onClick={install}
        style={{ background: '#fff', border: '1px solid #c5cae9', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontSize: 14, color: '#1a237e', fontWeight: 600 }}
      >
        📲 Install Bible Quest on this device
      </button>
      {showIosTip && (
        <div style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 14, background: '#fffde7', padding: 10, borderRadius: 8 }}>
          Tap the <strong>Share</strong> button in Safari, then choose <strong>Add to Home Screen</strong>.
        </div>
      )}
    </div>
  );
}

export default InstallButton;
