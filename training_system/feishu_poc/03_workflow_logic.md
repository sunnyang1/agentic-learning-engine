# 飞书 PoC Workflow 设计 — Day 3

> **目标**：在飞书应用引擎中创建核心 Workflow，实现「学员入职 → 诊断 → 推送学习套餐」闭环
> **预计时间**：3-4 小时
> **工具**：飞书应用引擎（Base版）+ 多维表格自动化 + 机器人

---

## Workflow 1：学员入职初始化

### 触发条件
- 飞书审批流：入职审批通过
- 或 手动触发：在User表新增记录

### 执行步骤

```
Step 1: 创建学员档案
  └─ 在 User 表新增记录
     ├─ user_id: 自动生成
     ├─ level: L1助理
     ├─ risk_level: 🟢正常
     ├─ skill_*: 全部 1.0
     └─ join_date: 今天

Step 2: 分配导师
  └─ 查询 Mentorship 表 → 找到匹配的导师
  └─ 更新 User.mentor_id

Step 3: 发送欢迎消息（飞书机器人）
  └─ 接收人：学员
  └─ 内容：
     "🎉 欢迎加入 MediaStorm！
      我是你的 AI 学习教练。
      请在 48 小时内提交你的代表作品链接，
      我将为你生成个性化学习路径。"

Step 4: 创建诊断任务
  └─ 在 LearningRecord 表新增：
     ├─ event_type: 能力测评
     ├─ content_name: 入职诊断
     └─ status: 待完成

Step 5: 设置提醒（延时节点）
  └─ 24小时后：如果诊断未完成 → 发送提醒消息
  └─ 48小时后：如果诊断未完成 → 升级给导师
```

### 飞书应用引擎配置

1. 创建 Workflow「学员入职初始化」
2. 触发器：「Webhook」或「多维表格变更」（User表新增）
3. 动作节点：
   - 节点1：「创建记录」（User表）
   - 节点2：「更新记录」（User表，填入mentor_id）
   - 节点3：「发送消息」（飞书机器人）
   - 节点4：「创建记录」（LearningRecord表）
   - 节点5：「延时」（24小时）
   - 节点6：「条件分支」（诊断是否完成）
     ├─ 是 → 结束
     └─ 否 → 「发送消息」（提醒）→ 「延时」（24小时）→ 导师通知

---

## Workflow 2：每日学习套餐推送

### 触发条件
- 定时触发：每天早9:00（Cron: `0 9 * * *`）

### 执行步骤

```
Step 1: 查询所有在职学员
  └─ SELECT * FROM User WHERE status = '在职'

Step 2: 对每个学员循环执行：

  Step 2.1: 查询学习历史
    └─ SELECT * FROM LearningRecord 
       WHERE user_id = ? AND created_at >= 最近7天
    └─ 计算：完成率、平均时长、能力增长趋势

  Step 2.2: 查询能力缺口
    └─ 对比 User.skill_* 与目标等级要求
    └─ 找出 Top 3 能力缺口

  Step 2.3: 组装学习套餐（PoC简化版）
    └─ 从 Course 表查询匹配课程（按缺口+难度）
    └─ 从 CaseStudy 表查询相关案例
    └─ 组装为消息内容

  Step 2.4: 发送推送消息
    └─ 接收人：学员
    └─ 内容示例：
       "早安，小夏！☀️
        今日学习套餐（预计25分钟）：
        1️⃣ 《前3秒定生死：钩子设计》视频·12分钟
        2️⃣ 案例拆解：《我花30万买了一台电影机》
        3️⃣ 微练习：给3个标题打分
        
        💡 为什么推荐这些？
        你上周在「网感」测试中得分72，距离目标80还有差距。"

  Step 2.5: 记录推送日志
    └─ 在 AgentDecisionLog 表新增：
       ├─ agent_name: 内容Agent
       ├─ decision_type: 推荐
       └─ output_action: 推送套餐详情JSON
```

### 飞书应用引擎配置

