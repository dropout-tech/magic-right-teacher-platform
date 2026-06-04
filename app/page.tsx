"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Users, LogIn, Settings, MessageCircle } from "lucide-react"

export default function HomePage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen bg-slate-100">
      {/* 官網截圖作為背景 */}
      <div className="relative w-full">
        <Image
          src="/images/homepage-screenshot.jpg"
          alt="萊特魔數學院官網首頁"
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
        />
        
        {/* 導覽列上的入口按鈕 - 三個主要入口 */}
        <div className="absolute top-[2.2%] right-[8%] flex items-center gap-2">
          {/* 老師品牌頁 */}
          <Link
            href="/teachers"
            onMouseEnter={() => setIsHovered("teachers")}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-300 whitespace-nowrap
              ${isHovered === "teachers" 
                ? "bg-red-600 text-white shadow-lg scale-105" 
                : "bg-red-600 text-white shadow-md"
              }
            `}>
              <Users className="w-4 h-4" />
              老師品牌頁
            </div>
          </Link>

          {/* 老師登入 */}
          <Link
            href="/login"
            onMouseEnter={() => setIsHovered("login")}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-300 whitespace-nowrap
              ${isHovered === "login" 
                ? "bg-slate-700 text-white shadow-lg scale-105" 
                : "bg-slate-800/90 text-white shadow-md"
              }
            `}>
              <LogIn className="w-4 h-4" />
              老師登入
            </div>
          </Link>

          {/* 後台管理 */}
          <Link
            href="/admin"
            onMouseEnter={() => setIsHovered("admin")}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-300 whitespace-nowrap
              ${isHovered === "admin"
                ? "bg-slate-700 text-white shadow-lg scale-105"
                : "bg-slate-800/90 text-white shadow-md"
              }
            `}>
              <Settings className="w-4 h-4" />
              後台管理
            </div>
          </Link>

          {/* LINE@ 管理中心 */}
          <Link
            href="/line"
            onMouseEnter={() => setIsHovered("line")}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div
              className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white
              transition-all duration-300 whitespace-nowrap
              ${isHovered === "line" ? "shadow-lg scale-105" : "shadow-md"}
            `}
              style={{ backgroundColor: "#06C755" }}
            >
              <MessageCircle className="w-4 h-4" />
              LINE@ 管理
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
