export default function LandingPage() {
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
    </div>
  );
}