import NextAuth from "next-auth";
import { authOptions } from "../../../shared/authOptions"; // adjust path as needed

export default NextAuth(authOptions);
