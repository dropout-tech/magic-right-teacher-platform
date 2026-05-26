"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { addStoredTeacher, decodeTeacherFromPayload, getTeacherById } from "@/lib/teacher-storage"
import type { Teacher } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  HeroSection,
  AboutSection,
  CoursesSection,
  GallerySection,
  TestimonialsSection,
  CasesSection,
  SocialSection,
  ContactSection,
  BrandEndorsementSection
} from "@/components/teacher-brand-sections"

interface TeacherPageProps {
  params: Promise<{ id: string }>
}

export default function TeacherPage({ params }: TeacherPageProps) {
  const { id } = use(params)
  const [teacher, setTeacher] = useState<Teacher | null | undefined>(undefined)

  useEffect(() => {
    // Next.js may URL-encode dynamic segments — decode defensively
    const decoded = (() => { try { return decodeURIComponent(id) } catch { return id } })()

    // 1) 優先：URL 帶有編碼 payload（純前端「可分享連結」）
    const payload = new URLSearchParams(window.location.search).get("d")
    if (payload) {
      const fromUrl = decodeTeacherFromPayload(payload)
      if (fromUrl) {
        // 順手快取到本機 storage，下次點短連結也能開
        try { addStoredTeacher(fromUrl) } catch {}
        setTeacher(fromUrl)
        return
      }
    }

    // 2) 再來：靜態 mock 或本機 storage
    const found = getTeacherById(decoded) ?? getTeacherById(id)
    setTeacher(found ?? null)
  }, [id])

  if (teacher === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (teacher === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">找不到這位老師</h1>
          <p className="text-slate-500 mb-6">這個連結可能尚未啟用，或老師頁面已被移除。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/teachers">
              <Button variant="outline">回到老師總覽</Button>
            </Link>
            <Link href="/admin">
              <Button className="bg-red-600 hover:bg-red-700">前往後台</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const variant = teacher.template

  const shell = {
    A: { bg: "bg-[#0a0a0f]", header: "bg-black/80 border-amber-500/20 text-amber-100 backdrop-blur" },
    B: { bg: "bg-[#FFFAE5]", header: "bg-white border-b-4 border-black text-slate-900" },
    C: { bg: "bg-white", header: "bg-white border-slate-200 text-slate-900" },
  }[variant]

  const accent = {
    A: "text-amber-400",
    B: "text-pink-600",
    C: "text-red-600",
  }[variant]

  return (
    <div className={`min-h-screen ${shell.bg}`}>
      <header className={`sticky top-0 z-50 border-b ${shell.header}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/teachers" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm">
              <ArrowLeft className="w-5 h-5" />
              <span>返回總覽</span>
            </Link>
            <span className={`font-bold tracking-wider ${accent}`}>
              {teacher.name}
            </span>
            <Link href={`/setup?teacher=${teacher.id}`}>
              <Button size="sm" variant="outline" className={
                variant === "A" ? "border-amber-500/40 text-amber-100 hover:bg-amber-500/10" :
                variant === "B" ? "border-2 border-black text-black hover:bg-black hover:text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]" :
                ""
              }>
                編輯頁面
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <HeroSection teacher={teacher} variant={variant} />
        <AboutSection teacher={teacher} variant={variant} />
        <CoursesSection courses={teacher.courses} variant={variant} />
        <GallerySection teacher={teacher} variant={variant} />
        <TestimonialsSection testimonials={teacher.testimonials} variant={variant} />
        <CasesSection cases={teacher.cases} variant={variant} />
        <SocialSection social={teacher.social} variant={variant} />
        <ContactSection teacher={teacher} variant={variant} />
        <BrandEndorsementSection variant={variant} teacherName={teacher.name} />
      </main>

      <footer className={`py-6 text-center text-sm ${
        variant === "A" ? "bg-black text-amber-500/50" :
        variant === "B" ? "bg-black text-yellow-300" :
        "bg-slate-900 text-slate-400"
      }`}>
        <p>&copy; 2026 MR 萊特魔數學院 · 本頁面由老師品牌網站平台生成</p>
      </footer>
    </div>
  )
}
