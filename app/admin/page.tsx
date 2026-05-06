import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user?.email}</p>
      <form
        action={async () => {
          "use server";
          // We'll implement logout later or use a button
        }}
      >
        <button className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
          Logout (Pending)
        </button>
      </form>
    </div>
  );
}
