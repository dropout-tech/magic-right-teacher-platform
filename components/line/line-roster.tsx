"use client"

import { useMemo, useState } from "react"
import { Search, Link2, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { COURSE_STATUS_META, lineStats, lineTeachers, type LineTeacher } from "@/lib/line-data"
import { LineLogo } from "@/components/line/line-phone"

const PLAN_LABELS: Record<LineTeacher["plan"], string> = { trial: "試用", basic: "基礎", pro: "進階", flagship: "旗艦" }
const REGIONS = ["全部", "北區", "中區", "南區"] as const

export function LineRoster() {
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("全部")
  const [onlyUnbound, setOnlyUnbound] = useState(false)

  const filtered = useMemo(() => {
    return lineTeachers.filter(t => {
      if (search && !t.name.includes(search) && !t.talents.some(s => s.includes(search))) return false
      if (region !== "全部" && t.region !== region) return false
      if (onlyUnbound && t.lineBound) return false
      return true
    })
  }, [search, region, onlyUnbound])

  const boundRate = Math.round((lineStats.boundTeachers / lineStats.totalTeachers) * 100)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">老師 LINE 名冊</h1>
        <p className="text-sm text-slate-500 mt-1">追蹤每位老師的 LINE 綁定狀態、才藝、地區與接課狀態；尚未綁定的老師可一鍵邀請。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Mini label="名單總數" value={`${lineStats.totalTeachers} 位`} />
        <Mini label="已綁定 LINE" value={`${lineStats.boundTeachers} 位`} accent />
        <Mini label="綁定率" value={`${boundRate}%`} accent />
        <Mini label="待邀請綁定" value={`${lineStats.totalTeachers - lineStats.boundTeachers} 位`} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋老師或才藝..." className="pl-8" />
        </div>
        <div className="flex gap-1.5">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${region === r ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{r}</button>
          ))}
        </div>
        <button onClick={() => setOnlyUnbound(v => !v)} className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${onlyUnbound ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>只看未綁定</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">老師</th>
              <th className="px-5 py-3 text-left font-medium">才藝</th>
              <th className="px-5 py-3 text-left font-medium">地區</th>
              <th className="px-5 py-3 text-left font-medium">接課狀態</th>
              <th className="px-5 py-3 text-left font-medium">LINE</th>
              <th className="px-5 py-3 text-left font-medium">對話 / 最近活躍</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 text-sm">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">{t.name.charAt(0)}</span>
                    <div>
                      <div className="font-medium text-slate-800">{t.name}</div>
                      <div className="text-xs text-slate-400">{PLAN_LABELS[t.plan]}方案</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.talents.map(s => <Badge key={s} variant="outline" className="text-[11px]">{s}</Badge>)}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{t.region}・{t.city}</td>
                <td className="px-5 py-3"><Badge className={COURSE_STATUS_META[t.courseStatus].color}>{COURSE_STATUS_META[t.courseStatus].label}</Badge></td>
                <td className="px-5 py-3">
                  {t.lineBound ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <span className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: "#06C755" }}><LineLogo className="w-3 h-3" /></span>
                      已綁定
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Link2 className="w-3 h-3 mr-1" /> 邀請綁定
                    </Button>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  <div className="flex items-center gap-1.5 text-xs">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {t.convCount} 則
                    <span className="text-slate-300">・</span>
                    {t.lastActive}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-400">沒有符合條件的老師</div>}
      </div>
    </div>
  )
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${accent ? "text-emerald-600" : "text-slate-800"}`}>{value}</div>
    </div>
  )
}
