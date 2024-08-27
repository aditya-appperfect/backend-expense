import requests
Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaXR5YUBnbWFpbC5jb20iLCJpYXQiOjE3MjQ3MzY1MDksImV4cCI6MTczMjUxMjUwOX0.KTV5ZNYYNJoIMvkgdJ29ZK8l0linvBG929WFkDFhC4I"
url = "http://localhost:3500/expenditure/"

def test_get_expense_withToken():
    response = requests.get(url+"?tag=all", headers={"Token": Token})
    assert response.status_code == 200

def test_get_expense_withoutToken():
    response = requests.get(url+"?tag=all")
    assert response.status_code == 401
    data = response.json()
    assert data["message"] == "You are not loged in please login"

def test_get_expense_wrongToken():
    response = requests.get(url+"?tag=all", headers={"Token": Token+"a"})
    assert response.status_code == 400
    data = response.json()
    assert data["message"] == "Invalid Token"
    
def test_add_expense_incorrect_expType():
    reqData = {
        "title": "Milk",
        "exptype": "expenses",
        "amount": 50
    }
    response = requests.post(url, json = reqData, headers={"Token": Token})
    data = response.json()
    assert data["errors"][0]["msg"] == "Expense type must be either 'income' or 'expense'"
    
def test_add_expense_empty_title():
    reqData = {
        "exptype": "expenses",
        "amount": 50
    }
    response = requests.post(url, json = reqData, headers={"Token": Token})
    data = response.json()
    assert data["errors"][0]["msg"] == "Title is required"
    
def test_add_expense_correct():
    reqData = {
        "title": "Fees",
        "exptype": "expense",
        "amount": 5000
    }
    response = requests.post(url, json = reqData, headers={"Token": Token})
    data = response.json()
    assert response.status_code == 201
    assert data["status"] == "success"