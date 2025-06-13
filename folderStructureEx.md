health/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── v1/           # API versioning
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   │   └── auth/
│   │   │       └── route.ts
│   │   ├── db/           # Database configuration
│   │   ├── models/       # Data models
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # API middleware
│   │   └── utils/        # API utilities
│   │
│   ├── (routes)/         # Frontend routes (grouped)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
│
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── features/        # Feature-specific components
│       ├── auth/
│       └── dashboard/
│
├── lib/                 # Library Shared utilities
│   ├── utils.ts         # Utility functions
│   ├── constants.ts     # App constants
│   └── types.ts         # TypeScript types
│
├── public/              # Static assets
│   ├── images/
│   └── icons/
│
├── types/               # TypeScript type definitions
│   ├── api.ts          # API types
│   └── common.ts       # Common types
│
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies