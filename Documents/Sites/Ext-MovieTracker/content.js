console.log("Tracker content script loaded on:", window.location.href);

console.log("Tracker content script loaded on:", window.location.href);

function parseFMoviesTitle(raw) {
  if (!raw) {
    return { title: "", season: null, episodeNumber: null, episodeName: null };
  }

  // Remove everything after the first pipe
  let main = raw.replace(/\s*\|\s*.*$/, "").trim();
  main = main.replace(/^Watch\s+/i, "").trim();

  // Pattern: <Show> S1E1 "Episode Name"
  const fullMatch = main.match(/^(.*?)\s+(S\d+)(E\d+)\s+"(.*)"$/i);
  if (fullMatch) {
    return {
      title: fullMatch[1].trim(),
      season: fullMatch[2],           // "S1"
      episodeNumber: fullMatch[3],    // "E01"
      episodeName: fullMatch[4]       // "The Great"
    };
  }

  // Pattern: <Show> S1E1 (no episode name)
  const simpleMatch = main.match(/^(.*?)\s+(S\d+)(E\d+)$/i);
  if (simpleMatch) {
    return {
      title: simpleMatch[1].trim(),
      season: simpleMatch[2],
      episodeNumber: simpleMatch[3],
      episodeName: null
    };
  }

  // Fallback: movie
  return {
    title: main,
    season: null,
    episodeNumber: null,
    episodeName: null
  };
}

function getLikelyTitle() {
  const og = document.querySelector('meta[property="og:title"]');
  const raw = og?.content || document.title;
  return parseFMoviesTitle(raw);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "getTitle") {
    const data = getLikelyTitle();
    console.log("Parsed title data:", data);
    sendResponse(data);
  }
});