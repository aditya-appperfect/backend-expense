import requests
import pytest

@pytest.mark.parametrize(
    "email, password, expected_status_code, expected_status, expected_message",
    [
        ("aditya@gmail.com", "123", 200, "success", None),
        ("aditya@gmail.com", "1234", 400, "fail", "Email or password is incorrect"),
        ("adityabhat@gmail.com", "123", 400, "fail", "Email dosen't exists"),
    ]
)
def test_login(email, password, expected_status_code, expected_status, expected_message):
    url = "http://localhost:3500/auth/login"
    data = {"email": email, "pass": password}
    response = requests.post(url, json=data)
    assert response.status_code == expected_status_code
    data = response.json()
    assert data["status"] == expected_status
    if expected_message:
        assert data["message"] == expected_message
        
        

@pytest.mark.parametrize(
    "email, password, expected_status_code, expected_status, expected_message",
    [
        # ("aditya14@gmail.com", "123", 201, "success", None),
        ("aditya@gmail.com", "123", 400, "fail", "Email already exists"),
    ]
)
def test_signup(email, password, expected_status_code, expected_status, expected_message):
    url = "http://localhost:3500/auth/signup"
    data = {"email": email, "pass": password}
    response = requests.post(url, json=data)
    assert response.status_code == expected_status_code
    data = response.json()
    assert data["status"] == expected_status
    if expected_message:
        assert data["message"] == expected_message
    if expected_status_code == 201:
        assert data["Token"] != ""