"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Info,
  Layout,
  LayoutGrid,
  Megaphone,
  Palette,
  PartyPopper,
  Phone,
  Rocket,
  Sparkles,
  Upload,
  Users,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const LINE_GREEN = "#06C755"
const LINE_GREEN_DARK = "#04A647"

// LINE 圖示（內嵌 SVG 避免外部依賴 / 商標風險）
function LineIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={LINE_GREEN} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 5.866 2 10.6c0 4.243 3.553 7.798 8.358 8.47.325.07.768.215.88.494.1.252.066.647.032.902 0 0-.117.706-.142.857-.043.252-.2.987.866.538 1.066-.45 5.747-3.385 7.84-5.793 1.444-1.583 2.166-3.187 2.166-4.968C22 5.866 17.523 2 12 2zM8.5 13.5h-2c-.276 0-.5-.224-.5-.5V9c0-.276.224-.5.5-.5s.5.224.5.5v3.5h1.5c.276 0 .5.224.5.5s-.224.5-.5.5zm2-.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9c0-.276.224-.5.5-.5s.5.224.5.5v4zm5 0c0 .215-.138.406-.342.473-.052.018-.105.027-.158.027-.156 0-.305-.073-.4-.2L12.5 10.5V13c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9c0-.215.138-.406.342-.473.205-.066.43.01.558.18L14.5 11.5V9c0-.276.224-.5.5-.5s.5.224.5.5v4zm3-2.5c.276 0 .5.224.5.5s-.224.5-.5.5h-1.5v1h1.5c.276 0 .5.224.5.5s-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5V9c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-1.5v1h1.5z"/>
    </svg>
  )
}

// ===== 型別 =====
type SchoolType = "talent" | "academic" | "music" | "art" | "sports"
type Audience = "students" | "parents" | "both"
type Style = "lively" | "professional" | "warm"
type FeatureKey = "booking" | "schedule" | "payment" | "events" | "contact" | "news"
type MenuStyleId = "lively" | "minimal" | "warm"

// 六宮格內的固定 6 個常見功能（每個風格範本都會畫好這 6 個圖示）
const MENU_FUNCTIONS: { id: FeatureKey; label: string; icon: LucideIcon }[] = [
  { id: "booking",  label: "預約試聽", icon: Calendar },
  { id: "schedule", label: "課表查詢", icon: Clock },
  { id: "payment",  label: "繳費資訊", icon: Wallet },
  { id: "events",   label: "活動報名", icon: PartyPopper },
  { id: "contact",  label: "聯絡老師", icon: Phone },
  { id: "news",     label: "最新消息", icon: Megaphone },
]

interface FormData {
  schoolName: string
  schoolType: SchoolType | null
  audience: Audience | null
  features: FeatureKey[]
  style: Style | null
  brandColor: string
}

const INITIAL_DATA: FormData = {
  schoolName: "",
  schoolType: null,
  audience: null,
  features: [],
  style: null,
  brandColor: LINE_GREEN,
}

const STEPS = [
  { id: 1, name: "開始", phase: "intro" as const },
  { id: 2, name: "了解需求", phase: "generate" as const },
  { id: 3, name: "選擇選單", phase: "generate" as const },
  { id: 4, name: "確認文案", phase: "generate" as const },
  { id: 5, name: "申請 LINE OA", phase: "deploy" as const },
  { id: 6, name: "上傳到 LINE", phase: "deploy" as const },
  { id: 7, name: "完成", phase: "done" as const },
]

