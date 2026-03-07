# Phone Party – Official Marketing Website

> **Turn Phones Into One Big Speaker**

The official marketing website for [Phone Party](https://www.phone-party.com) — a social music party platform where multiple phones sync together into one massive sound system.

---

## 🎵 Project Overview

Phone Party lets users:

- **Create a party** and become the DJ
- **Join a party** with a short party code
- **Upload music** from their phone
- **Sync audio** across multiple devices in real time
- **React and interact** as a crowd while the music plays

This website is the public-facing marketing site that explains the product, showcases features, and drives installs.

---

## 📁 File Structure

```
Phone-party.com/
├── index.html    # Main single-page marketing website
├── style.css     # Premium dark UI styles (glassmorphism, neon, animations)
├── script.js     # Interactive demo, animations, FAQ accordion, confetti
└── README.md     # This file
```

---

## 🚀 Running Locally

No build process required. Just open `index.html` in a browser:

```bash
# Option 1 – Direct open
open index.html

# Option 2 – Local HTTP server (recommended for full feature support)
python3 -m http.server 8080
# Then visit: http://localhost:8080
```

---

## 🌐 Deploying to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select the branch (e.g. `main`) and root folder `/`
4. Click **Save**
5. Your site will be live at `https://<username>.github.io/<repo-name>/`

---

## 🔗 Connecting the phone-party.com Domain

### GitHub Pages custom domain

1. In your DNS provider, add a **CNAME** record:
   - Name: `www`
   - Value: `<username>.github.io`
2. Add an **A** record (for apex domain):
   - Name: `@`
   - Values (GitHub Pages IPs):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. In GitHub Pages settings, enter `www.phone-party.com` as the custom domain
4. Enable **Enforce HTTPS**

### Google Cloud (Cloud Storage / Firebase Hosting)

```bash
# Firebase Hosting example
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to . (root)
firebase deploy
# Then add custom domain in Firebase console → Hosting → Add custom domain
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--accent-primary` | `#7c3aed` | Violet – primary CTA |
| `--accent-secondary` | `#06b6d4` | Cyan – secondary accent |
| `--accent-neon` | `#a855f7` | Neon purple – highlights |
| `--text-primary` | `#ffffff` | Body text |
| `--text-secondary` | `#a1a1aa` | Muted text |

Fonts: **Inter** (body) + **Space Grotesk** (headings) via Google Fonts

---

## ✨ Features

- Animated hero with phone mockups, soundwave, and floating UI cards
- Interactive 4-step product demo (no backend required)
- 12-card feature grid with hover animations
- DJ dashboard and guest experience mockups
- 3-tier pricing (Free / Party Pass / Pro Monthly)
- Add-ons & upgrades section
- FAQ accordion
- Fully responsive (mobile, tablet, desktop)
- Full SEO metadata + OpenGraph + Twitter cards

---

© Phone Party · [phone-party.com](https://www.phone-party.com)
