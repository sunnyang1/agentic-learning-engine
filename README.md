# Agentic Learning Engine

> **AI-Powered Training System for MediaStorm** · **面向 MediaStorm（影视飓风）的 AI 驱动培训系统**

---

## 🌐 Language / 语言

- [English](#english)
- [中文](#中文)

---

<a id="english"></a>

<details>
<summary><h2>📄 English</h2></summary>

A comprehensive product portfolio demonstrating end-to-end product management capabilities — from PRD to implementation plan, from interactive prototype to production-ready PoC.

---

### 📌 Background

This portfolio was built for a Product Manager application at **MediaStorm (影视飓风)**, a top-tier Chinese content creation studio producing 130+ films per year with a 100-person team.

The project addresses a real operational challenge: **new editor onboarding takes 14+ days**, with senior mentors spending 30% of their time on repetitive coaching. The solution is an **Agentic Learning Engine** — an AI-powered training system built on Feishu (Lark) ecosystem that autonomously diagnoses skill gaps, coaches via Socratic dialogue, predicts at-risk learners, and manages certification & mentor incentives.

---

### 📁 Portfolio Contents

#### 1. Product Requirements Document
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/training_system_PRD.md`](training_system/training_system_PRD.md) | 2,546 | Full PRD v3.0 — user stories, functional specs, KPIs, roadmap |
| [`training_system/需求分析.md`](training_system/需求分析.md) | — | Requirement analysis & stakeholder mapping |

#### 2. System Design
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) | 1,852 | Frozen design spec v4.1 — 3 rounds of design review, 24 issues closed |
| [`training_system/设计评审纪要_v3.md`](training_system/设计评审纪要_v3.md) | — | Design review minutes (3 rounds, 24 issues → all resolved) |
| [`training_system/需求跟踪矩阵与偏离分析报告.md`](training_system/需求跟踪矩阵与偏离分析报告.md) | 419 | Traceability matrix & deviation analysis (21 items) |

#### 3. Testing & Operations
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/测试用例设计.md`](training_system/测试用例设计.md) | 753 | Test case design covering functional & edge cases |
| [`training_system/数据埋点设计.md`](training_system/数据埋点设计.md) | 690 | Data tracking & analytics event design |
| [`training_system/运营方案.md`](training_system/运营方案.md) | 528 | Go-to-market & operations plan |
| [`training_system/Sprint计划.md`](training_system/Sprint计划.md) | — | 20-Sprint agile plan (2-week sprints, 8-month roadmap) |

#### 4. Interactive Prototype
| Path | Description |
|------|-------------|
| [`training_system/figma_prototype/`](training_system/figma_prototype/) | 13-page HTML prototype — student chat, coach, mentor dashboard, manager insights, admin panels |
| [`training_system/figma_prototype/js/app.js`](training_system/figma_prototype/js/app.js) | 1,756 lines of prototype logic |

**Open [`training_system/figma_prototype/index.html`](training_system/figma_prototype/index.html)** in a browser to explore.

#### 5. Portfolio Website
| Path | Description |
|------|-------------|
| [`training_system/portfolio/`](training_system/portfolio/) | 6-page responsive portfolio site (dark theme) |

#### 6. Feishu PoC Package
| Document | Lines | Description |
|----------|-------|-------------|
| [`training_system/feishu_poc/01_setup_guide.md`](training_system/feishu_poc/01_setup_guide.md) | 214 | Feishu app setup & permission configuration |
| [`training_system/feishu_poc/02_base_schema.json`](training_system/feishu_poc/02_base_schema.json) | 158 | 9-table Base schema definition |
| [`training_system/feishu_poc/03_workflow_logic.md`](training_system/feishu_poc/03_workflow_logic.md) | 321 | 6 core Workflow designs |
| [`training_system/feishu_poc/04_llm_integration.py`](training_system/feishu_poc/04_llm_integration.py) | 463 | Production-ready Python code for LLM integration |
| [`training_system/feishu_poc/05_bot_config.md`](training_system/feishu_poc/05_bot_config.md) | 290 | Bot configuration & message card templates |

#### 7. Strategic Analysis
| Document | Description |
|----------|-------------|
| [`MediaStorm_效率工具机会点分析.md`](MediaStorm_效率工具机会点分析.md) | Efficiency tool opportunity analysis for MediaStorm |

---

### 🏗️ Architecture Overview

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

### 📊 Key Metrics & Targets

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

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Platform | Feishu (Lark) — Base, Workflow, Docs, Bot, AI Partner |
| LLM | Alibaba Bailian (Qwen) / Doubao / Claude |
| ML (Phase 2) | XGBoost / LightGBM |
| Backend | Python + Feishu Open API |
| Frontend (Prototype) | HTML/CSS/JS |
| Memory | Feishu Base (Hot) + Docs (Cold) + Aliyun OSS (Archive) |

---

### 📅 Implementation Roadmap

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

### 🚀 Quick Start

**View the Interactive Prototype**
```bash
open training_system/figma_prototype/index.html
```

**Explore the Portfolio Website**
```bash
open training_system/portfolio/index.html
```

**Read the Design Spec**
Start with [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) for the frozen technical blueprint.

---

### 📈 Design Review Methodology

Every design iteration followed a standardized 4-dimension review process:
1. **Architecture Feasibility** — Can it be built within constraints?
2. **Performance Compliance** — Do latency/cost targets hold?
3. **Prompt Pre-research Necessity** — What needs validation before implementation?
4. **AI Accuracy Realism** — Are targets grounded in data or wishful thinking?

3 rounds of review → 24 issues identified → **24 issues resolved** → v4.1 frozen.

---

### 📄 License

This is a **portfolio project** for demonstration purposes. All documents and code are original work created for the MediaStorm Product Manager application.

---

> **Total output: 11,000+ lines of documentation | 13-page interactive prototype | 6-page portfolio site | 5-piece Feishu PoC package**

</details>

---

<a id="中文"></a>

<details open>
<summary><h2>📄 中文</h2></summary>

一份完整的产品经理作品集，展示端到端的产品管理能力 — 从 PRD 到实施方案，从交互原型到生产级 PoC。

---

### 📌 项目背景

本作品集为 **MediaStorm（影视飓风）产品经理岗位** 申请而制作。MediaStorm 是中国顶尖的内容创作工作室，年产 130+ 部影片，团队规模约 100 人。

项目针对一个真实的运营痛点：**新人剪辑师独立产出周期长达 14 天以上**，资深导师 30% 的时间消耗在重复性指导上。解决方案是 **Agentic Learning Engine** — 一套基于飞书（Lark）生态构建的 AI 驱动培训系统，能够自主诊断能力缺口、通过苏格拉底式对话进行辅导、预测流失风险学员，并管理等级认证与导师激励。

---

### 📁 作品集内容

#### 1. 产品需求文档
| 文档 | 行数 | 说明 |
|------|------|------|
| [`training_system/training_system_PRD.md`](training_system/training_system_PRD.md) | 2,546 | 完整 PRD v3.0 — 用户故事、功能规格、KPI、路线图 |
| [`training_system/需求分析.md`](training_system/需求分析.md) | — | 需求分析与干系人地图 |

#### 2. 系统设计
| 文档 | 行数 | 说明 |
|------|------|------|
| [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) | 1,852 | 冻结版设计规格 v4.1 — 3 轮设计评审，24 个问题全部闭环 |
| [`training_system/设计评审纪要_v3.md`](training_system/设计评审纪要_v3.md) | — | 设计评审纪要（3 轮，24 个问题 → 全部解决） |
| [`training_system/需求跟踪矩阵与偏离分析报告.md`](training_system/需求跟踪矩阵与偏离分析报告.md) | 419 | 需求跟踪矩阵与偏离分析（21 项偏离） |

#### 3. 测试与运营
| 文档 | 行数 | 说明 |
|------|------|------|
| [`training_system/测试用例设计.md`](training_system/测试用例设计.md) | 753 | 测试用例设计，覆盖功能与边界场景 |
| [`training_system/数据埋点设计.md`](training_system/数据埋点设计.md) | 690 | 数据追踪与分析事件设计 |
| [`training_system/运营方案.md`](training_system/运营方案.md) | 528 | 上线运营与推广方案 |
| [`training_system/Sprint计划.md`](training_system/Sprint计划.md) | — | 20 个 Sprint 敏捷计划（2 周/Sprint，8 个月路线图） |

#### 4. 交互原型
| 路径 | 说明 |
|------|------|
| [`training_system/figma_prototype/`](training_system/figma_prototype/) | 13 页 HTML 原型 — 学员对话、教练、导师看板、管理者洞察、管理员面板 |
| [`training_system/figma_prototype/js/app.js`](training_system/figma_prototype/js/app.js) | 1,756 行原型交互逻辑 |

**在浏览器中打开 [`training_system/figma_prototype/index.html`](training_system/figma_prototype/index.html)** 即可体验。

#### 5. 作品集网站
| 路径 | 说明 |
|------|------|
| [`training_system/portfolio/`](training_system/portfolio/) | 6 页响应式作品集网站（深色主题） |

#### 6. 飞书 PoC 材料包
| 文档 | 行数 | 说明 |
|------|------|------|
| [`training_system/feishu_poc/01_setup_guide.md`](training_system/feishu_poc/01_setup_guide.md) | 214 | 飞书应用注册、权限配置、API 验证 |
| [`training_system/feishu_poc/02_base_schema.json`](training_system/feishu_poc/02_base_schema.json) | 158 | 9 张多维表格字段定义 |
| [`training_system/feishu_poc/03_workflow_logic.md`](training_system/feishu_poc/03_workflow_logic.md) | 321 | 6 个核心 Workflow 设计 |
| [`training_system/feishu_poc/04_llm_integration.py`](training_system/feishu_poc/04_llm_integration.py) | 463 | 生产级 Python 代码，百炼 LLM 集成 |
| [`training_system/feishu_poc/05_bot_config.md`](training_system/feishu_poc/05_bot_config.md) | 290 | 机器人配置 + 消息卡片模板 |

#### 7. 战略分析
| 文档 | 说明 |
|------|------|
| [`MediaStorm_效率工具机会点分析.md`](MediaStorm_效率工具机会点分析.md) | MediaStorm 效率工具机会点分析 |

---

### 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTIC LEARNING ENGINE                   │
├─────────────────────────────────────────────────────────────┤
│  飞书生态（Lark）                                            │
│  ├─ 多维表格（Base）    → 记忆层与结构化数据                   │
│  ├─ 工作流（Workflow）  → 调度中枢与自动化                     │
│  ├─ 云文档（Docs）      → 冷存储与知识库                     │
│  ├─ 机器人（Bot）       → 消息推送与通知                     │
│  └─ 智能伙伴（AI Partner）→ LLM 集成层                       │
├─────────────────────────────────────────────────────────────┤
│  AI 智能体层                                                │
│  ├─ 诊断 Agent          → 作品分析 & 能力缺口诊断              │
│  ├─ 教练 Agent          → 苏格拉底式对话 & 实时答疑            │
│  ├─ 内容 Agent          → 动态学习路径组装                   │
│  ├─ 预测 Agent          → 流失风险学员预警                   │
│  ├─ 测评 Agent          → AI 自动生成测试题                  │
│  └─ 实战 Agent          → PR/AE 插件深度集成（Phase 2）       │
├─────────────────────────────────────────────────────────────┤
│  记忆层（Memory）                                            │
│  ├─ Hot Memory          → 1,300 tokens（用户画像）            │
│  ├─ Cold Storage        → 结构化 + 非结构化归档               │
│  ├─ 程序性记忆          → Skill Doc 自增长（Phase 3）          │
│  └─ 外部知识            → 轻量 RAG → 语义检索（Phase 3）      │
├─────────────────────────────────────────────────────────────┤
│  认证与激励体系                                              │
│  ├─ 等级认证            → L1~L4 自动校验晋升                  │
│  ├─ 360° 评估           → 自评 25% + 导师 50% + AI 12.5%     │
│  └─ 导师积分            → 自动化统计 + 排行榜 + 兑换           │
└─────────────────────────────────────────────────────────────┘
```

---

### 📊 核心指标与目标

| 指标 | 目标 | 阶段 |
|------|------|------|
| 课程完成率 | >80% | Phase 1（第 1-2 月） |
| 新人独立产出周期 | <14 天 → <7 天 | Phase 2（第 3-5 月） |
| 导师时间节省 | >30% → >50% | Phase 2 → Phase 4 |
| Agent 自主决策率 | 20% → 70% | Phase 1 → Phase 3 |
| 诊断准确率 | >70% | Phase 1 |
| 预测命中率（规则层） | 45-55% | Phase 1 |
| 预测命中率（轻量模型） | ≥60% | Phase 2（需 4 个月数据） |

---

### 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 平台 | 飞书（Lark）— 多维表格、工作流、云文档、机器人、智能伙伴 |
| 大模型 | 阿里云百炼（通义千问）/ 豆包 / Claude |
| 机器学习（Phase 2） | XGBoost / LightGBM |
| 后端 | Python + 飞书开放 API |
| 前端（原型） | HTML/CSS/JS |
| 记忆存储 | 飞书多维表格（Hot）+ 云文档（Cold）+ 阿里云 OSS（归档） |

---

### 📅 实施路线图

| 阶段 | 周期 | 重点 |
|------|------|------|
| Phase 0a | 2 周 | 飞书生态熟悉 + PoC 验证 |
| Phase 0b | 4 周 | 内容库建设（与系统开发并行） |
| Phase 1 | 8 周 | Agent 基础设施 — 工具注册表、记忆层、调度中枢 |
| Phase 2 | 8 周 | Agent 能力扩展 — 教练、内容、测评、360° 评估 |
| Phase 2x | 6 周 | 等级认证与导师激励体系 |
| Phase 3a | 6 周 | 记忆层扩展 — 程序性记忆 + 语义 RAG |
| Phase 3b | 8 周 | 实战 Agent 深度集成 + 全量上线 |
| Phase 4 | 6 个月 | 持续优化 + 机器学习模型训练 |

**关键路径总工期：~28 周（~7 个月）**

---

### 🚀 快速开始

**查看交互原型**
```bash
open training_system/figma_prototype/index.html
```

**浏览作品集网站**
```bash
open training_system/portfolio/index.html
```

**阅读设计规格**
从 [`training_system/方案设计_v4.1.md`](training_system/方案设计_v4.1.md) 开始 — 冻结版技术蓝图。

---

### 📈 设计评审方法论

每一轮设计迭代均遵循标准化的四维评审流程：
1. **架构可行性** — 在现有约束下能否实现？
2. **性能达标性** — 延迟/成本目标是否成立？
3. **Prompt 预研必要性** — 哪些能力需要在实施前验证？
4. **AI 准确率现实性** — 目标是否有数据支撑而非空想？

3 轮评审 → 识别 24 个问题 → **24 个问题全部闭环** → v4.1 冻结。

---

### 📄 许可

本作品为**求职作品集**，仅供展示用途。所有文档与代码均为 MediaStorm 产品经理岗位申请而原创。

---

> **累计产出：11,000+ 行文档 | 13 页交互原型 | 6 页作品集网站 | 5 份飞书 PoC 材料**

</details>
