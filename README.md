# Agentic Learning Engine

> **AI-Powered Training System for MediaStorm**  
> A comprehensive product portfolio demonstrating end-to-end product management capabilities — from PRD to implementation plan, from interactive prototype to production-ready PoC.

---

## 📌 Background

This portfolio was built for a Product Manager application at **MediaStorm (影视飓风)**, a top-tier Chinese content creation studio producing 130+ films per year with a 100-person team.

The project addresses a real operational challenge: **new editor onboarding takes 14+ days**, with senior mentors spending 30% of their time on repetitive coaching. The solution is an **Agentic Learning Engine** — an AI-powered training system built on Feishu (Lark) ecosystem that autonomously diagnoses skill gaps, coaches via Socratic dialogue, predicts at-risk learners, and manages certification & mentor incentives.

---

## 📁 Portfolio Contents

### 1. Product Requirements Document
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/training_system_PRD.md`](training_system/training_system_PRD.md) | 2,546 | Full PRD v3.0 — user stories, functional specs, KPIs, roadmap |
| [`training_system/需求分析.md`](training_system/需求分析.md) | — | Requirement analysis & stakeholder mapping |

### 2. System Design
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) | 1,852 | Frozen design spec v4.1 — 3 rounds of design review, 24 issues closed |
| [`training_system/设计评审纪要_v3.md`](training_system/设计评审纪要_v3.md) | — | Design review minutes (3 rounds, 24 issues → all resolved) |
| [`training_system/需求跟踪矩阵与偏离分析报告.md`](training_system/需求跟踪矩阵与偏离分析报告.md) | 419 | Traceability matrix & deviation analysis (21 items) |

### 3. Testing & Operations
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/测试用例设计.md`](training_system/测试用例设计.md) | 753 | Test case design covering functional & edge cases |
| [`training_system/数据埋点设计.md`](training_system/数据埋点设计.md) | 690 | Data tracking & analytics event design |
| [`training_system/运营方案.md`](training_system/运营方案.md) | 528 | Go-to-market & operations plan |
| [`training_system/Sprint计划.md`](training_system/Sprint计划.md) | — | 20-Sprint agile plan (2-week sprints, 8-month roadmap) |

### 4. Interactive Prototype
| Path | Description |
|------|-------------|
| [`training_system/figma_prototype/`](training_system/figma_prototype/) | 13-page HTML prototype — student chat, coach, mentor dashboard, manager insights, admin panels |
| [`training_system/figma_prototype/js/app.js`](training_system/figma_prototype/js/app.js) | 1,756 lines of prototype logic |

**Open [`training_system/figma_prototype/index.html`](training_system/figma_prototype/index.html)** in a browser to explore.

### 5. Portfolio Website
| Path | Description |
|------|-------------|
| [`training_system/portfolio/`](training_system/portfolio/) | 6-page responsive portfolio site (dark theme) |

