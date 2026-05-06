"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = formData.get("avatar_url") as string;
  const theme = formData.get("theme") as string;

  try {
    await db`
      UPDATE profile 
      SET name = ${name}, bio = ${bio}, avatar_url = ${avatar_url}, theme = ${theme}, updated_at = NOW()
      WHERE id = (SELECT id FROM profile LIMIT 1)
    `;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
