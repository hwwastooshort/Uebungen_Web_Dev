// Datensatz der Cafés (gegeben)
const cafes = [
    { id: 1, name: "Café Centrale", city: "Mitte", rating: 4.6, distance: 0.5, priceLevel: 2, hasWifi: true, seatsFree: 5 },
    { id: 2, name: "Roasted Beans", city: "Nord", rating: 4.2, distance: 3.0, priceLevel: 3, hasWifi: true, seatsFree: 0 },
    { id: 3, name: "Latte & Code", city: "Mitte", rating: 4.9, distance: 1.2, priceLevel: 3, hasWifi: true, seatsFree: 2 },
    { id: 4, name: "Bohnenhaus", city: "Süd", rating: 3.8, distance: 6.5, priceLevel: 1, hasWifi: false, seatsFree: 8 },
    { id: 5, name: "Cup o' Joy", city: "Nord", rating: 4.0, distance: 4.5, priceLevel: 2, hasWifi: false, seatsFree: 1 },
    { id: 6, name: "Code & Coffee", city: "Mitte", rating: 4.7, distance: 2.3, priceLevel: 3, hasWifi: true, seatsFree: 0 },
    { id: 7, name: "Espresso Ecke", city: "Süd", rating: 3.5, distance: 8.0, priceLevel: 1, hasWifi: false, seatsFree: 3 },
    { id: 8, name: "Campus Café", city: "Mitte", rating: 4.1, distance: 0.8, priceLevel: 2, hasWifi: true, seatsFree: 10 }
];

// aktuell angezeigte Cafés
let currentCafes = cafes;

// Hilfsfunktion: Preislevel in "€"-Zeichen umwandeln
function formatPriceLevel(priceLevel) {
    // TODO: z.B. priceLevel-mal das Zeichen "€" aneinanderhängen und zurückgeben
    // Tipp: Sie können eine Schleife oder geeignete String-Methoden verwenden.
    return "€".repeat(priceLevel);
}

// Hilfsfunktion: Zahl auf eine Nachkommastelle runden
function formatNumber(value) {
    // TODO: Zahl sinnvoll formatieren (z.B. mit einer Nachkommastelle)
    // Tipp: Verwenden Sie geeignete Methoden von Number oder String.
    return value.toFixed(1);
}

// Aufgabe 1: Cafés in Tabelle anzeigen
function renderCafes(cafeArray) {
    const table = document.getElementById("cafe-table");

    let tableHtml = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Stadt</th>
                <th>Bewertung</th>
                <th>Entfernung</th>
                <th>Preis</th>
                <th>WLAN</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
    `;

    cafeArray.forEach(cafe => {
        const priceDisplay = formatPriceLevel(cafe.priceLevel);
        const distanceDisplay = formatNumber(cafe.distance);
        const wifiDisplay = cafe.hasWifi ? "Ja" : "Nein";

        let statusBadge;
        if (cafe.seatsFree > 0) {
            statusBadge = `<span class="badge badge-open">Plätze frei (${cafe.seatsFree})</span>`;
        } else {
            statusBadge = `<span class="badge badge-busy">voll</span>`;
        }

        tableHtml += `
            <tr>
                <td>${cafe.name}</td>
                <td>${cafe.city}</td>
                <td>${cafe.rating}</td>
                <td>${distanceDisplay} km</td>
                <td>${priceDisplay}</td>
                <td>${wifiDisplay}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    tableHtml += `</tbody>`;

    table.innerHTML = tableHtml;
}

// Aufgabe 2: Filter anwenden
function applyFilters() {
    // TODO: Eingabefelder auslesen:
    // - Mindestbewertung (id="min-rating")
    const minimumRating = parseFloat(document.getElementById("min-rating").value);
    // - maximale Entfernung (id="max-distance")
    const maximumDistance = parseFloat(document.getElementById('max-distance').value);
    // - ausgewählte Stadt (id="city-select")
    const selectedCity = document.getElementById('city-select').value;

    // TODO: Arbeitskopie des Ausgangsarrays anlegen (z.B. aus cafes)
    const copyOfArray = [...cafes];

    // TODO: nur Cafés behalten, deren Bewertung >= Mindestbewertung ist
    const goodEnoughCafes = copyOfArray.filter(element => element.rating >= minimumRating);

    // TODO: nur Cafés behalten, deren Entfernung <= maximale Entfernung ist
    const closeEnoughCafes = goodEnoughCafes.filter(element => element.distance <= maximumDistance);

    // TODO: nur Cafés der ausgewählten Stadt behalten
    // Hinweis: Wenn "all" ausgewählt ist, sollen alle Städte erlaubt sein.
    let correctCityCafes = closeEnoughCafes;

    if (selectedCity !== 'all') {
        correctCityCafes = closeEnoughCafes.filter(element => element.city === selectedCity);
    }

    // TODO: Ergebnis in currentCafes speichern
    currentCafes = correctCityCafes;

    // TODO: renderCafes(currentCafes) und updateStats(currentCafes) aufrufen
    renderCafes(currentCafes);
    updateStats(currentCafes);
}

