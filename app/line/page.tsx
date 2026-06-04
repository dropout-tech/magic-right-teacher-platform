"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, Inbox, Send, Megaphone, Bot, Users, Settings } from "lucide-react"
import { LineLogo, LINE_GREEN } from "@/components/line/line-phone"
import { LineDashboard } from "@/components/line/line-dashboard"
import { LineInbox } from "@/components/line/line-inbox"
import { LineDispatch } from "@/components/line/line-dispatch"
import { LineBroadcast } from "@/components/line/line-broadcast"
import { LineAutoReply } from "@/components/line/line-autoreply"
import { LineRoster } from "@/components/line/line-roster"
import { lineStats } from "@/lib/line-data"

export type LineSection = "dashboard" | "inbox" | "dispatch" | "broadcast" | "autoreply" | "roster"

const NAV: { id: LineSection; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "總覽儀表板", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "inbox", label: "共享收件匣", icon: <Inbox className="w-5 h-5" /> },
  { id: "dispatch", label: "派課中心", icon: <Send className="w-5 h-5" /> },
  { id: "broadcast", label: "群發中心", icon: <Megaphone className="w-5 h-5" /> },
  { id: "autoreply", label: "自動回覆", icon: <Bot className="w-5 h-5" /> },
  { id: "roster", label: "老師 LINE 名冊", icon: <Users className="w-5 h-5" /> },
]

export default function LineAdminPage() {
  const [section, setSection] = useState<LineSection>("dashboard")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">返回首頁</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: LINE_GREEN }}>
                  <LineLogo className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 leading-tight">LINE@ 管理中心</div>
                  <div className="text-[11px] text-slate-400 leading-tight">萊特魔數學院</div>
                </div>
              </div>
            </div>
            <Link href="/admin">
              <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5">
                <Settings className="w-4 h-4" /> 老師官網後台
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] sticky top-16 flex-shrink-0">
          <nav className="p-4 space-y-1">
            {NAV.map(item => {
              const active = section === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${active ? "text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  style={active ? { backgroundColor: LINE_GREEN } : undefined}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.id === "inbox" && (
                    <span className={`ml-auto text-[11px] rounded-full px-1.5 py-0.5 ${active ? "bg-white/25 text-white" : "bg-red-100 text-red-600"}`}>
                      {lineStats.activeConversations}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="mx-4 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-xs font-bold text-emerald-800 mb-1">為什麼用 LINE？</div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              台灣老師與家長每天都開 LINE。把管理做進 LINE，導入成功率遠高於要大家裝新 App。
            </p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {section === "dashboard" && <LineDashboard onNavigate={setSection} />}
          {section === "inbox" && <LineInbox />}
          {section === "dispatch" && <LineDispatch />}
          {section === "broadcast" && <LineBroadcast />}
          {section === "autoreply" && <LineAutoReply />}
          {section === "roster" && <LineRoster />}
        </main>
      </div>
    </div>
  )
}