1. 创建 Workflow「每日学习套餐推送」
2. 触发器：「定时触发」→ 每天 9:00
3. 动作节点：
   - 节点1：「查询记录」（User表，条件status=在职）
   - 节点2：「循环」（对每个学员）
     - 子节点1：「查询记录」（LearningRecord，最近7天）
     - 子节点2：「查询记录」（Course，按skill缺口匹配）
     - 子节点3：「发送消息」（飞书机器人，动态内容）
     - 子节点4：「创建记录」（AgentDecisionLog）

> **PoC简化**：实际内容组装逻辑复杂，PoC阶段可硬编码2-3套模板，根据缺口类型选择模板推送。

---

## Workflow 3：预测Agent风险预警

### 触发条件
- 定时触发：每天晚8:00
- 或 多维表格变更：LearningRecord 新增时触发

### 规则逻辑（硬编码阈值）

```python
def check_risk(user_id):
    user = get_user(user_id)
    records = get_recent_learning_records(user_id, days=7)
    
    # 规则1：连续3天未登录
    last_record = records[0] if records else None
    if last_record and (today - last_record.created_at).days >= 3:
        return "🔴", "连续3天未登录", "发送关怀消息+简化版课程"
    
    # 规则2：入职7天完成率<60%
    if (today - user.join_date).days <= 7:
        completion = calculate_completion_rate(records)
        if completion < 60:
            return "🔴", "入职7天完成率低于60%", "升级预警给直属领导"
    
    # 规则3：单日学习>4小时（疲劳预警）
    daily_duration = sum(r.duration_min for r in records if r.created_at.date() == today)
    if daily_duration > 240:  # 4小时
        return "🟡", "单日学习超过4小时", "Coach Agent 关怀消息"
    
    # 规则4：测评连续下降
    scores = [r.score for r in records if r.event_type == '能力测评']
    if len(scores) >= 2 and scores[-1] < scores[-2] * 0.8:
        return "🟡", "测评得分连续下降", "通知导师+标记关注名单"
    
    return "🟢", "正常", None
```

### 飞书应用引擎配置

1. 创建 Workflow「风险预警巡检」
2. 触发器：「定时触发」→ 每天 20:00
3. 动作节点：
   - 节点1：「查询记录」（User表，所有在职学员）
   - 节点2：「循环」
     - 子节点1：「查询记录」（LearningRecord，最近7天）
     - 子节点2：「条件分支」（应用上述4条规则）
       - 🟢正常 → 跳过
       - 🟡关注 → 「发送消息」（学员关怀）+ 「更新记录」（User.risk_level = 🟡）
       - 🔴需干预 → 「发送消息」（学员+导师+HR）+ 「更新记录」（User.risk_level = 🔴）
     - 子节点3：「创建记录」（AgentDecisionLog）

---

## Workflow 4：季度评估启动

### 触发条件
- 定时触发：每季度第1周的周一 9:00
- Cron（Q2为例）：`0 9 1 4,7,10,1 *`（简化版：手动触发）

### 执行步骤

```
Step 1: 创建评估记录
  └─ 对每个在职学员：
     └─ 在 QuarterlyReview 表新增：
        ├─ review_id: 自动生成
        ├─ quarter: 当前季度（如 2026Q2）
        ├─ user_id: 学员ID
        ├─ agent_data_score: 自动计算（从User.skill_*和LearningRecord汇总）
        ├─ work_data_score: 自动计算（项目数、返工率等）
        └─ status: pending

Step 2: 发送自评通知
  └─ 接收人：学员
  └─ 内容：「Q2季度评估开始，请先完成自评」
  └─ 附带：自评问卷链接（飞书问卷）

Step 3: 等待自评完成（Webhook或定时检查）
  └─ 当 QuarterlyReview.status 变为 self_done：
     └─ 触发导师评价审批流

Step 4: 创建导师评价审批
  └─ 飞书审批流：
     ├─ 申请人：系统
     ├─ 审批人：导师
     ├─ 内容：学员能力雷达图 + Agent数据 + 学员自评摘要
     └─ 审批表单：导师评分（6维度1-5星）+ 综合评价 + 推荐语

Step 5: 审批完成后自动计算总分
  └─ final_score = self_score × 0.25 + mentor_score × 0.50 + agent_data_score × 0.125 + work_data_score × 0.125
  └─ 更新 QuarterlyReview.status = completed
  └─ 发送季度成长报告（飞书消息）给学员+导师+HR

Step 6: 检查晋升条件
  └─ 如果 final_score 达到下一等级门槛：
     └─ 触发等级认证申请（Workflow 5）
```

