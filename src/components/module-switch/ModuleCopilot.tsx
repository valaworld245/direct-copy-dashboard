import { useMemo, useState } from "react";
import { Bot, CornerDownLeft, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModuleEntry } from "@/lib/module-catalog";
import { searchModules } from "@/lib/module-catalog";

type Props = {
  modules: ModuleEntry[];
  onOpen: (m: ModuleEntry) => void;
  onSelect: (m: ModuleEntry) => void;
};

/**
 * Floating copilot for the Module Switch Dashboard.
 * It works entirely on the real module registry the user has access to —
 * it finds modules, explains what a KPI is measured from and launches
 * workspaces. It never calls an external model or invents data.
 */
export function ModuleCopilot({ modules, onOpen, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const results = useMemo(() => searchModules(modules, q).slice(0, 8), [modules, q]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="AI Copilot"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_14px_40px_-12px_rgba(50,140,255,0.9)] transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg,#2f7dff 0%,#48c6ff 100%)" }}
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[320px] overflow-hidden rounded-2xl border text-white shadow-2xl"
          style={{
            borderColor: "rgba(88,160,255,0.34)",
            background: "linear-gradient(180deg,#10254a 0%,#0b1a35 60%,#060d1d 100%)",
          }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-[#8fd0ff]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]">AI Copilot</span>
          </div>

          <div className="p-3">
            <p className="mb-2 text-[11px] leading-relaxed text-white/65">
              Ask for a workspace by name — e.g. “vendor”, “finance”, “tickets”. I search only the
              modules your role can open.
            </p>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a module…"
              aria-label="Ask the copilot"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-[12px] outline-none placeholder:text-white/45 focus:border-[#48c6ff]"
            />

            <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
              {results.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-[#bcd8ff]" />
                    <button
                      type="button"
                      onClick={() => { onSelect(m); setOpen(false); }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-[12px] font-semibold">{m.label}</div>
                      <div className="truncate text-[10px] text-white/50">{m.group}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpen(m)}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold",
                        "bg-[#2f7dff]/25 text-[#bcd8ff] hover:bg-[#2f7dff]/45",
                      )}
                    >
                      Open <CornerDownLeft className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              {results.length === 0 && (
                <p className="px-2 py-4 text-center text-[11px] text-white/50">
                  No module matches “{q}”.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
