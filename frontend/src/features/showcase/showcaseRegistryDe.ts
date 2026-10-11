import type { ShowcaseAction, ShowcaseContext, ShowcaseDefinition, ShowcaseDocTarget } from "@/features/showcase/showcase.types";

function docsTarget(categoryId: string, slug: string, title?: string): ShowcaseDocTarget {
  return { categoryId, slug, title };
}

function docsAction(id: string, label: string, description: string, target: ShowcaseDocTarget): ShowcaseAction {
  return {
    id,
    label,
    description,
    kind: "docs",
    docTarget: target,
  };
}

function routeAction(id: string, label: string, description: string, to: string): ShowcaseAction {
  return {
    id,
    label,
    description,
    kind: "route",
    to,
  };
}

export const SHOWCASE_DEFINITIONS_DE: Record<ShowcaseContext, ShowcaseDefinition> = {
  "dashboard:workflows": {
    id: "dashboard:workflows",
    title: "Workflows",
    summary: "Erstelle, organisiere, importiere und verwalte die Workflows für deine KI-Automatisierungen.",
    bullets: [
      "Workflows schnell öffnen, Ordner übersichtlich halten und direkt an kürzlichen Aufgaben weiterarbeiten.",
      "Nutze die Befehlspalette für schnellen Zugriff ohne langes Suchen im Grid.",
      "Nutze diesen Tab als deine Basis für alle Aktivitäten im Editor.",
    ],
    highlights: [
      { eyebrow: "Zentrale Übersicht", title: "Workflow-Bibliothek", description: "Root-Objekte, Ordner und zur Löschung vorgemerkte Workflows an einem Ort einsehen.", tone: "primary" },
      { eyebrow: "Schnellzugriff", title: "Schnelle Erstellung", description: "Neue Workflows erstellen oder direkt JSON importieren.", tone: "blue" },
      { eyebrow: "Struktur", title: "Vorab organisieren", description: "Ordner und Anheften halten wachsende Automatisierungs-Sets übersichtlich.", tone: "green" },
    ],
    actions: [
      docsAction("workflow-docs", "Workflow-Leitfaden lesen", "Vollständige Referenz des Workflows-Tabs öffnen.", docsTarget("tabs", "workflows-tab", "Workflows-Tab")),
      routeAction("open-templates", "Vorlagen öffnen", "Zum Vorlagen-Tab für wiederverwendbare Startpunkte wechseln.", "/?tab=templates"),
    ],
    details: [
      { id: "workflows-structure", title: "Was hierher gehört", content: "Nutze diesen Bereich für Workflow-Lebenszyklus-Aufgaben: Erstellen, Umbenennen, Verschieben, Importieren, Archivieren und Auswählen." },
      { id: "workflows-speed", title: "Schlank bleiben", content: "Wenn du nur eine schnelle Ausführung von einer anderen Seite benötigst, nutze den Quick Drawer. Kehre hierher zurück für Verwaltung und Struktur." },
    ],
    docsTarget: docsTarget("tabs", "workflows-tab", "Workflows-Tab"),
  },
  "dashboard:board": {
    id: "dashboard:board",
    title: "Board",
    summary:
      "Ein agentenbasiertes Kanban-Board. Jede Karte ist ein persistenter Job mit Kontext, Historie und Ausgaben – das Verschieben einer Karte führt die Workflow-Kette der Spalte aus.",
    bullets: [
      "Erstelle Text-Karten im Backlog und ziehe sie per Drag & Drop über die Spalten.",
      "Verknüpfe geordnete Workflows mit jeder Spalte; Kartenbewegungen lösen diese als Trigger aus.",
      "Karten werden grün bei Erfolg, rot bei Fehlern und gelb während der Ausführung.",
      "Kommentare und vorherige Ausgaben fließen in den Kontext des nächsten Laufs ein.",
    ],
    highlights: [
      {
        eyebrow: "Kernidee",
        title: "Karten sind Jobs, keine Notizen",
        description:
          "Jede Karte trägt ihre vollständige Historie: Kommentare, Bewegungen und die Ausgabe jedes Workflows.",
        tone: "primary",
      },
      {
        eyebrow: "Planungsschleife",
        title: "Folgerunden",
        description:
          "Antworte in Kommentaren und führe erneut aus – die Kette sieht den gesamten akkumulierten Kontext.",
        tone: "blue",
      },
    ],
    actions: [
      docsAction(
        "board-docs",
        "Board-Dokumentation",
        "Spaltenketten, Card-Payload-Vertrag und Folgerunden.",
        docsTarget("tabs", "board-tab", "Board"),
      ),
    ],
    details: [
      {
        id: "board-chains",
        title: "Wie Spaltenketten ausgeführt werden",
        content:
          "An eine Spalte angehängte Workflows laufen sequenziell ab, sobald eine Karte eintrifft. Die Ausgabe jedes Workflows wird an den Kartenkontext angehängt; ein Fehler stoppt die Kette.",
      },
      {
        id: "board-context",
        title: "Was Workflows empfangen",
        content:
          "Der Ausführungs-Input enthält die Karte (Titel, Inhalt, Metadaten, Kommentare, Historie, vorherige Ausgaben), das Board, die Bewegung und die Position in der Kette. Lese dies mit $input.card-Ausdrücken aus.",
      },
    ],
    docsTarget: docsTarget("tabs", "board-tab", "Board"),
  },
  "dashboard:templates": {
    id: "dashboard:templates",
    title: "Vorlagen",
    summary: "Starte mit wiederverwendbaren Workflow-Blueprints, statt dieselben Muster jedes Mal neu zu bauen.",
    bullets: [
      "Nutze Vorlagen, wenn die Workflow-Struktur bekannt ist, aber Details noch variieren.",
      "Gute Vorlagen verkürzen das Onboarding und reduzieren wiederholte Canvas-Arbeit.",
      "Teile Muster hier und passe sie im Editor nach Bedarf an.",
    ],
    highlights: [
      { eyebrow: "Wiederverwendung", title: "Blueprint-Ansatz", description: "Bewährte Workflow-Strukturen erfassen und schnell erneut anwenden.", tone: "primary" },
      { eyebrow: "Team-Tempo", title: "Einheitliche Startpunkte", description: "Vorlagen helfen Teams, sich auf dieselben bewährten Muster zu einigen.", tone: "blue" },
      { eyebrow: "Effizienz", title: "Weniger Leerlauf", description: "Wähle einen fertigen Rahmen und passe nur das Wesentliche an.", tone: "amber" },
    ],
    actions: [
      docsAction("templates-docs", "Vorlagen-Doku öffnen", "Erfahre, wie Vorlagen in den Dashboard-Flow passen.", docsTarget("tabs", "templates-tab", "Vorlagen-Tab")),
      routeAction("open-workflows", "Zurück zu Workflows", "Zurück zur Hauptbibliothek für Workflows.", "/"),
    ],
    details: [
      { id: "templates-why", title: "Warum Vorlagen wichtig sind", content: "Sie verwandeln wiederholte Knoten-Layouts in wiederverwendbare Assets – ideal für Teams, die Variationen desselben Workflow-Musters bereitstellen." },
      { id: "templates-when", title: "Optimaler Einsatz", content: "Nutze Vorlagen, wenn die Struktur stabil ist, aber Namen, Prompts, Credentials oder Ziele von Anwendungsfall zu Anwendungsfall variieren." },
    ],
    docsTarget: docsTarget("tabs", "templates-tab", "Vorlagen-Tab"),
  },
  "dashboard:globalvariables": {
    id: "dashboard:globalvariables",
    title: "Variablen",
    summary: "Speichere geteilte Werte zentral und referenziere sie über Workflows hinweg, ohne dieselben Daten überall zu duplizieren.",
    bullets: [
      "Häufig wiederverwendete Werte an einem zentralen, persistenten Ort aufbewahren.",
      "Variablen reduzieren Prompt-Drift und doppelte Konfigurationen.",
      "Werte gezielt teilen, wenn mehrere Workflows dieselbe Datengrundlage benötigen.",
    ],
    highlights: [
      { eyebrow: "Persistenz", title: "Laufübergreifender Speicher", description: "Globale Werte überdauern einzelne Workflow-Ausführungen.", tone: "green" },
      { eyebrow: "Kompakte Konfiguration", title: "Weniger Redundanz", description: "Einmal zentral aktualisieren, statt viele Knotenfelder manuell anzupassen.", tone: "primary" },
      { eyebrow: "Ausdrücke", title: "Unterstützung in der DSL", description: "Werte direkt in Knotenausdrücken und Prompts referenzieren.", tone: "blue" },
    ],
    actions: [
      docsAction("variables-docs", "Variablen-Doku lesen", "Den Leitfaden für Variablen im Dashboard öffnen.", docsTarget("tabs", "global-variables-tab", "Variablen-Tab")),
    ],
    details: [
      { id: "variables-pattern", title: "Typische Muster", content: "Endpoints, geteilte Prompt-Fragmente, umgebungsspezifische Einstellungen oder IDs hinterlegen, die mehrere Workflows lesen müssen." },
      { id: "variables-boundary", title: "Was nicht hierher gehört", content: "Geheimnisse und Provider-Authentifizierungen gehören in Anmeldedaten, nicht in globale Variablen." },
    ],
    docsTarget: docsTarget("tabs", "global-variables-tab", "Variablen-Tab"),
  },
  "dashboard:chat": {
    id: "dashboard:chat",
    title: "Chat",
    summary: "Nutze den Dashboard-Chat als schnellen dialogbasierten Einstiegspunkt für deine Workflows und Plattform-Aufgaben.",
    bullets: [
      "Hervorragend für schnelle Fragen, Workflow-Hilfe und leichtgewichtige Ausführungen.",
      "Fokussiert auf Tempo und Iteration statt voller Editor-Kontrolle.",
      "Sobald die Struktur steht, direkt in den Workflow oder die Doku wechseln.",
    ],
    highlights: [
      { eyebrow: "Natürliche Sprache", title: "Schnelle Interaktion", description: "Einfache Sprache nutzen, statt die gesamte App manuell zu durchsuchen.", tone: "primary" },
      { eyebrow: "Brücke", title: "Von der Idee zur Aktion", description: "Chat hilft, wenn das Ziel klar ist, aber der genaue Weg noch ausgearbeitet werden muss.", tone: "blue" },
      { eyebrow: "Begleiter", title: "Ergänzt die Dokumentation", description: "Zusammen mit der Dokumentation nutzen, um Antworten und Referenzen griffbereit zu haben.", tone: "amber" },
    ],
    actions: [
      docsAction("chat-docs", "Chat-Doku öffnen", "Leitfaden für den Dashboard-Chat lesen.", docsTarget("tabs", "chat-tab", "Chat-Tab")),
      docsAction("assistant-docs", "KI-Assistent Referenz", "Erfahre, wie der Heym-Assistent bei der Workflow-Erstellung unterstützt.", docsTarget("reference", "ai-assistant", "KI-Assistent")),
    ],
    details: [
      { id: "chat-intent", title: "Beste Anwendungsfälle", content: "Chat für schnelle Workflow-Fragen, kurze Plattform-Anleitungen und operative Schritte nutzen, die keine tiefe Canvas-Arbeit erfordern." },
      { id: "chat-next-step", title: "Wann die Ansicht wechseln", content: "In den Editor wechseln, sobald Kontrolle auf Knotenebene nötig ist, oder in die Doku für dauerhafte Referenzen." },
    ],
    docsTarget: docsTarget("tabs", "chat-tab", "Chat-Tab"),
  },
  "dashboard:drive": {
    id: "dashboard:drive",
    title: "Drive",
    summary: "Verwalte und teile Dateien, die von deinen Workflow-Skills generiert wurden.",
    bullets: [
      "Skills schreiben Dateien in das Ausgabe-Verzeichnis; Heym erfasst sie automatisch.",
      "Dateien über Token-Links oder passwortgeschützte Basic-Auth-URLs freigeben.",
      "Dateien mit einem Klick herunterladen.",
    ],
    highlights: [
      { eyebrow: "Speicher", title: "Automatisch erfasste Dateien", description: "Skills schreiben in _OUTPUT_DIR; Dateien erscheinen nach der Ausführung direkt hier.", tone: "primary" },
      { eyebrow: "Freigabe", title: "Flexible Zugriffskontrolle", description: "Öffentliche Links, Passwortschutz, Ablaufdaten und Download-Limits.", tone: "blue" },
      { eyebrow: "Formate", title: "PDF, DOCX, CSV und mehr", description: "Beliebige Dateitypen mit reportlab, python-docx oder Standard-Python generieren.", tone: "green" },
    ],
    actions: [
      docsAction("drive-docs", "Drive-Doku öffnen", "Vollständige Referenz des Drive-Tabs lesen.", docsTarget("tabs", "drive-tab", "Drive-Tab")),
      docsAction("file-gen-docs", "Dateigenerierungs-Leitfaden", "Erfahre, wie Skills Dateien erzeugen.", docsTarget("reference", "file-generation", "Dateigenerierung"))
    ],
    details: [
      { id: "drive-how", title: "Wie Dateien hierher gelangen", content: "Wenn ein Skill Dateien im Verzeichnis _OUTPUT_DIR ablegt, speichert Heym sie persistent und erzeugt Download-Tokens." },
      { id: "drive-share", title: "Freigabeoptionen", content: "Öffentliche Token-Links für jedermann oder passwortgeschützte URLs erstellen inklusive Ablaufdaten und Download-Limits." }
    ],
    docsTarget: docsTarget("tabs", "drive-tab", "Drive-Tab"),
  },
  "dashboard:credentials": {
    id: "dashboard:credentials",
    title: "Anmeldedaten",
    summary: "Verwalte Schlüssel, Tokens und Verbindungsdetails, damit Workflows sicher mit externen Systemen kommunizieren.",
    bullets: [
      "Zugangsdaten zentral speichern, statt sie über einzelne Knoten zu verstreuen.",
      "Anmeldedaten steuern LLMs, Integrationen, Vektorspeicher und mehr an.",
      "Zugriff gezielt freigeben, wenn Teams dieselbe Verbindung ohne Schlüsselkopien benötigen.",
    ],
    highlights: [
      { eyebrow: "Sicherheit", title: "Sichere Zugangsdaten", description: "Authentifizierung einmal hinterlegen und in Workflows sicher wiederverwenden.", tone: "green" },
      { eyebrow: "Integrationen", title: "Breite Unterstützung", description: "Unterstützt Provider wie OpenAI, DeepSeek, Slack, Redis, Qdrant und Grist.", tone: "primary" },
      { eyebrow: "Zusammenarbeit", title: "Gezielt teilen", description: "Team- oder Benutzerfreigaben nutzen, statt Duplikate anzulegen.", tone: "blue" },
    ],
    actions: [
      docsAction("credentials-docs", "Anmeldedaten-Doku lesen", "Leitfaden für das Anmeldedaten-Dashboard öffnen.", docsTarget("tabs", "credentials-tab", "Anmeldedaten-Tab")),
      docsAction("integrations-docs", "Integrationen ansehen", "Details zur Einrichtung von Drittanbieter-Integrationen durchsuchen.", docsTarget("reference", "integrations", "Drittanbieter-Integrationen")),
    ],
    details: [
      { id: "credentials-use", title: "Wo sie verwendet werden", content: "Anmeldedaten werden in der Knotenkonfiguration referenziert und während der Ausführung sicher aufgelöst." },
      { id: "credentials-sharing", title: "Teamfreundliches Modell", content: "Bevorzuge Freigaben, wenn mehrere Entwickler denselben Provider-Zugang benötigen; das sorgt für konsistentes Verhalten und einfache Audits." },
    ],
    docsTarget: docsTarget("tabs", "credentials-tab", "Anmeldedaten-Tab"),
  },
  "dashboard:vectorstores": {
    id: "dashboard:vectorstores",
    title: "Vektorspeicher",
    summary: "Bereite Retrieval-Backends für Workflows vor, die semantische Suche, Gedächtnis oder RAG-Kontexteinbindung benötigen.",
    bullets: [
      "Vektorspeicher bilden die Datenbasis für retrieval-gestützte Workflows.",
      "Zusammen mit RAG-Knoten und KI-Flows für präzises Dokument-Grounding nutzen.",
      "Dieser Tab dient als Infrastruktur für fundierte Prompts.",
    ],
    highlights: [
      { eyebrow: "RAG-Infrastruktur", title: "Durchsuchbares Gedächtnis", description: "Dokumente für semantisches Retrieval bereithalten, wenn Workflows Kontext benötigen.", tone: "primary" },
      { eyebrow: "Qualität", title: "Fundiertes Grounding", description: "Retrieval reduziert Halluzinationsrisiken durch Bereitstellung von Belegen.", tone: "green" },
      { eyebrow: "Betrieb", title: "Einmal zentral verwalten", description: "Vektorspeicher erstellen und über mehrere Workflows hinweg wiederverwenden.", tone: "blue" },
    ],
    actions: [
      docsAction("vectors-docs", "Vektorspeicher-Doku öffnen", "Leitfaden für das Vektorspeicher-Dashboard lesen.", docsTarget("tabs", "vectorstores-tab", "Vektorspeicher-Tab")),
      docsAction("rag-docs", "RAG-Knoten-Doku ansehen", "Referenz zum Qdrant-RAG-Knoten öffnen.", docsTarget("nodes", "rag-node", "Qdrant RAG")),
    ],
    details: [
      { id: "vectors-role", title: "Einordnung", content: "Dieser Tab bereitet die Speicherebene vor. Die eigentliche Retrieval-Logik liegt innerhalb der Workflows (z. B. via RAG- oder Agenten-Muster)." },
      { id: "vectors-choice", title: "Einsatzzeitpunkt", content: "Wähle Vektorspeicher, wenn dein Workflow unstrukturierte Wissensbestände durchsuchen muss, statt sich nur auf das LLM-Gedächtnis zu verlassen." },
    ],
    docsTarget: docsTarget("tabs", "vectorstores-tab", "Vektorspeicher-Tab"),
  },
  "dashboard:mcp": {
    id: "dashboard:mcp",
    title: "MCP",
    summary: "Verwalte Model Context Protocol Verbindungen, damit Agenten-Workflows Werkzeuge und externe Funktionen sicher erreichen.",
    bullets: [
      "MCP verwandelt externe Werkzeug-Ökosysteme in nutzbaren Agentenkontext.",
      "Nutze diesen Tab, wenn Agenten reichhaltigere Werkzeuge als statische Prompts benötigen.",
      "Verbindungsqualität bestimmt direkt die Fähigkeiten deiner Agenten.",
    ],
    highlights: [
      { eyebrow: "Agent-Tools", title: "Externe Funktionsebene", description: "Tool-Server bereitstellen, die Agenten während des Reasonings aufrufen können.", tone: "primary" },
      { eyebrow: "Laufzeit-Kontrolle", title: "Verbindungseinrichtung", description: "Endpoints, Labels und Transport konfigurieren für verlässliche Workflows.", tone: "blue" },
      { eyebrow: "Plattform-Tiefe", title: "Über Prompts hinaus", description: "MCP ermöglicht es Heym-Workflows zu handeln, nicht nur zu antworten.", tone: "amber" },
    ],
    actions: [
      docsAction("mcp-docs", "MCP-Doku öffnen", "Leitfaden für den MCP-Tab lesen.", docsTarget("tabs", "mcp-tab", "MCP-Tab")),
      docsAction("agent-architecture-docs", "Agenten-Architektur", "Erfahre, wie MCP in die Agentenausführung integriert ist.", docsTarget("reference", "agent-architecture", "Agenten-Architektur")),
    ],
    details: [
      { id: "mcp-fit", title: "Bedeutung", content: "Besonders wichtig, wenn dein Agent Werkzeuge, Umgebungszugriff oder Systemintegrationen außerhalb einzelner Knoten benötigt." },
      { id: "mcp-ops", title: "Betriebsansatz", content: "Behandle MCP-Verbindungen wie Infrastruktur: Stabile Labels und klare Zuständigkeiten vereinfachen das Debugging." },
    ],
    docsTarget: docsTarget("tabs", "mcp-tab", "MCP-Tab"),
  },
  "dashboard:traces": {
    id: "dashboard:traces",
    title: "Ausführungen",
    summary: "Inspiziere detaillierte Traces von KI- und Workflow-Ausführungen, um zu verstehen, was passiert ist – nicht nur, ob es funktioniert hat.",
    bullets: [
      "Nutze Traces für Debugging, Performance-Analysen und Prompt-Qualitätsprüfungen.",
      "Traces erklären Modellverhalten, Latenzen und Ausführungspfade.",
      "Die erste Anlaufstelle bei unerwarteten Ergebnissen oder instabilen Läufen.",
    ],
    highlights: [
      { eyebrow: "Debugging", title: "Verborgene Schritte sehen", description: "Trace-Daten legen offen, was Workflow und Modell tatsächlich ausgeführt haben.", tone: "primary" },
      { eyebrow: "Evaluierung", title: "Iterationen unterstützen", description: "Traces bei der Optimierung von Prompts, Werkzeugen und Modellen nutzen.", tone: "blue" },
      { eyebrow: "Zuverlässigkeit", title: "Ergebnisse nachvollziehen", description: "Gute Traces reduzieren Vermutungen bei der Fehleranalyse.", tone: "green" },
    ],
    actions: [
      docsAction("traces-docs", "Ausführungs-Doku öffnen", "Leitfaden für das Ausführungs-Dashboard lesen.", docsTarget("tabs", "traces-tab", "Ausführungs-Tab")),
    ],
    details: [
      { id: "traces-when", title: "Wann Traces unverzichtbar werden", content: "Sobald Workflows mehrstufig, modellintensiv oder toolbasiert sind, reicht die reine Statusanzeige nicht mehr aus." },
      { id: "traces-vs-history", title: "Trace vs. Verlauf", content: "Der Verlauf zeigt, DASS ein Durchlauf stattfand. Traces erklären, WARUM er sich so verhalten hat." },
    ],
    docsTarget: docsTarget("tabs", "traces-tab", "Ausführungs-Tab"),
  },
  "dashboard:alerts": {
    id: "dashboard:alerts",
    title: "Warnungen",
    summary: "Definiere Schwellenwerte über Zeitfenster und werde automatisch benachrichtigt, sobald sie überschritten werden.",
    bullets: [
      "Vier Typen: Fehleranzahl, Laufzeitdauer, Token-/Kosten-Schwellen und Ausführungszähler.",
      "Jede Warnung wird über ein gewähltes Zeitfenster beurteilt, nie anhand einzelner Ereignisse.",
      "Beschreibe die Anforderung in natürlicher Sprache und der Assistent konfiguriert die Warnung.",
    ],
    highlights: [
      { eyebrow: "Zeitfenster", title: "Häufungen statt Ausreißer", description: "Ein fehlgeschlagener Lauf ist Rauschen. Zwölf in zehn Minuten sind ein Incident.", tone: "primary" },
      { eyebrow: "Vor dem Speichern", title: "Bedingung rückwirkend testen", description: "Der Prüfschritt testet gegen echte Historie, um Schwellenwerte vorab zu kalibrieren.", tone: "amber" },
      { eyebrow: "Reaktion", title: "Workflow bei Alarm ausführen", description: "Der Alert-Payload wird zum Workflow-Input für automatische Benachrichtigungen via Slack oder E-Mail.", tone: "blue" },
    ],
    actions: [
      docsAction("alerts-docs", "Warnungen-Doku öffnen", "Funktionsweise von Alarmtypen, Fenstern und dem Assistenten nachlesen.", docsTarget("tabs", "alerts-tab", "Warnungen-Tab")),
    ],
    details: [
      { id: "alerts-purpose", title: "Zweck", content: "Analysen und Traces beantworten Fragen, die du aktiv stellst. Warnungen lassen Heym proaktiv sprechen, wenn kritische Schwellen überschritten werden." },
      { id: "alerts-quiet", title: "Warum Fehlalarme vermieden werden", content: "Eine Warnung löst einmal aus und wartet, bis sich die Metrik erholt – das verhindert Benachrichtigungsfluten." },
    ],
    docsTarget: docsTarget("tabs", "alerts-tab", "Warnungen-Tab"),
  },
  "dashboard:analytics": {
    id: "dashboard:analytics",
    title: "Analysen",
    summary: "Verfolge Nutzungsmuster und Systemverhalten, um Aktivität, Wachstum und Veränderungen im Zeitverlauf zu verstehen.",
    bullets: [
      "Erkenne Akzeptanz, Durchsatz und ungewöhnliche Spitzen mit Analysen.",
      "Eine Sicht auf Plattform-Ebene statt eines Einzel-Debugging-Werkzeugs.",
      "Kombiniere Analysen mit Traces und Verlauf für Signal und Erklärung.",
    ],
    highlights: [
      { eyebrow: "Signale", title: "Nutzungstransparenz", description: "Trends erkennen, statt einzelne Läufe isoliert zu betrachten.", tone: "primary" },
      { eyebrow: "Kapazität", title: "Operatives Bewusstsein", description: "Lastspitzen und Einbrüche frühzeitig erkennen und untersuchen.", tone: "amber" },
      { eyebrow: "Entscheidungshilfe", title: "Gezielte Optimierung", description: "Analysen helfen bei der Priorisierung der wichtigsten Workflows.", tone: "blue" },
    ],
    actions: [
      docsAction("analytics-docs", "Analysen-Doku öffnen", "Leitfaden für das Analysen-Dashboard lesen.", docsTarget("tabs", "analytics-tab", "Analysen-Tab")),
    ],
    details: [
      { id: "analytics-purpose", title: "Zweck", content: "Nutze Analysen für Muster, Durchsatz und aggregiertes Verhalten über den gesamten Plattformbetrieb." },
      { id: "analytics-followup", title: "Vorgehensweise", content: "Signale hier erkennen, dann in Traces, Verlauf oder den Editor wechseln, um Ursachen zu analysieren." },
    ],
    docsTarget: docsTarget("tabs", "analytics-tab", "Analysen-Tab"),
  },
  "dashboard:dashboard": {
    id: "dashboard:dashboard",
    title: "Dashboard",
    summary: "Erstelle ein Raster aus Diagramm-Widgets, die jeweils von eigenen Workflows gespeist werden – alle Kennzahlen auf einen Blick.",
    bullets: [
      "Jedes Widget wird von einem Workflow betrieben, der Daten an einen Chart-Output-Knoten liefert.",
      "Balken-, Linien-, Kreis-, Tabellen- und Zahlen-Widgets passend zur Metrik einsetzen.",
      "Widgets mit KI generieren oder anpassen und Ergebnisse cachen für schnelle Ladezeiten.",
      "Mehrere Dashboards anlegen und mit Personen oder Teams lesend oder schreibend teilen.",
    ],
    highlights: [
      { eyebrow: "Komposition", title: "Workflow-gespeiste Diagramme", description: "Alle Daten, die ein Workflow erzeugt, werden als Diagramm visualisiert.", tone: "primary" },
      { eyebrow: "Leistung", title: "Gecachte Ergebnisse", description: "Widget-Caching vermeidet wiederholte Workflow-Ausführungen bei jedem Seitenaufruf.", tone: "amber" },
      { eyebrow: "KI-Unterstützung", title: "Generieren und Anpassen", description: "Metrik beschreiben und das Widget automatisch durch KI anlegen lassen.", tone: "blue" },
    ],
    actions: [
      docsAction("dashboard-docs", "Dashboard-Doku öffnen", "Erfahre, wie Dashboard-Widgets erstellt werden.", docsTarget("tabs", "dashboard-tab", "Dashboard-Tab")),
    ],
    details: [
      { id: "dashboard-purpose", title: "Zweck", content: "Nutze das Dashboard für persistente Übersichten wichtiger Kennzahlen aus deinen eigenen Workflows." },
      { id: "dashboard-followup", title: "Erstellung", content: "Widget hinzufügen, Workflow konfigurieren, sodass der letzte Knoten vor Chart Output Zeilen liefert, und im Raster anordnen." },
    ],
    docsTarget: docsTarget("tabs", "dashboard-tab", "Dashboard-Tab"),
  },
  "dashboard:teams": {
    id: "dashboard:teams",
    title: "Teams",
    summary: "Verwalte geteilte Zugriffe, damit Workflows, Credentials, Variablen und Vektorspeicher kollaborativ ohne Duplikate genutzt werden.",
    bullets: [
      "Teams sind der sauberste Weg, Plattformressourcen skalierbar zu teilen.",
      "Nutze Teams, wenn Berechtigungen einer Gruppe statt Einzelpersonen folgen sollen.",
      "Sorgt für strukturierte Zusammenarbeit im wachsenden Workspace.",
    ],
    highlights: [
      { eyebrow: "Kollaboration", title: "Gruppenbasierte Freigaben", description: "Zugriff einmal für ein Team erteilen, statt Einzelnutzer manuell zu berechtigen.", tone: "primary" },
      { eyebrow: "Klarheit", title: "Saubere Zuständigkeiten", description: "Ressourcenverwaltung folgt den realen Teamstrukturen.", tone: "green" },
      { eyebrow: "Skalierung", title: "Weniger Administrationsaufwand", description: "Neue Mitglieder erben Zugriffsrechte automatisch über das Team.", tone: "blue" },
    ],
    actions: [
      docsAction("teams-docs", "Teams-Doku öffnen", "Leitfaden für das Teams-Dashboard lesen.", docsTarget("tabs", "teams-tab", "Teams-Tab")),
      docsAction("sharing-docs", "Ressourcenfreigaben", "Details zur Freigabe von Ressourcen nachlesen.", docsTarget("reference", "credentials-sharing", "Freigabe von Anmeldedaten")),
    ],
    details: [
      { id: "teams-role", title: "Vorteile von Teams", content: "Teams verbinden Identität und Ressourcenzugriff für reibungslose Zusammenarbeit." },
      { id: "teams-tip", title: "Praxis-Tipp", content: "Bevorzuge Teamfreigaben, wenn ein Workflow oder Credential einer dauerhaften Arbeitsgruppe gehört." },
    ],
    docsTarget: docsTarget("tabs", "teams-tab", "Teams-Tab"),
  },
  "dashboard:logs": {
    id: "dashboard:logs",
    title: "Protokolle",
    summary: "Lies Logs auf Stack-Ebene, wenn du Infrastruktur-Einblicke jenseits von Workflow-Ausgaben benötigst.",
    bullets: [
      "Nutze Logs für Service-Debugging, Container-Zustände und Umgebungsprobleme.",
      "Hilft, wenn Ursachen unterhalb der Workflow-Ebene liegen.",
      "Zusammen mit Traces nutzen für Belege auf Anwendungs- und Systemebene.",
    ],
    highlights: [
      { eyebrow: "Infrastruktur", title: "Container-Transparenz", description: "Sehen, was Backend-Dienste unterhalb der Heym-Oberfläche ausführen.", tone: "amber" },
      { eyebrow: "Fehlerbehebung", title: "Ursachen finden", description: "Logs helfen bei Startproblemen, Abstürzen oder Integrationsfehlern.", tone: "primary" },
      { eyebrow: "Ergänzend", title: "Unterschied zu Workflow-Ergebnissen", description: "Workflow-Ausgaben zeigen Ergebnisse; Logs zeigen Systemverhalten.", tone: "blue" },
    ],
    actions: [
      docsAction("logs-docs", "Protokoll-Doku öffnen", "Leitfaden für das Protokoll-Dashboard lesen.", docsTarget("tabs", "logs-tab", "Protokoll-Tab")),
    ],
    details: [
      { id: "logs-boundary", title: "Einsatzzeitpunkt", content: "Hierher wechseln, wenn Probleme deployment-, service- oder umgebungsbedingt wirken." },
      { id: "logs-combo", title: "Beste Kombination", content: "Logs zusammen mit Traces und Verlauf nutzen, um von Symptomen schnell zur Ursache zu gelangen." },
    ],
    docsTarget: docsTarget("tabs", "logs-tab", "Protokoll-Tab"),
  },
  evals: {
    id: "evals",
    title: "Evaluierung",
    summary: "Erstelle reproduzierbare Benchmarks für Agenten-Workflows, um Prompt-, Modell- und Workflow-Änderungen verlässlich zu vergleichen.",
    bullets: [
      "Suiten und Testfälle verwandeln subjektive Workflow-Qualität in messbare Kennzahlen.",
      "Der ideale Ort für Regressionsprüfungen vor dem Ausrollen von Prompt- oder Modell-Updates.",
      "Vergleiche mehrere Modelle gegen denselben Datensatz und dieselbe Bewertungsmethode.",
    ],
    highlights: [
      { eyebrow: "Qualitätsschleife", title: "Agenten benchmarken", description: "Dieselbe Suite wiederholt ausführen, statt sich auf Zufallsprüfungen zu verlassen.", tone: "primary" },
      { eyebrow: "Vergleich", title: "Modell- und Prompt-Tests", description: "Sehen, wie sich unterschiedliche Einstellungen am selben Testsatz verhalten.", tone: "blue" },
      { eyebrow: "Sicherheit", title: "Verlässliche Iteration", description: "Verbesserungen vor dem Rollout nachweisbar belegen.", tone: "green" },
    ],
    actions: [
      docsAction("evals-docs", "Evaluierungs-Doku öffnen", "Leitfaden für die Evaluierungsseite lesen.", docsTarget("tabs", "evals-tab", "Evaluierungs-Tab")),
      docsAction("agent-docs", "Agent-Knoten-Referenz", "Den Workflow-Bereich ansehen, auf den die meisten Eval-Suiten abzielen.", docsTarget("nodes", "agent-node", "Agent-Knoten")),
    ],
    details: [
      { id: "evals-design", title: "Konzeption von Suiten", content: "Eine gute Suite spiegelt echte Benutzerfälle, Randbedingungen und Genehmigungsschritte wider, die stabil bleiben müssen." },
      { id: "evals-usage", title: "Vergleichsparameter", content: "Typische Vergleiche umfassen Prompt-Varianten, Modellauswahl, Temperature-Einstellungen und Workflow-Revisionen am selben Datensatz." },
    ],
    docsTarget: docsTarget("tabs", "evals-tab", "Evaluierungs-Tab"),
  },
  docs: {
    id: "docs",
    title: "Dokumentation",
    summary: "Präzise Plattform-Referenzen direkt in der App durchsuchen und bei Bedarf vertiefen.",
    bullets: [
      "Heym-Dokumentation ist auf schnelles Erfassen und gezieltes Nachschlagen ausgelegt.",
      "Seitenleiste, Suche und Querverweise ermöglichen schnellen Wechsel zwischen Konzepten.",
      "Der Showcase verweist direkt auf den aktuell geöffneten Artikel.",
    ],
    highlights: [
      { eyebrow: "In-App-Referenz", title: "Immer griffbereit", description: "Dokumentation bleibt im Produktfluss, ohne externe Tabs öffnen zu müssen.", tone: "primary" },
      { eyebrow: "Überblick", title: "Das Wesentliche zuerst", description: "Artikel starten mit den Kernpunkten und verzweigen über Links." },
      { eyebrow: "Kontextbewusst", title: "Aktueller Artikel", description: "Beim Lesen eines Dokuments folgt die 'Mehr erfahren'-Aktion direkt diesem Artikel." },
    ],
    actions: [
      docsAction("docs-home", "Einführung ansehen", "Die Dokumentationseinführung als Standard-Einstiegspunkt öffnen.", docsTarget("getting-started", "introduction", "Einführung")),
    ],
    details: [
      { id: "docs-nav", title: "Schnelle Navigation", content: "Seitenleiste für Kategorien und die Befehlssuche nutzen, wenn das Thema bereits bekannt ist." },
      { id: "docs-depth", title: "Unterstützung durch Showcase", content: "Der Showcase hält Zusammenfassungen kompakt und führt bei Bedarf zur ausführlichen Doku." },
    ],
    docsTarget: docsTarget("getting-started", "introduction", "Einführung"),
  },
  "dashboard:schedules": {
    id: "dashboard:schedules",
    title: "Zeitpläne",
    summary: "Alle aktiven Cron-Workflows auf einem visuellen Kalender überblicken und Laufzeiten kontrollieren.",
    bullets: [
      "Zwischen Tages-, Wochen- und Monatsansicht für die passende Auflösung wechseln.",
      "Über einen Block hovern für den Cron-Ausdruck; klicken, um direkt zum Canvas zu springen.",
      "Nutze diesen Tab, um Ausführungsdichten zu prüfen und Überschneidungen zu erkennen.",
    ],
    highlights: [
      { eyebrow: "Transparenz", title: "Kalenderansicht", description: "Aktive Cron-Workflows erscheinen als Blöcke zu ihren geplanten Zeiten.", tone: "primary" },
      { eyebrow: "Navigation", title: "Mit einem Klick zum Canvas", description: "Auf einen Block klicken, um den Workflow-Editor direkt zu öffnen.", tone: "blue" },
      { eyebrow: "Bereiche", title: "Tag, Woche oder Monat", description: "Auflösung anpassen, um einzelne Stunden zu prüfen oder den ganzen Monat zu planen.", tone: "green" },
    ],
    actions: [
      docsAction("schedules-docs", "Zeitpläne-Doku öffnen", "Referenz des Zeitpläne-Tabs lesen.", docsTarget("tabs", "scheduled-tab", "Zeitpläne-Tab")),
      docsAction("cron-node-docs", "Cron-Knoten Referenz", "Erfahre, wie Cron-Trigger auf dem Canvas konfiguriert werden.", docsTarget("nodes", "cron-node", "Cron")),
    ],
    details: [
      { id: "schedules-when", title: "Einsatzzeitpunkt", content: "Prüfe geplante Automatisierungen, erkenne Terminkonflikte und stelle sicher, dass wichtige Workflows aktiv bleiben." },
      { id: "schedules-color", title: "Farbkodierung", content: "Jeder Workflow erhält eine konsistente Farbe aus seiner ID, die über Tag-, Woche- und Monatsansicht identisch bleibt." },
    ],
    docsTarget: docsTarget("tabs", "scheduled-tab", "Zeitpläne-Tab"),
  },
  "dashboard:datatable": {
    id: "dashboard:datatable",
    title: "Datentabellen",
    summary: "Strukturierte Datentabellen direkt in Heym erstellen und in Workflows programmatisch nutzen.",
    bullets: [
      "Tabellen mit typisierten Spalten anlegen, manuell befüllen oder via CSV importieren.",
      "Den DataTable-Workflow-Knoten nutzen, um Zeilen programmatisch zu lesen, schreiben und abzufragen.",
      "Tabellen für Benutzer oder Teams mit Lese- oder Schreibrechten freigeben.",
    ],
    highlights: [
      { eyebrow: "Integrierte Daten", title: "Integrierter Speicher", description: "Strukturierte Daten ohne externe Datenbanken oder API-Keys speichern.", tone: "primary" },
      { eyebrow: "Workflow-Integration", title: "DataTable-Knoten", description: "Zeilen in beliebigen Workflows finden, einfügen, aktualisieren und löschen.", tone: "blue" },
      { eyebrow: "Zusammenarbeit", title: "Freigaben und Rechte", description: "Granulare Lese- und Schreibzugriffe für Benutzer und Teams vergeben.", tone: "green" },
    ],
    actions: [
      docsAction("datatable-docs", "Datentabellen-Tab Doku", "Referenz des Datentabellen-Tabs lesen.", docsTarget("tabs", "datatable-tab", "Datentabellen")),
      docsAction("datatable-node-docs", "DataTable-Knoten Doku", "Referenz des DataTable-Knotens lesen.", docsTarget("nodes", "datatable-node", "DataTable")),
    ],
    details: [
      { id: "datatable-overview", title: "Was sind Datentabellen?", content: "Datentabellen sind integrierter strukturierter Speicher in Heym: Typisierte Spalten (String, Number, Boolean, Date, JSON), Inline-Bearbeitung sowie CSV-Import/-Export." },
      { id: "datatable-workflow", title: "Nutzung in Workflows", content: "Der DataTable-Knoten unterstützt find, getAll, getById, insert, update, remove und upsert – ohne Credentials direkt durch den Workflow-Eigentümer." },
    ],
    docsTarget: docsTarget("tabs", "datatable-tab", "Datentabellen"),
  },
  editor: {
    id: "editor",
    title: "Workflow-Editor",
    summary: "Workflows auf dem Canvas erstellen, testen, debuggen und optimieren – direkt im Ausführungskontext.",
    bullets: [
      "Im Editor fließen Knotendesign, Datenfluss und Ausführungsverhalten zusammen.",
      "Seitenleisten und Historie nutzen, um schnell zwischen Erstellung und Debugging zu wechseln.",
      "Der Showcase bleibt hier bewusst kompakt, um maximalen Raum für den Canvas zu bieten.",
    ],
    highlights: [
      { eyebrow: "Canvas", title: "Visuelles Workflow-Design", description: "Knoten verbinden, Logik verzweigen und den Laufzeitfluss direkt modellieren.", tone: "primary" },
      { eyebrow: "Iteration", title: "Debugging beim Erstellen", description: "Historie, Debug-Panels und Ausführungsergebnisse für schnelle Feedback-Schleifen nutzen." },
      { eyebrow: "Funktionsumfang", title: "Erweiterte Funktionen griffbereit", description: "Portal, Freigaben, Vorlagen und Validierung liegen direkt am Canvas." },
    ],
    actions: [
      docsAction("canvas-docs", "Canvas-Doku öffnen", "Referenz der Canvas-Funktionen lesen.", docsTarget("reference", "canvas-features", "Canvas-Funktionen")),
      docsAction("shortcuts-docs", "Tastenkürzel", "Übersicht der Tastaturkürzel im Editor öffnen.", docsTarget("reference", "keyboard-shortcuts", "Tastenkürzel")),
    ],
    details: [
      { id: "editor-flow", title: "Arbeitsrhythmus", content: "Auf dem Canvas modellieren, Annahmen über Ausgaben prüfen und Parameter in Seitenleisten anpassen, ohne den Fokus zu verlieren." },
      { id: "editor-complexity", title: "Kompakter Showcase", content: "Da der Editor bereits viele Informationen bereitstellt, dient der Showcase als schlanke Orientierungshilfe." },
    ],
    docsTarget: docsTarget("reference", "canvas-features", "Canvas-Funktionen"),
  },
};
