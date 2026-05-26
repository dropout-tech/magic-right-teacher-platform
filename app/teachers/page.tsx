"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Clock, ChevronRight, ArrowLeft, LogIn, Sparkles } from "lucide-react"
import type { Teacher } from "@/lib/mock-data"
import { teachers as staticTeachers } from "@/lib/mock-data"
import { getAllTeachers } from "@/lib/teacher-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TeachersPage() {
  const [selectedTalent, setSelectedTalent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [teachers, setTeachers] = useState<Teacher[]>(staticTeachers)

  useEffect(() => {
    setTeachers(getAllTeachers())
  }, [])

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.skills.some(skill => skill.includes(searchQuery))
    const matchesTalent = !selectedTalent || teacher.skills.includes(selectedTalent)
    return matchesSearch && matchesTalent
  })

  const talentFilters = ["魔術", "桌遊", "積木", "科學", "手工藝", "骨牌", "無人機", "程式機器人"]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Gradient Header Bar */}
      <div className="h-12 bg-gradient-to-r from-red-600 via-orange-500 to-red-500" />

      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回官網</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MR</span>
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline">萊特魔數學院</span>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-600">
                <LogIn className="w-4 h-4 mr-2" />
                老師登入
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Search & Filter Section */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="搜尋老師姓名或才藝..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base rounded-full border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* Talent Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={selectedTalent === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTalent(null)}
              className={`rounded-full px-5 ${
                selectedTalent === null 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "border-slate-300 hover:border-slate-400"
              }`}
            >
              全部
            </Button>
            {talentFilters.map(talent => (
              <Button
                key={talent}
                variant={selectedTalent === talent ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTalent(talent)}
                className={`rounded-full px-5 ${
                  selectedTalent === talent 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                {talent}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Cards Grid */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">沒有找到符合條件的老師</p>
              <Button
                variant="link"
                onClick={() => {
                  setSelectedTalent(null)
                  setSearchQuery("")
                }}
                className="text-red-600"
              >
                清除篩選條件
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; 2026 MR 萊特魔數學院 | 信均國際文教有限公司
          </p>
          <p className="text-xs mt-2">
            服務專線：(02) 2683-2613 | magicrightschool@gmail.com
          </p>
        </div>
      </footer>
    </div>
  )
}

interface TeacherCardProps {
  teacher: Teacher
}

function TeacherCard({ teacher }: TeacherCardProps) {
  const statusConfig = {
    open: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-700", 
      border: "border-emerald-200",
      label: "開放接課" 
    },
    limited: { 
      bg: "bg-orange-50", 
      text: "text-orange-700", 
      border: "border-orange-200",
      label: "名額有限" 
    },
    closed: { 
      bg: "bg-slate-100", 
      text: "text-slate-600", 
      border: "border-slate-200",
      label: "暫停接課" 
    }
  }

  const status = statusConfig[teacher.courseStatus]
  const displaySkills = teacher.skills.slice(0, 4)
  const remainingSkills = teacher.skills.length - 4

  return (
    <Link href={`/teacher/${teacher.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
        {/* Large Photo Area */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200">
          {teacher.avatar ? (
            <Image
              src={teacher.avatar}
              alt={teacher.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">
                  {teacher.name.replace("老師", "").charAt(0)}
                </span>
              </div>
            </div>
          )}
          {/* Status Badge Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
            <Badge className={`text-xs ${status.bg} ${status.text} ${status.border} border font-medium shadow-sm`}>
              {status.label}
            </Badge>
            <Badge className="text-[10px] bg-white/90 text-slate-600 border border-slate-200 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              {teacher.template === "A" ? "舞台魔術" : teacher.template === "B" ? "童趣派對" : "雜誌編輯"}
            </Badge>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          {/* Name & Experience */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">
              {teacher.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
              <Clock className="w-4 h-4" />
              <span>教學年資 {teacher.yearsOfExperience} 年</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {teacher.tagline}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {displaySkills.map(skill => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="text-xs bg-white text-slate-600 border-slate-300 font-normal"
              >
                {skill}
              </Badge>
            ))}
            {remainingSkills > 0 && (
              <Badge variant="outline" className="text-xs bg-white text-slate-500 border-slate-300 font-normal">
                +{remainingSkills}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-t border-slate-100">
          <div className="p-4 text-center">
            <div className="text-xl font-bold text-slate-800">
              {teacher.stats.totalHours >= 1000 
                ? `${(teacher.stats.totalHours / 1000).toFixed(1)}K` 
                : teacher.stats.totalHours}
            </div>
            <div className="text-xs text-slate-500">教學時數</div>
          </div>
          <div className="p-4 text-center border-x border-slate-100">
            <div className="text-xl font-bold text-slate-800">
              {teacher.stats.totalStudents >= 1000 
                ? `${(teacher.stats.totalStudents / 1000).toFixed(1)}K` 
                : teacher.stats.totalStudents}
            </div>
            <div className="text-xs text-slate-500">服務學生</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xl font-bold text-slate-800">{teacher.stats.totalPartners}</div>
            <div className="text-xs text-slate-500">合作機構</div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">查看完整介紹</span>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
