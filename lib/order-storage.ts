// 教材中心：購物車與訂單（純前端 localStorage demo，無真後端／真金流）
"use client"

import type { Material, MaterialType } from "./material-data"
import { getMaterialById } from "./material-data"
import {
  PLAN_DISCOUNTS,
  type SubscriptionPlan,
  type Teacher,
} from "./mock-data"
import { effectiveSubscriptionStatus } from "./teacher-storage"

const CART_KEY_PREFIX = "mr-cart-v1:"      // 每位老師獨立購物車
const ORDER_KEY = "mr-orders-v1"

// ===== 購物車 =====

export interface CartItem {
  materialId: string
  qty: number
  scheduleId?: string        // 培訓商品需指定梯次
  addedAt: string
}

export function getCart(teacherId: string): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CART_KEY_PREFIX + teacherId)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(teacherId: string, items: CartItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CART_KEY_PREFIX + teacherId, JSON.stringify(items))
}

export function addToCart(
  teacherId: string,
  materialId: string,
  opts: { qty?: number; scheduleId?: string } = {},
): CartItem[] {
  const qty = Math.max(1, opts.qty ?? 1)
  const cart = getCart(teacherId)
  // 同一商品 + 同一梯次合併數量；不同梯次視為不同 line
  const existing = cart.find(
    (c) => c.materialId === materialId && c.scheduleId === opts.scheduleId,
  )
  if (existing) {
    existing.qty += qty
  } else {
    cart.push({
      materialId,
      qty,
      scheduleId: opts.scheduleId,
      addedAt: new Date().toISOString(),
    })
  }
  saveCart(teacherId, cart)
  return cart
}

export function updateCartItem(
  teacherId: string,
  index: number,
  patch: Partial<Pick<CartItem, "qty" | "scheduleId">>,
): CartItem[] {
  const cart = getCart(teacherId)
  if (index < 0 || index >= cart.length) return cart
  if (typeof patch.qty === "number") cart[index].qty = Math.max(1, patch.qty)
  if (typeof patch.scheduleId !== "undefined") cart[index].scheduleId = patch.scheduleId
  saveCart(teacherId, cart)
  return cart
}

export function removeFromCart(teacherId: string, index: number): CartItem[] {
  const cart = getCart(teacherId)
  if (index < 0 || index >= cart.length) return cart
  cart.splice(index, 1)
  saveCart(teacherId, cart)
  return cart
}

export function clearCart(teacherId: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(CART_KEY_PREFIX + teacherId)
}

// ===== 折扣與金額計算 =====

// 過期 / paused 的訂閱統一以 trial 計價
export function effectivePlanForPricing(teacher: Teacher | null | undefined): SubscriptionPlan {
  if (!teacher?.subscription) return "trial"
  const status = effectiveSubscriptionStatus(teacher.subscription)
  if (status !== "active") return "trial"
  return teacher.subscription.plan
}

export function discountRateFor(teacher: Teacher | null | undefined): number {
  return PLAN_DISCOUNTS[effectivePlanForPricing(teacher)]
}

// 將原價套上方案折扣後四捨五入到整數
export function applyDiscount(price: number, teacher: Teacher | null | undefined): number {
  const rate = discountRateFor(teacher)
  return Math.round(price * rate)
}

// ===== 訂單 =====

export type OrderItemSnapshot = {
  materialId: string
  type: MaterialType
  name: string
  cover: string
  qty: number
  unitPriceOriginal: number
  unitPriceFinal: number     // 折後單價
  subtotal: number           // unitPriceFinal * qty
  scheduleSnapshot?: {
    id: string
    date: string
    startTime: string
    endTime: string
    location: string
  }
  unlocksSkill?: string      // 培訓商品才有
  fileType?: string          // 數位商品才有
}

export type OrderShipping = {
  required: boolean
  fee: number
  recipient?: string
  phone?: string
  address?: string
}

export type OrderStatus =
  | "paid_mock"              // 結帳完成（mock）
  | "shipped_mock"           // 已出貨（demo 用，不會自動切換）

export interface Order {
  id: string                 // ORD-YYYYMMDD-XXXX
  teacherId: string
  teacherName: string
  createdAt: string
  items: OrderItemSnapshot[]
  shipping: OrderShipping
  discount: {
    plan: SubscriptionPlan
    rate: number             // 0.80, 0.90...
    amountSaved: number      // 折讓總額
  }
  subtotal: number           // 折後商品小計
  total: number              // subtotal + shipping.fee
  paymentMethod: PaymentMethod
  contactEmail: string
  note?: string
  status: OrderStatus
}

export type PaymentMethod = "credit_card_mock" | "atm_transfer_mock"

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card_mock: "信用卡（示範環境）",
  atm_transfer_mock: "ATM 轉帳（示範環境）",
}

