// 教材中心 mock 商品資料
// 三種類型：實體教材 / 數位教材 / 課程培訓

export type MaterialType = "physical" | "digital" | "training"

export type StockStatus = "in_stock" | "low_stock" | "preorder" | "out_of_stock"

interface BaseMaterial {
  id: string
  type: MaterialType
  name: string
  cover: string
  price: number              // 原價（TWD）
  shortDesc: string
  description: string
  relatedTalent?: string     // 對應 talents.name，例：「魔術」
  tags: string[]
  stockStatus: StockStatus
  highlights: string[]
  gallery: string[]
  recommended?: boolean
}

export interface PhysicalMaterial extends BaseMaterial {
  type: "physical"
  shippingFee: number        // 運費，0=免運
  weight?: string
  spec: string[]             // 內容物清單
}

export interface DigitalMaterial extends BaseMaterial {
  type: "digital"
  fileType: "pdf" | "video" | "ppt" | "bundle"
  fileSize?: string
  previewUrl?: string        // 試閱連結（暫不實作）
  pages?: number
  videoLength?: string
}

export interface TrainingSchedule {
  id: string
  date: string               // YYYY-MM-DD
  startTime: string          // HH:mm
  endTime: string
  location: string
  seats: number              // 剩餘名額
  seatsTotal: number
}

export interface TrainingMaterial extends BaseMaterial {
  type: "training"
  durationHours: number
  format: "online" | "onsite" | "hybrid"
  unlocksSkill: string       // 完訓後解鎖的才藝（v1 僅顯示，不真改 teacher.skills）
  schedules: TrainingSchedule[]
  instructor?: string
}

export type Material = PhysicalMaterial | DigitalMaterial | TrainingMaterial

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  physical: "實體教材",
  digital: "數位教材",
  training: "師資培訓",
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "現貨供應",
  low_stock: "少量現貨",
  preorder: "預購中",
  out_of_stock: "暫時缺貨",
}

// ===== Mock 商品清單 =====

const physicalItems: PhysicalMaterial[] = [
  {
    id: "phy-magic-starter",
    type: "physical",
    name: "舞台魔術入門道具組",
    cover: "/images/materials/magic-starter.jpg",
    price: 1200,
    shortDesc: "10 款基礎魔術道具，附中文教學手冊",
    description:
      "專為初學魔術老師設計的入門道具組，內含 10 款最常用於兒童課堂的經典魔術。每款道具皆附完整教學說明，並提供示範影片 QR Code。",
    relatedTalent: "魔術",
    tags: ["熱銷", "新手友善", "中文教學"],
    stockStatus: "in_stock",
    highlights: [
      "10 款經典魔術道具",
      "中英文圖文教學手冊",
      "示範影片 QR Code",
      "可重複使用、耐操好收納",
    ],
    gallery: [],
    shippingFee: 120,
    weight: "1.2 kg",
    spec: [
      "魔術繩 ×3 條",
      "海綿球 ×6 顆",
      "變色手帕 ×2 條",
      "硬幣穿越組 ×1",
      "消失牌組 ×1",
      "中文教學手冊 ×1",
    ],
    recommended: true,
  },
  {
    id: "phy-board-game-strategy",
    type: "physical",
    name: "邏輯桌遊精選 5 件組",
    cover: "/images/materials/board-game-set.jpg",
    price: 2800,
    shortDesc: "新天鵝堡認證選品，適合 6–12 歲課堂使用",
    description:
      "由萊特魔數學院與新天鵝堡桌遊共同挑選，內含 5 款最適合教學現場的策略性桌遊，每款都附帶教學引導手冊。",
    relatedTalent: "桌遊",
    tags: ["合作品牌", "課堂實測"],
    stockStatus: "low_stock",
    highlights: [
      "新天鵝堡精選 5 款",
      "教學引導手冊",
      "適合 8–20 人小班",
    ],
    gallery: [],
    shippingFee: 0,
    weight: "3.5 kg",
    spec: [
      "拉密 Rummikub ×1",
      "璀璨寶石 Splendor ×1",
      "卡卡頌 Carcassonne ×1",
      "石器時代 Stone Age ×1",
      "妙語說書人 Dixit ×1",
    ],
  },
  {
    id: "phy-drone-tello",
    type: "physical",
    name: "DJI Tello 教學無人機（單機版）",
    cover: "/images/materials/drone-tello.jpg",
    price: 4500,
    shortDesc: "DJI 認證教育機型，課堂操作首選",
    description:
      "DJI Tello 是國際公認最適合兒童課堂的入門無人機，可透過手機或編程方式操控，是程式教育與飛行教學的完美結合。",
    relatedTalent: "無人機",
    tags: ["合作品牌", "可程式編程"],
    stockStatus: "in_stock",
    highlights: [
      "支援 Scratch / Python 編程",
      "13 分鐘飛行續航",
      "EZ Shot 智能拍攝模式",
    ],
    gallery: [],
    shippingFee: 0,
    weight: "0.8 kg",
    spec: [
      "Tello 主機 ×1",
      "螺旋槳備品 ×4",
      "充電線 ×1",
      "中文快速指南 ×1",
    ],
  },
  {
    id: "phy-blocks-stem",
    type: "physical",
    name: "STEAM 機構積木套組",
    cover: "/images/materials/blocks-stem.jpg",
    price: 1880,
    shortDesc: "300+ 零件，學習槓桿、齒輪、滑輪原理",
    description:
      "結合科學教育的機構積木，內含齒輪、軸承、橡皮帶等機構零件，搭配 12 組任務卡，引導孩子從動手做中學機械原理。",
    relatedTalent: "積木",
    tags: ["STEAM", "任務式教學"],
    stockStatus: "in_stock",
    highlights: [
      "300+ 零件",
      "12 組任務卡",
      "教師引導手冊",
    ],
    gallery: [],
    shippingFee: 120,
    weight: "2.1 kg",
    spec: [
      "結構零件 ×220",
      "機構零件 ×80（齒輪/軸/滑輪）",
      "任務卡 ×12",
      "收納箱 ×1",
    ],
  },
]

const digitalItems: DigitalMaterial[] = [
  {
    id: "dig-magic-lesson-plan",
    type: "digital",
    name: "魔術初階班 16 週教案包",
    cover: "/images/materials/magic-lesson-pdf.jpg",
    price: 800,
    shortDesc: "16 週完整教案 + 學員講義 + 評量表",
    description:
      "由資深魔術老師撰寫的完整一學期教案，每週包含暖身、教學主軸、練習活動、家長回饋表，可直接搭配實體教材使用。",
    relatedTalent: "魔術",
    tags: ["熱銷", "完整教案"],
    stockStatus: "in_stock",
    highlights: [
      "16 週完整教學進度",
      "學員講義可印發",
      "家長回饋表模板",
    ],
    gallery: [],
    fileType: "pdf",
    fileSize: "32 MB",
    pages: 128,
    recommended: true,
  },
  {
    id: "dig-board-game-guide-video",
    type: "digital",
    name: "桌遊引導技巧影片課",
    cover: "/images/materials/board-game-video.jpg",
    price: 1500,
    shortDesc: "12 集影片，教你從零帶起一堂桌遊課",
    description:
      "由萊特資深桌遊講師親自示範，從場控、規則講解、衝突處理到課程節奏，12 集影片完整收錄。",
    relatedTalent: "桌遊",
    tags: ["影片課程", "新手必看"],
    stockStatus: "in_stock",
    highlights: [
      "12 集 HD 影片",
      "可離線下載觀看",
      "附帶 PDF 重點整理",
    ],
    gallery: [],
    fileType: "video",
    fileSize: "1.8 GB",
    videoLength: "共 4 小時 20 分",
  },
  {
    id: "dig-science-experiment-pack",
    type: "digital",
    name: "動手玩科學・30 個經典實驗",
    cover: "/images/materials/science-pack.jpg",
    price: 1200,
    shortDesc: "30 個課堂實驗教案 + 材料清單 + 安全須知",
    description:
      "精選 30 個經典且容易在課堂執行的科學實驗，每個實驗皆附材料清單、操作步驟、原理說明與延伸提問。",
    relatedTalent: "科學",
    tags: ["教案包", "材料清單"],
    stockStatus: "in_stock",
    highlights: [
      "30 個實驗教案",
      "材料採購清單",
      "安全須知與替代材料建議",
    ],
    gallery: [],
    fileType: "pdf",
    fileSize: "48 MB",
    pages: 186,
  },
  {
    id: "dig-robot-ppt-template",
    type: "digital",
    name: "程式機器人教學簡報模板",
    cover: "/images/materials/robot-ppt.jpg",
    price: 600,
    shortDesc: "10 套精美簡報模板，可自由編輯",
    description:
      "為程式機器人課程量身打造的 10 套簡報模板，內含 200+ 張可直接使用的版面，含圖示、流程圖、互動題型。",
    relatedTalent: "程式機器人",
    tags: ["簡報", "可編輯"],
    stockStatus: "in_stock",
    highlights: [
      "10 套主題簡報",
      "200+ 可編輯版面",
      "支援 PowerPoint / Keynote",
    ],
    gallery: [],
    fileType: "ppt",
    fileSize: "210 MB",
  },
]

