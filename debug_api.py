import requests
import json

try:
    print("Sending GET request to http://localhost:3000/api/audits")
    response = requests.get("http://localhost:3000/api/audits")
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except:
        print("Response Text:")
        print(response.text)
except Exception as e:
    print(f"An error occurred: {e}")
