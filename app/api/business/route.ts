import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ─────────────────────────────────────────
// POST /api/business
// Owner creates a new business listing
// ─────────────────────────────────────────
export async function POST(req: Request) {

  // Step 1 — Check if user is logged in
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
      // 401 = Unauthorized (not logged in)
    )
  }

  // Step 2 — Check if user is an OWNER
  if (session.user.role !== "OWNER") {
    return NextResponse.json(
      { error: "Only business owners can create listings" },
      { status: 403 }
      // 403 = Forbidden (logged in but not allowed)
    )
  }

  // Step 3 — Get the data from request body
  const body = await req.json()

  const {
    name,
    description,
    phone,
    email,
    website,
    address,
    city,
    state,
    pincode,
    categoryId,
    openingHours,
  } = body

  // Step 4 — Basic validation
  if (!name || !address || !city || !state || !categoryId) {
    return NextResponse.json(
      { error: "name, address, city, state and categoryId are required" },
      { status: 400 }
      // 400 = Bad Request (missing or wrong data)
    )
  }

  // Step 5 — Check category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    )
  }

  // Step 6 — Create the business
  const business = await prisma.business.create({
    data: {
      name,
      description,
      phone,
      email,
      website,
      address,
      city,
      state,
      pincode,
      categoryId,
      openingHours,
      ownerId: session.user.id,  // ← from session
      isApproved: false,          // ← must wait for admin approval
    },
    // include returns related data in response
    include: {
      category: true,  // return category details
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          // never return password!
        }
      }
    }
  })

  return NextResponse.json(
    { message: "Business created successfully. Pending admin approval.", business },
    { status: 201 }
    // 201 = Created successfully
  )
}

// ─────────────────────────────────────────
// GET /api/business
// Public — returns all APPROVED businesses
// ─────────────────────────────────────────
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  // Optional filters from query params
  // e.g. /api/business?city=Jabalpur&categoryId=abc123
  const city = searchParams.get("city")
  const categoryId = searchParams.get("categoryId")

  const businesses = await prisma.business.findMany({
    where: {
      isApproved: true, // ← only show approved businesses
      // if city filter provided, filter by city
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      // if category filter provided, filter by category
      ...(categoryId && { categoryId }),
    },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc" // newest first
    }
  })

  return NextResponse.json({ businesses })
}