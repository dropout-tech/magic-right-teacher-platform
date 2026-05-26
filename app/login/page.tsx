"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock teacher accounts for demo
const mockAccounts = [
  { email: "monkey@magicrightschool.com", password: "monkey123", teacherId: "monkey", name: "猴子老師" },
  { email: "pringle@magicrightschool.com", password: "pringle123", teacherId: "pringle", name: "品客老師" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const account = mockAccounts.find(
      acc => acc.email === email && acc.password === password
    )

    if (account) {
      // Store login info in localStorage for demo
      localStorage.setItem("teacherAuth", JSON.stringify({
        teacherId: account.teacherId,
        name: account.name,
        email: account.email,
        loginTime: new Date().toISOString()
      }))
      router.push("/setup")
    } else {
      setError("帳號或密碼錯誤，請重新輸入")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回官網</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MR</span>
              </div>
              <span className="font-bold text-slate-800">萊特魔數學院</span>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 px-8 py-8 text-white text-center">
              <h1 className="text-2xl font-bold mb-2">老師後台登入</h1>
              <p className="text-white/80 text-sm">管理您的品牌頁面與接課設定</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="請輸入您的電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">密碼</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="請輸入您的密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    登入中...
                  </>
                ) : (
                  "登入"
                )}
              </Button>

              {/* Demo accounts hint */}
              <div className="bg-slate-50 rounded-lg p-4 text-sm">
                <p className="text-slate-600 font-medium mb-2">Demo 帳號：</p>
                <div className="space-y-1 text-slate-500">
                  <p>猴子老師：monkey@magicrightschool.com / monkey123</p>
                  <p>品客老師：pringle@magicrightschool.com / pringle123</p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-500 text-sm">
              還不是萊特的老師？
              <a 
                href="https://magicrightschool.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 ml-1 font-medium"
              >
                前往師資招募
              </a>
            </p>
            <Link href="/admin" className="text-slate-400 text-xs hover:text-slate-600 block">
              管理員登入
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
