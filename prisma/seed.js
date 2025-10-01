const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        passwordHash: 'hashed_password_1',
        name: 'John Smith',
        role: 'admin',
        birthdate: new Date('1985-05-15'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        passwordHash: 'hashed_password_2',
        name: 'Jane Doe',
        role: 'user',
        birthdate: new Date('1987-08-22'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'peter@example.com',
        passwordHash: 'hashed_password_3',
        name: 'Peter Johnson',
        role: 'user',
        birthdate: new Date('1990-12-10'),
      },
    }),
  ]);

  console.log('Created users:', users.length);

  // Create groups
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Smith Family',
        createdBy: users[0].id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Work Group',
        createdBy: users[2].id,
      },
    }),
  ]);

  console.log('Created groups:', groups.length);

  // Add users to groups
  const userGroups = await Promise.all([
    prisma.userGroup.create({
      data: {
        userId: users[0].id,
        groupId: groups[0].id,
        role: 'owner',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: users[1].id,
        groupId: groups[0].id,
        role: 'member',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: users[2].id,
        groupId: groups[1].id,
        role: 'owner',
      },
    }),
  ]);

  console.log('Created user-group relationships:', userGroups.length);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { title: 'Groceries', type: 'expense' },
    }),
    prisma.category.create({
      data: { title: 'Transport', type: 'expense' },
    }),
    prisma.category.create({
      data: { title: 'Entertainment', type: 'expense' },
    }),
    prisma.category.create({
      data: { title: 'Salary', type: 'income' },
    }),
    prisma.category.create({
      data: { title: 'Freelance', type: 'income' },
    }),
  ]);

  console.log('Created categories:', categories.length);

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        title: 'Main Account',
        type: 'checking',
        balance: 50000.0,
        currency: 'USD',
        userId: users[0].id,
        createdBy: users[0].id,
        groupId: groups[0].id,
      },
    }),
    prisma.account.create({
      data: {
        title: 'Savings Account',
        type: 'savings',
        balance: 150000.0,
        currency: 'USD',
        userId: users[1].id,
        createdBy: users[1].id,
        groupId: groups[0].id,
      },
    }),
    prisma.account.create({
      data: {
        title: 'Cash',
        type: 'cash',
        balance: 5000.0,
        currency: 'USD',
        userId: users[2].id,
        createdBy: users[2].id,
        groupId: groups[1].id,
      },
    }),
  ]);

  console.log('Created accounts:', accounts.length);

  // Link accounts to groups
  const accountGroups = await Promise.all([
    prisma.accountsGroup.create({
      data: {
        accountId: accounts[0].id,
        groupId: groups[0].id,
      },
    }),
    prisma.accountsGroup.create({
      data: {
        accountId: accounts[1].id,
        groupId: groups[0].id,
      },
    }),
    prisma.accountsGroup.create({
      data: {
        accountId: accounts[2].id,
        groupId: groups[1].id,
      },
    }),
  ]);

  console.log('Created account-group relationships:', accountGroups.length);

  // Create transactions
  const transactions = await Promise.all([
    // Incomes
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        groupId: groups[0].id,
        accountId: accounts[0].id,
        categoryId: categories[3].id, // Salary
        amount: 80000.0,
        date: new Date('2025-09-01'),
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[1].id,
        groupId: groups[0].id,
        accountId: accounts[1].id,
        categoryId: categories[4].id, // Freelance
        amount: 25000.0,
        date: new Date('2025-09-15'),
      },
    }),
    // Expenses
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        groupId: groups[0].id,
        accountId: accounts[0].id,
        categoryId: categories[0].id, // Groceries
        amount: -3500.0,
        date: new Date('2025-09-20'),
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[1].id,
        groupId: groups[0].id,
        accountId: accounts[0].id,
        categoryId: categories[1].id, // Transport
        amount: -1200.0,
        date: new Date('2025-09-22'),
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[2].id,
        groupId: groups[1].id,
        accountId: accounts[2].id,
        categoryId: categories[2].id, // Entertainment
        amount: -800.0,
        date: new Date('2025-09-25'),
      },
    }),
  ]);

  console.log('Created transactions:', transactions.length);

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        title: 'New Transaction',
        message: 'Spent $3500 on groceries',
        type: 'transaction',
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        title: 'Income Received',
        message: 'Received $25000 from freelance',
        type: 'income',
      },
    }),
  ]);

  console.log('Created notifications:', notifications.length);

  // Create goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Vacation in Turkey',
        description: 'Save money for a family vacation for two',
        targetAmount: 200000.0,
        currentAmount: 45000.0,
        targetDate: new Date('2025-07-01'),
        groupId: groups[0].id,
        createdBy: users[0].id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'New Laptop',
        description: 'Saving for a MacBook Pro for work',
        targetAmount: 150000.0,
        currentAmount: 75000.0,
        targetDate: new Date('2025-12-31'),
        groupId: groups[0].id,
        createdBy: users[1].id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Emergency Fund',
        description: 'Reserve for 6 months',
        targetAmount: 300000.0,
        currentAmount: 120000.0,
        targetDate: new Date('2026-06-01'),
        groupId: groups[1].id,
        createdBy: users[2].id,
      },
    }),
  ]);

  console.log('Created goals:', goals.length);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
