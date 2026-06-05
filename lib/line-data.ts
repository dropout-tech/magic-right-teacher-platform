// Mock data for LINE@ 管理中心（學院視角）
// 所有資料皆為 demo 用途，無後端、無真實 LINE 串接。

// ===== 對話分類 / 狀態 / 角色 =====
export type ConvCategory =
  | "teaching"   // 教學
  | "material"   // 教材
  | "course"     // 課程
  | "sales"      // 業務
  | "contract"   // 合約
  | "accounting" // 會計
  | "general"    // 一般

export type ConvStatus = "open" | "pending" | "resolved" // 待處理 / 處理中 / 已解決
export type ContactRole = "teacher" | "parent" | "partner" // 老師 / 家長 / 合作單位

export const CATEGORY_META: Record<ConvCategory, { label: string; color: string; dot: string }> = {
  teaching:   { label: "教學", color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  material:   { label: "教材", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  course:     { label: "課程", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  sales:      { label: "業務", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  contract:   { label: "合約", color: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
  accounting: { label: "會計", color: "bg-rose-100 text-rose-700",     dot: "bg-rose-500" },
  general:    { label: "一般", color: "bg-slate-100 text-slate-600",   dot: "bg-slate-400" },
}

export const STATUS_META: Record<ConvStatus, { label: string; color: string }> = {
  open:     { label: "待處理", color: "bg-red-100 text-red-700" },
  pending:  { label: "處理中", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "已解決", color: "bg-emerald-100 text-emerald-700" },
}

export const ROLE_META: Record<ContactRole, { label: string; color: string }> = {
  teacher: { label: "老師",     color: "bg-indigo-100 text-indigo-700" },
  parent:  { label: "家長",     color: "bg-pink-100 text-pink-700" },
  partner: { label: "合作單位", color: "bg-cyan-100 text-cyan-700" },
}

export const ALL_CATEGORIES: ConvCategory[] = [
  "teaching", "material", "course", "sales", "contract", "accounting", "general",
]

export const ADMINS = ["行政小美", "行政阿哲"] as const

// ===== 訊息 / 對話 =====
export interface LineMessage {
  id: string
  from: "them" | "us"
  text: string
  time: string       // 顯示用時鐘時間，例如 "14:32"
  auto?: boolean     // 由系統自動回覆送出
}

export interface Conversation {
  id: string
  name: string
  role: ContactRole
  avatarGrad: string          // 頭像漸層 class
  category: ConvCategory
  status: ConvStatus
  assignee: string | null
  relatedTeacher?: string     // 關聯老師（家長/單位對話用）
  relatedCourse?: string
  lastTime: string            // 清單顯示用相對時間
  unread: number
  pinned?: boolean
  messages: LineMessage[]
}

export const conversations: Conversation[] = [
  {
    id: "c-monkey-pay",
    name: "猴子老師",
    role: "teacher",
    avatarGrad: "from-amber-400 to-yellow-600",
    category: "accounting",
    status: "open",
    assignee: null,
    relatedCourse: "三重國小・魔術社團",
    lastTime: "3 分鐘前",
    unread: 2,
    pinned: true,
    messages: [
      { id: "m1", from: "them", text: "行政您好～想問一下這個月三重國小的鐘點費還沒入帳耶？", time: "14:21" },
      { id: "m2", from: "them", text: "上個月是 28 號入的，這次想確認一下時間 🙏", time: "14:22" },
    ],
  },
  {
    id: "c-pringle-material",
    name: "品客老師",
    role: "teacher",
    avatarGrad: "from-pink-400 to-orange-400",
    category: "material",
    status: "pending",
    assignee: "行政小美",
    relatedCourse: "拼豆藝術課",
    lastTime: "21 分鐘前",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "拼豆教材剩沒幾盒了，想再跟平台進一批", time: "13:40" },
      { id: "m2", from: "us", text: "好的！這批要 5mm 還是 2.6mm 的豆豆呢？數量大概抓多少？", time: "13:52" },
      { id: "m3", from: "them", text: "5mm，先抓 20 盒，順便問折扣", time: "14:00" },
      { id: "m4", from: "us", text: "你是進階方案，教材享 9 折，我幫你算好報價單等等回你 👍", time: "14:03" },
    ],
  },
  {
    id: "c-chen-mom",
    name: "陳媽媽",
    role: "parent",
    avatarGrad: "from-pink-400 to-rose-500",
    category: "course",
    status: "open",
    assignee: null,
    relatedTeacher: "猴子老師",
    relatedCourse: "魔術初階班",
    lastTime: "8 分鐘前",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "請問魔術初階班還有名額嗎？想幫我兒子報名（小二）", time: "14:15" },
      { id: "m2", from: "them", text: "他看了猴子老師的影片超想學的 😂", time: "14:16" },
    ],
  },
  {
    id: "c-wang-school",
    name: "王主任（三重國小課後）",
    role: "partner",
    avatarGrad: "from-cyan-400 to-sky-500",
    category: "sales",
    status: "open",
    assignee: null,
    relatedTeacher: "猴子老師",
    lastTime: "1 小時前",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "猴子老師這學期帶得很好，下學期我們想續約，另外想加開一班科學營", time: "13:25" },
      { id: "m2", from: "them", text: "可以請你們報個價嗎？大概 16 週", time: "13:25" },
    ],
  },
  {
    id: "c-shan-teacher",
    name: "小高老師（高雄）",
    role: "teacher",
    avatarGrad: "from-emerald-400 to-teal-500",
    category: "teaching",
    status: "open",
    assignee: null,
    relatedCourse: "氣球造型",
    lastTime: "2 小時前",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "想問氣球課第三堂的教案，學生年齡比較小，原本的劍龍造型會不會太難？", time: "12:30" },
      { id: "m2", from: "them", text: "有沒有簡化版可以參考 🎈", time: "12:31" },
    ],
  },
  {
    id: "c-axuan-contract",
    name: "阿軒老師",
    role: "teacher",
    avatarGrad: "from-violet-400 to-purple-500",
    category: "contract",
    status: "pending",
    assignee: "行政小美",
    lastTime: "3 小時前",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "我是上週說明會新加入的阿軒，請問合作合約要怎麼簽？", time: "11:10" },
      { id: "m2", from: "us", text: "歡迎阿軒老師！合約我已寄到你信箱，電子簽就可以。另外幫你開了官網後台帳號 😊", time: "11:25" },
      { id: "m3", from: "them", text: "收到了，我來填～", time: "11:40" },
    ],
  },
  {
    id: "c-lin-mom",
    name: "林媽媽",
    role: "parent",
    avatarGrad: "from-rose-400 to-pink-500",
    category: "course",
    status: "resolved",
    assignee: null,
    relatedTeacher: "品客老師",
    relatedCourse: "週末桌遊",
    lastTime: "今天 10:02",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "請問這週六的桌遊課是幾點？", time: "10:01" },
      { id: "m2", from: "us", text: "您好！週末桌遊課每週六 14:00–15:30，地點在大安教室。需要我幫您加到提醒嗎？😊", time: "10:02", auto: true },
      { id: "m3", from: "them", text: "好的謝謝～不用提醒，我記起來了", time: "10:05" },
    ],
  },
  {
    id: "c-huang-dad",
    name: "黃爸爸",
    role: "parent",
    avatarGrad: "from-blue-400 to-indigo-500",
    category: "accounting",
    status: "pending",
    assignee: "行政阿哲",
    relatedCourse: "機器人程式課",
    lastTime: "昨天 19:30",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "機器人課的學費我要用信用卡分期，可以嗎？", time: "19:28" },
      { id: "m2", from: "us", text: "可以的！我把刷卡連結傳給您，分 3 期免手續費 💳", time: "19:30" },
    ],
  },
  {
    id: "c-zhao-teacher",
    name: "阿照老師（台南）",
    role: "teacher",
    avatarGrad: "from-orange-400 to-red-500",
    category: "sales",
    status: "resolved",
    assignee: "行政阿哲",
    lastTime: "昨天 16:12",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "台南這邊有家長私訊問能不能開積木課，我可以接，但不知道怎麼報價", time: "16:00" },
      { id: "m2", from: "us", text: "太好了！我把『老師接案報價 SOP』傳給你，照著填就好，有問題隨時問我 💪", time: "16:10" },
      { id: "m3", from: "them", text: "收到，謝謝！", time: "16:12" },
    ],
  },
]

