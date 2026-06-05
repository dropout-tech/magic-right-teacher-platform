"use client"

import { useMemo, useState } from "react"
import { Wallet, Coins, CalendarClock, Receipt, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  SALARY_STATUS_META,
  lineTeachers,
  salaryTeacherIds,
  statementBase,
  statementGross,
  statementsOf,
  type SalaryStatement,
} from "@/lib/line-data"
import { LinePhone, ChatBubble, SystemNote, SalaryCardBubble, QuickReplyChips } from "@/components/line/line-phone"

const teacherById = (id: string) => lineTeachers.find(t => t.id === id)!

function nowClock() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function LineSalary() {
  const [selectedId, setSelectedId] = useState(salaryTeacherIds[0])

  const teacher = teacherById(selectedId)
  const statements = useMemo(() => statementsOf(selectedId), [selectedId])
  const current = statements.find(s => s.status !== "paid") ?? statements[0]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">薪資查詢</h1>
        <p className="text-sm text-slate-500 mt-1">
          鐘點由每堂打卡自動累計，老師在 LINE 聊天室點一下就能查本月薪資、鐘點明細與入帳進度，不必再私訊行政問「這個月多少」。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        {/* 左：老師清單 */}
        <div className="space-y-3">
          {salaryTeacherIds.map(id => {
            const t = teacherById(id)
            const cur = statementsOf(id).find(s => s.status !== "paid") ?? statementsOf(id)[0]
            const meta = SALARY_STATUS_META[cur.status]
            return (
              <button
                key={id}
                onClick={() => setSelectedId(id)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedId === id ? "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-200" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-sm truncate">{t.name}</div>
                    <div className="text-xs text-slate-500 truncate">{t.city}・{cur.monthLabel}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">${statementGross(cur).toLocaleString()}</span>
                  <Badge className={meta.color}>{meta.label}</Badge>
                </div>
              </button>
            )
          })}
          <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3 text-xs text-emerald-800 leading-relaxed flex gap-2">
            <Receipt className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            數字直接來自打卡中心的完成堂數，行政與老師看到的是同一份，省去對帳。
          </div>
        </div>

        {/* 右：行政試算表 + 老師端 LINE 查詢 */}
        <div className="space-y-4">
          {/* 本月試算 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-600" /> {teacher.name}・{current.monthLabel}</h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  {current.status === "paid" ? `已於 ${current.payDate} 入帳` : `預定 ${current.payDate} 入帳`}
                </div>
              </div>
              <Badge className={SALARY_STATUS_META[current.status].color}>{SALARY_STATUS_META[current.status].label}</Badge>
            </div>

            <table className="w-full text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2 text-left font-medium">課程</th>
                  <th className="py-2 text-right font-medium">堂數</th>
                  <th className="py-2 text-right font-medium">時數</th>
                  <th className="py-2 text-right font-medium">鐘點</th>
                  <th className="py-2 text-right font-medium">小計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {current.lines.map((l, i) => (
                  <tr key={i}>
                    <td className="py-2.5">
                      <span className="text-[11px] bg-emerald-50 text-emerald-700 rounded px-1.5 py-0.5 mr-1.5">{l.talent}</span>
                      <span className="text-slate-700">{l.organization}</span>
                    </td>
                    <td className="py-2.5 text-right text-slate-600">{l.sessions}</td>
                    <td className="py-2.5 text-right text-slate-600">{l.hours}h</td>
                    <td className="py-2.5 text-right text-slate-500">${l.ratePerSession.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-medium text-slate-800">${l.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-slate-500">
                  <td className="pt-3 text-xs" colSpan={4}>鐘點小計</td>
                  <td className="pt-3 text-right text-sm">${statementBase(current).toLocaleString()}</td>
                </tr>
                {current.adjustments.map((a, i) => (
                  <tr key={i} className="text-slate-500">
                    <td className="pt-1 text-xs" colSpan={4}>{a.label}</td>
                    <td className={`pt-1 text-right text-sm ${a.amount < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                      {a.amount < 0 ? "-" : "+"}${Math.abs(a.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 font-bold text-slate-900" colSpan={4}>本月合計</td>
                  <td className="pt-3 text-right text-lg font-bold text-emerald-600">${statementGross(current).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* 歷史紀錄 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><CalendarClock className="w-4 h-4 text-emerald-600" /> 歷月紀錄</h3>
              <div className="divide-y divide-slate-100">
                {statements.map(s => (
                  <div key={s.id} className="py-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Coins className="w-4 h-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800">{s.monthLabel}</div>
                      <div className="text-xs text-slate-400">{s.lines.length} 門課・{s.lines.reduce((a, l) => a + l.sessions, 0)} 堂</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-800">${statementGross(s).toLocaleString()}</div>
                      <Badge className={SALARY_STATUS_META[s.status].color}>{SALARY_STATUS_META[s.status].label}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 老師端 LINE 自助查詢 */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-400 mb-2">老師在 LINE 查薪資的畫面（{teacher.name}）</div>
              <SalaryChatPreview statements={statements} />
              <p className="text-[11px] text-slate-400 mt-2 text-center max-w-[260px]">
                點手機裡的快速回覆，機器人就回傳對應的薪資卡片 —— 老師自己查，行政不必再一筆筆回。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ChatItem =
  | { kind: "note"; text: string }
  | { kind: "them"; text: string; time: string }
  | { kind: "us"; text: string; time: string; auto?: boolean }
  | { kind: "salary"; statement: SalaryStatement; time: string }

const CHIPS = ["本月薪資", "鐘點明細", "入帳進度", "歷史紀錄"]

function SalaryChatPreview({ statements }: { statements: SalaryStatement[] }) {
  const current = statements.find(s => s.status !== "paid") ?? statements[0]
  const [items, setItems] = useState<ChatItem[]>([
    { kind: "note", text: "薪資查詢" },
    { kind: "us", text: "嗨老師！想查薪資嗎？點下面的選項就可以 👇", time: "09:00", auto: true },
  ])

  const push = (...add: ChatItem[]) => setItems(prev => [...prev, ...add])

  const onPick = (chip: string) => {
    const time = nowClock()
    push({ kind: "them", text: chip, time })

    if (chip === "本月薪資") {
      push({ kind: "salary", statement: current, time })
    } else if (chip === "鐘點明細") {
      const detail = current.lines
        .map(l => `・${l.organization}：${l.sessions} 堂 / ${l.hours}h｜$${l.subtotal.toLocaleString()}`)
        .join("\n")
      push({ kind: "us", text: `${current.monthLabel} 鐘點明細：\n${detail}`, time, auto: true })
    } else if (chip === "入帳進度") {
      const meta = SALARY_STATUS_META[current.status]
      const line =
        current.status === "paid"
          ? `本月薪資已於 ${current.payDate} 入帳 ✅`
          : `目前狀態：${meta.label}，預定 ${current.payDate} 匯入你登記的帳戶 💳`
      push({ kind: "us", text: line, time, auto: true })
    } else if (chip === "歷史紀錄") {
      const hist = statements
        .map(s => `・${s.monthLabel}：$${statementGross(s).toLocaleString()}（${SALARY_STATUS_META[s.status].label}）`)
        .join("\n")
      push({ kind: "us", text: `你的歷月鐘點：\n${hist}`, time, auto: true })
    }
  }

  return (
    <LinePhone accountName="萊特魔數學院" showMenu>
      {items.map((it, i) => {
        if (it.kind === "note") return <SystemNote key={i}>{it.text}</SystemNote>
        if (it.kind === "salary") return <SalaryCardBubble key={i} statement={it.statement} />
        return (
          <ChatBubble key={i} side={it.kind} time={it.time} auto={it.kind === "us" ? it.auto : undefined}>
            {it.text}
          </ChatBubble>
        )
      })}
      <div className="pt-1">
        <QuickReplyChips chips={CHIPS} onPick={onPick} />
      </div>
      <div className="flex items-center gap-1 text-[10px] text-white/70 justify-center pt-0.5">
        <MessageCircle className="w-3 h-3" /> 也可直接輸入「薪資」查詢
      </div>
    </LinePhone>
  )
}
