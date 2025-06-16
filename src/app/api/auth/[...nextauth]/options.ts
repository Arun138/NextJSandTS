import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier }, // credentials.identifier.email
              { password: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }
          const isPassowrdCorrect = await bcrypt.compare(credentials.password, user.password)
          if (isPassowrdCorrect) {
            return user
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks:{
    // we need data, but we don't want to do db call exery next time. So we edit the jwt and session by attaching those data to get those data in need 
    async jwt({token,user}) {
        if (user) {
            // adding more content to jwt token
            token._id = user._id?.toString() 
            token.isVerified = user.isVerified
            token.isAcceptingMessages= user.isAcceptingMessages
            token.username = user.username
        }
        return token
    },
    async session({session,token}) {
        if (token) {
            // adding more content to session token
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages= token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    }

  },
  pages:{
    signIn:'sign-in' // this is the routing of the sign-in page. next-auth also automatically design the page.
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXTAUTH_SECRET,

};
