import requests
import pytest
Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaXR5YUBnbWFpbC5jb20iLCJpYXQiOjE3MjQ3MzY1MDksImV4cCI6MTczMjUxMjUwOX0.KTV5ZNYYNJoIMvkgdJ29ZK8l0linvBG929WFkDFhC4I"
url = "http://localhost:3500/expenditure/"

@pytest.mark.parametrize(
    "Token, params, expected_status_code, expected_message",
    [
        (Token, "all", 200, None),
        (None, "all", 401, "You are not loged in please login"),
        (Token+"a", "all", 400, "Invalid Token"),
        (Token, "expense", 200, None),
        (Token, "expenses", 401, "Invalid query params"),
        (None, "some", 401, "You are not loged in please login"),
    ]
)
def test_get_expense(Token, params, expected_status_code, expected_message):
    response = requests.get(url, params={"tag":params} , headers={"Token": Token})
    assert response.status_code == expected_status_code
    data = response.json()
    if expected_message:
        assert data["message"] == expected_message
        
        
@pytest.mark.parametrize(
    "title, exptype, amount, Token, expected_message, expected_status_code",
    [
        ("Milk", "expenses", 50, Token, "Expense type must be either 'income' or 'expense'", None),
        (None, "expense", 50, Token, "Title is required", None),
        ("Fees", "expense", 5000, Token, None, 201),
    ]
)   
def test_add_expense(title, exptype, amount, Token, expected_message, expected_status_code):
    reqData = {
        "title": title,
        "exptype": exptype,
        "amount": amount
    }
    response = requests.post(url, json = reqData, headers={"Token": Token})
    data = response.json()
    if(expected_message):
        assert data["errors"][0]["msg"] == expected_message
    if(expected_status_code):
        assert response.status_code == expected_status_code
        
         
@pytest.mark.parametrize(
    "expenseid, Token, expected_status_code",
    [
        ("500", Token, 400),
        # ("21", Token, 200),
    ]
)          
def test_delete_expense(expenseid, Token, expected_status_code):
    reqData = {
       "expenseid":expenseid
    }
    response = requests.delete(url, json = reqData, headers={"Token": Token})
    data = response.json()
    assert response.status_code == expected_status_code