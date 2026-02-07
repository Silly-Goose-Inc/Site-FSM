chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    library: {
      movies: {},
      shows: {}
    }
  });
});

async function getLibrary() {
  const data = await chrome.storage.local.get("library");
  return data.library;
}

async function saveLibrary(library) {
  await chrome.storage.local.set({ library });
}
