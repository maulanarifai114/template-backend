import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as bcryptjs from 'bcryptjs';

dayjs.extend(utc);

function generateId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return `${dayjs().unix()}${result}`;
}
function hashPassword(password: string): string {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);
  return hash;
}

async function main() {
  //#region Role
  await prisma.role.createMany({
    skipDuplicates: true,
    data: [
      { Id: '1', Name: 'SUPERADMIN' },
      { Id: '2', Name: 'ADMIN' },
      { Id: '3', Name: 'USER' },
    ],
  });
  //#endregion

  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        Id: generateId(),
        FirstName: 'Super Admin',
        LastName: 'Template',
        Email: 'superadmin@template.com',
        Password: hashPassword('123456'),
        RoleId: '1',
      },
      {
        Id: generateId(),
        FirstName: 'Admin',
        LastName: 'Template',
        Email: 'admin@template.com',
        Password: hashPassword('123456'),
        RoleId: '2',
      },
      {
        Id: generateId(),
        FirstName: 'User',
        LastName: 'Template',
        Email: 'user@template.com',
        Password: hashPassword('123456'),
        RoleId: '3',
      },
    ],
  });

  console.log('Success seeding data!');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
