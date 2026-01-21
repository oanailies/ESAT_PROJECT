
// UI
function updateUI(expenses) {
  const ul = document.getElementById("expense-list");
  const totalEl = document.getElementById("total");

  ul.innerHTML = "";

  let total = 0;

  expenses.forEach((e) => {
    // sumare valori
    total += Number(e.amount) || 0;

    // rand in lista (exact cum ai deja, poți păstra template-ul tău)
    ul.innerHTML += `
      <li>
        <div>
          <strong>${e.category}</strong>
          <small>${e.date} • ${e.time}</small>
        </div>
        <div class="right">
          ${Number(e.amount).toFixed(2)} RON
          <button onclick='editExpense(${JSON.stringify(e)})'>✎</button>
          <button onclick="deleteExpense(${e.id})">✕</button>
        </div>
      </li>
    `;
  });

  // format cu 2 zecimale
  totalEl.innerText = total.toFixed(2);
}

// READ (la fiecare încărcare/filtrare se recalculează totalul)
function loadExpenses() {
  const filter = document.getElementById("filter").value;
  const search = document.getElementById("search").value;

  fetch(`/api/expenses?category=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}`)
    .then((res) => res.json())
    .then(updateUI);
}

// CREATE + UPDATE (după fiecare modificare se reîncarcă lista → totalul se actualizează)
function submitExpense() {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const now = new Date();

  if (!amount || Number(amount) <= 0) return alert("Sumă invalidă");

  const expense = {
    amount: Number(amount),
    category,
    date: now.toLocaleDateString("ro-RO"),
    time: now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
  };

  if (editingId === null) {
    fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    }).then(loadExpenses);
  } else {
    fetch(`/api/expenses/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    }).then(() => {
      editingId = null;
      loadExpenses();
    });
  }

  document.getElementById("amount").value = "";
}

// DELETE (după ștergere se reîncarcă lista → totalul se actualizează)
function deleteExpense(id) {
  fetch(`/api/expenses/${id}`, { method: "DELETE" }).then(loadExpenses);
}
