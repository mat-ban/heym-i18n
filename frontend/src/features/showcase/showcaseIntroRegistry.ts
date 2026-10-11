import type { ShowcaseContext } from "@/features/showcase/showcase.types";
import { getLocalizedIntro } from "@/content-packs";

export interface ShowcaseIntroContent {
  title: string;
  description: string;
}

/**
 * Every context has a recording, and the exhaustive Record keeps it that way:
 * adding a context without one is a compile error rather than a 404 at runtime.
 */
export const SHOWCASE_INTRO_VIDEO_BY_CONTEXT: Record<ShowcaseContext, string> = {
  "dashboard:workflows": "/features/showcase/workflows.webm",
  "dashboard:board": "/features/showcase/board.webm",
  "dashboard:templates": "/features/showcase/templates.webm",
  "dashboard:globalvariables": "/features/showcase/globalvariables.webm",
  "dashboard:chat": "/features/showcase/chat.webm",
  "dashboard:drive": "/features/showcase/drive.webm",
  "dashboard:datatable": "/features/showcase/datatable.webm",
  "dashboard:schedules": "/features/showcase/scheduled.webm",
  "dashboard:credentials": "/features/showcase/credentials.webm",
  "dashboard:vectorstores": "/features/showcase/vectorstores.webm",
  "dashboard:mcp": "/features/showcase/mcp.webm",
  "dashboard:traces": "/features/showcase/traces.webm",
  "dashboard:alerts": "/features/showcase/alerts.webm",
  "dashboard:analytics": "/features/showcase/analytics.webm",
  "dashboard:dashboard": "/features/showcase/dashboard.webm",
  evals: "/features/showcase/evals.webm",
  "dashboard:teams": "/features/showcase/teams.webm",
  "dashboard:logs": "/features/showcase/logs.mp4",
  docs: "/features/showcase/docs.webm",
  editor: "/features/showcase/editor.webm",
};

export const SHOWCASE_INTRO_CONTENT_BY_CONTEXT: Record<ShowcaseContext, ShowcaseIntroContent> = {
  "dashboard:workflows": {
    title: "Build faster in Workflows",
    description: "Pick a workflow to preview its trigger, last run, and steps beside the list. Filter by status, run it without leaving the page, and use folders to keep production automations clean.",
  },
  "dashboard:board": {
    title: "Run work through an agentic board",
    description:
      "Move cards through columns to trigger workflow chains with the card's full context. Results come back to the card — green means done.",
  },
  "dashboard:templates": {
    title: "Start from proven templates",
    description: "Use ready-made workflow patterns to reduce setup time and keep team implementations consistent.",
  },
  "dashboard:globalvariables": {
    title: "Centralize shared values",
    description: "Store reusable values once and reference them across workflows to avoid duplicated configuration drift.",
  },
  "dashboard:chat": {
    title: "Use chat for rapid iteration",
    description: "Ask quick questions, test ideas, and move to the editor once your workflow shape is clear.",
  },
  "dashboard:credentials": {
    title: "Manage secrets safely",
    description: "Keep provider keys and tokens centralized so workflows can reuse secure connections without exposing raw secrets.",
  },
  "dashboard:vectorstores": {
    title: "Power retrieval-based workflows",
    description: "Prepare vector stores for grounded AI responses, semantic search, and scalable RAG pipelines.",
  },
  "dashboard:mcp": {
    title: "Connect external tool ecosystems",
    description: "Configure MCP connections so agents can use structured tools and perform actions beyond static prompting.",
  },
  "dashboard:traces": {
    title: "Understand execution behavior",
    description: "Inspect trace-level details to debug outcomes, compare runs, and improve workflow reliability.",
  },
  "dashboard:alerts": {
    title: "Get told before someone asks",
    description: "Set thresholds on errors, duration, cost, and run count, then let Heym tell you when a window crosses them.",
  },
  "dashboard:analytics": {
    title: "Track platform performance",
    description: "Monitor adoption and execution trends to decide what to optimize next with real usage signals.",
  },
  "dashboard:dashboard": {
    title: "Build your own dashboards",
    description: "Assemble chart widgets backed by workflows so the metrics you care about are visible at a glance.",
  },
  "dashboard:teams": {
    title: "Scale collaboration cleanly",
    description: "Share workflows and resources by team to reduce manual access work and keep ownership clear.",
  },
  "dashboard:logs": {
    title: "Diagnose system-level issues",
    description: "Use logs when failures are environmental or infrastructure-related and need deeper runtime visibility.",
  },
  "dashboard:drive": {
    title: "Manage generated files",
    description: "Review, download, and share workflow outputs with secure links and controlled access options.",
  },
  "dashboard:datatable": {
    title: "Work with structured data natively",
    description: "Create typed tables and drive them directly from workflows for repeatable read/write operations.",
  },
  "dashboard:schedules": {
    title: "See your automation schedule",
    description: "View all active cron workflows on a day, week, or month calendar. Click any block to jump straight to the canvas.",
  },
  evals: {
    title: "Benchmark quality with confidence",
    description: "Run repeatable suites to compare prompt and model changes before shipping critical workflow updates.",
  },
  docs: {
    title: "Get in-app guidance quickly",
    description: "Browse concise references and jump deeper only when needed, without leaving your current product flow.",
  },
  editor: {
    title: "Design and debug on canvas",
    description: "Compose nodes visually, execute quickly, and refine behavior with immediate feedback in one workspace.",
  },
};

