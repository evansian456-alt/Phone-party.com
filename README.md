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
├── index.html       # Main single-page marketing website
├── style.css        # Premium dark UI styles (glassmorphism, neon, animations)
├── script.js        # Interactive demo, animations, FAQ accordion, confetti
├── Dockerfile       # Production container – nginx:alpine serving static files on port 8080
├── nginx.conf       # nginx config: port 8080, gzip, SPA fallback, asset caching
├── cloudbuild.yaml  # Google Cloud Build pipeline: build → push → deploy to Cloud Run
├── .dockerignore    # Files excluded from the Docker build context
└── README.md        # This file
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

## ☁️ Deploying to Google Cloud Run

### Prerequisites (one-time manual setup in Google Cloud Console)

1. Create or select a **Google Cloud project** at <https://console.cloud.google.com>.
2. Enable the following APIs:
   - **Cloud Run API**
   - **Artifact Registry API**
   - **Cloud Build API** (for automated GitHub deploys)
3. Create an **Artifact Registry** Docker repository:
   ```
   Region: us-central1
   Name:   phone-party
   Format: Docker
   ```
4. Note your project ID (e.g. `YOUR_PROJECT_ID`) – you'll use it below.

---

### Manual one-off deploy (build & push locally)

```bash
PROJECT_ID=YOUR_PROJECT_ID
REGION=us-central1
REGISTRY=${REGION}-docker.pkg.dev/${PROJECT_ID}/phone-party

# Authenticate Docker with Google Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push the image
docker build -t ${REGISTRY}/phone-party-com-git:latest .
docker push ${REGISTRY}/phone-party-com-git:latest

# Deploy to Cloud Run
gcloud run deploy phone-party-com-git \
  --image=${REGISTRY}/phone-party-com-git:latest \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --port=8080
```

Cloud Run will print the service URL once the deploy completes.

---

### Continuous deployment from GitHub → Cloud Run via Cloud Build

Every push to the `main` branch automatically triggers a full build and deploy through **Google Cloud Build** using the `cloudbuild.yaml` in the repository root.

**What `cloudbuild.yaml` does:**

1. **Build** – builds the Docker image using the `Dockerfile` and tags it with the commit SHA:
   ```
   us-central1-docker.pkg.dev/$PROJECT_ID/phone-party/phone-party-com-git:$COMMIT_SHA
   ```
2. **Push** – pushes the image to Artifact Registry.
3. **Deploy** – deploys the image to the Cloud Run service `phone-party-com-git` in `us-central1` with public (unauthenticated) access.

The `options: logging: CLOUD_LOGGING_ONLY` setting is required when using a custom build service account (avoids the "logs_bucket or CLOUD_LOGGING_ONLY required" error).

**One-time setup to connect the trigger:**

1. In **Google Cloud Console → Cloud Build → Triggers**, click **Create Trigger**.
2. Connect your GitHub account and select:
   - **Repository**: `evansian456-alt/Phone-party.com`
   - **Branch**: `^main$`
   - **Configuration**: Cloud Build configuration file (`cloudbuild.yaml`)
3. Assign the trigger a service account that has:
   - `roles/run.admin` (deploy to Cloud Run)
   - `roles/artifactregistry.writer` (push images)
   - `roles/iam.serviceAccountUser` (act as the Cloud Run runtime SA)
4. Save. Every push to `main` will now build and deploy automatically.

---

### Custom domain: www.phone-party.com

**Step 1 – Map the domain in Cloud Run**

1. Go to **Cloud Run → your service → Domain Mappings → Add mapping**.
2. Enter `www.phone-party.com` and follow the verification steps.
3. Cloud Run will show you the **CNAME target** to point at (e.g. `ghs.googlehosted.com`).

**Step 2 – Update DNS**

In your DNS provider add:

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| CNAME | `www` | `ghs.googlehosted.com`   |

For the apex domain (`phone-party.com`) redirect to `www`, add:

| Type | Name | Value              |
|------|------|--------------------|
| A    | `@`  | `216.239.32.21`    |
| A    | `@`  | `216.239.34.21`    |
| A    | `@`  | `216.239.36.21`    |
| A    | `@`  | `216.239.38.21`    |

> **Note**: Google Cloud Run manages the TLS certificate automatically once DNS propagates (usually within minutes to an hour).

---

## 🌐 Deploying to GitHub Pages (alternative)

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select the branch (e.g. `main`) and root folder `/`
4. Click **Save**
5. Your site will be live at `https://<username>.github.io/<repo-name>/`

---

## 🔗 Connecting the phone-party.com Domain (GitHub Pages)

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
