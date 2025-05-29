import React, { useState } from "react";
import { API_ENDPOINTS } from "../config.js";

console.log('AiBuddy rendered');

/**
 * AiBuddy - Cross-platform AI assistant component
 * Props:
 *   character: string (context for AI)
 *   context: string (optional, extra context for AI)
 *   style: object (optional, for button)
 *   position: object (optional, for button position)
 */
function AiBuddy({ character, context = '', style = {}, position = {} }) {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setShowModal(true);
    setInput("");
    setResponse("");
    setError("");
  };
  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: context ? `${context}\n${input}` : input,
          character: character || "general"
        }),
      });
      const data = await res.json();
      if (data.answer) setResponse(data.answer);
      else setError("Sorry, I couldn't get an answer.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating AI Buddy Button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed',
          right: position.right || 30,
          top: position.top || '40%',
          zIndex: 1000,
          background: '#fff',
          border: '2px solid #007bff',
          borderRadius: '50%',
          width: 60,
          height: 60,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: '#007bff',
          ...style,
        }}
        aria-label="Ask Bible Buddy"
        title="Ask Bible Buddy"
      >
        🤖
      </button>
      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            position: 'relative',
          }}>
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ marginBottom: 10, color: '#007bff' }}>Bible Buddy</h2>
            <p style={{ fontSize: 15, marginBottom: 16 }}>Ask me anything about this story or quiz!</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 0',
                  fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {loading ? 'Thinking...' : 'Ask'}
              </button>
            </form>
            {response && (
              <div style={{ marginTop: 18, background: '#f1f8ff', padding: 12, borderRadius: 6, color: '#222' }}>
                <strong>Buddy:</strong> {response}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 12, color: 'red', fontSize: 15 }}>{error}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AiBuddy; 