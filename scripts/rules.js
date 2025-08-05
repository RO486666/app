function toggleRules() {
  const box = document.getElementById("rulesBox");
  if (!box) return;

  const isHidden = box.style.display === "none";
  box.style.display = isHidden ? "block" : "none";

  // 🔽 Scroll zu sichtbarer Seite 1 oder 2
  if (isHidden) {
    setTimeout(() => {
      const page1 = document.getElementById("rulePage1");
      const page2 = document.getElementById("rulePage2");

      const target = page1 && page1.style.display !== "none" ? page1 :
                     page2 && page2.style.display !== "none" ? page2 : box;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}
function showPage(page) {
  const page1 = document.getElementById("rulePage1");
  const page2 = document.getElementById("rulePage2");
  const btnPrev = document.getElementById("prevPageBtn");
  const btnNext = document.getElementById("nextPageBtn");

  if (!page1 || !page2) return;

  if (page === 1) {
    page1.style.display = "block";
    page2.style.display = "none";
    btnPrev.style.display = "none";
    btnNext.style.display = "inline-block";

    // 🔽 Scroll direkt zu Seite 1
    setTimeout(() => {
      page1.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

  } else {
    page1.style.display = "none";
    page2.style.display = "block";
    btnPrev.style.display = "inline-block";
    btnNext.style.display = "none";

    // 🔽 Scroll direkt zu Seite 2
    setTimeout(() => {
      page2.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}