// ===== 快速回覆範本（收件匣側欄用）=====
export const quickReplies: { label: string; text: string }[] = [
  { label: "稍候處理", text: "您好，已收到您的訊息，我們確認後盡快回覆您 🙏" },
  { label: "鐘點入帳", text: "鐘點費將於每月 28 日統一入帳，這次款項已排程，再請留意 😊" },
  { label: "報名試聽", text: "歡迎報名！再請提供：1) 孩子年級 2) 想上的課程 3) 方便時段，我們會幫您安排 📝" },
  { label: "教材報價", text: "已依您的方案折扣計算報價單，稍後傳給您，確認後即可出貨 📦" },
]

// ===== 老師 LINE 名冊 =====
export interface LineTeacher {
  id: string
  name: string
  talents: string[]
  region: "北區" | "中區" | "南區"
  city: string
  courseStatus: "open" | "limited" | "closed"
  lineBound: boolean
  lastActive: string
  convCount: number
  plan: "trial" | "basic" | "pro" | "flagship"
}

export const COURSE_STATUS_META: Record<LineTeacher["courseStatus"], { label: string; color: string }> = {
  open:    { label: "開放接課", color: "bg-emerald-100 text-emerald-700" },
  limited: { label: "名額有限", color: "bg-amber-100 text-amber-700" },
  closed:  { label: "暫停接課", color: "bg-slate-100 text-slate-500" },
}

