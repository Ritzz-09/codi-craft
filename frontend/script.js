const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const promptInput = document.getElementById("prompt");
const attachmentInput = document.getElementById("attachmentInput");
const attachBtn = document.getElementById("attachBtn");
const attachmentList = document.getElementById("attachmentList");
const attachmentHelper = document.getElementById("attachmentHelper");
const editActionSelect = document.getElementById("editAction");
const languageSelect = document.getElementById("language");
const frameworkSelect = document.getElementById("framework");
const toneSelect = document.getElementById("tone");
const complexityInput = document.getElementById("complexity");
const complexityLabel = document.getElementById("complexityLabel");
const workspaceNameInput = document.getElementById("workspaceName");
const focusFileSelect = document.getElementById("focusFileSelect");
const leetcodeProblemCard = document.getElementById("leetcodeProblemCard");
const leetcodeProblemIdInput = document.getElementById("leetcodeProblemId");
const leetcodeQuestionNameInput = document.getElementById("leetcodeQuestionName");
const compareBtn = document.getElementById("compareBtn");
const strictNoLibrariesInput = document.getElementById("strictNoLibraries");
const strictRunnableOutputInput = document.getElementById("strictRunnableOutput");
const strictSingleFileInput = document.getElementById("strictSingleFile");
const studioModeToggle = document.getElementById("studioModeToggle");
const testCasesInput = document.getElementById("testCasesInput");
const expectedOutputInput = document.getElementById("expectedOutputInput");
const promptHealth = document.getElementById("promptHealth");
const outputEstimate = document.getElementById("outputEstimate");
const codeContent = document.getElementById("codeContent");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const voicePromptBtn = document.getElementById("voicePromptBtn");
const copyBtn = document.getElementById("copyBtn");
const copyExplainBtn = document.getElementById("copyExplainBtn");
const repairBtn = document.getElementById("repairBtn");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const loadProjectBtn = document.getElementById("loadProjectBtn");
const exportBtn = document.getElementById("exportBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadExplainBtn = document.getElementById("downloadExplainBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const backendStatusPill = document.getElementById("backendStatusPill");
const backendStatusDot = document.getElementById("backendStatusDot");
const backendStatusText = document.getElementById("backendStatusText");
const modeBadge = document.getElementById("modeBadge");
const languageBadge = document.getElementById("languageBadge");
const promptRecipe = document.getElementById("promptRecipe");
const promptRecipeHint = document.getElementById("promptRecipeHint");
const learningFocus = document.getElementById("learningFocus");
const learningFocusHint = document.getElementById("learningFocusHint");
const previewTitle = document.getElementById("previewTitle");
const statusText = document.getElementById("statusText");
const statusMeta = document.getElementById("statusMeta");
const progressBar = document.getElementById("progressBar");
const warningStrip = document.getElementById("warningStrip");
const warningList = document.getElementById("warningList");
const fileName = document.getElementById("fileName");
const editorLanguage = document.getElementById("editorLanguage");
const editorComplexity = document.getElementById("editorComplexity");
const editorIntent = document.getElementById("editorIntent");
const editorStudioMode = document.getElementById("editorStudioMode");
const editorStrict = document.getElementById("editorStrict");
const explainModeSelect = document.getElementById("explainMode");
const requestView = document.getElementById("requestView");
const structureView = document.getElementById("structureView");
const filesView = document.getElementById("filesView");
const explainView = document.getElementById("explainView");
const diagnosticsView = document.getElementById("diagnosticsView");
const runView = document.getElementById("runView");
const testsView = document.getElementById("testsView");
const quizView = document.getElementById("quizView");
const mentorConcept = document.getElementById("mentorConcept");
const mentorConceptHint = document.getElementById("mentorConceptHint");
const mentorDifficulty = document.getElementById("mentorDifficulty");
const mentorDifficultyHint = document.getElementById("mentorDifficultyHint");
const mentorNextStep = document.getElementById("mentorNextStep");
const mentorNextStepHint = document.getElementById("mentorNextStepHint");
const learningRoadmap = document.getElementById("learningRoadmap");
const diffSummary = document.getElementById("diffSummary");
const diffLeft = document.getElementById("diffLeft");
const diffRight = document.getElementById("diffRight");
const previewFrame = document.getElementById("previewFrame");
const editorArea = document.getElementById("editorArea");
const outputTabs = document.getElementById("outputTabs");
const variantTabs = document.getElementById("variantTabs");
const fileTabs = document.getElementById("fileTabs");
const codeWindow = document.querySelector(".code-window");
const projectTree = document.getElementById("projectTree");
const insightList = document.getElementById("insightList");
const runtimeStatusList = document.getElementById("runtimeStatusList");
const historyList = document.getElementById("historyList");
const savedProjectsList = document.getElementById("savedProjectsList");
const promptVersionsList = document.getElementById("promptVersionsList");
const modeToggle = document.getElementById("modeToggle");
const scene3D = document.querySelector(".scene-3d");
const gridPlanes = document.querySelectorAll(".grid-plane");
const orbs = document.querySelectorAll(".orb");
const beams = document.querySelectorAll(".beam");

const complexityMap = { 1: "Starter", 2: "Balanced", 3: "Advanced" };
const TEXT_ATTACHMENT_EXTENSIONS = new Set(["txt", "md", "json", "js", "jsx", "ts", "tsx", "py", "html", "css", "scss", "java", "cpp", "c", "cs", "go", "rs", "php", "rb", "xml", "yaml", "yml", "sql"]);
const HISTORY_STORAGE_KEY = "codicraft.history";
const PROJECTS_STORAGE_KEY = "codicraft.projects";
const PROMPT_VERSIONS_STORAGE_KEY = "codicraft.promptVersions";
const WORKSPACE_STORAGE_KEY = "codicraft.workspace";
const MAX_ATTACHMENTS = 5;
const MAX_TEXT_ATTACHMENT_CHARS = 5000;
const MAX_HISTORY_ITEMS = 8;
const MAX_IMAGE_DATA_URL_CHARS = 6_000_000;
const CODING_SCOPE_TERMS = ["algorithm", "api", "app", "array", "build", "bug", "class", "code", "coding", "compile", "component", "console", "css", "database", "debug", "endpoint", "fix", "frontend", "function", "html", "implement", "input", "javascript", "js", "leetcode", "loop", "method", "node", "object", "output", "print", "program", "programming", "python", "react", "refactor", "return", "script", "server", "software", "sql", "syntax", "test", "typescript", "ui", "variable", "web", "website"];
const GENERAL_KNOWLEDGE_QUESTION_PATTERN = /^(what|who|when|where|why|how)\s+(is|are|was|were|do|does|did|can|could)\b/i;

const presetTemplates = {
  None: [
    "Create a {{language}} program that takes 5 numbers from the user and stores them in an array.",
    "Write a {{language}} program to find the largest number in a list and print the result.",
    "Create a {{language}} program with a for loop that prints a name 5 times.",
    "Build a {{language}} 2D array example using simple nested loops."
  ],
  React: [
    "Build a React component for a student dashboard with a welcome card, task list, and progress section.",
    "Create a React form component with name, email, validation, and a submit button.",
    "Build a React pricing card component with title, price, features, and CTA."
  ],
  "Next.js": [
    "Create a Next.js landing page with a hero section, feature cards, and a contact CTA.",
    "Build a Next.js student portal page with announcements, assignments, and a progress summary.",
    "Create a Next.js responsive navbar with logo, links, and mobile menu."
  ],
  Vue: [
    "Build a Vue app that adds student names to a list and shows the total count.",
    "Create a Vue notes component with add, edit, and delete actions.",
    "Build a Vue form that collects marks and shows the average."
  ],
  Flask: [
    "Create a Flask API with routes to add, view, update, and delete tasks.",
    "Build a Flask app that accepts student marks and returns the average in JSON.",
    "Create a Flask backend route that validates input and returns a success or error response."
  ],
  Express: [
    "Create an Express API with CRUD routes for tasks and simple input validation.",
    "Build an Express route that accepts student data and returns a formatted JSON response.",
    "Create an Express backend with one route for adding items and one route for listing them."
  ],
  Tailwind: [
    "Build a Tailwind student dashboard with summary cards, task list, and responsive spacing.",
    "Create a Tailwind pricing section with three cards and a highlighted popular plan.",
    "Build a Tailwind contact form with clean labels, inputs, and submit button."
  ],
  Vanilla: [
    "Build a plain {{language}} program with simple logic and no external libraries.",
    "Create a vanilla {{language}} app that takes input, processes it, and shows the result clearly.",
    "Write a {{language}} beginner example that uses loops, conditions, and output in one file."
  ]
};

let backendReady = false;
let backendModelName = "llama-3.1-8b-instant";
let selectedMode = "code";
let selectedStudioMode = "standard";
let compareEnabled = false;
let activeOutputTab = "code";
let selectedAttachments = [];
let selectedVariantIndex = 0;
let selectedFilePath = "";
let typingTimer = null;
let generationResult = createEmptyResult();
let historyEntries = loadHistory();
let savedProjects = loadSavedProjects();
let promptVersions = loadPromptVersions();
let crcTable = null;
let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight;
let animationTick = 0;
let lastAutoLeetCodePrompt = "";
let runtimeAvailability = {};
let lastRunResult = null;

const pointer = {
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0
};

const wallpaper = {
  x: 0,
  y: 0
};

const stars = Array.from({ length: 130 }, () => ({
  x: Math.random() * sceneWidth,
  y: Math.random() * sceneHeight,
  radius: Math.random() * 1.6 + 0.2,
  speed: Math.random() * 0.38 + 0.08,
  alpha: Math.random() * 0.6 + 0.3
}));

const particles3D = Array.from({ length: 34 }, () => ({
  x: (Math.random() - 0.5) * sceneWidth * 1.35,
  y: (Math.random() - 0.5) * sceneHeight * 0.82,
  z: Math.random() * 1200 + 140,
  size: Math.random() * 2.8 + 1.3,
  hue: Math.random() > 0.4 ? "120,240,213" : "108,168,255",
  velocity: Math.random() * 6 + 3
}));

function resizeCanvas() {
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  canvas.width = sceneWidth;
  canvas.height = sceneHeight;
}

function drawPerspectiveHorizon() {
  const horizonWidth = sceneWidth * 0.36;
  const pulse = 0.3 + Math.sin(animationTick * 3.2) * 0.08;

  ctx.beginPath();
  ctx.strokeStyle = `rgba(120,240,213,${pulse})`;
  ctx.lineWidth = 1.1;
  ctx.moveTo(-horizonWidth, sceneHeight * -0.02);
  ctx.lineTo(horizonWidth, sceneHeight * -0.02);
  ctx.stroke();

  for (let index = 0; index < 7; index += 1) {
    const offset = (index - 3) * 70;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(108,168,255,${0.05 + index * 0.018})`;
    ctx.moveTo(offset, sceneHeight * -0.02);
    ctx.lineTo(offset * 1.85 + pointer.currentX * 60, sceneHeight * 0.34);
    ctx.stroke();
  }
}

function drawStars() {
  animationTick += 0.008;
  ctx.clearRect(0, 0, sceneWidth, sceneHeight);

  const gradient = ctx.createRadialGradient(
    sceneWidth * 0.5,
    sceneHeight * 0.54,
    0,
    sceneWidth * 0.5,
    sceneHeight * 0.54,
    Math.max(sceneWidth, sceneHeight) * 0.65
  );
  gradient.addColorStop(0, "rgba(108,168,255,0.12)");
  gradient.addColorStop(0.45, "rgba(120,240,213,0.05)");
  gradient.addColorStop(1, "rgba(8,17,31,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, sceneWidth, sceneHeight);

  stars.forEach((star, index) => {
    const twinkle = 0.4 + Math.sin(animationTick * 6 + index) * 0.22;
    ctx.fillStyle = `rgba(240,246,255,${star.alpha + twinkle * 0.2})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius + twinkle * 0.35, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    star.x += Math.sin(animationTick + index * 0.2) * 0.06;

    if (star.y > sceneHeight + 6) {
      star.y = -6;
      star.x = Math.random() * sceneWidth;
    }
  });

  ctx.save();
  ctx.translate(sceneWidth / 2, sceneHeight * 0.58);

  particles3D.forEach((particle, index) => {
    particle.z -= particle.velocity;

    if (particle.z < 80) {
      particle.x = (Math.random() - 0.5) * sceneWidth * 1.35;
      particle.y = (Math.random() - 0.5) * sceneHeight * 0.82;
      particle.z = 1200;
    }

    const perspective = 420 / particle.z;
    const x = particle.x * perspective + pointer.currentX * 42;
    const y = particle.y * perspective + pointer.currentY * 30;
    const size = particle.size * (1 + perspective * 3.2);
    const alpha = Math.min(0.85, 0.12 + perspective * 1.2);

    ctx.beginPath();
    ctx.fillStyle = `rgba(${particle.hue},${alpha})`;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = `rgba(${particle.hue},${alpha * 0.35})`;
    ctx.lineWidth = Math.max(0.6, size * 0.18);
    ctx.moveTo(x, y);
    ctx.lineTo(x - pointer.currentX * 24 - size * 2.1, y + particle.velocity * 1.8 + index * 0.02);
    ctx.stroke();
  });

  drawPerspectiveHorizon();
  ctx.restore();
  requestAnimationFrame(drawStars);
}

function animateSceneDepth() {
  pointer.currentX += (pointer.targetX - pointer.currentX) * 0.12;
  pointer.currentY += (pointer.targetY - pointer.currentY) * 0.12;

  wallpaper.x = pointer.currentX * 52;
  wallpaper.y = pointer.currentY * 40;
  document.body.style.setProperty("--wallpaper-x", `${wallpaper.x}px`);
  document.body.style.setProperty("--wallpaper-y", `${wallpaper.y}px`);

  if (scene3D) {
    scene3D.style.perspectiveOrigin = `${50 + pointer.currentX * 12}% ${50 + pointer.currentY * 12}%`;
  }

  gridPlanes.forEach((plane, index) => {
    const xShift = pointer.currentX * (index === 0 ? 24 : 44);
    const yShift = pointer.currentY * (index === 0 ? 18 : 28);
    plane.style.transform = `rotateX(78deg) translate3d(${xShift}px, ${yShift}px, ${index === 0 ? -90 : 70}px)`;
  });

  orbs.forEach((orb, index) => {
    const xShift = pointer.currentX * (24 + index * 18);
    const yShift = pointer.currentY * (18 + index * 14);
    orb.style.transform = `translate3d(${xShift}px, ${yShift}px, ${28 + index * 24}px)`;
  });

  beams.forEach((beam, index) => {
    const angle = index === 0 ? 18 + pointer.currentX * 6 : -22 + pointer.currentX * 6;
    beam.style.transform = `translate3d(${pointer.currentX * (18 + index * 10)}px, ${pointer.currentY * 24}px, 0) rotate(${angle}deg)`;
  });

  requestAnimationFrame(animateSceneDepth);
}

function updateFocusFileOptions() {
  const files = getCurrentFiles();
  focusFileSelect.innerHTML = ['<option value="">Auto</option>', ...files.map((file) => `<option value="${escapeAttribute(file.path)}">${escapeHtml(file.path)}</option>`)].join("");
  if (selectedFilePath && files.some((file) => file.path === selectedFilePath)) {
    focusFileSelect.value = selectedFilePath;
  }
}

