# portfolio_in_mern
This is the complete and beautiful Portfolio in the Mern stack

# Folder structure

portfolio/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ProjectCard.tsx      # Displays a single project
│   │   ├── NavBar.tsx          # Navigation bar for public site
│   │   ├── AdminNav.tsx        # Navigation for admin panel
│   │   └── LoginForm.tsx       # Login form for admin
│   ├── pages/                  # Page components for routes
│   │   ├── public/             # Public portfolio pages
│   │   │   ├── Home.tsx        # Portfolio homepage
│   │   │   ├── Projects.tsx    # Projects list page
│   │   │   └── Contact.tsx     # Contact page (placeholder)
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── Dashboard.tsx   # Admin dashboard
│   │   │   ├── AddProject.tsx  # Form to add projects
│   │   │   └── Login.tsx       # Admin login page
│   ├── store/                  # Redux Toolkit setup
│   │   ├── slices/             # Redux slices
│   │   │   ├── projectSlice.ts # Manage project data
│   │   │   ├── settingsSlice.ts # Manage site settings
│   │   │   ├── authSlice.ts    # Manage admin login state
│   │   │   └── apiSlice.ts     # Placeholder for future API
│   │   └── index.ts            # Store configuration
│   ├── types/                  # TypeScript interfaces
│   │   └── index.ts            # Types for projects, settings, auth
│   ├── App.tsx                 # Main app with routes
│   ├── index.tsx               # Entry point
│   ├── App.css                 # Global styles
│   └── index.css               # Base CSS
├── public/                     # Static assets
├── .gitignore                  # Ignore node_modules, build, .env
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
└── vercel.json                 # Vercel deployment config
