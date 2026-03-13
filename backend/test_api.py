import requests

url = "http://127.0.0.1:8000/api/review"
payload = {
    "language": "python",
    "code": "while(True): pass"
}
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
