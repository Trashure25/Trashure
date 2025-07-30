const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@trashure.com',
          username: 'admin',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          trustScore: 95,
          credits: 1000,
          avatarUrl: '/placeholder-user.jpg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'john@example.com',
          username: 'john_doe',
          password: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
          trustScore: 85,
          credits: 500,
          avatarUrl: '/placeholder-user.jpg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane@example.com',
          username: 'jane_smith',
          password: hashedPassword,
          firstName: 'Jane',
          lastName: 'Smith',
          trustScore: 78,
          credits: 750,
          avatarUrl: '/placeholder-user.jpg'
        }
      })
    ]);

    console.log('✅ Created users:', users.length);

    // Create sample listings
    const listings = await Promise.all([
      prisma.listing.create({
        data: {
          userId: users[1].id,
          title: 'Vintage Levi\'s 501 Jeans',
          description: 'Classic vintage Levi\'s 501 jeans in excellent condition. Perfect fit and authentic vintage wash.',
          category: 'Apparel',
          condition: 'Good',
          price: 85,
          brand: 'Levi\'s',
          size: '32/32',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      }),
      prisma.listing.create({
        data: {
          userId: users[1].id,
          title: 'Supreme Box Logo Hoodie',
          description: 'Rare Supreme box logo hoodie from 2018. Limited edition and highly sought after.',
          category: 'Apparel',
          condition: 'Like New',
          price: 450,
          brand: 'Supreme',
          size: 'L',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      }),
      prisma.listing.create({
        data: {
          userId: users[2].id,
          title: 'Louis Vuitton Neverfull Bag',
          description: 'Authentic Louis Vuitton Neverfull MM bag in monogram canvas. Includes dust bag.',
          category: 'Accessories',
          condition: 'Good',
          price: 1200,
          brand: 'Louis Vuitton',
          size: 'MM',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      }),
      prisma.listing.create({
        data: {
          userId: users[2].id,
          title: 'Nike Air Jordan 1 Retro High',
          description: 'Nike Air Jordan 1 Retro High OG in Chicago colorway. Size 10, excellent condition.',
          category: 'Footwear',
          condition: 'Like New',
          price: 350,
          brand: 'Nike',
          size: '10',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      }),
      prisma.listing.create({
        data: {
          userId: users[1].id,
          title: 'Vintage Denim Jacket',
          description: 'Authentic vintage denim jacket from the 80s. Perfect distressed look and great fit.',
          category: 'Apparel',
          condition: 'Good',
          price: 120,
          brand: 'Vintage',
          size: 'M',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      }),
      prisma.listing.create({
        data: {
          userId: users[2].id,
          title: 'Gucci Marmont Bag',
          description: 'Gucci Marmont small shoulder bag in black leather. Includes authenticity card.',
          category: 'Accessories',
          condition: 'New',
          price: 1800,
          brand: 'Gucci',
          size: 'Small',
          images: ['/placeholder.jpg'],
          status: 'active'
        }
      })
    ]);

    console.log('✅ Created listings:', listings.length);

    // Create some favorites
    await Promise.all([
      prisma.favorite.create({
        data: {
          userId: users[0].id,
          listingId: listings[0].id
        }
      }),
      prisma.favorite.create({
        data: {
          userId: users[0].id,
          listingId: listings[2].id
        }
      }),
      prisma.favorite.create({
        data: {
          userId: users[1].id,
          listingId: listings[3].id
        }
      })
    ]);

    console.log('✅ Created favorites');

    // Create a conversation
    const conversation = await prisma.conversation.create({
      data: {
        user1Id: users[0].id,
        user2Id: users[1].id,
        listingId: listings[0].id
      }
    });

    // Create some messages
    await Promise.all([
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: users[0].id,
          content: 'Hi! I\'m interested in the vintage Levi\'s. Is this still available?'
        }
      }),
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: users[1].id,
          content: 'Yes, it\'s still available! Would you like to make an offer?'
        }
      })
    ]);

    console.log('✅ Created conversations and messages');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log('- 3 users (admin, john_doe, jane_smith)');
    console.log('- 6 listings (vintage, luxury, streetwear)');
    console.log('- 3 favorites');
    console.log('- 1 conversation with messages');
    console.log('\n🔑 Login Credentials:');
    console.log('- Email: admin@trashure.com, Password: password123');
    console.log('- Email: john@example.com, Password: password123');
    console.log('- Email: jane@example.com, Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 