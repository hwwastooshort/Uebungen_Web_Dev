// ==========================
// 1. Preise & Datenmodelle
// ==========================

const basePrices = {
    small: 2.0,
    medium: 3.0,
    large: 4.0
};

const toppings = [
    { id: "sprinkles", label: "Schokostreusel", price: 0.4 },
    { id: "cookies", label: "Keksstücke", price: 0.6 },
    { id: "strawberry", label: "Erdbeersoße", price: 0.5 },
    { id: "cream", label: "Sahne", price: 0.3 }
];


// ==========================
// 2. Klasse IceOrder
// ==========================

class IceOrder {
    constructor(customerName, size, selectedToppings, discountFn) {
        this.customerName = customerName;
        this.size = size; // "small", "medium", "large"
        this.selectedToppings = selectedToppings; // Array von Topping-IDs
        this.discountFn = discountFn; // Funktion, die den Rabatt berechnet (oder null)
    }

    getBasePrice() {
        return basePrices[this.size];
    }

    getToppingsPrice() {
        let sum = 0;

        for (const selectedId of this.selectedToppings) {
            for (const topping of toppings) {
                if (selectedId === topping.id) {
                    sum += topping.price;
                }
            }
        }

        return sum;
    }

    getTotalPrice() {
        let totalPrice = this.getBasePrice() + this.getToppingsPrice();
        totalPrice = this.discountFn(totalPrice);

        return totalPrice;
    }

    getSummaryText() {
       return `Hallo ${this.customerName}, dein Eis kostet ${this.getTotalPrice().toFixed(2)} €.`
    }
}


// ==========================
// 3. Hilfsfunktionen
// ==========================

function getSelectedSize() {
    const sizeRadios = document.querySelectorAll('input[name="size"]');

    for (const radio of sizeRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }

    return null;
}

function getSelectedToppings() {
    const selected = [];
    const toppingCheckboxes = document.querySelectorAll('input[type="checkbox"]');

   for (const checkbox of toppingCheckboxes) {
        if (checkbox.checked) {
            selected.push(checkbox.id);
        }
   }

    return selected;
}

// Higher-Order + Closure
function createDiscountFunction(code) {
    // Innere Funktion erzeugt eine Rabattfunktion (Closure über percent)
    function makeDiscount(percent) {

        return function (price) {

            return price - ((price * percent) / 100);
        };
    }

    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode === "STUDENT10") {
        return makeDiscount(10);
    }

    if (trimmedCode === "BIGEIS20") {
        return makeDiscount(20);
    }

    // Kein gültiger Code => Identitätsfunktion
    return function (price) {
        return price;
    };
}


// ==========================
// 4. Event-Handler
// ==========================

const button = document.querySelector("#calculateBtn");
const resultDiv = document.querySelector("#result");

button.addEventListener("click", () => {

    const name = document.querySelector("#customerName").value;
    const size = getSelectedSize();
    const toppings = getSelectedToppings();
    const code = document.querySelector("#discountCode").value;

    const discountFn = createDiscountFunction(code);

    const order = new IceOrder(name, size, toppings, discountFn);

    resultDiv.innerText = order.getSummaryText();
});