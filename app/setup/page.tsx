"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  User,
  Palette,
  BookOpen,
  Image as ImageIcon,
  Star,
  FolderOpen,
  Link2,
  Mail,
  Target,
  Compass,
  BarChart3,
  Eye,
  GripVertical,
  Check,
  Save,
  Lock,
  LogOut,
  Loader2
} from "lucide-react"
import { teacherMonkey, teacherPringle, Teacher } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface AuthData {
  teacherId: string
  name: string
  email: string
  loginTime: string
}

const sidebarItems = [
  { id: "overview", label: "總覽", icon: BarChart3 },
  { id: "profile", label: "基本資料", icon: User },
  { id: "template", label: "模板設定", icon: Palette },
  { id: "courses", label: "課程管理", icon: BookOpen },
  { id: "gallery", label: "成果展示", icon: ImageIcon },
  { id: "testimonials", label: "客戶見證", icon: Star },
  { id: "cases", label: "案例分享", icon: FolderOpen },
  { id: "social", label: "社群連結", icon: Link2 },
  { id: "contact", label: "聯絡設定", icon: Mail },
  { id: "course-center", label: "接課中心", icon: Target },
  { id: "explore", label: "探索其他才藝", icon: Compass },
]

export default function SetupPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const storedAuth = localStorage.getItem("teacherAuth")
    if (!storedAuth) {
      router.push("/login")
      return
    }

    const auth: AuthData = JSON.parse(storedAuth)
    setAuthData(auth)

    // Load teacher data based on logged in user
    if (auth.teacherId === "monkey") {
      setTeacher(teacherMonkey)
    } else if (auth.teacherId === "pringle") {
      setTeacher(teacherPringle)
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-500">載入中...</p>
        </div>
      </div>
    )
  }

  if (!teacher || !authData) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/teachers" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">返回老師總覽</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{teacher.name.replace("老師", "").charAt(0)}</span>
                </div>
                <span className="font-bold text-slate-800">{teacher.name}的設定後台</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/teacher/${teacher.id}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  預覽頁面
                </Button>
              </Link>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                儲存變更
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                    activeSection === item.id 
                      ? "bg-red-50 text-red-600" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === "overview" && <OverviewSection teacher={teacher} />}
          {activeSection === "profile" && <ProfileSection teacher={teacher} />}
          {activeSection === "template" && <TemplateSection teacher={teacher} />}
          {activeSection === "courses" && <CoursesSection teacher={teacher} />}
          {activeSection === "testimonials" && <TestimonialsSection teacher={teacher} />}
          {activeSection === "cases" && <CasesSection teacher={teacher} />}
          {activeSection === "course-center" && <CourseCenterSection teacher={teacher} />}
          {activeSection === "explore" && <ExploreSection />}
          {(activeSection === "gallery" || activeSection === "social" || activeSection === "contact") && (
            <PlaceholderSection title={sidebarItems.find(i => i.id === activeSection)?.label || ""} />
          )}
        </main>
      </div>
    </div>
  )
}

