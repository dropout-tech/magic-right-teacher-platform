"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Users,
  Plus,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  QrCode,
  BarChart3,
  Trash2,
  Sparkles,
  ShieldCheck,
  CalendarClock,
  Lock,
  Unlock,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
} from "lucide-react"
import { PLAN_LABELS, PLAN_PRESETS, teachers as staticTeachers, type Subscription, type SubscriptionPlan, type TemplateId } from "@/lib/mock-data"
import {
  addDaysISO,
  addStoredTeacher,
  buildDefaultTeacher,
  buildShareableUrl,
  buildSubscription,
  daysUntilExpiry,
  effectiveSubscriptionStatus,
  getAllTeachers,
  getStoredTeachers,
  removeStoredTeacher,
  slugify,
  upsertTeacher,
} from "@/lib/teacher-storage"
import type { Teacher } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "list" | "subscriptions">("dashboard")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">返回首頁</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MR</span>
                </div>
                <span className="font-bold text-slate-800">管理後台</span>
              </div>
            </div>
            <Link href="/teachers">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                查看前台
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-2">
            <SidebarItem icon={<BarChart3 className="w-5 h-5" />} label="總覽儀表板" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
            <SidebarItem icon={<Plus className="w-5 h-5" />} label="一鍵建立老師" active={activeTab === "create"} onClick={() => setActiveTab("create")} />
            <SidebarItem icon={<Users className="w-5 h-5" />} label="老師管理列表" active={activeTab === "list"} onClick={() => setActiveTab("list")} />
            <SidebarItem icon={<ShieldCheck className="w-5 h-5" />} label="訂閱與權限" active={activeTab === "subscriptions"} onClick={() => setActiveTab("subscriptions")} />
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === "dashboard" && <DashboardView onCreate={() => setActiveTab("create")} onManageSubs={() => setActiveTab("subscriptions")} />}
          {activeTab === "create" && <CreateTeacherView onDone={() => setActiveTab("list")} />}
          {activeTab === "list" && <TeacherListView />}
          {activeTab === "subscriptions" && <SubscriptionsView />}
        </main>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
        active ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

