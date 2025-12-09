
// Alle wichtigen DOM-Elemente in Konstanten zuweisen
const form = document.querySelector('#searchForm');
const resultsEl = document.querySelector('#results');
const statusBox = document.querySelector('#statusBox');
const resultCountEl = document.querySelector('#resultCount');
const resetBtn = document.querySelector('#resetBtn');
const submitBtn = document.querySelector('#submitBtn');

// Konstanten wie viele Produkte maximal angezeigt werden (10 hier)
const PAGE_SIZE = 10;

// Hilfsfunktion für Statusmeldungen im UI
function setStatus(type, message) {
    statusBox.className = 'status'; 
    statusBox.textContent = '';

    if (!message) {
    statusBox.style.display = 'none';

    return; 
    }

    statusBox.style.display = 'block';
    statusBox.textContent = message;
    statusBox.classList.add(type);
}

// Hilfsfunktion für den Loading-State der Anwendung
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        setStatus('info', 'Lade Ergebnisse...');
        resultsEl.innerHTML = '';
    } else {
        submitBtn.disabled = false;
    }
}

// Hilfsfunktion zur Anzeige der Ergebnis-Zusammenfassung
function updateResultCount(count, query) {
    if (!query) {
        resultCountEl.textContent = 'Noch keine Suche durchgeführt.'
        return;
    }

    if (count === 0) {
        resultCountEl.textContent = `Keine Treffer für ${query}`
    } else {
        resultCountEl.textContent = `${count} Treffer für "${query}" (max. Anzeige: ${PAGE_SIZE})`;
    }
}

// Bereits implementiert, nichts zu tun hier
function clearResults() {
    resultsEl.innerHTML = "";
}

// Hilfsfunktion für den "Empty State" der Ergebnisliste
function renderEmptyState(text) {
    clearResults();
    const div = document.createElement("div");
    div.className = "empty";
    div.textContent = text;
    resultsEl.appendChild(div);
}

// Hilfsfunktion, die die Rohdaten aus der OpenFoodFacts-API normalisiert
function normalizeProducts(apiProducts) {
    if (!Array.isArray(apiProducts)) return [];

    return apiProducts.map(p => ({
        name: p.product_name || "",
        brand: p.brands || "",
        image: p.image_small_url || null,
        nutriScore: p.nutriscore_grade || null
    }));
}

// Rendert die Produktliste in den Ergebnisbereich
function renderProducts(products) {
    clearResults();

    if (!products || products.lenght === 0) {
        renderEmptyState('Keine Produkte gefunden!');

        return;
    }

    let html = "";

    products.forEach(p => {
        const name = p.name || "Unbenanntes Produkt";
        const brand = p.brand || "Unbekannte Marke";
        
        const imageContent = p.image 
            ? `<img src="${p.image}" alt="${name}" loading="lazy" />` 
            : "Kein Bild";

        const scoreText = p.nutriScore 
            ? `Nutri-Score: ${p.nutriScore.toUpperCase()}` 
            : "Kein Nutri-Score";

        html += `
        <article class="card">
            <div class="thumb">
                ${imageContent}
            </div>
            <div class="meta">
                <h3>${name}</h3>
                <div class="brand">${brand}</div>
                <div class="row">
                    <span class="pill">OpenFoodFacts</span>
                    <span class="pill score">${scoreText}</span>
                </div>
            </div>
        </article>
        `;
    });

    resultsEl.innerHTML = html;  
}

// Erzeugt die passende URL, nichts mehr zu tun
function buildSearchUrl(query, langValue) {
    const base =
        (langValue && langValue !== "world")
            ? `https://${langValue}.openfoodfacts.org`
            : "https://world.openfoodfacts.org";

    const params = new URLSearchParams({
        search_terms: query,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: String(PAGE_SIZE)
    });

    return `${base}/cgi/search.pl?${params.toString()}`;
}

// Lädt Produktdaten asynchron aus der OpenFoodFacts-API
async function fetchProducts(query, langValue) {
    const url = buildSearchUrl(query, langValue);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`API-Fehler (${res.status})`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.products)) {
        throw new Error("Unerwartete API-Antwortstruktur.");
    }

    return normalizeProducts(data.products);
}

// Filtert die Produktliste abhängig von der Checkbox "Nur mit Nutri-Score"
function applyNutriFilter(products, onlyNutri) {
    if (onlyNutri) {
        return products.filter(p => p.nutriScore != null && p.nutriScore !== "");
    } else {
        return products;
    }
}

// Submit-Handler für das Suchformular
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const queryRaw = formData.get("q");
    const lang = formData.get("lang");
    const onlyNutri = !!formData.get("onlyNutri"); // !! macht daraus true/false

    const query = queryRaw ? queryRaw.trim() : "";

    if (!query) {
        clearResults();
        updateResultCount(0, "");
        setStatus("info", "Bitte gib einen Suchbegriff ein.");
        return;
    }

    try {
        setLoading(true); // Button sperren, Cursor ändern

        const rawProducts = await fetchProducts(query, lang);
        const finalProducts = applyNutriFilter(rawProducts, onlyNutri);
        renderProducts(finalProducts);
        updateResultCount(finalProducts.length, query);
        
        if (finalProducts.length > 0) {
            setStatus("ok", "Suche erfolgreich.");
        }

    } catch (error) {
        console.error("Fehler im Submit-Handler:", error);
        setStatus("error", "Fehler: " + error.message);
        clearResults();
        updateResultCount(0, query);

    } finally {
        setLoading(false);
    }
});

// Bereits implementiert
resetBtn.addEventListener("click", () => {
    form.reset();
    clearResults();
    updateResultCount(0, "");
    setStatus("", "");
    submitBtn.disabled = false;
});