// ===== 主元件 =====
export function LineOaSetup() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(INITIAL_DATA)
  const [selectedStyle, setSelectedStyle] = useState<MenuStyleId>("lively")

  const next = () => setStep(s => Math.min(s + 1, STEPS.length))
  const prev = () => setStep(s => Math.max(s - 1, 1))
  const goto = (s: number) => setStep(s)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <LineIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">LINE 官方帳號設定</h1>
          <p className="text-sm text-slate-500">7 個步驟建立你的 LINE 官方帳號，包含設計好的圖文選單、歡迎詞與自動回覆建議</p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} onJump={goto} />

      {/* Step content */}
      <div className="mt-6">
        {step === 1 && <Step1Intro onNext={next} />}
        {step === 2 && (
          <Step2Questionnaire
            data={data}
            setData={setData}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 3 && (
          <Step3MenuTemplate
            data={data}
            selected={selectedStyle}
            onSelect={setSelectedStyle}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 4 && (
          <Step4Messages data={data} onNext={next} onPrev={prev} />
        )}
        {step === 5 && <Step5CreateLineOa onNext={next} onPrev={prev} />}
        {step === 6 && (
          <Step6UploadToLine
            data={data}
            style={selectedStyle}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 7 && <Step7Done onRestart={() => { setStep(1); setData(INITIAL_DATA) }} />}
      </div>
    </div>
  )
}

// ===== 步驟指示器 =====
function StepIndicator({ current, onJump }: { current: number; onJump: (s: number) => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mt-4">
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((s, idx) => {
          const done = s.id < current
          const active = s.id === current
          const canJump = s.id <= current
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <button
                disabled={!canJump}
                onClick={() => canJump && onJump(s.id)}
                className={`flex flex-col items-center gap-1.5 min-w-0 px-1 ${canJump ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? "text-white"
                      : active
                      ? "ring-2 ring-offset-2 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                  style={
                    done
                      ? { backgroundColor: LINE_GREEN }
                      : active
                      ? { backgroundColor: LINE_GREEN, ['--tw-ring-color' as any]: LINE_GREEN + "40" }
                      : undefined
                  }
                >
                  {done ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span
                  className={`text-[11px] font-medium truncate max-w-[60px] ${
                    active ? "text-slate-800" : done ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {s.name}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 mb-5"
                  style={{ backgroundColor: s.id < current ? LINE_GREEN : "#e2e8f0" }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== Step 1: 介紹 =====
function Step1Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <Badge
              className="self-start mb-3 text-white"
              style={{ backgroundColor: LINE_GREEN }}
            >
              預計 30 分鐘完成
            </Badge>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              用 7 步驟，建立你的 LINE 官方帳號
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              不用會設計、不用懂技術，照著步驟做就好：
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "簡單問卷了解你的教學特色",
                "從三種設計風格挑一張圖文選單",
                "建議文案直接複製，也可以自己改",
                "圖文教學教你貼到 LINE 後台",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: LINE_GREEN }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              onClick={onNext}
              className="self-start text-white"
              style={{ backgroundColor: LINE_GREEN }}
            >
              開始設定
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 min-h-[300px] flex items-center justify-center p-8">
            <HeroMenuMockup />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: LayoutGrid,
            title: "三種設計風格",
            desc: "活潑、簡約、溫馨各一張，6 個常見功能圖示都畫好了",
          },
          {
            icon: Palette,
            title: "可挑可改",
            desc: "選好風格可調主色，建議文案可逐字編輯",
          },
          {
            icon: Rocket,
            title: "圖文教學",
            desc: "每一步都有截圖告訴你在 LINE 後台要點哪裡",
          },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: LINE_GREEN + "1a", color: LINE_GREEN }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 mb-1">{f.title}</div>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          )
        })}
      </div>

      <InfoCard>
        <strong>注意：</strong>本版本不會自動連結到你的 LINE 帳號，所有產出的素材會以圖片和文字呈現，你需要自行登入 LINE Official Account Manager 後台貼上設定。我們會手把手教你怎麼做。
      </InfoCard>
    </div>
  )
}

// ===== Step 2: 問卷 =====
const SCHOOL_TYPES: { id: SchoolType; label: string; emoji: string }[] = [
  { id: "talent",   label: "才藝 / 興趣", emoji: "🎨" },
  { id: "academic", label: "學科 / 升學", emoji: "📚" },
  { id: "music",    label: "樂器 / 音樂", emoji: "🎵" },
  { id: "art",      label: "美術 / 手作", emoji: "🖌️" },
  { id: "sports",   label: "運動 / 體能", emoji: "🤸" },
]

const AUDIENCES: { id: Audience; label: string; desc: string }[] = [
  { id: "students", label: "學生", desc: "語氣輕鬆、貼近孩子" },
  { id: "parents", label: "家長", desc: "正式、強調安心與成效" },
  { id: "both", label: "都會用", desc: "中性，兩邊都看得懂" },
]

const FEATURES: { id: FeatureKey; label: string; desc: string }[] = [
  { id: "booking", label: "預約試聽", desc: "連到試聽報名表單" },
  { id: "schedule", label: "課表查詢", desc: "提供本週/本月課表" },
  { id: "payment", label: "繳費提醒", desc: "顯示繳費資訊" },
  { id: "events", label: "活動報名", desc: "營隊、講座、比賽" },
  { id: "contact", label: "聯絡老師", desc: "電話、地址、營業時間" },
  { id: "news", label: "最新消息", desc: "公告、優秀學員、放假通知" },
]

const STYLES: { id: Style; label: string; desc: string; bg: string }[] = [
  { id: "lively", label: "活潑有趣", desc: "明亮配色、表情符號多", bg: "from-yellow-300 to-orange-400" },
  { id: "professional", label: "專業正式", desc: "深色、克制、強調品質", bg: "from-slate-700 to-slate-900" },
  { id: "warm", label: "溫馨親切", desc: "暖色系、柔和", bg: "from-rose-300 to-orange-300" },
]

