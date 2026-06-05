"use client"

import type { ReactNode } from "react"
import { Calendar, Clock, Wallet, PartyPopper, Phone, Megaphone, Check, Camera, ImageIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  SALARY_STATUS_META,
  statementBase,
  statementGross,
  type SalaryStatement,
} from "@/lib/line-data"

export const LINE_GREEN = "#06C755"
export const LINE_GREEN_DARK = "#04A647"

export function LineLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#fff" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 5.866 2 10.6c0 4.243 3.553 7.798 8.358 8.47.325.07.768.215.88.494.1.252.066.647.032.902 0 0-.117.706-.142.857-.043.252-.2.987.866.538 1.066-.45 5.747-3.385 7.84-5.793 1.444-1.583 2.166-3.187 2.166-4.968C22 5.866 17.523 2 12 2zM8.5 13.5h-2c-.276 0-.5-.224-.5-.5V9c0-.276.224-.5.5-.5s.5.224.5.5v3.5h1.5c.276 0 .5.224.5.5s-.224.5-.5.5zm2-.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9c0-.276.224-.5.5-.5s.5.224.5.5v4zm5 0c0 .215-.138.406-.342.473-.052.018-.105.027-.158.027-.156 0-.305-.073-.4-.2L12.5 10.5V13c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9c0-.215.138-.406.342-.473.205-.066.43.01.558.18L14.5 11.5V9c0-.276.224-.5.5-.5s.5.224.5.5v4zm3-2.5c.276 0 .5.224.5.5s-.224.5-.5.5h-1.5v1h1.5c.276 0 .5.224.5.5s-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5V9c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-1.5v1h1.5z" />
    </svg>
  )
}

// LINE 風格手機外框
export function LinePhone({
  accountName,
  children,
  showMenu = false,
  width = 280,
}: {
  accountName: string
  children: ReactNode
  showMenu?: boolean
  width?: number
}) {
  return (
    <div className="relative flex-shrink-0" style={{ width }}>
      <div className="rounded-[2.2rem] border-[10px] border-slate-900 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="bg-[#8CABD8] flex flex-col" style={{ aspectRatio: "9/17" }}>
          {/* LINE 聊天室標題列 */}
          <div className="flex items-center gap-2 px-3 py-2.5 text-white" style={{ backgroundColor: LINE_GREEN }}>
            <LineLogo className="w-4 h-4" />
            <span className="font-bold text-sm truncate">{accountName}</span>
            <span className="ml-auto text-[10px] bg-white/20 rounded px-1.5 py-0.5">官方帳號</span>
          </div>
          {/* 對話區 */}
          <div className="flex-1 px-3 py-3 space-y-2 overflow-y-auto">{children}</div>
          {/* 圖文選單 */}
          {showMenu && <RichMenuMini />}
        </div>
      </div>
    </div>
  )
}

// 聊天泡泡：side="them"（對方，左白）/ "us"（官方，右綠）
export function ChatBubble({
  side,
  children,
  time,
  auto,
}: {
  side: "them" | "us"
  children: ReactNode
  time?: string
  auto?: boolean
}) {
  if (side === "them") {
    return (
      <div className="flex items-end gap-1.5 max-w-[85%]">
        <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 text-[12px] text-slate-800 shadow-sm whitespace-pre-wrap leading-relaxed">
          {children}
        </div>
        {time && <span className="text-[9px] text-slate-600/70 mb-0.5">{time}</span>}
      </div>
    )
  }
  return (
    <div className="flex items-end gap-1.5 max-w-[85%] ml-auto flex-row-reverse">
      <div
        className="rounded-2xl rounded-br-sm px-3 py-2 text-[12px] text-slate-900 shadow-sm whitespace-pre-wrap leading-relaxed"
        style={{ backgroundColor: "#9DE15A" }}
      >
        {children}
      </div>
      <div className="flex flex-col items-end mb-0.5">
        {auto && <span className="text-[8px] text-emerald-700/80 font-medium">自動</span>}
        {time && <span className="text-[9px] text-slate-600/70">{time}</span>}
      </div>
    </div>
  )
}

// 系統提示泡泡（置中）
export function SystemNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <span className="bg-black/15 text-white text-[10px] rounded-full px-2.5 py-1">{children}</span>
    </div>
  )
}