### 6. Feishu PoC Package
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/feishu_poc/01_setup_guide.md`](training_system/feishu_poc/01_setup_guide.md) | 214 | Feishu app setup & permission configuration |
| [`training_system/feishu_poc/02_base_schema.json`](training_system/feishu_poc/02_base_schema.json) | 158 | 9-table Base schema definition |
| [`training_system/feishu_poc/03_workflow_logic.md`](training_system/feishu_poc/03_workflow_logic.md) | 321 | 6 core Workflow designs |
| [`training_system/feishu_poc/04_llm_integration.py`](training_system/feishu_poc/04_llm_integration.py) | 463 | Production-ready Python code for LLM integration |
| [`training_system/feishu_poc/05_bot_config.md`](training_system/feishu_poc/05_bot_config.md) | 290 | Bot configuration & message card templates |

### 7. Strategic Analysis
| Document | Description |
|----------|-------------|
| [`training_system/MediaStorm_效率工具机会点分析.md`](training_system/MediaStorm_效率工具机会点分析.md) | Efficiency tool opportunity analysis for MediaStorm |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTIC LEARNING ENGINE                   │
├─────────────────────────────────────────────────────────────┤
│  FEISHU ECOSYSTEM (Lark)                                    │
│  ├─ Base (Bitable)      → Memory & structured data          │
│  ├─ Workflow            → Orchestrator & automation         │
│  ├─ Docs (Wiki)         → Cold storage & knowledge base     │
│  ├─ Bot                 → Messaging & notifications         │
│  └─ AI Partner          → LLM integration layer             │
├─────────────────────────────────────────────────────────────┤
│  AI LAYER                                                   │
│  ├─ Diagnostic Agent    → Portfolio analysis & skill gaps   │
│  ├─ Coach Agent         → Socratic dialogue & real-time QA  │
│  ├─ Content Agent       → Dynamic learning paths            │
│  ├─ Predictive Agent    → At-risk learner prediction        │
│  ├─ Assessment Agent    → AI question generation            │
│  └─ Practical Agent     → PR/AE plugin integration (Phase 2)│
├─────────────────────────────────────────────────────────────┤
│  MEMORY LAYER                                               │
│  ├─ Hot Memory          → 1,300 tokens (user profile)       │
│  ├─ Cold Storage        → Structured + unstructured archive │
│  ├─ Procedural Memory   → Skill doc self-growth (Phase 3)   │
│  └─ External Knowledge  → Lightweight RAG → Semantic (Ph 3) │
├─────────────────────────────────────────────────────────────┤
│  CERTIFICATION & INCENTIVES                                 │
│  ├─ Level Certification → L1~L4 with auto-validation        │
│  ├─ 360° Assessment     → Self 25% + Mentor 50% + AI 12.5%  │
│  └─ Mentor Points       → Automated scoring + leaderboard   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Key Metrics & Targets

| Metric | Target | Phase |
|--------|--------|-------|
| Course completion rate | >80% | Phase 1 (Month 1-2) |
| New hire time-to-productivity | <14 days → <7 days | Phase 2 (Month 3-5) |
| Mentor time saved | >30% → >50% | Phase 2 → Phase 4 |
| Agent autonomy rate | 20% → 70% | Phase 1 → Phase 3 |
| Diagnostic accuracy | >70% | Phase 1 |
| Predictive hit rate (rule-based) | 45-55% | Phase 1 |
| Predictive hit rate (ML model) | ≥60% | Phase 2 (4mo data) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Platform | Feishu (Lark) — Base, Workflow, Docs, Bot, AI Partner |
| LLM | Alibaba Bailian (Qwen) / Doubao / Claude |
| ML (Phase 2) | XGBoost / LightGBM |
| Backend | Python + Feishu Open API |
| Frontend (Prototype) | HTML/CSS/JS |
| Memory | Feishu Base (Hot) + Docs (Cold) + Aliyun OSS (Archive) |

---

## 📅 Implementation Roadmap

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 0a | 2 weeks | Feishu onboarding & PoC validation |
| Phase 0b | 4 weeks | Content library build (parallel) |
| Phase 1 | 8 weeks | Agent infrastructure — Tool Registry, Memory, Orchestrator |
| Phase 2 | 8 weeks | Agent capability expansion — Coach, Content, Assessment, 360° |
| Phase 2x | 6 weeks | Certification & mentor incentive systems |
| Phase 3a | 6 weeks | Memory expansion — Procedural + Semantic RAG |
| Phase 3b | 8 weeks | Practical Agent deep integration + full rollout |
| Phase 4 | 6 months | Continuous optimization & ML model training |

**Total critical path: ~28 weeks (~7 months)**

---

## 🚀 Quick Start

### View the Interactive Prototype
```bash
open training_system/figma_prototype/index.html
```

### Explore the Portfolio Website
```bash
open training_system/portfolio/index.html
```

### Read the Design Spec
Start with [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) for the frozen technical blueprint.

---

## 📈 Design Review Methodology

Every design iteration followed a standardized 4-dimension review process:
1. **Architecture Feasibility** — Can it be built within constraints?
2. **Performance Compliance** — Do latency/cost targets hold?
3. **Prompt Pre-research Necessity** — What needs validation before implementation?
4. **AI Accuracy Realism** — Are targets grounded in data or wishful thinking?

3 rounds of review → 24 issues identified → **24 issues resolved** → v4.1 frozen.

---

## 📄 License

This is a **portfolio project** for demonstration purposes. All documents and code are original work created for the MediaStorm Product Manager application.

---

> **Total output: 11,000+ lines of documentation | 13-page interactive prototype | 6-page portfolio site | 5-piece Feishu PoC package**