---

## Workflow 5：等级认证申请

### 触发条件
- Workflow 4 完成后，自动检查
- 或 学员手动申请

### 执行步骤

```
Step 1: Agent自动评估
  └─ 检查 User 表：
     ├─ 能力雷达图平均分 ≥ 目标等级要求
     ├─ 独立完成项目数 ≥ 目标数量
     ├─ 带教记录时长 ≥ 目标时长（L3/L4）
     └─ 能力图谱状态 = "已发布"（v4.1新增校验）

Step 2: 如果不达标
  └─ 发送「预备晋升提醒」给导师
  └─ 不创建晋升申请

Step 3: 如果达标
  └─ 创建 LevelCertification 记录（status = 申请中）
  └─ 创建飞书审批流：
     ├─ 学员申请 → 导师推荐 → 能力图谱自动校验 → HR审核
     └─ 审批表单：导师推荐语、委员会审核意见

Step 4: 审批通过后
  └─ 更新 User.level = 新等级
  └─ 更新 LevelCertification.status = 已通过
  └─ 发送飞书公告（全公司可见）
  └─ 触发导师积分奖励（Workflow 6）
```

---

## Workflow 6：导师积分自动累计

### 触发条件
- 多维表格变更：MentorSession 新增 → 辅导1小时
- 多维表格变更：AgentDecisionLog 新增（预审通过）
- 多维表格变更：CaseStudy 新增（审核通过）
- 多维表格变更：LevelCertification 更新（status = 已通过）

### 执行步骤

```
Step 1: 识别积分事件
  └─ 根据触发源确定积分规则：
     ├─ 辅导1小时 → +10分
     ├─ Agent预审通过1次 → +2分
     ├─ 案例拆解1个 → +20分
     └─ 学员晋升 → +50分

Step 2: 创建积分记录
  └─ 在 MentorPointsHistory 表新增：
     ├─ mentor_id
     ├─ action_type
     ├─ points_delta
     ├─ source_table / source_id
     └─ created_at

Step 3: 更新导师总积分
  └─ 更新 MentorPoints.points_total += points_delta
  └─ 更新 MentorPoints.points_month += points_delta
  └─ 重新计算 MentorPoints.rank_month（飞书自动化排序）

Step 4: 发送积分变动通知
  └─ 飞书机器人私信导师：
     "🎉 积分变动通知
      你因【辅导小夏1小时】获得 +10 积分
      当前总积分：286 分（本月排名 #3）"
```

---

## PoC 阶段 Workflow 优先级

| 优先级 | Workflow | 复杂度 | PoC必须？ |
|--------|---------|--------|----------|
| P0 | Workflow 1 学员入职初始化 | 低 | ✅ 是 |
| P0 | Workflow 2 每日学习套餐推送 | 中 | ✅ 是 |
| P0 | Workflow 3 预测Agent风险预警 | 低 | ✅ 是 |
| P1 | Workflow 4 季度评估启动 | 中 | ⚠️ 简化版 |
| P1 | Workflow 5 等级认证申请 | 中 | ⚠️ 简化版 |
| P2 | Workflow 6 导师积分自动累计 | 低 | ⚠️ 简化版 |

> **PoC策略**：P0必须完整实现；P1/P2可简化为「手动触发+单步演示」，证明设计可行性即可。

---

## 下一步

完成 Workflow 配置后：
- **Day 4**：接入百炼 LLM API（`04_llm_integration.py`）
- **Day 5**：联调测试 + 录制演示视频
