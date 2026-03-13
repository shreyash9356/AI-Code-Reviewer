from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_analyze_endpoint():
    payload = {"language": "python", "code": "x = None\nif x == None:\n    pass"}
    resp = client.post("/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["language"] == "python"
    assert "logical_issues" in data

