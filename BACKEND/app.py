from flask import Flask, request, jsonify, render_template

app = Flask(_name_)

expenses = []
current_id = 0

@app.route("/")
def index():
    return render_template("index.html")

# ---------- READ (cu filtrare + căutare) ----------
@app.route("/api/expenses", methods=["GET"])
def get_expenses():
    category = request.args.get("category")
    search = request.args.get("search", "").lower()

    result = expenses

    if category and category != "Toate":
        result = [e for e in result if e["category"] == category]

    if search:
        result = [e for e in result if search in e["category"].lower()]

    return jsonify(result)

# ---------- CREATE ----------
@app.route("/api/expenses", methods=["POST"])
def add_expense():
    global current_id
    data = request.json

    expense = {
        "id": current_id,
        "amount": float(data["amount"]),
        "category": data["category"],
        "date": data["date"],
        "time": data["time"]
    }

    expenses.append(expense)
    current_id += 1

    return jsonify(expense), 201

# ---------- UPDATE ----------
@app.route("/api/expenses/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):
    data = request.json
    for e in expenses:
        if e["id"] == expense_id:
            e["amount"] = float(data["amount"])
            e["category"] = data["category"]
            return jsonify(e)
    return jsonify({"error": "Not found"}), 404

# ---------- DELETE ----------
@app.route("/api/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    global expenses
    expenses = [e for e in expenses if e["id"] != expense_id]
    return jsonify({"success": True})

if _name_ == "_main_":
    app.run(debug=True)