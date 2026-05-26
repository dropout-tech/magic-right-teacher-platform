"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Minus,
  Package,
  Plus,
  Presentation,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Video,
} from "lucide-react"
import {
  PLAN_DISCOUNTS,
  PLAN_LABELS,
  type Teacher,
} from "@/lib/mock-data"
import {
  getAllRelatedTalents,
  MATERIAL_TYPE_LABELS,
  STOCK_STATUS_LABELS,
  materials,
  type DigitalMaterial,
  type Material,
  type MaterialType,
  type PhysicalMaterial,
  type TrainingMaterial,
} from "@/lib/material-data"
import {
  addToCart,
  applyDiscount,
  clearCart,
  createOrder,
  discountRateFor,
  effectivePlanForPricing,
  formatTWD,
  getCart,
  PAYMENT_METHOD_LABELS,
  removeFromCart,
  summarizeCart,
  updateCartItem,
  type CartItem,
  type CartSummary,
  type Order,
  type PaymentMethod,
} from "@/lib/order-storage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type View =
  | { kind: "list" }
  | { kind: "detail"; materialId: string }
  | { kind: "checkout" }
  | { kind: "success"; orderId: string }

interface MaterialCenterProps {
  teacher: Teacher
  onGoToMyOrders?: () => void
}

const TYPE_FILTERS: { id: "all" | MaterialType; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "physical", label: MATERIAL_TYPE_LABELS.physical },
  { id: "digital", label: MATERIAL_TYPE_LABELS.digital },
  { id: "training", label: MATERIAL_TYPE_LABELS.training },
]

export function MaterialCenter({ teacher, onGoToMyOrders }: MaterialCenterProps) {
  const [view, setView] = useState<View>({ kind: "list" })
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [addedDialog, setAddedDialog] = useState<{ open: boolean; name?: string }>({ open: false })

  // 初次載入 / view 切換時同步購物車
  useEffect(() => {
    setCart(getCart(teacher.id))
  }, [teacher.id])

  const refreshCart = () => setCart(getCart(teacher.id))

  const summary = useMemo(() => summarizeCart(cart, teacher), [cart, teacher])

  const handleAddToCart = (
    materialId: string,
    opts: { qty?: number; scheduleId?: string } = {},
  ) => {
    const next = addToCart(teacher.id, materialId, opts)
    setCart(next)
    const m = materials.find((x) => x.id === materialId)
    setAddedDialog({ open: true, name: m?.name })
  }

  const handleCheckoutClick = () => {
    setCartOpen(false)
    setView({ kind: "checkout" })
  }

  const handleOrderCreated = (order: Order) => {
    setCart([])
    setView({ kind: "success", orderId: order.id })
  }

  return (
    <div className="relative">
      {/* 頂部固定列：標題 + 購物車 */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          {view.kind === "list" && (
            <>
              <h1 className="text-2xl font-bold text-slate-800">教材中心</h1>
              <p className="text-sm text-slate-500 mt-1">
                為萊特老師精選的道具、教案與師資培訓
              </p>
            </>
          )}
          {view.kind === "detail" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ kind: "list" })}
              className="text-slate-600 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              回教材列表
            </Button>
          )}
          {view.kind === "checkout" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ kind: "list" })}
              className="text-slate-600 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              繼續選購
            </Button>
          )}
        </div>

        {view.kind !== "success" && (
          <CartButton
            count={cart.reduce((sum, c) => sum + c.qty, 0)}
            onClick={() => setCartOpen(true)}
          />
        )}
      </div>

      {/* 主內容 */}
      {view.kind === "list" && (
        <ListView
          teacher={teacher}
          onOpen={(id) => setView({ kind: "detail", materialId: id })}
        />
      )}
      {view.kind === "detail" && (
        <DetailView
          teacher={teacher}
          materialId={view.materialId}
          onAddToCart={handleAddToCart}
          onBack={() => setView({ kind: "list" })}
        />
      )}
      {view.kind === "checkout" && (
        <CheckoutView
          teacher={teacher}
          summary={summary}
          onSubmitted={handleOrderCreated}
          onBackToShop={() => setView({ kind: "list" })}
        />
      )}
      {view.kind === "success" && (
        <SuccessView
          orderId={view.orderId}
          onBackToShop={() => setView({ kind: "list" })}
          onGoToMyOrders={onGoToMyOrders}
        />
      )}

      {/* 購物車抽屜 */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        teacher={teacher}
        cart={cart}
        summary={summary}
        onCartChange={refreshCart}
        onCheckout={handleCheckoutClick}
      />

      {/* 加入購物車成功 */}
      <Dialog open={addedDialog.open} onOpenChange={(o) => setAddedDialog({ open: o })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <DialogTitle className="text-center">已加入購物車</DialogTitle>
            <DialogDescription className="text-center">
              {addedDialog.name}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setAddedDialog({ open: false })}
            >
              繼續選購
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => {
                setAddedDialog({ open: false })
                setCartOpen(true)
              }}
            >
              查看購物車
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// =====================================================================
// 浮動／頂部購物車按鈕
// =====================================================================
function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="relative border-slate-300 hover:border-red-400 hover:text-red-600"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      購物車
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  )
}

