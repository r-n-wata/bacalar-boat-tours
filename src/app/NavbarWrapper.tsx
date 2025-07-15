// components/NavbarWrapper.tsx
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Navbar from "../components/molecules/navbar/Navbar";

export default async function NavbarWrapper() {
  const fullUser = await getCurrentUser({ withFullUser: true });

  return <Navbar user={fullUser} />;
}
