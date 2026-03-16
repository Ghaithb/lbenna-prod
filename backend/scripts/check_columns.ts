import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Checking Database Schema ---');
    
    // Check columns of 'users' table in PostgreSQL
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    console.log('Columns in "users" table:');
    console.table(result);
    
    const hasName = (result as any[]).some(col => col.column_name === 'name');
    if (hasName) {
      console.log('✅ Column "name" found!');
    } else {
      console.log('❌ Column "name" NOT found!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
