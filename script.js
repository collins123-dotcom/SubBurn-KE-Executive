// This is the key we use to save data in the browser
const SAVE_KEY = "subburn_tracker_data";

// Load existing data from memory, or start with an empty list if there's nothing
let mySubscriptions = JSON.parse(localStorage.getItem(SAVE_KEY)) || [];

// Run the 'showCards' function as soon as the page opens
window.onload = function () {
    showCards();
};

function addNewSub() {
    // 1. Get the boxes from the HTML
    let nameBox = document.getElementById('serviceName');
    let priceBox = document.getElementById('priceInput');
    let usageBox = document.getElementById('usageInput');

    // 2. Check if the user left anything empty
    if (nameBox.value === "" || priceBox.value === "" || usageBox.value === "") {
        alert("Please fill in all the boxes first!");
        return;
    }

    // 3. Convert text to numbers so we can do math
    let price = parseFloat(priceBox.value);
    let usage = parseInt(usageBox.value);

    // 4. Calculate cost per use
    // If usage is 0, we just use the full price to avoid errors
    let costPerUse = 0;
    if (usage > 0) {
        costPerUse = (price / usage).toFixed(2);
    } else {
        costPerUse = price.toFixed(2);
    }

    // 5. Decide if it's a "Good" or "Bad" spend (The Nairobi Logic)
    let colorClass = "green";
    let labelText = "Great Value";

    // If it costs more than 250 bob per use, that's expensive (Toxic)
    if (costPerUse > 250) {
        colorClass = "red";
        labelText = "Toxic Burn";
    }
    // If it's between 100 and 250, it's okay but be careful
    else if (costPerUse > 100) {
        colorClass = "orange";
        labelText = "Moderate Burn";
    }

    // 6. Create the data object
    let newEntry = {
        id: Date.now(), // Uses current time as a unique ID
        name: nameBox.value,
        price: price,
        unitCost: costPerUse,
        color: colorClass,
        status: labelText
    };

    // 7. Add to our list and save it
    mySubscriptions.push(newEntry);
    saveData();
    showCards();

    // 8. Clear the boxes for the next entry
    nameBox.value = "";
    priceBox.value = "";
    usageBox.value = "";
}

function saveData() {
    // We have to turn the list into a string to store it in the browser
    localStorage.setItem(SAVE_KEY, JSON.stringify(mySubscriptions));
}

function showCards() {
    let container = document.getElementById('dashboardGrid');
    container.innerHTML = ""; // Clear the screen before re-drawing

    // Loop through every item in our list
    for (let i = 0; i < mySubscriptions.length; i++) {
        let item = mySubscriptions[i];

        // Create a new div for the card
        let card = document.createElement('div');

        // Add the classes: 'sub-card' for shape, plus the color (red/green/orange)
        card.className = `sub-card ${item.color}`;

        // Set the HTML inside the card
        card.innerHTML = `
            <div class="card-header">
                <h3>${item.name.toUpperCase()}</h3>
                <button class="delete-btn" onclick="deleteSub(${item.id})">×</button>
            </div>
            <p class="price-text">Monthly: KSh ${item.price}</p>
            <div class="big-cost">KSh ${item.unitCost}</div>
            <div class="badge">${item.status}</div>
        `;

        // Put the card on the screen
        container.appendChild(card);
    }
}

function deleteSub(idToDelete) {
    // Filter the list to keep everything EXCEPT the one we clicked
    mySubscriptions = mySubscriptions.filter(function (item) {
        return item.id !== idToDelete;
    });

    saveData();
    showCards();
}