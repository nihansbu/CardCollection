const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function readSave() {
  return {
    rap: readJson("rap-card-collection:rap", 2450),
    collection: readJson("rap-card-collection:collection", []),
    pity: readJson("rap-card-collection:pity", {
      packsSinceEpic: 0,
      packsSinceLegendary: 0,
    }),
  };
}

export function writeRap(value) {
  localStorage.setItem("rap-card-collection:rap", JSON.stringify(value));
}

export function writeCollection(value) {
  localStorage.setItem("rap-card-collection:collection", JSON.stringify(value));
}

export function writePity(value) {
  localStorage.setItem("rap-card-collection:pity", JSON.stringify(value));
}
