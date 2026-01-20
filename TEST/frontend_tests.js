function testTotalCalculation() {
    const expenses = [
        { amount: 10 },
        { amount: 20 },
        { amount: 30 }
    ];

    let total = 0;
    expenses.forEach(e => total += e.amount);

    console.assert(total === 60, "Total calculation failed");
}

function testInvalidAmount() {
    const amount = -10;
    console.assert(amount <= 0, "Invalid amount accepted");
}

testTotalCalculation();
testInvalidAmount();
