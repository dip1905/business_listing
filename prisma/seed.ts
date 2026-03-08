import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const categories = [
  {
    name: "Food & Dining",
    icon: "🍽",
    children: [
      { name: "Restaurants", icon: "🍛" },
      { name: "Cafes", icon: "☕" },
      { name: "Fast Food", icon: "🍔" },
      { name: "Street Food", icon: "🌮" },
      { name: "Bakeries", icon: "🥐" },
      { name: "Sweet Shops", icon: "🍬" },
      { name: "Cloud Kitchens", icon: "📦" },
      { name: "Juice & Shake Centers", icon: "🥤" },
      { name: "Tiffin Services", icon: "🍱" },
      { name: "Bars & Pubs", icon: "🍺" },
    ],
  },
  {
    name: "Hospitality",
    icon: "🏨",
    children: [
      { name: "Hotels", icon: "🏨" },
      { name: "Lodges", icon: "🛏" },
      { name: "Resorts", icon: "🌴" },
      { name: "Guest Houses", icon: "🏠" },
      { name: "Homestays", icon: "🏡" },
    ],
  },
  {
    name: "Health & Wellness",
    icon: "🏥",
    children: [
      { name: "Hospitals", icon: "🏥" },
      { name: "Clinics", icon: "🩺" },
      { name: "Dentists", icon: "🦷" },
      { name: "Diagnostic Centers", icon: "🔬" },
      { name: "Medical Stores", icon: "💊" },
      { name: "Gyms", icon: "💪" },
      { name: "Yoga Centers", icon: "🧘" },
      { name: "Physiotherapy", icon: "🦴" },
      { name: "Ayurvedic Clinics", icon: "🌿" },
    ],
  },
  {
    name: "Shopping & Daily Needs",
    icon: "🛍",
    children: [
      { name: "Grocery Stores", icon: "🛒" },
      { name: "Supermarkets", icon: "🏪" },
      { name: "Dairy Shops", icon: "🥛" },
      { name: "Clothing Stores", icon: "👗" },
      { name: "Footwear Shops", icon: "👟" },
      { name: "Electronics Shops", icon: "📺" },
      { name: "Mobile Stores", icon: "📱" },
      { name: "Furniture Stores", icon: "🛋" },
      { name: "Jewelry Stores", icon: "💍" },
      { name: "Hardware Stores", icon: "🔧" },
    ],
  },
  {
    name: "Home & Repair Services",
    icon: "🔧",
    children: [
      { name: "Plumbers", icon: "🚿" },
      { name: "Electricians", icon: "⚡" },
      { name: "Carpenters", icon: "🪚" },
      { name: "Painters", icon: "🖌" },
      { name: "AC Repair & Service", icon: "❄️" },
      { name: "Appliance Repair", icon: "🔌" },
      { name: "RO Service", icon: "💧" },
      { name: "Pest Control", icon: "🐛" },
    ],
  },
  {
    name: "Automotive & Transport",
    icon: "🚗",
    children: [
      { name: "Car Service Centers", icon: "🔩" },
      { name: "Bike Repair Shops", icon: "🏍" },
      { name: "Car Wash", icon: "🚿" },
      { name: "Tyre Shops", icon: "⭕" },
      { name: "Petrol Pumps", icon: "⛽" },
      { name: "EV Charging Stations", icon: "🔋" },
      { name: "Taxi Services", icon: "🚕" },
    ],
  },
  {
    name: "Beauty & Personal Care",
    icon: "💄",
    children: [
      { name: "Beauty Parlours", icon: "💅" },
      { name: "Hair Salons", icon: "✂️" },
      { name: "Spas", icon: "🧖" },
      { name: "Makeup Artists", icon: "💄" },
      { name: "Mehndi Artists", icon: "🖊" },
      { name: "Tattoo Studios", icon: "🎨" },
    ],
  },
  {
    name: "Events & Occasions",
    icon: "🎉",
    children: [
      { name: "Banquet Halls", icon: "🏛" },
      { name: "Marriage Gardens", icon: "💒" },
      { name: "Caterers", icon: "🍽" },
      { name: "Photographers & Videographers", icon: "📸" },
      { name: "DJs & Sound Services", icon: "🎵" },
      { name: "Tent & Decoration", icon: "🎪" },
    ],
  },
  {
    name: "Other Services",
    icon: "🐾",
    children: [
      { name: "Pet Clinics", icon: "🐾" },
      { name: "Pet Shops", icon: "🐶" },
      { name: "Courier Services", icon: "📦" },
      { name: "Printing Shops", icon: "🖨" },
      { name: "Internet Cafes", icon: "💻" },
    ],
  },
]

async function main() {
  console.log("🌱 Seeding started...")

  // ── Admin ────────────────────────────────
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@businesslisting.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@businesslisting.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin:", admin.email)

  // ── Test Owner ───────────────────────────
  const ownerPassword = await hash("owner123", 12)
  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      name: "Test Business Owner",
      email: "owner@example.com",
      password: ownerPassword,
      role: "OWNER",
    },
  })
  console.log("✅ Owner:", owner.email)

  // ── Test User ────────────────────────────
  const userPassword = await hash("user123", 12)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  })
  console.log("✅ User:", user.email)

  // ── Categories ───────────────────────────
  console.log("\n📂 Seeding categories...")

  for (const category of categories) {
    // Create parent category
    const parent = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        icon: category.icon,
      },
    })
    console.log(`✅ ${category.name}`)

    // Create children and link to parent
    for (const child of category.children) {
      await prisma.category.upsert({
        where: { name: child.name },
        update: {},
        create: {
          name: child.name,
          icon: child.icon,
          parentId: parent.id,
        },
      })
      console.log(`   └── ✅ ${child.name}`)
    }
  }

  console.log("\n🎉 Seeding complete!")
  console.log("\n📋 Test Credentials:")
  console.log("Admin: admin@businesslisting.com / admin123")
  console.log("Owner: owner@example.com / owner123")
  console.log("User:  user@example.com / user123")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })