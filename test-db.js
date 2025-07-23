const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Count existing users
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);
    
    // List all users (without passwords for security)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        trustScore: true,
        createdAt: true
      }
    });
    
    if (users.length > 0) {
      console.log('\n👥 Users in database:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Trust Score: ${user.trustScore}`);
      });
    } else {
      console.log('\n📭 No users found in database');
    }
    
    // Test creating a user
    console.log('\n🧪 Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        username: `testuser-${Date.now()}`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User',
        trustScore: 75
      }
    });
    
    console.log(`✅ Test user created: ${testUser.firstName} ${testUser.lastName} (${testUser.email})`);
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 This usually means:');
      console.log('   - Your DATABASE_URL in .env is incorrect');
      console.log('   - Your Supabase project is paused');
      console.log('   - Network connectivity issues');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 