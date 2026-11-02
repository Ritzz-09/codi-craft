(() => {
  const stepDefinitions = [
    { id: "brief", label: "Describe", hint: "Tell us what to build", controls: ["prompt", "presetChips"] },
    { id: "provider", label: "Connect AI", hint: "Choose provider and model", controls: ["apiProvider"] },
    { id: "build", label: "Build setup", hint: "Language, task, and style", controls: ["editAction", "language", "framework", "tone", "complexity"] },
    { id: "mode", label: "Build mode", hint: "Choose the kind of result", controls: ["modeToggle", "studioModeToggle", "compareBtn"] },
    { id: "workspace", label: "Workspace", hint: "Project context", controls: ["workspaceName", "focusFileSelect"] },
    { id: "quality", label: "Quality", hint: "Rules and constraints", controls: ["strictNoLibraries", "strictRunnableOutput", "strictSingleFile"] },
    { id: "practice", label: "Test", hint: "Test cases and interview setup", controls: ["leetcodeProblemId", "leetcodeQuestionName", "testCasesInput", "expectedOutputInput"] },
    { id: "references", label: "References", hint: "Add files or screenshots", controls: ["attachmentInput", "attachmentList"] }
  ];

  const closestStepElement = (element) => element?.closest(".control-card, .preset-block, .attachment-toolbar, .attachment-list, .strict-options, .leetcode-problem-card") || element?.parentElement;

  const initialiseStepFlow = () => {
    const composer = document.querySelector(".composer-panel");
    const actionRow = composer?.querySelector(".action-row");
    const promptGrid = composer?.querySelector(".prompt-grid");
    if (!composer || !actionRow || document.getElementById("controlHierarchy")) return;

    const wizard = document.createElement("section");
    wizard.className = "control-hierarchy";
    wizard.id = "controlHierarchy";
    wizard.setAttribute("aria-label", "Generation setup steps");
    wizard.innerHTML = `<div class="wizard-hero"><div class="hierarchy-header"><div><span class="eyebrow">CODECRAFT FLOW</span><h3>Shape your build, one decision at a time.</h3></div><p id="wizardProgress" aria-live="polite"></p></div><div class="wizard-signals" aria-label="Workspace benefits"><span><i></i>Bring your own key</span><span><i></i>Guided setup</span><span><i></i>Private by default</span></div></div><div class="wizard-meter" aria-hidden="true"><span></span></div><ol class="wizard-progress" aria-label="Generation setup progress"></ol><div class="wizard-steps"></div><div class="wizard-actions"><button class="ghost-btn" type="button" id="wizardBack"><span aria-hidden="true">←</span> Back</button><button class="primary-btn" type="button" id="wizardNext">Next <span aria-hidden="true">→</span></button></div>`;

    const progress = wizard.querySelector(".wizard-progress");
    const steps = wizard.querySelector(".wizard-steps");
    const createdSteps = [];

    stepDefinitions.forEach((definition) => {
      const elements = [...new Set(definition.controls.map((id) => closestStepElement(document.getElementById(id))).filter(Boolean))];
      if (!elements.length) return;
      const step = document.createElement("section");
      step.className = "wizard-step";
      step.id = `wizard-${definition.id}`;
      step.hidden = true;
      step.innerHTML = `<div class="wizard-step-heading"><span class="step-kicker"></span><h4 tabindex="-1">${definition.label}</h4><p>${definition.hint}</p></div><div class="wizard-step-body"></div>`;
      const body = step.querySelector(".wizard-step-body");
      elements.forEach((element) => body.appendChild(element));
      steps.appendChild(step);
      createdSteps.push({ definition, step });
    });

    if (!createdSteps.length) return;
    composer.classList.add("wizard-mode");
    if (promptGrid) promptGrid.hidden = true;
    composer.insertBefore(wizard, actionRow);
    wizard.appendChild(actionRow);

    const backButton = wizard.querySelector("#wizardBack");
    const nextButton = wizard.querySelector("#wizardNext");
    const progressText = wizard.querySelector("#wizardProgress");
    const meter = wizard.querySelector(".wizard-meter span");
    let currentStep = 0;

    const showStep = (index, focus = false) => {
      const previousStep = currentStep;
      currentStep = Math.max(0, Math.min(index, createdSteps.length - 1));
      createdSteps.forEach(({ step }, stepIndex) => { step.hidden = stepIndex !== currentStep; });
      const { definition, step } = createdSteps[currentStep];
      step.querySelector(".step-kicker").textContent = `STEP ${currentStep + 1} OF ${createdSteps.length}`;
      progressText.textContent = `${definition.label} — ${definition.hint}`;
      meter.style.width = `${((currentStep + 1) / createdSteps.length) * 100}%`;
      backButton.disabled = currentStep === 0;
      const onLastStep = currentStep === createdSteps.length - 1;
      nextButton.hidden = onLastStep;
      actionRow.hidden = !onLastStep;
      nextButton.innerHTML = 'Next <span aria-hidden="true">→</span>';
      progress.innerHTML = "";
      createdSteps.forEach(({ definition: item }, itemIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${itemIndex + 1}. ${item.label}`;
        button.disabled = itemIndex > currentStep;
        button.className = itemIndex === currentStep ? "active" : itemIndex < currentStep ? "complete" : "";
        if (itemIndex === currentStep) button.setAttribute("aria-current", "step");
        button.addEventListener("click", () => showStep(itemIndex, true));
        const listItem = document.createElement("li");
        listItem.appendChild(button);
        progress.appendChild(listItem);
      });
      step.classList.remove("stage-forward", "stage-back");
      void step.offsetWidth;
      step.classList.add(currentStep >= previousStep ? "stage-forward" : "stage-back");
      if (focus) step.querySelector("h4")?.focus({ preventScroll: true });
    };

    backButton.addEventListener("click", () => showStep(currentStep - 1, true));
    nextButton.addEventListener("click", () => {
      if (currentStep < createdSteps.length - 1) return showStep(currentStep + 1, true);
    });
    showStep(0);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialiseStepFlow, { once: true });
  else initialiseStepFlow();
  window.addEventListener("load", initialiseStepFlow, { once: true });
})();
