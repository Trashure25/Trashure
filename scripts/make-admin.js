// scripts/make-admin.js
// Script to make a user an admin

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function makeUserAdmin(username) {
  try {
    console.log(`Attempting to make user "${username}" an admin...`)
    
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user) {
      console.error(`❌ User "${username}" not found in the database`)
      return
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`Current role: ${user.role}`)

    if (user.role === 'admin') {
      console.log(`✅ User "${username}" is already an admin`)
      return
    }

    // Update the user's role to admin
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: { role: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    console.log(`✅ Successfully made "${username}" an admin!`)
    console.log(`Updated user: ${updatedUser.firstName} ${updatedUser.lastName}`)
    console.log(`New role: ${updatedUser.role}`)
    
  } catch (error) {
    console.error('❌ Error making user admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get username from command line argument
const username = process.argv[2]

if (!username) {
  console.error('❌ Please provide a username as an argument')
  console.log('Usage: node scripts/make-admin.js <username>')
  process.exit(1)
}

makeUserAdmin(username) 