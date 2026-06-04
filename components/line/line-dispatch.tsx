"use client"

import { useMemo, useState } from "react"
import {
  Send,
  MapPin,
  CalendarClock,
  Coins,
  Hourglass,
  Sparkles,
  Users,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  COURSE_STATUS_META,
  DISPATCH_REPLY_META,
  dispatchReplies as seedReplies,
  dispatchRequests,
  lineTeachers,
  matchTeachers,
  type DispatchReply,
  type DispatchReplyStatus,
} from "@/lib/line-data"
import { LinePhone, ChatBubble, DispatchCardBubble, SystemNote } from "@/components/line/line-phone"

function nowClock() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const teacherById = (id: string) => lineTeachers.find(t => t.id === id)!

export function LineDispatch() {
  const [selectedId, setSelectedId] = useState(dispatchRequests[0].id)
  const [replies, setReplies] = useState<Record<string, DispatchReply[]>>(() => ({ ...seedReplies }))
  const [dispatched, setDispatched] = useState<Record<string, boolean>>(() => ({ d1: true }))

  const req = dispatchRequests.find(r => r.id === selectedId)!
  const matched = useMemo(() => matchTeachers(req), [req])
  const reqReplies = replies[selectedId] ?? []
  const isDispatched = !!dispatched[selectedId]

  const replyOf = (teacherId: string): DispatchReply | undefined => reqReplies.find(r => r.teacherId === teacherId)

  const acceptedCount = reqReplies.filter(r => r.status === "accepted").length

  const doDispatch = () => {
    const initial: DispatchReply[] = matched.map(t => ({ teacherId: t.id, status: "sent" as DispatchReplyStatus, at: nowClock() }))
    setReplies(prev => ({ ...prev, [selectedId]: initial }))
    setDispatched(prev => ({ ...prev, [selectedId]: true }))
    // 模擬老師陸續回覆
    const id = selectedId
    setTimeout(() => {
      setReplies(prev => {
        const arr = [...(prev[id] ?? [])]
        if (arr[0]) arr[0] = { ...arr[0], status: "accepted", at: nowClock(), note: "我可以！時間剛好排得開" }
        if (arr[1]) arr[1] = { ...arr[1], status: "read", at: nowClock() }
        return { ...prev, [id]: arr }
      })
    }, 1300)
  }

  // 手機預覽用：取第一位候選老師的視角
  const phoneTeacher = matched[0]
  const phoneReply = phoneTeacher ? replyOf(phoneTeacher.id) : undefined
  const phoneDecided =
    phoneReply?.status === "accepted" ? "accepted" : phoneReply?.status === "declined" ? "declined" : null

  const setPhoneDecision = (decision: "accepted" | "declined") => {
    if (!phoneTeacher) return
    setReplies(prev => {
      const arr = [...(prev[selectedId] ?? [])]
      const idx = arr.findIndex(r => r.teacherId === phoneTeacher.id)
      const entry: DispatchReply = { teacherId: phoneTeacher.id, status: decision, at: nowClock(), note: decision === "accepted" ? "我要接！" : undefined }
      if (idx >= 0) arr[idx] = entry
      else arr.push(entry)
      return { ...prev, [selectedId]: arr }
    })
    if (!isDispatched) setDispatched(prev => ({ ...prev, [selectedId]: true }))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">派課中心</h1>
        <p className="text-sm text-slate-500 mt-1">
          有課程需求時，系統自動篩選出符合才藝、地區且開放接課的老師，一鍵推播到他們的 LINE，老師點一下就能回覆 —— 不用再一個一個問。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* 左：需求清單 */}
        <div className="space-y-3">
          {dispatchRequests.map(r => {
            const m = matchTeachers(r)
            const rr = replies[r.id] ?? []
            const acc = rr.filter(x => x.status === "accepted").length
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedId === r.id ? "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-200" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-sm">{r.organization}</span>
                  {dispatched[r.id] ? (
                    acc > 0 ? <Badge className="bg-emerald-100 text-emerald-700">{acc} 位接課</Badge> : <Badge className="bg-blue-100 text-blue-700">已推播</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700">待媒合</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] mb-2">
                  <span className="bg-emerald-50 text-emerald-700 rounded px-1.5 py-0.5">{r.talent}</span>
                  <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{r.courseType}</span>
                  <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{r.region}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" /> 符合老師 {m.length} 位</div>
              </button>
            )
          })}
        </div>

        {/* 右：需求詳情 + 配對 + 手機預覽 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-800 mb-3">{req.organization}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <Info icon={<Sparkles className="w-3.5 h-3.5" />} label="才藝">{req.talent}</Info>
              <Info icon={<MapPin className="w-3.5 h-3.5" />} label="地點">{req.location}</Info>
              <Info icon={<CalendarClock className="w-3.5 h-3.5" />} label="時段">{req.timeSlot}</Info>
              <Info icon={<Coins className="w-3.5 h-3.5" />} label="鐘點">{req.rate}</Info>
              <Info icon={<Hourglass className="w-3.5 h-3.5" />} label="堂數">{req.estimatedSessions} 堂</Info>
              <Info icon={<CalendarClock className="w-3.5 h-3.5" />} label="截止">{req.deadline}</Info>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* 配對老師 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> 自動配對 {matched.length} 位老師
                </h3>
                {!isDispatched ? (
                  <Button onClick={doDispatch} className="text-white" style={{ backgroundColor: "#06C755" }} size="sm">
                    <Send className="w-4 h-4 mr-1.5" /> 一鍵推播
                  </Button>
                ) : (
                  <span className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> 已推播・{acceptedCount} 位接課</span>
                )}
              </div>
              <div className="space-y-2">
                {matched.map(t => {
                  const r = replyOf(t.id)
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {t.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800">{t.name}</div>
                        <div className="text-xs text-slate-500 truncate">{t.city}・{t.talents.join("、")}</div>
                      </div>
                      <Badge className={`${COURSE_STATUS_META[t.courseStatus].color} whitespace-nowrap`}>{COURSE_STATUS_META[t.courseStatus].label}</Badge>
                      {r ? (
                        <Badge className={`${DISPATCH_REPLY_META[r.status].color} whitespace-nowrap`}>{DISPATCH_REPLY_META[r.status].label}</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-400 whitespace-nowrap">待推播</Badge>
                      )}
                    </div>
                  )
                })}
                {matched.length === 0 && <div className="text-sm text-slate-400 py-6 text-center">目前沒有符合條件的已綁定老師</div>}
              </div>
              {reqReplies.some(r => r.note) && (
                <div className="mt-3 space-y-1.5">
                  {reqReplies.filter(r => r.note).map(r => (
                    <div key={r.teacherId} className="text-xs text-slate-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                      <b>{teacherById(r.teacherId).name}</b>：{r.note}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 老師端 LINE 預覽 */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-400 mb-2">老師在 LINE 看到的畫面{phoneTeacher ? `（${phoneTeacher.name}）` : ""}</div>
              <LinePhone accountName="萊特魔數學院" showMenu>
                <SystemNote>課程媒合通知</SystemNote>
                <ChatBubble side="them" time="剛剛">老師好，有一筆新課程想邀請你 👇</ChatBubble>
                <DispatchCardBubble
                  organization={req.organization}
                  talent={req.talent}
                  timeSlot={req.timeSlot}
                  location={req.location}
                  rate={req.rate}
                  decided={phoneDecided}
                  onAccept={() => setPhoneDecision("accepted")}
                  onDecline={() => setPhoneDecision("declined")}
                />
                {phoneDecided === "accepted" && <ChatBubble side="us" time={nowClock()} auto>收到！已通知行政，會盡快與你確認細節 🙌</ChatBubble>}
              </LinePhone>
              <p className="text-[11px] text-slate-400 mt-2 text-center max-w-[260px]">
                點手機裡的「我要接課」看看 —— 老師的回覆會即時反映到左邊的配對清單。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">{icon}{label}</div>
      <div className="text-sm font-medium text-slate-800">{children}</div>
    </div>
  )
}
