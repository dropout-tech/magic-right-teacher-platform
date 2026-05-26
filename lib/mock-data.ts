// Mock Data for 萊特魔數學院老師品牌網站

export interface Teacher {
  id: string
  name: string
  realName?: string
  avatar: string
  tagline: string
  template: "A" | "B" | "C"
  yearsOfExperience: number
  skills: string[]
  bio: string
  teachingStyle: string
  credentials: string[]
  stats: {
    totalHours: number
    totalStudents: number
    totalPartners: number
  }
  courses: Course[]
  testimonials: {
    videos: VideoTestimonial[]
    texts: TextTestimonial[]
  }
  cases: Case[]
  social: {
    facebook?: string
    instagram?: string
    line?: string
    youtube?: string
    lastUpdated: string
  }
  courseStatus: "open" | "limited" | "closed"
  availableTimeSlots: Record<string, boolean[]>
  blockOrder: number[]
  contact: {
    email?: string
    phone?: string
    lineQR?: string
  }
  subscription?: Subscription
}

// ===== 訂閱與權限 =====
export type SubscriptionPlan = "trial" | "basic" | "pro" | "flagship"
export type SubscriptionStatus = "active" | "paused"
export type TemplateId = "A" | "B" | "C"

export interface Subscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus       // 管理員手動暫停／啟用；過期由 endDate 計算
  startDate: string                // YYYY-MM-DD
  endDate: string                  // YYYY-MM-DD
  unlockedTemplates: TemplateId[]  // 個別微調用；預設由方案帶入
  notes?: string
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  trial: "試用",
  basic: "基礎",
  pro: "進階",
  flagship: "旗艦",
}

// 方案預設（建立／切換方案時帶入；管理員仍可個別微調）
export const PLAN_PRESETS: Record<SubscriptionPlan, { days: number; unlockedTemplates: TemplateId[] }> = {
  trial:    { days: 30,  unlockedTemplates: ["A"] },
  basic:    { days: 90,  unlockedTemplates: ["A"] },
  pro:      { days: 180, unlockedTemplates: ["A", "B"] },
  flagship: { days: 365, unlockedTemplates: ["A", "B", "C"] },
}

export interface Course {
  id: string
  name: string
  ageRange: string
  duration: string
  highlights: string[]
  coverImage: string
  category: "社團課程" | "營隊課程" | "線上課程" | "一對一"
}

export interface VideoTestimonial {
  id: string
  youtubeUrl: string
  personName: string
  title: string
  organization: string
  summary: string
}

export interface TextTestimonial {
  id: string
  personName: string
  title: string
  avatar?: string
  content: string
  cooperationTime: string
}

export interface Case {
  id: string
  organization: string
  logo?: string
  project: string
  period: string
  isOngoing: boolean
  description: string
  photos: string[]
}

export interface Talent {
  id: string
  name: string
  icon: string
  description: string
  teacherCount: number
  demandLevel: 1 | 2 | 3
  trainingHours: number
  trainingMethod: "實體" | "線上" | "混合"
  potentialIncome: string
  relatedBrands?: string[]
}

