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
  Plus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ALL_REGIONS,
  ALL_TALENTS,
  COURSE_STATUS_META,
  DISPATCH_REPLY_META,
  dispatchReplies as seedReplies,
  dispatchRequests,
  lineTeachers,
  matchTeachers,
  ongoingCourses,
  previewMatch,
  type DispatchReply,
  type DispatchReplyStatus,
  type DispatchRequest,
  type Region,
} from "@/lib/line-data"
import { LinePhone, ChatBubble, DispatchCardBubble, SystemNote } from "@/components/line/line-phone"
import { LineCheckin } from "@/components/line/line-checkin"

function nowClock() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const teacherById = (id: string) => lineTeachers.find(t => t.id === id)!

export function LineDispatch() {
  const [tab, setTab] = useState<"matching" | "checkin">("matching")
  const todayCount = ongoingCourses.filter(c => c.sessions.some(s => s.status === "today")).length
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">派課中心</h1>
        <p className="text-sm text-slate-500 mt-1">
          {tab === "matching"
            ? "有課程需求時，系統自動篩選出符合才藝、地區且開放接課的老師，一鍵推播到他們的 LINE，老師點一下就能回覆。"
            : "長期課程每堂課的上課／下課打卡，老師在 LINE 一鍵回報，行政即時掌握出勤與鐘點，月底自動帶入請款。"}
        </p>
      </div>
      <div className="flex gap-6 border-b border-slate-200">
        <TabBtn active={tab === "matching"} onClick={() => setTab("matching")} label="派課媒合" />
        <TabBtn active={tab === "checkin"} onClick={() => setTab("checkin")} label="打卡回報" badge={todayCount > 0 ? `今日 ${todayCount} 堂` : undefined} />
      </div>
      {tab === "matching" ? <MatchingView /> : <LineCheckin />}
    </div>
  )
}

function TabBtn({ active, onClick, label, badge }: { active: boolean; onClick: () => void; label: string; badge?: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative -mb-px pb-2.5 pt-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
      style={{ borderColor: active ? "#06C755" : "transparent" }}
    >
      {label}
      {badge && <span className="text-[11px] bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5">{badge}</span>}
    </button>
  )
}

function MatchingView() {
  const [requests, setRequests] = useState<DispatchRequest[]>(dispatchRequests)
  const [selectedId, setSelectedId] = useState(dispatchRequests[0].id)
  const [replies, setReplies] = useState<Record<string, DispatchReply[]>>(() => ({ ...seedReplies }))
  const [dispatched, setDispatched] = useState<Record<string, boolean>>(() => ({ d1: true }))
  const [showForm, setShowForm] = useState(false)

  const addRequest = (r: DispatchRequest) => {
    setRequests(prev => [r, ...prev])
    setSelectedId(r.id)
    setShowForm(false)
  }

  const req = requests.find(r => r.id === selectedId)!
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
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* 左：需求清單 */}
        <div className="space-y-3">
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50/60 py-3 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> 新增派課需求
          </button>
          {requests.map(r => {
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

      {showForm && <NewRequestModal onClose={() => setShowForm(false)} onCreate={addRequest} />}
    </div>
  )
}

// 新增派課需求：推播對象依「才藝標籤 + 地區」設定，並即時預覽符合老師
function NewRequestModal({ onClose, onCreate }: { onClose: () => void; onCreate: (r: DispatchRequest) => void }) {
  const [organization, setOrganization] = useState("")
  const [courseType, setCourseType] = useState("社團課程")
  const [talents, setTalents] = useState<string[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [location, setLocation] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [sessions, setSessions] = useState("")
  const [rate, setRate] = useState("")
  const [deadline, setDeadline] = useState("")

  const matched = useMemo(() => previewMatch(talents, regions), [talents, regions])
  const canCreate = organization.trim() && talents.length > 0

  const toggleTalent = (t: string) =>
    setTalents(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]))
  const toggleRegion = (r: Region) =>
    setRegions(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]))

  const submit = () => {
    if (!canCreate) return
    const n = Number(sessions) || 0
    onCreate({
      id: `d-${Date.now()}`,
      organization: organization.trim(),
      courseType,
      talent: talents[0],
      region: regions[0] ?? "北區",
      location: location.trim() || "—",
      timeSlot: timeSlot.trim() || "時段待定",
      estimatedSessions: n,
      rate: rate.trim() || "面議",
      deadline: deadline.trim() || "—",
      status: "matching",
      targetTalents: talents,
      targetRegions: regions,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-600" /> 新增派課需求</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="機構 / 課程名稱" required>
            <Input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="例：三重國小課後照顧" />
          </Field>

          <Field label="課程類型">
            <div className="flex flex-wrap gap-2">
              {["社團課程", "營隊課程", "活動表演", "到府教學"].map(c => (
                <Chip key={c} active={courseType === c} onClick={() => setCourseType(c)}>{c}</Chip>
              ))}
            </div>
          </Field>

          {/* 推播對象 — 才藝標籤 */}
          <Field label="推播對象 ① 才藝標籤" required hint="可複選；老師才藝命中任一即收到推播">
            <div className="flex flex-wrap gap-1.5">
              {ALL_TALENTS.map(t => (
                <Chip key={t} active={talents.includes(t)} onClick={() => toggleTalent(t)}>{t}</Chip>
              ))}
            </div>
          </Field>

          {/* 推播對象 — 地區 */}
          <Field label="推播對象 ② 地區" hint="不選＝不限地區（氣球等表演類預設可跨區）">
            <div className="flex flex-wrap gap-1.5">
              {ALL_REGIONS.map(r => (
                <Chip key={r} active={regions.includes(r)} onClick={() => toggleRegion(r)}>{r}</Chip>
              ))}
              <Chip active={regions.length === 0} onClick={() => setRegions([])}>不限地區</Chip>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="地點"><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="台北市大安區" /></Field>
            <Field label="堂數"><Input value={sessions} onChange={e => setSessions(e.target.value)} placeholder="16" inputMode="numeric" /></Field>
            <Field label="時段"><Input value={timeSlot} onChange={e => setTimeSlot(e.target.value)} placeholder="每週三 15:30–17:00" /></Field>
            <Field label="鐘點"><Input value={rate} onChange={e => setRate(e.target.value)} placeholder="1,000 / 堂" /></Field>
            <Field label="報名截止"><Input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="2026-06-30" /></Field>
          </div>

          {/* 即時預覽符合老師 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="text-xs text-emerald-800 font-bold mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 符合條件 {matched.length} 位老師將收到推播
            </div>
            {talents.length === 0 ? (
              <div className="text-xs text-emerald-700/70">請先選擇至少一個才藝標籤</div>
            ) : matched.length === 0 ? (
              <div className="text-xs text-emerald-700/70">目前沒有符合的已綁定老師，試試放寬地區或標籤</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matched.map(t => (
                  <span key={t.id} className="inline-flex items-center gap-1 bg-white rounded-full pl-1 pr-2.5 py-0.5 text-[11px] text-slate-700 border border-emerald-100">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">{t.name.charAt(0)}</span>
                    {t.name}・{t.city}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={submit} disabled={!canCreate} className="text-white" style={{ backgroundColor: canCreate ? "#06C755" : "#cbd5e1" }}>
            <Check className="w-4 h-4 mr-1.5" /> 建立並進入媒合
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
        {label}{required && <span className="text-rose-500">*</span>}
        {hint && <span className="font-normal text-slate-400">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
        active ? "text-white border-transparent" : "text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
      style={active ? { backgroundColor: "#06C755" } : undefined}
    >
      {children}
    </button>
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
