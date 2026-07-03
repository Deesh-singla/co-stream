import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { signUpSchema } from "@/src/lib/validations";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = signUpSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        await connectDB();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists.",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            provider: "credentials",
        });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}