// 才藝清單
export const talents: Talent[] = [
  {
    id: "magic",
    name: "魔術",
    icon: "wand",
    description: "透過神奇的魔術表演，培養孩子的表達能力與自信心",
    teacherCount: 8,
    demandLevel: 3,
    trainingHours: 40,
    trainingMethod: "混合",
    potentialIncome: "800-1200/hr"
  },
  {
    id: "board-games",
    name: "桌遊",
    icon: "dice",
    description: "透過策略性桌遊，訓練孩子的邏輯思考與社交能力",
    teacherCount: 12,
    demandLevel: 3,
    trainingHours: 24,
    trainingMethod: "實體",
    potentialIncome: "700-1000/hr",
    relatedBrands: ["新天鵝堡桌遊"]
  },
  {
    id: "blocks",
    name: "積木",
    icon: "blocks",
    description: "從堆疊中學習空間概念與創造力",
    teacherCount: 6,
    demandLevel: 2,
    trainingHours: 20,
    trainingMethod: "實體",
    potentialIncome: "700-950/hr"
  },
  {
    id: "science",
    name: "科學",
    icon: "flask",
    description: "動手做實驗，探索科學原理的奧妙",
    teacherCount: 5,
    demandLevel: 2,
    trainingHours: 32,
    trainingMethod: "混合",
    potentialIncome: "800-1100/hr"
  },
  {
    id: "handicraft",
    name: "手工藝",
    icon: "scissors",
    description: "培養孩子的手眼協調與美感創造力",
    teacherCount: 7,
    demandLevel: 2,
    trainingHours: 16,
    trainingMethod: "實體",
    potentialIncome: "650-900/hr"
  },
  {
    id: "domino",
    name: "骨牌",
    icon: "layout",
    description: "透過骨牌排列培養耐心與專注力",
    teacherCount: 4,
    demandLevel: 2,
    trainingHours: 20,
    trainingMethod: "實體",
    potentialIncome: "700-950/hr"
  },
  {
    id: "drone",
    name: "無人機",
    icon: "plane",
    description: "學習無人機操控，接觸科技新領域",
    teacherCount: 3,
    demandLevel: 3,
    trainingHours: 48,
    trainingMethod: "混合",
    potentialIncome: "900-1300/hr",
    relatedBrands: ["DJI 大疆教育"]
  },
  {
    id: "perler-beads",
    name: "拼豆",
    icon: "grid",
    description: "透過拼豆創作訓練精細動作與美感",
    teacherCount: 5,
    demandLevel: 1,
    trainingHours: 12,
    trainingMethod: "實體",
    potentialIncome: "600-850/hr"
  },
  {
    id: "robot",
    name: "程式機器人",
    icon: "bot",
    description: "學習程式邏輯與機器人組裝",
    teacherCount: 4,
    demandLevel: 3,
    trainingHours: 56,
    trainingMethod: "混合",
    potentialIncome: "900-1400/hr"
  },
  {
    id: "woodwork",
    name: "小木匠",
    icon: "hammer",
    description: "動手製作木工作品，培養創造力",
    teacherCount: 2,
    demandLevel: 1,
    trainingHours: 24,
    trainingMethod: "實體",
    potentialIncome: "700-1000/hr"
  },
  {
    id: "paper-art",
    name: "紙藝",
    icon: "newspaper",
    description: "透過摺紙與紙藝創作訓練精細動作",
    teacherCount: 3,
    demandLevel: 1,
    trainingHours: 16,
    trainingMethod: "實體",
    potentialIncome: "600-850/hr"
  },
  {
    id: "magic-science",
    name: "魔法科學",
    icon: "sparkles",
    description: "結合魔術與科學的跨領域課程",
    teacherCount: 2,
    demandLevel: 2,
    trainingHours: 40,
    trainingMethod: "混合",
    potentialIncome: "850-1200/hr"
  },
  {
    id: "balloon",
    name: "氣球",
    icon: "party-popper",
    description: "造型氣球創作，增添歡樂氣氛",
    teacherCount: 4,
    demandLevel: 2,
    trainingHours: 20,
    trainingMethod: "實體",
    potentialIncome: "700-1000/hr"
  },
  {
    id: "mechanics",
    name: "動力機械",
    icon: "cog",
    description: "學習機械原理與動力傳動",
    teacherCount: 3,
    demandLevel: 2,
    trainingHours: 36,
    trainingMethod: "混合",
    potentialIncome: "800-1100/hr"
  }
]

