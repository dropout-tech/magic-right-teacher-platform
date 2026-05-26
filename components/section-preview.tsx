// 老師後台「編輯區塊」上方的縮圖預覽 — 用簡單的 wireframe 圖示
// 不渲染真實 Section（避免性能開銷與深色背景違和），改用結構示意圖
"use client"

import { Eye } from "lucide-react"
import type { Teacher } from "@/lib/mock-data"

export type BlockKey = "profile" | "template" | "courses" | "gallery" | "testimonials" | "cases" | "social" | "contact"

const META: Record<BlockKey, { label: string; description: string; blockNumber: string }> = {
  profile:      { label: "Hero + 關於我", description: "頁面最上方主視覺與個人介紹", blockNumber: "01 · 02" },
  template:     { label: "整體版型風格", description: "切換 A/B/C 三種模板與區塊排序",       blockNumber: "全頁面" },
  courses:      { label: "教授課程",   description: "卡片陳列你能教的課程",          blockNumber: "03" },
  gallery:      { label: "教學成果",   description: "照片集 + 累計數據",            blockNumber: "04" },
  testimonials: { label: "客戶見證",   description: "影片 / 文字回饋切換",          blockNumber: "05" },
  cases:        { label: "案例分享",   description: "合作機構與專案說明",           blockNumber: "06" },
  social:       { label: "社群連結",   description: "FB / IG / YT / LINE",        blockNumber: "07" },
  contact:      { label: "聯絡與預約", description: "諮詢表單 + 聯絡方式",          blockNumber: "08" },
}

interface SectionPreviewProps {
  block: BlockKey
  teacher: Teacher
}

