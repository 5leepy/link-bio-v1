"use client";

import { useState } from "react";
import { 
  addLink, 
  updateLink, 
  deleteLink, 
  toggleLinkStatus, 
  reorderLink 
} from "@/lib/actions/links";
import { toast } from "sonner";
import { COMMON_ICONS, getIcon } from "@/lib/icons";
import { ChevronDown, Trash2, Edit3, ArrowUp, ArrowDown } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon_name: string;
  order_index: number;
  is_active: boolean;
}

export default function AdminLinks({ initialLinks }: { initialLinks: Link[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleLinkStatus(id, currentStatus);
      toast.success(currentStatus ? "Link hidden" : "Link visible");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink(id);
        toast.success("Link deleted");
      } catch (error) {
        toast.error("Failed to delete link");
      }
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    try {
      await reorderLink(id, direction);
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to reorder");
    }
  };

  return (
    <section className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden mb-12">
      <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Links</h2>
          <p className="text-xs text-slate-500 font-medium">Manage and organize your social links</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all active:scale-95 shadow-sm"
          >
            + Add New
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {isAdding && (
          <div className="mb-8 p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Create Link
            </h3>
            <LinkForm 
              onSubmit={async (formData) => {
                try {
                  await addLink(formData);
                  setIsAdding(false);
                  toast.success("Link added successfully!");
                } catch (error) {
                  toast.error("Failed to add link");
                }
              }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        )}

        <div className="space-y-4">
          {initialLinks.map((link, index) => (
            <div 
              key={link.id} 
              className={`group border rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                editingId === link.id 
                  ? "bg-white border-slate-900 ring-4 ring-slate-900/5 shadow-md" 
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              {editingId === link.id ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Editing Item</h3>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest">Close</button>
                  </div>
                  <LinkForm 
                    initialData={link}
                    onSubmit={async (formData) => {
                      try {
                        await updateLink(link.id, formData);
                        setEditingId(null);
                        toast.success("Link updated successfully");
                      } catch (error) {
                        toast.error("Failed to update link");
                      }
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <DynamicIcon name={link.icon_name} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 text-base sm:text-lg truncate">{link.title}</span>
                        {!link.is_active && (
                          <span className="bg-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Hidden</span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 truncate hover:text-slate-600 transition-colors cursor-default max-w-[200px] sm:max-w-xs md:max-w-md">
                        {link.url}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 md:border-l md:pl-6 border-slate-100">
                    {/* Reordering */}
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                      <button 
                        onClick={() => handleReorder(link.id, "up")}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReorder(link.id, "down")}
                        disabled={index === initialLinks.length - 1}
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setEditingId(link.id)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(link.id, link.is_active)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 ${
                        link.is_active ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          link.is_active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {initialLinks.length === 0 && !isAdding && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="text-3xl mb-4 opacity-50">🔗</div>
              <h3 className="text-base font-bold text-slate-900">No links available</h3>
              <p className="text-xs text-slate-500 mb-6">Start by adding your first social link.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all active:scale-95 shadow-sm"
              >
                + Add First Link
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function IconSelector({ defaultValue }: { defaultValue?: string }) {
  const [selected, setSelected] = useState(defaultValue || "Link");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Icon</label>
      <input type="hidden" name="icon_name" value={selected} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 text-sm hover:border-slate-400 transition-all shadow-sm focus:ring-4 focus:ring-slate-900/5 focus:bg-white"
      >
        <DynamicIcon name={selected} className="w-5 h-5 text-slate-900 shrink-0" />
        <span className="font-bold">{selected}</span>
        <ChevronDown className={`w-4 h-4 ml-auto text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto overflow-x-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col p-2 animate-in fade-in zoom-in-95 duration-200 origin-top">
            {COMMON_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  setSelected(icon);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-3 text-sm rounded-xl transition-all hover:bg-slate-50 ${
                  selected === icon ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-600"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selected === icon ? "bg-white shadow-sm" : "bg-slate-50"}`}>
                  <DynamicIcon name={icon} className="w-4 h-4 shrink-0 text-slate-900" />
                </div>
                <span>{icon}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = getIcon(name);
  return <IconComponent className={className} />;
}

function LinkForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: Link; 
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
          <input
            name="title"
            defaultValue={initialData?.title}
            required
            className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            placeholder="e.g. Instagram"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">URL</label>
          <input
            name="url"
            defaultValue={initialData?.url}
            required
            className="block w-full rounded-xl border-slate-200 text-slate-900 shadow-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 sm:text-sm p-3 border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <IconSelector defaultValue={initialData?.icon_name} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 text-sm font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 disabled:opacity-50 shadow-sm transition-all active:scale-95"
        >
          {loading ? "Saving..." : "Save Link"}
        </button>
      </div>
    </form>
  );
}
