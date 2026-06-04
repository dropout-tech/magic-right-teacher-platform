"use client"

import { useState } from "react"
import { Bot, Zap, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  autoReplyRules as seedRules,
  CATEGORY_META,
  lineStats,
  type AutoReplyRule,
} from "@/lib/line-data"

export function LineAutoReply() {
  const [rules, setRules] = useState<AutoReplyRule[]>(seedRules)

  const toggle = (id: string) =>
    setRules(prev => prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r)))

  const enabledHits = rules.filter(r => r.enabled).reduce((s, r) => s + r.hits, 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">自動回覆 / 關鍵字</h1>
        <p className="text-sm text-slate-500 mt-1">把最常被問的問題設成關鍵字自動回覆，家長半夜傳訊也能立刻得到答案，行政只需處理真正需要人的對話。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><Bot className="w-4 h-4" /> 本月自動回覆</div>
          <div className="text-2xl font-bold text-slate-800">{lineStats.monthAutoReplies.toLocaleString()} 則</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><Zap className="w-4 h-4" /> 啟用中規則命中</div>
          <div className="text-2xl font-bold text-slate-800">{enabledHits.toLocaleString()} 次</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><Zap className="w-4 h-4" /> 自動處理率</div>
          <div className="text-2xl font-bold text-emerald-600">{Math.round(lineStats.autoHandledRate * 100)}%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">關鍵字規則（{rules.filter(r => r.enabled).length}/{rules.length} 啟用）</h2>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Plus className="w-4 h-4" /> 新增規則</button>
        </div>
        <div className="divide-y divide-slate-100">
          {rules.map(rule => (
            <div key={rule.id} className={`p-4 flex gap-4 items-start transition-colors ${rule.enabled ? "" : "bg-slate-50/60 opacity-70"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {rule.keywords.map(k => (
                    <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                  ))}
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${CATEGORY_META[rule.category].color}`}>{CATEGORY_META[rule.category].label}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{rule.response}</p>
                <div className="text-xs text-slate-400 mt-2">累計命中 {rule.hits.toLocaleString()} 次</div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggle(rule.id)} className="data-[state=checked]:bg-emerald-500 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
