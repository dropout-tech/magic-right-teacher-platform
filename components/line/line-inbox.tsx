"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Send,
  CornerUpRight,
  CheckCheck,
  User2,
  GraduationCap,
  BookOpen,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ADMINS,
  ALL_CATEGORIES,
  CATEGORY_META,
  conversations as seedConversations,
  quickReplies,
  ROLE_META,
  STATUS_META,
  type Conversation,
  type ConvCategory,
  type ConvStatus,
} from "@/lib/line-data"
import { LINE_GREEN } from "@/components/line/line-phone"

function nowClock() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function LineInbox() {
  const [list, setList] = useState<Conversation[]>(() => seedConversations.map(c => ({ ...c, messages: [...c.messages] })))
  const [selectedId, setSelectedId] = useState<string>(list[0].id)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState<ConvCategory | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ConvStatus | "all">("all")
  const [draft, setDraft] = useState("")

  const selected = list.find(c => c.id === selectedId)!

  const filtered = useMemo(() => {
    return list.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (catFilter !== "all" && c.category !== catFilter) return false
      if (statusFilter !== "all" && c.status !== statusFilter) return false
      return true
    })
  }, [list, search, catFilter, statusFilter])

  const update = (id: string, patch: Partial<Conversation>) =>
    setList(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)))

  const select = (id: string) => {
    setSelectedId(id)
    update(id, { unread: 0 })
  }

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    setList(prev =>
      prev.map(c =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, { id: `s${Date.now()}`, from: "us", text: t, time: nowClock() }], status: c.status === "open" ? "pending" : c.status, lastTime: "剛剛" }
          : c,
      ),
    )
    setDraft("")
  }

  const openCount = list.filter(c => c.status === "open").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">共享收件匣</h1>
          <p className="text-sm text-slate-500 mt-1">
            老師、家長、合作單位的 LINE 訊息全部收斂在這裡，自動分類、可指派、可追蹤狀態 —— 取代散落的 LINE 群。
          </p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {openCount} 則待處理
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-4 h-[calc(100vh-220px)] min-h-[560px]">
        {/* ===== 左：對話清單 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋姓名..." className="pl-8 h-9" />
            </div>
            <div className="flex gap-1">
              {(["all", "open", "pending", "resolved"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 text-xs py-1 rounded-md border transition-colors ${
                    statusFilter === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s === "all" ? "全部" : STATUS_META[s].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <CatChip active={catFilter === "all"} onClick={() => setCatFilter("all")} label="全分類" dot="bg-slate-400" />
              {ALL_CATEGORIES.map(cat => (
                <CatChip key={cat} active={catFilter === cat} onClick={() => setCatFilter(cat)} label={CATEGORY_META[cat].label} dot={CATEGORY_META[cat].dot} />
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.map(c => {
              const last = c.messages[c.messages.length - 1]
              return (
                <button
                  key={c.id}
                  onClick={() => select(c.id)}
                  className={`w-full flex gap-2.5 p-3 text-left transition-colors ${selectedId === c.id ? "bg-emerald-50/60" : "hover:bg-slate-50"}`}
                >
                  <span className={`relative w-9 h-9 rounded-full bg-gradient-to-br ${c.avatarGrad} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {c.name.charAt(0)}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${CATEGORY_META[c.category].dot}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-800 truncate">{c.name}</span>
                      <span className={`text-[10px] px-1 rounded ${ROLE_META[c.role].color}`}>{ROLE_META[c.role].label}</span>
                      <span className="ml-auto text-[10px] text-slate-400 whitespace-nowrap">{c.lastTime}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-slate-500 truncate flex-1">{last.text}</span>
                      {c.unread > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-400">沒有符合的對話</div>}
          </div>
        </div>

        {/* ===== 中：對話串 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <span className={`w-9 h-9 rounded-full bg-gradient-to-br ${selected.avatarGrad} flex items-center justify-center text-white text-sm font-bold`}>
              {selected.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                {selected.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${ROLE_META[selected.role].color}`}>{ROLE_META[selected.role].label}</span>
              </div>
              <div className="text-xs text-slate-400">
                {selected.relatedTeacher && `關聯老師：${selected.relatedTeacher}　`}
                {selected.relatedCourse && `課程：${selected.relatedCourse}`}
              </div>
            </div>
            <span className={`ml-auto text-xs px-2 py-1 rounded-full ${STATUS_META[selected.status].color}`}>{STATUS_META[selected.status].label}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5" style={{ backgroundColor: "#eef1f4" }}>
            {selected.messages.map(m =>
              m.from === "them" ? (
                <div key={m.id} className="flex items-end gap-2 max-w-[78%]">
                  <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${selected.avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {selected.name.charAt(0)}
                  </span>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm text-slate-800 shadow-sm whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  <span className="text-[10px] text-slate-400 mb-0.5">{m.time}</span>
                </div>
              ) : (
                <div key={m.id} className="flex items-end gap-2 max-w-[78%] ml-auto flex-row-reverse">
                  <div className="rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-slate-900 shadow-sm whitespace-pre-wrap leading-relaxed" style={{ backgroundColor: "#9DE15A" }}>{m.text}</div>
                  <div className="flex flex-col items-end mb-0.5">
                    {m.auto && <span className="text-[9px] text-emerald-600 font-medium">自動回覆</span>}
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickReplies.map(q => (
                <button key={q.label} onClick={() => setDraft(q.text)} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                  {q.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(draft) }}
                placeholder="輸入回覆訊息...（⌘/Ctrl + Enter 送出）"
                rows={2}
                className="resize-none text-sm"
              />
              <Button onClick={() => send(draft)} disabled={!draft.trim()} className="h-auto py-2.5 text-white" style={{ backgroundColor: draft.trim() ? LINE_GREEN : "#cbd5e1" }}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ===== 右：情境面板 ===== */}
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-5">
            <div className="text-center pt-2">
              <span className={`inline-flex w-14 h-14 rounded-full bg-gradient-to-br ${selected.avatarGrad} items-center justify-center text-white text-xl font-bold mb-2`}>
                {selected.name.charAt(0)}
              </span>
              <div className="font-bold text-slate-800">{selected.name}</div>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${ROLE_META[selected.role].color}`}>{ROLE_META[selected.role].label}</span>
            </div>

            <PanelRow icon={<User2 className="w-4 h-4" />} label="角色">{ROLE_META[selected.role].label}</PanelRow>
            {selected.relatedTeacher && <PanelRow icon={<GraduationCap className="w-4 h-4" />} label="關聯老師">{selected.relatedTeacher}</PanelRow>}
            {selected.relatedCourse && <PanelRow icon={<BookOpen className="w-4 h-4" />} label="相關課程">{selected.relatedCourse}</PanelRow>}

            <div>
              <div className="text-xs font-bold text-slate-500 mb-1.5">分類</div>
              <Select value={selected.category} onValueChange={v => update(selected.id, { category: v as ConvCategory })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{CATEGORY_META[cat].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 mb-1.5">指派負責人</div>
              <Select value={selected.assignee ?? "none"} onValueChange={v => update(selected.id, { assignee: v === "none" ? null : v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未指派</SelectItem>
                  {ADMINS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 mb-1.5">狀態</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["open", "pending", "resolved"] as ConvStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => update(selected.id, { status: s })}
                    className={`text-xs py-1.5 rounded-md border transition-colors ${
                      selected.status === s ? `${STATUS_META[s].color} border-transparent font-medium` : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 space-y-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 pt-3">快速動作</div>
              <button onClick={() => update(selected.id, { status: "resolved" })} className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <CheckCheck className="w-4 h-4 text-emerald-600" /> 標記為已解決
              </button>
              <button onClick={() => send("已為您建立派課需求，稍後會通知符合的老師 🙌")} className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <CornerUpRight className="w-4 h-4 text-orange-500" /> 轉為派課需求
              </button>
            </div>

            <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3 text-xs text-emerald-800 leading-relaxed flex gap-2">
              <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              這通對話若發生在 LINE 群裡，會被其他訊息洗掉；在這裡它有分類、負責人與狀態，不會漏接。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CatChip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-colors ${
        active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </button>
  )
}

function PanelRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-500">{label}</span>
      <span className="ml-auto font-medium text-slate-800">{children}</span>
    </div>
  )
}
