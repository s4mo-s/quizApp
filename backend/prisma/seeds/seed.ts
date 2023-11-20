import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'Seeder' },
    update: {},
    create: {
      username: 'Seeder',
      password: '123',
      email: 'seeder@gmail.com',
      regDate: '2023-12-30T12:45:00.000Z',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
