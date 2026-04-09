import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    const url = "https://magic.beehiiv.com/v1/4a1be6fa-9616-4a98-b569-fd48cb1dff5b?email={{email}}&redirect_to=https%3A%2F%2Fwww.throughlinememoir.com" + encodeURIComponent(email);
    window.open(url, "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "28px",
    }}>
      <img
        src="/wordmark.svg"
        alt="Throughline Memoir"
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <p style={{
        fontSize: 19,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontStyle: "italic",
        color: "#7A6E5D",
        marginTop: 32,
        textAlign: "center",
      }}>
        A guided memoir writing program. Coming soon.
      </p>

      {!submitted ? (
        <div style={{
          marginTop: 28,
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            style={{
              padding: "14px 20px",
              fontSize: 16,
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              border: "1px solid #E8E0D4",
              borderRadius: 8,
              backgroundColor: "#FFFEFA",
              color: "#2C2416",
              outline: "none",
              width: 280,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: "14px 28px",
              fontSize: 16,
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: 500,
              backgroundColor: "#B8860B",
              color: "#FFFEFA",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Get notified
          </button>
        </div>
      ) : (
        <p style={{
          fontSize: 17,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: "#5A8C5A",
          marginTop: 28,
          textAlign: "center",
        }}>
          Check your email to confirm — and we'll be in touch.
        </p>
      )}
    </div>
  );
}