# 🧩 TeamGen

[![Live demo](https://img.shields.io/badge/Live%20demo-teamgen--pcell.vercel.app-2FB377?logo=vercel&logoColor=white)](https://teamgen-pcell.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)

Split any group into fair random teams in seconds. Type or paste names, or import a CSV/Excel sheet for big lists, choose how to split, and shuffle. Latecomers slot into the smallest team without disturbing anyone, and you can keep score while you play.

## ✨ Features

- 📝 **Quick entry** — type a name and press Enter, or paste a whole list (splits on commas/new lines, de-duplicates).
- 📊 **CSV / Excel import** — drag-and-drop `.csv`, `.xlsx`, or `.xls`; pick the name column from a preview.
- ⚖️ **Flexible splitting** — by number of teams or by team size, with a live preview.
- ⏰ **Late additions** — add someone after generating; they join the smallest team.
- 🔀 **Adjustments** — move members between teams, rename teams, remove people.
- 🏆 **Scoring** — optional points per team with a leaderboard and a crown for the leader.
- 📤 **Export anywhere** — copy as text, or download CSV, a styled colorful Excel workbook, or a PDF.
- 🔐 **Optional Google sign-in** — sessions auto-save to your account; without signing in everything still works, it just isn't saved to the cloud.
- 🌓 Light/dark theme, fully responsive.

## 🚀 Getting started

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully in guest mode with no configuration.

## 🔐 Enable saving (Firebase)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication → Sign-in method**: enable **Google**.
3. **Firestore Database**: create a database, then set rules so users can only touch their own data:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/sessions/{sessionId} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **Project settings → Your apps**: add a Web app and copy its config.
5. Copy `.env.example` to `.env.local` and fill in the values, then restart the dev server.

## 🛠️ Tech

Next.js (App Router) · React · Tailwind CSS 4 · Firebase Auth + Firestore · SheetJS (`xlsx`) · ExcelJS · jsPDF · Motion · Lucide icons

## 📄 License

Released under the [MIT License](../LICENSE).