// 猴子老師資料
export const teacherMonkey: Teacher = {
  id: "monkey",
  name: "猴子老師",
  avatar: "/images/teacher-monkey.jpg",
  tagline: "讓每個孩子都能開心自在的學習",
  template: "A",
  yearsOfExperience: 6,
  skills: ["魔術", "桌遊", "積木", "骨牌", "小小賽車手", "動力機械", "程式機器人", "科技無人機", "動手玩科學", "特種部隊戰鬥營"],
  bio: "猴子老師擁有六年豐富的才藝教學經驗，擅長透過多元互動式教學，讓孩子在歡笑中學習。從魔術的驚奇到程式機器人的邏輯思維，猴子老師相信每個孩子都有獨特的學習方式，重要的是找到點燃他們學習熱情的那把鑰匙。\n\n在教學過程中，猴子老師特別注重與孩子的互動，善用遊戲化的方式讓學習變得有趣。「當孩子眼中閃爍著興奮的光芒時，那就是我最大的成就感。」",
  teachingStyle: "互動式、引導式、遊戲化教學",
  credentials: [
    "萊特魔數學院認證講師",
    "兒童活動企劃師認證",
    "桌遊教育引導師",
    "STEAM 教育培訓認證"
  ],
  stats: {
    totalHours: 3000,
    totalStudents: 2000,
    totalPartners: 15
  },
  courses: [
    {
      id: "magic-basic",
      name: "魔術初階班",
      ageRange: "小一至小三",
      duration: "90分鐘/堂",
      highlights: ["學會10個基礎魔術", "培養表達自信", "訓練手指靈活度", "認識魔術歷史"],
      coverImage: "/images/courses/magic-basic.jpg",
      category: "社團課程"
    },
    {
      id: "board-game-strategy",
      name: "策略桌遊營",
      ageRange: "小三至小六",
      duration: "3小時/次",
      highlights: ["邏輯思考訓練", "團隊合作培養", "策略規劃能力", "社交技巧提升"],
      coverImage: "/images/courses/board-game.jpg",
      category: "營隊課程"
    },
    {
      id: "robot-coding",
      name: "機器人程式課",
      ageRange: "小四至國二",
      duration: "120分鐘/堂",
      highlights: ["程式邏輯入門", "機械組裝實作", "問題解決能力", "創意思維培養"],
      coverImage: "/images/courses/robot.jpg",
      category: "社團課程"
    }
  ],
  testimonials: {
    videos: [
      {
        id: "v1",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        personName: "王主任",
        title: "教務主任",
        organization: "新北市某某國小課後照顧中心",
        summary: "我們與猴子老師合作已經三年了，孩子們每次都期待他的課。猴子老師不只教技術，更重要的是讓孩子們在過程中學會合作與表達。"
      }
    ],
    texts: [
      {
        id: "t1",
        personName: "陳媽媽",
        title: "家長",
        content: "我的孩子原本很內向，上了猴子老師的魔術課之後，變得更有自信了。現在還會主動表演給親戚看，真的很感謝猴子老師！",
        cooperationTime: "2024年"
      },
      {
        id: "t2",
        personName: "林園長",
        title: "園長",
        content: "猴子老師的課程設計很用心，每次都能看到孩子們專注投入的神情。尤其是機器人課程，孩子們學得又快又開心。",
        cooperationTime: "2023-2025年"
      }
    ]
  },
  cases: [
    {
      id: "c1",
      organization: "新北市某某國小",
      project: "學期魔術社團 + 暑期科學營",
      period: "2022～至今",
      isOngoing: true,
      description: "每學期固定開設魔術社團課程，暑假則舉辦科學營隊。三年來累計服務超過 200 位學生，深獲家長好評，課程常常秒殺額滿。",
      photos: ["/images/cases/case1-1.jpg", "/images/cases/case1-2.jpg"]
    },
    {
      id: "c2",
      organization: "台北市某某安親班",
      project: "週末桌遊活動課",
      period: "2023～至今",
      isOngoing: true,
      description: "每週六下午的桌遊活動課程，透過策略型桌遊培養孩子的邏輯思考。課程採小班制，確保每位孩子都能充分參與。",
      photos: ["/images/cases/case2-1.jpg"]
    },
    {
      id: "c3",
      organization: "某某企業家庭日",
      project: "親子科學活動",
      period: "2024年",
      isOngoing: false,
      description: "為企業家庭日設計的親子科學活動，透過有趣的科學實驗讓家長與孩子一起動手做，增進親子互動。",
      photos: ["/images/cases/case3-1.jpg"]
    }
  ],
  social: {
    facebook: "https://facebook.com/monkeyteacher",
    youtube: "https://youtube.com/@monkeyteacher",
    line: "https://line.me/monkeyteacher",
    lastUpdated: "2026-05-23"
  },
  courseStatus: "open",
  availableTimeSlots: {
    "mon": [true, true, false],
    "tue": [false, true, true],
    "wed": [true, true, true],
    "thu": [false, true, false],
    "fri": [true, false, true],
    "sat": [true, true, true],
    "sun": [false, false, false]
  },
  blockOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  contact: {
    email: "monkey@magicrightschool.com",
    phone: "(02) 2683-2613"
  },
  subscription: {
    plan: "flagship",
    status: "active",
    startDate: "2025-11-01",
    endDate: "2026-11-01",
    unlockedTemplates: ["A", "B", "C"],
    notes: "首批合作老師，旗艦方案，含全部模板。"
  }
}