// 派課卡片（老師端在 LINE 中收到的 flex message 樣式）
export function DispatchCardBubble({
  organization,
  talent,
  timeSlot,
  location,
  rate,
  onAccept,
  onDecline,
  decided,
}: {
  organization: string
  talent: string
  timeSlot: string
  location: string
  rate: string
  onAccept?: () => void
  onDecline?: () => void
  decided?: "accepted" | "declined" | null
}) {
  return (
    <div className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
      <div className="px-3 py-2 text-white text-[11px] font-bold" style={{ backgroundColor: LINE_GREEN }}>
        🔔 新課程媒合通知
      </div>
      <div className="p-3 space-y-1.5 text-[11px] text-slate-700">
        <div className="font-bold text-slate-900 text-[12px]">{organization}</div>
        <div className="flex flex-wrap gap-1">
          <span className="bg-emerald-50 text-emerald-700 rounded px-1.5 py-0.5">{talent}</span>
          <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{location}</span>
        </div>
        <div className="text-slate-600">🗓 {timeSlot}</div>
        <div className="text-slate-600">💰 {rate}</div>
      </div>
      <div className="grid grid-cols-2 border-t border-slate-100 text-[12px] font-bold">
        {decided === "accepted" ? (
          <div className="col-span-2 py-2 text-center text-emerald-600 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> 你已回覆「願意接課」
          </div>
        ) : decided === "declined" ? (
          <div className="col-span-2 py-2 text-center text-slate-400">你已婉拒此課程</div>
        ) : (
          <>
            <button onClick={onDecline} className="py-2 text-slate-500 hover:bg-slate-50 border-r border-slate-100">
              婉拒
            </button>
            <button onClick={onAccept} className="py-2 hover:bg-emerald-50" style={{ color: LINE_GREEN_DARK }}>
              我要接課
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// 打卡卡片（老師端在 LINE 收到的每堂上/下課打卡）
export function CheckinCardBubble({
  organization,
  sessionNo,
  planned,
  checkIn,
  checkOut,
  onCheckIn,
  onCheckOut,
}: {
  organization: string
  sessionNo: number
  planned: string
  checkIn?: string
  checkOut?: string
  onCheckIn?: () => void
  onCheckOut?: () => void
}) {
  return (
    <div className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
      <div className="px-3 py-2 text-white text-[11px] font-bold" style={{ backgroundColor: LINE_GREEN }}>
        📍 上課打卡回報
      </div>
      <div className="p-3 space-y-1.5 text-[11px] text-slate-700">
        <div className="font-bold text-slate-900 text-[12px]">{organization}</div>
        <div className="text-slate-500">第 {sessionNo} 堂・計畫 {planned}</div>
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span>上課</span>
            {checkIn ? <span className="text-emerald-600 font-medium">✓ {checkIn}</span> : <span className="text-slate-400">尚未打卡</span>}
          </div>
          <div className="flex items-center justify-between">
            <span>下課</span>
            {checkOut ? <span className="text-emerald-600 font-medium">✓ {checkOut}</span> : <span className="text-slate-400">—</span>}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 text-[12px] font-bold">
        {!checkIn ? (
          <button onClick={onCheckIn} className="w-full py-2 hover:bg-emerald-50" style={{ color: LINE_GREEN_DARK }}>
            🟢 上課打卡
          </button>
        ) : !checkOut ? (
          <button onClick={onCheckOut} className="w-full py-2 text-rose-600 hover:bg-rose-50">
            🔴 下課打卡
          </button>
        ) : (
          <div className="py-2 text-center text-emerald-600 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> 本堂已完成回報
          </div>
        )}
      </div>
    </div>
  )
}

// 薪資卡片（老師端在 LINE 查詢鐘點時收到的 flex message 樣式）
export function SalaryCardBubble({ statement }: { statement: SalaryStatement }) {
  const base = statementBase(statement)
  const gross = statementGross(statement)
  const meta = SALARY_STATUS_META[statement.status]
  return (
    <div className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
      <div className="px-3 py-2 text-white text-[11px] font-bold flex items-center justify-between" style={{ backgroundColor: LINE_GREEN }}>
        <span>💰 {statement.monthLabel} 鐘點試算</span>
        <span className="bg-white/25 rounded px-1.5 py-0.5 text-[10px]">{meta.label}</span>
      </div>
      <div className="p-3 space-y-1.5 text-[11px] text-slate-700">
        {statement.lines.map((l, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="truncate">
              <span className="text-slate-400 mr-1">{l.talent}</span>
              {l.organization}
            </span>
            <span className="whitespace-nowrap text-slate-500">{l.sessions} 堂</span>
            <span className="whitespace-nowrap font-medium text-slate-800">${l.subtotal.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-slate-500">
          <span>鐘點小計</span>
          <span>${base.toLocaleString()}</span>
        </div>
        {statement.adjustments.map((a, i) => (
          <div key={i} className="flex items-center justify-between text-slate-500">
            <span>{a.label}</span>
            <span className={a.amount < 0 ? "text-rose-500" : "text-emerald-600"}>
              {a.amount < 0 ? "-" : "+"}${Math.abs(a.amount).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
          <span className="font-bold text-slate-900 text-[12px]">本月合計</span>
          <span className="font-bold text-[13px]" style={{ color: LINE_GREEN_DARK }}>${gross.toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-slate-400 pt-0.5">
          {statement.status === "paid" ? `已於 ${statement.payDate} 入帳` : `預定 ${statement.payDate} 入帳`}
        </div>
      </div>
    </div>
  )
}

// LINE 快速回覆列（聊天室底部可點選的膠囊鈕）
export function QuickReplyChips({ chips, onPick }: { chips: string[]; onPick: (chip: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1">
      {chips.map(chip => (
        <button
          key={chip}
          onClick={() => onPick(chip)}
          className="flex-shrink-0 bg-white/90 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm whitespace-nowrap border"
          style={{ color: LINE_GREEN_DARK, borderColor: LINE_GREEN }}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

// 課程類型選擇框（官方帳號於上課當天請老師確認課別）
export function ChoiceCardBubble({
  heading = "🧾 請選擇今日課程類型",
  title,
  options,
  picked,
  onPick,
}: {
  heading?: string
  title?: string
  options: { key: string; label: string; sub?: string }[]
  picked?: string | null
  onPick?: (key: string) => void
}) {
  return (
    <div className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
      <div className="px-3 py-2 text-white text-[11px] font-bold" style={{ backgroundColor: LINE_GREEN }}>
        {heading}
      </div>
      <div className="p-2 space-y-1">
        {title && <div className="px-1 pb-1 text-[11px] text-slate-500">{title}</div>}
        {options.map((o, i) => {
          const active = picked === o.key
          return (
            <button
              key={o.key}
              onClick={() => onPick?.(o.key)}
              disabled={!!picked}
              className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] border transition-colors ${
                active ? "border-emerald-400 bg-emerald-50" : picked ? "border-transparent opacity-40" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: active ? LINE_GREEN : "#cbd5e1" }}
              >
                {i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-medium text-slate-800">{o.label}</span>
                {o.sub && <span className="block text-[10px] text-slate-400">{o.sub}</span>}
              </span>
              {active && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 抵達打卡卡片：先上傳抵達現場照片，再打卡上課，下課後打卡下班
export function PhotoCheckinCard({
  organization,
  sessionNo,
  planned,
  courseTypeLabel,
  photo,
  checkIn,
  checkOut,
  onUploadPhoto,
  onCheckIn,
  onCheckOut,
}: {
  organization: string
  sessionNo: number
  planned: string
  courseTypeLabel: string
  photo?: boolean
  checkIn?: string
  checkOut?: string
  onUploadPhoto?: () => void
  onCheckIn?: () => void
  onCheckOut?: () => void
}) {
  return (
    <div className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
      <div className="px-3 py-2 text-white text-[11px] font-bold flex items-center justify-between" style={{ backgroundColor: LINE_GREEN }}>
        <span>📍 上課打卡</span>
        <span className="bg-white/25 rounded px-1.5 py-0.5 text-[10px]">{courseTypeLabel}</span>
      </div>
      <div className="p-3 space-y-2 text-[11px] text-slate-700">
        <div className="font-bold text-slate-900 text-[12px]">{organization}</div>
        <div className="text-slate-500">第 {sessionNo} 堂・計畫 {planned}</div>

        {photo ? (
          <div className="rounded-lg overflow-hidden border border-slate-100">
            <div className="h-20 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center relative">
              <ImageIcon className="w-6 h-6 text-white/80" />
              <span className="absolute bottom-1 left-1.5 bg-black/45 text-white text-[9px] rounded px-1.5 py-0.5">
                📍 抵達現場{checkIn ? ` ${checkIn}` : ""}
              </span>
            </div>
          </div>
        ) : !checkOut ? (
          <button
            onClick={onUploadPhoto}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 py-3 text-slate-500 hover:bg-slate-50"
          >
            <Camera className="w-4 h-4" /> 上傳抵達現場照片
          </button>
        ) : null}

        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span>上課</span>
            {checkIn ? <span className="text-emerald-600 font-medium">✓ {checkIn}</span> : <span className="text-slate-400">尚未打卡</span>}
          </div>
          <div className="flex items-center justify-between">
            <span>下課</span>
            {checkOut ? <span className="text-emerald-600 font-medium">✓ {checkOut}</span> : <span className="text-slate-400">—</span>}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 text-[12px] font-bold">
        {!photo ? (
          <div className="py-2 text-center text-slate-300">請先上傳抵達照片</div>
        ) : !checkIn ? (
          <button onClick={onCheckIn} className="w-full py-2 hover:bg-emerald-50" style={{ color: LINE_GREEN_DARK }}>
            🟢 上課打卡
          </button>
        ) : !checkOut ? (
          <button onClick={onCheckOut} className="w-full py-2 text-rose-600 hover:bg-rose-50">
            🔴 下課打卡下班
          </button>
        ) : (
          <div className="py-2 text-center text-emerald-600 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> 本堂已完成回報
          </div>
        )}
      </div>
    </div>
  )
}

const MENU_ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "預約試聽", icon: Calendar },
  { label: "課表查詢", icon: Clock },
  { label: "繳費資訊", icon: Wallet },
  { label: "活動報名", icon: PartyPopper },
  { label: "聯絡我們", icon: Phone },
  { label: "最新消息", icon: Megaphone },
]

function RichMenuMini() {
  return (
    <div className="bg-white border-t border-slate-200 grid grid-cols-3 grid-rows-2 gap-px" style={{ backgroundColor: LINE_GREEN }}>
      {MENU_ITEMS.map(item => {
        const Icon = item.icon
        return (
          <div key={item.label} className="bg-white flex flex-col items-center justify-center gap-0.5 py-2">
            <Icon className="w-3.5 h-3.5" style={{ color: LINE_GREEN_DARK }} />
            <span className="text-[8px] font-medium text-slate-700">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
