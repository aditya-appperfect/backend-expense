import requests
import pytest
Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaXR5YUBnbWFpbC5jb20iLCJpYXQiOjE3MjQ3MzY1MDksImV4cCI6MTczMjUxMjUwOX0.KTV5ZNYYNJoIMvkgdJ29ZK8l0linvBG929WFkDFhC4I"
url = "http://localhost:3500/expenditure/"

@pytest.mark.parametrize(
    "Token, expected_status_code, expected_message",
    [
        (Token, 200, None),
        (None, 401, "You are not loged in please login"),
        (Token+"a", 400, "Invalid Token"),
    ]
)
def test_get_expense_withToken(Token, expected_status_code, expected_message):
    response = requests.get(url+"?tag=all", headers={"Token": Token})
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
def test_add_expense_incorrect_expType(title, exptype, amount, Token, expected_message, expected_status_code):
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
        
    
def test_delete_expense_incorrect():
    reqData = {
       "expenseid":"500"
    }
    response = requests.delete(url, json = reqData, headers={"Token": Token})
    data = response.json()
    assert response.status_code == 400
    assert data["status"] == "fail"
    
# ------> Make sure to put correct expenseid
# def test_delete_expense_correct():
#     reqData = {
#        "expenseid":"2"
#     }
#     response = requests.delete(url, json = reqData, headers={"Token": Token})
#     data = response.json()
#     assert response.status_code == 200
#     assert data["status"] == "success"