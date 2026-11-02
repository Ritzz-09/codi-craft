(() => {
  const initialiseSideHub = () => {
    const previewPanel = document.querySelector(".preview-panel");
    const cards = [...(previewPanel?.children || [])].filter((element) => element.classList?.contains("insights-card"));
    if (!previewPanel || cards.length < 2 || document.getElementById("sideHub")) return;

    const labelMap = {
      "Generation Notes": "Notes",
      "Learning Roadmap": "Learn",
      Projects: "Projects",
      "Recent History": "History",
      "Prompt Versions": "Versions"
    };
    const hub = document.createElement("section");
    hub.className = "glass-card side-hub";
    hub.id = "sideHub";
    hub.setAttribute("aria-label", "Workspace panels");
    hub.innerHTML = '<div class="side-hub-tabs" role="tablist" aria-label="Workspace panels"></div><div class="side-hub-content"></div>';
    const tabs = hub.querySelector(".side-hub-tabs");
    const content = hub.querySelector(".side-hub-content");
    const panels = [];
    previewPanel.insertBefore(hub, cards[0]);

    cards.forEach((card, index) => {
      const title = card.querySelector("h3")?.textContent?.trim() || `Panel ${index + 1}`;
      const label = labelMap[title] || title;
      const panelId = `side-hub-panel-${index}`;
      card.classList.remove("glass-card", "insights-card");
      card.classList.add("side-hub-panel");
      card.id = panelId;
      card.setAttribute("role", "tabpanel");
      card.hidden = index !== 0;
      content.appendChild(card);

      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "side-hub-tab";
      tab.textContent = label;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tab.addEventListener("click", () => selectPanel(index));
      tabs.appendChild(tab);
      panels.push({ card, tab });
    });

    const selectPanel = (activeIndex) => {
      panels.forEach(({ card, tab }, index) => {
        const active = index === activeIndex;
        card.hidden = !active;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
    };
    selectPanel(0);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialiseSideHub, { once: true });
  else initialiseSideHub();
  window.addEventListener("load", initialiseSideHub, { once: true });
})();
