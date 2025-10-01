const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Simple query to check the connection
    const result = await prisma.$queryRaw`SELECT version();`;
    console.log('Connection successful!');
    console.log('PostgreSQL version:', result[0].version);

    // Check the number of records in tables
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.group.count(),
      prisma.account.count(),
      prisma.transaction.count(),
      prisma.category.count(),
      prisma.goal.count(),
      prisma.notification.count(),
    ]);

    console.log('Table statistics:');
    console.log(`Users: ${counts[0]}`);
    console.log(`Groups: ${counts[1]}`);
    console.log(`Accounts: ${counts[2]}`);
    console.log(`Transactions: ${counts[3]}`);
    console.log(`Categories: ${counts[4]}`);
    console.log(`Goals: ${counts[5]}`);
    console.log(`Notifications: ${counts[6]}`);

    // Check migrations
    const migrations = await prisma.$queryRaw`
            SELECT migration_name, finished_at 
            FROM _prisma_migrations 
            ORDER BY finished_at DESC;
        `;

    console.log('Applied migrations:');
    migrations.forEach((migration) => {
      console.log(`${migration.migration_name} (${migration.finished_at})`);
    });
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
