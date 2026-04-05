import { useState, useRef, useCallback } from "react";

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

const AIRTABLE_CONFIG = {
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY",
  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID || "YOUR_BASE_ID",
};

export default function MemoirFreeWrite() {
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [recordId, setRecordId] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const timeoutRef = useRef(null);
  const lastSavedText = useRef("");
  const textareaRef = useRef(null);

  const saveText = useCallback(async (currentText, currentRecordId) => {
    if (currentText === lastSavedText.current) return;

    setSaveState("saving");

    try {
      if (!currentRecordId) {
        const response = await fetch(
          "https://api.airtable.com/v0/" + AIRTABLE_CONFIG.BASE_ID + "/" + encodeURIComponent("Entries"),
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + AIRTABLE_CONFIG.API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: {
                "Response Text": currentText,
                "Date Received": new Date().toISOString().split("T")[0],
              },
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setRecordId(data.id);
          lastSavedText.current = currentText;
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 2000);
          return data.id;
        }
      } else {
        const response = await fetch(
          "https://api.airtable.com/v0/" + AIRTABLE_CONFIG.BASE_ID + "/" + encodeURIComponent("Entries") + "/" + currentRecordId,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + AIRTABLE_CONFIG.API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: { "Response Text": currentText },
            }),
          }
        );
        if (response.ok) {
          lastSavedText.current = currentText;
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 2000);
        }
      }
    } catch (err) {
      console.error("Error saving:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  }, []);

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    const words = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    setWordCount(words);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveText(newText, recordId);
    }, 1500);
  }, [recordId, saveText]);

  const handleFinish = () => {
    if (text.trim() && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      saveText(text, recordId);
    }
    setIsFinished(true);
  };

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
          }}>&#10003;</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", margin: "0 0 12px" }}>
            Beautifully done.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 8px" }}>
            You wrote {wordCount} words.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 32px" }}>
            Everything is saved. Your first personalized prompt is on its way soon. What you just wrote will help shape it.
          </p>
          <button onClick={handleKeepWriting} style={{
            padding: "16px 36px", borderRadius: 10, border: "1px solid " + COLORS.border,
            backgroundColor: COLORS.cardBg, color: COLORS.text, fontSize: 17,
            fontFamily: "'Inter', sans-serif", cursor: "pointer", minHeight: 52, minWidth: 220,
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
      <div style={{
        padding: "16px 28px", borderBottom: "1px solid " + COLORS.border,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
      }}>
        <p style={{ fontSize: 15, color: COLORS.textLight, margin: 0, fontFamily: "'Inter', sans-serif" }}>
          Free write
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveState === "saving" && (
            <span style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Inter', sans-serif" }}>Saving...</span>
          )}
          {saveState === "saved" && (
            <span style={{ fontSize: 13, color: COLORS.green, fontFamily: "'Inter', sans-serif" }}>Saved</span>
          )}
          {saveState === "error" && (
            <span style={{ fontSize: 13, color: "#C44", fontFamily: "'Inter', sans-serif" }}>Could not save — will retry</span>
          )}
          {saveState === "idle" && text === "" && (
            <span style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Inter', sans-serif" }}>Your work saves automatically</span>
          )}
        </div>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        maxWidth: 720, width: "100%", margin: "0 auto", padding: "32px 28px 0",
      }}>
        <div style={{
          backgroundColor: COLORS.accentSoft, border: "1px solid " + COLORS.border,
          borderRadius: 12, padding: "20px 24px", marginBottom: 28, flexShrink: 0,
        }}>
          <p style={{
            fontSize: 20, lineHeight: 1.5, margin: 0, fontStyle: "italic", color: COLORS.text,
          }}>
            Write whatever is on your mind. There is no prompt here — just space. Whatever you put down will become part of your story.
          </p>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: 24 }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Start writing here..."
            autoFocus
            style={{
              flex: 1, minHeight: 350, padding: 24, borderRadius: 12,
              border: "1px solid " + COLORS.border, backgroundColor: COLORS.textArea,
              color: COLORS.text, fontSize: 20, lineHeight: 1.8,
              fontFamily: "'Georgia', 'Times New Roman', serif", resize: "none",
              outline: "none", boxSizing: "border-box", WebkitAppearance: "none",
            }}
          />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0 32px", borderTop: "1px solid " + COLORS.border, flexShrink: 0,
        }}>
          <p style={{ fontSize: 15, color: COLORS.textLight, margin: 0, fontFamily: "'Inter', sans-serif" }}>
            {wordCount > 0 ? wordCount + " word" + (wordCount === 1 ? "" : "s") : "Take your time."}
          </p>
          <button onClick={handleFinish} style={{
            padding: "16px 36px", borderRadius: 10, border: "none",
            backgroundColor: COLORS.accent, color: "#FFFEFA", fontSize: 17,
            fontWeight: 500, fontFamily: "'Inter', sans-serif",
            cursor: "pointer", minHeight: 52,
          }}>
            I'm done for now
          </button>
        </div>
      </div>

      <style>{
        "textarea::placeholder { color: " + COLORS.textLight + "; opacity: 0.5; font-style: italic; }"
      }</style>
    </div>
  );
}