// Aufgabe 2: Filter zurücksetzen
function resetFilters() {
    // TODO: Eingabefelder auf sinnvolle Startwerte zurücksetzen
    // - Mindestbewertung wieder auf Standardwert (z.B. 3.5)
    document.getElementById("min-rating").value = 3.5;
    // - maximale Entfernung wieder auf Standardwert (z.B. 5)
    document.getElementById("max-distance").value = 5;
    // - Stadt-Auswahl wieder auf "all"
    document.getElementById("city-select").value = "all";

    // TODO: currentCafes wieder auf alle Cafés setzen (cafes)
    currentCafes = cafes;

    // TODO: Tabelle und Statistiken neu zeichnen
    // (renderCafes(currentCafes) und updateStats(currentCafes))
    renderCafes(currentCafes);
    updateStats(currentCafes);
}

// Aufgabe 3: Statistiken berechnen und anzeigen
function updateStats(cafeArray) {
    const statsElement = document.getElementById("stats");

    // Falls keine Cafés gefunden wurden, abbrechen oder 0 anzeigen
    if (cafeArray.length === 0) {
        statsElement.innerHTML = "<p>Keine Cafés gefunden.</p>";
        return;
    }

    // TODO: Anzahl der Cafés bestimmen (Länge des Arrays)
    const length = cafeArray.length;

    // TODO: durchschnittliche Bewertung berechnen
    // Hinweis: Mittelwert aus allen rating-Werten bilden
    const averageRating = (cafeArray.reduce((acc, curr) => acc + curr.rating, 0) / length).toFixed(1);

    // TODO: durchschnittliche Entfernung berechnen
    // Hinweis: Mittelwert aus allen distance-Werten bilden
    const averageDistance = (cafeArray.reduce((acc, curr) => acc + curr.distance, 0) / length).toFixed(1);

    // TODO: Anzahl Cafés mit freien Plätzen bestimmen
    // Hinweis: Cafés zählen, bei denen seatsFree > 0 ist
    const cafesWithFreeSpots = cafeArray.filter(c => c.seatsFree > 0).length;

    // OPTIONAL (Bonus, wenn gewünscht):
    // TODO: "bestes Café zum Arbeiten" bestimmen:
    // - nur Cafés mit WLAN und mindestens einem freien Platz betrachten
    // - unter diesen z.B. das Café mit der höchsten Bewertung wählen
    //   (bei Gleichstand z.B. die geringste Entfernung bevorzugen)
    let bestCafeName = "-";
    const workCafes = cafeArray.filter(c => c.hasWifi && c.seatsFree > 0);
    if (workCafes.length > 0) {
        workCafes.sort((a, b) => b.rating - a.rating || a.distance - b.distance);
        bestCafeName = workCafes[0].name;
    }

    // TODO: Aus den berechneten Werten HTML für mehrere "stat-card"-Elemente aufbauen
    // Vorschlag:
    // - Anzahl Cafés
    // - Ø Bewertung
    // - Ø Entfernung
    // - Anzahl Cafés mit Platz
    // - optional Text zum "besten Café zum Arbeiten"
    let htmlified = `
        <div class="stat-card">Anzahl: <strong>${length}</strong></div>
        <div class="stat-card">Ø Bewertung: <strong>${averageRating}</strong></div>
        <div class="stat-card">Ø Entfernung: <strong>${averageDistance} km</strong></div>
        <div class="stat-card">Freie Cafés: <strong>${cafesWithFreeSpots}</strong></div>
        <div class="stat-card">Tipp: <strong>${bestCafeName}</strong></div>
    `;

    // TODO: Den fertigen HTML-String als innerHTML von statsElement setzen
    statsElement.innerHTML = htmlified;
}

// Initialisierung: Event Listener einrichten und Startansicht anzeigen
function init() {
    // TODO: Klick-Event für Button "Filter anwenden" (id="btn-apply") registrieren
    // -> soll applyFilters aufrufen
    document.getElementById("btn-apply").addEventListener("click", applyFilters);

    // TODO: Klick-Event für Button "Alle Cafés" (id="btn-reset") registrieren
    // -> soll resetFilters aufrufen
    document.getElementById("btn-reset").addEventListener("click", resetFilters);

    // TODO: Anfangszustand setzen:
    // - currentCafes auf cafes setzen
    currentCafes = cafes;
    // - renderCafes(currentCafes) aufrufen
    renderCafes(currentCafes);
    // - updateStats(currentCafes) aufrufen
    updateStats(currentCafes);
}

init();