"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { saveOperatorSchema, signInShema, signUpSchema } from "./schemas";
import { UserTable, OperatorProfileTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher";
import { createUserSession, removeUserFromSession } from "../core/sessions";
import { cookies } from "next/headers";

export async function signIn(unsafeData: z.infer<typeof signInShema>) {
  const { success, data } = signInShema.safeParse(unsafeData);

  if (!success)
    return {
      error: "Unable to log you in, invalid data",
    };

  const user = await db.query.UserTable.findFirst({
    columns: { password: true, salt: true, id: true, email: true, role: true },
    where: eq(UserTable.email, data.email),
  });

  if (user == null || user.password == null || user.salt == null) {
    return {
      error: "Unable to log you in, user not found",
    };
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword)
    return {
      error: "Unable to log you in",
    };

  await createUserSession(user, await cookies());
  return {
    userId: user.id,
  };

  redirect("/");
}

export async function signUp(unSafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = await signUpSchema.safeParse(unSafeData);

  if (!success) return "Unable to create an account";

  const existingUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (existingUser) return "User already exists";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const [user] = await db
      .insert(UserTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        salt,
      })
      .returning({ id: UserTable.id, role: UserTable.role });

    if (user == null) return "Unable to create account";
    await createUserSession(user, await cookies());
    return {
      userId: user.id,
    };
  } catch {
    return "Unable to create account";
  }
  //edirect("/");
}

export async function logOut() {
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function saveOperatorData(
  userId: string,
  unsafeData: Partial<z.infer<typeof saveOperatorSchema>>
) {
  const parsed = saveOperatorSchema.safeParse(unsafeData);

  if (!parsed.success) {
    return { error: "Invalid operator data" };
  }

  const data = parsed.data;

  try {
    // Check if profile already exists
    const existingProfile = await db.query.OperatorProfileTable.findFirst({
      where: eq(OperatorProfileTable.userId, userId),
    });

    if (existingProfile) {
      // Update existing profile
      await db
        .update(OperatorProfileTable)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(OperatorProfileTable.userId, userId));
    } else {
      // Insert new profile
      await db.insert(OperatorProfileTable).values({
        userId,
        ...data,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to save operator data:", err);
    return { error: "Failed to save operator profile" };
  }
}
