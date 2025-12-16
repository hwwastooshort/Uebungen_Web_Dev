const maxSnowflakes = 200;
const container = document.getElementById('snow-container');

function createSnowflake() {
    // Wenn wir schon genug Flocken haben, brechen wir ab
    if (container.childElementCount >= maxSnowflakes) {
        return;
    }

    // 1. SVG Element erstellen (mit richtigem Namespace!)
    const svgNS = "http://www.w3.org/2000/svg";
    const flake = document.createElementNS(svgNS, "svg");

    // 2. Zufällige Parameter berechnen
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 80 + 20; // Größe zwischen 20px und 100px
    const duration = Math.random() * 5 + 5; // Dauer zwischen 5s und 10s
    
    // 3. Attribute setzen
    flake.setAttribute("viewBox", "-250 -250 500 500");
    flake.setAttribute("class", "snowflake");
    
    // Styling direkt setzen
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.left = `${startX}px`;
    flake.style.animation = `fall ${duration}s linear infinite`;

    // 4. Den Inhalt (<use>) hinzufügen
    const use = document.createElementNS(svgNS, "use");
    use.setAttribute("href", "#flake"); // Bezieht sich auf die ID im HTML
    flake.appendChild(use);

    // 5. In den Container einfügen
    container.appendChild(flake);

    // 6. Aufräumen: Wenn die Animation einmal durch ist (oder flake unten raus ist)
    // Trick: Wir prüfen einfach via Timeout oder Animation-Iteration.
    // Da wir "infinite" Animation haben, müssen wir manuell prüfen, ob sie unten sind,
    // ODER wir machen die Animation nicht "infinite" und nutzen das 'animationend' Event.
    
    // BESSERE METHODE: Animation nicht "infinite" machen, sondern einmal laufen lassen und dann löschen.
    // Ich ändere oben: flake.style.animation = `fall ${duration}s linear`; (ohne infinite)
    flake.style.animation = `fall ${duration}s linear`;

    flake.addEventListener('animationend', () => {
        flake.remove();
    });
}

// Hauptschleife: Versucht alle 200ms eine neue Flocke zu erzeugen
setInterval(() => {
    createSnowflake();
}, 100);