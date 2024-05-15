import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });

console.log('Migration complete');
