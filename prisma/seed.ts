import { Prisma, PrismaClient } from '@prisma/client';
import { employeesSeeder, adminSeeder } from './seeders';
import * as bcrypt from 'bcryptjs';

const hashPassword = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
};

const client = new PrismaClient();

async function seedTrx(prisma: Prisma.TransactionClient) {
  // const admin = await prisma.users.create({
  //   data: {
  //     ...adminSeeder,
  //     password: hashPassword(adminSeeder.password),
  //   },
  // });

  for (const employee of employeesSeeder) {
    const user = await prisma.users.create({
      data: {
        ...employee.userData,
        password: hashPassword(employee.userData.password),
      }
    });

    await prisma.employees.create({
      data: {
        userId: user.id,
        ...employee.employeeData
      }
    });
  }
}

function seed() {
  return client.$transaction((trx) => {
    return seedTrx(trx);
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });