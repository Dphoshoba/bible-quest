import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CharacterContext } from '../CharacterContext.js';

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const printCss = `
@media print {
  body * { visibility: hidden !important; }
  .cert-sheet, .cert-sheet * { visibility: visible !important; }
  .cert-sheet { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
  .no-print { display: none !important; }
  @page { size: landscape; margin: 12mm; }
}
`;

function Certificate() {
  const { id } = useParams();
  const { characters } = useContext(CharacterContext);
  const character = characters.find((c) => c.id === id);
  const earned = read(`storyCompleted_${id}`) === 'true' && read(`quizCompleted_${id}`) === 'true';
  const [name, setName] = useState(() => read('childName') || '');

  const saveName = (value) => {
    setName(value);
    try {
      localStorage.setItem('childName', value);
    } catch {
      /* storage unavailable: name just isn't remembered */
    }
  };

  const wrap = { maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px', position: 'relative', zIndex: 1000 };

  if (!character || !earned) {
    return (
      <div style={wrap}>
        <p><Link to="/achievements" style={{ color: '#1a237e', fontWeight: 600 }}>← My Achievements</Link></p>
        <h2>Certificate not unlocked yet</h2>
        <p>
          Finish all the story levels and the quiz for {character ? character.name : 'this character'} to
          earn this certificate.
        </p>
        {character && <Link to={`/stories/${character.id}`} style={{ color: '#1a237e', fontWeight: 600 }}>Go to the story →</Link>}
      </div>
    );
  }

  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={wrap}>
      <style>{printCss}</style>
      <div className="no-print">
        <p><Link to="/achievements" style={{ color: '#1a237e', fontWeight: 600 }}>← My Achievements</Link></p>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <strong>Name on the certificate</strong>{' '}
          <input
            type="text"
            value={name}
            maxLength={40}
            onChange={(e) => saveName(e.target.value)}
            placeholder="Type a name"
            style={{ padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #bbb', marginLeft: 8 }}
          />
          <span style={{ display: 'block', fontSize: 13, color: '#555', marginTop: 4 }}>
            Saved only on this device. It is never sent anywhere.
          </span>
        </label>
        <button
          onClick={() => window.print()}
          style={{ padding: '12px 22px', fontSize: 16, background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 20 }}
        >
          🖨️ Print or save as PDF
        </button>
      </div>

      <div
        className="cert-sheet"
        style={{
          background: '#fffdf5',
          border: '10px double #b8860b',
          borderRadius: 8,
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          color: '#3b2f1a',
        }}
      >
        <div style={{ fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: '#8a6d1d' }}>Bible Quest</div>
        <h1 style={{ fontSize: 40, margin: '8px 0 16px', fontFamily: 'Georgia, serif', color: '#5d4a12' }}>
          Certificate of Completion
        </h1>
        <p style={{ fontSize: 18, margin: 0 }}>This certifies that</p>
        <p
          style={{
            fontSize: 34,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            margin: '10px auto 14px',
            minWidth: 280,
            maxWidth: 560,
            borderBottom: '2px solid #b8860b',
            padding: '4px 12px',
            minHeight: 48,
          }}
        >
          {name || ' '}
        </p>
        <p style={{ fontSize: 18, margin: '0 0 12px' }}>has completed the story and quiz of</p>
        <img
          src={character.avatar}
          alt={character.name}
          style={{ width: 130, height: 130, objectFit: 'cover', objectPosition: 'center 22%', borderRadius: 12, border: '3px solid #b8860b', background: '#fff' }}
        />
        <p style={{ fontSize: 30, fontFamily: 'Georgia, serif', fontWeight: 700, margin: '10px 0 4px' }}>{character.name}</p>
        <p style={{ fontSize: 16, fontStyle: 'italic', margin: '0 0 22px' }}>
          “Well done, good and faithful servant.” – Matthew 25:21
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ borderTop: '1px solid #3b2f1a', paddingTop: 4, fontSize: 15 }}>{today}</div>
            <div style={{ fontSize: 12, color: '#6b5a33' }}>Date</div>
          </div>
          <div style={{ minWidth: 220 }}>
            <div style={{ borderTop: '1px solid #3b2f1a', paddingTop: 4, fontSize: 15 }}>
              Rev David P H Oshoba George
            </div>
            <div style={{ fontSize: 12, color: '#6b5a33' }}>Eternal Echoes &amp; Visions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
