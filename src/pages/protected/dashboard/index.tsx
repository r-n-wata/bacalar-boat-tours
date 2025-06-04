// pages/dashboard.tsx
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../shared/authOptions";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("session::::::::::::", session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signup",
        permanent: false,
      },
    };
  }

  // ❗ Check for specific role
  if (session.client.role !== "operator") {
    return {
      redirect: {
        destination: "/unprotected/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function Dashboard({ session }) {
  return <div>Welcome operator {session.user?.email}!</div>;
}
