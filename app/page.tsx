import { db } from "@/lib/db";
import * as Icons from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  theme: "light" | "dark";
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon_name: string;
  order_index: number;
}

export default async function Home() {
  // Fetch profile
  const profiles = await db`SELECT * FROM profile LIMIT 1`;
  const profile = profiles[0] as unknown as Profile;
  const isDark = profile?.theme === "dark";

  // Fetch active links sorted by order
  const links = (await db`
    SELECT * FROM links 
    WHERE is_active = true 
    ORDER BY order_index ASC
  `) as unknown as LinkItem[];

  return (
    <main className={`min-h-screen py-16 px-4 transition-colors duration-500 ${
      isDark 
        ? "bg-slate-950 text-slate-100" 
        : "bg-gradient-to-b from-slate-50 to-slate-200 text-slate-900"
    }`}>
      <div className="max-w-md mx-auto flex flex-col items-center">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative w-24 h-24 mb-4">
            <div className={`absolute inset-0 rounded-full blur-sm opacity-20 scale-110 ${
              isDark ? "bg-indigo-400" : "bg-indigo-500"
            }`}></div>
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className={`w-full h-full rounded-full object-cover border-4 shadow-xl relative z-10 ${
                  isDark ? "border-slate-800" : "border-white"
                }`}
              />
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold border-4 shadow-xl relative z-10 ${
                isDark ? "bg-indigo-500 border-slate-800 text-white" : "bg-indigo-600 border-white text-white"
              }`}>
                {profile?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <h1 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            {profile?.name || "User Name"}
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-[280px] leading-relaxed`}>
            {profile?.bio || "Welcome to my link-in-bio page."}
          </p>
        </div>

        {/* Links Section */}
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {links.map((link, index) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center p-4 border rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isDark 
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-100" 
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800"
              }`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300 shrink-0 ${
                isDark 
                  ? "bg-slate-800 group-hover:bg-indigo-900 text-slate-300 group-hover:text-indigo-300" 
                  : "bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600"
              }`}>
                <DynamicIcon name={link.icon_name} className="w-5 h-5" />
              </div>
              <div className="ml-4 flex-1 font-medium text-base">
                {link.title}
              </div>
              <Icons.ExternalLink className={`w-4 h-4 transition-colors ${
                isDark ? "text-slate-600 group-hover:text-slate-400" : "text-slate-300 group-hover:text-slate-400"
              }`} />
            </Link>
          ))}

          {links.length === 0 && (
            <div className={`text-center py-10 text-sm italic ${isDark ? "text-slate-600" : "text-slate-400"}`}>
              No links available yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={`mt-16 text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          <p>© {new Date().getFullYear()} {profile?.name || "User"}. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

import { getIcon } from "@/lib/icons";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = getIcon(name);
  return <IconComponent className={className} />;
}
