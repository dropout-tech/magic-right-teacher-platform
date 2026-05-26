// Demo 用：把「一鍵建立」產生的老師暫存到 localStorage，
// 使 /teacher/{id} 連結可以即時 demo（無後端）。
"use client"

import {
  PLAN_PRESETS,
  teachers as staticTeachers,
  type Subscription,
  type SubscriptionPlan,
  type Teacher,
  type TemplateId,
} from "./mock-data"

const STORAGE_KEY = "mr-created-teachers-v1"

export function getStoredTeachers(): Teacher[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Teacher[]) : []
  } catch {
    return []
  }
}

export function getAllTeachers(): Teacher[] {
  const stored = getStoredTeachers()
  const overrides = new Map(stored.map((t) => [t.id, t]))
  const merged = staticTeachers.map((t) => overrides.get(t.id) ?? t)
  const staticIds = new Set(staticTeachers.map((t) => t.id))
  for (const t of stored) if (!staticIds.has(t.id)) merged.push(t)
  return merged
}

export function getTeacherById(id: string): Teacher | undefined {
  // storage 版本優先（管理員可能已對靜態老師做了訂閱微調）
  const fromStorage = getStoredTeachers().find((t) => t.id === id)
  if (fromStorage) return fromStorage
  return staticTeachers.find((t) => t.id === id)
}

export function addStoredTeacher(teacher: Teacher) {
  if (typeof window === "undefined") return
  const list = getStoredTeachers().filter((t) => t.id !== teacher.id)
  list.push(teacher)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// 更新已存在的老師（不論在 staticTeachers 或 storage 中皆覆蓋成 storage 版本，
// 因為靜態 mock 為唯讀，只能用 storage 蓋過去）
export function upsertTeacher(teacher: Teacher) {
  if (typeof window === "undefined") return
  const list = getStoredTeachers().filter((t) => t.id !== teacher.id)
  list.push(teacher)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function removeStoredTeacher(id: string) {
  if (typeof window === "undefined") return
  const list = getStoredTeachers().filter((t) => t.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// ===== 純前端「可分享連結」：把 Teacher 編成 base64url 塞進 query =====
// 沒有後端的情況下，這讓「產生的連結」真的可以跨裝置分享。

const PAYLOAD_QUERY_KEY = "d"

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4))
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function encodeTeacherToPayload(teacher: Teacher): string {
  const json = JSON.stringify(teacher)
  const bytes = new TextEncoder().encode(json)
  return bytesToBase64Url(bytes)
}

export function decodeTeacherFromPayload(payload: string): Teacher | null {
  try {
    const bytes = base64UrlToBytes(payload)
    const json = new TextDecoder().decode(bytes)
    const t = JSON.parse(json)
    // 基本健全性檢查
    if (!t || typeof t.id !== "string" || typeof t.name !== "string") return null
    return t as Teacher
  } catch {
    return null
  }
}

export function buildShareableUrl(origin: string, teacher: Teacher): string {
  const payload = encodeTeacherToPayload(teacher)
  return `${origin}/teacher/${encodeURIComponent(teacher.id)}?${PAYLOAD_QUERY_KEY}=${payload}`
}

export function extractTeacherFromUrl(searchParams: URLSearchParams): Teacher | null {
  const payload = searchParams.get(PAYLOAD_QUERY_KEY)
  if (!payload) return null
  return decodeTeacherFromPayload(payload)
}

// 工具：把暱稱轉成 URL-safe id
export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/老師|teacher/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9一-龥\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || `teacher-${Math.random().toString(36).slice(2, 7)}`
}

// ===== 訂閱相關工具 =====

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function addDaysISO(startISO: string, days: number): string {
  const d = new Date(startISO)
  d.setUTCDate(d.getUTCDate() + days)
  return toISODate(d)
}

// 依方案產生一份新的訂閱（起算日預設為今天）
export function buildSubscription(plan: SubscriptionPlan, startISO?: string): Subscription {
  const preset = PLAN_PRESETS[plan]
  const start = startISO ?? toISODate(new Date())
  return {
    plan,
    status: "active",
    startDate: start,
    endDate: addDaysISO(start, preset.days),
    unlockedTemplates: [...preset.unlockedTemplates],
  }
}

// 計算距離到期還剩幾天（負數＝已過期）
export function daysUntilExpiry(sub: Subscription, today: Date = new Date()): number {
  const end = new Date(sub.endDate + "T23:59:59")
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// 訂閱實際生效狀態：active / expired / paused
export type EffectiveStatus = "active" | "expired" | "paused"
export function effectiveSubscriptionStatus(sub: Subscription | undefined, today: Date = new Date()): EffectiveStatus {
  if (!sub) return "expired"
  if (sub.status === "paused") return "paused"
  return daysUntilExpiry(sub, today) >= 0 ? "active" : "expired"
}

// 老師是否仍可使用本服務（訂閱未過期且未暫停）
export function canUseService(teacher: Teacher, today: Date = new Date()): boolean {
  return effectiveSubscriptionStatus(teacher.subscription, today) === "active"
}

// 老師是否可使用某模板（必須在 unlockedTemplates 內，且訂閱有效）
export function canUseTemplate(teacher: Teacher, template: TemplateId, today: Date = new Date()): boolean {
  if (!canUseService(teacher, today)) return false
  return teacher.subscription?.unlockedTemplates.includes(template) ?? false
}

// 從表單欄位建立預設的 Teacher 樣板，給 demo 用
export function buildDefaultTeacher(input: {
  id: string
  nickname: string
  realName?: string
  email: string
  phone: string
  template?: "A" | "B" | "C"
}): Teacher {
  const template = input.template ?? "A"
  const sub = buildSubscription("trial")
  // 試用方案預設只解鎖選擇的那個模板（而不是 PLAN_PRESETS.trial 寫死的 A）
  sub.unlockedTemplates = [template]
  return {
    id: input.id,
    name: input.nickname.endsWith("老師") ? input.nickname : `${input.nickname}老師`,
    realName: input.realName,
    avatar: "",
    tagline: "用熱情點燃孩子的好奇心",
    template,
    yearsOfExperience: 1,
    skills: ["魔術", "桌遊"],
    bio: `${input.nickname}老師剛加入萊特魔數學院，期待用課程帶給孩子難忘的體驗。\n\n（這是預設文案，登入後台後可隨時修改個人介紹、教學風格、證照與成就。）`,
    teachingStyle: "互動式、引導式教學",
    credentials: ["萊特魔數學院認證講師"],
    stats: { totalHours: 100, totalStudents: 50, totalPartners: 2 },
    courses: [
      {
        id: "demo-1",
        name: "魔術啟蒙班",
        ageRange: "小一至小三",
        duration: "60 分鐘/堂",
        highlights: ["建立自信", "趣味互動", "10 個入門魔術"],
        coverImage: "",
        category: "社團課程",
      },
    ],
    testimonials: { videos: [], texts: [] },
    cases: [],
    social: { lastUpdated: new Date().toISOString().slice(0, 10) },
    courseStatus: "open",
    availableTimeSlots: {
      mon: [true, true, false], tue: [true, true, false], wed: [true, true, false],
      thu: [true, true, false], fri: [true, true, false], sat: [false, false, false], sun: [false, false, false],
    },
    blockOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    contact: { email: input.email, phone: input.phone },
    subscription: sub,
  }
}
