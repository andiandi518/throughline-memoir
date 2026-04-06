import { useState, useEffect } from "react";
import MemoirWriter from "./MemoirWriter";
import MemoirReader from "./MemoirReader";
import MemoirIntake from "./MemoirIntake";
import MemoirFreeWrite from "./MemoirFreeWrite";
import LandingPage from "./LandingPage";

export default function App() {
  const [page, setPage] = useState("landing");

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.replace("#", "");
      const params = new URLSearchParams(window.location.search);

      if (hash === "read") setPage("read");
      else if (hash === "intake" || params.get("intake") === "true") setPage("intake");
      else if (hash === "freewrite") setPage("freewrite");
      else if (params.get("entry")) setPage("write");
      else setPage("landing");
    };
    handleRoute();
    window.addEventListener("hashchange", handleRoute);
    return () => window.removeEventListener("hashchange", handleRoute);
  }, []);

  if (page === "read") return <MemoirReader />;
  if (page === "intake") return <MemoirIntake />;
  if (page === "freewrite") return <MemoirFreeWrite />;
  if (page === "write") return <MemoirWriter />;
  return <LandingPage />;
}