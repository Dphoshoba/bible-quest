import React from 'react';
import { Link } from 'react-router-dom';

// Update these when a new APK is published as a GitHub release (keep the asset named BibleQuest.apk).
const APK_URL = 'https://github.com/Dphoshoba/bible-quest/releases/latest/download/BibleQuest.apk';
const RELEASES_URL = 'https://github.com/Dphoshoba/bible-quest/releases/latest';
const VERSION = '1.1.1';
const SIZE = '47 MB';
const SHA256 = '125b71577a27bd119b663a5db795d932bdf568190af5891fc2192aa773825ee8';

const page = { maxWidth: 720, margin: '0 auto', padding: '32px 20px 64px', lineHeight: 1.65, color: '#222', position: 'relative', zIndex: 1000 };

function AndroidApp() {
  return (
    <div style={page}>
      <p><Link to="/" style={{ color: '#1a237e', fontWeight: 600 }}>← Back to Bible Quest</Link></p>
      <h1 style={{ color: '#1a237e' }}>Bible Quest for Android</h1>
      <p>
        Install Bible Quest as an app on your Android phone or tablet. It's free, has no ads, and the stories
        and narration work without internet.
      </p>

      <p style={{ margin: '24px 0' }}>
        <a
          href={APK_URL}
          style={{ display: 'inline-block', background: '#2e7d32', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 18, padding: '14px 26px', borderRadius: 10 }}
        >
          ⬇️ Download for Android
        </a>
        <span style={{ display: 'block', fontSize: 13, color: '#555', marginTop: 8 }}>
          Version {VERSION} · {SIZE} · Android 6.0 or newer
        </span>
      </p>

      <h2>How to install</h2>
      <ol>
        <li>Tap <strong>Download for Android</strong> on your Android phone and wait for the file (<code>BibleQuest.apk</code>) to finish.</li>
        <li>Open the downloaded file. If Android asks, allow <strong>"Install unknown apps"</strong> for the app you opened it from (for example Chrome or Files).</li>
        <li>If <strong>Google Play Protect</strong> says the developer is unrecognized, choose <strong>More details → Install anyway</strong>. This notice appears for any app that isn't from the Play Store.</li>
        <li>Open <strong>Bible Quest</strong> from your apps.</li>
      </ol>

      <h2>What's in the Android app</h2>
      <ul>
        <li>Stories and quizzes for <strong>David</strong> and <strong>Esther</strong> at three reading levels, with narration</li>
        <li>Daily Challenge, streaks, badges and printable certificates</li>
        <li>No accounts, no ads and no tracking</li>
      </ul>
      <p>
        The other characters and Premium are available on the website, which you can also add to your home
        screen like an app.
      </p>

      <h2>Staying safe</h2>
      <ul>
        <li>Only download the app from this page or from the <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">official release page</a>.</li>
        <li>Updates are not automatic: come back to this page for new versions.</li>
        <li>To check the file hasn't been changed, its SHA-256 checksum is:<br /><code style={{ wordBreak: 'break-all', fontSize: 12 }}>{SHA256}</code></li>
      </ul>

      <p>
        <Link to="/privacy" style={{ color: '#1a237e' }}>Privacy Policy</Link>
      </p>
    </div>
  );
}

export default AndroidApp;
