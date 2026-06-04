"use client"

import { useState } from "react"
import { Send, Megaphone, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { broadcastHistory, broadcastSegments, type BroadcastRecord } from "@/lib/line-data"
import { LinePhone, ChatBubble, SystemNote } from "@/components/line/line-phone"

export function LineBroadcast() {
  const [segId, setSegId] = useState(broadcastSegments[0].id)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [history, setHistory] = useState<BroadcastRecord[]>(broadcastHistory)
  const [justSent, setJustSent] = useState(false)

  const seg = broadcastSegments.find(s => s.id === segId)!
  const canSend = title.trim() && body.trim()

  const send = () => {
    if (!canSend) return
    const rec: BroadcastRecord = {
      id: `b${Date.now()}`,
      title: title.trim(),
      segment: seg.name,
      reach: seg.count,
      sentAt: "剛剛",
      openRate: 0,
    }
    setHistory(prev => [rec, ...prev])
    setJustSent(true)
    setTitle("")
    setBody("")
    setTimeout(() => setJustSent(false), 2500)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">群發中心</h1>
        <p className="text-sm text-slate-500 mt-1">依才藝、地區、接課狀態或方案分眾，一次把派課公告、師培報名、教材補貨提醒推給對的老師。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          {/* 分眾 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> 選擇分眾</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {broadcastSegments.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSegId(s.id)}
                  className={`text-left rounded-lg border-2 p-3 transition-all ${segId === s.id ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-sm">{s.name}</span>
                    {segId === s.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
                  <div className="text-xs font-bold text-emerald-600 mt-1">{s.count} 人</div>
                </button>
              ))}
            </div>
          </div>

          {/* 內容 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><Megaphone className="w-4 h-4 text-emerald-600" /> 訊息內容</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">標題</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="例：下學期三重國小魔術社團開放登記" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">內文</label>
              <Textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="輸入要群發的訊息內容..." />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-slate-500">將發送給 <b className="text-emerald-600">{seg.count}</b> 位（{seg.name}）</span>
              <Button onClick={send} disabled={!canSend} className="text-white" style={{ backgroundColor: canSend ? "#06C755" : "#cbd5e1" }}>
                <Send className="w-4 h-4 mr-1.5" /> 發送群發
              </Button>
            </div>
            {justSent && <div className="text-sm text-emerald-600 flex items-center gap-1.5"><Check className="w-4 h-4" /> 已送出！可在下方紀錄查看觸及與開封率。</div>}
          </div>

          {/* 紀錄 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-800 mb-3">發送紀錄</h2>
            <div className="divide-y divide-slate-100">
              {history.map(h => (
                <div key={h.id} className="py-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Megaphone className="w-4 h-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 truncate">{h.title}</div>
                    <div className="text-xs text-slate-400">{h.segment}・{h.sentAt}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{h.reach} 人</div>
                    <div className="text-xs text-slate-400">{h.openRate > 0 ? `開封 ${Math.round(h.openRate * 100)}%` : "統計中"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 手機預覽 */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-400 mb-2">老師收到的群發訊息</div>
          <LinePhone accountName="萊特魔數學院" showMenu>
            <SystemNote>官方帳號推播</SystemNote>
            {(title || body) ? (
              <ChatBubble side="them" time="剛剛">
                {title && <span className="font-bold block mb-1">📢 {title}</span>}
                {body}
              </ChatBubble>
            ) : (
              <ChatBubble side="them" time="剛剛"><span className="text-slate-400">在左邊輸入標題與內文，這裡會即時預覽…</span></ChatBubble>
            )}
          </LinePhone>
        </div>
      </div>
    </div>
  )
}
