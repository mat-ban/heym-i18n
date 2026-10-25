# Canvas-Zusammenarbeit

Jeder, der denselben Workflow öffnet, sieht die anderen auf dem Canvas und arbeitet an einem gemeinsamen Entwurf. Änderungen erscheinen sofort für alle, der Zeiger jeder Person bewegt sich in ihrer eigenen Farbe, Sie können verfolgen, worauf jemand anderes blickt, und Sie können über das Mikrofon sprechen.

## Wer ist auf dem Canvas

Die Avatare oben links auf dem Canvas zeigen jeden an, der den Workflow geöffnet hat, einschließlich Ihnen. Jede Person hat eine Farbe: Ihr Avatar-Ring, ihr Zeiger und der Rahmen, den Sie sehen, während Sie ihr folgen, verwenden diese Farbe. Bewegen Sie den Mauszeiger über einen Avatar, um den Namen zu sehen und ob diese Person bearbeiten oder nur anzeigen kann. Mehr als fünf Personen werden als **+N** angezeigt.

## Gemeinsames Bearbeiten

Personen mit Bearbeitungszugriff ändern denselben Entwurf. Das Hinzufügen, Löschen, Verschieben und Verbinden von Knoten sowie das Ändern von Knoteneinstellungen erreichen jedes offene Canvas innerhalb eines Augenblicks, ohne vorheriges Speichern.

- **Speichern.** Jeder mit Bearbeitungszugriff kann speichern. Das Speichern sichert den gemeinsamen Entwurf, und **Ungespeicherte Änderungen** verschwindet für alle, deren Canvas mit dem Gespeicherten übereinstimmt.
- **Gleiche Einstellung, gleicher Moment.** Wenn zwei Personen gleichzeitig die Einstellungen desselben Knotens ändern, gewinnt auf jedem Bildschirm die Änderung, die den Server zuletzt erreicht. Das Verschieben eines Knotens und das Bearbeiten seiner Einstellungen überschreiben sich niemals gegenseitig.
- **Name und Beschreibung.** Während jemand den Workflow umbenennt oder seine Beschreibung bearbeitet, sieht jeder den Text während der Eingabe, unterstrichen in seiner Farbe. **Enter** übernimmt ihn für alle, **Esc** stellt den alten Text wieder her.
- **Rückgängig.** **Strg+Z** macht nur Ihre eigenen Änderungen rückgängig. Von anderen vorgenommene Änderungen bleiben erhalten.
- **Später beitreten.** Wenn jemand bereits ungespeicherte Änderungen hat, startet ein Canvas, das den Workflow später öffnet, mit diesem Entwurf, nicht mit dem letzten Speicherstand.
- **Nur-Lese-Zugriff.** Personen, die nur anzeigen können, sehen jede Änderung live, können jedoch nicht bearbeiten. Wenn die letzte Person mit Bearbeitungszugriff den Workflow verlässt, ohne zu speichern, werden die ungespeicherten Änderungen verworfen und Nur-Lese-Canvas kehren zur gespeicherten Version zurück.
- **Anderswo gespeichert.** Wenn der Workflow außerhalb des Canvas gespeichert wird (über den Chat-Tab, über MCP oder durch Wiederherstellen einer Version im [Verlauf](./edit-history.md)), laden Canvas-Ansichten ohne ungespeicherte Änderungen die neue Version. Bei ungespeicherten Änderungen wählen Editoren, ob die gespeicherte Version für alle geladen oder der Entwurf beibehalten werden soll.

## Zeiger

Der Zeiger jeder Person erscheint mit ihrem Avatar und Namen. Auf dem Canvas befindet er sich über demselben Knoten, auf den die Person zeigt, unabhängig von Ihrer Zoomstufe. Über der Kopfzeile, den Seitenleisten, dem Debug-Panel, dem KI-Assistenten und offenen Dialogen richtet er sich am selben Steuerelement auf Ihrem Bildschirm aus, selbst wenn Ihr Fenster eine andere Größe hat.

Während Sie jemandem folgen, wird jeder seiner Klicks als kurze Welle an seinem Zeiger angezeigt, sodass Sie sehen können, was angeklickt wurde. Zeiger anderer Personen bleiben schlicht.

Befindet sich ein Zeiger über einem Panel oder Dialog, den Sie nicht geöffnet haben, wird er für Sie nicht angezeigt.

## Jemandem folgen

Klicken Sie auf den Avatar einer Person, um ihr zu folgen. Die Person erhält einen Hinweis, dass Sie ihr folgen. Ihr Canvas zeigt dann:

- den Teil des Canvas, den sie betrachtet, und wohin sie zeigt, auch über Panels und Dialogen
- die Knotenliste, den von ihr ausgewählten Knoten, das Eigenschaften-Panel und dessen Tab
- was sie in die Run-Eingabefelder eingibt
- die Ausdrucksdialoge, Verlauf, Bearbeitungsverlauf, Freigeben, Portal, cURL und Als Vorlage teilen Dialoge, die sie öffnet
- den Workflow Analyzer und den Page Guide
- das Debug-Panel, eine Ausführung, die sie live auf Ihrem Canvas startet, und das Ergebnis ihrer letzten Ausführung
- ihren KI-Assistenten: das Panel, Agent oder Ask, was eingegeben wird, die Nachrichten und die Antworten, schreibgeschützt

Was die Person in Dialogen, Seitenleisten, Dropdowns und dem KI-Assistenten anklickt, eingibt, überfährt und scrollt, geschieht auch in Ihrer Ansicht: Felder füllen sich aus, Tabs und Optionen wechseln, Menüs und Hover-Details öffnen sich, Listen scrollen an dieselbe Stelle. Tasten, die sie in einem Dialog drückt, wie **Esc** zum Leeren der Verlaufssuche, tun dasselbe bei Ihnen. Ein Tooltip, den sie liest, erscheint neben ihrem Zeiger, und ein Knoten, auf den sie zeigt, zeigt seine **Run**- und **KI**-Buttons. Ihr Zeiger sitzt auf demselben Button oder derselben Zeile in Ihrer Ansicht, selbst wenn Ihr Bildschirm eine andere Größe hat. Dialoge, Ausführungen und Verlauf öffnen sich auf Ihrem Bildschirm mit Ihren eigenen Berechtigungen, sodass Sie sehen, was Ihre Freigabe erlaubt. Ein Rahmen in ihrer Farbe um den gesamten Editor markiert, dass Sie ihr folgen.

Während Sie folgen, schauen Sie nur zu. Ihr Editor speichert, führt aus und sendet nichts, sodass ein Button, den die Person drückt, wie **Hinzufügen** in Freigeben, die Dinge einmal als sie ändert, nicht erneut als Sie.

Zum Beenden drücken Sie **Esc**, klicken oder tippen Sie irgendwo selbst, bewegen Sie das Canvas oder klicken Sie erneut auf ihren Avatar.

## Sprechen

Klicken Sie auf das Mikrofon neben den Avataren, um mit allen auf dem Canvas zu sprechen. Beim ersten Mal fragt der Browser nach dem Mikrofonzugriff. Browser erlauben das Mikrofon nur, wenn Heym über `https` oder auf `localhost` geöffnet ist. Bei Aufruf über eine Netzwerkadresse wie `http://192.168.0.10:4017` funktioniert alles andere, das Mikrofon bleibt jedoch deaktiviert. Sie können andere hören, ohne Ihr eigenes Mikrofon einzuschalten. Der Ring der sprechenden Person pulsiert.

Audio wird direkt zwischen Browsern übertragen. Es funktioniert im selben Netzwerk, über ein VPN und in den meisten Heim- und Büronetzwerken. Wenn zwei Personen keine Verbindung herstellen können, erscheint ein roter Punkt auf dem Avatar. Wenn der Browser den Ton zurückhält, bis Sie mit der Seite interagieren, erscheint ein **Audio aktivieren** Button.

Für Administratoren: Um eine direkte Route zu finden, kontaktieren Browser die öffentlichen STUN-Server `stun.cloudflare.com` und `stun.l.google.com`. Audio passiert diese Server oder Heym niemals. Ohne Internetzugang können sich Personen im selben Netzwerk oder VPN dennoch verbinden.

## Wo es funktioniert

Zeiger, Folgen und Sprechen sind im Desktop-Editor verfügbar. Der mobile Editor empfängt Live-Änderungen.

Wenn der Editor die Kollaborationsverbindung nicht erreichen kann, beispielsweise hinter einem Proxy, der WebSockets nicht durchleitet, öffnet er wie gewohnt und weist einmal darauf hin, dass die Live-Zusammenarbeit deaktiviert ist. Er versucht es im Hintergrund weiter und aktiviert die Zusammenarbeit, sobald die Verbindung wiederhergestellt ist.

Siehe auch [Canvas-Funktionen](./canvas-features.md), [Verlauf](./edit-history.md) und [Tastenkombinationen](./keyboard-shortcuts.md).
