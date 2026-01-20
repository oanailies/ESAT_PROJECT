const categories = [
    "Mâncare", "Transport", "Utilități", "Chirie", "Rate",
    "Distracție", "Educație", "Sănătate", "Îmbrăcăminte",
    "Electronice", "Abonamente", "Sport", "Călătorii",
    "Cadouri", "Animale", "Copii", "Întreținere casă",
    "Asigurări", "Taxe", "Altele"
];

let editingId = null;

/* INIT */
function initCategories() {
    const cat = document.getElementById("category");
    const filter = document.getElementById("filter");

    categories.forEach(c => {
        cat.innerHTML += <option value="${c}">${c}</option>;
        filter.innerHTML += <option value="${c}">${c}</option>;
    });
}

/* READ */
function loadExpenses() {
    const filter = document.getElementById("filter").value;
    const search = document.getElementById("search").value;

    fetch(/api/expenses?category=${filter}&search=${search})
        .then(res => res.json())
        .then(updateUI);
}

/* CREATE + UPDATE */
function submitExpense() {
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const now = new Date();

    if (!amount || amount <= 0) return alert("Sumă invalidă");

    const expense = {
        amount,
        category,
        date: now.toLocaleDateString("ro-RO"),
        time: now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })
    };

    if (editingId === null) {
        fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        }).then(loadExpenses);
    } else {
        fetch(/api/expenses/${editingId}, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        }).then(() => {
            editingId = null;
            loadExpenses();
        });
    }

    document.getElementById("amount").value = "";
}

/* EDIT */
function editExpense(e) {
    document.getElementById("amount").value = e.amount;
    document.getElementById("category").value = e.category;
    editingId = e.id;
}

/* DELETE */
function deleteExpense(id) {
    fetch(/api/expenses/${id}, { method: "DELETE" })
        .then(loadExpenses);
}

/* UI */
function updateUI(expenses) {
    const ul = document.getElementById("expense-list");
    ul.innerHTML = "";
    let total = 0;

    expenses.forEach(e => {
        total += e.amount;
        ul.innerHTML += `
            <li>
                <div>
                    <strong>${e.category}</strong>
                    <small>${e.date} • ${e.time}</small>
                </div>
                <div class="right">
                    ${e.amount.toFixed(2)} RON
                    <button onclick='editExpense(${JSON.stringify(e)})'>✎</button>
                    <button onclick="deleteExpense(${e.id})">✕</button>
                </div>
            </li>
        `;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

/* START */
window.onload = () => {
    initCategories();
    loadExpenses();
};