export const lineTeachers: LineTeacher[] = [
  { id: "monkey",  name: "猴子老師", talents: ["魔術", "桌遊", "程式機器人"], region: "北區", city: "新北三重", courseStatus: "open",    lineBound: true,  lastActive: "3 分鐘前",  convCount: 24, plan: "flagship" },
  { id: "pringle", name: "品客老師", talents: ["手工藝", "無人機", "拼豆"],   region: "北區", city: "台北大安", courseStatus: "limited", lineBound: true,  lastActive: "21 分鐘前", convCount: 18, plan: "pro" },
  { id: "axuan",   name: "阿軒老師", talents: ["魔術", "氣球"],               region: "北區", city: "新北板橋", courseStatus: "open",    lineBound: true,  lastActive: "3 小時前",  convCount: 3,  plan: "trial" },
  { id: "gao",     name: "小高老師", talents: ["氣球", "手工藝"],             region: "南區", city: "高雄左營", courseStatus: "open",    lineBound: true,  lastActive: "2 小時前",  convCount: 9,  plan: "basic" },
  { id: "zhao",    name: "阿照老師", talents: ["積木", "骨牌"],               region: "南區", city: "台南東區", courseStatus: "open",    lineBound: true,  lastActive: "昨天",      convCount: 6,  plan: "basic" },
  { id: "may",     name: "美美老師", talents: ["紙藝", "拼豆", "手工藝"],     region: "中區", city: "台中西屯", courseStatus: "limited", lineBound: true,  lastActive: "昨天",      convCount: 11, plan: "pro" },
  { id: "ken",     name: "肯尼老師", talents: ["科學", "魔法科學"],           region: "北區", city: "台北信義", courseStatus: "open",    lineBound: true,  lastActive: "今天 09:10", convCount: 14, plan: "pro" },
  { id: "leo",     name: "雷歐老師", talents: ["無人機", "程式機器人"],       region: "中區", city: "台中北屯", courseStatus: "open",    lineBound: true,  lastActive: "今天 08:40", convCount: 7,  plan: "basic" },
  { id: "tina",    name: "蒂娜老師", talents: ["桌遊", "魔術"],               region: "南區", city: "高雄三民", courseStatus: "closed",  lineBound: true,  lastActive: "3 天前",    convCount: 5,  plan: "trial" },
  { id: "sam",     name: "山姆老師", talents: ["動力機械", "小木匠"],         region: "北區", city: "新北新莊", courseStatus: "open",    lineBound: false, lastActive: "—",         convCount: 0,  plan: "trial" },
  { id: "coco",    name: "可可老師", talents: ["氣球", "造型"],               region: "中區", city: "台中南屯", courseStatus: "open",    lineBound: false, lastActive: "—",         convCount: 0,  plan: "basic" },
  { id: "bingo",   name: "賓果老師", talents: ["桌遊", "積木"],               region: "南區", city: "台南安平", courseStatus: "limited", lineBound: true,  lastActive: "2 天前",    convCount: 4,  plan: "trial" },
]

// ===== 派課中心 =====
export interface DispatchRequest {
  id: string
  organization: string
  courseType: string
  talent: string
  region: "北區" | "中區" | "南區"
  location: string
  timeSlot: string
  estimatedSessions: number
  rate: string
  deadline: string
  status: "matching" | "dispatched" | "filled"
}

