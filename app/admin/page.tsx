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
  Sparkles
} from "lucide-react"
import { teachers as staticTeachers } from "@/lib/mock-data"
import { addStoredTeacher, buildDefaultTeacher, getAllTeachers, getStoredTeachers, removeStoredTeacher, slugify } from "@/lib/teacher-storage"
import type { Teacher } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "list">("dashboard")

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
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === "dashboard" && <DashboardView onCreate={() => setActiveTab("create")} />}
          {activeTab === "create" && <CreateTeacherView onDone={() => setActiveTab("list")} />}
          {activeTab === "list" && <TeacherListView />}
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
function DashboardView({ onCreate }: { onCreate: () => void }) {
  const [stored, setStored] = useState<Teacher[]>([])
  useEffect(() => { setStored(getStoredTeachers()) }, [])
  const all = useMemo(() => [...staticTeachers, ...stored], [stored])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">總覽儀表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="老師總數" value={all.length} icon={<Users className="w-6 h-6" />} color="blue" />
        <StatCard title="開放接課" value={all.filter(t => t.courseStatus === "open").length} icon={<Check className="w-6 h-6" />} color="green" />
        <StatCard title="本週瀏覽" value="1,234" icon={<Eye className="w-6 h-6" />} color="purple" />
        <StatCard title="本週新增" value={stored.length} icon={<Sparkles className="w-6 h-6" />} color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">快速操作</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-red-600 hover:bg-red-700" onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            新增老師頁面
          </Button>
          <Button variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            批次生成 QRCode
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            複製所有連結
          </Button>
        </div>
      </div>

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
    orange: "bg-orange-50 text-orange-600"
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
      url: `${window.location.origin}/teacher/${id}`,
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
              <label className="text-sm text-slate-500 mb-2 block">頁面連結（可直接點開試用）</label>
              <div className="flex items-center gap-2">
                <Input value={generatedData.url} readOnly className="flex-1 bg-white" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedData.url, "url")}>
                  {copied === "url" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <a href={generatedData.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    開啟頁面
                  </Button>
                </a>
              </div>
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
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">瀏覽次數</th>
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
                  <span className="text-slate-600">{isCreated(teacher.id) ? 0 : Math.floor(Math.random() * 500 + 100)}</span>
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
