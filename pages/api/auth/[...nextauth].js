import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import PostgresAdapter from "@/lib/adapter";
import pool from "@/lib/db";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            authorize: async (credentials, req) => {
                const db_user_res = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [credentials.email, credentials.password])
                if (db_user_res.rows[0]) {
                    const user = db_user_res.rows[0]
                    console.log(`user object: ${user}`)
                    return user
                } else {
                    console.log(`No user has been found with email "${credentials.email}" and password "${credentials.password}"`)
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks:{
        async jwt ({token, user}) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
        async session ({session, token}) {
            session.user.id = token.id;
            return session;
        }
    },
    adapter: PostgresAdapter(pool),
    secret: process.env.NEXT_SECRET,
    session: {
        strategy: 'jwt'
    }
}

export default NextAuth(authOptions);


    
