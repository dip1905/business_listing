import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({ log: ["info", "query", "warn", "error"] });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@businesslisting.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@businesslisting.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  // Create a test business owner
  const ownerPassword = await hash('owner123', 12);
  
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Test Business Owner',
      email: 'owner@example.com',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  console.log('✅ Test owner created:', {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
  });

  // Create a test user
  const userPassword = await hash('user123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Test user created:', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@businesslisting.com / admin123');
  console.log('Owner: owner@example.com / owner123');
  console.log('User: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });