import { useState, useEffect, useRef, useCallback } from "react";
import { fetchEntry, fetchPrompt, saveEntryText } from "./airtable";

const COLORS = {
  bg: "#FAF7F2",
  text: "#2C2416",
  textLight: "#7A6E5D",
  accent: "#B8860B",
  accentSoft: "#D4A84420",
  cardBg: "#FFFFFF",
  border: "#E8E0D4",
  green: "#5A8C5A",
  greenSoft: "#5A8C5A20",
  textArea: "#FFFEFA",
};

function useAutosave(text, entryId, delay = 1500) {
  const [saveState, setSaveState] = useState("idle");
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const timeoutRef = useRef(null);
  const lastSavedText = useRef("");

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);

    if (text === lastSavedText.current) return;
    if (!entryId) return;

    setSaveState("idle");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (text === lastSavedText.current) return;

      setSaveState("saving");

      const result = await saveEntryText(entryId, text);

      if (result) {
        lastSavedText.current = text;
        setSaveState("saved");
        setLastSaved(new Date());
        setTimeout(() => setSaveState("idle"), 2000);
      } else {
        setSaveState("error");
        setTimeout(() => setSaveState("idle"), 3000);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, entryId, delay]);

  return { saveState, lastSaved, wordCount };
}

export default function MemoirWriter() {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(null);
  const [entryId, setEntryId] = useState(null);
  const [weekNumber, setWeekNumber] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const { saveState, lastSaved, wordCount } = useAutosave(text, entryId);

  // Load entry from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entryParam = params.get("entry");

    if (!entryParam) {
      setLoading(false);
      setError("No entry specified. Please use the link from your email.");
      return;
    }

    setEntryId(entryParam);

    (async () => {
      try {
        const entry = await fetchEntry(entryParam);
        if (!entry) {
          setError("Couldn't find your entry. Please try the link from your email again.");
          setLoading(false);
          return;
        }

        // Load existing text if any (for returning to a draft)
        if (entry.fields["Response Text"]) {
          setText(entry.fields["Response Text"]);
        }

        // Load the linked prompt
        const promptIds = entry.fields["Prompt"];
        if (promptIds && promptIds.length > 0) {
          const promptData = await fetchPrompt(promptIds[0]);
          if (promptData) {
            setPrompt(promptData.fields["Prompt Text"]);
            setWeekNumber(promptData.fields["Week Number"]);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Something went wrong loading your writing page. Please try again.");
        setLoading(false);
      }
    })();
  }, []);

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleFinish = () => setIsFinished(true);
  const handleKeepWriting = () => {
    setIsFinished(false);
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, 100);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.textLight,
      }}>
        <p style={{ fontSize: 19, fontStyle: "italic" }}>Loading your writing page...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 28,
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", margin: "0 0 16px" }}>
            Through Line Memoir
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.textLight }}>{error}</p>
        </div>
      </div>
    );
  }

  // Finished confirmation screen
  if (isFinished) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg,
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 28,
      }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", backgroundColor: COLORS.greenSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 28,
          }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", margin: "0 0 12px" }}>
            Beautifully done.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 8px" }}>
            You wrote {wordCount} words this week.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 40px" }}>
            Everything is saved. You can close this page, or come back anytime to keep writing.
          </p>
          <button onClick={handleKeepWriting} style={{
            padding: "16px 36px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.cardBg, color: COLORS.text, fontSize: 17,
            fontFamily: "'Trebuchet MS', sans-serif", cursor: "pointer", minHeight: 52, minWidth: 220,
          }}>
            Wait, I want to add more
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: COLORS.bg,
      fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
      WebkitFontSmoothing: "antialiased", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 28px", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
      }}>
        <p style={{ fontSize: 15, color: COLORS.textLight, margin: 0, fontFamily: "'Trebuchet MS', sans-serif" }}>
          {weekNumber ? `Week ${weekNumber}` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveState === "saving" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS.accent,
                animation: "pulse 1s infinite",
              }} />
              <span style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Trebuchet MS', sans-serif" }}>Saving…</span>
            </div>
          )}
          {saveState === "saved" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS.green }} />
              <span style={{ fontSize: 13, color: COLORS.green, fontFamily: "'Trebuchet MS', sans-serif" }}>Saved</span>
            </div>
          )}
          {saveState === "error" && (
            <span style={{ fontSize: 13, color: "#C44", fontFamily: "'Trebuchet MS', sans-serif" }}>
              Couldn't save — will retry
            </span>
          )}
          {saveState === "idle" && lastSaved && (
            <span style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Trebuchet MS', sans-serif" }}>
              Last saved {formatTime(lastSaved)}
            </span>
          )}
          {saveState === "idle" && !lastSaved && text === "" && (
            <span style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Trebuchet MS', sans-serif" }}>
              Your work saves automatically
            </span>
          )}
        </div>
      </div>

      {/* Main writing area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        maxWidth: 720, width: "100%", margin: "0 auto", padding: "32px 28px 0",
      }}>
        {/* The prompt */}
        {prompt && (
          <div style={{
            backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "20px 24px", marginBottom: 28, flexShrink: 0,
          }}>
            <p style={{
              fontSize: 14, color: COLORS.accent, margin: "0 0 6px",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>This Week's Prompt</p>
            <p style={{ fontSize: 20, lineHeight: 1.5, margin: 0, fontStyle: "italic", color: COLORS.text }}>
              {prompt}
            </p>
          </div>
        )}

        {/* The writing area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: 24 }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Start writing here…"
            autoFocus
            style={{
              flex: 1, minHeight: 350, padding: 24, borderRadius: 12,
              border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.textArea,
              color: COLORS.text, fontSize: 20, lineHeight: 1.8,
              fontFamily: "'Georgia', 'Times New Roman', serif", resize: "none",
              outline: "none", boxSizing: "border-box", WebkitAppearance: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = COLORS.accent + "60"; }}
            onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0 32px", borderTop: `1px solid ${COLORS.border}`, flexShrink: 0,
        }}>
          <p style={{ fontSize: 15, color: COLORS.textLight, margin: 0, fontFamily: "'Trebuchet MS', sans-serif" }}>
            {wordCount > 0 ? `${wordCount} word${wordCount === 1 ? "" : "s"}` : "Take your time — there's no rush."}
          </p>
          <button onClick={handleFinish} style={{
            padding: "16px 36px", borderRadius: 10, border: "none",
            backgroundColor: COLORS.accent, color: "#FFFEFA", fontSize: 17,
            fontWeight: 500, fontFamily: "'Trebuchet MS', sans-serif",
            cursor: "pointer", minHeight: 52, transition: "all 0.2s ease",
          }}>
            I'm done for now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        textarea::placeholder {
          color: ${COLORS.textLight};
          opacity: 0.5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