// ===== Overview Section =====
function OverviewSection({ teacher }: { teacher: Teacher }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">總覽</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-sm text-slate-500 mb-2">頁面瀏覽次數</div>
          <div className="text-3xl font-bold text-slate-800">1,234</div>
          <div className="text-sm text-green-600 mt-1">+12% 本週</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-sm text-slate-500 mb-2">聯絡表單提交</div>
          <div className="text-3xl font-bold text-slate-800">28</div>
          <div className="text-sm text-green-600 mt-1">+5 本週</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-sm text-slate-500 mb-2">頁面完成度</div>
          <div className="text-3xl font-bold text-slate-800">100%</div>
          <Progress value={100} className="mt-2" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="justify-start">
            <User className="w-4 h-4 mr-2" />
            編輯資料
          </Button>
          <Button variant="outline" className="justify-start">
            <Star className="w-4 h-4 mr-2" />
            新增見證
          </Button>
          <Button variant="outline" className="justify-start">
            <FolderOpen className="w-4 h-4 mr-2" />
            新增��例
          </Button>
          <Button variant="outline" className="justify-start">
            <Palette className="w-4 h-4 mr-2" />
            調整模板
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">近期動態</h2>
        <div className="space-y-3">
          {[
            { action: "更新了個人介紹", time: "2 小時前" },
            { action: "新增了一筆客戶見證", time: "昨天" },
            { action: "調整了區塊順序", time: "3 天前" },
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

// ===== Profile Section =====
function ProfileSection({ teacher }: { teacher: Teacher }) {
  const [formData, setFormData] = useState({
    name: teacher.name,
    tagline: teacher.tagline,
    bio: teacher.bio,
    teachingStyle: teacher.teachingStyle,
    yearsOfExperience: teacher.yearsOfExperience,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">基本資料</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">藝名 / 暱稱</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">教學年資</label>
              <Input 
                type="number"
                value={formData.yearsOfExperience} 
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">一句話 Tagline</label>
            <Input 
              value={formData.tagline} 
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="例如：讓每個孩子都能開心自在的學習"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">個人介紹</label>
            <Textarea 
              rows={6}
              value={formData.bio} 
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <p className="text-sm text-slate-500 mt-1">建議 200-500 字</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">教學風格</label>
            <Input 
              value={formData.teachingStyle} 
              onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Button className="bg-red-600 hover:bg-red-700">
              <Save className="w-4 h-4 mr-2" />
              儲存變更
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== Template Section with Drag & Drop =====
function TemplateSection({ teacher }: { teacher: Teacher }) {
  const [selectedTemplate, setSelectedTemplate] = useState<"A" | "B" | "C">(teacher.template)
  const [blocks, setBlocks] = useState([
    { id: "1", name: "Hero 主視覺", locked: true, enabled: true },
    { id: "2", name: "關於我", locked: false, enabled: true },
    { id: "3", name: "教授課程", locked: false, enabled: true },
    { id: "4", name: "教學成果展示", locked: false, enabled: true },
    { id: "5", name: "客戶見證", locked: false, enabled: true },
    { id: "6", name: "案例分享", locked: false, enabled: true },
    { id: "7", name: "社群媒體連結", locked: false, enabled: true },
    { id: "8", name: "聯絡與預約", locked: false, enabled: true },
    { id: "9", name: "品牌背書", locked: true, enabled: true },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)
      
      // Don't allow moving locked items or moving items around locked items
      if (blocks[oldIndex].locked || blocks[newIndex].locked) return
      
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const toggleBlock = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b))
  }

  const templates = [
    { id: "A" as const, name: "舞台魔術", description: "黑金、聚光燈、戲劇張力，給專業魔術師", color: "from-slate-950 via-amber-700 to-yellow-500" },
    { id: "B" as const, name: "童趣派對", description: "糖果色、粗黑邊框、活潑歡樂，給親切系老師", color: "from-pink-400 via-orange-300 to-yellow-300" },
    { id: "C" as const, name: "雜誌編輯", description: "大字、紅黑對比、克制留白，給品味派老師", color: "from-white via-slate-100 to-red-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">模板設定</h1>
      
      {/* Template Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">選擇模板風格</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === template.id 
                  ? "border-red-500 ring-2 ring-red-200" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`h-32 bg-gradient-to-br ${template.color}`} />
              <div className="p-4 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{template.name}</span>
                  {selectedTemplate === template.id && (
                    <Check className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-slate-500">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Block Order (Drag & Drop) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2">區塊排序</h2>
        <p className="text-sm text-slate-500 mb-4">拖拉調整區塊順序，點擊開關可啟用/隱藏區塊</p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {blocks.map((block) => (
                <SortableBlock 
                  key={block.id} 
                  block={block} 
                  onToggle={() => toggleBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex justify-end mt-6">
          <Button className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            儲存設定
          </Button>
        </div>
      </div>
    </div>
  )
}

interface SortableBlockProps {
  block: { id: string; name: string; locked: boolean; enabled: boolean }
  onToggle: () => void
}

function SortableBlock({ block, onToggle }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: block.locked })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isDragging 
          ? "bg-red-50 border-red-200 shadow-lg z-10" 
          : block.enabled 
            ? "bg-slate-50 border-slate-200" 
            : "bg-slate-100 border-slate-200 opacity-60"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`p-1 rounded ${block.locked ? "cursor-not-allowed text-slate-300" : "cursor-grab text-slate-400 hover:text-slate-600"}`}
      >
        {block.locked ? <Lock className="w-5 h-5" /> : <GripVertical className="w-5 h-5" />}
      </div>
      <span className={`flex-1 font-medium ${block.enabled ? "text-slate-700" : "text-slate-400"}`}>
        {block.name}
      </span>
      {!block.locked && (
        <button
          onClick={onToggle}
          className={`w-10 h-6 rounded-full transition-colors ${
            block.enabled ? "bg-green-500" : "bg-slate-300"
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
            block.enabled ? "translate-x-5" : "translate-x-1"
          }`} />
        </button>
      )}
      {block.locked && (
        <Badge variant="outline" className="text-xs">固定位置</Badge>
      )}
    </div>
  )
}

// ===== Courses Section =====
function CoursesSection({ teacher }: { teacher: Teacher }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">課程管理</h1>
        <Button className="bg-red-600 hover:bg-red-700">
          新增課程
        </Button>
      </div>

      <div className="space-y-4">
        {teacher.courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{course.name}</h3>
                  <Badge>{course.category}</Badge>
                </div>
                <p className="text-slate-500 text-sm mb-2">{course.ageRange} | {course.duration}</p>
                <div className="flex flex-wrap gap-1">
                  {course.highlights.map((h, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{h}</Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm">編輯</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Testimonials Section =====
function TestimonialsSection({ teacher }: { teacher: Teacher }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">客戶見證</h1>
        <div className="flex gap-2">
          <Button variant="outline">新增影片見證</Button>
          <Button className="bg-red-600 hover:bg-red-700">新增文字見證</Button>
        </div>
      </div>

      {/* Video Testimonials */}
      {teacher.testimonials.videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            影片見證
            <Badge className="bg-green-500">推薦優先</Badge>
          </h2>
          <div className="space-y-4">
            {teacher.testimonials.videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{video.personName}</div>
                    <div className="text-sm text-slate-500">{video.title}，{video.organization}</div>
                    <p className="mt-2 text-slate-600">{video.summary}</p>
                  </div>
                  <Button variant="outline" size="sm">編輯</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Testimonials */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">文字見證</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {teacher.testimonials.texts.map((text) => (
            <div key={text.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-slate-800">{text.personName}</div>
                  <div className="text-sm text-slate-500">{text.title} | {text.cooperationTime}</div>
                </div>
                <Button variant="ghost" size="sm">編輯</Button>
              </div>
              <p className="text-slate-600 text-sm">{text.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== Cases Section =====
function CasesSection({ teacher }: { teacher: Teacher }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">案例分享</h1>
        <Button className="bg-red-600 hover:bg-red-700">新增案例</Button>
      </div>

      <div className="space-y-4">
        {teacher.cases.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{c.organization}</h3>
                  {c.isOngoing && (
                    <Badge className="bg-green-500">持續合作中</Badge>
                  )}
                </div>
                <p className="text-red-600 font-medium text-sm mb-1">{c.project}</p>
                <p className="text-slate-500 text-sm mb-2">{c.period}</p>
                <p className="text-slate-600">{c.description}</p>
              </div>
              <Button variant="outline" size="sm">編輯</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Course Center Section =====
function CourseCenterSection({ teacher }: { teacher: Teacher }) {
  const [status, setStatus] = useState(teacher.courseStatus)

  const statusOptions = [
    { id: "open" as const, label: "開放接課", description: "目前可接新課程", color: "bg-green-500" },
    { id: "limited" as const, label: "名額有限", description: "僅剩少量時段", color: "bg-yellow-500" },
    { id: "closed" as const, label: "暫停接課", description: "目前滿��", color: "bg-red-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">接課中心</h1>

      {/* Status Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">接課狀態</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setStatus(option.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                status === option.id 
                  ? "border-slate-800 bg-slate-50" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${option.color}`} />
                <span className="font-bold text-slate-800">{option.label}</span>
              </div>
              <p className="text-sm text-slate-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Course Requests */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">課程需求看板</h2>
        <p className="text-slate-500 mb-4">學院目前釋出的課程需求，點擊「我有興趣」即可報名</p>
        
        <div className="space-y-4">
          {[
            { org: "新北市某某國小", type: "社團課程", talent: "魔術", time: "週三下午", sessions: 16, deadline: "2026/06/15" },
            { org: "台北市某某安親班", type: "營隊課程", talent: "科學", time: "暑假期間", sessions: 5, deadline: "2026/06/30" },
          ].map((req, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-800">{req.org}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>{req.type}</Badge>
                    <Badge variant="outline">{req.talent}</Badge>
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    {req.time} | 預估 {req.sessions} 堂 | 截止：{req.deadline}
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">我有興趣</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== Explore Section =====
function ExploreSection() {
  const talents = [
    { name: "魔術", icon: "wand", learned: true, demand: 3 },
    { name: "桌遊", icon: "dice", learned: true, demand: 3 },
    { name: "積木", icon: "blocks", learned: true, demand: 2 },
    { name: "科學", icon: "flask", learned: false, demand: 2 },
    { name: "手工藝", icon: "scissors", learned: false, demand: 2 },
    { name: "骨牌", icon: "layout", learned: true, demand: 2 },
    { name: "無人機", icon: "plane", learned: false, demand: 3 },
    { name: "拼豆", icon: "grid", learned: false, demand: 1 },
    { name: "程式機器人", icon: "bot", learned: true, demand: 3 },
    { name: "小木匠", icon: "hammer", learned: false, demand: 1 },
    { name: "紙藝", icon: "newspaper", learned: false, demand: 1 },
    { name: "魔法科學", icon: "sparkles", learned: false, demand: 2 },
    { name: "氣球", icon: "party", learned: false, demand: 2 },
    { name: "動力機械", icon: "cog", learned: true, demand: 2 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">探索其他才藝</h1>
      <p className="text-slate-500 mb-6">學習新才藝，擴大接課範圍！</p>

      {/* My Skills Summary */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold mb-1">我的才藝地圖</div>
            <div className="text-white/80">已會 {talents.filter(t => t.learned).length} 種才藝，還有 {talents.filter(t => !t.learned).length} 種可以學習</div>
          </div>
          <div className="text-4xl font-bold">{talents.filter(t => t.learned).length}/{talents.length}</div>
        </div>
      </div>

      {/* Talent Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {talents.map((talent) => (
          <div 
            key={talent.name}
            className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md cursor-pointer ${
              talent.learned ? "border-green-200 bg-green-50/50" : "border-slate-200"
            }`}
          >
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              talent.learned ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
            }`}>
              <span className="text-2xl">{talent.learned ? "✓" : "+"}</span>
            </div>
            <div className="font-medium text-slate-800 mb-1">{talent.name}</div>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3].map((level) => (
                <div 
                  key={level} 
                  className={`w-2 h-2 rounded-full ${level <= talent.demand ? "bg-orange-500" : "bg-slate-200"}`}
                />
              ))}
              <span className="text-xs text-slate-500 ml-1">需求</span>
            </div>
            {talent.learned ? (
              <Badge className="mt-2 bg-green-500 text-xs">已會</Badge>
            ) : (
              <Button size="sm" variant="outline" className="mt-2 text-xs h-7">申請培訓</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Placeholder Section =====
function PlaceholderSection({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="text-slate-400 mb-4">此區塊功能開發中</div>
        <Button variant="outline">返回總覽</Button>
      </div>
    </div>
  )
}
