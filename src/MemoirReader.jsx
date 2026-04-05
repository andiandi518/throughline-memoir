import { useState, useEffect, useRef } from "react";
import { fetchAllEntries, fetchPrompt } from "./airtable";

const COLORS = {
  bg: "#FAF7F2",
  text: "#2C2416",
  textLight: "#7A6E5D",
  accent: "#B8860B",
  accentSoft: "#D4A84420",
  cardBg: "#FFFFFF",
  border: "#E8E0D4",
  navBg: "#F0EBE3",
};

export default function MemoirReader() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("single");
  const contentRef = useRef(null);

  useEffect(() => {
    (async () => {
      const records = await fetchAllEntries();

      // Load prompt text for each entry
      const enriched = await Promise.all(
        records.map(async (record) => {
          let promptText = "";
          let weekNumber = null;
          const promptIds = record.fields["Prompt"];
          if (promptIds && promptIds.length > 0) {
            const promptData = await fetchPrompt(promptIds[0]);
            if (promptData) {
              promptText = promptData.fields["Prompt Text"] || "";
              weekNumber = promptData.fields["Week Number"] || null;
            }
          }
          return {
            id: record.id,
            date: record.fields["Date Received"] || "",
            prompt: promptText,
            weekNumber,
            response: record.fields["Response Text"] || "",
          };
        })
      );

      // Sort by week number ascending (oldest first)
      enriched.sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
      setEntries(enriched);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentIndex]);

  const goNext = () => {
    if (currentIndex < entries.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.textLight,
      }}>
        <p style={{ fontSize: 19, fontStyle: "italic" }}>Loading your writing...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 28,
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", margin: "0 0 16px" }}>
            My Throughline
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.textLight }}>
            Nothing here yet — your writing will appear here after you respond to your first prompt.
          </p>
        </div>
      </div>
    );
  }

  const entry = entries[currentIndex];

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: COLORS.bg,
      fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 28px 20px", borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.bg, position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: 720, margin: "0 auto",
        }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 400, margin: 0, letterSpacing: "-0.01em",
              color: COLORS.text, fontStyle: "italic",
            }}>My Throughline</h1>
            <p style={{
              fontSize: 15, color: COLORS.textLight, margin: "4px 0 0",
              fontFamily: "'Inter', sans-serif",
            }}>{entries.length} {entries.length === 1 ? "entry" : "entries"} written</p>
          </div>
          <div style={{
            display: "flex", gap: 4, backgroundColor: COLORS.navBg, borderRadius: 10, padding: 4,
          }}>
            {[
              { key: "single", label: "One at a time" },
              { key: "all", label: "Read all" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setViewMode(key)} style={{
                padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 15,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
                backgroundColor: viewMode === key ? COLORS.cardBg : "transparent",
                color: viewMode === key ? COLORS.text : COLORS.textLight,
                boxShadow: viewMode === key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease", minHeight: 44,
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        maxWidth: 720, margin: "0 auto", padding: "32px 28px 120px",
      }}>
        {viewMode === "single" ? (
          <div>
            <div style={{
              textAlign: "center", marginBottom: 32, fontFamily: "'Inter', sans-serif",
              fontSize: 14, color: COLORS.textLight, letterSpacing: "0.05em", textTransform: "uppercase",
            }}>Entry {currentIndex + 1} of {entries.length}</div>

            {entry.prompt && (
              <div style={{
                backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.border}`,
                borderRadius: 12, padding: "20px 24px", marginBottom: 32,
              }}>
                <p style={{
                  fontSize: 14, color: COLORS.accent, margin: "0 0 6px",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>The Prompt</p>
                <p style={{ fontSize: 19, lineHeight: 1.5, margin: 0, fontStyle: "italic", color: COLORS.text }}>
                  {entry.prompt}
                </p>
              </div>
            )}

            <p style={{
              fontSize: 15, color: COLORS.textLight, fontFamily: "'Inter', sans-serif", marginBottom: 16,
            }}>{formatDate(entry.date)}</p>

            <div style={{ marginBottom: 48 }}>
              {entry.response.split("\n\n").map((paragraph, i) => (
                <p key={i} style={{ fontSize: 21, lineHeight: 1.75, margin: "0 0 24px", color: COLORS.text }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: 24, borderTop: `1px solid ${COLORS.border}`,
            }}>
              <button onClick={goPrev} disabled={currentIndex === 0} style={{
                padding: "16px 32px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
                backgroundColor: currentIndex === 0 ? COLORS.navBg : COLORS.cardBg,
                color: currentIndex === 0 ? COLORS.textLight : COLORS.text,
                fontSize: 17, fontFamily: "'Inter', sans-serif",
                cursor: currentIndex === 0 ? "default" : "pointer",
                opacity: currentIndex === 0 ? 0.4 : 1, minHeight: 52, minWidth: 120,
                transition: "all 0.2s ease",
              }}>← Newer</button>
              <button onClick={goNext} disabled={currentIndex === entries.length - 1} style={{
                padding: "16px 32px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
                backgroundColor: currentIndex === entries.length - 1 ? COLORS.navBg : COLORS.cardBg,
                color: currentIndex === entries.length - 1 ? COLORS.textLight : COLORS.text,
                fontSize: 17, fontFamily: "'Inter', sans-serif",
                cursor: currentIndex === entries.length - 1 ? "default" : "pointer",
                opacity: currentIndex === entries.length - 1 ? 0.4 : 1, minHeight: 52, minWidth: 120,
                transition: "all 0.2s ease",
              }}>Older →</button>
            </div>
          </div>
        ) : (
          <div>
            {entries.map((e, i) => (
              <div key={e.id} style={{
                marginBottom: 56, paddingBottom: 56,
                borderBottom: i < entries.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                {e.prompt && (
                  <div style={{
                    backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.border}`,
                    borderRadius: 12, padding: "18px 22px", marginBottom: 24,
                  }}>
                    <p style={{
                      fontSize: 13, color: COLORS.accent, margin: "0 0 4px",
                      fontFamily: "'Inter', sans-serif", fontWeight: 600,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>The Prompt</p>
                    <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                      {e.prompt}
                    </p>
                  </div>
                )}
                <p style={{
                  fontSize: 14, color: COLORS.textLight, fontFamily: "'Inter', sans-serif", marginBottom: 14,
                }}>{formatDate(e.date)}</p>
                {e.response.split("\n\n").map((paragraph, j) => (
                  <p key={j} style={{ fontSize: 21, lineHeight: 1.75, margin: "0 0 22px", color: COLORS.text }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
