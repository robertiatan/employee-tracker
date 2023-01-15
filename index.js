// Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const figlet = require("figlet");
require("console.table");
require("dotenv").config();

// Create connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Articor129!",
  database: "employee_DB",
});

// Error handling
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

// Function to start the application
const start = () => {
  figlet("Employee Tracker", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  });
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
        "Remove Role",
        "Remove Department",
        "Update Employee Role",
        "Update Employee Manager",
        "View Employees by Manager",
        "View Employees by Department",
        "View Total Utilized Budget of a Department",
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

        case "Remove Role":
          removeRole();
          break;

        case "Remove Department":
          removeDepartment();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "View Employees by Manager":
          viewEmployeesByManager();
          break;

        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;

        case "View Total Utilized Budget of a Department":
          viewTotalUtilizedBudget();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
};

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
    const roleList = [
      {
        name: "Sales Lead",
        value: 1,
      },
      {
        name: "Salesperson",
        value: 2,
      },
      {
        name: "Lead Engineer",
        value: 3,
      },
      {
        name: "Software Engineer",
        value: 4,
      },
      {
        name: "Account Manager",
        value: 5,
      },
      {
        name: "Accountant",
        value: 6,
      },
      {
        name: "Legal Team Lead",
        value: 7,
      },
      {
        name: "Lawyer",
        value: 8,
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
          role_id: role,
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
    const roleList = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
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
        `UPDATE employee SET role_id = ? WHERE id = ?`,
        [role, employee],
        (err, res) => {
          if (err) throw err;
          console.log("Employee updated successfully!");
          start();
        }
      );
    });
  });
};

// BONUS Functions

// Function to update an employee's manager
updateEmployeeManager = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const newEmployee = [
      {
        name: "None",
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
        type: "list",
        name: "Employee",
        choices: employees,
        message: "Which employee would you like to update?",
      },
      {
        type: "list",
        name: "Manager",
        choices: employeeList,
        message: "Who is the employee's new manager?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const employee = answers.Employee;
      const manager = answers.Manager;
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ manager_id: manager }, { id: employee }],
        (err, res) => {
          if (err) throw err;
          console.log("Employee updated successfully!");
          start();
        }
      );
    });
  });
};

// Function to view employees by manager
viewEmployeesByManager = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const newEmployee = [
      {
        name: "None",
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
        type: "list",
        name: "Manager",
        choices: employeeList,
        message: "Which manager would you like to view?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const manager = answers.Manager;
      connection.query(
        "SELECT * FROM employee WHERE ?",
        { manager_id: manager },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
  });
};

// Function to view employees by department
viewEmployeesByDepartment = async () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    let query = [
      {
        type: "list",
        name: "Department",
        choices: departments,
        message: "Which department would you like to view?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const department = answers.Department;
      connection.query(
        "SELECT * FROM role WHERE ?",
        { department_id: department },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
  });
};

// Function to view the total utilized budget of a department
viewTotalUtilizedBudget = async () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    let query = [
      {
        type: "list",
        name: "Department",
        choices: departments,
        message: "Which department would you like to view?",
      },
    ];
    inquirer.prompt(query).then((answers) => {
      const roles = answers.Department;
      connection.query(
        "SELECT * FROM role WHERE ?",
        { department_id: roles },
        (err, res) => {
          if (err) throw err;
          let total = 0;
          res.forEach((employee) => {
            total += employee.salary
              ? parseInt(employee.salary)
              : parseInt(employee.salary);
          });
          console.log(`Total budget: $${total}`);
          start();
        }
      );
    });
  });
};

// Function to remove a department, role, or employee
removeDepartment = async () => {
  let query = [
    {
      type: "input",
      name: "Department",
      message: "What is the department ID?",
    },
  ];

  const answers = await inquirer.prompt(query);
  const department = answers.Department;

  connection.query(
    "DELETE FROM department WHERE ?",
    { id: department },
    (err, res) => {
      if (err) throw err;
      console.log("Department removed successfully!");
      start();
    }
  );
};

removeRole = async () => {
  let query = [
    {
      type: "input",
      name: "Role",
      message: "What is the role ID?",
    },
  ];

  const answers = await inquirer.prompt(query);
  const role = answers.Role;

  connection.query("DELETE FROM role WHERE ?", { id: role }, (err, res) => {
    if (err) throw err;
    console.log("Role removed successfully!");
    start();
  });
};

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
