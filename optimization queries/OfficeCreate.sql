CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT,
    hire_date DATE
);

CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50)
);

CREATE TABLE salaries (
    employee_id INT,
    salary DECIMAL(10, 2),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO employees (employee_id, first_name, last_name, department_id, hire_date) VALUES
(1, 'John', 'Doe', 1, '2020-01-15'),
(2, 'Jane', 'Smith', 1, '2019-03-22'),
(3, 'Emily', 'Jones', 2, '2021-06-30'),
(4, 'Michael', 'Brown', 2, '2018-07-01'),
(5, 'Alice', 'Johnson', 3, '2022-09-15');

INSERT INTO employees (employee_id, first_name, last_name, department_id, hire_date) VALUES
(6, 'Harsh', 'Bachani', 3, '2022-09-15');

INSERT INTO departments (department_id, department_name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'HR');

INSERT INTO salaries (employee_id, salary) VALUES
(1, 50000.00),
(2, 55000.00),
(3, 60000.00),
(4, 65000.00),
(5, 70000.00);


CREATE INDEX idx_employee_department ON employees(department_id);
CREATE INDEX idx_employee_hire_date ON employees(hire_date);
CREATE INDEX idx_salary_employee ON salaries(employee_id);
CREATE INDEX idx_department_name ON departments(department_name);