export function SectionPreview({ block, teacher }: SectionPreviewProps) {
  const meta = META[block]
  const accent = {
    A: "from-amber-500 to-yellow-600",
    B: "from-pink-500 to-orange-400",
    C: "from-red-600 to-rose-500",
  }[teacher.template]

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white/60">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Eye className="w-3.5 h-3.5" />
          <span>在公開頁面上的位置 · 區塊 {meta.blockNumber}</span>
        </div>
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r ${accent} text-white`}>
          套用模板 {teacher.template}
        </span>
      </div>
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-4 p-5">
        <BlockSchematic block={block} teacher={teacher} />
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-slate-800 mb-1">{meta.label}</div>
          <p className="text-sm text-slate-500 mb-3">{meta.description}</p>
          <ContentSummary block={block} teacher={teacher} />
        </div>
      </div>
    </div>
  )
}

function BlockSchematic({ block, teacher }: { block: BlockKey; teacher: Teacher }) {
  const tpl = teacher.template
  const surface =
    tpl === "A" ? "bg-[#0a0a0f] border border-amber-400/30" :
    tpl === "B" ? "bg-yellow-50 border-2 border-black" :
                  "bg-white border border-slate-300"

  const headingBar =
    tpl === "A" ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
    tpl === "B" ? "bg-pink-500" :
                  "bg-red-600"

  const fillBar =
    tpl === "A" ? "bg-amber-400/30" :
    tpl === "B" ? "bg-cyan-200 border border-black" :
                  "bg-slate-200"

  const dotPink =
    tpl === "A" ? "bg-amber-400" :
    tpl === "B" ? "bg-pink-500" :
                  "bg-red-600"

  return (
    <div className={`rounded-xl p-4 aspect-[5/3] ${surface} flex flex-col gap-2 overflow-hidden`}>
      {block === "profile" && (
        <div className="flex gap-3 items-center h-full">
          <div className={`w-14 h-14 rounded-full ${dotPink} flex-shrink-0`} />
          <div className="flex-1 space-y-1.5">
            <div className={`h-3 w-3/5 rounded ${headingBar}`} />
            <div className={`h-2 w-4/5 rounded ${fillBar}`} />
            <div className={`h-2 w-1/2 rounded ${fillBar}`} />
            <div className="flex gap-1 pt-1">
              <div className={`h-3 w-10 rounded ${dotPink}`} />
              <div className={`h-3 w-8 rounded ${fillBar}`} />
            </div>
          </div>
        </div>
      )}

      {block === "template" && (
        <div className="grid grid-cols-3 gap-2 h-full">
          {(["A", "B", "C"] as const).map(t => (
            <div key={t} className={`rounded ${t === tpl ? "ring-2 ring-red-500" : ""} ${
              t === "A" ? "bg-gradient-to-br from-slate-900 via-amber-700/40 to-black" :
              t === "B" ? "bg-gradient-to-br from-pink-300 via-yellow-200 to-cyan-200" :
                          "bg-gradient-to-br from-white via-slate-100 to-red-400 border border-slate-300"
            }`} />
          ))}
        </div>
      )}

      {block === "courses" && (
        <>
          <div className={`h-3 w-1/3 rounded ${headingBar}`} />
          <div className="grid grid-cols-3 gap-2 flex-1">
            {[0,1,2].map(i => (
              <div key={i} className={`rounded ${fillBar} p-1.5 flex flex-col gap-1`}>
                <div className={`h-1.5 w-2/3 rounded ${dotPink}`} />
                <div className="h-1 w-full rounded bg-current opacity-20" />
                <div className="h-1 w-1/2 rounded bg-current opacity-20" />
              </div>
            ))}
          </div>
        </>
      )}

      {block === "gallery" && (
        <>
          <div className={`h-3 w-1/3 rounded ${headingBar}`} />
          <div className="grid grid-cols-4 gap-1.5 flex-1">
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} className={`rounded ${fillBar} ${i % 5 === 0 ? dotPink : ""}`} />
            ))}
          </div>
        </>
      )}

      {block === "testimonials" && (
        <>
          <div className={`h-3 w-1/3 rounded ${headingBar}`} />
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className={`rounded ${fillBar} flex items-center justify-center`}>
              <div className={`w-6 h-6 rounded-full ${dotPink} flex items-center justify-center`}>
                <div className="w-0 h-0 border-l-[5px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
              </div>
            </div>
            <div className={`rounded ${fillBar} p-2 flex flex-col gap-1 justify-center`}>
              <div className="h-1.5 w-full rounded bg-current opacity-25" />
              <div className="h-1.5 w-3/4 rounded bg-current opacity-25" />
            </div>
          </div>
        </>
      )}

      {block === "cases" && (
        <>
          <div className={`h-3 w-1/3 rounded ${headingBar}`} />
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[0,1,2,3].map(i => (
              <div key={i} className={`rounded ${fillBar} p-1.5 flex gap-1.5 items-center`}>
                <div className={`w-5 h-5 rounded ${dotPink} flex-shrink-0`} />
                <div className="flex-1 space-y-1">
                  <div className="h-1 w-3/4 rounded bg-current opacity-30" />
                  <div className="h-1 w-1/2 rounded bg-current opacity-20" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {block === "social" && (
        <div className="flex items-center justify-center gap-3 h-full">
          {["FB", "IG", "YT", "LINE"].map(label => (
            <div key={label} className={`w-12 h-12 rounded-xl ${fillBar} flex items-center justify-center text-[10px] font-bold ${tpl === "A" ? "text-amber-300" : tpl === "B" ? "text-black" : "text-slate-700"}`}>
              {label}
            </div>
          ))}
        </div>
      )}

      {block === "contact" && (
        <>
          <div className={`h-3 w-1/3 rounded ${headingBar}`} />
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="space-y-1.5">
              <div className={`h-2 w-full rounded ${fillBar}`} />
              <div className={`h-2 w-full rounded ${fillBar}`} />
              <div className={`h-5 w-full rounded ${fillBar}`} />
              <div className={`h-3 w-1/2 rounded ${dotPink} mt-1`} />
            </div>
            <div className="space-y-1.5">
              <div className={`h-2 w-3/4 rounded ${fillBar}`} />
              <div className={`h-2 w-1/2 rounded ${fillBar}`} />
              <div className={`h-6 rounded bg-emerald-500/80 mt-2`} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ContentSummary({ block, teacher }: { block: BlockKey; teacher: Teacher }) {
  const Item = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  )

  const items: { label: string; value: React.ReactNode }[] =
    block === "profile" ? [
      { label: "目前藝名", value: teacher.name },
      { label: "Tagline", value: teacher.tagline.slice(0, 14) + (teacher.tagline.length > 14 ? "…" : "") },
      { label: "教學年資", value: `${teacher.yearsOfExperience} 年` },
    ] :
    block === "template" ? [
      { label: "目前模板", value: { A: "舞台魔術", B: "童趣派對", C: "雜誌編輯" }[teacher.template] },
      { label: "啟用區塊", value: `${teacher.blockOrder.length} 個` },
    ] :
    block === "courses" ? [
      { label: "目前課程數", value: `${teacher.courses.length} 門` },
      { label: "課程類型", value: [...new Set(teacher.courses.map(c => c.category))].join("、") || "—" },
    ] :
    block === "gallery" ? [
      { label: "累計教學時數", value: `${teacher.stats.totalHours.toLocaleString()} hr` },
      { label: "累計服務學生", value: `${teacher.stats.totalStudents.toLocaleString()} 位` },
    ] :
    block === "testimonials" ? [
      { label: "影片見證", value: `${teacher.testimonials.videos.length} 則` },
      { label: "文字見證", value: `${teacher.testimonials.texts.length} 則` },
    ] :
    block === "cases" ? [
      { label: "合作中", value: `${teacher.cases.filter(c => c.isOngoing).length} 間` },
      { label: "累計合作", value: `${teacher.cases.length} 間` },
    ] :
    block === "social" ? [
      { label: "已連結", value: `${[teacher.social.facebook, teacher.social.instagram, teacher.social.youtube, teacher.social.line].filter(Boolean).length} 個平台` },
      { label: "最近更新", value: teacher.social.lastUpdated },
    ] :
    /* contact */ [
      { label: "Email", value: teacher.contact.email || "—" },
      { label: "電話", value: teacher.contact.phone || "—" },
    ]

  return (
    <div className="space-y-1 border-t border-slate-100 pt-3">
      {items.map(it => <Item key={it.label} {...it} />)}
    </div>
  )
}
