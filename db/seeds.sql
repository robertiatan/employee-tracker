INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Accounting'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Sales Person', 80000, 1),
('Lead Engineer', 150000, 2), 
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3), 
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mickey', 'Mouse', 1, 1),
('Donald', 'Duck', 2, null),
('Minnie', 'Mouse', 3, 2),
('Goofy', 'Goof', 4, null),
('Daisy', 'Duck', 5, 3),
('Pluto', 'Dog', 6, null),
('Bugs', 'Bunny', 7, 4),
('Lightning', 'McQueen', 8, null);