// =====================================================================
// 商品列表
// =====================================================================
function ListView({
  teacher,
  onOpen,
}: {
  teacher: Teacher
  onOpen: (id: string) => void
}) {
  const [typeFilter, setTypeFilter] = useState<"all" | MaterialType>("all")
  const [talent, setTalent] = useState<string | null>(null)
  const [keyword, setKeyword] = useState("")

  const talents = useMemo(() => getAllRelatedTalents(), [])
  const plan = effectivePlanForPricing(teacher)
  const rate = PLAN_DISCOUNTS[plan]

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (typeFilter !== "all" && m.type !== typeFilter) return false
      if (talent && m.relatedTalent !== talent) return false
      if (keyword) {
        const k = keyword.toLowerCase()
        if (
          !m.name.toLowerCase().includes(k) &&
          !m.shortDesc.toLowerCase().includes(k) &&
          !(m.relatedTalent ?? "").toLowerCase().includes(k)
        ) {
          return false
        }
      }
      return true
    })
  }, [typeFilter, talent, keyword])

  return (
    <div>
      {/* 方案折扣提示 */}
      {rate < 1 && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <div className="text-sm text-slate-700">
            <span className="font-medium text-orange-700">{PLAN_LABELS[plan]}方案</span>{" "}
            購買教材享 <span className="font-bold text-orange-700">{Math.round(rate * 100)} 折</span>
            優惠，下方價格已自動套用。
          </div>
        </div>
      )}
      {rate >= 1 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          升級訂閱方案最高享 <span className="font-bold text-orange-600">8 折</span> 教材優惠。目前
          <span className="font-medium ml-1">{PLAN_LABELS[plan]}</span> 方案購買教材為原價。
        </div>
      )}

      {/* 篩選列 */}
      <div className="space-y-3 mb-6">
        {/* 類型 tab */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={typeFilter === t.id ? "default" : "outline"}
              onClick={() => setTypeFilter(t.id)}
              className={cn(
                "rounded-full",
                typeFilter === t.id
                  ? "bg-red-600 hover:bg-red-700"
                  : "border-slate-300",
              )}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* 搜尋 + 才藝 */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜尋商品名稱、才藝..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant={talent === null ? "secondary" : "ghost"}
              onClick={() => setTalent(null)}
              className="h-8 rounded-full text-xs"
            >
              所有才藝
            </Button>
            {talents.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={talent === t ? "secondary" : "ghost"}
                onClick={() => setTalent(t)}
                className="h-8 rounded-full text-xs"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 商品卡片 grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-500">
          沒有符合條件的教材
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              teacher={teacher}
              onClick={() => onOpen(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// =====================================================================
// 商品卡片
// =====================================================================
function MaterialCard({
  material,
  teacher,
  onClick,
}: {
  material: Material
  teacher: Teacher
  onClick: () => void
}) {
  const final = applyDiscount(material.price, teacher)
  const rate = discountRateFor(teacher)
  const hasDiscount = rate < 1
  const typeStyle = TYPE_BADGE[material.type]

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200">
        <CoverPlaceholder material={material} />
        <Badge
          className={cn(
            "absolute top-3 left-3 text-xs font-medium border shadow-sm",
            typeStyle.badge,
          )}
        >
          {MATERIAL_TYPE_LABELS[material.type]}
        </Badge>
        {material.recommended && (
          <Badge className="absolute top-3 right-3 text-xs bg-red-600 text-white border-0 shadow">
            推薦
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          {material.relatedTalent && (
            <Badge variant="outline" className="text-[11px] border-slate-300 font-normal">
              {material.relatedTalent}
            </Badge>
          )}
          {material.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[11px]">#{t}</span>
          ))}
        </div>

        <h3 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 min-h-[3rem]">
          {material.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[2.5rem]">
          {material.shortDesc}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {hasDiscount && (
              <div className="text-xs text-slate-400 line-through">
                {formatTWD(material.price)}
              </div>
            )}
            <div className="text-lg font-bold text-red-600">
              {formatTWD(final)}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </button>
  )
}

const TYPE_BADGE: Record<MaterialType, { badge: string; icon: typeof Package }> = {
  physical: { badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
  digital: { badge: "bg-violet-50 text-violet-700 border-violet-200", icon: FileText },
  training: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: GraduationCap },
}

function CoverPlaceholder({ material }: { material: Material }) {
  const { icon: Icon } = TYPE_BADGE[material.type]
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
    </div>
  )
}

// =====================================================================
// 商品詳情
// =====================================================================
function DetailView({
  teacher,
  materialId,
  onAddToCart,
  onBack,
}: {
  teacher: Teacher
  materialId: string
  onAddToCart: (id: string, opts?: { qty?: number; scheduleId?: string }) => void
  onBack: () => void
}) {
  const material = materials.find((m) => m.id === materialId)
  const [qty, setQty] = useState(1)
  const [scheduleId, setScheduleId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (material?.type === "training" && material.schedules.length > 0) {
      const firstAvailable =
        material.schedules.find((s) => s.seats > 0) ?? material.schedules[0]
      setScheduleId(firstAvailable.id)
    } else {
      setScheduleId(undefined)
    }
    setQty(1)
  }, [materialId, material])

  if (!material) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
        找不到這個商品
        <div className="mt-4">
          <Button onClick={onBack}>回教材列表</Button>
        </div>
      </div>
    )
  }

  const final = applyDiscount(material.price, teacher)
  const rate = discountRateFor(teacher)
  const plan = effectivePlanForPricing(teacher)
  const hasDiscount = rate < 1
  const typeStyle = TYPE_BADGE[material.type]
  const outOfStock = material.stockStatus === "out_of_stock"
  const trainingSeatsLeft =
    material.type === "training" && scheduleId
      ? material.schedules.find((s) => s.id === scheduleId)?.seats ?? 0
      : null

  const disabled =
    outOfStock ||
    (material.type === "training" && (trainingSeatsLeft === null || trainingSeatsLeft <= 0))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* 左：封面 + 描述 */}
      <div className="lg:col-span-3 space-y-5">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
          <CoverPlaceholder material={material} />
          <Badge
            className={cn(
              "absolute top-4 left-4 text-xs font-medium border shadow",
              typeStyle.badge,
            )}
          >
            {MATERIAL_TYPE_LABELS[material.type]}
          </Badge>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold text-slate-800">商品介紹</h2>
          <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {material.description}
          </p>

          {material.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">特色</h3>
              <ul className="space-y-1.5">
                {material.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 各類型專屬區塊 */}
          {material.type === "physical" && (
            <PhysicalDetail material={material} />
          )}
          {material.type === "digital" && (
            <DigitalDetail material={material} />
          )}
          {material.type === "training" && (
            <TrainingDetail material={material} />
          )}
        </div>
      </div>

      {/* 右：購買區 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-2">
            {material.relatedTalent && (
              <Badge variant="outline" className="text-xs border-slate-300 font-normal">
                {material.relatedTalent}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs border-slate-300 font-normal">
              {STOCK_STATUS_LABELS[material.stockStatus]}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-slate-800 leading-snug">
            {material.name}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{material.shortDesc}</p>

          <Separator className="my-4" />

          <div className="space-y-2">
            {hasDiscount ? (
              <>
                <div className="text-sm text-slate-400 line-through">
                  原價 {formatTWD(material.price)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    {formatTWD(final)}
                  </span>
                  <span className="text-xs text-orange-600 font-medium">
                    {PLAN_LABELS[plan]}方案 {Math.round(rate * 100)} 折
                  </span>
                </div>
                <div className="text-xs text-emerald-600">
                  省下 {formatTWD(material.price - final)}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {formatTWD(final)}
              </div>
            )}
          </div>

          {/* 培訓：選梯次 */}
          {material.type === "training" && (
            <div className="mt-5 space-y-2">
              <Label className="text-sm text-slate-700">選擇梯次</Label>
              <RadioGroup
                value={scheduleId}
                onValueChange={(v) => setScheduleId(v)}
                className="gap-2"
              >
                {material.schedules.map((sch) => {
                  const full = sch.seats <= 0
                  return (
                    <label
                      key={sch.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        scheduleId === sch.id
                          ? "border-red-300 bg-red-50/40"
                          : "border-slate-200 hover:border-slate-300",
                        full && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <RadioGroupItem value={sch.id} disabled={full} className="mt-0.5" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium text-slate-800">
                          {sch.date} {sch.startTime}–{sch.endTime}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">{sch.location}</div>
                        <div className="text-xs mt-1">
                          {full ? (
                            <span className="text-slate-400">已額滿</span>
                          ) : (
                            <span className="text-emerald-600">
                              剩餘 {sch.seats}/{sch.seatsTotal} 名
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  )
                })}
              </RadioGroup>
            </div>
          )}

          {/* 數量（培訓固定 1） */}
          {material.type !== "training" && (
            <div className="mt-5">
              <Label className="text-sm text-slate-700">數量</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="h-9 w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-9 w-9"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            disabled={disabled}
            onClick={() =>
              onAddToCart(material.id, {
                qty: material.type === "training" ? 1 : qty,
                scheduleId: material.type === "training" ? scheduleId : undefined,
              })
            }
            className="w-full mt-6 h-11 bg-red-600 hover:bg-red-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {outOfStock ? "暫時缺貨" : "加入購物車"}
          </Button>

          {material.type === "training" && (
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              ※ 完訓後將解鎖才藝：
              <span className="text-slate-600 font-medium">{material.unlocksSkill}</span>
              （此為示範環境，購買不會自動修改老師資料）
            </p>
          )}
          {material.type === "digital" && (
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              ※ 數位教材於結帳完成後可於「我的訂單 → 我的教材」下載
            </p>
          )}
          {material.type === "physical" && (
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              ※ 結帳時需填寫收件地址；運費 {formatTWD(material.shippingFee)}
              {material.shippingFee === 0 && "（免運）"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function PhysicalDetail({ material }: { material: PhysicalMaterial }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700">內容物</h3>
      <ul className="space-y-1 text-sm text-slate-600">
        {material.spec.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {s}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
        {material.weight && (
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            {material.weight}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" />
          {material.shippingFee === 0 ? "免運" : `運費 ${formatTWD(material.shippingFee)}`}
        </span>
      </div>
    </div>
  )
}

function DigitalDetail({ material }: { material: DigitalMaterial }) {
  const fileIcon = {
    pdf: FileText,
    video: Video,
    ppt: Presentation,
    bundle: Package,
  }[material.fileType]
  const FileIcon = fileIcon
  const label = {
    pdf: "PDF 文件",
    video: "教學影片",
    ppt: "簡報檔",
    bundle: "綜合教材包",
  }[material.fileType]

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-2">檔案資訊</h3>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
        <FileIcon className="w-6 h-6 text-violet-600" />
        <div className="text-sm">
          <div className="font-medium text-slate-800">{label}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {material.fileSize && `檔案大小 ${material.fileSize}`}
            {material.pages && ` · ${material.pages} 頁`}
            {material.videoLength && ` · ${material.videoLength}`}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrainingDetail({ material }: { material: TrainingMaterial }) {
  const formatLabel = {
    online: "線上",
    onsite: "實體",
    hybrid: "線上 + 實體",
  }[material.format]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700">培訓資訊</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">總時數</div>
          <div className="font-medium text-slate-800 mt-1">{material.durationHours} 小時</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">課程形式</div>
          <div className="font-medium text-slate-800 mt-1">{formatLabel}</div>
        </div>
        {material.instructor && (
          <div className="p-3 rounded-lg bg-slate-50 col-span-2">
            <div className="text-xs text-slate-500">講師</div>
            <div className="font-medium text-slate-800 mt-1">{material.instructor}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================================
// 購物車抽屜
// =====================================================================
function CartSheet({
  open,
  onOpenChange,
  teacher,
  cart,
  summary,
  onCartChange,
  onCheckout,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: Teacher
  cart: CartItem[]
  summary: CartSummary
  onCartChange: () => void
  onCheckout: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-3">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            購物車
            <span className="text-sm font-normal text-slate-500">
              （{cart.reduce((s, c) => s + c.qty, 0)} 件）
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm">購物車是空的</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {summary.lines.map((line, idx) => (
                <div
                  key={`${line.cartItem.materialId}-${line.cartItem.scheduleId ?? ""}`}
                  className="flex gap-3 pb-4 border-b border-slate-100 last:border-0"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <TypeIcon type={line.material.type} className="w-7 h-7 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="text-[10px] mb-1 border-slate-300 font-normal">
                          {MATERIAL_TYPE_LABELS[line.material.type]}
                        </Badge>
                        <div className="text-sm font-medium text-slate-800 line-clamp-2">
                          {line.material.name}
                        </div>
                        {line.scheduleSnapshot && (
                          <div className="text-[11px] text-slate-500 mt-1">
                            梯次：{line.scheduleSnapshot.date}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(teacher.id, idx)
                          onCartChange()
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {line.material.type === "training" ? (
                        <span className="text-xs text-slate-500">1 名</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              updateCartItem(teacher.id, idx, {
                                qty: Math.max(1, line.cartItem.qty - 1),
                              })
                              onCartChange()
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{line.cartItem.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              updateCartItem(teacher.id, idx, {
                                qty: line.cartItem.qty + 1,
                              })
                              onCartChange()
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <div className="text-sm font-bold text-red-600">
                        {formatTWD(line.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 space-y-3 bg-slate-50">
            <div className="flex justify-between text-sm text-slate-600">
              <span>商品小計（已套用折扣）</span>
              <span>{formatTWD(summary.itemsSubtotalFinal)}</span>
            </div>
            {summary.shipping.required && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>運費</span>
                <span>{formatTWD(summary.shipping.fee)}</span>
              </div>
            )}
            {summary.amountSaved > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>方案折扣總計</span>
                <span>− {formatTWD(summary.amountSaved)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-slate-700">應付總額</span>
              <span className="text-xl font-bold text-red-600">
                {formatTWD(summary.total)}
              </span>
            </div>
            <Button
              className="w-full h-11 bg-red-600 hover:bg-red-700"
              onClick={onCheckout}
            >
              前往結帳
            </Button>
            <button
              onClick={() => {
                clearCart(teacher.id)
                onCartChange()
              }}
              className="w-full text-xs text-slate-400 hover:text-slate-600"
            >
              清空購物車
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function TypeIcon({ type, className }: { type: MaterialType; className?: string }) {
  const Icon = TYPE_BADGE[type].icon
  return <Icon className={className} />
}

// =====================================================================
// 結帳
// =====================================================================
function CheckoutView({
  teacher,
  summary,
  onSubmitted,
  onBackToShop,
}: {
  teacher: Teacher
  summary: CartSummary
  onSubmitted: (order: Order) => void
  onBackToShop: () => void
}) {
  const [recipient, setRecipient] = useState(teacher.realName ?? teacher.name)
  const [phone, setPhone] = useState(teacher.contact.phone ?? "")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState(teacher.contact.email ?? "")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card_mock")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (summary.lines.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
        購物車是空的，請先選擇商品
        <div className="mt-4">
          <Button onClick={onBackToShop}>回教材列表</Button>
        </div>
      </div>
    )
  }

  const canSubmit =
    email.trim().length > 0 &&
    (!summary.shipping.required ||
      (recipient.trim() && phone.trim() && address.trim()))

  const handleSubmit = () => {
    setError("")
    if (!canSubmit) {
      setError("請完整填寫必填欄位")
      return
    }
    setSubmitting(true)
    // 模擬付款延遲
    setTimeout(() => {
      const order = createOrder({
        teacher,
        cart: getCart(teacher.id),
        shipping: summary.shipping.required
          ? { recipient, phone, address }
          : {},
        contactEmail: email,
        paymentMethod,
        note: note || undefined,
      })
      onSubmitted(order)
      setSubmitting(false)
    }, 600)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左：表單 */}
      <div className="lg:col-span-2 space-y-5">
        {/* 訂單明細 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 font-bold text-slate-800">
            訂單明細
          </div>
          <div className="divide-y divide-slate-100">
            {summary.lines.map((line) => (
              <div
                key={`${line.cartItem.materialId}-${line.cartItem.scheduleId ?? ""}`}
                className="flex gap-3 px-5 py-3"
              >
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <TypeIcon type={line.material.type} className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="text-[10px] mb-1 border-slate-300 font-normal">
                    {MATERIAL_TYPE_LABELS[line.material.type]}
                  </Badge>
                  <div className="text-sm font-medium text-slate-800">
                    {line.material.name}
                  </div>
                  {line.scheduleSnapshot && (
                    <div className="text-xs text-slate-500 mt-1">
                      梯次：{line.scheduleSnapshot.date} {line.scheduleSnapshot.startTime}–
                      {line.scheduleSnapshot.endTime} @ {line.scheduleSnapshot.location}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">
                    {formatTWD(line.unitPriceFinal)} × {line.cartItem.qty}
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-800 whitespace-nowrap">
                  {formatTWD(line.subtotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 收件資訊 */}
        {summary.shipping.required && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-slate-800">收件資訊</h3>
              <span className="text-xs text-slate-500">（含實體商品需填寫）</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="recipient">收件人 *</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">聯絡電話 *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912-345-678"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">寄送地址 *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="例：新北市三峽區國際一街 96 號 16 樓"
              />
            </div>
          </div>
        )}

        {/* 聯絡 email */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-slate-800">通知 Email</h3>
          <p className="text-xs text-slate-500">
            訂單確認、數位教材下載連結、培訓提醒會寄到這個信箱
          </p>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
          />
        </div>

        {/* 培訓專屬說明 */}
        {summary.hasTraining && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <div className="font-medium mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              培訓報到提醒
            </div>
            <p className="text-xs leading-relaxed">
              訂單成立後，培訓單位會於開課前 7 天寄送行前通知到上述 Email。如需更換梯次請聯絡客服。
            </p>
          </div>
        )}

        {/* 付款方式 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-slate-800">付款方式</h3>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
              <label
                key={m}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  paymentMethod === m
                    ? "border-red-300 bg-red-50/40"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <RadioGroupItem value={m} />
                <span className="text-sm text-slate-700">{PAYMENT_METHOD_LABELS[m]}</span>
              </label>
            ))}
          </RadioGroup>
          <p className="text-[11px] text-slate-400">
            ※ 此為示範環境，不會實際扣款；訂單成立後可於「我的訂單」查看。
          </p>
        </div>

        {/* 備註 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-slate-800">訂單備註（選填）</h3>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例：請放到管理室、需要報名收據抬頭..."
            rows={3}
          />
        </div>
      </div>

      {/* 右：金額摘要 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24 space-y-3">
          <h3 className="font-bold text-slate-800">結帳摘要</h3>
          <Separator />
          <div className="flex justify-between text-sm text-slate-600">
            <span>商品原價</span>
            <span>{formatTWD(summary.itemsSubtotalOriginal)}</span>
          </div>
          {summary.amountSaved > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>
                {PLAN_LABELS[summary.discount.plan]}方案折扣（
                {Math.round(summary.discount.rate * 100)} 折）
              </span>
              <span>− {formatTWD(summary.amountSaved)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-slate-600">
            <span>商品小計</span>
            <span>{formatTWD(summary.itemsSubtotalFinal)}</span>
          </div>
          {summary.shipping.required && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>運費</span>
              <span>{formatTWD(summary.shipping.fee)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-slate-700">應付總額</span>
            <span className="text-2xl font-bold text-red-600">
              {formatTWD(summary.total)}
            </span>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button
            className="w-full h-11 bg-red-600 hover:bg-red-700"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "處理中..." : "送出訂單"}
          </Button>
          <p className="text-[11px] text-slate-400 text-center">
            點擊送出訂單代表您已閱讀並同意服務條款
          </p>
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// 結帳成功
// =====================================================================
function SuccessView({
  orderId,
  onBackToShop,
  onGoToMyOrders,
}: {
  orderId: string
  onBackToShop: () => void
  onGoToMyOrders?: () => void
}) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">訂單建立成功</h2>
      <p className="text-sm text-slate-500 mb-6">
        感謝您的訂購，訂單編號：
        <span className="font-mono font-bold text-slate-700 ml-1">{orderId}</span>
      </p>

      <div className="bg-slate-50 rounded-lg p-4 text-left text-xs text-slate-500 mb-6 leading-relaxed">
        <p>• 訂單確認信已寄送至您填寫的 Email（示範環境不會實際寄出）</p>
        <p>• 實體商品將於 3–5 個工作天內出貨</p>
        <p>• 數位教材可於「我的訂單 → 我的教材」立即下載</p>
        <p>• 培訓商品的報到通知會於開課前 7 天寄出</p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onBackToShop}>
          繼續選購
        </Button>
        {onGoToMyOrders && (
          <Button onClick={onGoToMyOrders} className="bg-red-600 hover:bg-red-700">
            查看我的訂單
          </Button>
        )}
      </div>
    </div>
  )
}