function Step2Questionnaire({
  data,
  setData,
  onNext,
  onPrev,
}: {
  data: FormData
  setData: (d: FormData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const toggleFeature = (id: FeatureKey) => {
    setData({
      ...data,
      features: data.features.includes(id)
        ? data.features.filter(f => f !== id)
        : [...data.features, id],
    })
  }

  const canProceed =
    data.schoolName.trim() &&
    data.schoolType &&
    data.audience &&
    data.features.length > 0 &&
    data.style

  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Users className="w-5 h-5" />}
        title="先了解你的教學"
        desc="這 5 個問題會決定後續產生的圖文選單和文案風格"
      >
        {/* Q1: 名字 / 品牌名稱 */}
        <Field label="你的名字 / 品牌名稱" required>
          <Input
            value={data.schoolName}
            onChange={e => setData({ ...data, schoolName: e.target.value })}
            placeholder="例如：猴子老師、Pringle 動力機械"
          />
        </Field>

        {/* Q2: 教學類型 */}
        <Field label="你主要教什麼" required>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {SCHOOL_TYPES.map(t => (
              <OptionButton
                key={t.id}
                active={data.schoolType === t.id}
                onClick={() => setData({ ...data, schoolType: t.id })}
              >
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="text-xs font-medium">{t.label}</div>
              </OptionButton>
            ))}
          </div>
        </Field>

        {/* Q3: 主客群 */}
        <Field label="主要客群是誰" required hint="影響文案語氣">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {AUDIENCES.map(a => (
              <OptionButton
                key={a.id}
                active={data.audience === a.id}
                onClick={() => setData({ ...data, audience: a.id })}
              >
                <div className="font-bold text-sm mb-0.5">{a.label}</div>
                <div className="text-xs text-slate-500">{a.desc}</div>
              </OptionButton>
            ))}
          </div>
        </Field>

        {/* Q4: 功能多選 */}
        <Field
          label="你希望 LINE 選單能做什麼？"
          required
          hint={`至少選 1 個，已選 ${data.features.length} 個（建議 4–6 個）`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {FEATURES.map(f => {
              const active = data.features.includes(f.id)
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFeature(f.id)}
                  className={`relative text-left p-3 rounded-lg border-2 transition-all ${
                    active
                      ? "bg-white"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  style={active ? { borderColor: LINE_GREEN, backgroundColor: LINE_GREEN + "0d" } : undefined}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0`}
                      style={
                        active
                          ? { backgroundColor: LINE_GREEN, borderColor: LINE_GREEN }
                          : { borderColor: "#cbd5e1" }
                      }
                    >
                      {active && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-slate-800">{f.label}</div>
                      <div className="text-xs text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Field>

        {/* Q5: 風格 */}
        <Field label="想要的視覺風格" required>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STYLES.map(s => {
              const active = data.style === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, style: s.id })}
                  className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                    active ? "ring-2 ring-offset-2" : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={
                    active
                      ? { borderColor: LINE_GREEN, ['--tw-ring-color' as any]: LINE_GREEN + "60" }
                      : undefined
                  }
                >
                  <div className={`h-20 bg-gradient-to-br ${s.bg}`} />
                  <div className="p-3 bg-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-sm text-slate-800">{s.label}</span>
                      {active && <Check className="w-3.5 h-3.5" style={{ color: LINE_GREEN }} />}
                    </div>
                    <div className="text-xs text-slate-500">{s.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </Field>

        {/* Q6: 主色 */}
        <Field label="品牌主色" hint="選單按鈕和標題會用這個顏色">
          <div className="flex items-center gap-3 flex-wrap">
            {[LINE_GREEN, "#e11d48", "#f59e0b", "#3b82f6", "#8b5cf6", "#0f172a"].map(c => (
              <button
                key={c}
                onClick={() => setData({ ...data, brandColor: c })}
                className={`w-10 h-10 rounded-full transition-all ${
                  data.brandColor === c ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">自訂</span>
              <input
                type="color"
                value={data.brandColor}
                onChange={e => setData({ ...data, brandColor: e.target.value })}
                className="w-10 h-10 rounded-full cursor-pointer border-0"
              />
            </div>
          </div>
        </Field>
      </SectionCard>

      <StepNav
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={!canProceed}
        nextLabel="產生圖文選單"
      />
    </div>
  )
}

// ===== Step 3: 選擇圖文選單風格 =====
const MENU_STYLES: {
  id: MenuStyleId
  name: string
  desc: string
  badge?: string
  bestFor: string
}[] = [
  {
    id: "lively",
    name: "活潑童趣",
    desc: "圓潤造型 + 彩色圖示，按鈕邊框柔和",
    badge: "最受歡迎",
    bestFor: "適合：才藝老師、教小朋友、給家長和孩子看",
  },
  {
    id: "minimal",
    name: "簡約專業",
    desc: "線條圖示 + 主色一致，乾淨俐落",
    bestFor: "適合：學科 / 升學取向、強調專業度的老師",
  },
  {
    id: "warm",
    name: "溫馨手感",
    desc: "柔和暖色 + 圓形圖示，親切不嚴肅",
    bestFor: "適合：親子取向、想與學員建立長期關係的老師",
  },
]

function Step3MenuTemplate({
  data,
  selected,
  onSelect,
  onNext,
  onPrev,
}: {
  data: FormData
  selected: MenuStyleId
  onSelect: (id: MenuStyleId) => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Layout className="w-5 h-5" />}
        title="選擇圖文選單風格"
        desc="三張預先設計好的範本，每張都包含完整 6 個常見功能圖示。挑一張你喜歡的就好。"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {MENU_STYLES.map(style => {
            const active = selected === style.id
            return (
              <button
                key={style.id}
                onClick={() => onSelect(style.id)}
                className={`text-left rounded-xl border-2 overflow-hidden transition-all bg-white ${
                  active ? "ring-2 ring-offset-2" : "border-slate-200 hover:border-slate-300"
                }`}
                style={
                  active
                    ? { borderColor: LINE_GREEN, ['--tw-ring-color' as any]: LINE_GREEN + "60" }
                    : undefined
                }
              >
                <div className="p-3 bg-slate-50 border-b border-slate-200 relative">
                  {style.badge && (
                    <span
                      className="absolute top-2 right-2 z-10 text-[10px] font-bold text-white px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: LINE_GREEN }}
                    >
                      {style.badge}
                    </span>
                  )}
                  <MenuPreview styleId={style.id} brandColor={data.brandColor} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{style.name}</span>
                    {active && <Check className="w-4 h-4 ml-auto" style={{ color: LINE_GREEN }} />}
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{style.desc}</p>
                  <p className="text-xs text-slate-400">{style.bestFor}</p>
                </div>
              </button>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard
        icon={<Sparkles className="w-5 h-5" />}
        title="預覽：在 LINE 看起來的樣子"
        desc="這是模擬畫面，實際在手機 LINE 上會像這樣"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <PhoneFrame>
            <MenuPreview styleId={selected} brandColor={data.brandColor} size="lg" />
          </PhoneFrame>
          <div className="flex-1 space-y-3 w-full">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                這張選單上的 6 個按鈕
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MENU_FUNCTIONS.map((fn, i) => {
                  const Icon = fn.icon
                  return (
                    <div key={fn.id} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: data.brandColor + "1a", color: data.brandColor }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-700">
                        {i + 1}. {fn.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                所有風格都包含這 6 個常見功能。實際上線後，每個按鈕都要在 LINE 後台設定要連到哪裡（網站連結、或觸發特定訊息）。
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <StepNav onPrev={onPrev} onNext={onNext} nextLabel="產生文案" />
    </div>
  )
}

// 圖文選單預覽：依風格渲染 6 宮格（每格用設計好的功能圖示）
function MenuPreview({
  styleId,
  brandColor,
  size = "md",
}: {
  styleId: MenuStyleId
  brandColor: string
  size?: "md" | "lg"
}) {
  return (
    <div
      className="relative w-full aspect-[2500/1686] rounded-md overflow-hidden"
      style={{ backgroundColor: gapColor(styleId, brandColor) }}
    >
      <div
        className="absolute inset-0 grid p-[2px] gap-[2px]"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
        }}
      >
        {MENU_FUNCTIONS.map((fn, i) => (
          <MenuCell key={fn.id} styleId={styleId} fn={fn} index={i} brandColor={brandColor} size={size} />
        ))}
      </div>
    </div>
  )
}

function gapColor(styleId: MenuStyleId, brandColor: string): string {
  if (styleId === "minimal") return brandColor
  if (styleId === "warm") return "#FDE68A"
  return brandColor
}

function MenuCell({
  styleId,
  fn,
  index,
  brandColor,
  size,
}: {
  styleId: MenuStyleId
  fn: typeof MENU_FUNCTIONS[number]
  index: number
  brandColor: string
  size: "md" | "lg"
}) {
  const Icon = fn.icon
  const iconClass = size === "lg" ? "w-7 h-7" : "w-4 h-4"
  const labelSize = size === "lg" ? "text-[11px]" : "text-[8px]"

  if (styleId === "lively") {
    const palette = ["#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#0EA5E9", "#F97316"]
    const color = palette[index]
    return (
      <div className="bg-white flex flex-col items-center justify-center gap-1 p-1">
        <div
          className={`rounded-full flex items-center justify-center ${size === "lg" ? "p-2" : "p-1"}`}
          style={{ backgroundColor: color + "22" }}
        >
          <Icon className={iconClass} style={{ color }} strokeWidth={2.5} />
        </div>
        <span className={`font-bold text-slate-800 leading-tight ${labelSize}`}>{fn.label}</span>
      </div>
    )
  }

  if (styleId === "minimal") {
    return (
      <div className="bg-white flex flex-col items-center justify-center gap-1 p-1">
        <Icon className={iconClass} style={{ color: brandColor }} strokeWidth={1.5} />
        <span className={`font-medium text-slate-700 leading-tight tracking-wide ${labelSize}`}>
          {fn.label}
        </span>
      </div>
    )
  }

  const warmPalette = [
    { bg: "#FFE4E6", color: "#E11D48" },
    { bg: "#FEF3C7", color: "#D97706" },
    { bg: "#FEE2E2", color: "#DC2626" },
    { bg: "#FCE7F3", color: "#DB2777" },
    { bg: "#FFEDD5", color: "#EA580C" },
    { bg: "#FEF9C3", color: "#CA8A04" },
  ]
  const { bg, color } = warmPalette[index]
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-1" style={{ backgroundColor: bg }}>
      <div className={`rounded-full flex items-center justify-center bg-white/60 ${size === "lg" ? "p-1.5" : "p-1"}`}>
        <Icon className={iconClass} style={{ color }} strokeWidth={2} />
      </div>
      <span className={`font-medium leading-tight ${labelSize}`} style={{ color }}>
        {fn.label}
      </span>
    </div>
  )
}

// 給 Step 1 hero 用的迷你預覽
function HeroMenuMockup() {
  return (
    <div className="w-full max-w-[260px]">
      <PhoneFrame>
        <MenuPreview styleId="lively" brandColor={LINE_GREEN} size="lg" />
      </PhoneFrame>
    </div>
  )
}


function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[260px] flex-shrink-0">
      <div className="rounded-[2rem] border-[10px] border-slate-900 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="bg-slate-100 aspect-[9/16] flex flex-col">
          {/* 假對話區 */}
          <div className="flex-1 p-3 space-y-2 overflow-hidden text-[10px]">
            <div className="self-start max-w-[80%] bg-white rounded-2xl px-3 py-1.5 shadow-sm">
              歡迎加入！
            </div>
            <div className="self-start max-w-[80%] bg-white rounded-2xl px-3 py-1.5 shadow-sm">
              點下方選單可以開始使用 👇
            </div>
          </div>
          {/* 圖文選單 */}
          <div className="bg-white p-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ===== Step 4: 確認歡迎詞 + FAQ =====
function Step4Messages({
  data,
  onNext,
  onPrev,
}: {
  data: FormData
  onNext: () => void
  onPrev: () => void
}) {
  const generated = useMemo(() => generateContent(data), [data])
  const [welcome, setWelcome] = useState(generated.welcome)
  const [faqs, setFaqs] = useState(generated.faqs)

  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Sparkles className="w-5 h-5" />}
        title="歡迎訊息"
        desc="當有人加你的 LINE 好友時，會自動收到這段訊息"
      >
        <Textarea
          value={welcome}
          onChange={e => setWelcome(e.target.value)}
          rows={6}
          className="font-medium"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-500">建議長度：100–200 字。可以使用表情符號讓訊息更親切。</p>
          <CopyButton text={welcome} />
        </div>
      </SectionCard>

      <SectionCard
        icon={<Sparkles className="w-5 h-5" />}
        title="常見問題自動回覆"
        desc={`依你選的功能自動生成 ${faqs.length} 組關鍵字回覆。當用戶傳訊息包含關鍵字時，會自動回應對應內容。`}
      >
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <div className="grid md:grid-cols-[160px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    關鍵字
                  </label>
                  <Input
                    value={faq.keywords.join(", ")}
                    onChange={e => {
                      const next = [...faqs]
                      next[i] = { ...faq, keywords: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }
                      setFaqs(next)
                    }}
                    className="text-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">用逗號分隔多個關鍵字</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      回覆內容
                    </label>
                    <CopyButton text={faq.response} small />
                  </div>
                  <Textarea
                    value={faq.response}
                    onChange={e => {
                      const next = [...faqs]
                      next[i] = { ...faq, response: e.target.value }
                      setFaqs(next)
                    }}
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoCard variant="warning">
          <strong>提醒：</strong>LINE 後台需要你一條一條手動建立，建議控制在 5–8 組就好。如果想加更多，可以等熟悉後再慢慢加。
        </InfoCard>
      </SectionCard>

      <StepNav onPrev={onPrev} onNext={onNext} nextLabel="下一步：申請 LINE OA" />
    </div>
  )
}

// 文案生成器（v1 規則式，未來可接 LLM）
function generateContent(data: FormData): {
  welcome: string
  faqs: { keywords: string[]; response: string }[]
} {
  const name = data.schoolName || "我們"
  const isParents = data.audience === "parents" || data.audience === "both"

  // 歡迎訊息：依風格切換語氣
  const welcomeByStyle: Record<Style, string> = {
    lively: `🎉 哈囉！歡迎來到 ${name} ✨\n\n很開心你加我們為好友！\n點下方選單可以快速找到你需要的：\n📖 課程資訊 / 📅 上課時間 / 📞 聯絡老師\n\n有任何問題都可以直接傳訊息給我們，我們會盡快回覆 💪`,
    professional: `您好，歡迎加入 ${name} 官方帳號。\n\n${isParents ? "感謝您對孩子學習的關心。" : ""}您可以透過下方選單，快速取得：\n・課程介紹與報名資訊\n・上課時間與地點\n・聯絡方式\n\n若有任何疑問，歡迎直接訊息諮詢，我們會在營業時間內儘速回覆您。`,
    warm: `您好 🌷 歡迎來到 ${name}\n\n很高興認識你！${isParents ? "讓我們一起陪伴孩子成長 💕" : "我們會陪你一起學習～"}\n\n下方選單有所有你會用到的功能，有任何問題都歡迎直接傳訊息給我們，我們會用心回覆 ☺️`,
  }
  const welcome = welcomeByStyle[data.style ?? "professional"]

  // FAQ：依勾選功能生成
  const faqLib: Record<FeatureKey, { keywords: string[]; response: string }[]> = {
    booking: [{
      keywords: ["試聽", "預約", "報名"],
      response: `謝謝您的興趣！\n試聽預約請點選下方圖文選單的「預約試聽」，或直接告訴我們：\n1. 孩子的年級\n2. 想試聽的課程\n3. 方便的時段\n\n我們會在 24 小時內回覆確認 📝`,
    }],
    schedule: [{
      keywords: ["課表", "上課時間", "幾點上課"],
      response: `本週課表請點選下方圖文選單的「課表查詢」，可以看到所有時段。\n\n如果你的孩子已經是我們的學員，也可以直接告訴我們孩子的姓名，我們會幫你查詢專屬課表 📅`,
    }],
    payment: [{
      keywords: ["繳費", "學費", "付款"],
      response: `繳費資訊：\n・轉帳：可使用 ATM 或網路銀行\n・現金：請於上課時直接交給老師\n・刷卡：支援信用卡（請先聯絡確認）\n\n詳細金額請點選「繳費資訊」或私訊告訴我們孩子上的課程，我們會提供確切金額 💳`,
    }],
    events: [{
      keywords: ["活動", "營隊", "比賽", "講座"],
      response: `最新活動資訊都在圖文選單的「活動報名」裡，包含：\n・寒暑假營隊\n・親子講座\n・學員比賽\n\n所有活動都會優先通知 LINE 好友 🎊`,
    }],
    contact: [{
      keywords: ["地址", "電話", "在哪裡", "怎麼去"],
      response: `📍 上課地點與聯絡方式：\n\n（請在這裡填上你的上課地點 / 教室地址）\n☎ （請填上聯絡電話）\n🕐 上課時段：（請填上）\n\n可以從下方選單的「聯絡老師」直接看 Google Map 喔！`,
    }],
    news: [{
      keywords: ["最新", "公告", "消息"],
      response: `最新公告請點選下方圖文選單的「最新消息」，包含：\n・放假通知\n・優秀學員\n・課程異動\n\n重要消息我們也會主動推播給好友 📣`,
    }],
  }

  const faqs = data.features.flatMap(f => faqLib[f] ?? [])
  // 加上一個通用打招呼
  faqs.unshift({
    keywords: ["你好", "哈囉", "hi", "hello"],
    response: `${isParents ? "您好！" : "嗨～"}很高興收到你的訊息 😊\n你可以直接點下方選單，或告訴我們你想了解什麼，我們會盡快回覆喔！`,
  })

  return { welcome, faqs }
}

// ===== Step 5: 申請 LINE OA =====
function Step5CreateLineOa({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const steps = [
    {
      title: "1. 前往 LINE 官方帳號註冊頁",
      desc: "用你的 LINE 個人帳號登入即可，整個過程是免費的（一般帳號）。",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      action: { label: "前往 LINE 註冊頁", url: "https://www.linebiz.com/tw/entry/" },
    },
    {
      title: "2. 填寫你的資訊",
      desc: "依序填入：帳號名稱（你的名字或品牌）、業種類別（選擇「教育」→「老師 / 家教」或對應你教學領域的類別）、業者類型。",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    },
    {
      title: "3. 完成驗證並進入後台",
      desc: "驗證信箱後，會自動跳轉到 LINE Official Account Manager 後台。建議把這個網址加到書籤，之後都從這邊管理。",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      action: { label: "開啟 LINE OA Manager", url: "https://manager.line.biz/" },
    },
  ]

  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Rocket className="w-5 h-5" />}
        title="第一階段：申請 LINE 官方帳號"
        desc="如果你已經有 LINE 官方帳號了，可以直接跳到下一步"
      >
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="grid md:grid-cols-[200px_1fr] gap-4 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 relative aspect-video md:aspect-auto">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="font-bold text-slate-800 mb-1.5">{s.title}</div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{s.desc}</p>
                {s.action && (
                  <a href={s.action.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2"
                      style={{ borderColor: LINE_GREEN, color: LINE_GREEN }}
                    >
                      {s.action.label}
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <InfoCard>
          <strong>小提醒：</strong>建議申請一個工作專用的 LINE 個人帳號來註冊，跟你平常使用的個人帳號分開，方便日後管理也比較有界線感。
        </InfoCard>
      </SectionCard>

      <StepNav onPrev={onPrev} onNext={onNext} nextLabel="下一步：上傳到 LINE" />
    </div>
  )
}

// ===== Step 6: 上傳到 LINE =====
function Step6UploadToLine({
  data,
  style,
  onNext,
  onPrev,
}: {
  data: FormData
  style: MenuStyleId
  onNext: () => void
  onPrev: () => void
}) {
  const generated = useMemo(() => generateContent(data), [data])
  const styleName = MENU_STYLES.find(s => s.id === style)?.name ?? ""

  const subSteps = [
    {
      num: "6-1",
      title: "上傳圖文選單",
      bullets: [
        "在 LINE OA Manager 後台，左側選「主頁」→「圖文選單」",
        "點「建立」→ 填標題（例：主選單）→ 設定使用期間",
        `版型選「大型 6 格」（這是六宮格的 LINE 官方名稱）`,
        `下載下方「${styleName}」風格的選單圖並上傳`,
        "點每一格 → 設定「動作」（連結 / 文字 / 優惠券）",
      ],
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      downloadLabel: "下載圖文選單圖（PNG）",
    },
    {
      num: "6-2",
      title: "設定歡迎訊息",
      bullets: [
        "後台左側選「主頁」→「歡迎訊息」",
        "把下方歡迎詞貼上去",
        "可選：加上一張歡迎圖片或貼圖",
        "儲存",
      ],
      copyText: generated.welcome,
      copyLabel: "複製歡迎詞",
    },
    {
      num: "6-3",
      title: "設定常見問題自動回覆",
      bullets: [
        "後台左側選「自動回應訊息」→「新增」",
        "依下方表格，一條一條新增關鍵字回覆",
        "每條都要：填關鍵字 → 填回覆訊息 → 設定為「使用全部」→ 儲存",
        `總共要建 ${generated.faqs.length} 條（建議分次完成，不用一次做完）`,
      ],
      faqsTable: generated.faqs,
    },
  ]

  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Upload className="w-5 h-5" />}
        title="第二階段：把素材貼到 LINE 後台"
        desc="登入 LINE OA Manager 後，依照下面三個小步驟操作"
      >
        <a
          href="https://manager.line.biz/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-4"
        >
          <Button
            className="text-white"
            style={{ backgroundColor: LINE_GREEN }}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            開啟 LINE OA Manager
          </Button>
        </a>

        <div className="space-y-6">
          {subSteps.map((s, i) => (
            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <span
                  className="text-white font-bold px-2.5 py-0.5 rounded text-sm"
                  style={{ backgroundColor: LINE_GREEN }}
                >
                  {s.num}
                </span>
                <span className="font-bold text-slate-800">{s.title}</span>
              </div>
              <div className="p-5 space-y-4">
                <ol className="space-y-2 text-sm text-slate-700">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {j + 1}
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ol>

                {s.image && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full max-h-[280px] object-cover"
                    />
                    <div className="px-3 py-2 text-xs text-slate-500 bg-white border-t border-slate-200">
                      📷 LINE OA Manager 操作畫面示意（實際介面可能略有不同）
                    </div>
                  </div>
                )}

                {s.downloadLabel && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      {s.downloadLabel}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      下載按鈕對照表（PDF）
                    </Button>
                  </div>
                )}

                {s.copyText && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        歡迎詞內容
                      </span>
                      <CopyButton text={s.copyText} small label={s.copyLabel} />
                    </div>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">{s.copyText}</pre>
                  </div>
                )}

                {s.faqsTable && (
                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                        <tr>
                          <th className="px-3 py-2 text-left">關鍵字</th>
                          <th className="px-3 py-2 text-left">回覆</th>
                          <th className="px-3 py-2 text-right w-16">複製</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {s.faqsTable.map((faq, k) => (
                          <tr key={k}>
                            <td className="px-3 py-2 align-top">
                              <div className="flex flex-wrap gap-1">
                                {faq.keywords.map(kw => (
                                  <Badge key={kw} variant="outline" className="text-[10px]">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {faq.response}
                            </td>
                            <td className="px-3 py-2 text-right align-top">
                              <CopyButton text={faq.response} small />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <StepNav onPrev={onPrev} onNext={onNext} nextLabel="我都設定好了" />
    </div>
  )
}

// ===== Step 7: 完成 =====
function Step7Done({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-10 text-center" style={{ background: `linear-gradient(135deg, ${LINE_GREEN}, ${LINE_GREEN_DARK})` }}>
          <div className="inline-flex w-20 h-20 rounded-full bg-white items-center justify-center mb-4 shadow-lg">
            <CheckCircle2 className="w-12 h-12" style={{ color: LINE_GREEN }} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">設定完成 🎉</h2>
          <p className="text-white/90 max-w-lg mx-auto">
            你的 LINE 官方帳號已經有完整的圖文選單、歡迎詞和自動回覆了。可以開始邀請學生家長加好友囉！
          </p>
        </div>

        <div className="p-6 grid md:grid-cols-3 gap-4">
          {[
            { title: "預覽你的 LINE OA", desc: "用手機加好友，看看實際效果", icon: ExternalLink },
            { title: "邀請好友", desc: "把 QR code 印在傳單、貼在門口", icon: Users },
            { title: "回頭調整", desc: "之後想改文案或選單都可以隨時回來", icon: Sparkles },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: LINE_GREEN + "1a", color: LINE_GREEN }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-800 mb-1">{item.title}</div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onRestart}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          重新設定
        </Button>
        <a href="https://manager.line.biz/" target="_blank" rel="noopener noreferrer">
          <Button className="text-white w-full sm:w-auto" style={{ backgroundColor: LINE_GREEN }}>
            前往 LINE OA Manager
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </a>
      </div>

      <InfoCard>
        <strong>未來想做更多？</strong>v2 版本會支援直接串接 LINE Messaging API，把上面這些設定自動推送到你的 LINE 帳號，不用再手動貼。敬請期待！
      </InfoCard>
    </div>
  )
}

// ===== 共用元件 =====
function SectionCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: LINE_GREEN + "1a", color: LINE_GREEN }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {desc && <p className="text-sm text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="block text-sm font-bold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg border-2 transition-all text-center ${
        active ? "" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
      style={active ? { borderColor: LINE_GREEN, backgroundColor: LINE_GREEN + "0d" } : undefined}
    >
      {children}
      {active && (
        <Check
          className="absolute top-1 right-1 w-3.5 h-3.5"
          style={{ color: LINE_GREEN }}
        />
      )}
    </button>
  )
}

function StepNav({
  onPrev,
  onNext,
  nextLabel = "下一步",
  nextDisabled,
}: {
  onPrev?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-6 pb-2 -mx-8 px-8">
      {onPrev ? (
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          上一步
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        className="text-white"
        style={{ backgroundColor: nextDisabled ? "#cbd5e1" : LINE_GREEN }}
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}

function InfoCard({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "info" | "warning"
}) {
  const styles = {
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: Info, iconColor: "text-blue-500" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", icon: Info, iconColor: "text-amber-500" },
  }[variant]
  const Icon = styles.icon
  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-3 flex items-start gap-2 mt-4`}>
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
      <div className={`text-sm ${styles.text} leading-relaxed`}>{children}</div>
    </div>
  )
}

function CopyButton({ text, small, label }: { text: string; small?: boolean; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {}
      }}
      className={`inline-flex items-center gap-1 rounded ${small ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"} font-medium transition-colors ${
        copied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "已複製" : label ?? "複製"}
    </button>
  )
}
