import { PrismaClient, UserRole } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || "Admin User"

  if (!email || !password) {
    console.error("Usage: ts-node scripts/create-admin.ts <email> <password> [name]")
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      // Update to admin
      const hashedPassword = await hash(password, 12)
      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: UserRole.ADMIN,
          password: hashedPassword,
        },
      })
      console.log(`✅ User ${email} updated to ADMIN role`)
      console.log(`User ID: ${updated.id}`)
    } else {
      // Create new admin user
      const hashedPassword = await hash(password, 12)
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          password: hashedPassword,
          role: UserRole.ADMIN,
        },
      })
      console.log(`✅ Admin user created successfully!`)
      console.log(`Email: ${user.email}`)
      console.log(`User ID: ${user.id}`)
      console.log(`Role: ${user.role}`)
    }
  } catch (error: any) {
    console.error("Error creating admin:", error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