export function getAllOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(ORDER_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function getOrdersByTeacher(teacherId: string): Order[] {
  return getAllOrders()
    .filter((o) => o.teacherId === teacherId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getOrderById(id: string): Order | undefined {
  return getAllOrders().find((o) => o.id === id)
}

function generateOrderId(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ORD-${y}${m}${d}-${rand}`
}

// 從購物車狀態 + 老師資料計算金額（給結帳前預覽用）
export interface CartSummary {
  lines: {
    cartItem: CartItem
    material: Material
    unitPriceOriginal: number
    unitPriceFinal: number
    subtotal: number
    scheduleSnapshot?: OrderItemSnapshot["scheduleSnapshot"]
  }[]
  itemsSubtotalOriginal: number
  itemsSubtotalFinal: number
  amountSaved: number
  shipping: { required: boolean; fee: number }
  hasPhysical: boolean
  hasDigital: boolean
  hasTraining: boolean
  total: number
  discount: { plan: SubscriptionPlan; rate: number }
}

export function summarizeCart(
  cart: CartItem[],
  teacher: Teacher | null | undefined,
): CartSummary {
  const plan = effectivePlanForPricing(teacher)
  const rate = PLAN_DISCOUNTS[plan]

  let itemsSubtotalOriginal = 0
  let itemsSubtotalFinal = 0
  let shippingFee = 0
  let hasPhysical = false
  let hasDigital = false
  let hasTraining = false

  const lines: CartSummary["lines"] = []

  for (const ci of cart) {
    const material = getMaterialById(ci.materialId)
    if (!material) continue

    const unitFinal = Math.round(material.price * rate)
    const subtotal = unitFinal * ci.qty
    itemsSubtotalOriginal += material.price * ci.qty
    itemsSubtotalFinal += subtotal

    if (material.type === "physical") {
      hasPhysical = true
      // 運費以「同一商品單次運費」累加；現實會更複雜，demo 從簡
      shippingFee += material.shippingFee
    } else if (material.type === "digital") {
      hasDigital = true
    } else if (material.type === "training") {
      hasTraining = true
    }

    let scheduleSnapshot: OrderItemSnapshot["scheduleSnapshot"] | undefined
    if (material.type === "training" && ci.scheduleId) {
      const sch = material.schedules.find((s) => s.id === ci.scheduleId)
      if (sch) {
        scheduleSnapshot = {
          id: sch.id,
          date: sch.date,
          startTime: sch.startTime,
          endTime: sch.endTime,
          location: sch.location,
        }
      }
    }

    lines.push({
      cartItem: ci,
      material,
      unitPriceOriginal: material.price,
      unitPriceFinal: unitFinal,
      subtotal,
      scheduleSnapshot,
    })
  }

  return {
    lines,
    itemsSubtotalOriginal,
    itemsSubtotalFinal,
    amountSaved: itemsSubtotalOriginal - itemsSubtotalFinal,
    shipping: { required: hasPhysical, fee: shippingFee },
    hasPhysical,
    hasDigital,
    hasTraining,
    total: itemsSubtotalFinal + shippingFee,
    discount: { plan, rate },
  }
}

// ===== 建立訂單 =====

export interface CreateOrderInput {
  teacher: Teacher
  cart: CartItem[]
  shipping: {
    recipient?: string
    phone?: string
    address?: string
  }
  contactEmail: string
  paymentMethod: PaymentMethod
  note?: string
}

export function createOrder(input: CreateOrderInput): Order {
  const summary = summarizeCart(input.cart, input.teacher)

  const items: OrderItemSnapshot[] = summary.lines.map((line) => ({
    materialId: line.material.id,
    type: line.material.type,
    name: line.material.name,
    cover: line.material.cover,
    qty: line.cartItem.qty,
    unitPriceOriginal: line.unitPriceOriginal,
    unitPriceFinal: line.unitPriceFinal,
    subtotal: line.subtotal,
    scheduleSnapshot: line.scheduleSnapshot,
    unlocksSkill:
      line.material.type === "training" ? line.material.unlocksSkill : undefined,
    fileType:
      line.material.type === "digital" ? line.material.fileType : undefined,
  }))

  const order: Order = {
    id: generateOrderId(),
    teacherId: input.teacher.id,
    teacherName: input.teacher.name,
    createdAt: new Date().toISOString(),
    items,
    shipping: {
      required: summary.shipping.required,
      fee: summary.shipping.fee,
      recipient: input.shipping.recipient,
      phone: input.shipping.phone,
      address: input.shipping.address,
    },
    discount: {
      plan: summary.discount.plan,
      rate: summary.discount.rate,
      amountSaved: summary.amountSaved,
    },
    subtotal: summary.itemsSubtotalFinal,
    total: summary.total,
    paymentMethod: input.paymentMethod,
    contactEmail: input.contactEmail,
    note: input.note,
    status: "paid_mock",
  }

  const all = getAllOrders()
  all.push(order)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(all))
  }

  clearCart(input.teacher.id)
  return order
}

// 從老師訂單攤平成「我的教材」清單（去重以 materialId 為單位，數量加總）
export interface OwnedMaterial {
  material: Material
  totalQty: number
  firstPurchasedAt: string
  latestOrderId: string
  schedules: { orderId: string; scheduleSnapshot?: OrderItemSnapshot["scheduleSnapshot"] }[]
}

export function getOwnedMaterials(teacherId: string): OwnedMaterial[] {
  const orders = getOrdersByTeacher(teacherId)
  const map = new Map<string, OwnedMaterial>()
  for (const o of orders) {
    for (const item of o.items) {
      const mat = getMaterialById(item.materialId)
      if (!mat) continue
      const existing = map.get(item.materialId)
      if (existing) {
        existing.totalQty += item.qty
        if (o.createdAt < existing.firstPurchasedAt) {
          existing.firstPurchasedAt = o.createdAt
        }
        if (o.createdAt > existing.latestOrderId) {
          existing.latestOrderId = o.id
        }
        existing.schedules.push({ orderId: o.id, scheduleSnapshot: item.scheduleSnapshot })
      } else {
        map.set(item.materialId, {
          material: mat,
          totalQty: item.qty,
          firstPurchasedAt: o.createdAt,
          latestOrderId: o.id,
          schedules: [{ orderId: o.id, scheduleSnapshot: item.scheduleSnapshot }],
        })
      }
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    b.firstPurchasedAt.localeCompare(a.firstPurchasedAt),
  )
}

// 格式化 TWD
export function formatTWD(n: number): string {
  return `NT$ ${n.toLocaleString("zh-TW")}`
}
