// Dependencies
require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");

// Create connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_DB",
});

// Error handling
connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  figlet("Employee Tracker", (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    start();
  });
});

// Function to start the application
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Remove Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// Function to view all employees
const getEmployees = (table) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

const viewAllEmployees = async () => {
  const employees = await getEmployees();
  console.table(employees);
  start();
};

// Function to view all departments
const getDepartments = (table) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

const viewAllDepartments = async () => {
  const departments = await getDepartments();
  console.table(departments);
  start();
};

// Function to view all roles
const getRoles = (table) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

const viewAllRoles = async () => {
  const roles = await getRoles();
  console.table(roles);
  start();
};

// Function to add a new employee
const addEmployee = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const newEmployee = [
      {
        name: "New",
        value: 0,
      },
    ];
    const employees = res.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    const employeeList = newEmployee.concat(employees);
    let query = [
      {
        type: "input",
        name: "FirstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "LastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "Role",
        choices: roleList,
        message: "What is the employee's role?",
      },
      {
        type: "list",
        name: "ManagerID",
        choices: employeeList,
        message: "Who is the employee's manager?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const firstName = answers.FirstName;
      const lastName = answers.LastName;
      const role = answers.Role;
      const manager = answers.ManagerID;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: firstName,
          last_name: lastName,
          role: role,
          manager_id: manager,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully!");
          start();
        }
      );
    });
  });
};

// Function to add new department
const addDepartment = async () => {
  let query = [
    {
      type: "input",
      name: "Department",
      message: "What is the department name?",
    },
  ];

  const answers = await inquirer.prompt(query);
  const department = answers.Department;

  connection.query(
    "INSERT INTO department SET ?",
    { name: department },
    (err, res) => {
      if (err) throw err;
      console.log("Department added successfully!");
      start();
    }
  );
};

// Function to add new role
const addRole = async () => {
  let query = [
    {
      type: "input",
      name: "Role",
      message: "What is the role name?",
    },
    {
      type: "input",
      name: "Salary",
      message: "What is the salary for this role?",
    },
    {
      type: "input",
      name: "Department",
      message: "What is the department ID for this role?",
    },
  ];

  const answers = await inquirer.prompt(query);
  const role = answers.Role;
  const salary = answers.Salary;
  const department = answers.Department;

  connection.query(
    "INSERT INTO role SET ?",
    { title: role, salary: salary, department_id: department },
    (err, res) => {
      if (err) throw err;
      console.log("Role added successfully!");
      start();
    }
  );
};

// Function to remove an employee
const removeEmployee = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    let query = [
      {
        type: "list",
        name: "Employee",
        choices: employees,
        message: "Which employee would you like to remove?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const employee = answers.Employee;
      connection.query(
        "DELETE FROM employee WHERE ?",
        { id: employee },
        (err, res) => {
          if (err) throw err;
          console.log("Employee removed successfully!");
          start();
        }
      );
    });
  });
};

// Function to update an employee's role
const updateEmployeeRole = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    let query = [
      {
        type: "list",
        name: "Employee",
        choices: employees,
        message: "Which employee would you like to update?",
      },
      {
        type: "list",
        name: "Role",
        choices: roleList,
        message: "What is the employee's new role?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const employee = answers.Employee;
      const role = answers.Role;
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ role: role }, { id: employee }],
        (err, res) => {
          if (err) throw err;
          console.log("Employee updated successfully!");
          start();
        }
      );
    });
  });
};