export type DispatchReplyStatus = "accepted" | "declined" | "read" | "sent"

export const DISPATCH_REPLY_META: Record<DispatchReplyStatus, { label: string; color: string }> = {
  accepted: { label: "願意接課", color: "bg-emerald-100 text-emerald-700" },
  declined: { label: "婉拒",     color: "bg-slate-100 text-slate-500" },
  read:     { label: "已讀未回", color: "bg-amber-100 text-amber-700" },
  sent:     { label: "已推播",   color: "bg-blue-100 text-blue-700" },
}

export interface DispatchReply {
  teacherId: string
  status: DispatchReplyStatus
  at?: string
  note?: string
}

export const dispatchRequests: DispatchRequest[] = [
  {
    id: "d1",
    organization: "三重國小課後照顧",
    courseType: "社團課程",
    talent: "魔術",
    region: "北區",
    location: "新北市三重區",
    timeSlot: "下學期 每週三 15:30–17:00",
    estimatedSessions: 16,
    rate: "1,000 / 堂",
    deadline: "2026-06-15",
    status: "dispatched",
  },
  {
    id: "d2",
    organization: "大安安親班",
    courseType: "營隊課程",
    talent: "科學",
    region: "北區",
    location: "台北市大安區",
    timeSlot: "暑假 7/7–7/11 上午",
    estimatedSessions: 5,
    rate: "3,500 / 日",
    deadline: "2026-06-30",
    status: "matching",
  },
  {
    id: "d3",
    organization: "信義某企業家庭日",
    courseType: "活動表演",
    talent: "氣球",
    region: "北區",
    location: "台北市信義區",
    timeSlot: "2026/07/20 下午",
    estimatedSessions: 1,
    rate: "8,000 / 場",
    deadline: "2026-07-10",
    status: "matching",
  },
  {
    id: "d4",
    organization: "台南私立幼兒園",
    courseType: "社團課程",
    talent: "積木",
    region: "南區",
    location: "台南市東區",
    timeSlot: "下學期 每週五 上午",
    estimatedSessions: 18,
    rate: "950 / 堂",
    deadline: "2026-06-20",
    status: "matching",
  },
]

// 已推播案件（d1）的老師回覆狀態，作為 demo 預設
export const dispatchReplies: Record<string, DispatchReply[]> = {
  d1: [
    { teacherId: "monkey", status: "accepted", at: "14:05", note: "週三我可以，三重很近！" },
    { teacherId: "axuan",  status: "read",     at: "13:50" },
    { teacherId: "tina",   status: "declined", at: "13:42", note: "下學期已滿，謝謝" },
  ],
}

// 依案件自動配對候選老師（符合才藝 + 地區，且非暫停接課）
export function matchTeachers(req: DispatchRequest): LineTeacher[] {
  return lineTeachers.filter(
    t =>
      t.lineBound &&
      t.courseStatus !== "closed" &&
      t.talents.includes(req.talent) &&
      (t.region === req.region || req.talent === "氣球"), // 表演類可跨區支援
  )
}

// ===== 群發中心 =====
export interface BroadcastSegment {
  id: string
  name: string
  count: number
  desc: string
}

export const broadcastSegments: BroadcastSegment[] = [
  { id: "all",       name: "全部已綁定老師", count: 18, desc: "所有完成 LINE 綁定的老師" },
  { id: "open",      name: "開放接課中",     count: 11, desc: "目前狀態為開放接課" },
  { id: "magic",     name: "魔術才藝老師",   count: 4,  desc: "才藝包含魔術" },
  { id: "south",     name: "南區老師",       count: 4,  desc: "高雄／台南／屏東" },
  { id: "flagship",  name: "旗艦／進階方案", count: 6,  desc: "高付費意願老師" },
  { id: "unbound",   name: "尚未綁定 LINE",  count: 12, desc: "需引導完成綁定" },
]

export interface BroadcastRecord {
  id: string
  title: string
  segment: string
  reach: number
  sentAt: string
  openRate: number
}

export const broadcastHistory: BroadcastRecord[] = [
  { id: "b1", title: "【派課】下學期三重國小魔術社團開放登記", segment: "魔術才藝老師", reach: 4,  sentAt: "今天 14:00", openRate: 1.0 },
  { id: "b2", title: "6 月師培：氣球進階造型工作坊報名", segment: "全部已綁定老師", reach: 18, sentAt: "昨天 10:30", openRate: 0.83 },
  { id: "b3", title: "教材補貨提醒：暑期營隊用量請提早登記", segment: "開放接課中", reach: 11, sentAt: "6/3 09:00", openRate: 0.91 },
]

