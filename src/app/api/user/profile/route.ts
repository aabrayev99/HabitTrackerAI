import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET — fetch user profile (including avatar image)
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, name: true, email: true, image: true },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("[USER_PROFILE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH — update user avatar
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { image } = await req.json()

        if (!image) {
            return new NextResponse("Image is required", { status: 400 })
        }

        if (image.length > 3000000) {
            return new NextResponse("Image too large", { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                image: image,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("[USER_PROFILE_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