// ===== Dashboard View =====
function DashboardView({ onCreate, onManageSubs }: { onCreate: () => void, onManageSubs: () => void }) {
  const [list, setList] = useState<Teacher[]>(() => staticTeachers)
  useEffect(() => { setList(getAllTeachers()) }, [])

  const expiringSoon = useMemo(
    () => list.filter(t => {
      const status = effectiveSubscriptionStatus(t.subscription)
      if (status !== "active") return false
      const days = t.subscription ? daysUntilExpiry(t.subscription) : 0
      return days <= 30
    }),
    [list]
  )
  const expired = useMemo(
    () => list.filter(t => effectiveSubscriptionStatus(t.subscription) === "expired"),
    [list]
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">總覽儀表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="老師總數" value={list.length} icon={<Users className="w-6 h-6" />} color="blue" />
        <StatCard title="開放接課" value={list.filter(t => t.courseStatus === "open").length} icon={<Check className="w-6 h-6" />} color="green" />
        <StatCard title="30 天內到期" value={expiringSoon.length} icon={<CalendarClock className="w-6 h-6" />} color="orange" />
        <StatCard title="已過期" value={expired.length} icon={<AlertTriangle className="w-6 h-6" />} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">快速操作</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-red-600 hover:bg-red-700" onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            新增老師頁面
          </Button>
          <Button variant="outline" onClick={onManageSubs}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            管理訂閱與權限
          </Button>
          <Button variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            批次生成 QRCode
          </Button>
        </div>
      </div>

      {(expiringSoon.length > 0 || expired.length > 0) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            訂閱提醒
          </h2>
          <div className="space-y-3">
            {expired.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-100 text-red-700">已過期</Badge>
                  <span className="font-medium text-slate-800">{t.name}</span>
                  <span className="text-sm text-slate-500">於 {t.subscription?.endDate} 到期</span>
                </div>
                <Button size="sm" variant="outline" onClick={onManageSubs}>處理</Button>
              </div>
            ))}
            {expiringSoon.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-100 text-amber-700">{daysUntilExpiry(t.subscription!)} 天後到期</Badge>
                  <span className="font-medium text-slate-800">{t.name}</span>
                  <span className="text-sm text-slate-500">{PLAN_LABELS[t.subscription!.plan]} 方案</span>
                </div>
                <Button size="sm" variant="outline" onClick={onManageSubs}>續訂</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">近期活動</h2>
        <div className="space-y-4">
          {[
            { action: "猴子老師更新了個人資料", time: "2 小時前" },
            { action: "品客老師新增了一筆案例分享", time: "5 小時前" },
            { action: "系統自動備份完成", time: "昨天 23:00" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-600">{activity.action}</span>
              <span className="text-sm text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color as keyof typeof colorStyles]}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
    </div>
  )
}

// ===== Create Teacher View =====
function CreateTeacherView({ onDone }: { onDone: () => void }) {
  const [formData, setFormData] = useState({
    nickname: "",
    realName: "",
    email: "",
    phone: "",
    template: "A" as "A" | "B" | "C",
  })
  const [isCreated, setIsCreated] = useState(false)
  const [generatedData, setGeneratedData] = useState<{
    id: string
    url: string
    shareUrl: string
    username: string
    password: string
  } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCreate = () => {
    const id = slugify(formData.nickname)
    const teacher = buildDefaultTeacher({
      id,
      nickname: formData.nickname,
      realName: formData.realName,
      email: formData.email,
      phone: formData.phone,
      template: formData.template,
    })
    addStoredTeacher(teacher)
    setGeneratedData({
      id,
      url: `${window.location.origin}/teacher/${encodeURIComponent(id)}`,
      shareUrl: buildShareableUrl(window.location.origin, teacher),
      username: formData.email,
      password: `MR${Math.random().toString(36).slice(2, 10)}`,
    })
    setIsCreated(true)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  if (isCreated && generatedData) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">頁面已建立 🎉</h1>

        <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{formData.nickname.endsWith("老師") ? formData.nickname : `${formData.nickname}老師`}的品牌頁已上線</h2>
              <p className="text-slate-500 mt-1 text-sm">已套用範本 <Badge variant="outline" className="ml-1">{formData.template === "A" ? "舞台魔術" : formData.template === "B" ? "童趣派對" : "雜誌編輯"}</Badge>，老師可立即登入後台繼續完善。</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-sm text-slate-500 mb-2 block">短連結（本機 demo / 上線後正式使用）</label>
              <div className="flex items-center gap-2">
                <Input value={generatedData.url} readOnly className="flex-1 bg-white" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedData.url, "url")}>
                  {copied === "url" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <a href={generatedData.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-2">※ 上線後是正式網址；目前 demo 無後端，僅本瀏覽器可開。</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <label className="text-sm font-bold text-red-700">可分享 demo 連結（跨裝置／跨瀏覽器可開）</label>
              </div>
              <div className="flex items-center gap-2">
                <Input value={generatedData.shareUrl} readOnly className="flex-1 bg-white text-xs font-mono" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedData.shareUrl, "share")}>
                  {copied === "share" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <a href={generatedData.shareUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    開啟頁面
                  </Button>
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                ※ 連結內含老師資料（base64 編碼），無需後端即可分享給客戶看。
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-sm text-slate-500 mb-2 block">登入帳號</label>
              <div className="flex items-center gap-2 mb-3">
                <Input value={generatedData.username} readOnly className="flex-1 bg-white" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedData.username, "username")}>
                  {copied === "username" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <label className="text-sm text-slate-500 mb-2 block">臨時密碼</label>
              <div className="flex items-center gap-2">
                <Input value={generatedData.password} readOnly className="flex-1 bg-white font-mono" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedData.password, "password")}>
                  {copied === "password" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 bg-slate-900 hover:bg-slate-800" onClick={onDone}>
                返回老師列表
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCreated(false)
                  setFormData({ nickname: "", realName: "", email: "", phone: "", template: "A" })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                再建立一位
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const templateOptions = [
    { id: "A" as const, name: "舞台魔術", desc: "黑金、舞台聚光燈、戲劇張力", grad: "from-slate-950 via-amber-700 to-yellow-500" },
    { id: "B" as const, name: "童趣派對", desc: "糖果色、粗框立體、活潑歡樂", grad: "from-pink-400 via-orange-300 to-yellow-300" },
    { id: "C" as const, name: "雜誌編輯", desc: "大字排版、紅黑對比、留白克制", grad: "from-white via-slate-100 to-red-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">一鍵建立新老師頁面</h1>

      <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-slate-600 mb-6">
          輸入老師基本資訊並挑選模板，系統將自動生成品牌頁面、登入帳號與臨時密碼。
        </p>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                藝名 / 暱稱 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="例如：猴子老師" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">本名（選填）</label>
              <Input placeholder="例如：王小明" value={formData.realName} onChange={(e) => setFormData({ ...formData, realName: e.target.value })} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input type="email" placeholder="teacher@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                手機號碼 <span className="text-red-500">*</span>
              </label>
              <Input type="tel" placeholder="0912-345-678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">初始模板</label>
            <div className="grid grid-cols-3 gap-3">
              {templateOptions.map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, template: opt.id })}
                  className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                    formData.template === opt.id ? "border-red-500 ring-2 ring-red-200" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-20 bg-gradient-to-br ${opt.grad}`} />
                  <div className="p-3">
                    <div className="font-semibold text-slate-800 text-sm">{opt.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                  {formData.template === opt.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
              disabled={!formData.nickname || !formData.email || !formData.phone}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              一鍵建立頁面
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== Teacher List View =====
function TeacherListView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [list, setList] = useState<Teacher[]>(() => staticTeachers)

  useEffect(() => { setList(getAllTeachers()) }, [])

  const refresh = () => setList(getAllTeachers())

  const filteredTeachers = list.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isCreated = (id: string) => !staticTeachers.find(t => t.id === id)

  const copyUrl = async (id: string) => {
    const url = `${window.location.origin}/teacher/${id}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = url
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleDelete = (id: string) => {
    if (!confirm("確定要刪除這位老師的 demo 資料嗎？")) return
    removeStoredTeacher(id)
    refresh()
  }

  const statusColors = {
    open: "bg-green-100 text-green-700",
    limited: "bg-yellow-100 text-yellow-700",
    closed: "bg-red-100 text-red-700"
  }

  const statusLabels = {
    open: "開放接課",
    limited: "名額有限",
    closed: "暫停接課"
  }

  const templateLabels = {
    A: "舞台魔術",
    B: "童趣派對",
    C: "雜誌編輯"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">老師管理列表</h1>
        <Button className="bg-red-600 hover:bg-red-700" onClick={refresh}>
          重新整理
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="搜尋老師姓名..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">老師</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">模板</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">完成度</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">接課狀態</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">訂閱</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeachers.map(teacher => (
              <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${teacher.template === "A" ? "bg-gradient-to-br from-amber-400 to-yellow-600" : teacher.template === "B" ? "bg-gradient-to-br from-pink-400 to-orange-400" : "bg-gradient-to-br from-slate-700 to-red-500"}`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {teacher.name}
                        {isCreated(teacher.id) && <Badge className="bg-amber-100 text-amber-700 text-xs">新建立</Badge>}
                      </div>
                      <div className="text-sm text-slate-500">/{teacher.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{templateLabels[teacher.template]}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: isCreated(teacher.id) ? "15%" : "100%" }} />
                    </div>
                    <span className="text-sm text-slate-600">{isCreated(teacher.id) ? "15%" : "100%"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[teacher.courseStatus]}>
                    {statusLabels[teacher.courseStatus]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <SubscriptionInlineBadge teacher={teacher} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => copyUrl(teacher.id)} title="複製連結">
                      {copiedUrl === teacher.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Link href={`/teacher/${teacher.id}`} target="_blank">
                      <Button size="sm" variant="ghost" title="開啟頁面">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          編輯資料
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="w-4 h-4 mr-2" />
                          生成 QRCode
                        </DropdownMenuItem>
                        {isCreated(teacher.id) && (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(teacher.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除 demo 資料
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-3">
        ※ 新建立的老師資料目前以 localStorage 保存（demo 用），重新整理頁面後仍可使用。
      </p>
    </div>
  )
}

// ===== Subscriptions View =====
const TEMPLATE_LABELS: Record<TemplateId, string> = { A: "舞台魔術", B: "童趣派對", C: "雜誌編輯" }
const ALL_TEMPLATES: TemplateId[] = ["A", "B", "C"]
const ALL_PLANS: SubscriptionPlan[] = ["trial", "basic", "pro", "flagship"]

function SubscriptionInlineBadge({ teacher }: { teacher: Teacher }) {
  const sub = teacher.subscription
  const eff = effectiveSubscriptionStatus(sub)
  if (!sub) {
    return <Badge className="bg-slate-100 text-slate-500">未設定</Badge>
  }
  const days = daysUntilExpiry(sub)
  let badgeClass = "bg-emerald-100 text-emerald-700"
  let label = `${PLAN_LABELS[sub.plan]}・剩 ${days} 天`
  if (eff === "paused") { badgeClass = "bg-slate-100 text-slate-700"; label = `${PLAN_LABELS[sub.plan]}・已暫停` }
  else if (eff === "expired") { badgeClass = "bg-red-100 text-red-700"; label = `${PLAN_LABELS[sub.plan]}・已過期` }
  else if (days <= 7) badgeClass = "bg-red-100 text-red-700"
  else if (days <= 30) badgeClass = "bg-amber-100 text-amber-700"

  return (
    <div className="flex flex-col gap-1">
      <Badge className={`${badgeClass} w-fit`}>{label}</Badge>
      <div className="text-xs text-slate-400">至 {sub.endDate}</div>
    </div>
  )
}

function SubscriptionsView() {
  const [list, setList] = useState<Teacher[]>(() => staticTeachers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expiring" | "expired" | "paused">("all")
  const [editing, setEditing] = useState<Teacher | null>(null)

  const refresh = () => setList(getAllTeachers())
  useEffect(() => { refresh() }, [])

  const filtered = useMemo(() => {
    return list.filter(t => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
      const eff = effectiveSubscriptionStatus(t.subscription)
      if (statusFilter === "all") return true
      if (statusFilter === "active") {
        if (eff !== "active") return false
        const days = t.subscription ? daysUntilExpiry(t.subscription) : 0
        return days > 30
      }
      if (statusFilter === "expiring") {
        if (eff !== "active") return false
        const days = t.subscription ? daysUntilExpiry(t.subscription) : 0
        return days <= 30
      }
      if (statusFilter === "expired") return eff === "expired"
      if (statusFilter === "paused") return eff === "paused"
      return true
    })
  }, [list, search, statusFilter])

  const handleSave = (teacher: Teacher, sub: Subscription) => {
    const updated: Teacher = { ...teacher, subscription: sub, template: sub.unlockedTemplates.includes(teacher.template) ? teacher.template : (sub.unlockedTemplates[0] ?? teacher.template) }
    upsertTeacher(updated)
    refresh()
    setEditing(null)
  }

  const handleTogglePause = (teacher: Teacher) => {
    if (!teacher.subscription) return
    const next: Subscription = { ...teacher.subscription, status: teacher.subscription.status === "paused" ? "active" : "paused" }
    upsertTeacher({ ...teacher, subscription: next })
    refresh()
  }

  const handleQuickRenew = (teacher: Teacher, days: number) => {
    if (!teacher.subscription) return
    const today = new Date().toISOString().slice(0, 10)
    const base = daysUntilExpiry(teacher.subscription) >= 0 ? teacher.subscription.endDate : today
    const next: Subscription = { ...teacher.subscription, status: "active", endDate: addDaysISO(base, days) }
    upsertTeacher({ ...teacher, subscription: next })
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">訂閱與權限</h1>
          <p className="text-sm text-slate-500 mt-1">管理每位老師的服務期限、方案與可用模板</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="搜尋老師..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {([
            { id: "all", label: "全部" },
            { id: "active", label: "啟用中" },
            { id: "expiring", label: "即將到期" },
            { id: "expired", label: "已過期" },
            { id: "paused", label: "已暫停" },
          ] as const).map(opt => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === opt.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(teacher => (
          <SubscriptionCard
            key={teacher.id}
            teacher={teacher}
            onEdit={() => setEditing(teacher)}
            onTogglePause={() => handleTogglePause(teacher)}
            onQuickRenew={(days) => handleQuickRenew(teacher, days)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
            目前沒有符合條件的老師
          </div>
        )}
      </div>

      {editing && (
        <SubscriptionEditDialog
          teacher={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function SubscriptionCard({
  teacher,
  onEdit,
  onTogglePause,
  onQuickRenew,
}: {
  teacher: Teacher
  onEdit: () => void
  onTogglePause: () => void
  onQuickRenew: (days: number) => void
}) {
  const sub = teacher.subscription
  const eff = effectiveSubscriptionStatus(sub)
  const days = sub ? daysUntilExpiry(sub) : 0

  const statusMeta = (() => {
    if (eff === "paused") return { label: "已暫停", color: "bg-slate-100 text-slate-700 border-slate-200", bar: "bg-slate-400" }
    if (eff === "expired") return { label: "已過期", color: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500" }
    if (days <= 7) return { label: `${days} 天後到期`, color: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500" }
    if (days <= 30) return { label: `${days} 天後到期`, color: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-500" }
    return { label: "使用中", color: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" }
  })()

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className={`h-1 ${statusMeta.bar}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${teacher.template === "A" ? "bg-gradient-to-br from-amber-400 to-yellow-600" : teacher.template === "B" ? "bg-gradient-to-br from-pink-400 to-orange-400" : "bg-gradient-to-br from-slate-700 to-red-500"}`}>
              {teacher.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 truncate">{teacher.name}</div>
              <div className="text-xs text-slate-500 truncate">{teacher.contact?.email ?? `/${teacher.id}`}</div>
            </div>
          </div>
          <Badge className={`${statusMeta.color} border whitespace-nowrap`}>{statusMeta.label}</Badge>
        </div>

        {sub ? (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500 mb-1">方案</div>
                <div className="font-medium text-slate-800">{PLAN_LABELS[sub.plan]}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">期間</div>
                <div className="font-medium text-slate-800 text-xs">{sub.startDate} → {sub.endDate}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">可用模板</div>
              <div className="flex gap-1.5">
                {ALL_TEMPLATES.map(tpl => {
                  const unlocked = sub.unlockedTemplates.includes(tpl)
                  return (
                    <span
                      key={tpl}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${
                        unlocked
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {unlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {tpl} {TEMPLATE_LABELS[tpl]}
                    </span>
                  )
                })}
              </div>
            </div>

            {sub.notes && (
              <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-2 border border-slate-100">
                {sub.notes}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-500 bg-slate-50 rounded-md p-3 mb-4">
            這位老師尚未設定訂閱資料。
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 min-w-[100px]">
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            編輯
          </Button>
          {sub && eff !== "paused" && (
            <Button size="sm" variant="outline" onClick={() => onQuickRenew(30)}>
              續訂 30 天
            </Button>
          )}
          {sub && eff !== "paused" && (
            <Button size="sm" variant="outline" onClick={() => onQuickRenew(365)}>
              續訂 1 年
            </Button>
          )}
          {sub && (
            <Button size="sm" variant="ghost" onClick={onTogglePause} title={eff === "paused" ? "啟用" : "暫停"}>
              {eff === "paused" ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-slate-500" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SubscriptionEditDialog({
  teacher,
  onClose,
  onSave,
}: {
  teacher: Teacher
  onClose: () => void
  onSave: (teacher: Teacher, sub: Subscription) => void
}) {
  const initial: Subscription = teacher.subscription ?? buildSubscription("trial")
  const [plan, setPlan] = useState<SubscriptionPlan>(initial.plan)
  const [startDate, setStartDate] = useState(initial.startDate)
  const [endDate, setEndDate] = useState(initial.endDate)
  const [status, setStatus] = useState<"active" | "paused">(initial.status)
  const [unlocked, setUnlocked] = useState<TemplateId[]>(initial.unlockedTemplates)
  const [notes, setNotes] = useState(initial.notes ?? "")

  const applyPlanPreset = (next: SubscriptionPlan) => {
    setPlan(next)
    const preset = PLAN_PRESETS[next]
    const newEnd = addDaysISO(startDate, preset.days)
    setEndDate(newEnd)
    setUnlocked([...preset.unlockedTemplates])
  }

  const toggleTemplate = (tpl: TemplateId) => {
    setUnlocked(prev => prev.includes(tpl) ? prev.filter(t => t !== tpl) : [...prev, tpl].sort() as TemplateId[])
  }

  const handleSubmit = () => {
    onSave(teacher, {
      plan,
      status,
      startDate,
      endDate,
      unlockedTemplates: unlocked,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>編輯訂閱與權限</DialogTitle>
          <DialogDescription>
            設定 {teacher.name} 的方案、服務期限與可用模板
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm">方案</Label>
            <Select value={plan} onValueChange={(v) => applyPlanPreset(v as SubscriptionPlan)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_PLANS.map(p => (
                  <SelectItem key={p} value={p}>
                    {PLAN_LABELS[p]}（預設 {PLAN_PRESETS[p].days} 天，{PLAN_PRESETS[p].unlockedTemplates.length} 模板）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400 mt-1">切換方案會自動帶入預設天數與模板組合，可在下方手動微調。</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">起始日</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm">到期日</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label className="text-sm">可用模板</Label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {ALL_TEMPLATES.map(tpl => {
                const isOn = unlocked.includes(tpl)
                return (
                  <label
                    key={tpl}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      isOn ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Checkbox checked={isOn} onCheckedChange={() => toggleTemplate(tpl)} />
                    <div className="text-sm">
                      <div className="font-medium text-slate-800">{tpl}</div>
                      <div className="text-xs text-slate-500">{TEMPLATE_LABELS[tpl]}</div>
                    </div>
                  </label>
                )
              })}
            </div>
            {unlocked.length === 0 && (
              <p className="text-xs text-red-500 mt-1">至少要解鎖一個模板。</p>
            )}
          </div>

          <div>
            <Label className="text-sm">狀態</Label>
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={() => setStatus("active")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${
                  status === "active" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                啟用
              </button>
              <button
                onClick={() => setStatus("paused")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${
                  status === "paused" ? "bg-slate-100 border-slate-300 text-slate-700" : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                暫停（保留資料但停用服務）
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm">內部備註（選填）</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例：贈送 1 個模板、年度合約等..."
              rows={2}
              className="mt-1.5"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            onClick={handleSubmit}
            disabled={unlocked.length === 0 || !startDate || !endDate}
            className="bg-red-600 hover:bg-red-700"
          >
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