// ===== 自動回覆 / 關鍵字 =====
export interface AutoReplyRule {
  id: string
  keywords: string[]
  category: ConvCategory
  response: string
  enabled: boolean
  hits: number
}

export const autoReplyRules: AutoReplyRule[] = [
  {
    id: "ar1",
    keywords: ["試聽", "報名", "預約"],
    category: "course",
    response: "歡迎報名！請提供：1) 孩子年級 2) 想上的課程 3) 方便時段，我們會在 24 小時內幫您安排 📝",
    enabled: true,
    hits: 312,
  },
  {
    id: "ar2",
    keywords: ["課表", "幾點", "上課時間"],
    category: "course",
    response: "本週課表可由下方選單『課表查詢』看到完整時段；若是已報名學員，也可直接告訴我們孩子姓名，我們幫您查 📅",
    enabled: true,
    hits: 268,
  },
  {
    id: "ar3",
    keywords: ["繳費", "學費", "刷卡", "分期"],
    category: "accounting",
    response: "學費可用 ATM 轉帳或信用卡（支援分期免手續費）。請告訴我們孩子上的課程，我們提供確切金額與連結 💳",
    enabled: true,
    hits: 154,
  },
  {
    id: "ar4",
    keywords: ["鐘點", "入帳", "請款"],
    category: "accounting",
    response: "老師鐘點費於每月 28 日統一結算入帳。若需明細，回覆『明細』即可，系統會將本月課堂列給您 🧾",
    enabled: true,
    hits: 86,
  },
  {
    id: "ar5",
    keywords: ["請假", "改期", "調課"],
    category: "teaching",
    response: "收到請假需求！請告訴我們：日期 + 課程，我們會協助安排補課或調課，並通知對應老師 🙏",
    enabled: true,
    hits: 121,
  },
  {
    id: "ar6",
    keywords: ["地址", "在哪", "怎麼去", "停車"],
    category: "general",
    response: "各教室地址與交通資訊請點下方選單『聯絡我們』，內含 Google Map 導航連結 📍",
    enabled: false,
    hits: 43,
  },
]

// ===== 儀表板 KPI =====
export const lineStats = {
  boundTeachers: 18,
  totalTeachers: 30,
  activeConversations: conversations.filter(c => c.status !== "resolved").length,
  todayMessages: 86,
  todayAuto: 61,
  todayManual: 25,
  monthAutoReplies: 1240,
  dispatchInProgress: dispatchRequests.filter(d => d.status !== "filled").length,
  autoHandledRate: 0.71,
  adminMonthlySalary: 35000,
}

// 近 7 日訊息量（自動 vs 人工）
export const messageTrend: { day: string; auto: number; manual: number }[] = [
  { day: "5/30", auto: 44, manual: 26 },
  { day: "5/31", auto: 38, manual: 19 },
  { day: "6/1",  auto: 52, manual: 28 },
  { day: "6/2",  auto: 58, manual: 24 },
  { day: "6/3",  auto: 49, manual: 21 },
  { day: "6/4",  auto: 63, manual: 27 },
  { day: "6/5",  auto: 61, manual: 25 },
]

// 對話分類佔比（本月）
export const categoryBreakdown: { category: ConvCategory; value: number }[] = [
  { category: "course",     value: 34 },
  { category: "accounting", value: 22 },
  { category: "teaching",   value: 16 },
  { category: "material",   value: 12 },
  { category: "sales",      value: 9 },
  { category: "contract",   value: 4 },
  { category: "general",    value: 3 },
]

// ===== 打卡回報（長期課程每堂上/下課打卡）=====
export type SessionStatus = "done" | "today" | "upcoming" | "leave"

export const SESSION_STATUS_META: Record<SessionStatus, { label: string; color: string }> = {
  done:     { label: "已完成",    color: "bg-emerald-100 text-emerald-700" },
  today:    { label: "今日待上課", color: "bg-blue-100 text-blue-700" },
  upcoming: { label: "未開始",    color: "bg-slate-100 text-slate-500" },
  leave:    { label: "請假順延",  color: "bg-amber-100 text-amber-700" },
}

