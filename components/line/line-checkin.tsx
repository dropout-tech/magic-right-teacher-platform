"use client"

import { useState } from "react"
import {
  MapPin,
  CalendarCheck,
  Clock,
  Coins,
  CheckCircle2,
  CircleDot,
  Receipt,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  courseSummary,
  isSessionDone,
  ongoingCourses as seedCourses,
  sessionHours,
  type CourseSession,
  type OngoingCourse,
} from "@/lib/line-data"
import { LinePhone, ChatBubble, SystemNote, CheckinCardBubble } from "@/components/line/line-phone"

function toMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m }
function fromMin(v: number) { return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}` }

function displayStatus(s: CourseSession): { label: string; color: string } {
  if (s.status === "leave") return { label: "請假順延", color: "bg-amber-100 text-amber-700" }
  if (s.status === "upcoming") return { label: "未開始", color: "bg-slate-100 text-slate-500" }
  if (isSessionDone(s)) return { label: "已完成", color: "bg-emerald-100 text-emerald-700" }
  if (s.checkIn) return { label: "上課中", color: "bg-blue-100 text-blue-700" }
  return { label: "今日待上課", color: "bg-blue-100 text-blue-700" }
}

export function LineCheckin() {
  const [courses, setCourses] = useState<OngoingCourse[]>(() =>
    seedCourses.map(c => ({ ...c, sessions: c.sessions.map(s => ({ ...s })) })),
  )
  const [selectedId, setSelectedId] = useState(seedCourses[0].id)

  const course = courses.find(c => c.id === selectedId)!
  const sum = courseSummary(course)
  const todaySession = course.sessions.find(s => s.status === "today")

  const patchToday = (patch: Partial<CourseSession>) =>
    setCourses(prev =>
      prev.map(c =>
        c.id !== selectedId ? c : { ...c, sessions: c.sessions.map(s => (s.status === "today" ? { ...s, ...patch } : s)) },
      ),
    )

  // demo：打卡時間對齊該堂課表（到場略早、結束略晚），讓時數與鐘點看起來真實
  const checkIn = () => { if (todaySession) patchToday({ checkIn: fromMin(toMin(todaySession.plannedStart) - 1) }) }
  const checkOut = () => { if (todaySession) patchToday({ checkOut: fromMin(toMin(todaySession.plannedEnd) + 2) }) }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* 左：進行中課程清單 */}
      <div className="space-y-3">
        {courses.map(c => {
          const s = courseSummary(c)
          const hasToday = c.sessions.some(d => d.status === "today")
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selectedId === c.id ? "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-200" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.teacherGrad} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {c.teacherName.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">{c.organization}</div>
                  <div className="text-xs text-slate-500 truncate">{c.teacherName}・{c.scheduleLabel}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.done / s.total) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{s.done}/{s.total} 堂</span>
              </div>
              {hasToday && (
                <Badge className="bg-blue-100 text-blue-700">今日 1 堂待上課</Badge>
              )}
            </button>
          )
        })}
        <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3 text-xs text-emerald-800 leading-relaxed flex gap-2">
          <Receipt className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          每堂打卡時數自動累計，月底直接帶入鐘點請款與對學校的課堂證明。
        </div>
      </div>

      {/* 右：課程詳情 + 場次表 + 手機打卡 */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-bold text-slate-800">{course.organization}</h2>
              <div className="text-sm text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1"><span className={`w-5 h-5 rounded-full bg-gradient-to-br ${course.teacherGrad} flex items-center justify-center text-white text-[10px] font-bold`}>{course.teacherName.charAt(0)}</span>{course.teacherName}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.scheduleLabel}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{course.location}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Mini icon={<CalendarCheck className="w-4 h-4" />} label="完成進度" value={`${sum.done}/${sum.total} 堂`} accent />
            <Mini icon={<Clock className="w-4 h-4" />} label="累計時數" value={`${sum.doneHours} 小時`} />
            <Mini icon={<Coins className="w-4 h-4" />} label="本期鐘點" value={`${sum.earned.toLocaleString()} 元`} accent />
            <Mini icon={<CheckCircle2 className="w-4 h-4" />} label="出勤率" value={`${sum.attendance}%`} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
          {/* 場次打卡表 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-800">每堂打卡紀錄</h3>
            </div>
            <div className="max-h-[460px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">堂次</th>
                    <th className="px-4 py-2.5 text-left font-medium">日期</th>
                    <th className="px-4 py-2.5 text-left font-medium">上課打卡</th>
                    <th className="px-4 py-2.5 text-left font-medium">下課打卡</th>
                    <th className="px-4 py-2.5 text-left font-medium">時數</th>
                    <th className="px-4 py-2.5 text-left font-medium">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {course.sessions.map(s => {
                    const d = displayStatus(s)
                    const isToday = s.status === "today"
                    return (
                      <tr key={s.no} className={isToday ? "bg-blue-50/50" : "hover:bg-slate-50"}>
                        <td className="px-4 py-2.5 font-medium text-slate-700">第 {s.no} 堂</td>
                        <td className="px-4 py-2.5 text-slate-500">{s.date.slice(5)}（{s.weekday}）</td>
                        <td className="px-4 py-2.5">
                          {s.checkIn ? (
                            <span className="text-emerald-700 font-medium">{s.checkIn}</span>
                          ) : isToday ? (
                            <button onClick={checkIn} className="text-xs px-2 py-1 rounded-md text-white" style={{ backgroundColor: "#06C755" }}>上課打卡</button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {s.checkOut ? (
                            <span className="text-emerald-700 font-medium">{s.checkOut}</span>
                          ) : isToday && s.checkIn ? (
                            <button onClick={checkOut} className="text-xs px-2 py-1 rounded-md bg-rose-500 text-white">下課打卡</button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{s.checkIn && s.checkOut ? `${sessionHours(s)}h` : isSessionDone(s) ? `${sessionHours(s)}h` : "—"}</td>
                        <td className="px-4 py-2.5">
                          <Badge className={d.color}>
                            {isToday && !s.checkIn && <CircleDot className="w-3 h-3 mr-1" />}
                            {d.label}
                          </Badge>
                          {s.note && <div className="text-[11px] text-amber-600 mt-1">{s.note}</div>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 老師端 LINE 打卡 */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-2">老師在 LINE 打卡的畫面（{course.teacherName}）</div>
            <LinePhone accountName="萊特魔數學院" showMenu>
              <SystemNote>今日課程提醒</SystemNote>
              <ChatBubble side="us" time="08:00" auto>
                老師早！今天 {todaySession ? `${todaySession.plannedStart}` : ""} {course.organization}，記得到場後上課打卡 📍
              </ChatBubble>
              {todaySession ? (
                <CheckinCardBubble
                  organization={course.organization}
                  sessionNo={todaySession.no}
                  planned={`${todaySession.plannedStart}–${todaySession.plannedEnd}`}
                  checkIn={todaySession.checkIn}
                  checkOut={todaySession.checkOut}
                  onCheckIn={checkIn}
                  onCheckOut={checkOut}
                />
              ) : (
                <ChatBubble side="them" time="—">本週課程都已完成打卡 🎉</ChatBubble>
              )}
              {todaySession?.checkIn && !todaySession?.checkOut && (
                <ChatBubble side="us" time={todaySession.checkIn} auto>已記錄上課 {todaySession.checkIn}，下課再回來打卡 👌</ChatBubble>
              )}
              {todaySession?.checkIn && todaySession?.checkOut && (
                <ChatBubble side="us" time={todaySession.checkOut} auto>本堂完成！時數 {sessionHours(todaySession)}h 已記入鐘點 ✅</ChatBubble>
              )}
            </LinePhone>
            <p className="text-[11px] text-slate-400 mt-2 text-center max-w-[260px]">
              點手機裡的「上課打卡 / 下課打卡」，左邊的紀錄與上方鐘點會即時更新。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Mini({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">{icon}{label}</div>
      <div className={`text-lg font-bold ${accent ? "text-emerald-600" : "text-slate-800"}`}>{value}</div>
    </div>
  )
}
