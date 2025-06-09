import { faker } from '@faker-js/faker';
import { Role } from '@prisma/client';

function getRandomInt(min: number = 10, max: number = 30): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateEmployee = (num: number) => {
  let employees = [];
  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    }).toLowerCase();

    employees.push({
      userData: {
        email,
        password: email,
        name: faker.person.fullName({
          firstName,
          lastName,
        }),
        username: faker.internet.username({
          firstName,
          lastName,
        }).toLowerCase(),
        role: Role.employee,
        created_at: new Date(),
        updated_at: new Date(),
      },
      employeeData: {
        position: faker.person.jobTitle(),
        department: faker.commerce.department(),
        salary: getRandomInt() * 10e6
      }
    })
  }
  return employees;
}

export const employeesSeeder = generateEmployee(100);