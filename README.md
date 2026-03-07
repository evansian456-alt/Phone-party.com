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
├── Dockerfile    # Production container – nginx serving static files
├── nginx.conf    # nginx config template (respects Cloud Run PORT env var)
├── .dockerignore # Files excluded from the Docker build context
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

## ☁️ Deploying to Google Cloud Run

### Prerequisites (one-time manual setup in Google Cloud Console)

1. Create or select a **Google Cloud project** at <https://console.cloud.google.com>.
2. Enable the following APIs:
   - **Cloud Run API**
   - **Artifact Registry API**
   - **Cloud Build API** (for automated GitHub deploys)
3. Create an **Artifact Registry** Docker repository, e.g.:
   ```
   Region: us-central1
   Name:   phone-party-images
   Format: Docker
   ```
4. Note your project ID (e.g. `YOUR_PROJECT_ID`) – you'll use it below.

---

### Manual one-off deploy (build & push locally)

```bash
PROJECT_ID=YOUR_PROJECT_ID
REGION=us-central1
REGISTRY=${REGION}-docker.pkg.dev/${PROJECT_ID}/phone-party-images

# Authenticate Docker with Google Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push the image
docker build -t ${REGISTRY}/phone-party-web:latest .
docker push ${REGISTRY}/phone-party-web:latest

# Deploy to Cloud Run
gcloud run deploy phone-party-web \
  --image=${REGISTRY}/phone-party-web:latest \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --port=8080
```

Cloud Run will print the service URL once the deploy completes.

---

### Continuous deployment from GitHub → Cloud Run

Use **Cloud Run's built-in GitHub integration** (no separate CI pipeline needed):

1. In **Cloud Run → Create Service** (or edit your existing service), choose
   **"Continuously deploy from a repository"**.
2. Connect your GitHub account and select:
   - **Repository**: `evansian456-alt/Phone-party.com`
   - **Branch**: `main`
   - **Build type**: Dockerfile
3. Cloud Run will automatically build and redeploy on every push to `main`.

Alternatively, add this **GitHub Actions** workflow for full control:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  PROJECT_ID: YOUR_PROJECT_ID        # ← replace with your GCP project ID
  REGION: us-central1
  SERVICE: phone-party-web
  REGISTRY: us-central1-docker.pkg.dev/YOUR_PROJECT_ID/phone-party-images

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write              # Needed for Workload Identity Federation

    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/<POOL>/providers/<PROVIDER>
          service_account: <SA_EMAIL>@<PROJECT_ID>.iam.gserviceaccount.com
          # To obtain these values, set up Workload Identity Federation:
          # https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
          # Then run: gcloud iam workload-identity-pools providers describe <PROVIDER> \
          #   --workload-identity-pool=<POOL> --location=global

      - uses: google-github-actions/setup-gcloud@v2

      - run: gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev --quiet

      - run: |
          docker build -t ${{ env.REGISTRY }}/phone-party-web:${{ github.sha }} .
          docker push ${{ env.REGISTRY }}/phone-party-web:${{ github.sha }}

      - run: |
          gcloud run deploy ${{ env.SERVICE }} \
            --image=${{ env.REGISTRY }}/phone-party-web:${{ github.sha }} \
            --platform=managed \
            --region=${{ env.REGION }} \
            --allow-unauthenticated \
            --port=8080
```

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
