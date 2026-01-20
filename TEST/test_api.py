import json
import pytest
from app import app

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client


def test_add_expense(client):
    response = client.post(
        "/api/expenses",
        data=json.dumps({
            "amount": 100,
            "category": "Mâncare",
            "date": "01.01.2026",
            "time": "12:00"
        }),
        content_type="application/json"
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["amount"] == 100
    assert data["category"] == "Mâncare"


def test_get_expenses(client):
    response = client.get("/api/expenses")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)


def test_filter_by_category(client):
    response = client.get("/api/expenses?category=Mâncare")
    assert response.status_code == 200
    for e in response.get_json():
        assert e["category"] == "Mâncare"


def test_update_expense(client):
    # Add expense first
    post = client.post(
        "/api/expenses",
        data=json.dumps({
            "amount": 50,
            "category": "Transport",
            "date": "01.01.2026",
            "time": "13:00"
        }),
        content_type="application/json"
    )

    expense_id = post.get_json()["id"]

    # Update expense
    response = client.put(
        f"/api/expenses/{expense_id}",
        data=json.dumps({
            "amount": 75,
            "category": "Transport"
        }),
        content_type="application/json"
    )

    assert response.status_code == 200
    assert response.get_json()["amount"] == 75


def test_delete_expense(client):
    post = client.post(
        "/api/expenses",
        data=json.dumps({
            "amount": 30,
            "category": "Altele",
            "date": "01.01.2026",
            "time": "14:00"
        }),
        content_type="application/json"
    )

    expense_id = post.get_json()["id"]

    response = client.delete(f"/api/expenses/{expense_id}")
    assert response.status_code == 200
