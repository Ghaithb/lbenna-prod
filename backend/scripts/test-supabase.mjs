import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`❌ Variable manquante: ${name}`);
    console.error('   Lance depuis prod/backend avec un fichier .env configuré.');
    process.exit(1);
  }
  return v;
}

const prisma = new PrismaClient();

async function testDatabase() {
  const row = await prisma.$queryRaw`SELECT 1 as ok`;
  const partners = await prisma.partner.count();
  return { row, partners };
}

async function testStorage() {
  const url = requireEnv('SUPABASE_URL');
  const key = requireEnv('SUPABASE_KEY');
  const bucket = process.env.SUPABASE_BUCKET || 'portfolio';

  const supabase = createClient(url, key);
  const { data, error } = await supabase.storage.from(bucket).list('', { limit: 5 });
  if (error) throw error;
  return { bucket, fileCount: data?.length ?? 0, files: data?.map((f) => f.name) ?? [] };
}

async function main() {
  console.log('=== Test Supabase ===\n');

  try {
    const db = await testDatabase();
    console.log('✅ Base de données (PostgreSQL)');
    console.log('   SELECT 1:', db.row);
    console.log('   Nombre de partenaires:', db.partners);
  } catch (e) {
    console.error('❌ Base de données:', e.message);
    process.exitCode = 1;
  }

  try {
    const st = await testStorage();
    console.log('\n✅ Storage Supabase');
    console.log('   Bucket:', st.bucket);
    console.log('   Fichiers (racine):', st.fileCount, st.files.length ? `→ ${st.files.join(', ')}` : '(vide)');
  } catch (e) {
    console.error('\n❌ Storage:', e.message);
    process.exitCode = 1;
  }

  await prisma.$disconnect();
  console.log('\n=== Fin ===');
}

main();
