// ---- UI BEHAVIOR ----
document.getElementById("type").addEventListener("change", (e) => {
  const showFields = document.getElementById("showFields");
  showFields.classList.toggle("hidden", e.target.value !== "show");
});

// ---- AUTO-FILL TITLE FROM PAGE ----
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs || tabs.length === 0) return;

  chrome.tabs.sendMessage(tabs[0].id, "getTitle", (response) => {
    if (chrome.runtime.lastError || !response) return;

    // Fill the main title
    const typeSelect = document.getElementById("type");
    document.getElementById("title").value = response.title;

    if (response.season) {
      // Set type to show and trigger the change event
      typeSelect.value = "show";
      typeSelect.dispatchEvent(new Event("change")); // <-- THIS MAKES IT SHOW SEASON/EPISODE FIELDS

      // Fill season and episode
      document.getElementById("season").value = response.season;
      document.getElementById("episode").value = response.episode; // includes episode title if present
    } else {
      typeSelect.value = "movie";
      typeSelect.dispatchEvent(new Event("change")); // ensures fields hide
      document.getElementById("season").value = "";
      document.getElementById("episode").value = "";
    }
  });
});



// ---- CORE FUNCTIONS ----
async function loadLibrary() {
  const data = await chrome.storage.local.get("library");
  return data.library;
}

document.getElementById("grabTitle").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, "getTitle", (response) => {
      if (response && response.title) {
        document.getElementById("title").value = response.title;
      }
    });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs || tabs.length === 0) return;

  chrome.tabs.sendMessage(tabs[0].id, "getTitle", (response) => {
    if (chrome.runtime.lastError || !response) return;

    const typeSelect = document.getElementById("type");
    document.getElementById("title").value = response.title;

    if (response.season) {
      typeSelect.value = "show";
      typeSelect.dispatchEvent(new Event("change"));

      document.getElementById("season").value = response.season;

      // Combine episode number + title for display
      const episodeField = document.getElementById("episode");
      episodeField.value = response.episodeNumber
        ? response.episodeName
          ? `${response.episodeNumber} "${response.episodeName}"`
          : response.episodeNumber
        : "";

    } else {
      typeSelect.value = "movie";
      typeSelect.dispatchEvent(new Event("change"));

      document.getElementById("season").value = "";
      document.getElementById("episode").value = "";
    }
  });
});



if (response.season) {
  typeSelect.value = "show";
  typeSelect.dispatchEvent(new Event("change"));

  document.getElementById("season").value = response.season;
  document.getElementById("episode").value = response.episode; // now includes episode name
} else {
  typeSelect.value = "movie";
  typeSelect.dispatchEvent(new Event("change"));

  document.getElementById("season").value = "";
  document.getElementById("episode").value = "";
}

async function saveLibrary(library) {
  await chrome.storage.local.set({ library });
}

const typeSelect = document.getElementById("type");

if (response.season) {
  // Correctly set the value
  typeSelect.value = "show"; // MUST match <option value="show">
  typeSelect.dispatchEvent(new Event("change")); // trigger the UI update

  document.getElementById("season").value = response.season;
  document.getElementById("episode").value = response.episode; // includes episode title
} else {
  typeSelect.value = "movie";
  typeSelect.dispatchEvent(new Event("change"));

  document.getElementById("season").value = "";
  document.getElementById("episode").value = "";
}


// ---- ACTIONS ----
document.getElementById("markWatched").addEventListener("click", async () => {
    if (type === "movie" && library.movies[title]) {
  const ok = confirm("This movie already exists. Overwrite?");
  if (!ok) return;

  library.shows[title].episodes[key] = {
  rating,
  notes,
  episodeName: response?.episodeName || null,
  watched: true,
  watchedAt: new Date().toISOString()
};

}
  const title = document.getElementById("title").value.trim();
  const type = document.getElementById("type").value;
  const rating = Number(document.getElementById("rating").value);
  const notes = document.getElementById("notes").value;
  const tags = document.getElementById("tags").value
    .split(",")
    .map(t => t.trim())
    .filter(t => t);

  const library = await loadLibrary();

  if (type === "movie") {
    library.movies[title] = {
      title,
      rating,
      notes,
      tags,
      lastWatched: new Date().toISOString(),
      timesWatched: (library.movies[title]?.timesWatched || 0) + 1
    };
  } else {
    const season = document.getElementById("season").value || "S01";
    const episode = document.getElementById("episode").value || "E01";
    const key = `${season}${episode}`;

    if (!library.shows[title]) {
      library.shows[title] = { episodes: {} };
    }

    library.shows[title].episodes[key] = {
      rating,
      notes,
      watched: true,
      watchedAt: new Date().toISOString()
    };
  }

  await saveLibrary(library);
  alert("Marked watched.");
});

document.getElementById("saveNotes").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const type = document.getElementById("type").value;
  const notes = document.getElementById("notes").value;
  const library = await loadLibrary();

  if (type === "movie" && library.movies[title]) {
    library.movies[title].notes = notes;
  }

  if (type === "show" && library.shows[title]) {
    const season = document.getElementById("season").value || "S01";
    const episode = document.getElementById("episode").value || "E01";
    const key = `${season}${episode}`;

    if (library.shows[title].episodes[key]) {
      library.shows[title].episodes[key].notes = notes;
    }
  }

  await saveLibrary(library);
  alert("Notes saved.");
});

document.getElementById("view").addEventListener("click", async () => {
  const library = await loadLibrary();
  let output = "📚 YOUR LIBRARY\n\n";

  output += "🎬 MOVIES\n";
  for (const [title, m] of Object.entries(library.movies)) {
    output += `- ${title} | Rating: ${m.rating} | Watched: ${m.timesWatched}x\n`;
  }

  output += "\n📺 SHOWS\n";
  for (const [title, s] of Object.entries(library.shows)) {
    output += `- ${title}\n`;
    for (const [ep, e] of Object.entries(s.episodes)) {
      output += `   • ${ep} | Rating: ${e.rating}\n`;
    }
  }

  document.getElementById("output").textContent = output;
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs || tabs.length === 0) return;

  chrome.tabs.sendMessage(tabs[0].id, "getTitle", (response) => {
    if (chrome.runtime.lastError || !response) return;

    // Always fill the title
    document.getElementById("title").value = response.title;

    // If we have a season, treat it as a show
    if (response.season) {
      document.getElementById("type").value = "show";
      document.getElementById("showFields").classList.remove("hidden");
      document.getElementById("season").value = response.season;
      document.getElementById("episode").value = response.episode; // includes title if present
    } else {
      // Otherwise, movie
      document.getElementById("type").value = "movie";
      document.getElementById("showFields").classList.add("hidden");
      document.getElementById("episode").value = "";
      document.getElementById("season").value = "";
    }
  });
});
