// imageStorage.js

function saveImageToIndexedDB(base64Image, imageId) {
  const request = indexedDB.open("TradeAppDB", 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images", { keyPath: "id" });
    }
  };
  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    store.put({ id: imageId, image: base64Image });
  };
}

function loadImageFromIndexedDB(id, callback) {
  const request = indexedDB.open("TradeAppDB", 1);
  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      if (getReq.result) callback(getReq.result.image);
    };
  };
}

function deleteImageFromIndexedDB(id) {
  const request = indexedDB.open("TradeAppDB", 1);
  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    store.delete(id);
  };
}
