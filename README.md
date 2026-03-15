# Charleston Pride | Digital Ecosystem 🏳️‍🌈
**Principal Architect & Maintainer:** Pete Bingel
**Status:** Active Production Environment

### 🎯 Strategic Objective
As the sole maintainer and CTO for Charleston Pride, I architected a multi-platform digital ecosystem to serve a diverse user base during high-traffic festival windows. The primary challenge was balancing **enterprise-grade reliability** with a **zero-budget volunteer model**.

### 🏗️ Architectural Pillars
* **AI-Accelerated Engineering:** Leveraged **GitHub Copilot (Agent Mode)** and **Claude Code** to architect and generate ~80% of the core codebase. This strategic use of AI reduced mobile time-to-market by **60%**, proving that a single architect can deliver full-stack ecosystems at the speed of a traditional development team.
* **Headless Content Governance (Sanity CMS):** Decoupled the data layer to empower non-technical staff. This allows for real-time schedule and map updates during events without requiring code changes or developer intervention.
* **Serverless Efficiency (Azure Functions):** Utilized an event-driven backend to ensure a secure, "pay-as-you-go" posture, keeping infrastructure costs at near-zero during off-peak months.
* **Cross-Platform Delivery (Capacitor):** Two PWAs — one wrapping the main website, one a standalone community app — packaged for iOS and Android via Capacitor.

### 🚀 Principal-Level Trade-offs
In a volunteer-led environment, **simplicity is a feature**. I intentionally prioritized:
1. **Sustainable Maintenance:** Choosing Sanity and Azure Functions reduces the "on-call" burden for the organization.
2. **Cost Neutrality:** Architected the system to stay within "Free Tier" cloud limits without sacrificing security or performance.
3. **Automated Quality Gates:** Implemented **GitHub Actions** for CI/CD, ensuring that any future community contributions meet baseline stability requirements.

_Note: This repository is a community-led volunteer project. While architected for production stability, it emphasizes rapid delivery and cost-efficiency over traditional enterprise development timelines._

## Repository Structure

```
chspride/
├── web/                  # Next.js website + Sanity Studio (independent)
│   └── schema/           # Sanity CMS schema definitions
├── community/            # "United in Pride" Next.js + Capacitor app (independent)
├── mobile/               # Charleston Pride Capacitor wrapper over /web (independent)
└── .github/workflows/    # CI/CD workflows
```

**Note:** This is not an npm workspace. Each application manages its own dependencies independently.

## Projects

### Web Application (`/web`)

The main Charleston Pride website — a statically exported Next.js app using Sanity CMS for content management. Also hosts the Sanity Studio.

**Quick Start:**
```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

### Community App (`/community`)

"United in Pride" — a standalone Next.js app with its own content and community features, packaged as a PWA via Capacitor. Uses the same Sanity instance as `/web` for shared content (e.g., events).

**Quick Start:**
```bash
cd community
npm install
npm run dev
```

### Mobile App (`/mobile`)

A Capacitor wrapper around the production Charleston Pride website (`https://charlestonpride.org`), packaged as a PWA for iOS and Android.

## Helper Commands (from root)

```bash
npm run web:dev           # Start /web dev server
npm run web:build         # Build /web for production
npm run web:studio        # Run Sanity Studio standalone
npm run web:install       # Install /web dependencies
npm run community:dev     # Start /community dev server
npm run community:build   # Build /community for production
npm run community:install # Install /community dependencies
npm run mobile:sync       # Capacitor sync for /mobile
```

## Deployment

The web application is automatically deployed to Azure Static Web Apps via GitHub Actions on pushes to the `main` branch.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
