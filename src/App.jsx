import { useState, useEffect } from "react";
import MemoirWriter from "./MemoirWriter";
import MemoirReader from "./MemoirReader";

export default function App() {
  const [page, setPage] = useState("write");

  useEffect(() => {
    // Simple hash-based routing
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "read") setPage("read");
      else setPage("write");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (page === "read") return <MemoirReader />;
  return <MemoirWriter />;
}
