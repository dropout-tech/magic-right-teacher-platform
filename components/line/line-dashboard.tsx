"use client"

import {
  MessageSquare,
  Users,
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Inbox,
  CheckCircle2,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import {
  CATEGORY_META,
  categoryBreakdown,
  conversations,
  dispatchRequests,
  lineStats,
  messageTrend,
  STATUS_META,
} from "@/lib/line-data"
import type { LineSection } from "@/app/line/page"

const PIE_COLORS = ["#10b981", "#f43f5e", "#3b82f6", "#a855f7", "#f97316", "#f59e0b", "#94a3b8"]

export function LineDashboard({ onNavigate }: { onNavigate: (s: LineSection) => void }) {
  const annualPerAdmin = lineStats.adminMonthlySalary * 12
  const teachersNationwide = 300
  const adminsCovered = Math.round(teachersNationwide / 100)
  const annualSaved = adminsCovered * annualPerAdmin
  const openConvs = conversations.filter(c => c.status === "open")
  const matching = dispatchRequests.filter(d => d.status !== "filled")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">總覽儀表板</h1>

      {/* 省人力 — 成交主訴求 */}
      <div className="relative overflow-hidden rounded-2xl text-white p-6 md:p-7" style={{ background: "linear-gradient(135deg,#06C755,#04A647)" }}>
        <Sparkles className="absolute -right-4 -top-4 w-28 h-28 text-white/10" />
        <div className="relative">
          <div className="text-sm text-white/85 mb-1">本月 LINE 自動分流成效</div>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-4xl md:text-5xl font-black">{Math.round(lineStats.autoHandledRate * 100)}%</span>
            <span className="text-lg font-medium mb-1">的常見詢問由系統自動處理</span>
          </div>
          <p className="text-white/90 mt-2 leading-relaxed">
            相當於 <b className="font-bold">1 位專職行政就能管理 100 位老師</b>。以萊特全臺約 {teachersNationwide} 位老師估算，
            等於省下 <b className="font-bold">{adminsCovered} 位專職行政、年約 {annualSaved.toLocaleString()} 元</b>的人力成本（{adminsCovered} × 年薪 {annualPerAdmin.toLocaleString()} 元）。
            老師、家長、派課全部收斂進<b>同一個收件匣</b>，不再淹沒在零散的 LINE 群裡。
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Users className="w-5 h-5" />} label="老師 LINE 綁定" value={`${lineStats.boundTeachers}/${lineStats.totalTeachers}`} sub="已綁定 / 名單總數" color="emerald" />
        <Stat icon={<Inbox className="w-5 h-5" />} label="進行中對話" value={lineStats.activeConversations} sub="待處理 + 處理中" color="blue" />
        <Stat icon={<Bot className="w-5 h-5" />} label="今日自動回覆" value={lineStats.todayAuto} sub={`人工僅需處理 ${lineStats.todayManual} 則`} color="violet" />
        <Stat icon={<Send className="w-5 h-5" />} label="派課媒合中" value={lineStats.dispatchInProgress} sub="等待老師回覆" color="orange" />
      </div>

      {/* 圖表 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> 近 7 日訊息量
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />自動</span>
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />人工</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={messageTrend} margin={{ left: -20, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="gAuto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="gManual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="manual" name="人工" stackId="1" stroke="#94a3b8" strokeWidth={2} fill="url(#gManual)" isAnimationActive={false} />
              <Area type="monotone" dataKey="auto" name="自動" stackId="1" stroke="#10b981" strokeWidth={2.5} fill="url(#gAuto)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 mb-2">對話分類佔比</h2>
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="category" innerRadius={38} outerRadius={70} paddingAngle={2} isAnimationActive={false}>
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {categoryBreakdown.map((c, i) => (
                <div key={c.category} className="flex items-center gap-2 text-xs">
                  <i className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-600">{CATEGORY_META[c.category].label}</span>
                  <span className="ml-auto font-medium text-slate-800">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 待辦 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">待回覆對話</h2>
            <button onClick={() => onNavigate("inbox")} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              前往收件匣 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {openConvs.map(c => (
              <button key={c.id} onClick={() => onNavigate("inbox")} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-left">
                <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {c.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{c.name}</div>
                  <div className="text-xs text-slate-500 truncate">{c.messages[c.messages.length - 1].text}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${CATEGORY_META[c.category].color}`}>
                  {CATEGORY_META[c.category].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">待派課 / 媒合中</h2>
            <button onClick={() => onNavigate("dispatch")} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              前往派課中心 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {matching.map(d => (
              <button key={d.id} onClick={() => onNavigate("dispatch")} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-left">
                <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{d.organization}</div>
                  <div className="text-xs text-slate-500 truncate">{d.talent}・{d.location}・{d.timeSlot}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${d.status === "dispatched" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                  {d.status === "dispatched" ? "已推播" : "待媒合"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>※ 本頁為 demo 模擬數據，未串接真實 LINE Messaging API。</span>
      </div>
    </div>
  )
}

function Stat({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode; label: string; value: number | string; sub: string; color: string
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    orange: "bg-orange-50 text-orange-600",
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  )
}