const trainingItems: TrainingMaterial[] = [
  {
    id: "tra-magic-cert",
    type: "training",
    name: "萊特魔術師資認證培訓",
    cover: "/images/materials/training-magic.jpg",
    price: 8800,
    shortDesc: "40 小時完訓，取得萊特認證魔術講師資格",
    description:
      "由萊特首席魔術講師親自帶領，從魔術原理、表演技巧、教學設計到課堂管理，40 小時系統化培訓，完訓並通過考核後取得認證。",
    relatedTalent: "魔術",
    tags: ["師資認證", "完訓加技能", "熱門"],
    stockStatus: "in_stock",
    highlights: [
      "40 小時系統培訓",
      "完訓後可開萊特認證課程",
      "終身複訓權益",
    ],
    gallery: [],
    durationHours: 40,
    format: "hybrid",
    unlocksSkill: "魔術",
    instructor: "首席魔術講師・林大師",
    schedules: [
      {
        id: "tra-magic-cert-2026-07",
        date: "2026-07-15",
        startTime: "09:00",
        endTime: "17:00",
        location: "新北市三峽區・萊特總部",
        seats: 8,
        seatsTotal: 12,
      },
      {
        id: "tra-magic-cert-2026-09",
        date: "2026-09-02",
        startTime: "09:00",
        endTime: "17:00",
        location: "新北市三峽區・萊特總部",
        seats: 12,
        seatsTotal: 12,
      },
    ],
    recommended: true,
  },
  {
    id: "tra-drone-cert",
    type: "training",
    name: "DJI 教育無人機教練培訓",
    cover: "/images/materials/training-drone.jpg",
    price: 12000,
    shortDesc: "48 小時混合培訓，取得 DJI 教育教練資格",
    description:
      "由 DJI 大疆教育授權的教練培訓課程，內容涵蓋飛行安全、教學法規、課程設計與實機操作，完訓後可獨立開設無人機課程。",
    relatedTalent: "無人機",
    tags: ["合作品牌", "師資認證"],
    stockStatus: "low_stock",
    highlights: [
      "DJI 教育官方認證",
      "48 小時混合教學（線上 16 + 實體 32）",
      "結訓贈送教學教材包",
    ],
    gallery: [],
    durationHours: 48,
    format: "hybrid",
    unlocksSkill: "無人機",
    instructor: "DJI 認證教練・吳教官",
    schedules: [
      {
        id: "tra-drone-cert-2026-08",
        date: "2026-08-05",
        startTime: "09:30",
        endTime: "17:30",
        location: "桃園・DJI 認證訓練中心",
        seats: 3,
        seatsTotal: 8,
      },
    ],
  },
  {
    id: "tra-board-game-cert",
    type: "training",
    name: "桌遊教育引導師認證",
    cover: "/images/materials/training-board.jpg",
    price: 5800,
    shortDesc: "24 小時實體培訓，取得桌遊教育引導師資格",
    description:
      "與新天鵝堡共同開發的引導師培訓課程，學習如何在課堂中善用桌遊培養孩子的邏輯思考與社交能力。",
    relatedTalent: "桌遊",
    tags: ["合作品牌", "引導技巧"],
    stockStatus: "in_stock",
    highlights: [
      "24 小時實體培訓",
      "新天鵝堡聯名認證",
      "結訓贈送桌遊精選 3 件",
    ],
    gallery: [],
    durationHours: 24,
    format: "onsite",
    unlocksSkill: "桌遊",
    instructor: "桌遊資深引導師・陳老師",
    schedules: [
      {
        id: "tra-board-game-2026-07",
        date: "2026-07-22",
        startTime: "10:00",
        endTime: "17:00",
        location: "台北市大安區・新天鵝堡桌遊基地",
        seats: 6,
        seatsTotal: 10,
      },
      {
        id: "tra-board-game-2026-08",
        date: "2026-08-26",
        startTime: "10:00",
        endTime: "17:00",
        location: "台北市大安區・新天鵝堡桌遊基地",
        seats: 10,
        seatsTotal: 10,
      },
    ],
  },
]

export const materials: Material[] = [
  ...physicalItems,
  ...digitalItems,
  ...trainingItems,
]

export function getMaterialById(id: string): Material | undefined {
  return materials.find((m) => m.id === id)
}

// 取所有出現過的才藝，給篩選用
export function getAllRelatedTalents(): string[] {
  const set = new Set<string>()
  for (const m of materials) {
    if (m.relatedTalent) set.add(m.relatedTalent)
  }
  return Array.from(set)
}
