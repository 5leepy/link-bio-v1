import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { updateProfile } from "@/lib/actions/profile";
import AdminLinks from "./AdminLinks";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch current profile data
  const profiles = await db`SELECT * FROM profile LIMIT 1`;
  const profile = profiles[0];

  // Fetch all links sorted by order_index
  const links = await db`SELECT * FROM links ORDER BY order_index ASC` as any[];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-slate-500">
                {session.user?.email}
              </span>
            </div>
          </div>
          <a 
            href="/" 
            target="_blank" 
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-slate-100 text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm w-full sm:w-auto"
          >
            Preview Site <span className="ml-2 text-xs opacity-50">↗</span>
          </a>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Public appearance and preferences</p>
            </div>
            
            <form action={updateProfile} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[13px] font-bold text-slate-700 ml-0.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={profile?.name || ""}
                    placeholder="e.g. John Doe"
                    className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="avatar_url" className="block text-[13px] font-bold text-slate-700 ml-0.5">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatar_url"
                    id="avatar_url"
                    defaultValue={(profile as any)?.avatar_url || ""}
                    className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="bio" className="block text-[13px] font-bold text-slate-700 ml-0.5">
                    Short Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={2}
                    defaultValue={profile?.bio || ""}
                    placeholder="Write a short bio about yourself..."
                    className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="theme" className="block text-[13px] font-bold text-slate-700 ml-0.5">
                    Interface Theme
                  </label>
                  <select
                    name="theme"
                    id="theme"
                    defaultValue={(profile as any)?.theme || "light"}
                    className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all bg-slate-50/50 focus:bg-white cursor-pointer"
                  >
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 py-2.5 px-6 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </section>

          {/* Links Section */}
          <AdminLinks initialLinks={links} />
        </div>
      </div>
    </div>
  );
}
