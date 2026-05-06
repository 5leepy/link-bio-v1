"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function addLink(formData: FormData) {
  await checkAuth();

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const icon_name = formData.get("icon_name") as string;

  try {
    // Get max order_index
    const maxOrderRes = await db`SELECT MAX(order_index) as max_order FROM links`;
    const nextOrder = (maxOrderRes[0]?.max_order ?? -1) + 1;

    await db`
      INSERT INTO links (title, url, icon_name, order_index, is_active)
      VALUES (${title}, ${url}, ${icon_name}, ${nextOrder}, true)
    `;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to add link:", error);
    return { success: false, error: "Failed to add link" };
  }
}

export async function updateLink(id: string, formData: FormData) {
  await checkAuth();

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const icon_name = formData.get("icon_name") as string;

  try {
    await db`
      UPDATE links 
      SET title = ${title}, url = ${url}, icon_name = ${icon_name}, updated_at = NOW()
      WHERE id = ${id}
    `;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

export async function deleteLink(id: string) {
  await checkAuth();

  try {
    await db`DELETE FROM links WHERE id = ${id}`;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}

export async function toggleLinkStatus(id: string, currentStatus: boolean) {
  await checkAuth();

  try {
    await db`
      UPDATE links 
      SET is_active = ${!currentStatus}, updated_at = NOW()
      WHERE id = ${id}
    `;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle link status:", error);
    return { success: false, error: "Failed to toggle link status" };
  }
}

export async function reorderLink(id: string, direction: "up" | "down") {
  await checkAuth();

  try {
    const currentLinkRes = await db`SELECT id, order_index FROM links WHERE id = ${id}`;
    const currentLink = currentLinkRes[0];
    if (!currentLink) return { success: false, error: "Link not found" };

    const currentIndex = currentLink.order_index;
    
    let targetLinkRes;
    if (direction === "up") {
      targetLinkRes = await db`
        SELECT id, order_index FROM links 
        WHERE order_index < ${currentIndex} 
        ORDER BY order_index DESC LIMIT 1
      `;
    } else {
      targetLinkRes = await db`
        SELECT id, order_index FROM links 
        WHERE order_index > ${currentIndex} 
        ORDER BY order_index ASC LIMIT 1
      `;
    }

    const targetLink = targetLinkRes[0];
    if (!targetLink) return { success: true }; // Already at top/bottom

    // Swap order_index
    await db.begin(async (sql) => {
      await sql`UPDATE links SET order_index = ${targetLink.order_index} WHERE id = ${id}`;
      await sql`UPDATE links SET order_index = ${currentIndex} WHERE id = ${targetLink.id}`;
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder link:", error);
    return { success: false, error: "Failed to reorder link" };
  }
}