export interface CourseSession {
  no: number
  date: string          // YYYY-MM-DD
  weekday: string       // 週一..週日
  plannedStart: string  // "15:30"
  plannedEnd: string    // "17:00"
  checkIn?: string      // 實際上課打卡 "15:28"
  checkOut?: string     // 實際下課打卡 "17:03"
  status: SessionStatus
  note?: string
}

export interface OngoingCourse {
  id: string
  dispatchId?: string
  organization: string
  talent: string
  teacherId: string
  teacherName: string
  teacherGrad: string   // 頭像漸層 class
  location: string
  scheduleLabel: string
  totalSessions: number
  ratePerSession: number
  sessions: CourseSession[]
}

const TODAY_ISO = "2026-06-05"
const WEEKDAYS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"]

function isoAddDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}
function weekdayOf(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}
function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}
function fromMinutes(v: number): string {
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`
}
export function sessionHours(s: { plannedStart: string; plannedEnd: string; checkIn?: string; checkOut?: string }): number {
  const start = s.checkIn ?? s.plannedStart
  const end = s.checkOut ?? s.plannedEnd
  return Math.round(((toMinutes(end) - toMinutes(start)) / 60) * 10) / 10
}

// 過去場次的打卡時間微調（固定值，避免 SSR/CSR 不一致）
const CHECKIN_OFFSET = [-3, -1, -2, 0, -4, -1, -2, -1, -3, -2, -1, -2]
const CHECKOUT_OFFSET = [2, 4, 1, 3, 2, 5, 1, 2, 3, 1, 2, 4]

function buildSessions(total: number, pastCount: number, planStart: string, planEnd: string, leaveAt?: number): CourseSession[] {
  return Array.from({ length: total }, (_, i) => {
    const date = isoAddDays(TODAY_ISO, (i - pastCount) * 7)
    const base = { no: i + 1, date, weekday: weekdayOf(date), plannedStart: planStart, plannedEnd: planEnd }
    if (i < pastCount) {
      if (leaveAt === i) return { ...base, status: "leave" as SessionStatus, note: "學生校外教學，順延補課" }
      return {
        ...base,
        checkIn: fromMinutes(toMinutes(planStart) + CHECKIN_OFFSET[i % CHECKIN_OFFSET.length]),
        checkOut: fromMinutes(toMinutes(planEnd) + CHECKOUT_OFFSET[i % CHECKOUT_OFFSET.length]),
        status: "done" as SessionStatus,
      }
    }
    if (i === pastCount) return { ...base, status: "today" as SessionStatus }
    return { ...base, status: "upcoming" as SessionStatus }
  })
}

export const ongoingCourses: OngoingCourse[] = [
  {
    id: "oc1",
    dispatchId: "d1",
    organization: "三重國小・魔術社團",
    talent: "魔術",
    teacherId: "monkey",
    teacherName: "猴子老師",
    teacherGrad: "from-amber-400 to-yellow-600",
    location: "新北市三重區",
    scheduleLabel: `每${weekdayOf(TODAY_ISO)} 15:30–17:00`,
    totalSessions: 16,
    ratePerSession: 1000,
    sessions: buildSessions(16, 9, "15:30", "17:00", 4),
  },
  {
    id: "oc2",
    organization: "板橋私立幼兒園・氣球造型",
    talent: "氣球",
    teacherId: "axuan",
    teacherName: "阿軒老師",
    teacherGrad: "from-violet-400 to-purple-500",
    location: "新北市板橋區",
    scheduleLabel: `每${weekdayOf(TODAY_ISO)} 10:00–11:00`,
    totalSessions: 12,
    ratePerSession: 800,
    sessions: buildSessions(12, 4, "10:00", "11:00"),
  },
]

// 一堂課若有完整上下課打卡，或已標記 done，即視為完成
export function isSessionDone(s: CourseSession): boolean {
  return s.status === "done" || (!!s.checkIn && !!s.checkOut)
}

export function courseSummary(c: OngoingCourse) {
  const done = c.sessions.filter(isSessionDone).length
  const leave = c.sessions.filter(s => s.status === "leave").length
  const doneHours = c.sessions.filter(isSessionDone).reduce((sum, s) => sum + sessionHours(s), 0)
  return {
    done,
    leave,
    total: c.totalSessions,
    doneHours: Math.round(doneHours * 10) / 10,
    earned: done * c.ratePerSession,
    attendance: done + leave > 0 ? Math.round((done / (done + leave)) * 100) : 100,
  }
}

export function nowClock(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}
