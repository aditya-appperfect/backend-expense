-- 1. List all employees and their departments by subquery 0.049 ms
EXPLAIN ANALYZE SELECT
	e.first_name || ' ' || e.last_name AS full_name, (
	SELECT d.department_name FROM departments d WHERE
		e.department_id = d.department_id
	)
FROM employees e
-- 1. List all employees and their departments by join 0.061 ms
EXPLAIN ANALYZE SELECT
	e.first_name || ' ' || e.last_name AS full_name, d.department_name
	FROM employees e JOIN departments d USING (department_id)


-- 2. Find employees who have a salary greater than $60,000 by subquery 0.082 ms
EXPLAIN ANALYZE SELECT 
	e.first_name || ' ' || e.last_name AS full_name
	FROM employees e
	WHERE e.employee_id = ANY (
		SELECT s.employee_id FROM salaries s WHERE s.salary > 60000
	)	
-- 2. Find employees who have a salary greater than $60,000 by join 0.050 ms
EXPLAIN ANALYZE SELECT e.first_name || ' ' || e.last_name AS full_name
	FROM employees e JOIN salaries s USING(employee_id)
	WHERE s.salary > 60000
	

-- 3. Count the number of employees in each department by subquery 0.059ms
EXPLAIN ANALYZE SELECT d.department_name, (
	SELECT COUNT(employee_id) FROM employees e WHERE e.department_id = d.department_id
	)
FROM departments d
-- 3. Count the number of employees in each department by join 0.100ms
EXPLAIN ANALYZE SELECT d.department_name, COUNT(employee_id)
	FROM employees e JOIN departments d USING (department_id)
	GROUP BY(d.department_name)


-- 4. Find the highest salary in each department by joins 0.169
EXPLAIN ANALYZE SELECT d.department_name, MAX(s.salary) 
	FROM employees e JOIN departments d USING (department_id) JOIN salaries s USING (employee_id)
		GROUP BY (department_name)


-- 5. Find employees who do not have a salary record by joins
EXPLAIN ANALYZE SELECT e.first_name || ' ' || e.last_name AS full_name 
	FROM employees e JOIN salaries s USING(employee_id)
		WHERE s.salary IS NULL
-- 5. Find employees who do not have a salary record by subqueries
EXPLAIN ANALYZE SELECT e.first_name || ' ' || e.last_name AS full_name 
	FROM employees e
		WHERE e.employee_id NOT IN (SELECT s.employee_id FROM salaries s  group by (s.employee_id))


-- 6. Find the employees who earn more than the average salary of their department by join
EXPLAIN ANALYZE (WITH deptAvgSal AS (
	SELECT d.department_id, AVG(s.salary) as avg_salary
		FROM salaries s JOIN employees e USING (employee_id) JOIN departments d USING (department_id)
			GROUP By (d.department_id)
)
SELECT e.first_name || ' ' || e.last_name AS full_name, s.salary, e.department_id
	FROM employees e JOIN salaries s using (employee_id) 
	JOIN deptAvgSal dp USING(department_id) where s.salary > dp.avg_salary)
-- 6. Find the employees who earn more than the average salary of their department by subquery
EXPLAIN ANALYZE (WITH deptAvgSal AS (
	SELECT d.department_id, AVG(s.salary) as avg_salary
		FROM salaries s JOIN employees e USING (employee_id) JOIN departments d USING (department_id)
			GROUP By (d.department_id)
)
SELECT e.first_name || ' ' || e.last_name AS full_name, s.salary, e.department_id
	FROM employees e JOIN salaries s using (employee_id) 
		WHERE s.salary > (SELECT avg_salary FROM deptAvgSal as dp WHERE e.department_id = dp.department_id))