// Demo 用：把「一鍵建立」產生的老師暫存到 localStorage，
// 使 /teacher/{id} 連結可以即時 demo（無後端）。
"use client"

import { teachers as staticTeachers, type Teacher } from "./mock-data"

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
  return [...staticTeachers, ...getStoredTeachers()]
}

export function getTeacherById(id: string): Teacher | undefined {
  const fromStatic = staticTeachers.find((t) => t.id === id)
  if (fromStatic) return fromStatic
  return getStoredTeachers().find((t) => t.id === id)
}

export function addStoredTeacher(teacher: Teacher) {
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
  }
}
