"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Inbox,
  Package,
  Presentation,
  ShoppingBag,
  Sparkles,
  Truck,
  Video,
} from "lucide-react"
import type { Teacher } from "@/lib/mock-data"
import { PLAN_LABELS } from "@/lib/mock-data"
import {
  formatTWD,
  getOrdersByTeacher,
  getOwnedMaterials,
  PAYMENT_METHOD_LABELS,
  type Order,
  type OwnedMaterial,
} from "@/lib/order-storage"
import {
  MATERIAL_TYPE_LABELS,
  type DigitalMaterial,
  type MaterialType,
  type TrainingMaterial,
} from "@/lib/material-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const TYPE_ICON = {
  physical: Package,
  digital: FileText,
  training: GraduationCap,
} as const

const TYPE_TONE = {
  physical: "text-blue-700 bg-blue-50 border-blue-200",
  digital: "text-violet-700 bg-violet-50 border-violet-200",
  training: "text-emerald-700 bg-emerald-50 border-emerald-200",
} as const

interface MyOrdersProps {
  teacher: Teacher
  onGoToShop?: () => void
}

export function MyOrders({ teacher, onGoToShop }: MyOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [owned, setOwned] = useState<OwnedMaterial[]>([])
  const [tab, setTab] = useState<"orders" | "materials">("materials")

  useEffect(() => {
    setOrders(getOrdersByTeacher(teacher.id))
    setOwned(getOwnedMaterials(teacher.id))
  }, [teacher.id])

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders],
  )

  const totalSaved = useMemo(
    () => orders.reduce((sum, o) => sum + o.discount.amountSaved, 0),
    [orders],
  )

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">我的訂單</h1>
          <p className="text-sm text-slate-500 mt-1">
            管理已購買的教材與查看訂單紀錄
          </p>
        </div>
        {onGoToShop && (
          <Button variant="outline" onClick={onGoToShop}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            前往教材中心
          </Button>
        )}
      </div>

      {/* 摘要卡 */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard label="累計訂單" value={`${orders.length} 筆`} />
          <SummaryCard label="累計消費" value={formatTWD(totalSpent)} />
          <SummaryCard
            label={`方案折扣節省（${PLAN_LABELS[teacher.subscription?.plan ?? "trial"]}）`}
            value={`− ${formatTWD(totalSaved)}`}
            accent="emerald"
          />
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as "orders" | "materials")}>
        <TabsList className="mb-4">
          <TabsTrigger value="materials">
            我的教材（{owned.length}）
          </TabsTrigger>
          <TabsTrigger value="orders">
            訂單歷史（{orders.length}）
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          {owned.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="w-10 h-10 text-slate-300" />}
              title="還沒有購買任何教材"
              hint="去教材中心挑選道具、教案或師資培訓吧"
              cta={
                onGoToShop && (
                  <Button onClick={onGoToShop} className="bg-red-600 hover:bg-red-700">
                    前往教材中心
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {owned.map((o) => (
                <OwnedCard key={o.material.id} owned={o} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {orders.length === 0 ? (
            <EmptyState
              icon={<Inbox className="w-10 h-10 text-slate-300" />}
              title="還沒有任何訂單"
              hint="完成第一筆訂單後，這裡會顯示訂單歷史與付款狀態"
            />
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ===== 摘要卡 =====
function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: "emerald"
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={cn(
          "text-2xl font-bold mt-1.5",
          accent === "emerald" ? "text-emerald-600" : "text-slate-800",
        )}
      >
        {value}
      </div>
    </div>
  )
}

// ===== 我的教材卡 =====
function OwnedCard({ owned }: { owned: OwnedMaterial }) {
  const { material } = owned
  const Icon = TYPE_ICON[material.type as MaterialType]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
      <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className={cn("text-[10px] border font-normal", TYPE_TONE[material.type])}>
            {MATERIAL_TYPE_LABELS[material.type]}
          </Badge>
          {owned.totalQty > 1 && (
            <span className="text-[11px] text-slate-500">× {owned.totalQty}</span>
          )}
        </div>
        <h3 className="font-bold text-slate-800 line-clamp-1">{material.name}</h3>
        <p className="text-[11px] text-slate-400 mt-1">
          首次購買：{owned.firstPurchasedAt.slice(0, 10)}
        </p>

        {/* 各類型動作區 */}
        {material.type === "digital" && (
          <DigitalActions material={material as DigitalMaterial} />
        )}
        {material.type === "training" && (
          <TrainingActions material={material as TrainingMaterial} owned={owned} />
        )}
        {material.type === "physical" && (
          <PhysicalActions />
        )}
      </div>
    </div>
  )
}

function DigitalActions({ material }: { material: DigitalMaterial }) {
  const FileIcon = {
    pdf: FileText,
    video: Video,
    ppt: Presentation,
    bundle: Package,
  }[material.fileType]

  const handleDownload = () => {
    window.alert("這是示範環境，未提供實際檔案下載。\n正式版本將提供安全的下載連結。")
  }

  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <FileIcon className="w-3.5 h-3.5" />
        {material.fileSize}
        {material.pages && ` · ${material.pages} 頁`}
        {material.videoLength && ` · ${material.videoLength}`}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs border-violet-200 text-violet-700 hover:bg-violet-50"
        onClick={handleDownload}
      >
        <Download className="w-3.5 h-3.5 mr-1" />
        下載
      </Button>
    </div>
  )
}

function TrainingActions({
  material,
  owned,
}: {
  material: TrainingMaterial
  owned: OwnedMaterial
}) {
  const lastSchedule = owned.schedules
    .filter((s) => s.scheduleSnapshot)
    .at(-1)?.scheduleSnapshot

  return (
    <div className="mt-3 space-y-2">
      {lastSchedule ? (
        <div className="text-xs text-slate-600 flex items-start gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <span>
            報名梯次：{lastSchedule.date} {lastSchedule.startTime}–{lastSchedule.endTime}
            <br />
            <span className="text-slate-400">{lastSchedule.location}</span>
          </span>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <Badge className="text-[10px] bg-amber-100 text-amber-800 border-amber-200 border">
          完訓後將解鎖：{material.unlocksSkill}
        </Badge>
        <span className="text-[11px] text-slate-400">已報名</span>
      </div>
    </div>
  )
}

function PhysicalActions() {
  return (
    <div className="mt-3 flex items-center gap-2">
      <Badge className="text-[10px] bg-blue-100 text-blue-800 border-blue-200 border">
        <Truck className="w-3 h-3 mr-1" />
        配送中
      </Badge>
      <span className="text-[11px] text-slate-400">預計 3–5 工作天</span>
    </div>
  )
}

// ===== 訂單列表 =====
function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const itemsCount = order.items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-slate-800">{order.id}</span>
            <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 border">
              已付款（示範）
            </Badge>
            {order.discount.rate < 1 && (
              <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-600">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                {PLAN_LABELS[order.discount.plan]} {Math.round(order.discount.rate * 100)} 折
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {order.createdAt.slice(0, 10)} · {itemsCount} 件商品
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-red-600">{formatTWD(order.total)}</div>
          {order.discount.amountSaved > 0 && (
            <div className="text-[11px] text-emerald-600">
              省 {formatTWD(order.discount.amountSaved)}
            </div>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4 bg-slate-50/60">
          {/* 商品明細 */}
          <div className="space-y-3">
            {order.items.map((item, i) => {
              const Icon = TYPE_ICON[item.type]
              return (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className={cn("text-[10px] mr-1 border font-normal", TYPE_TONE[item.type])}>
                      {MATERIAL_TYPE_LABELS[item.type]}
                    </Badge>
                    <span className="text-sm text-slate-800">{item.name}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {formatTWD(item.unitPriceFinal)} × {item.qty}
                      {item.scheduleSnapshot && (
                        <> · 梯次 {item.scheduleSnapshot.date}</>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    {formatTWD(item.subtotal)}
                  </div>
                </div>
              )
            })}
          </div>

          <Separator />

          {/* 結帳資訊 + 金額 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <KV k="付款方式" v={PAYMENT_METHOD_LABELS[order.paymentMethod]} />
              <KV k="通知 Email" v={order.contactEmail} />
              {order.shipping.required && (
                <>
                  <KV k="收件人" v={order.shipping.recipient ?? "—"} />
                  <KV k="收件電話" v={order.shipping.phone ?? "—"} />
                  <KV k="寄送地址" v={order.shipping.address ?? "—"} />
                </>
              )}
              {order.note && <KV k="備註" v={order.note} />}
            </div>
            <div className="space-y-1.5 md:text-right">
              <KV k="商品小計" v={formatTWD(order.subtotal)} align="right" />
              {order.shipping.required && (
                <KV k="運費" v={formatTWD(order.shipping.fee)} align="right" />
              )}
              {order.discount.amountSaved > 0 && (
                <KV
                  k="方案折扣"
                  v={`− ${formatTWD(order.discount.amountSaved)}`}
                  align="right"
                  tone="emerald"
                />
              )}
              <div className="pt-1.5 mt-1.5 border-t border-slate-200 flex justify-between md:justify-end md:gap-3">
                <span className="text-slate-700 font-medium">總金額</span>
                <span className="font-bold text-red-600">{formatTWD(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KV({
  k,
  v,
  align,
  tone,
}: {
  k: string
  v: string
  align?: "right"
  tone?: "emerald"
}) {
  return (
    <div
      className={cn(
        "flex gap-3",
        align === "right" ? "justify-between md:justify-end" : "justify-between",
      )}
    >
      <span className="text-slate-500">{k}</span>
      <span
        className={cn(
          "text-slate-700",
          tone === "emerald" && "text-emerald-600",
        )}
      >
        {v}
      </span>
    </div>
  )
}

// ===== 空狀態 =====
function EmptyState({
  icon,
  title,
  hint,
  cta,
}: {
  icon: React.ReactNode
  title: string
  hint?: string
  cta?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-base font-medium text-slate-700">{title}</h3>
      {hint && <p className="text-sm text-slate-500 mt-1">{hint}</p>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  )
}
