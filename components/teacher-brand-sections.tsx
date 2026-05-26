// 老師品牌頁共用元件 — 三種模板：A 舞台魔術 / B 童趣派對 / C 雜誌編輯
"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Play,
  Quote,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Award,
  Sparkles,
  Star,
  Wand2,
  ArrowRight,
  ArrowUpRight,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Teacher, VideoTestimonial, TextTestimonial, Case, Course } from "@/lib/mock-data"
import { companyInfo } from "@/lib/mock-data"

type Variant = "A" | "B" | "C"

// ============================================================
// 區塊 1: Hero 主視覺
// ============================================================
interface HeroSectionProps {
  teacher: Teacher
  variant: Variant
}

export function HeroSection({ teacher, variant }: HeroSectionProps) {
  if (variant === "A") return <HeroStage teacher={teacher} />
  if (variant === "B") return <HeroParty teacher={teacher} />
  return <HeroEditorial teacher={teacher} />
}

function HeroStage({ teacher }: { teacher: Teacher }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0f] mr-spotlight mr-spotlight-sweep">
      {/* 裝飾：浮動星光 */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-12 left-[10%] w-5 h-5 text-amber-300/60 mr-float-1" />
        <Sparkles className="absolute top-32 right-[15%] w-7 h-7 text-amber-200/50 mr-float-2" />
        <Sparkles className="absolute bottom-20 left-[20%] w-4 h-4 text-yellow-200/40 mr-float-3" />
        <Star className="absolute top-1/2 right-[8%] w-6 h-6 text-amber-300/30 mr-float-2" />
      </div>

      {/* 紅幕 */}
      <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-red-900 via-red-700 to-red-900" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* 頭像 + 金框 */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600 blur-md opacity-70" />
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-amber-400/80 shadow-[0_0_80px_rgba(252,211,77,0.4)]">
              {teacher.avatar ? (
                <Image src={teacher.avatar} alt={teacher.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center text-7xl font-black text-black/80">
                  {teacher.name.charAt(0)}
                </div>
              )}
            </div>
            <Badge className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold border-0 ${
              teacher.courseStatus === "open" ? "bg-emerald-500 text-black" :
              teacher.courseStatus === "limited" ? "bg-amber-400 text-black" :
              "bg-red-600 text-white"
            }`}>
              {teacher.courseStatus === "open" ? "● 開放接課" : teacher.courseStatus === "limited" ? "● 名額有限" : "● 暫停接課"}
            </Badge>
          </div>

          {/* 資訊 */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs uppercase tracking-[0.3em]">
              <Wand2 className="w-3 h-3" /> Magic Right · Featured Teacher
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 mr-shimmer-gold tracking-tight">
              {teacher.name}
            </h1>
            <p className="text-xl md:text-2xl mb-7 text-amber-50/90 italic font-light">
              「{teacher.tagline}」
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {teacher.skills.slice(0, 6).map(skill => (
                <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full border border-amber-400/30 text-amber-200/90 bg-amber-400/5">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold shadow-lg shadow-amber-500/30">
                <Zap className="w-4 h-4 mr-2" />
                立即預約
              </Button>
              <Button size="lg" variant="outline" className="border-amber-400/40 text-amber-100 hover:bg-amber-400/10 bg-transparent">
                聯繫我
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部金線 */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
    </section>
  )
}

function HeroParty({ teacher }: { teacher: Teacher }) {
  return (
    <section className="relative overflow-hidden mr-confetti-bg border-b-4 border-black">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-14">
          {/* 頭像：粗黑框 + 偏移陰影 + 微旋 */}
          <div className="relative mx-auto md:mx-0">
            <div className="absolute -inset-4 bg-cyan-400 rounded-full -rotate-6" />
            <div className="absolute -inset-2 bg-yellow-300 rounded-full rotate-3" />
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-[5px] border-black bg-white">
              {teacher.avatar ? (
                <Image src={teacher.avatar} alt={teacher.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-7xl font-black text-white">
                  {teacher.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-white border-[3px] border-black text-xs font-black rotate-6 mr-brutal-shadow-sm">
              {teacher.courseStatus === "open" ? "🎉 接課中" : teacher.courseStatus === "limited" ? "⏰ 剩少量" : "🌙 暫停"}
            </div>
          </div>

          {/* 資訊 */}
          <div>
            <div className="inline-block px-3 py-1 mb-4 bg-black text-yellow-300 text-xs font-black uppercase tracking-widest -rotate-1">
              ✦ 萊特魔數學院 認證老師 ✦
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black leading-[0.95] mb-4">
              {teacher.name.replace("老師", "")}
              <span className="inline-block px-2 ml-2 bg-pink-500 text-white -rotate-2">老師</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-800 font-bold mb-6 max-w-xl">
              {teacher.tagline}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {teacher.skills.slice(0, 6).map((skill, i) => {
                const colors = [
                  "bg-pink-400 text-black",
                  "bg-cyan-300 text-black",
                  "bg-yellow-300 text-black",
                  "bg-lime-300 text-black",
                  "bg-orange-300 text-black",
                  "bg-purple-300 text-black",
                ]
                return (
                  <span key={skill} className={`px-3 py-1 text-sm font-black border-2 border-black mr-brutal-shadow-sm ${colors[i % colors.length]}`}>
                    {skill}
                  </span>
                )
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-black text-yellow-300 font-black text-lg border-[3px] border-black mr-brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                立即預約 →
              </button>
              <button className="px-6 py-3 bg-white text-black font-black text-lg border-[3px] border-black mr-brutal-shadow-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                聯繫我
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroEditorial({ teacher }: { teacher: Teacher }) {
  const lastName = teacher.name.replace("老師", "")
  return (
    <section className="relative bg-white border-b border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 上方刊頭 */}
        <div className="flex items-center justify-between pb-4 border-b border-black mb-14 text-xs uppercase tracking-[0.3em] text-slate-700">
          <span className="font-black">Issue · 老師專訪</span>
          <span className="font-black tracking-[0.4em]">NO. {teacher.id.toUpperCase()}</span>
          <span className="hidden md:inline">{new Date().getFullYear()} / {String(new Date().getMonth() + 1).padStart(2, "0")}</span>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-14 items-center">
          {/* 左側：雜誌封面風頭像框 */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-60 h-80 md:w-72 md:h-[26rem]">
              {/* 後層紅色色塊（位移做出深度） */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 w-full h-full bg-red-600" aria-hidden />

              {/* 頭像框 */}
              <div className="relative w-full h-full border-[3px] border-black overflow-hidden bg-black">
                {teacher.avatar ? (
                  <Image src={teacher.avatar} alt={teacher.name} fill className="object-cover grayscale contrast-110" />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <span className="text-[10rem] md:text-[13rem] font-black text-white leading-none select-none">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* 對角橫向裁切標籤（雜誌感） */}
                <div className="absolute bottom-5 -left-1 bg-white border-y-[3px] border-r-[3px] border-black px-4 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase text-black">
                  Portrait / 2026
                </div>
              </div>

              {/* 左上角紅色印章徽章 */}
              <div className="absolute -top-3 -left-3 bg-red-600 text-white border-[3px] border-black px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                No.01
              </div>
            </div>
          </div>

          {/* 右側：大字 */}
          <div className="md:col-span-7">
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-4">
              ▎Featured Educator
            </div>
            <h1 className="font-black text-black leading-[0.85] tracking-tighter mb-6">
              <span className="block text-6xl md:text-8xl">{lastName}</span>
              <span className="block text-3xl md:text-5xl text-red-600 mt-2">老師</span>
            </h1>
            <div className="border-l-4 border-red-600 pl-5 mb-7">
              <p className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed">
                {teacher.tagline}
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-black border-y border-black py-4 mb-7">
              <div className="text-center">
                <div className="text-2xl font-black text-black">{teacher.yearsOfExperience}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-black">{teacher.stats.totalStudents}+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-red-600">
                  {teacher.courseStatus === "open" ? "OPEN" : teacher.courseStatus === "limited" ? "FEW" : "FULL"}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Status</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-none px-8 font-bold">
                立即預約 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-none px-8 font-bold">
                聯繫我
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 區塊 2: 關於我
// ============================================================
interface AboutSectionProps {
  teacher: Teacher
  variant: Variant
}

export function AboutSection({ teacher, variant }: AboutSectionProps) {
  if (variant === "A") return <AboutStage teacher={teacher} />
  if (variant === "B") return <AboutParty teacher={teacher} />
  return <AboutEditorial teacher={teacher} />
}

function SectionLabelStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-400/50" />
        <span className="text-xs tracking-[0.4em] text-amber-400 uppercase">{children}</span>
        <span className="h-px w-10 bg-amber-400/50" />
      </div>
    </div>
  )
}

function AboutStage({ teacher }: { teacher: Teacher }) {
  return (
    <section className="py-20 bg-[#0a0a0f] relative">
      <div className="absolute inset-0 mr-spotlight opacity-50 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabelStage>About the Magician</SectionLabelStage>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12 mr-shimmer-gold">關於我</h2>

        <div className="border border-amber-400/20 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-amber-400/5 to-transparent backdrop-blur">
          <p className="text-lg leading-loose whitespace-pre-line text-amber-50/80 mb-10">
            {teacher.bio}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StageStat icon={<Clock className="w-5 h-5" />} value={`${teacher.yearsOfExperience}年`} label="教學年資" />
            <StageStat icon={<Users className="w-5 h-5" />} value={`${(teacher.stats.totalStudents / 1000).toFixed(1)}K`} label="服務學生" />
            <StageStat icon={<Building2 className="w-5 h-5" />} value={`${teacher.stats.totalPartners}+`} label="合作機構" />
            <StageStat icon={<Award className="w-5 h-5" />} value={`${(teacher.stats.totalHours / 1000).toFixed(1)}K`} label="教學時數" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs tracking-[0.3em] text-amber-400/70 uppercase mb-2">Style</div>
              <p className="text-lg text-amber-50">{teacher.teachingStyle}</p>
            </div>
            <div>
              <div className="text-xs tracking-[0.3em] text-amber-400/70 uppercase mb-2">Credentials</div>
              <ul className="space-y-2">
                {teacher.credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-amber-50/90">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StageStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="text-center p-4 rounded-xl border border-amber-400/20 bg-black/20">
      <div className="flex justify-center text-amber-400 mb-2">{icon}</div>
      <div className="text-2xl md:text-3xl font-black mr-shimmer-gold">{value}</div>
      <div className="text-xs text-amber-100/60 mt-1 tracking-wider">{label}</div>
    </div>
  )
}

function AboutParty({ teacher }: { teacher: Teacher }) {
  return (
    <section className="py-20 bg-[#FFFAE5] border-b-4 border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-cyan-300 border-2 border-black text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm -rotate-1">
            ✦ About Me ✦
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-black mt-5">
            關於<span className="inline-block bg-pink-500 text-white px-2 mx-1 rotate-1">我</span>
          </h2>
        </div>

        <div className="bg-white border-[3px] border-black p-7 md:p-10 mr-brutal-shadow mb-10">
          <p className="text-lg leading-loose whitespace-pre-line text-slate-800">
            {teacher.bio}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { v: `${teacher.yearsOfExperience}年`, l: "教學年資", bg: "bg-pink-400" },
            { v: `${(teacher.stats.totalStudents / 1000).toFixed(1)}K`, l: "服務學生", bg: "bg-cyan-300" },
            { v: `${teacher.stats.totalPartners}+`, l: "合作機構", bg: "bg-yellow-300" },
            { v: `${(teacher.stats.totalHours / 1000).toFixed(1)}K`, l: "教學時數", bg: "bg-lime-300" },
          ].map(s => (
            <div key={s.l} className={`${s.bg} border-[3px] border-black p-4 text-center mr-brutal-shadow-sm`}>
              <div className="text-3xl font-black text-black">{s.v}</div>
              <div className="text-xs font-bold text-black/70 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-[3px] border-black p-6 mr-brutal-shadow-pink">
            <h3 className="font-black text-black mb-3 text-lg">⚡ 教學風格</h3>
            <p className="text-slate-700">{teacher.teachingStyle}</p>
          </div>
          <div className="bg-white border-[3px] border-black p-6 mr-brutal-shadow-blue">
            <h3 className="font-black text-black mb-3 text-lg">🏆 證照資格</h3>
            <ul className="space-y-2">
              {teacher.credentials.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-pink-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutEditorial({ teacher }: { teacher: Teacher }) {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-24">
              <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎02</div>
              <h2 className="text-5xl md:text-6xl font-black text-black leading-none">
                關於<br/>我
              </h2>
              <div className="mt-6 h-1 w-12 bg-red-600" />
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-2xl md:text-3xl text-black font-bold leading-snug mb-8">
              「{teacher.tagline}」
            </p>
            <div className="md:columns-2 gap-10 text-lg text-slate-700 leading-loose whitespace-pre-line mb-10">
              {teacher.bio}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 border-y border-black divide-x divide-black mb-10">
              <EditorialStat value={`${teacher.yearsOfExperience}`} unit="年" label="教學年資" />
              <EditorialStat value={`${teacher.stats.totalStudents}`} unit="位" label="服務學生" />
              <EditorialStat value={`${teacher.stats.totalPartners}`} unit="間" label="合作機構" />
              <EditorialStat value={`${teacher.stats.totalHours.toLocaleString()}`} unit="hr" label="教學時數" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-red-600 font-bold mb-3 border-t-2 border-black pt-3">Teaching Style</div>
                <p className="text-lg text-black font-medium">{teacher.teachingStyle}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-red-600 font-bold mb-3 border-t-2 border-black pt-3">Credentials</div>
                <ul className="space-y-2">
                  {teacher.credentials.map((c, i) => (
                    <li key={i} className="text-black flex gap-3">
                      <span className="text-red-600 font-bold">0{i + 1}</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EditorialStat({ value, unit, label }: { value: string, unit: string, label: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="font-black text-black">
        <span className="text-3xl md:text-4xl">{value}</span>
        <span className="text-base ml-1 text-slate-500">{unit}</span>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{label}</div>
    </div>
  )
}

// ============================================================
// 區塊 3: 教授課程
// ============================================================
interface CoursesSectionProps {
  courses: Course[]
  variant: Variant
}

export function CoursesSection({ courses, variant }: CoursesSectionProps) {
  if (variant === "A") {
    return (
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 mr-spotlight opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>The Showcase</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-14 mr-shimmer-gold">教授課程</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <div key={c.id} className="group relative bg-gradient-to-br from-amber-950/40 to-black border border-amber-400/20 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(252,211,77,0.3)]">
                <div className="h-44 bg-gradient-to-br from-amber-500/20 via-amber-700/20 to-black flex items-center justify-center">
                  <span className="text-7xl font-black text-amber-400/30 group-hover:text-amber-400/60 transition-colors">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-amber-400/40 text-amber-300">{c.category}</span>
                    <span className="text-xs text-amber-100/50">{c.ageRange}</span>
                  </div>
                  <h3 className="text-xl font-black text-amber-50 mb-1">{c.name}</h3>
                  <p className="text-sm text-amber-100/60 mb-4">{c.duration}</p>
                  <ul className="space-y-1.5">
                    {c.highlights.slice(0, 3).map((h, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-amber-100/80">
                        <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"]
    const shadows = ["mr-brutal-shadow", "mr-brutal-shadow-pink", "mr-brutal-shadow-blue"]
    return (
      <section className="py-20 bg-yellow-300 border-y-4 border-black relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 bg-black text-yellow-300 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm rotate-1">★ Courses ★</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-5">超好玩課程</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((c, i) => (
              <div key={c.id} className={`bg-white border-[3px] border-black overflow-hidden ${rotations[i % rotations.length]} ${shadows[i % shadows.length]} hover:rotate-0 transition-transform`}>
                <div className={`h-36 flex items-center justify-center text-6xl ${["bg-pink-400", "bg-cyan-300", "bg-lime-300"][i % 3]} border-b-[3px] border-black`}>
                  {["🎩", "🎲", "🤖", "🎨", "🚀", "🎯"][i % 6]}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-black text-white font-black">{c.category}</span>
                    <span className="text-xs font-bold text-slate-600">{c.ageRange}</span>
                  </div>
                  <h3 className="text-xl font-black text-black mb-1">{c.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{c.duration}</p>
                  <ul className="space-y-1.5">
                    {c.highlights.slice(0, 3).map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-pink-500 font-black">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // C - Editorial
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎03 · Programs</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">教授課程</h2>
          </div>
          <div className="text-sm text-slate-600 hidden md:block">共 {courses.length} 門課程</div>
        </div>
        <div className="divide-y divide-black">
          {courses.map((c, i) => (
            <div key={c.id} className="grid md:grid-cols-12 gap-6 py-8 group hover:bg-white transition-colors">
              <div className="md:col-span-1 text-5xl font-black text-red-600 leading-none">{String(i + 1).padStart(2, "0")}</div>
              <div className="md:col-span-3">
                <Badge variant="outline" className="rounded-none border-black text-black mb-2">{c.category}</Badge>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{c.ageRange}</div>
                <div className="text-xs text-slate-500 mt-1">{c.duration}</div>
              </div>
              <div className="md:col-span-5">
                <h3 className="text-2xl md:text-3xl font-black text-black mb-3 group-hover:text-red-600 transition-colors">{c.name}</h3>
                <ul className="space-y-1 text-slate-700">
                  {c.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2 text-sm">
                      <span className="text-red-600">—</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3 md:text-right">
                <button className="inline-flex items-center gap-2 text-black font-bold text-sm hover:text-red-600 transition-colors border-b border-black hover:border-red-600 pb-0.5">
                  了解詳情 <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 區塊 4: 教學成果展示
// ============================================================
interface GallerySectionProps {
  teacher: Teacher
  variant: Variant
}

export function GallerySection({ teacher, variant }: GallerySectionProps) {
  if (variant === "A") {
    return (
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>Encore Moments</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 mr-shimmer-gold">教學瞬間</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`relative overflow-hidden rounded-xl border border-amber-400/20 bg-gradient-to-br ${i % 2 === 0 ? "from-amber-700/30 to-black aspect-square" : "from-amber-900/30 to-black aspect-[4/5]"} group cursor-pointer hover:border-amber-400/50 transition-all`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400/30 group-hover:text-amber-400/80 transition-colors mr-float-2" />
                </div>
                <div className="absolute bottom-2 left-3 text-xs text-amber-200/40 font-bold">#{String(i).padStart(3, "0")}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-amber-400/20 py-8">
            {[
              { v: `${teacher.stats.totalHours.toLocaleString()}+`, l: "累計教學時數" },
              { v: `${teacher.stats.totalStudents.toLocaleString()}+`, l: "累計服務學生" },
              { v: `${teacher.stats.totalPartners}+`, l: "合作機構數量" },
              { v: `${teacher.yearsOfExperience}`, l: "教學年資" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-4xl font-black mr-shimmer-gold">{s.v}</div>
                <div className="text-xs text-amber-100/60 mt-1 tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-20 bg-pink-200 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-black text-pink-200 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm rotate-1">📸 Gallery</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-5">教學現場</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12">
            {[
              { e: "🎩", c: "bg-cyan-300", r: "-rotate-2" },
              { e: "🎲", c: "bg-yellow-300", r: "rotate-1" },
              { e: "🤖", c: "bg-lime-300", r: "-rotate-1" },
              { e: "🎨", c: "bg-orange-300", r: "rotate-2" },
              { e: "🚀", c: "bg-purple-300", r: "-rotate-1" },
              { e: "🎯", c: "bg-pink-400", r: "rotate-1" },
            ].map((it, i) => (
              <div key={i} className={`${it.c} ${it.r} border-[3px] border-black aspect-square flex items-center justify-center mr-brutal-shadow hover:rotate-0 transition-transform cursor-pointer`}>
                <span className="text-7xl">{it.e}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: `${teacher.stats.totalHours.toLocaleString()}+`, l: "教學時數" },
              { v: `${teacher.stats.totalStudents.toLocaleString()}+`, l: "服務學生" },
              { v: `${teacher.stats.totalPartners}+`, l: "合作機構" },
              { v: `${teacher.yearsOfExperience}`, l: "年資" },
            ].map(s => (
              <div key={s.l} className="bg-white border-[3px] border-black p-4 text-center mr-brutal-shadow-sm">
                <div className="text-3xl md:text-4xl font-black text-black">{s.v}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // C - Editorial
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎04 · Field Notes</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">教學成果</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className={`aspect-square bg-slate-200 relative overflow-hidden ${i % 5 === 0 ? "bg-red-600" : ""}`}>
              <div className="absolute bottom-1 left-1 text-[10px] font-mono text-slate-500">{String(i).padStart(2, "0")}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-black divide-x divide-black">
          {[
            { v: teacher.stats.totalHours.toLocaleString(), u: "hr", l: "Hours" },
            { v: teacher.stats.totalStudents.toLocaleString(), u: "ppl", l: "Students" },
            { v: `${teacher.stats.totalPartners}`, u: "orgs", l: "Partners" },
            { v: `${teacher.yearsOfExperience}`, u: "yrs", l: "Years" },
          ].map(s => (
            <div key={s.l} className="py-6 px-4 text-center">
              <div className="font-black text-black">
                <span className="text-4xl md:text-5xl">{s.v}</span>
                <span className="text-sm text-red-600 ml-2">{s.u}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 區塊 5: 客戶見證
// ============================================================
interface TestimonialsSectionProps {
  testimonials: Teacher["testimonials"]
  variant: Variant
}

export function TestimonialsSection({ testimonials, variant }: TestimonialsSectionProps) {
  const [tab, setTab] = useState<"video" | "text">(testimonials.videos.length > 0 ? "video" : "text")
  const hasVideos = testimonials.videos.length > 0
  const hasTexts = testimonials.texts.length > 0
  if (!hasVideos && !hasTexts) return null

  if (variant === "A") {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>Standing Ovation</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-3 mr-shimmer-gold">真實好評</h2>
          <p className="text-center text-amber-100/60 mb-10">來自家長與機構夥伴的迴響</p>
          <TestimonialTabs variant="A" tab={tab} setTab={setTab} hasVideos={hasVideos} />
          {tab === "video" && (
            <div className="space-y-6">
              {testimonials.videos.map(v => <VideoCardStage key={v.id} v={v} />)}
            </div>
          )}
          {tab === "text" && (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.texts.map(t => <TextCardStage key={t.id} t={t} />)}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-20 bg-cyan-200 border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-black text-cyan-200 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm -rotate-1">💬 Reviews</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-5">大家怎麼說</h2>
          </div>
          <TestimonialTabs variant="B" tab={tab} setTab={setTab} hasVideos={hasVideos} />
          {tab === "video" && (
            <div className="space-y-6">
              {testimonials.videos.map(v => <VideoCardParty key={v.id} v={v} />)}
            </div>
          )}
          {tab === "text" && (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.texts.map((t, i) => <TextCardParty key={t.id} t={t} index={i} />)}
            </div>
          )}
        </div>
      </section>
    )
  }

  // C - Editorial
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎05 · Voices</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">合作迴響</h2>
          </div>
          <TestimonialTabs variant="C" tab={tab} setTab={setTab} hasVideos={hasVideos} />
        </div>
        {tab === "video" && (
          <div className="space-y-6">
            {testimonials.videos.map(v => <VideoCardEditorial key={v.id} v={v} />)}
          </div>
        )}
        {tab === "text" && (
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
            {testimonials.texts.map(t => <TextCardEditorial key={t.id} t={t} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialTabs({ variant, tab, setTab, hasVideos }: { variant: Variant, tab: "video" | "text", setTab: (t: "video" | "text") => void, hasVideos: boolean }) {
  const isActive = (k: string) => tab === k
  if (variant === "A") {
    return (
      <div className="flex justify-center gap-3 mb-10">
        {hasVideos && (
          <button onClick={() => setTab("video")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${isActive("video") ? "bg-amber-400 text-black" : "border border-amber-400/30 text-amber-200 hover:bg-amber-400/10"}`}>
            <Play className="w-3 h-3 inline mr-1.5" /> 影片見證
          </button>
        )}
        <button onClick={() => setTab("text")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${isActive("text") ? "bg-amber-400 text-black" : "border border-amber-400/30 text-amber-200 hover:bg-amber-400/10"}`}>
          <Quote className="w-3 h-3 inline mr-1.5" /> 文字見證
        </button>
      </div>
    )
  }
  if (variant === "B") {
    return (
      <div className="flex justify-center gap-4 mb-10">
        {hasVideos && (
          <button onClick={() => setTab("video")} className={`px-5 py-2 text-sm font-black border-[3px] border-black mr-brutal-shadow-sm ${isActive("video") ? "bg-black text-yellow-300" : "bg-white text-black"}`}>
            ▶ 影片見證
          </button>
        )}
        <button onClick={() => setTab("text")} className={`px-5 py-2 text-sm font-black border-[3px] border-black mr-brutal-shadow-sm ${isActive("text") ? "bg-black text-yellow-300" : "bg-white text-black"}`}>
          " 文字見證
        </button>
      </div>
    )
  }
  return (
    <div className="hidden md:flex gap-2">
      {hasVideos && (
        <button onClick={() => setTab("video")} className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${isActive("video") ? "border-red-600 bg-red-600 text-white" : "border-black text-black hover:bg-black hover:text-white"}`}>
          影片
        </button>
      )}
      <button onClick={() => setTab("text")} className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${isActive("text") ? "border-red-600 bg-red-600 text-white" : "border-black text-black hover:bg-black hover:text-white"}`}>
        文字
      </button>
    </div>
  )
}

function VideoCardStage({ v }: { v: VideoTestimonial }) {
  return (
    <div className="border border-amber-400/20 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950/30 to-black md:flex">
      <div className="md:w-1/2 aspect-video bg-black relative flex items-center justify-center">
        <div className="absolute inset-0 mr-spotlight opacity-50" />
        <div className="relative w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center shadow-[0_0_60px_rgba(252,211,77,0.5)]">
          <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
        </div>
      </div>
      <div className="md:w-1/2 p-8">
        <Quote className="w-8 h-8 text-amber-400 mb-3" />
        <p className="text-amber-50/90 text-lg leading-relaxed mb-5">{v.summary}</p>
        <div className="border-t border-amber-400/20 pt-4">
          <div className="font-bold mr-shimmer-gold text-lg">{v.personName}</div>
          <div className="text-sm text-amber-100/60">{v.title} · {v.organization}</div>
        </div>
      </div>
    </div>
  )
}

function VideoCardParty({ v }: { v: VideoTestimonial }) {
  return (
    <div className="bg-white border-[3px] border-black overflow-hidden mr-brutal-shadow md:flex">
      <div className="md:w-1/2 aspect-video bg-pink-400 border-r-0 md:border-r-[3px] border-b-[3px] md:border-b-0 border-black flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white border-[3px] border-black flex items-center justify-center mr-brutal-shadow-sm">
          <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
        </div>
      </div>
      <div className="md:w-1/2 p-6">
        <span className="inline-block px-2 py-0.5 bg-lime-300 border-2 border-black text-xs font-black mb-3">▶ 影片推薦</span>
        <p className="text-slate-800 text-lg font-medium leading-relaxed mb-4">{v.summary}</p>
        <div className="border-t-2 border-black pt-3">
          <div className="font-black text-black">{v.personName}</div>
          <div className="text-sm text-slate-600">{v.title} · {v.organization}</div>
        </div>
      </div>
    </div>
  )
}

function VideoCardEditorial({ v }: { v: VideoTestimonial }) {
  return (
    <div className="grid md:grid-cols-12 gap-6 border-t border-black pt-8">
      <div className="md:col-span-5">
        <div className="aspect-video bg-black relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="md:col-span-7">
        <div className="text-xs uppercase tracking-widest text-red-600 font-bold mb-2">Video Testimonial</div>
        <p className="text-xl md:text-2xl text-black font-medium leading-relaxed mb-4">「{v.summary}」</p>
        <div className="text-sm">
          <span className="font-black text-black">— {v.personName}</span>
          <span className="text-slate-500 ml-2">{v.title}, {v.organization}</span>
        </div>
      </div>
    </div>
  )
}

function TextCardStage({ t }: { t: TextTestimonial }) {
  return (
    <div className="border border-amber-400/20 rounded-2xl p-7 bg-gradient-to-br from-amber-950/20 to-transparent">
      <Quote className="w-8 h-8 text-amber-400 mb-3" />
      <p className="text-amber-50/85 leading-relaxed mb-5">{t.content}</p>
      <div className="flex items-center gap-3 border-t border-amber-400/20 pt-4">
        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-black">{t.personName.charAt(0)}</div>
        <div>
          <div className="font-bold text-amber-100">{t.personName}</div>
          <div className="text-xs text-amber-100/60">{t.title} · {t.cooperationTime}</div>
        </div>
      </div>
    </div>
  )
}

function TextCardParty({ t, index }: { t: TextTestimonial, index: number }) {
  const colors = [
    { bg: "bg-white", shadow: "mr-brutal-shadow-pink", chip: "bg-pink-400" },
    { bg: "bg-white", shadow: "mr-brutal-shadow-blue", chip: "bg-cyan-300" },
    { bg: "bg-white", shadow: "mr-brutal-shadow", chip: "bg-yellow-300" },
  ]
  const c = colors[index % colors.length]
  return (
    <div className={`${c.bg} border-[3px] border-black p-6 ${c.shadow}`}>
      <div className="text-6xl text-black/10 font-black leading-none mb-2">"</div>
      <p className="text-slate-800 leading-relaxed mb-5 font-medium -mt-4">{t.content}</p>
      <div className="flex items-center gap-3 border-t-2 border-black pt-3">
        <div className={`w-11 h-11 ${c.chip} border-[3px] border-black flex items-center justify-center text-black font-black`}>{t.personName.charAt(0)}</div>
        <div>
          <div className="font-black text-black">{t.personName}</div>
          <div className="text-xs text-slate-600">{t.title} · {t.cooperationTime}</div>
        </div>
      </div>
    </div>
  )
}

function TextCardEditorial({ t }: { t: TextTestimonial }) {
  return (
    <div className="border-t border-black pt-6">
      <Quote className="w-6 h-6 text-red-600 mb-3" />
      <p className="text-lg md:text-xl text-black font-medium leading-snug mb-4">「{t.content}」</p>
      <div className="text-sm">
        <span className="font-black text-black">— {t.personName}</span>
        <span className="text-slate-500 ml-2">{t.title}, {t.cooperationTime}</span>
      </div>
    </div>
  )
}

// ============================================================
// 區塊 6: 案例分享
// ============================================================
interface CasesSectionProps {
  cases: Case[]
  variant: Variant
}

export function CasesSection({ cases, variant }: CasesSectionProps) {
  const [filter, setFilter] = useState<"all" | "ongoing" | "past">("all")
  const filtered = cases.filter(c => filter === "ongoing" ? c.isOngoing : filter === "past" ? !c.isOngoing : true)
  const ongoingCount = cases.filter(c => c.isOngoing).length
  if (cases.length === 0) return null

  if (variant === "A") {
    return (
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>Case Files</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-3 mr-shimmer-gold">合作案例</h2>
          <p className="text-center text-amber-100/60 mb-8">
            目前持續合作 <span className="text-amber-300 font-bold">{ongoingCount}</span> 間機構，累計服務 <span className="text-amber-300 font-bold">{cases.length}</span> 間
          </p>
          <CaseFilter variant="A" filter={filter} setFilter={setFilter} />
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(c => (
              <div key={c.id} className="border border-amber-400/20 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950/20 to-black">
                <div className="h-28 bg-gradient-to-br from-amber-700/30 to-amber-900/30 flex items-center justify-center border-b border-amber-400/10">
                  <Building2 className="w-10 h-10 text-amber-400/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-amber-50">{c.organization}</h3>
                    {c.isOngoing && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">持續中</span>}
                  </div>
                  <p className="text-sm text-amber-300/90 mb-2">{c.project}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-100/50 mb-3">
                    <Calendar className="w-3 h-3" /> {c.period}
                  </div>
                  <p className="text-sm text-amber-100/80 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-20 bg-lime-200 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-black text-lime-200 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm rotate-1">📁 Cases</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-5">合作案例</h2>
            <p className="mt-3 text-slate-800 font-medium">
              已與 <span className="bg-pink-400 px-2 border-2 border-black">{cases.length} 間</span> 機構合作！
            </p>
          </div>
          <CaseFilter variant="B" filter={filter} setFilter={setFilter} />
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((c, i) => (
              <div key={c.id} className={`bg-white border-[3px] border-black p-6 ${i % 2 === 0 ? "mr-brutal-shadow" : "mr-brutal-shadow-pink"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-300 border-[3px] border-black flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-black text-black text-lg">{c.organization}</h3>
                  </div>
                  {c.isOngoing && (
                    <span className="text-xs px-2 py-1 bg-lime-400 border-2 border-black font-black">合作中</span>
                  )}
                </div>
                <p className="text-pink-600 font-black mb-1">{c.project}</p>
                <div className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {c.period}
                </div>
                <p className="text-slate-700 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // C - Editorial
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎06 · Track Record</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">合作案例</h2>
          </div>
          <div className="text-sm text-slate-700">
            持續中 <span className="font-black text-red-600">{ongoingCount}</span> / 累計 <span className="font-black text-black">{cases.length}</span>
          </div>
        </div>
        <CaseFilter variant="C" filter={filter} setFilter={setFilter} />
        <div className="divide-y divide-black">
          {filtered.map((c, i) => (
            <div key={c.id} className="grid md:grid-cols-12 gap-6 py-8">
              <div className="md:col-span-1 text-4xl font-black text-red-600">{String(i + 1).padStart(2, "0")}</div>
              <div className="md:col-span-4">
                <h3 className="text-2xl font-black text-black mb-2">{c.organization}</h3>
                {c.isOngoing && <Badge className="bg-red-600 text-white rounded-none mb-2">Active</Badge>}
                <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {c.period}
                </div>
              </div>
              <div className="md:col-span-7">
                <p className="text-sm uppercase tracking-widest text-red-600 font-bold mb-2">{c.project}</p>
                <p className="text-slate-700 leading-loose">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseFilter({ variant, filter, setFilter }: { variant: Variant, filter: "all" | "ongoing" | "past", setFilter: (f: "all" | "ongoing" | "past") => void }) {
  const opts: { id: "all" | "ongoing" | "past", label: string }[] = [
    { id: "all", label: "全部" },
    { id: "ongoing", label: "持續中" },
    { id: "past", label: "歷史" },
  ]
  if (variant === "A") {
    return (
      <div className="flex justify-center gap-2 mb-10">
        {opts.map(o => (
          <button key={o.id} onClick={() => setFilter(o.id)} className={`px-4 py-1.5 rounded-full text-sm transition-all ${filter === o.id ? "bg-amber-400 text-black font-bold" : "border border-amber-400/30 text-amber-200 hover:bg-amber-400/10"}`}>
            {o.label}
          </button>
        ))}
      </div>
    )
  }
  if (variant === "B") {
    return (
      <div className="flex justify-center gap-3 mb-10">
        {opts.map(o => (
          <button key={o.id} onClick={() => setFilter(o.id)} className={`px-4 py-1.5 text-sm font-black border-[3px] border-black mr-brutal-shadow-sm ${filter === o.id ? "bg-black text-lime-300" : "bg-white text-black"}`}>
            {o.label}
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-1 mb-10 border-y border-black py-2">
      {opts.map(o => (
        <button key={o.id} onClick={() => setFilter(o.id)} className={`px-3 py-1 text-xs uppercase tracking-widest font-bold transition-colors ${filter === o.id ? "bg-red-600 text-white" : "text-black hover:bg-black hover:text-white"}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ============================================================
// 區塊 7: 社群媒體
// ============================================================
interface SocialSectionProps {
  social: Teacher["social"]
  variant: Variant
}

export function SocialSection({ social, variant }: SocialSectionProps) {
  const links = [
    { key: "facebook", icon: Facebook, label: "Facebook", url: social.facebook },
    { key: "instagram", icon: Instagram, label: "Instagram", url: social.instagram },
    { key: "youtube", icon: Youtube, label: "YouTube", url: social.youtube },
    { key: "line", icon: MessageCircle, label: "LINE", url: social.line },
  ].filter(s => s.url)

  if (links.length === 0) return null

  if (variant === "A") {
    return (
      <section className="py-20 bg-black text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>Stay Connected</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black mr-shimmer-gold mb-3">追蹤我的舞台</h2>
          <p className="text-amber-100/60 text-sm mb-8">
            <Clock className="w-3 h-3 inline mr-1" /> 最近更新：{social.lastUpdated}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {links.map(({ key, icon: Icon, label, url }) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 w-24 h-24 rounded-2xl border border-amber-400/30 hover:border-amber-400 hover:bg-amber-400/10 transition-all hover:-translate-y-1 justify-center">
                <Icon className="w-8 h-8 text-amber-300 group-hover:text-amber-200" />
                <span className="text-xs text-amber-100/70">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-20 bg-orange-300 border-b-4 border-black text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-1 bg-black text-orange-300 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm rotate-1">✦ Follow Me ✦</span>
          <h2 className="text-5xl md:text-6xl font-black text-black mt-5 mb-3">來追我！</h2>
          <p className="text-sm text-slate-800 font-bold mb-8">
            🕐 最近更新：{social.lastUpdated}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {links.map(({ key, icon: Icon, label, url }, i) => {
              const colors = ["bg-pink-400", "bg-cyan-300", "bg-yellow-300", "bg-lime-300"]
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={`${colors[i % colors.length]} border-[3px] border-black flex flex-col items-center gap-2 w-24 h-24 justify-center mr-brutal-shadow hover:rotate-3 transition-transform`}>
                  <Icon className="w-8 h-8 text-black" />
                  <span className="text-xs font-black text-black">{label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎07 · Social</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">追蹤動態</h2>
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">UPDATED {social.lastUpdated}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black border border-black">
          {links.map(({ key, icon: Icon, label, url }) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="p-8 flex flex-col items-center justify-center gap-3 hover:bg-red-600 hover:text-white text-black transition-colors group">
              <Icon className="w-10 h-10" />
              <span className="text-sm font-black uppercase tracking-widest">{label}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 區塊 8: 聯絡與預約
// ============================================================
interface ContactSectionProps {
  teacher: Teacher
  variant: Variant
}

export function ContactSection({ teacher, variant }: ContactSectionProps) {
  if (variant === "A") {
    return (
      <section className="py-20 bg-[#0a0a0f] relative">
        <div className="absolute inset-0 mr-spotlight opacity-50 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabelStage>Book the Magician</SectionLabelStage>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 mr-shimmer-gold">聯絡與預約</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-amber-400/20 rounded-2xl p-7 bg-gradient-to-br from-amber-950/20 to-transparent">
              <h3 className="font-black text-amber-50 mb-5 text-lg">📨 課程諮詢</h3>
              <form className="space-y-4">
                <Input placeholder="您的姓名" className="bg-black/40 border-amber-400/30 text-amber-50 placeholder:text-amber-100/40 focus:border-amber-400" />
                <Input placeholder="機構名稱（選填）" className="bg-black/40 border-amber-400/30 text-amber-50 placeholder:text-amber-100/40 focus:border-amber-400" />
                <Input placeholder="聯絡電話或 Email" className="bg-black/40 border-amber-400/30 text-amber-50 placeholder:text-amber-100/40 focus:border-amber-400" />
                <Textarea placeholder="請描述您的需求..." rows={4} className="bg-black/40 border-amber-400/30 text-amber-50 placeholder:text-amber-100/40 focus:border-amber-400" />
                <Button className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold">
                  送出諮詢
                </Button>
              </form>
            </div>
            <div className="space-y-5">
              <div className="border border-amber-400/20 rounded-2xl p-7 bg-gradient-to-br from-amber-950/20 to-transparent">
                <h3 className="font-black text-amber-50 mb-4 text-lg">📞 聯絡資訊</h3>
                <div className="space-y-3">
                  {teacher.contact.email && (
                    <div className="flex items-center gap-3 text-amber-100/80">
                      <Mail className="w-5 h-5 text-amber-400" /> {teacher.contact.email}
                    </div>
                  )}
                  {teacher.contact.phone && (
                    <div className="flex items-center gap-3 text-amber-100/80">
                      <Phone className="w-5 h-5 text-amber-400" /> {teacher.contact.phone}
                    </div>
                  )}
                </div>
              </div>
              <a href={companyInfo.social.line} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span className="flex-1">萊特魔數學院官方客服</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-20 bg-yellow-200 border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-black text-yellow-200 text-xs font-black uppercase tracking-widest mr-brutal-shadow-sm -rotate-1">📩 Contact</span>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-5">來找我聊聊！</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-[3px] border-black p-6 mr-brutal-shadow">
              <h3 className="font-black text-black mb-5 text-lg">✦ 課程諮詢表單</h3>
              <form className="space-y-3">
                <Input placeholder="您的姓名" className="border-2 border-black bg-cream rounded-none" />
                <Input placeholder="機構名稱（選填）" className="border-2 border-black bg-cream rounded-none" />
                <Input placeholder="聯絡電話或 Email" className="border-2 border-black bg-cream rounded-none" />
                <Textarea placeholder="請描述您的需求..." rows={4} className="border-2 border-black bg-cream rounded-none" />
                <button type="button" className="w-full px-4 py-3 bg-pink-500 text-white font-black border-[3px] border-black mr-brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  送出諮詢 →
                </button>
              </form>
            </div>
            <div className="space-y-5">
              <div className="bg-white border-[3px] border-black p-6 mr-brutal-shadow-blue">
                <h3 className="font-black text-black mb-4 text-lg">☎️ 聯絡資訊</h3>
                <div className="space-y-3">
                  {teacher.contact.email && (
                    <div className="flex items-center gap-3 text-slate-800 font-medium">
                      <Mail className="w-5 h-5 text-pink-500" /> {teacher.contact.email}
                    </div>
                  )}
                  {teacher.contact.phone && (
                    <div className="flex items-center gap-3 text-slate-800 font-medium">
                      <Phone className="w-5 h-5 text-pink-500" /> {teacher.contact.phone}
                    </div>
                  )}
                </div>
              </div>
              <a href={companyInfo.social.line} target="_blank" rel="noopener noreferrer" className="block bg-lime-300 border-[3px] border-black p-5 mr-brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="flex items-center gap-3 text-black font-black">
                  <MessageCircle className="w-6 h-6" />
                  <span className="flex-1">LINE 官方客服</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold mb-2">▎08 · Get in Touch</div>
            <h2 className="text-5xl md:text-6xl font-black text-black leading-none">聯絡與預約</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">Name</label>
                  <Input placeholder="您的姓名" className="border-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">Organization</label>
                  <Input placeholder="機構名稱（選填）" className="border-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">Contact</label>
                <Input placeholder="聯絡電話或 Email" className="border-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">Message</label>
                <Textarea rows={5} placeholder="請描述您的需求..." className="border-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0" />
              </div>
              <Button className="bg-black hover:bg-red-600 text-white rounded-none px-8 font-bold mt-4">
                送出諮詢 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
          <div className="md:col-span-5">
            <div className="border-l-2 border-black pl-8 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-red-600 font-bold mb-3">Direct Contact</div>
                <div className="space-y-2">
                  {teacher.contact.email && (
                    <div className="text-black font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-600" /> {teacher.contact.email}
                    </div>
                  )}
                  {teacher.contact.phone && (
                    <div className="text-black font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-600" /> {teacher.contact.phone}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-red-600 font-bold mb-3">Official Channel</div>
                <a href={companyInfo.social.line} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  LINE 官方客服
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 區塊 9: 萊特魔數學院品牌背書
// ============================================================
interface BrandEndorsementSectionProps {
  variant: Variant
  teacherName: string
}

export function BrandEndorsementSection({ variant, teacherName }: BrandEndorsementSectionProps) {
  if (variant === "A") {
    return (
      <section className="py-12 bg-gradient-to-b from-black to-[#0a0a0f] border-t border-amber-400/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-red-700 flex items-center justify-center shadow-[0_0_50px_rgba(252,211,77,0.3)]">
              <span className="text-black font-black text-2xl">MR</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black mr-shimmer-gold mb-1">萊特魔數學院</h3>
              <p className="text-sm text-amber-100/70 mb-3">兒童素養才藝班的領導品牌 · 14+ 種才藝課程</p>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs border border-amber-400/30">
                  <Award className="w-3 h-3 inline mr-1" /> 認證講師
                </span>
                <span className="text-xs text-amber-100/60">{teacherName} 為萊特魔數學院認證講師</span>
              </div>
            </div>
            <div className="flex gap-2">
              {companyInfo.partners.map(p => (
                <span key={p} className="px-3 py-1 text-xs rounded-full border border-amber-400/30 text-amber-200/80">{p}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-amber-400/10 text-center">
            <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300">
              前往萊特魔數學院官網 <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    )
  }

  if (variant === "B") {
    return (
      <section className="py-12 bg-black text-yellow-300 border-t-4 border-pink-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-pink-500 border-[3px] border-yellow-300 flex items-center justify-center">
              <span className="text-white font-black text-2xl">MR</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-yellow-300 mb-1">萊特魔數學院</h3>
              <p className="text-sm text-yellow-100/80 mb-3">14+ 種好玩才藝，陪孩子一起長大 🎉</p>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="px-3 py-1 bg-yellow-300 text-black text-xs font-black border-2 border-yellow-300">★ 認證講師</span>
                <span className="text-xs text-yellow-100/70">{teacherName} 為認證老師</span>
              </div>
            </div>
            <div className="flex gap-2">
              {companyInfo.partners.map(p => (
                <span key={p} className="px-3 py-1 text-xs text-yellow-200 border-2 border-yellow-300/40">{p}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-yellow-300 underline decoration-pink-500 decoration-4 underline-offset-4 hover:text-pink-300">
              前往萊特魔數學院官網 →
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-1">
            <div className="w-16 h-16 bg-red-600 flex items-center justify-center text-white font-black text-xl">MR</div>
          </div>
          <div className="md:col-span-7">
            <h3 className="text-xl font-black text-black">萊特魔數學院 · MR LITE MAGIC RIGHT SCHOOL</h3>
            <p className="text-sm text-slate-600 mt-1">兒童素養才藝班的領導品牌 · 14+ 種才藝課程</p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">{teacherName} is a certified instructor of MR.</p>
          </div>
          <div className="md:col-span-4 flex md:justify-end gap-2 flex-wrap">
            {companyInfo.partners.map(p => (
              <span key={p} className="px-3 py-1 border border-black text-xs text-black">{p}</span>
            ))}
            <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-2 ml-2">
              官網 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
