import requests

def test_login_correct():
    url = "http://localhost:3500/auth/login"
    data = {"email": "aditya@gmail.com", "pass": "123" }
    response = requests.post(url, json= data)
    assert response.status_code == 200 
    data = response.json()
    assert data["status"] == "success"

def test_login_incorrect():
    url = "http://localhost:3500/auth/login"
    data = {"email": "aditya@gmail.com", "pass": "1234" }
    response = requests.post(url, json= data)
    assert response.status_code == 400 
    data = response.json()
    assert data["status"] == "fail"
    assert data["message"] == "Email or password is incorrect"

def test_login_wrongEmail():
    url = "http://localhost:3500/auth/login"
    data = {"email": "adityabhat@gmail.com", "pass": "123" }
    response = requests.post(url, json = data)
    assert response.status_code == 400 
    data = response.json()
    assert data["status"] == "fail"
    assert data["message"] == "Email dosen't exists"
    
# ----->Data get posts in database
# def test_signup_correct():
#     url = "http://localhost:3500/auth/signup"
#     data = {"email": "aditya14@gmail.com", "pass": "123"}
#     response = requests.post(url, json = data)
#     assert response.status_code == 201 
#     data = response.json()
#     assert data["status"] == "success"
#     assert data["Token"] != ""

    
def test_signup_existingEmail():
    url = "http://localhost:3500/auth/signup"
    data = {"email": "aditya@gmail.com", "pass": "123"}
    response = requests.post(url, json = data)
    assert response.status_code == 400 
    data = response.json()
    assert data["status"] == "fail"
    assert data["message"] == "Email already exists"
