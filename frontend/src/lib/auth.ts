import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "./db";
import UserModel from "@/src/models/User";
import { signInSchema } from "./validations";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import type { Session } from "next-auth";
import Google from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                const result = signInSchema.safeParse(credentials);

                if (!result.success) {
                    throw new Error("Invalid credentials");
                }

                const { email, password } = result.data;

                await connectDB();

                const user = await UserModel.findOne({ email });

                if (!user) {
                    throw new Error("User not found");
                }

                if (!user.password) {
                    throw new Error("Please sign in with Google");
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid creddentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],

    pages: {
        signIn: "/signin",
        error: "/signin"
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();
                console.log("db connected");
                const existingUser = await UserModel.findOne({
                    email: user.email,
                });

                if (!existingUser) {
                    await UserModel.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: "google",
                    });
                }
            }

            return true;
        },
        async jwt({
            token,
            user,
        }: {
            token: JWT;
            user?: User;
        }) {
            if (user) {
                token.id = user.id!;
            }

            return token;
        },

        async session({
            session,
            token,
        }: {
            session: Session;
            token: JWT;
        }) {
            if (session.user) {
                session.user.id = token.id;
            }

            return session;
        }
    },

    secret: process.env.AUTH_SECRET,
};