import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ─────────────────────────────────────────
// GET /api/business/my
// Owner sees only their own businesses
// ─────────────────────────────────────────
export async function GET() {

  // Step 1 — Check session
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    )
  }

  // Step 2 — Check role
  if (session.user.role !== "OWNER") {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    )
  }

  // Step 3 — Get all businesses for this owner
  const businesses = await prisma.business.findMany({
    where: {
      ownerId: session.user.id // ← only this owner's businesses
    },
    include: {
      category: true,
      images: true,
      // count reviews without fetching all review data
      _count: {
        select: { reviews: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json({ businesses })
}