// 品客老師資料
export const teacherPringle: Teacher = {
  id: "pringle",
  name: "品客老師",
  avatar: "/images/teacher-pringle.jpg",
  tagline: "重視關係、引導探索，讓學習自然發生",
  template: "B",
  yearsOfExperience: 5,
  skills: ["手工藝", "無人機", "手作", "桌遊", "骨牌", "拼豆", "程式機器人", "體驗教育"],
  bio: "品客老師重視每一位學生彼此之間的關係，採用引導式教學讓學生自我探索。五年的教學經驗中，品客老師發現最好的學習不是「教會」，而是「讓孩子自己發現答案」。\n\n從手工藝的細膩到無人機的科技，品客老師擅長在多元才藝中培養孩子的觀察力與創造力。每一堂課都是一趟探索之旅，讓孩子在動手做的過程中自然而然地學會新技能。",
  teachingStyle: "引導式、合作學習、探索發現",
  credentials: [
    "萊特魔數學院認證講師",
    "DJI 無人機教育認證教練",
    "體驗教育引導師",
    "手作教育專業認證"
  ],
  stats: {
    totalHours: 2500,
    totalStudents: 1800,
    totalPartners: 12
  },
  courses: [
    {
      id: "drone-beginner",
      name: "無人機入門班",
      ageRange: "小四至國二",
      duration: "120分鐘/堂",
      highlights: ["安全飛行觀念", "基礎操控技巧", "空拍攝影入門", "無人機原理認識"],
      coverImage: "/images/courses/drone.jpg",
      category: "社團課程"
    },
    {
      id: "handicraft-creative",
      name: "創意手作營",
      ageRange: "小一至小四",
      duration: "2.5小時/次",
      highlights: ["多元媒材體驗", "美感培養", "手眼協調訓練", "創意思維啟發"],
      coverImage: "/images/courses/handicraft.jpg",
      category: "營隊課程"
    },
    {
      id: "perler-beads",
      name: "拼豆藝術課",
      ageRange: "小一至小三",
      duration: "90分鐘/堂",
      highlights: ["精細動作訓練", "色彩配置學習", "專注力培養", "創意作品製作"],
      coverImage: "/images/courses/perler.jpg",
      category: "社團課程"
    }
  ],
  testimonials: {
    videos: [],
    texts: [
      {
        id: "t1",
        personName: "李園長",
        title: "園長",
        content: "品客老師總是很有耐心地引導孩子，不急著給答案，讓孩子自己摸索出來的成就感，是其他課程很難做到的。我們合作了兩年，每學期都收到家長的好評回饋。",
        cooperationTime: "2023-2025年"
      },
      {
        id: "t2",
        personName: "張爸爸",
        title: "家長",
        content: "我家小孩以前做事很沒耐心，上了品客老師的拼豆課之後，慢慢學會專注。現在做其他事情也變得更有耐心了，真的很神奇！",
        cooperationTime: "2024年"
      },
      {
        id: "t3",
        personName: "吳主任",
        title: "活動主任",
        content: "品客老師的無人機課程很專業又有趣，孩子們不只學會操控，還學到很多科技知識。課程結束後好多孩子都說想繼續學！",
        cooperationTime: "2025年"
      }
    ]
  },
  cases: [
    {
      id: "c1",
      organization: "台北市某某補習班",
      project: "常態手工藝社團 + 寒假創客營",
      period: "2023～至今",
      isOngoing: true,
      description: "每週固定的手工藝社團課程，搭配寒假的創客營隊。透過多元媒材的手作課程，培養孩子的創造力與美感素養。",
      photos: ["/images/cases/pringle-case1-1.jpg"]
    },
    {
      id: "c2",
      organization: "新北市某某國中",
      project: "無人機社團課程",
      period: "2024～至今",
      isOngoing: true,
      description: "國中生的無人機入門課程，從基礎操控到空拍實作，讓學生接觸最新的無人機科技。",
      photos: ["/images/cases/pringle-case2-1.jpg"]
    }
  ],
  social: {
    instagram: "https://instagram.com/pringleteacher",
    line: "https://line.me/pringleteacher",
    lastUpdated: "2026-05-25"
  },
  courseStatus: "limited",
  availableTimeSlots: {
    "mon": [false, true, false],
    "tue": [true, true, false],
    "wed": [false, false, true],
    "thu": [true, true, false],
    "fri": [false, true, true],
    "sat": [true, true, false],
    "sun": [false, false, false]
  },
  blockOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  contact: {
    email: "pringle@magicrightschool.com",
    phone: "(02) 2683-2613"
  },
  subscription: {
    plan: "pro",
    status: "active",
    startDate: "2025-12-05",
    endDate: "2026-06-04",
    unlockedTemplates: ["A", "B"],
    notes: "進階方案即將到期，記得提醒續訂。"
  }
}

