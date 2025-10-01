const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      passwordHash: 'hashed_password_here',
      name: 'John Doe',
      role: 'admin',
      birthdate: new Date('1990-01-01'),
    },
  });

  console.log('Created user:', user);

  // Create group
  const group = await prisma.group.create({
    data: {
      name: 'Ivanov Family',
      createdBy: user.id,
    },
  });

  console.log('Created group:', group);

  // Add user to group
  const userGroup = await prisma.userGroup.create({
    data: {
      userId: user.id,
      groupId: group.id,
      role: 'owner',
    },
  });

  // Create category
  const category = await prisma.category.create({
    data: {
      title: 'Groceries',
      type: 'expense',
    },
  });

  // Create account
  const account = await prisma.account.create({
    data: {
      title: 'Main Account',
      type: 'checking',
      balance: 1000.0,
      currency: 'RUB',
      userId: user.id,
      createdBy: user.id,
      groupId: group.id,
    },
  });

  // Link account to group
  await prisma.accountsGroup.create({
    data: {
      accountId: account.id,
      groupId: group.id,
    },
  });

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      groupId: group.id,
      accountId: account.id,
      categoryId: category.id,
      amount: -150.5,
      date: new Date(),
    },
  });

  console.log('Created transaction:', transaction);

  // Create notification
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'New Transaction',
      message: 'A new transaction for 150.50 RUB has been created.',
      type: 'transaction',
    },
  });

  // Create goal
  const goal = await prisma.goal.create({
    data: {
      title: 'Vacation in Turkey',
      description: 'Save money for a family vacation',
      targetAmount: 100000.0,
      currentAmount: 15000.0,
      targetDate: new Date('2025-07-01'),
      groupId: group.id,
      createdBy: user.id,
    },
  });

  console.log('Created goal:', goal);

  // Update account balance
  await prisma.account.update({
    where: { id: account.id },
    data: {
      balance: {
        decrement: Math.abs(transaction.amount),
      },
    },
  });

  // Get all user data with related entities
  const userWithData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      userGroups: {
        include: {
          group: true,
        },
      },
      transactions: {
        include: {
          account: true,
          category: true,
          group: true,
        },
        orderBy: { date: 'desc' },
      },
      accounts: {
        include: {
          accountsGroups: {
            include: {
              group: true,
            },
          },
        },
      },
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
      },
      createdGoals: {
        include: {
          group: true,
        },
      },
    },
  });

  console.log('User with all data:', JSON.stringify(userWithData, null, 2));

  // Get group statistics
  const groupStats = await prisma.group.findUnique({
    where: { id: group.id },
    include: {
      userGroups: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      transactions: {
        include: {
          category: true,
        },
      },
      goals: true,
      _count: {
        select: {
          userGroups: true,
          transactions: true,
          goals: true,
        },
      },
    },
  });

  console.log('Group statistics:', JSON.stringify(groupStats, null, 2));
}

main()
  .catch((e) => {
    console.error('Error:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
