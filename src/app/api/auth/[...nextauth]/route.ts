import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions) // 'NextAuth' is a function which takes options

export {handler as GET , handler as POST}