export const SHOWCASE_INTRO_CONTENT_BY_CONTEXT_DE: Record<ShowcaseContext, ShowcaseIntroContent> = {
  "dashboard:workflows": {
    title: "Schneller bauen in Workflows",
    description: "Wähle einen Workflow, um Trigger, letzte Ausführung und Schritte direkt neben der Liste einzusehen. Nach Status filtern, direkt ausführen und mit Ordnern Übersicht behalten.",
  },
  "dashboard:board": {
    title: "Aufgaben über ein agentenbasiertes Board steuern",
    description:
      "Karten durch Spalten ziehen, um Workflow-Ketten mit dem vollen Kontext der Karte auszulösen. Ergebnisse fließen direkt zur Karte zurück.",
  },
  "dashboard:templates": {
    title: "Mit bewährten Vorlagen starten",
    description: "Vorgefertigte Workflow-Muster nutzen, um Einrichtungszeit zu sparen und Konsistenz zu gewährleisten.",
  },
  "dashboard:globalvariables": {
    title: "Geteilte Variablen zentralisieren",
    description: "Wiederverwendbare Werte einmal speichern und über alle Workflows hinweg referenzieren.",
  },
  "dashboard:chat": {
    title: "Chat für schnelle Iteration nutzen",
    description: "Schnelle Fragen stellen, Ideen testen und zum Editor wechseln, sobald der Workflow-Ablauf klar ist.",
  },
  "dashboard:credentials": {
    title: "Geheimnisse sicher verwalten",
    description: "Provider-Schlüssel und Tokens zentral verwalten, damit Workflows sichere Verbindungen ohne Offenlegung von Geheimnissen nutzen können.",
  },
  "dashboard:vectorstores": {
    title: "Retrieval-basierte Workflows unterstützen",
    description: "Vektorspeicher für fundierte KI-Antworten, semantische Suche und skalierbare RAG-Pipelines vorbereiten.",
  },
  "dashboard:mcp": {
    title: "Externe Tool-Ökosysteme anbinden",
    description: "MCP-Verbindungen konfigurieren, damit Agenten strukturierte Tools und Aktionen über einfache Prompts hinaus ausführen können.",
  },
  "dashboard:traces": {
    title: "Ausführungsverhalten verstehen",
    description: "Trace-Details analysieren, um Ergebnisse zu debuggen, Ausführungen zu vergleichen und Zuverlässigkeit zu steigern.",
  },
  "dashboard:alerts": {
    title: "Benachrichtigungen erhalten, bevor Probleme eskalieren",
    description: "Schwellenwerte für Fehler, Dauer, Kosten und Ausführungsanzahl festlegen und sich bei Überschreitung warnen lassen.",
  },
  "dashboard:analytics": {
    title: "Plattformleistung verfolgen",
    description: "Nutzungs- und Ausführungstrends überwachen, um gezielt auf Basis realer Signale zu optimieren.",
  },
  "dashboard:dashboard": {
    title: "Eigene Dashboards erstellen",
    description: "Workflow-gestützte Diagramm-Widgets zusammenstellen, um wichtige Metriken auf einen Blick zu sehen.",
  },
  "dashboard:teams": {
    title: "Zusammenarbeit sauber skalieren",
    description: "Workflows und Ressourcen nach Teams aufteilen, um Zugriffsberechtigungen und Verantwortlichkeiten transparent zu halten.",
  },
  "dashboard:logs": {
    title: "Probleme auf Systemebene diagnostizieren",
    description: "Logs bei Infrastruktur- oder Umgebungsproblemen für tiefere Laufzeiteinblicke nutzen.",
  },
  "dashboard:drive": {
    title: "Generierte Dateien verwalten",
    description: "Workflow-Ausgaben über sichere Links und kontrollierte Zugriffsoptionen prüfen, herunterladen und teilen.",
  },
  "dashboard:datatable": {
    title: "Nativ mit strukturierten Daten arbeiten",
    description: "Typisierte Tabellen erstellen und direkt aus Workflows für reproduzierbare Lese- und Schreiboperationen ansteuern.",
  },
  "dashboard:schedules": {
    title: "Automatisierungszeitpläne überblicken",
    description: "Alle aktiven Cron-Workflows in einer Kalenderansicht (Tag, Woche, Monat) einsehen. Klick auf einen Block führt direkt zum Canvas.",
  },
  evals: {
    title: "Qualität verlässlich bewerten",
    description: "Wiederholbare Test-Suites ausführen, um Prompt- und Modelländerungen vor Produktiv-Rollouts fundiert zu vergleichen.",
  },
  docs: {
    title: "Schnelle Orientierung in der App",
    description: "Kompakte Referenzen durchsuchen und gezielt vertiefen, ohne den aktuellen Workflow zu verlassen.",
  },
  editor: {
    title: "Auf dem Canvas entwerfen und debuggen",
    description: "Knoten visuell verknüpfen, sofort ausführen und Verhalten mit direktem Feedback in einem Arbeitsbereich verfeinern.",
  },
};

export function getShowcaseIntroVideo(context: ShowcaseContext | null): string | null {
  if (!context) return null;
  return SHOWCASE_INTRO_VIDEO_BY_CONTEXT[context] ?? null;
}

export function getShowcaseIntroContent(context: ShowcaseContext | null): ShowcaseIntroContent | null {
  if (!context) return null;
  try {
    const localized = getLocalizedIntro(context);
    if (localized) return localized;
  } catch {
    // fallback
  }
  return SHOWCASE_INTRO_CONTENT_BY_CONTEXT[context] ?? null;
}

export function getShowcaseIntroScreenKey(context: ShowcaseContext | null): string | null {
  if (!context) return null;
  return context.replace(/[:/]/g, "_");
}