function createEmptyResult() {
  return { summary: "", notes: [], warnings: [], intent: "generate_code", studioMode: "standard", strictOptions: {}, variants: [{ label: "Primary", files: [{ path: "snippet.txt", content: "// Your generated result will appear here.", role: "main" }] }] };
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function highlightCode(code, filePath = "") {
  const text = String(code || "").replace(/\r\n/g, "\n");
  const fileType = getExtension(filePath) || getLanguageExtension(languageSelect.value);
  const stringRanges = [];
  const commentRanges = [];

  const pushRange = (list, start, end, type) => {
    if (start >= 0 && end > start) {
      list.push({ start, end, type });
    }
  };

  if (["py", "rb"].includes(fileType)) {
    for (const match of text.matchAll(/#[^\n]*/g)) {
      pushRange(commentRanges, match.index, match.index + match[0].length, "comment");
    }
  } else {
    for (const match of text.matchAll(/\/\/[^\n]*/g)) {
      pushRange(commentRanges, match.index, match.index + match[0].length, "comment");
    }
  }

  for (const match of text.matchAll(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g)) {
    pushRange(stringRanges, match.index, match.index + match[0].length, "string");
  }

  const protectedRanges = [...commentRanges, ...stringRanges].sort((left, right) => left.start - right.start);
  const isProtectedIndex = (index) => protectedRanges.some((range) => index >= range.start && index < range.end);

  const keywordSets = {
    py: /\b(?:def|return|for|while|if|elif|else|import|from|as|class|try|except|finally|with|in|and|or|not|None|True|False)\b/g,
    js: /\b(?:function|return|const|let|var|if|else|for|while|import|from|export|class|new|try|catch|finally|async|await|null|true|false)\b/g,
    jsx: /\b(?:function|return|const|let|var|if|else|for|while|import|from|export|class|new|try|catch|finally|async|await|null|true|false)\b/g,
    ts: /\b(?:function|return|const|let|var|if|else|for|while|import|from|export|class|new|try|catch|finally|async|await|interface|type|enum|null|true|false)\b/g,
    tsx: /\b(?:function|return|const|let|var|if|else|for|while|import|from|export|class|new|try|catch|finally|async|await|interface|type|enum|null|true|false)\b/g,
    java: /\b(?:public|private|protected|static|class|return|if|else|for|while|new|import|package|void|int|double|boolean|try|catch|finally|null|true|false)\b/g,
    c: /\b(?:int|char|float|double|void|return|if|else|for|while|struct|typedef|include)\b/g,
    cpp: /\b(?:int|char|float|double|void|return|if|else|for|while|class|struct|template|include|namespace|using|new|delete)\b/g,
    cs: /\b(?:public|private|protected|class|static|void|return|if|else|for|while|using|namespace|new|try|catch|finally|null|true|false)\b/g,
    go: /\b(?:func|return|if|else|for|range|package|import|var|const|type|struct|interface|go|defer)\b/g,
    rs: /\b(?:fn|let|mut|return|if|else|for|while|loop|match|impl|struct|enum|use|mod|pub|trait)\b/g,
    php: /\b(?:function|return|if|else|foreach|for|while|class|public|private|protected|new|use|null|true|false)\b/g,
    rb: /\b(?:def|end|return|if|elsif|else|for|while|class|module|require|do|begin|rescue|nil|true|false)\b/g,
    kt: /\b(?:fun|return|if|else|for|while|class|object|val|var|when|import|null|true|false)\b/g,
    swift: /\b(?:func|return|if|else|for|while|class|struct|enum|let|var|import|nil|true|false)\b/g,
    dart: /\b(?:void|return|if|else|for|while|class|final|var|const|import|null|true|false)\b/g,
    html: /<\/?[A-Za-z][^>\s\/]*/g,
    css: /(^|[{\s;])([.#]?[A-Za-z_-][\w-]*)(?=\s*[:{])/gm
  };

  const tokens = [];
  const addTokenMatches = (regex, type, formatter = (match) => match[0], indexAccessor = (match) => match.index) => {
    if (!regex) return;
    for (const match of text.matchAll(regex)) {
      const start = indexAccessor(match);
      const value = formatter(match);
      if (start == null || !value || isProtectedIndex(start)) continue;
      tokens.push({ start, end: start + value.length, type });
    }
  };

  addTokenMatches(keywordSets[fileType], "keyword", (match) => fileType === "css" ? match[2] : match[0], (match) => fileType === "css" ? match.index + match[0].lastIndexOf(match[2]) : match.index);
  addTokenMatches(/\b\d+(?:\.\d+)?\b/g, "number");
  addTokenMatches(/\b(?:def|function|class|func)\s+([A-Za-z_]\w*)/g, "function", (match) => match[1], (match) => match.index + match[0].lastIndexOf(match[1]));
  addTokenMatches(/\b(?:const|let|var)\s+([A-Za-z_]\w*)/g, "function", (match) => match[1], (match) => match.index + match[0].lastIndexOf(match[1]));

  stringRanges.forEach((range) => tokens.push(range));
  commentRanges.forEach((range) => tokens.push(range));
  tokens.sort((left, right) => left.start - right.start || right.end - left.end);

  let cursor = 0;
  let output = "";
  for (const token of tokens) {
    if (token.start < cursor) continue;
    output += escapeHtml(text.slice(cursor, token.start));
    output += `<span class="token-${token.type}">${escapeHtml(text.slice(token.start, token.end))}</span>`;
    cursor = token.end;
  }
  output += escapeHtml(text.slice(cursor));
  return output;
}

function getExtension(path) {
  const parts = String(path).split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function getLanguageExtension(language) {
  const map = {
    JavaScript: "js",
    TypeScript: "ts",
    Python: "py",
    "HTML/CSS": "html",
    React: "jsx",
    "Node.js": "js",
    C: "c",
    "C++": "cpp",
    "C#": "cs",
    Go: "go",
    Rust: "rs",
    Java: "java",
    Kotlin: "kt",
    Swift: "swift",
    PHP: "php",
    Ruby: "rb",
    Dart: "dart"
  };
  return map[language] || "txt";
}

function inferExtensionFromContent(content, fallbackExtension = "txt") {
  const text = String(content || "");
  if (/^\s*(def |class |import |from .+ import )/m.test(text)) return "py";
  if (/<html|<body|<div|<section|<!doctype html/i.test(text)) return "html";
  if (/^\s*[.#]?[A-Za-z][\w-]*\s*\{/m.test(text) || /:root|@media|--[A-Za-z-]+/.test(text)) return "css";
  if (/^\s*(function |const |let |var |import |export )/m.test(text) || /=>/.test(text)) return "js";
  if (/^\s*(interface |type |enum )/m.test(text)) return "ts";
  return fallbackExtension;
}

function inferFallbackFilePath(content, preferredPath = "", index = 0) {
  if (preferredPath && getExtension(preferredPath)) {
    return preferredPath;
  }

  const extension = inferExtensionFromContent(content, getLanguageExtension(languageSelect.value));
  const baseName = index === 0 ? "main" : `file-${index + 1}`;
  return `${baseName}.${extension}`;
}

function isLikelyCodeFile(path = "") {
  return ["js", "jsx", "ts", "tsx", "py", "java", "cpp", "c", "cs", "go", "rs", "php", "rb", "swift", "kt", "kts", "html", "css", "scss", "sql"].includes(getExtension(path));
}

function extractFilesFromWrappedText(text) {
  const files = [];
  const tripleQuotePattern = /"path"\s*:\s*"([^"]+)"[\s\S]*?"content"\s*:\s*"""\s*([\s\S]*?)\s*"""[\s\S]*?"role"\s*:\s*"([^"]*)"/g;
  const jsonStringPattern = /"path"\s*:\s*"([^"]+)"[\s\S]*?"content"\s*:\s*"((?:\\.|[^"])*)"[\s\S]*?"role"\s*:\s*"([^"]*)"/g;

  for (const match of text.matchAll(tripleQuotePattern)) {
    files.push({ path: match[1], content: match[2], role: match[3] });
  }

  for (const match of text.matchAll(jsonStringPattern)) {
    const alreadyAdded = files.some((file) => file.path === match[1]);
    if (alreadyAdded) {
      continue;
    }

    let content = match[2];
    content = content.replace(/\\n/g, "\n").replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
    files.push({ path: match[1], content, role: match[3] });
  }

  return files;
}

function sanitizeGeneratedFileContent(content, filePath = "") {
  if (typeof content !== "string") {
    return "";
  }

  const fileType = getExtension(filePath);
  let cleaned = content.replace(/\r\n/g, "\n").trim();
  cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/\n?```$/, "").trim();

  if (/^\s*\{/.test(cleaned) && /"files"\s*:/.test(cleaned)) {
    try {
      const parsed = JSON.parse(cleaned);
      const firstFile = Array.isArray(parsed.files) ? parsed.files[0] : Array.isArray(parsed.variants) ? parsed.variants[0]?.files?.[0] : null;
      if (firstFile?.content) {
        return sanitizeGeneratedFileContent(firstFile.content, firstFile.path || filePath);
      }
    } catch (error) {
      const extractedFiles = extractFilesFromWrappedText(cleaned);
      const preferredFile = extractedFiles.find((file) => isLikelyCodeFile(file.path)) || extractedFiles[0];
      if (preferredFile?.content) {
        return sanitizeGeneratedFileContent(preferredFile.content, preferredFile.path || filePath);
      }
    }
  }

  const lines = cleaned.split("\n");
  const stopPatterns = [
    /^This code\b/i,
    /^The example usage\b/i,
    /^Explanation\b[:]?/i,
    /^How it works\b[:]?/i,
    /^In summary\b[:]?/i
  ];
  const cleanedLines = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    const nextTrimmed = (lines[index + 1] || "").trim();

    if (!trimmed && cleanedLines.length && stopPatterns.some((pattern) => pattern.test(nextTrimmed))) {
      break;
    }
    if (stopPatterns.some((pattern) => pattern.test(trimmed))) {
      break;
    }

    cleanedLines.push(line);
  }

  cleaned = cleanedLines.join("\n").trim();

  if (fileType === "py") {
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  }

  return cleaned || content.trim();
}

function choosePrimaryResponseContent(data = {}) {
  const normalizedCode = sanitizeGeneratedFileContent(data.code || "", `snippet.${getLanguageExtension(languageSelect.value)}`);
  if (normalizedCode) {
    return normalizedCode;
  }

  const rawOutput = sanitizeGeneratedFileContent(data.raw_model_output || "", `snippet.${getLanguageExtension(languageSelect.value)}`);
  if (rawOutput) {
    return rawOutput;
  }

  return "// No code returned.";
}

function setStatus(message, meta, progress) {
  statusText.textContent = message;
  statusMeta.textContent = meta;
  progressBar.style.width = `${progress}%`;
}

function setBackendStatus(state, text) {
  backendStatusText.textContent = text;
  backendStatusPill.dataset.state = state;
  backendStatusDot.dataset.state = state;
  backendReady = state === "ready";
  generateBtn.disabled = !backendReady;
  generateBtn.textContent = backendReady ? "Generate Code" : "Backend Unavailable";
}

function updateRunButtonVisibility() {
  return;
}

async function checkBackendHealth() {
  try {
    const response = await fetch("http://127.0.0.1:5000/health");
    const data = await response.json();
    if (!response.ok) {
      setBackendStatus("error", "Backend error");
      return;
    }
    if (!data.groq_configured) {
      setBackendStatus("warning", "Add GROQ_API_KEY");
      return;
    }
    backendModelName = data.model || backendModelName;
    runtimeAvailability = data.runtimes || {};
    renderRuntimeStatus();
    updateRunButtonVisibility();
    setBackendStatus("ready", "AI Ready");
  } catch (error) {
    setBackendStatus("error", "Backend offline");
    runtimeAvailability = {};
    renderRuntimeStatus();
    updateRunButtonVisibility();
  }
}

function setMode(mode) {
  selectedMode = mode;
  modeBadge.textContent = mode === "leetcode" ? "LeetCode" : mode.charAt(0).toUpperCase() + mode.slice(1);
  modeToggle.querySelectorAll(".toggle-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  leetcodeProblemCard.hidden = mode !== "leetcode";
}

function setStudioMode(mode) {
  selectedStudioMode = mode;
  studioModeToggle?.querySelectorAll(".toggle-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.studioMode === mode);
  });
}

function setCompareEnabled(enabled) {
  compareEnabled = enabled;
  compareBtn.textContent = enabled ? "On" : "Off";
  compareBtn.classList.toggle("active", enabled);
  compareBtn.setAttribute("aria-pressed", String(enabled));
}

function updateComplexityLabel() {
  complexityLabel.textContent = complexityMap[complexityInput.value];
  editorComplexity.textContent = complexityMap[complexityInput.value];
}

function updateMeta() {
  languageBadge.textContent = languageSelect.value;
  editorLanguage.textContent = languageSelect.value;
}

function renderRuntimeStatus() {
  if (!runtimeStatusList) {
    return;
  }

  const entries = Object.entries(runtimeAvailability || {});
  if (!entries.length) {
    runtimeStatusList.innerHTML = '<article class="history-empty">Runtime checks will appear here.</article>';
    return;
  }

  runtimeStatusList.innerHTML = entries.map(([label, runtime]) => `
    <article class="history-item">
      <strong>${escapeHtml(label)}</strong>
      <span>${runtime.available ? "Ready to run in app" : "Runtime not detected on this machine"}</span>
      <span>${escapeHtml(runtime.command || "unavailable")}</span>
    </article>
  `).join("");
}

function evaluatePromptQuality() {
  const baseLength = promptInput.value.trim().length;
  const attachmentBoost = selectedAttachments.reduce((total, item) => total + (item.kind === "text" ? Math.min(item.content.length, 300) : 90), 0);
  const signal = baseLength + attachmentBoost;
  if (signal > 240) {
    promptHealth.textContent = "Detailed";
    outputEstimate.textContent = compareEnabled ? "Rich x2" : "Rich";
  } else if (signal > 90) {
    promptHealth.textContent = "Strong";
    outputEstimate.textContent = compareEnabled ? "Medium x2" : "Medium";
  } else if (signal > 0) {
    promptHealth.textContent = "Needs detail";
    outputEstimate.textContent = "Compact";
  } else {
    promptHealth.textContent = "Waiting";
    outputEstimate.textContent = "Unknown";
  }
}

function typeWriter(text, filePath = "") {
  clearTimeout(typingTimer);
  codeContent.textContent = "";
  let index = 0;
  function typeNext() {
    if (index < text.length) {
      codeContent.innerHTML = highlightCode(text.slice(0, index + 1), filePath);
      index += 1;
      typingTimer = setTimeout(typeNext, 4);
    }
  }
  typeNext();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function buildPromptFromTemplate(template) {
  return template.replace(/\{\{language\}\}/g, languageSelect.value);
}

function isCodingPrompt(prompt) {
  const value = (prompt || "").trim().toLowerCase();
  if (!value) return false;
  if (selectedMode === "leetcode" || selectedAttachments.length) return true;
  if (CODING_SCOPE_TERMS.some((term) => value.includes(term))) return true;
  if (GENERAL_KNOWLEDGE_QUESTION_PATTERN.test(value)) return false;
  return false;
}

function renderPresetChips() {
  const row = document.getElementById("presetChips");
  const templates = presetTemplates[frameworkSelect.value] || presetTemplates.None;
  row.innerHTML = templates.map((template, index) => `<button class="prompt-chip" type="button" data-template="${escapeAttribute(template)}">Template ${index + 1}</button>`).join("");
  row.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      promptInput.value = buildPromptFromTemplate(chip.dataset.template);
      syncComposerState();
      promptInput.focus();
    });
  });
}

function isTextAttachment(file) {
  return file.type.startsWith("text/") || file.type === "application/json" || TEXT_ATTACHMENT_EXTENSIONS.has(getExtension(file.name));
}

function formatBytes(value) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function truncateText(value) {
  if (value.length <= MAX_TEXT_ATTACHMENT_CHARS) return { text: value, truncated: false };
  return { text: `${value.slice(0, MAX_TEXT_ATTACHMENT_CHARS)}\n... [truncated]`, truncated: true };
}

function loadImageMeta(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => resolve({ width: null, height: null });
    image.src = url;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

async function createAttachmentRecord(file) {
  const base = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`, name: file.name, mimeType: file.type || "application/octet-stream", size: file.size };
  if (file.type.startsWith("image/")) {
    const previewUrl = URL.createObjectURL(file);
    const dimensions = await loadImageMeta(previewUrl);
    const dataUrl = await readFileAsDataUrl(file);
    return { ...base, kind: "image", previewUrl, width: dimensions.width, height: dimensions.height, dataUrl: dataUrl.slice(0, MAX_IMAGE_DATA_URL_CHARS) };
  }
  if (isTextAttachment(file)) {
    const rawText = await file.text();
    const truncated = truncateText(rawText.replace(/\r\n/g, "\n"));
    return { ...base, kind: "text", content: truncated.text, truncated: truncated.truncated, lineCount: rawText.split(/\r?\n/).length };
  }
  return { ...base, kind: "binary" };
}

function revokeAttachmentResources(list) {
  list.forEach((item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  });
}

function buildAttachmentPayload() {
  return selectedAttachments.map((item) => {
    if (item.kind === "text") return { name: item.name, kind: item.kind, mime_type: item.mimeType, size: item.size, line_count: item.lineCount, truncated: item.truncated, content: item.content };
    if (item.kind === "image") return { name: item.name, kind: item.kind, mime_type: item.mimeType, size: item.size, width: item.width, height: item.height, data_url: item.dataUrl };
    return { name: item.name, kind: item.kind, mime_type: item.mimeType, size: item.size };
  });
}

function autofillPromptFromAttachments() {
  const prompt = promptInput.value.trim();
  if (prompt) {
    return;
  }

  const hasImage = selectedAttachments.some((item) => item.kind === "image");
  if (!hasImage) {
    return;
  }

  promptInput.value = selectedStudioMode === "ui-builder"
    ? `Recreate this screenshot as clean ${languageSelect.value} code. Match the visible layout closely, keep it responsive, and split files clearly when useful.`
    : `Generate ${languageSelect.value} code from this screenshot. Match the visible layout or logic as closely as possible and keep the result clean and readable.`;
}

function renderAttachmentList() {
  if (!selectedAttachments.length) {
    attachmentList.innerHTML = '<div class="attachment-empty">No reference files added yet.</div>';
    attachmentHelper.textContent = "Attach code files, notes, or screenshots to guide the next generation. You can also paste an image from the clipboard.";
    return;
  }

  attachmentList.innerHTML = selectedAttachments.map((item) => {
    const media = item.kind === "image"
      ? `<img class="attachment-thumb" src="${escapeAttribute(item.previewUrl)}" alt="${escapeAttribute(item.name)}">`
      : `<div class="attachment-icon">${escapeHtml(getExtension(item.name) || item.kind)}</div>`;
    const detail = item.kind === "text"
      ? `${item.lineCount} lines - ${formatBytes(item.size)}${item.truncated ? " - excerpted" : ""}`
      : item.kind === "image"
        ? `${item.width || "?"}x${item.height || "?"} - ${formatBytes(item.size)}`
        : `${item.kind.toUpperCase()} - ${formatBytes(item.size)}`;
    return `<article class="attachment-item">${media}<div class="attachment-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(detail)}</span></div><button class="attachment-remove" type="button" data-attachment-id="${escapeAttribute(item.id)}">Remove</button></article>`;
  }).join("");
  attachmentHelper.textContent = `${selectedAttachments.length} attachment${selectedAttachments.length === 1 ? "" : "s"} ready.`;
}

async function handleAttachmentSelection(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  const available = MAX_ATTACHMENTS - selectedAttachments.length;
  if (available <= 0) {
    showToast(`You can attach up to ${MAX_ATTACHMENTS} items.`);
    return;
  }
  const newItems = await Promise.all(files.slice(0, available).map((file) => createAttachmentRecord(file)));
  selectedAttachments = [...selectedAttachments, ...newItems];
  attachmentInput.value = "";
  autofillPromptFromAttachments();
  renderAttachmentList();
  syncComposerState();
}

async function handleClipboardPaste(event) {
  const clipboardItems = Array.from(event.clipboardData?.items || []);
  if (!clipboardItems.length) {
    return;
  }

  const pastedFiles = clipboardItems
    .filter((item) => item.kind === "file")
    .map((item, index) => {
      const file = item.getAsFile();
      if (!file) {
        return null;
      }

      const extension = file.type.startsWith("image/") ? file.type.split("/")[1] || "png" : getExtension(file.name) || "bin";
      const filename = file.name || `pasted-${Date.now()}-${index + 1}.${extension}`;
      return new File([file], filename, { type: file.type || "application/octet-stream" });
    })
    .filter(Boolean);

  if (!pastedFiles.length) {
    return;
  }

  const activeElement = document.activeElement;
  const isTypingInEditableField = activeElement === editorArea || activeElement === promptInput;
  if (isTypingInEditableField && pastedFiles.every((file) => !file.type.startsWith("image/"))) {
    return;
  }

  event.preventDefault();
  await handleAttachmentSelection(pastedFiles);
  showToast(pastedFiles.length === 1 ? "Pasted image added as attachment." : "Pasted files added as attachments.");
}

function getCurrentVariant() {
  return generationResult.variants[selectedVariantIndex] || generationResult.variants[0];
}

function getCurrentFiles() {
  const files = getCurrentVariant()?.files || [];
  return files.map((file) => ({
    ...file,
    content: sanitizeGeneratedFileContent(file.content || "", file.path || "")
  }));
}

function getCurrentFile() {
  const files = getCurrentFiles();
  if (selectedFilePath) {
    return files.find((file) => file.path === selectedFilePath) || null;
  }

  return files.find((file) => file.role === "main" && isLikelyCodeFile(file.path))
    || files.find((file) => isLikelyCodeFile(file.path))
    || files.find((file) => file.role === "main")
    || files[0]
    || null;
}

function updateCurrentFileContent(nextContent) {
  const variant = getCurrentVariant();
  if (!variant?.files?.length) {
    return null;
  }

  const targetPath = selectedFilePath || getCurrentFile()?.path;
  const targetFile = variant.files.find((file) => file.path === targetPath) || variant.files[0];
  if (!targetFile) {
    return null;
  }

  targetFile.content = nextContent;
  return targetFile;
}

function ensureSelectedFile() {
  const files = getCurrentFiles();
  if (!files.length) {
    selectedFilePath = "";
    return;
  }
  if (!files.some((file) => file.path === selectedFilePath)) {
    selectedFilePath = files[0].path;
  }
}

function buildRequestSummary() {
  const strictOptions = [
    strictNoLibrariesInput?.checked ? "No external libraries" : "",
    strictRunnableOutputInput?.checked ? "Runnable output required" : "",
    strictSingleFileInput?.checked ? "Single file only" : ""
  ].filter(Boolean);
  return [
    `Prompt: ${promptInput.value.trim() || "Not provided"}`,
    `Task: ${editActionSelect.value}`,
    `Language: ${languageSelect.value}`,
    `Framework: ${frameworkSelect.value}`,
    `Style: ${toneSelect.value}`,
    `Complexity: ${complexityMap[complexityInput.value]}`,
    `Mode: ${selectedMode}`,
    `Studio mode: ${selectedStudioMode}`,
    `Compare: ${compareEnabled ? "On" : "Off"}`,
    `Strict controls: ${strictOptions.length ? strictOptions.join(", ") : "None"}`,
    `Test input: ${testCasesInput.value.trim() || "None"}`,
    `Expected output: ${expectedOutputInput.value.trim() || "None"}`,
    `Workspace: ${workspaceNameInput.value.trim() || "Default"}`,
    `Attachments: ${selectedAttachments.length ? selectedAttachments.map((item) => item.name).join(", ") : "None"}`
  ].join("\n");
}

function inferWarnings(result) {
  const warnings = [];
  const notes = Array.isArray(result?.notes) ? result.notes : [];
  const files = Array.isArray(result?.variants?.[0]?.files) ? result.variants[0].files : [];

  notes.forEach((note) => {
    if (/^Validator:/i.test(note)) {
      warnings.push(note.replace(/^Validator:\s*/i, ""));
    }
  });

  files.forEach((file) => {
    const content = file?.content || "";
    const path = file?.path || "file";
    if (/^\s*import\s+numpy\b/m.test(content) && /\barray|loop|input|beginner|basic\b/i.test(promptInput.value)) {
      warnings.push(`${path} uses numpy for a basic prompt, which may be more complex than needed.`);
    }
    if (/\binput\s*\(/.test(content) && !/\bprint\s*\(|if __name__ == ['"]__main__['"]:/.test(content) && languageSelect.value === "Python") {
      warnings.push(`${path} reads input but may not show a final visible result.`);
    }
    if ((content.match(/\bconsole\.log\b/g) || []).length > 3 || (content.match(/\bprint\s*\(/g) || []).length > 3) {
      warnings.push(`${path} contains many output statements, which may indicate debug-heavy code.`);
    }
  });

  return [...new Set(warnings.filter(Boolean))].slice(0, 6);
}

function renderWarnings() {
  const warnings = Array.isArray(generationResult?.warnings) ? generationResult.warnings : inferWarnings(generationResult);
  if (!warningStrip || !warningList) {
    return;
  }
  if (!warnings.length) {
    warningStrip.hidden = true;
    warningList.innerHTML = "";
    return;
  }
  warningStrip.hidden = false;
  warningList.innerHTML = warnings.map((warning) => `<article class="warning-item">${escapeHtml(warning)}</article>`).join("");
}

function buildStructureSummary() {
  const files = getCurrentFiles();
  if (!files.length) return "Generated file structure will appear here.";
  return files.map((file, index) => `${index + 1}. ${file.path} (${file.content.split("\n").length} lines)`).join("\n");
}

function buildFilesView() {
  const files = getCurrentFiles();
  if (!files.length) return "Generated files will appear here.";
  return files.map((file) => `// FILE: ${file.path}\n${file.content}`).join("\n\n");
}

function buildPromptRecipeGuide() {
  const task = editActionSelect.value;
  const language = languageSelect.value;
  const prompt = promptInput.value.trim();
  const mentionsInput = /input|given|list|array|number|string|data|name/i.test(prompt);
  const mentionsOutput = /print|show|display|return|output|result/i.test(prompt);

  return {
    title: `${task[0].toUpperCase()}${task.slice(1)} + ${language} + ${selectedMode === "leetcode" ? "LeetCode format" : "result"}`,
    hint: mentionsInput && mentionsOutput
      ? "Nice. Your prompt already says what goes in and what should come out."
      : selectedMode === "leetcode"
        ? "For LeetCode mode, mention the problem goal, the input shape, and the expected return value."
        : "Best prompt formula: what it starts with, what should happen, and what result you want."
  };
}

function buildLearningFocusSummary() {
  const level = complexityMap[complexityInput.value];
  const task = editActionSelect.value;
  const language = languageSelect.value;
  const focus = selectedStudioMode === "submission"
    ? `Produce clean ${language} code that can be submitted without extra wrapper text`
    : selectedStudioMode === "interview"
      ? "Practice explaining the approach, tradeoffs, and complexity clearly"
      : selectedStudioMode === "ui-builder"
        ? "Recreate visible layout and interaction details from screenshots"
      : task === "explain"
    ? "Understand the idea before the syntax"
    : task === "fix"
      ? "Spot the problem and correct it"
      : task === "refactor"
        ? "See a cleaner way to write the same idea"
        : selectedMode === "leetcode"
          ? `Write the exact ${language} answer shape LeetCode expects`
        : `Build one ${language} concept at a time`;
  const hint = level === "Starter"
    ? "Starter mode is best for beginners learning one concept per run."
    : level === "Balanced"
      ? "Balanced mode keeps solutions practical without overwhelming detail."
      : "Advanced mode can be powerful, but students learn faster by changing one small part at a time.";

  return { focus, hint };
}

function renderLearningCoach() {
  const recipe = buildPromptRecipeGuide();
  const focus = buildLearningFocusSummary();
  promptRecipe.textContent = recipe.title;
  promptRecipeHint.textContent = recipe.hint;
  learningFocus.textContent = focus.focus;
  learningFocusHint.textContent = focus.hint;
}

function autofillLeetCodePrompt() {
  if (selectedMode !== "leetcode") {
    return;
  }

  const problemId = leetcodeProblemIdInput.value.trim();
  const questionName = leetcodeQuestionNameInput.value.trim();
  if (!problemId && !questionName) {
    return;
  }

  const problemLabel = problemId && questionName
    ? `LeetCode problem ${problemId} - ${questionName}`
    : problemId
      ? `LeetCode problem ${problemId}`
      : `LeetCode question ${questionName}`;
  const nextPrompt = `${problemLabel}. Return the exact ${languageSelect.value} submission code only, in the format LeetCode expects.`;
  const currentPrompt = promptInput.value.trim();
  const shouldReplace = !currentPrompt || currentPrompt === lastAutoLeetCodePrompt;
  if (shouldReplace) {
    promptInput.value = nextPrompt;
    lastAutoLeetCodePrompt = nextPrompt;
  }
}

function buildMentorSummary() {
  const file = getCurrentFile();
  const code = file?.content || "";
  const hasLoop = /\b(for|while)\b/.test(code);
  const hasCondition = /\b(if|elif|else|switch|case)\b/.test(code);
  const hasFunction = /\b(function|def|class)\b/.test(code);

  let concept = "Variables and output";
  let conceptHint = "Look for what is stored first, then look for what gets shown at the end.";
  if (hasLoop) {
    concept = "Repetition with loops";
    conceptHint = "Ask what line repeats, and what changes each time the loop runs.";
  } else if (hasCondition) {
    concept = "Decision making";
    conceptHint = "Ask what must be true for each branch of the program to run.";
  } else if (hasFunction) {
    concept = "Breaking a problem into steps";
    conceptHint = "Functions make one large task easier by splitting it into small named parts.";
  }

  const difficulty = selectedStudioMode === "interview"
    ? "Interview focus"
    : selectedStudioMode === "submission"
      ? "Submission strict"
      : complexityMap[complexityInput.value] === "Advanced"
        ? "Stretch level"
        : complexityMap[complexityInput.value] === "Balanced"
          ? "Student friendly"
          : "First-step friendly";
  const difficultyHint = difficulty === "Interview focus"
    ? "Focus on tradeoffs, correctness, and explaining why this approach works."
    : difficulty === "Submission strict"
      ? "The goal is to remove extra wrapper code and keep the answer platform-ready."
      : difficulty === "Stretch level"
        ? "Read this in small pieces. You do not need to understand everything at once."
        : difficulty === "Student friendly"
          ? "This level is a good middle ground between simple code and realistic code."
          : "This level keeps the idea small, which is ideal for first-time learners.";

  const nextStep = file ? `Change one ${hasLoop ? "loop value" : hasCondition ? "condition" : "input value"}` : "Generate one small program";
  const nextStepHint = file
    ? "Make one tiny edit and compare the new output with the previous one."
    : "Then open Student explain mode and follow the code in order from top to bottom.";

  return { concept, conceptHint, difficulty, difficultyHint, nextStep, nextStepHint };
}

function renderMentorSummary() {
  const summary = buildMentorSummary();
  mentorConcept.textContent = summary.concept;
  mentorConceptHint.textContent = summary.conceptHint;
  mentorDifficulty.textContent = summary.difficulty;
  mentorDifficultyHint.textContent = summary.difficultyHint;
  mentorNextStep.textContent = summary.nextStep;
  mentorNextStepHint.textContent = summary.nextStepHint;
}

function renderLearningRoadmap() {
  const language = languageSelect.value;
  const steps = selectedStudioMode === "interview"
    ? [
      {
        title: "State the brute-force idea first",
        detail: `Say the simple ${language} approach before optimizing so the reasoning feels clear.`
      },
      {
        title: "Then explain the improvement",
        detail: "Point to the line or data structure that reduces repeated work."
      },
      {
        title: "Finish with complexity",
        detail: "Say the time and space cost in plain words before using notation."
      }
    ]
    : selectedStudioMode === "submission"
      ? [
        {
          title: "Keep only the required answer shape",
          detail: "Remove sample runs, print statements, and extra wrapper text."
        },
        {
          title: "Check one small test case",
          detail: "Use a tiny case first so it is easy to confirm the result."
        },
        {
          title: "Watch the diagnostics tab",
          detail: "It now warns about language drift, driver code, and likely submission mistakes."
        }
      ]
      : [
    {
      title: "Start with one tiny goal",
      detail: `Ask for one simple ${language} task, like printing, calculating, or checking one result.`
    },
    {
      title: "Read the explanation before the syntax",
      detail: "Use Student mode first so you understand the purpose of the program before reading code details."
    },
    {
      title: "Experiment with one small change",
      detail: "Change one variable, one loop, or one condition to see how the output changes."
    }
    ];

  learningRoadmap.innerHTML = steps.map((item, index) => `
    <article class="roadmap-item">
      <span>${index + 1}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.detail)}</p>
      </div>
    </article>
  `).join("");
}

function collectPreviewMatches(content, pattern, formatter, limit = 5) {
  return [...content.matchAll(pattern)].slice(0, limit).map((match) => formatter(match)).filter(Boolean);
}

function formatLinePreview(content, lineNumber) {
  const lines = content.split("\n");
  const line = lines[lineNumber - 1] || "";
  return `${lineNumber}. ${line.trim().slice(0, 110) || "(blank line)"}`;
}

function buildPythonFlowSummary(content) {
  const steps = [];
  const importCount = [...content.matchAll(/^\s*(?:import .+|from .+ import .+)/gm)].length;
  const inputCount = [...content.matchAll(/\binput\s*\(/g)].length;
  const printCount = [...content.matchAll(/\bprint\s*\(/g)].length;
  const loopCount = [...content.matchAll(/\b(for|while)\b/g)].length;
  const tryCount = [...content.matchAll(/\btry\s*:/g)].length;

  if (importCount) {
    steps.push(`It starts by importing ${importCount} dependency${importCount === 1 ? "" : "ies"} the code needs.`);
  }
  if (inputCount) {
    steps.push(`It reads ${inputCount} input value${inputCount === 1 ? "" : "s"} from the user or runtime.`);
  }
  if (loopCount) {
    steps.push(`It uses ${loopCount} loop${loopCount === 1 ? "" : "s"} to repeat work over values or conditions.`);
  }
  if (tryCount) {
    steps.push("It includes error-handling blocks to prevent the script from stopping unexpectedly.");
  }
  if (printCount) {
    steps.push(`It prints ${printCount} result${printCount === 1 ? "" : "s"} or status message${printCount === 1 ? "" : "s"} to the console.`);
  }

  return steps.length ? steps.join(" ") : "This Python file appears to run top to bottom like a script and perform work step by step.";
}

function buildStudentGlossary(fileType, counts) {
  const glossary = [];
  if (counts.imports) glossary.push("Import: bringing in ready-made code so we do not have to build everything ourselves.");
  if (counts.functions) glossary.push("Function: a small named block of work. It helps split one big problem into smaller steps.");
  if (counts.conditions) glossary.push("Condition: a decision point where the program chooses one path or another.");
  if (counts.loops) glossary.push("Loop: repeating the same action for each item or until something changes.");
  if (fileType === "py") glossary.push("print: shows a result or message on the screen.");
  if (fileType === "html") glossary.push("HTML tag: a building block used to create parts of a webpage.");
  if (fileType === "css") glossary.push("Selector: the name of the page element that a style rule changes.");
  if (["js", "jsx", "ts", "tsx"].includes(fileType)) glossary.push("Event: something the user does, like clicking a button or typing.");
  return glossary.slice(0, 4);
}

function buildStudentSteps(fileType, content, functionNames) {
  const steps = [];
  const hasImports = /^\s*(?:import .+|from .+ import .+|const .+ = require\(.+\))/m.test(content);
  const hasVariables = /\b(const|let|var)\s+[A-Za-z_]\w+\s*=|^\s*[A-Za-z_]\w*\s*=/m.test(content);
  const hasLoop = /\b(for|while)\b/.test(content);
  const hasCondition = /\b(if|elif|else|switch|case)\b/.test(content);
  const hasOutput = /\b(print|return|console\.log)\b/.test(content);

  if (hasImports) steps.push("First, the program loads any outside tools or libraries it needs.");
  if (hasVariables) steps.push("Next, it stores some values in memory so it can use them later.");
  if (functionNames.length) steps.push(`Then, it defines helper steps such as ${functionNames.slice(0, 3).join(", ")} so the code stays organized.`);
  if (hasLoop) steps.push("After that, it repeats an action using a loop.");
  if (hasCondition) steps.push("It also makes decisions based on conditions, which means different inputs can produce different results.");
  if (hasOutput) steps.push("At the end, it shows or returns the result.");

  if (!steps.length) {
    if (fileType === "html") return ["This file mainly creates the structure of a webpage from top to bottom."];
    if (fileType === "css") return ["This file mainly changes how the page looks, such as colors, spacing, and layout."];
    return ["This file runs step by step from top to bottom to do one small job."];
  }

  return steps;
}

function describeFunctionRole(name, snippet) {
  const loweredName = (name || "").toLowerCase();
  const loweredSnippet = (snippet || "").toLowerCase();

  if (/render|view|component|display|show/.test(loweredName)) {
    return "renders or displays part of the UI";
  }
  if (/fetch|load|get|read/.test(loweredName)) {
    return "retrieves data or reads existing values";
  }
  if (/save|store|persist|write|update/.test(loweredName)) {
    return "saves or updates data";
  }
  if (/handle|click|submit|change|toggle/.test(loweredName) || /addeventlistener/.test(loweredSnippet)) {
    return "responds to user interaction or UI events";
  }
  if (/validate|check|assert|guard/.test(loweredName)) {
    return "validates input or protects against invalid state";
  }
  if (/build|create|make|compose|generate/.test(loweredName)) {
    return "builds or generates a value or output";
  }
  if (/format|parse|map|convert|normalize/.test(loweredName)) {
    return "transforms data into another shape";
  }
  if (/init|setup|boot|start/.test(loweredName)) {
    return "initializes setup needed before the main flow runs";
  }
  if (/send|post|request|api/.test(loweredName) || /fetch\(|axios|response|request/.test(loweredSnippet)) {
    return "communicates with an API or request/response flow";
  }
  if (/return\s*</.test(loweredSnippet)) {
    return "returns UI markup for rendering";
  }

  return "contains part of the main logic for this file";
}

function splitCodeIntoLogicalLines(content) {
  return String(content || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line, index) => ({ number: index + 1, text: line, trimmed: line.trim(), indent: line.match(/^\s*/)?.[0]?.length || 0 }))
    .filter((line) => line.trimmed);
}

function explainCodeLine(line, fileType, context = {}) {
  const text = line.trimmed;
  const previousLine = context.previousLine?.trimmed || "";
  const loopDepth = context.loopDepth || 0;

  if (/^#/.test(text)) {
    return { what: "This is a comment.", why: "It helps the reader understand the code without affecting execution." };
  }
  if (/^\/\//.test(text)) {
    return { what: "This is a comment.", why: "It explains intent for humans and is ignored by the program." };
  }
  if (/^(import |from .+ import )/.test(text)) {
    const importedName = text.replace(/^(import|from)\s+/, "").split(/\s+/)[0];
    return { what: `This line imports ${importedName || "code"} from another module.`, why: "The program needs extra tools or features before the main logic can run." };
  }
  if (/^(const|let|var)\s+/.test(text)) {
    const name = text.match(/^(?:const|let|var)\s+([A-Za-z_]\w*)/)?.[1];
    return { what: `This line creates the variable ${name || "value"} and stores something in it.`, why: "The program saves the value so it can reuse it later instead of repeating the same work." };
  }
  if (/^[A-Za-z_]\w*\s*=/.test(text) && fileType === "py") {
    const name = text.match(/^([A-Za-z_]\w*)\s*=/)?.[1];
    if (/\bint\s*\(\s*input\s*\(/.test(text)) {
      return { what: `This line reads input, converts it to a number, and stores it in ${name || "a variable"}.`, why: "User input starts as text, so the program converts it into an integer before using it for sizes or calculations." };
    }
    if (/\[\s*\]|\[\[/.test(text)) {
      return { what: `This line creates ${name || "a collection"} as an empty or nested list.`, why: "The program needs a container ready before it starts adding values into it." };
    }
    if (/=\s*[A-Za-z_]\w+\s*\(/.test(text)) {
      const functionName = text.match(/=\s*([A-Za-z_]\w*)\s*\(/)?.[1];
      return { what: `This line calls ${functionName || "a function"} and stores the returned result in ${name || "a variable"}.`, why: "The program is now running earlier helper logic and saving the final result so it can use or display it." };
    }
    return { what: `This line stores a value in ${name || "a variable"}.`, why: "The program needs to remember this value for later steps." };
  }
  if (/^def\s+/.test(text)) {
    const name = text.match(/^def\s+([A-Za-z_]\w*)/)?.[1];
    return { what: `This line starts the function ${name || "function"}.`, why: "The code groups related steps into one named block so it can call them when needed instead of mixing everything together at the top level." };
  }
  if (/^(async\s+)?function\s+/.test(text) || /^(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/.test(text)) {
    return { what: "This line defines a function.", why: "The program separates work into reusable logic instead of keeping everything in one long block." };
  }
  if (/^class\s+/.test(text)) {
    return { what: "This line starts a class definition.", why: "A class groups related data and behavior into one reusable structure." };
  }
  if (/^for\s+/.test(text) || /^for\s*\(/.test(text)) {
    if (loopDepth >= 2) {
      return { what: "This line starts another nested loop inside an existing loop.", why: "The program is walking through multiple dimensions or layers of data one level at a time." };
    }
    return { what: "This line starts a loop.", why: "The same action needs to run repeatedly for multiple values." };
  }
  if (/^while\s+/.test(text) || /^while\s*\(/.test(text)) {
    return { what: "This line starts a loop that continues while a condition is true.", why: "The program needs repetition, but it should stop once the condition changes." };
  }
  if (/^(if|elif|else)\b/.test(text) || /^(if|else if|else|switch|case)\b/.test(text)) {
    return { what: "This line controls a decision in the program.", why: "Different inputs or states need different behavior." };
  }
  if (/\binput\s*\(/.test(text)) {
    return { what: "This line reads input from the user.", why: loopDepth ? "The program is collecting one value during repeated processing, often for one position in an array or list." : "The program needs data from outside before it can continue." };
  }
  if (/\bprint\s*\(/.test(text) || /\bconsole\.log\s*\(/.test(text)) {
    return { what: "This line outputs a value or message.", why: "The user needs to see the result, or the programmer wants visible feedback." };
  }
  if (/^return\b/.test(text)) {
    return { what: "This line returns a value from the current function.", why: previousLine ? "After finishing the work above, the function sends the completed result back to the place that called it." : "The function has finished its work and needs to hand the result back." };
  }
  if (/\bappend\s*\(/.test(text) || /\.push\s*\(/.test(text)) {
    return { what: "This line adds a new value to a collection.", why: loopDepth ? "The program is filling the structure piece by piece while the loop moves through each position." : "The program is building up a list of results step by step." };
  }
  if (/\[\s*\[/.test(text) || /\[[^\]]*\]/.test(text) && /\bfor\b/.test(text) && fileType === "py") {
    return { what: "This line creates a list or nested list structure.", why: "The code needs a place to store multiple related values together." };
  }
  if (/np\.zeros\s*\(/.test(text)) {
    return { what: "This line creates an array already filled with zero values.", why: "The program wants a ready-made 3D structure before replacing or using those starting values." };
  }
  if (/\bint\s*\(\s*input\s*\(/.test(text)) {
    return { what: "This line reads input and converts it to an integer.", why: "User input arrives as text, so the program converts it into a number before using it for sizes, indexes, or math." };
  }
  if (/^<.+>$/.test(text) && fileType === "html") {
    return { what: "This line adds part of the page structure.", why: "HTML defines what appears on the screen and how sections are arranged." };
  }
  if (/{$/.test(text) && fileType === "css") {
    return { what: "This line starts a CSS rule.", why: "The code is about to describe how a matching element should look." };
  }

  return { what: "This line is part of the program logic.", why: "It helps the program move from setup to result, even if its role depends on nearby lines." };
}

function buildLineByLineExplanation(file) {
  const fileType = file.path.split(".").pop()?.toLowerCase() || "file";
  const logicalLines = splitCodeIntoLogicalLines(file.content || "");
  if (!logicalLines.length) {
    return ["Code explanation will appear here."];
  }

  const sections = [
    `File: ${file.path}`,
    "",
    "Line-by-line explanation:"
  ];

  logicalLines.slice(0, 80).forEach((line, index) => {
    const previousLine = logicalLines[index - 1] || null;
    const loopDepth = logicalLines
      .slice(0, index)
      .filter((item) => item.indent < line.indent && /^(for|while)\b/.test(item.trimmed))
      .length;
    const explanation = explainCodeLine(line, fileType, { previousLine, loopDepth });
    sections.push(`${line.number}. ${line.trimmed}`);
    sections.push(`What it does: ${explanation.what}`);
    sections.push(`Why it is used: ${explanation.why}`);
    sections.push("");
  });

  if (logicalLines.length > 80) {
    sections.push(`Only the first 80 meaningful lines are shown here to keep the explanation readable.`);
  }

  return sections;
}

function buildExplainView() {
  const file = getCurrentFile();
  if (!file) {
    return "Code explanation will appear here.";
  }
  return buildLineByLineExplanation(file).join("\n");
}

function buildDiagnosticsView() {
  const files = getCurrentFiles();
  if (!files.length) {
    return "Diagnostics will appear here.";
  }

  function detectLanguageMismatch(selectedLanguage, content, path) {
    const fileExtension = getExtension(path);
    const patterns = {
      Python: /\bconsole\.log\b|\bfunction\s+\w+\s*\(|\blet\s+\w+|\bconst\s+\w+|\bfor\s*\(.*;.*;.*\)|#include\s*<|^\s*public\s+class\b/m,
      JavaScript: /^\s*def\s+\w+|\bprint\s*\(|#include\s*<|^\s*public\s+class\b/m,
      TypeScript: /^\s*def\s+\w+|\bprint\s*\(|#include\s*<|^\s*public\s+class\b/m,
      "Node.js": /^\s*def\s+\w+|\bprint\s*\(|#include\s*<|^\s*public\s+class\b/m,
      React: /^\s*def\s+\w+|\bprint\s*\(|#include\s*<|^\s*public\s+class\b/m,
      C: /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|^\s*import\s+\w+|^\s*public\s+class\b|\bfn\s+main\s*\(/m,
      "C++": /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|^\s*import\s+\w+|^\s*public\s+class\b/m,
      "C#": /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|#include\s*</m,
      Go: /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|^\s*public\s+class\b/m,
      Rust: /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|^\s*import\s+\w+|#include\s*</m,
      Java: /\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+|#include\s*</m,
      Kotlin: /\bprint\s*\(|^\s*def\s+\w+|#include\s*</m,
      Swift: /\bconsole\.log\b|^\s*def\s+\w+|#include\s*</m,
      PHP: /^\s*def\s+\w+|#include\s*<|^\s*public\s+class\b/m,
      Ruby: /\bconsole\.log\b|#include\s*<|^\s*public\s+class\b/m,
      Dart: /\bprint\s*\(|#include\s*<|^\s*def\s+\w+/m,
      "HTML/CSS": /^\s*def\s+\w+|\bconsole\.log\b|#include\s*</m
    };

    const extensionMap = {
      Python: ["py"],
      JavaScript: ["js"],
      TypeScript: ["ts", "tsx"],
      "Node.js": ["js"],
      React: ["jsx", "tsx"],
      C: ["c", "h"],
      "C++": ["cpp", "cc", "cxx", "h", "hpp"],
      "C#": ["cs"],
      Go: ["go"],
      Rust: ["rs"],
      Java: ["java"],
      Kotlin: ["kt", "kts"],
      Swift: ["swift"],
      PHP: ["php"],
      Ruby: ["rb"],
      Dart: ["dart"],
      "HTML/CSS": ["html", "css"]
    };

    if (patterns[selectedLanguage]?.test(content)) {
      return `${path}: selected language is ${selectedLanguage}, but other-language syntax was detected`;
    }

    const allowedExtensions = extensionMap[selectedLanguage];
    if (allowedExtensions && fileExtension && !allowedExtensions.includes(fileExtension)) {
      return `${path}: file extension .${fileExtension} does not match selected language ${selectedLanguage}`;
    }

    return "";
  }

  const strengths = [];
  const risks = [];
  const selectedLanguage = languageSelect.value;
  const runtime = runtimeAvailability[selectedLanguage];
  strengths.push(`Studio mode: ${selectedStudioMode}`);
  if (runtime) {
    strengths.push(`Runtime: ${runtime.available ? "available in app" : "not detected on this machine"}`);
  } else {
    strengths.push("Runtime: no direct in-app execution profile for this language yet");
  }
  files.forEach((file) => {
    const content = file.content || "";
    const lineCount = content.split("\n").length;
    if (lineCount > 5 && lineCount < 180) {
      strengths.push(`${file.path}: reasonable size for review (${lineCount} lines)`);
    }
    if (lineCount > 220) {
      risks.push(`${file.path}: large file (${lineCount} lines)`);
    }
    if (/TODO|FIXME/.test(content)) {
      risks.push(`${file.path}: contains TODO/FIXME markers`);
    }
    if ((content.match(/\bconsole\.log\b/g) || []).length > 2) {
      risks.push(`${file.path}: multiple console.log statements detected`);
    }
    if ((content.match(/\bprint\s*\(/g) || []).length > 2) {
      risks.push(`${file.path}: multiple print statements detected`);
    }
    if (/password|secret|token/i.test(content) && /['"`][^'"`\n]{4,}['"`]/.test(content)) {
      risks.push(`${file.path}: possible hard-coded secret-like value`);
    }
    if (!/\n/.test(content) || content.trim().length < 20) {
      risks.push(`${file.path}: very small file`);
    }
    if (selectedMode === "leetcode" && /print\s*\(|console\.log|System\.out\.print/.test(content)) {
      risks.push(`${file.path}: LeetCode mode usually should not include extra output statements`);
    }
    const mismatch = detectLanguageMismatch(selectedLanguage, content, file.path);
    if (mismatch) {
      risks.push(mismatch);
    }
    if (selectedLanguage === "Python" && /^\s*def\s+\w+\([^)]*\)\s+[A-Za-z_][\w\[\], ]*:/m.test(content)) {
      risks.push(`${file.path}: Python function return type looks invalid; expected '-> return_type:'`);
    }
    if (selectedLanguage === "Python" && /[{};]/.test(content) && /\bprint\s*\(|^\s*def\s+\w+/m.test(content)) {
      risks.push(`${file.path}: Python code appears to include brace/semicolon syntax that may come from another language`);
    }
    if (selectedLanguage === "Python" && /^\s*class\s+Solution:\s*$/.test(content) && !/^\s+def\s+\w+/m.test(content)) {
      risks.push(`${file.path}: Python Solution class was detected without a valid method definition`);
    }
    if (selectedStudioMode === "submission" && /Example usage|main\(|if __name__ == ['"]__main__['"]/.test(content)) {
      risks.push(`${file.path}: submission mode should usually avoid extra driver code`);
    }
    if (selectedLanguage === "Python" && /\binput\s*\(/.test(content) && !/\bprint\s*\(|if __name__ == ['"]__main__['"]/.test(content)) {
      risks.push(`${file.path}: reads input but may never show the final result`);
    }
    if (selectedStudioMode === "learning" && /^\s*import\s+numpy\b/m.test(content) && /\barray|loop|input|list|basic\b/i.test(promptInput.value)) {
      risks.push(`${file.path}: learning mode usually should avoid numpy for a basic prompt like this`);
    }
    if (/^\s*def\s+\w+\(/m.test(content) && !/^\s*\w+\s*=\s*\w+\(|^\s*\w+\s*\(|if __name__ == ['"]__main__['"]:/m.test(content) && selectedMode === "code") {
      risks.push(`${file.path}: defines a function but may never call it`);
    }
  });

  const uniqueStrengths = [...new Set(strengths)];
  const uniqueRisks = [...new Set(risks)];
  const nextStep = uniqueRisks[0]
    ? uniqueRisks[0].includes("never call it")
      ? "Next best action: ask the generator to make the program runnable and include the final function call/output."
      : uniqueRisks[0].includes("numpy")
        ? "Next best action: enable 'No External Libraries' or ask for nested lists only."
        : uniqueRisks[0].includes("input but may never show")
          ? "Next best action: ask for a final print/output after the input handling."
          : "Next best action: repair the code or tighten the prompt before using this result."
    : "Next best action: run a tiny test case and compare the output with what you expected.";

  return [
    "Diagnostic summary:",
    "",
    "What looks good:",
    uniqueStrengths.length ? uniqueStrengths.map((item) => `- ${item}`).join("\n") : "- No strong signals yet.",
    "",
    "Problems to fix:",
    uniqueRisks.length ? uniqueRisks.map((item) => `- ${item}`).join("\n") : "- No obvious local problems found.",
    "",
    nextStep,
    "",
    "This is a lightweight static review, not a compiler or full runtime analysis."
  ].join("\n");
}

function buildDiffState() {
  if (!generationResult.variants || generationResult.variants.length < 2) {
    return {
      summary: "Compare mode differences will appear here.",
      left: "Variant A will appear here.",
      right: "Variant B will appear here."
    };
  }

  const leftLabel = generationResult.variants[0].label || "Variant A";
  const rightLabel = generationResult.variants[1].label || "Variant B";
  const left = generationResult.variants[0].files[0]?.content || "";
  const right = generationResult.variants[1].files[0]?.content || "";
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const total = Math.max(leftLines.length, rightLines.length);
  let changedLines = 0;
  const leftRows = [];
  const rightRows = [];

  for (let index = 0; index < total; index += 1) {
    const leftLine = leftLines[index] || "";
    const rightLine = rightLines[index] || "";
    const changed = leftLine !== rightLine;
    if (changed) {
      changedLines += 1;
    }
    leftRows.push(`<span${changed ? ' class="diff-removed"' : ""}>${escapeHtml(leftLine || " ")}</span>`);
    rightRows.push(`<span${changed ? ' class="diff-added"' : ""}>${escapeHtml(rightLine || " ")}</span>`);
  }

  return {
    summary: `${leftLabel} vs ${rightLabel}: ${changedLines} changed line${changedLines === 1 ? "" : "s"} across the primary file.`,
    left: leftRows.join("\n"),
    right: rightRows.join("\n")
  };
}

function buildPreviewDoc(files) {
  const htmlFile = files.find((file) => file.path.toLowerCase().endsWith(".html"));
  if (!htmlFile) return "";
  const css = files.filter((file) => /\.s?css$/i.test(file.path)).map((file) => file.content).join("\n\n");
  const js = files.filter((file) => /\.(js|ts)$/i.test(file.path)).map((file) => file.content).join("\n\n");
  return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${htmlFile.content}${js ? `<script>${js}<\/script>` : ""}</body></html>`;
}

function buildRunView() {
  if (!lastRunResult) {
    return "Run results will appear here.\n\nUse Run Code to execute supported languages inside the app when a local runtime is available.";
  }

  const lines = [
    `Status: ${lastRunResult.ok ? "Success" : "Failed"}`,
    `Phase: ${lastRunResult.phase || "run"}`,
    `Command: ${lastRunResult.command || "n/a"}`,
    "",
    "Standard input:",
    testCasesInput.value.trim() || "(empty)",
    "",
    "Standard output:",
    lastRunResult.stdout?.trim() || "(empty)",
    "",
    "Standard error:",
    lastRunResult.stderr?.trim() || "(empty)",
  ];

  if (typeof lastRunResult.exit_code === "number") {
    lines.splice(3, 0, `Exit code: ${lastRunResult.exit_code}`);
  }

  if (lastRunResult.error) {
    lines.unshift(`Runtime message: ${lastRunResult.error}`, "");
  }

  return lines.join("\n");
}

function buildTestsView() {
  const expectedOutput = expectedOutputInput.value.trim();
  if (!lastRunResult) {
    return [
      "Test guidance will appear here.",
      "",
      "Add sample input and optional expected output, then run the code.",
      "For student learning, use tiny cases first so it is easy to see what changed."
    ].join("\n");
  }

  const actualOutput = (lastRunResult.stdout || "").trim();
  const matches = expectedOutput ? actualOutput === expectedOutput : null;
  return [
    `Expected output: ${expectedOutput || "(not provided)"}`,
    `Actual output: ${actualOutput || "(empty)"}`,
    `Result: ${matches === null ? "No expected output provided yet." : matches ? "Pass" : "Needs review"}`,
    "",
    selectedStudioMode === "learning"
      ? "Student tip: if the result is wrong, compare one line of output at a time and trace where that value comes from."
      : "Tip: use one simple happy-path case first, then add an edge case."
  ].join("\n");
}

function buildQuizView() {
  const file = getCurrentFile();
  if (!file) {
    return "Study quiz will appear here.";
  }

  const content = file.content || "";
  const functionNames = [...content.matchAll(/\b(?:function|def|class)\s+([A-Za-z_]\w*)/g)].map((match) => match[1]);
  const hasLoop = /\b(for|while)\b/.test(content);
  const hasCondition = /\b(if|elif|else|switch|case)\b/.test(content);
  const questions = [
    "1. In your own words, what problem is this code trying to solve?",
    hasLoop ? "2. What does the loop repeat, and when does it stop?" : "2. Which line starts the main work of this program?",
    hasCondition ? "3. What decision does the condition make?" : "3. What input or value changes the result the most?",
    functionNames.length ? `4. What job does ${functionNames[0]} do?` : "4. Which part would you rename to make the code easier to read?",
    "5. Change one value and predict what output will change before you run it."
  ];

  if (selectedStudioMode === "interview") {
    questions.push("6. What is the time complexity, and where does that cost come from?");
    questions.push("7. What edge case would you explain to an interviewer first?");
  }

  return ["Quick study quiz:", "", ...questions].join("\n");
}

function getCrcTable() {
  if (crcTable) {
    return crcTable;
  }

  crcTable = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let step = 0; step < 8; step += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    crcTable[index] = crc >>> 0;
  }
  return crcTable;
}

function crc32(bytes) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = table[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint16LE(value) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32LE(value) {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff
  ]);
}

function concatUint8Arrays(parts) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function buildZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const fileNameBytes = encoder.encode(file.path);
    const contentBytes = encoder.encode(file.content);
    const checksum = crc32(contentBytes);
    const localHeader = concatUint8Arrays([
      uint32LE(0x04034b50),
      uint16LE(20),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(checksum),
      uint32LE(contentBytes.length),
      uint32LE(contentBytes.length),
      uint16LE(fileNameBytes.length),
      uint16LE(0),
      fileNameBytes
    ]);
    localParts.push(localHeader, contentBytes);

    const centralHeader = concatUint8Arrays([
      uint32LE(0x02014b50),
      uint16LE(20),
      uint16LE(20),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(checksum),
      uint32LE(contentBytes.length),
      uint32LE(contentBytes.length),
      uint16LE(fileNameBytes.length),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint16LE(0),
      uint32LE(0),
      uint32LE(offset),
      fileNameBytes
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + contentBytes.length;
  });

  const centralDirectory = concatUint8Arrays(centralParts);
  const endRecord = concatUint8Arrays([
    uint32LE(0x06054b50),
    uint16LE(0),
    uint16LE(0),
    uint16LE(files.length),
    uint16LE(files.length),
    uint32LE(centralDirectory.length),
    uint32LE(offset),
    uint16LE(0)
  ]);

  return new Blob([concatUint8Arrays([...localParts, centralDirectory, endRecord])], { type: "application/zip" });
}

function renderVariantTabs() {
  if (generationResult.variants.length <= 1) {
    variantTabs.innerHTML = "";
    return;
  }
  variantTabs.innerHTML = generationResult.variants.map((variant, index) => `<button class="output-tab ${index === selectedVariantIndex ? "active" : ""}" type="button" data-variant-index="${index}">${escapeHtml(variant.label)}</button>`).join("");
}

function renderFileTabs() {
  const files = getCurrentFiles();
  if (files.length <= 1) {
    fileTabs.innerHTML = "";
    return;
  }

  fileTabs.innerHTML = files.map((file) => `<button class="output-tab ${file.path === selectedFilePath ? "active" : ""}" type="button" data-file-path="${escapeAttribute(file.path)}">${escapeHtml(file.path)}</button>`).join("");
}

function renderOutput() {
  ensureSelectedFile();
  const currentFile = getCurrentFile();
  const code = currentFile ? currentFile.content : "// No code returned.";
  codeContent.innerHTML = highlightCode(code, currentFile?.path || "");
  editorArea.value = code;
  fileName.textContent = currentFile ? currentFile.path : `snippet.${getLanguageExtension(languageSelect.value)}`;
  if (editorIntent) {
    const intentLabel = String(generationResult.intent || "generate_code").replace(/_/g, " ");
    editorIntent.textContent = `Intent: ${intentLabel.replace(/\b\w/g, (letter) => letter.toUpperCase())}`;
  }
  if (editorStudioMode) {
    const studioLabel = String(generationResult.studioMode || selectedStudioMode || "standard").replace(/-/g, " ");
    editorStudioMode.textContent = `Studio: ${studioLabel.replace(/\b\w/g, (letter) => letter.toUpperCase())}`;
  }
  if (editorStrict) {
    const strictLabels = [];
    if (generationResult.strictOptions?.no_external_libraries) strictLabels.push("No libs");
    if (generationResult.strictOptions?.runnable_output_required) strictLabels.push("Runnable");
    if (generationResult.strictOptions?.single_file_only) strictLabels.push("Single file");
    editorStrict.textContent = `Strict: ${strictLabels.length ? strictLabels.join(", ") : "None"}`;
  }
  requestView.textContent = buildRequestSummary();
  structureView.textContent = buildStructureSummary();
  filesView.textContent = buildFilesView();
  explainView.textContent = buildExplainView();
  diagnosticsView.textContent = buildDiagnosticsView();
  if (runView) {
    runView.textContent = buildRunView();
  }
  testsView.textContent = buildTestsView();
  quizView.textContent = buildQuizView();
  const diffState = buildDiffState();
  diffSummary.textContent = diffState.summary;
  diffLeft.innerHTML = diffState.left;
  diffRight.innerHTML = diffState.right;
  previewFrame.srcdoc = buildPreviewDoc(getCurrentFiles()) || `<html><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#08111f;color:#eff6ff;font:16px/1.5 Space Grotesk,sans-serif;"><div style="max-width:28rem;padding:24px;text-align:center;opacity:0.82;">Preview appears when the result includes HTML and optional CSS or JS files.</div></body></html>`;
  renderVariantTabs();
  renderFileTabs();
  updateFocusFileOptions();
  renderMentorSummary();
  renderWarnings();
}

function renderProjectTree() {
  codeWindow.classList.add("sidebar-hidden");
}

function updateInsights() {
  const items = [
    { label: "Task", detail: `${editActionSelect.value} changes the model goal for this run.` },
    { label: "Framework", detail: `${frameworkSelect.value} nudges the file structure and syntax.` },
    { label: "Studio", detail: `${selectedStudioMode} mode changes how strict, teachable, or submission-ready the result should feel.` },
    { label: "Compare", detail: compareEnabled ? "Two variants will be generated." : "Turn compare on to get two variants." },
    { label: "Run", detail: runtimeAvailability[languageSelect.value]?.available ? `${languageSelect.value} can run directly in the app.` : `${languageSelect.value} runtime is not currently detected here.` },
    { label: "History", detail: historyEntries.length ? `${historyEntries.length} recent runs saved locally.` : "Recent runs will appear after generation." }
  ];
  insightList.innerHTML = items.map((item) => `<article class="insight-item"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.detail)}</strong></article>`).join("");
}

function setOutputTab(tab) {
  activeOutputTab = tab;
  outputTabs.querySelectorAll(".output-tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  document.querySelectorAll(".output-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tab}`));
}

function normalizeResult(data) {
  const fallbackContent = choosePrimaryResponseContent(data);
  const variants = Array.isArray(data.variants) && data.variants.length
    ? data.variants
    : [{ label: "Primary", files: Array.isArray(data.files) && data.files.length ? data.files : [{ path: `snippet.${getLanguageExtension(languageSelect.value)}`, content: fallbackContent, role: "main" }] }];
  const normalizedVariants = variants.map((variant, variantIndex) => {
    const normalizedFiles = (Array.isArray(variant.files) ? variant.files : []).map((file, fileIndex) => {
      const seedContent = file.content || (fileIndex === 0 ? fallbackContent : "");
      const path = inferFallbackFilePath(seedContent, file.path || "", fileIndex);
      const cleanedContent = sanitizeGeneratedFileContent(seedContent, path) || (fileIndex === 0 ? fallbackContent : "");
      return {
        ...file,
        path,
        content: cleanedContent
      };
    }).filter((file) => file.content && file.content.trim());

    return {
      label: variant.label || `Variant ${variantIndex + 1}`,
      files: normalizedFiles.length
        ? normalizedFiles
        : [{ path: `snippet.${getLanguageExtension(languageSelect.value)}`, content: fallbackContent, role: "main" }]
    };
  }).filter((variant) => variant.files.length);

  if (!normalizedVariants.length) {
    return {
      summary: data.summary || "Generated result",
      notes: Array.isArray(data.notes) ? data.notes : [],
      warnings: inferWarnings({ notes: Array.isArray(data.notes) ? data.notes : [], variants: [{ files: [{ path: `snippet.${getLanguageExtension(languageSelect.value)}`, content: fallbackContent, role: "main" }] }] }),
      intent: data.intent || "generate_code",
      studioMode: data.studio_mode || selectedStudioMode,
      strictOptions: data.strict_options || {},
      variants: [{ label: "Primary", files: [{ path: `snippet.${getLanguageExtension(languageSelect.value)}`, content: fallbackContent, role: "main" }] }]
    };
  }

  return {
    summary: data.summary || "Generated result",
    notes: Array.isArray(data.notes) ? data.notes : [],
    warnings: inferWarnings({ notes: Array.isArray(data.notes) ? data.notes : [], variants: normalizedVariants }),
    intent: data.intent || "generate_code",
    studioMode: data.studio_mode || selectedStudioMode,
    strictOptions: data.strict_options || {},
    variants: normalizedVariants
  };
}

function composePrompt() {
  const leetcodeProblemId = leetcodeProblemIdInput.value.trim();
  const leetcodeQuestionName = leetcodeQuestionNameInput.value.trim();
  const testInput = testCasesInput.value.trim();
  const expectedOutput = expectedOutputInput.value.trim();
  return [
    promptInput.value.trim(),
    `Task: ${editActionSelect.value}.`,
    `Mode: ${selectedMode}.`,
    `Studio mode: ${selectedStudioMode}.`,
    selectedMode === "leetcode" ? "Return the exact code format expected by LeetCode for the selected language. Do not add driver code unless the problem explicitly needs it." : "",
    selectedStudioMode === "submission" ? "Return submission-ready code only. Avoid explanatory prose, sample runs, and driver code unless required." : "",
    selectedStudioMode === "interview" ? "Favor a clean interview-ready answer, with sensible naming and an efficient approach." : "",
    selectedStudioMode === "learning" ? "Favor beginner-friendly structure and readable steps over clever shortcuts." : "",
    selectedStudioMode === "ui-builder" ? "If visuals are involved, focus on recreating the visible interface cleanly and responsively." : "",
    selectedMode === "leetcode" && leetcodeProblemId ? `LeetCode problem number: ${leetcodeProblemId}.` : "",
    selectedMode === "leetcode" && leetcodeQuestionName ? `LeetCode question name: ${leetcodeQuestionName}.` : "",
    `Framework: ${frameworkSelect.value}.`,
    focusFileSelect.value ? `Focus file: ${focusFileSelect.value}.` : "",
    `Style: ${toneSelect.value}.`,
    `Complexity: ${complexityMap[complexityInput.value]}.`,
    testInput ? `Sample input or test cases:\n${testInput}` : "",
    expectedOutput ? `Expected output: ${expectedOutput}.` : "",
    compareEnabled ? "Generate two meaningfully different variants." : "",
    strictNoLibrariesInput?.checked ? "Strict control: do not use external libraries or third-party packages." : "",
    strictRunnableOutputInput?.checked ? "Strict control: include runnable output or a visible final result." : "",
    strictSingleFileInput?.checked ? "Strict control: return a single-file solution only." : "",
    workspaceNameInput.value.trim() ? `Workspace: ${workspaceNameInput.value.trim()}.` : "",
    selectedAttachments.length ? "Use uploaded references when relevant." : ""
  ].filter(Boolean).join("\n\n");
}

function saveHistory() {
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyEntries.slice(0, MAX_HISTORY_ITEMS)));
}

function loadHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function loadSavedProjects() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROJECTS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function loadPromptVersions() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROMPT_VERSIONS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveProjects() {
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(savedProjects));
}

function savePromptVersions() {
  window.localStorage.setItem(PROMPT_VERSIONS_STORAGE_KEY, JSON.stringify(promptVersions.slice(0, MAX_HISTORY_ITEMS)));
}

function renderSavedProjects() {
  if (!savedProjects.length) {
    savedProjectsList.innerHTML = '<article class="history-empty">No saved projects yet.</article>';
    return;
  }

  savedProjectsList.innerHTML = savedProjects.map((project) => `
    <button class="history-item" type="button" data-project-id="${escapeAttribute(project.id)}">
      <strong>${escapeHtml(project.name)}</strong>
      <span>${escapeHtml(project.framework)} - ${escapeHtml(project.language)} - ${escapeHtml(project.studioMode || "standard")} - ${escapeHtml(project.savedAt)}</span>
      <span>${escapeHtml((project.prompt || "").slice(0, 80))}</span>
      <span class="history-delete" data-delete-project-id="${escapeAttribute(project.id)}">Delete</span>
    </button>
  `).join("");
}

function renderPromptVersions() {
  if (!promptVersions.length) {
    promptVersionsList.innerHTML = '<article class="history-empty">No prompt versions yet.</article>';
    return;
  }

  promptVersionsList.innerHTML = promptVersions.map((entry) => `
    <button class="history-item" type="button" data-prompt-version-id="${escapeAttribute(entry.id)}">
      <strong>${escapeHtml(entry.label)}</strong>
      <span>${escapeHtml(entry.createdAt)}</span>
      <span>${escapeHtml(entry.prompt.slice(0, 100))}</span>
      <span class="history-delete" data-delete-prompt-version-id="${escapeAttribute(entry.id)}">Delete</span>
    </button>
  `).join("");
}

function renderHistory() {
  if (!historyEntries.length) {
    historyList.innerHTML = '<article class="history-empty">No generations yet.</article>';
    return;
  }
  historyList.innerHTML = historyEntries.map((entry) => `<button class="history-item" type="button" data-history-id="${escapeAttribute(entry.id)}"><strong>${escapeHtml(entry.summary)}</strong><span>${escapeHtml(entry.task)} - ${escapeHtml(entry.framework)} - ${escapeHtml(entry.studioMode || "standard")} - ${escapeHtml(entry.createdAt)}</span><span>${escapeHtml((entry.prompt || "").slice(0, 80))}</span></button>`).join("");
}

function pushHistory(data) {
  historyEntries.unshift({
    id: `${Date.now()}`,
    createdAt: new Date().toLocaleString(),
    prompt: promptInput.value.trim(),
    summary: data.summary || "Generated result",
    task: editActionSelect.value,
    framework: frameworkSelect.value,
    mode: selectedMode,
    studioMode: selectedStudioMode,
    compare: compareEnabled,
    language: languageSelect.value,
    leetcodeProblemId: leetcodeProblemIdInput.value.trim(),
    leetcodeQuestionName: leetcodeQuestionNameInput.value.trim(),
    testCases: testCasesInput.value.trim(),
    expectedOutput: expectedOutputInput.value.trim(),
    workspace: workspaceNameInput.value.trim() || "Default",
    lastRunResult,
    result: generationResult
  });
  historyEntries = historyEntries.slice(0, MAX_HISTORY_ITEMS);
  saveHistory();
  renderHistory();
}

function restoreHistory(historyId) {
  const entry = historyEntries.find((item) => item.id === historyId);
  if (!entry) return;
  promptInput.value = entry.prompt || "";
  editActionSelect.value = entry.task || "generate";
  frameworkSelect.value = entry.framework || "None";
  languageSelect.value = entry.language || "JavaScript";
  leetcodeProblemIdInput.value = entry.leetcodeProblemId || "";
  leetcodeQuestionNameInput.value = entry.leetcodeQuestionName || "";
  testCasesInput.value = entry.testCases || "";
  expectedOutputInput.value = entry.expectedOutput || "";
  workspaceNameInput.value = entry.workspace === "Default" ? "" : (entry.workspace || "");
  setMode(entry.mode || "code");
  setStudioMode(entry.studioMode || "standard");
  setCompareEnabled(Boolean(entry.compare));
  lastRunResult = entry.lastRunResult || null;
  generationResult = entry.result ? normalizeResult(entry.result) : createEmptyResult();
  selectedVariantIndex = 0;
  selectedFilePath = "";
  renderPresetChips();
  syncComposerState();
  renderOutput();
  typeWriter(getCurrentFile()?.content || "// No code returned.", getCurrentFile()?.path || "");
  showToast("History restored.");
}

function applyProject(project) {
  promptInput.value = project.prompt || "";
  editActionSelect.value = project.task || "generate";
  frameworkSelect.value = project.framework || "None";
  languageSelect.value = project.language || "JavaScript";
  leetcodeProblemIdInput.value = project.leetcodeProblemId || "";
  leetcodeQuestionNameInput.value = project.leetcodeQuestionName || "";
  testCasesInput.value = project.testCases || "";
  expectedOutputInput.value = project.expectedOutput || "";
  workspaceNameInput.value = project.workspace === "Default" ? "" : (project.workspace || "");
  setMode(project.mode || "code");
  setStudioMode(project.studioMode || "standard");
  setCompareEnabled(Boolean(project.compare));
  lastRunResult = project.lastRunResult || null;
  generationResult = project.result ? normalizeResult(project.result) : createEmptyResult();
  selectedVariantIndex = 0;
  selectedFilePath = "";
  renderPresetChips();
  syncComposerState();
  renderOutput();
  typeWriter(getCurrentFile()?.content || "// No code returned.", getCurrentFile()?.path || "");
}

function saveCurrentProject() {
  const name = window.prompt("Project name", workspaceNameInput.value.trim() || "My Project");
  if (!name) {
    return;
  }

  const projectRecord = {
    id: `${Date.now()}`,
    name: name.trim(),
    savedAt: new Date().toLocaleString(),
    prompt: promptInput.value.trim(),
    task: editActionSelect.value,
    framework: frameworkSelect.value,
    language: languageSelect.value,
    leetcodeProblemId: leetcodeProblemIdInput.value.trim(),
    leetcodeQuestionName: leetcodeQuestionNameInput.value.trim(),
    testCases: testCasesInput.value.trim(),
    expectedOutput: expectedOutputInput.value.trim(),
    workspace: workspaceNameInput.value.trim() || "Default",
    mode: selectedMode,
    studioMode: selectedStudioMode,
    compare: compareEnabled,
    lastRunResult,
    result: generationResult
  };

  savedProjects = [projectRecord, ...savedProjects.filter((project) => project.name !== projectRecord.name)].slice(0, MAX_HISTORY_ITEMS);
  saveProjects();
  renderSavedProjects();
  showToast("Project saved.");
}

function pushPromptVersion() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    return;
  }

  promptVersions.unshift({
    id: `${Date.now()}`,
    label: `${editActionSelect.value} - ${frameworkSelect.value}`,
    createdAt: new Date().toLocaleString(),
    prompt
  });
  promptVersions = promptVersions.slice(0, MAX_HISTORY_ITEMS);
  savePromptVersions();
  renderPromptVersions();
}

function loadMostRecentProject() {
  if (!savedProjects.length) {
    showToast("No saved projects yet.");
    return;
  }

  applyProject(savedProjects[0]);
  showToast("Latest saved project loaded.");
}

function fallbackCopyText(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "true");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function getCleanCodeForCopy(content) {
  const lines = (content || "").split("\n");
  const cleanedLines = lines.filter((line, index) => {
    const trimmed = line.trim();
    if (!trimmed && (index === 0 || index === lines.length - 1)) {
      return false;
    }
    if (/^```/.test(trimmed)) {
      return false;
    }
    if (/^(\/\/|#)\s*FILE\s*:/.test(trimmed)) {
      return false;
    }
    return true;
  });

  return cleanedLines.join("\n").trim();
}

async function copyText(text, successMessage, emptyMessage = "Nothing to copy yet.") {
  if (!text) {
    showToast(emptyMessage);
    return false;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopyText(text);
    }
    showToast(successMessage);
    return true;
  } catch (error) {
    try {
      fallbackCopyText(text);
      showToast(successMessage);
      return true;
    } catch {
      showToast("Copy failed. Browser permission may be blocked.");
      return false;
    }
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadTextFile(filename, text) {
  triggerDownload(new Blob([text], { type: "text/plain" }), filename);
}

async function copyCurrentFile() {
  const currentFile = getCurrentFile();
  if (!currentFile) {
    showToast("Nothing to copy yet.");
    return;
  }

  await copyText(getCleanCodeForCopy(currentFile.content), "Current file copied.");
}

function downloadCurrentFile() {
  const currentFile = getCurrentFile();
  if (!currentFile) {
    showToast("Nothing to download yet.");
    return;
  }
  downloadTextFile(currentFile.path, currentFile.content);
  showToast("Current file downloaded.");
}

async function copyCurrentExplanation() {
  await copyText(buildExplainView().trim(), "Explanation copied.", "Nothing to explain yet.");
}

function downloadCurrentExplanation() {
  const currentFile = getCurrentFile();
  const explanation = buildExplainView().trim();
  if (!currentFile || !explanation) {
    showToast("Nothing to explain yet.");
    return;
  }

  const baseName = currentFile.path.replace(/[\\\/]/g, "-");
  downloadTextFile(`${baseName}.explanation.txt`, explanation);
  showToast("Explanation downloaded.");
}

function exportProject() {
  const manifest = {
    exported_at: new Date().toISOString(),
    workspace: workspaceNameInput.value.trim() || "Default",
    prompt: promptInput.value.trim(),
    task: editActionSelect.value,
    framework: frameworkSelect.value,
    mode: selectedMode,
    studio_mode: selectedStudioMode,
    compare: compareEnabled,
    test_input: testCasesInput.value.trim(),
    expected_output: expectedOutputInput.value.trim(),
    last_run: lastRunResult
  };
  const files = [...getCurrentFiles().map((file) => ({ path: file.path, content: file.content })), { path: "codicraft-manifest.json", content: JSON.stringify(manifest, null, 2) }];
  const blob = buildZipBlob(files);
  triggerDownload(blob, "codicraft-project.zip");
  showToast("Project ZIP exported.");
}

function syncComposerState() {
  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, workspaceNameInput.value.trim());
  updateComplexityLabel();
  updateMeta();
  updateRunButtonVisibility();
  evaluatePromptQuality();
  updateInsights();
  renderLearningCoach();
  renderLearningRoadmap();
  requestView.textContent = buildRequestSummary();
  diagnosticsView.textContent = buildDiagnosticsView();
  testsView.textContent = buildTestsView();
  quizView.textContent = buildQuizView();
}

async function requestGeneration({ promptOverride = "", editActionOverride = "", extraAttachments = [] } = {}) {
  autofillLeetCodePrompt();
  autofillPromptFromAttachments();
  const prompt = (promptOverride || promptInput.value.trim()).trim();
  if (!backendReady) {
    showToast("Backend is not ready for AI generation.");
    return false;
  }
  if (!prompt) {
    showToast("Add a prompt before generating.");
    promptInput.focus();
    return false;
  }
  if (!isCodingPrompt(promptInput.value.trim())) {
    const message = "This studio only handles coding requests. Try asking it to build, explain, fix, or refactor code.";
    setStatus("Coding prompt required.", "Blocked", 100);
    previewTitle.textContent = "Coding Prompt Needed";
    typeWriter(`Error: ${message}`);
    showToast(message);
    promptInput.focus();
    return false;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  previewTitle.textContent = compareEnabled ? `${languageSelect.value} Variants` : `${languageSelect.value} Output`;
  setStatus(compareEnabled ? "Generating both variants..." : "Generating files...", "Thinking", 42);

  try {
    const response = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: promptOverride ? prompt : composePrompt(),
        language: languageSelect.value,
        style: toneSelect.value,
        complexity: complexityMap[complexityInput.value],
        mode: selectedMode,
        framework: frameworkSelect.value,
        edit_action: editActionOverride || editActionSelect.value,
        compare: compareEnabled,
        workspace_name: workspaceNameInput.value.trim(),
        target_file: focusFileSelect.value,
        leetcode_problem_id: leetcodeProblemIdInput.value.trim(),
        leetcode_question_name: leetcodeQuestionNameInput.value.trim(),
        strict_options: {
          no_external_libraries: Boolean(strictNoLibrariesInput?.checked),
          runnable_output_required: Boolean(strictRunnableOutputInput?.checked),
          single_file_only: Boolean(strictSingleFileInput?.checked)
        },
        attachments: [...buildAttachmentPayload(), ...extraAttachments]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data.error || "Generation failed.";
      setStatus("Generation failed.", "Error", 100);
      typeWriter(`Error: ${message}`);
      showToast(message);
      if (message.includes("only handles coding requests")) {
        previewTitle.textContent = "Coding Prompt Needed";
      }
      return false;
    }

    generationResult = normalizeResult(data);
    selectedVariantIndex = 0;
    selectedFilePath = "";
    lastRunResult = null;
    renderOutput();
    typeWriter(getCurrentFile()?.content || "// No code returned.", getCurrentFile()?.path || "");
    setOutputTab("code");
    setStatus("Generation complete.", "Ready", 100);
    pushHistory(data);
    pushPromptVersion();
    showToast(compareEnabled ? "Variants generated." : "Code generated.");
    return true;
  } catch (error) {
    setStatus("Generation failed.", "Error", 100);
    typeWriter(`Error: ${error.message}`);
    showToast("Could not reach the backend.");
    setBackendStatus("error", "Backend offline");
    return false;
  } finally {
    generateBtn.disabled = !backendReady;
    generateBtn.textContent = backendReady ? "Generate Code" : "Backend Unavailable";
  }
}

async function generateCode() {
  return requestGeneration();
}

async function runCurrentCode() {
  const currentFile = getCurrentFile();
  if (!currentFile) {
    showToast("Nothing to run yet.");
    return;
  }
  setStatus("Running current code...", "Execution", 72);
  try {
    const response = await fetch("http://127.0.0.1:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageSelect.value,
        path: currentFile.path,
        code: currentFile.content,
        stdin: testCasesInput.value
      })
    });
    const data = await response.json();
    lastRunResult = data;
    renderOutput();
    if (!response.ok) {
      showToast(data.error || data.stderr || "Run failed.");
      setStatus("Run finished with issues.", "Needs attention", 100);
      return;
    }
    setStatus("Run complete.", "Executed", 100);
    showToast("Code executed.");
  } catch (error) {
    lastRunResult = { ok: false, error: error.message, stdout: "", stderr: "", phase: "run" };
    renderOutput();
    setStatus("Run failed.", "Error", 100);
    showToast("Could not reach the run endpoint.");
  }
}

function buildCurrentFilesAsAttachments() {
  const file = getCurrentFile();
  if (!file) {
    return [];
  }
  return [{
    name: file.path,
    kind: "text",
    mime_type: "text/plain",
    size: file.content.length,
    line_count: file.content.split("\n").length,
    truncated: false,
    content: file.content
  }];
}

async function repairCurrentCode() {
  const currentFiles = getCurrentFiles();
  if (!currentFiles.length) {
    showToast("Generate code before trying repair.");
    return;
  }

  const repairPrompt = [
    `Fix the current ${languageSelect.value} code.`,
    selectedMode === "leetcode" ? "Keep the exact LeetCode submission format." : "",
    selectedStudioMode === "submission" ? "Return submission-ready code only." : "",
    testCasesInput.value.trim() ? `Use this sample input or test context:\n${testCasesInput.value.trim()}` : "",
    expectedOutputInput.value.trim() ? `Expected output: ${expectedOutputInput.value.trim()}.` : "",
    lastRunResult?.stderr ? `Latest runtime/compiler error:\n${lastRunResult.stderr.trim()}` : ""
  ].filter(Boolean).join("\n\n");

  const success = await requestGeneration({
    promptOverride: repairPrompt,
    editActionOverride: "fix",
    extraAttachments: buildCurrentFilesAsAttachments()
  });

  if (success) {
    showToast("Repair attempt generated.");
  }
}

function clearPrompt() {
  promptInput.value = "";
  revokeAttachmentResources(selectedAttachments);
  selectedAttachments = [];
  lastRunResult = null;
  generationResult = createEmptyResult();
  selectedVariantIndex = 0;
  selectedFilePath = "";
  renderAttachmentList();
  renderOutput();
  typeWriter("// Your generated result will appear here.");
  editorArea.value = "// Your generated result will appear here.";
  previewTitle.textContent = "Generated Code";
  setStatus("Waiting for your prompt.", "Idle", 0);
  setOutputTab("code");
  syncComposerState();
}

attachBtn.addEventListener("click", () => attachmentInput.click());
attachmentInput.addEventListener("change", (event) => handleAttachmentSelection(event.target.files));
window.addEventListener("paste", (event) => {
  handleClipboardPaste(event);
});
attachmentList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-attachment-id]");
  if (!removeButton) return;
  const removed = selectedAttachments.filter((item) => item.id === removeButton.dataset.attachmentId);
  selectedAttachments = selectedAttachments.filter((item) => item.id !== removeButton.dataset.attachmentId);
  revokeAttachmentResources(removed);
  renderAttachmentList();
  syncComposerState();
});

compareBtn.addEventListener("click", () => {
  setCompareEnabled(!compareEnabled);
  syncComposerState();
});

modeToggle.querySelectorAll(".toggle-chip").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    syncComposerState();
  });
});

studioModeToggle?.querySelectorAll(".toggle-chip").forEach((button) => {
  button.addEventListener("click", () => {
    setStudioMode(button.dataset.studioMode);
    if (selectedStudioMode === "ui-builder") {
      autofillPromptFromAttachments();
    }
    syncComposerState();
  });
});

outputTabs.querySelectorAll(".output-tab").forEach((button) => {
  button.addEventListener("click", () => setOutputTab(button.dataset.tab));
});

variantTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-variant-index]");
  if (!button) return;
  selectedVariantIndex = Number(button.dataset.variantIndex);
  selectedFilePath = "";
  renderOutput();
  typeWriter(getCurrentFile()?.content || "// No code returned.", getCurrentFile()?.path || "");
});

fileTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-file-path]");
  if (!button) return;
  selectedFilePath = button.dataset.filePath;
  renderOutput();
  typeWriter(getCurrentFile()?.content || "// No code returned.", getCurrentFile()?.path || "");
});

historyList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-history-id]");
  if (item) restoreHistory(item.dataset.historyId);
});

savedProjectsList.addEventListener("click", (event) => {
  const deleteTarget = event.target.closest("[data-delete-project-id]");
  if (deleteTarget) {
    savedProjects = savedProjects.filter((entry) => entry.id !== deleteTarget.dataset.deleteProjectId);
    saveProjects();
    renderSavedProjects();
    showToast("Saved project deleted.");
    return;
  }

  const item = event.target.closest("[data-project-id]");
  if (!item) return;
  const project = savedProjects.find((entry) => entry.id === item.dataset.projectId);
  if (!project) return;
  applyProject(project);
  showToast("Project loaded.");
});

promptVersionsList.addEventListener("click", (event) => {
  const deleteTarget = event.target.closest("[data-delete-prompt-version-id]");
  if (deleteTarget) {
    promptVersions = promptVersions.filter((entry) => entry.id !== deleteTarget.dataset.deletePromptVersionId);
    savePromptVersions();
    renderPromptVersions();
    showToast("Prompt version deleted.");
    return;
  }

  const item = event.target.closest("[data-prompt-version-id]");
  if (!item) return;
  const version = promptVersions.find((entry) => entry.id === item.dataset.promptVersionId);
  if (!version) return;
  promptInput.value = version.prompt;
  syncComposerState();
  showToast("Prompt version restored.");
});

promptInput.addEventListener("input", syncComposerState);
leetcodeProblemIdInput.addEventListener("input", () => {
  autofillLeetCodePrompt();
  syncComposerState();
});
leetcodeQuestionNameInput.addEventListener("input", () => {
  autofillLeetCodePrompt();
  syncComposerState();
});
promptInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") generateCode();
});
editActionSelect.addEventListener("change", syncComposerState);
languageSelect.addEventListener("change", syncComposerState);
frameworkSelect.addEventListener("change", () => {
  renderPresetChips();
  syncComposerState();
});
toneSelect.addEventListener("change", syncComposerState);
complexityInput.addEventListener("input", syncComposerState);
workspaceNameInput.addEventListener("input", syncComposerState);
focusFileSelect.addEventListener("change", syncComposerState);
testCasesInput.addEventListener("input", syncComposerState);
expectedOutputInput.addEventListener("input", syncComposerState);
editorArea.addEventListener("input", () => {
  const currentFile = updateCurrentFileContent(editorArea.value);
  if (!currentFile) {
    return;
  }

  codeContent.innerHTML = highlightCode(editorArea.value, currentFile?.path || "");
  filesView.textContent = buildFilesView();
  structureView.textContent = buildStructureSummary();
  explainView.textContent = buildExplainView();
  diagnosticsView.textContent = buildDiagnosticsView();
  quizView.textContent = buildQuizView();
  previewFrame.srcdoc = buildPreviewDoc(getCurrentFiles()) || `<html><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#08111f;color:#eff6ff;font:16px/1.5 Space Grotesk,sans-serif;"><div style="max-width:28rem;padding:24px;text-align:center;opacity:0.82;">Preview appears when the result includes HTML and optional CSS or JS files.</div></body></html>`;
  renderProjectTree();
});

generateBtn.addEventListener("click", generateCode);
clearBtn.addEventListener("click", clearPrompt);
voicePromptBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Voice prompt is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voicePromptBtn.disabled = true;
  voicePromptBtn.textContent = "Listening...";
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
    if (transcript) {
      promptInput.value = transcript;
      syncComposerState();
      showToast("Voice prompt added.");
    }
  };
  recognition.onerror = () => {
    showToast("Could not capture voice prompt.");
  };
  recognition.onend = () => {
    voicePromptBtn.disabled = false;
    voicePromptBtn.textContent = "Voice Prompt";
  };
  recognition.start();
});
copyBtn.addEventListener("click", copyCurrentFile);
copyExplainBtn.addEventListener("click", copyCurrentExplanation);
repairBtn.addEventListener("click", repairCurrentCode);
saveProjectBtn.addEventListener("click", saveCurrentProject);
loadProjectBtn.addEventListener("click", loadMostRecentProject);
downloadBtn.addEventListener("click", downloadCurrentFile);
downloadExplainBtn.addEventListener("click", downloadCurrentExplanation);
exportBtn.addEventListener("click", exportProject);
explainModeSelect.addEventListener("change", () => {
  explainView.textContent = buildExplainView();
  showToast(`Explain mode: ${explainModeSelect.value}`);
});
surpriseBtn.addEventListener("click", () => {
  const templates = presetTemplates[frameworkSelect.value] || presetTemplates.None;
  const randomPrompt = templates[Math.floor(Math.random() * templates.length)];
  promptInput.value = buildPromptFromTemplate(randomPrompt);
  syncComposerState();
  showToast("Prompt idea loaded.");
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer.targetX = (event.clientX / sceneWidth - 0.5) * 2;
  pointer.targetY = (event.clientY / sceneHeight - 0.5) * 2;
});
window.addEventListener("pointerleave", () => {
  pointer.targetX = 0;
  pointer.targetY = 0;
});

const savedWorkspace = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
if (savedWorkspace) workspaceNameInput.value = savedWorkspace;

resizeCanvas();
drawStars();
animateSceneDepth();
renderPresetChips();
renderAttachmentList();
renderHistory();
renderSavedProjects();
renderPromptVersions();
setMode("code");
setStudioMode("standard");
setCompareEnabled(false);
renderRuntimeStatus();
syncComposerState();
renderOutput();
setOutputTab("code");
setStatus("Waiting for your prompt.", "Idle", 0);
setBackendStatus("warning", "Checking AI status...");
checkBackendHealth();