// 所有老師列表
export const teachers: Teacher[] = [teacherMonkey, teacherPringle]

// 課程需求看板
export const courseRequests = [
  {
    id: "req1",
    organization: "新北市某某國小",
    courseType: "社團課程",
    talent: "魔術",
    timeSlot: "週三下午",
    location: "新北市三重區",
    estimatedSessions: 16,
    deadline: "2026-06-15",
    status: "open"
  },
  {
    id: "req2",
    organization: "台北市某某安親班",
    courseType: "營隊課程",
    talent: "科學",
    timeSlot: "暑假期間",
    location: "台北市大安區",
    estimatedSessions: 5,
    deadline: "2026-06-30",
    status: "open"
  },
  {
    id: "req3",
    organization: "某某企業",
    courseType: "活動表演",
    talent: "魔術",
    timeSlot: "2026/07/20 下午",
    location: "台北市信義區",
    estimatedSessions: 1,
    deadline: "2026-07-10",
    status: "open"
  }
]

// 公司資訊
export const companyInfo = {
  name: "MR 萊特魔數學院",
  fullName: "信均國際文教有限公司",
  website: "https://magicrightschool.com",
  phone: "(02) 2683-2613",
  email: "magicrightschool@gmail.com",
  address: "新北市三峽區國際一街96號16樓之2",
  social: {
    facebook: "https://facebook.com/magicrightschool",
    instagram: "https://instagram.com/magicrightschool",
    youtube: "https://youtube.com/@magicrightschool",
    line: "https://line.me/magicrightschool"
  },
  partners: ["新天鵝堡桌遊", "DJI 大疆教育"]
}
