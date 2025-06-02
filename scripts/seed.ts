import { seedAdmin } from '../lib/seed'

async function main() {
  try {
    await seedAdmin()
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

main() 