import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const getMatch = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // init sync
    setMatches(mql.matches);
    // modern browsers
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
