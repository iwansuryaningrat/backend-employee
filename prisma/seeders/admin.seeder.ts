import { faker } from '@faker-js/faker';
import { Role } from '@prisma/client';

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email({
  firstName,
  lastName,
}).toLowerCase();

export const adminSeeder = {
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
  role: Role.admin,
  created_at: new Date(),
  updated_at: new Date(),
}