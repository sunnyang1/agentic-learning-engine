# 飞书 PoC 搭建指南 — Day 1

> **目标**：注册飞书免费企业版 → 开通开发者权限 → 验证基础能力
> **预计时间**：2-3 小时
> **产出**：可发送飞书消息、可读写多维表格的测试环境

---

## 步骤 1：注册飞书免费企业版（10分钟）

1. 访问 [https://www.larksuite.com/zh_cn/download](https://www.larksuite.com/zh_cn/download) 或 [https://www.feishu.cn](https://www.feishu.cn)
2. 点击「免费使用」→ 用手机号注册
3. **关键**：创建企业时选择「企业/组织」类型（非个人），名称可填 `MediaStorm-POC-Test`
4. 完成企业认证（个人开发者无需营业执照，选择"其他组织"即可）
5. 下载飞书客户端（PC端），用管理员账号登录

> **验证**：登录后左下角显示「管理后台」入口，即为管理员

---

## 步骤 2：开通开发者权限（20分钟）

### 2.1 进入开发者中心

1. 飞书管理后台 → 左侧菜单「开发者平台」→「开发者中心」
2. 点击「创建企业自建应用」
3. 填写应用信息：
   - 应用名称：`AgenticLearning-POC`
   - 应用描述：`MediaStorm新人培训系统PoC`
   - 应用头像：可留空或上传任意图片

### 2.2 配置应用权限

进入应用详情页 →「权限管理」，申请以下权限：

| 权限 | 用途 |
|------|------|
| `im:message` | 发送消息到飞书会话 |
| `im:message:send_as_bot` | 以机器人身份发送消息 |
| `bitable:app` | 访问多维表格 |
| `bitable:record` | 读写多维表格记录 |
| `approval:instance` | 创建审批实例（用于季度评价） |
| `contact:user.base` | 读取用户基本信息 |

> 点击「批量申请」→ 提交审核 → **自建应用自动通过，无需等待**

### 2.3 获取 App ID 和 App Secret

进入应用详情页 →「凭证与基础信息」：

```
App ID:     cli_xxxxxxxxxxxxxxxx    ← 复制保存
App Secret: xxxxxxxxxxxxxxxxxxxx    ← 点击显示，复制保存（仅显示一次）
```

**保存到安全位置**，后续所有API调用都需要这两个值。

---

## 步骤 3：创建测试用户（10分钟）

1. 飞书管理后台 →「组织架构」→「成员与部门」
2. 添加两个测试用户：
   - **学员**：姓名`小夏`，手机号用自己的小号或亲友号
   - **导师**：姓名`阿杰`，手机号用另一个号
3. 在飞书客户端中搜索这两个用户，发送消息确认可通信

---

## 步骤 4：创建第一个多维表格（30分钟）

### 4.1 创建表格

1. 飞书客户端 → 左侧「多维表格」→「新建多维表格」
2. 命名：`AgenticLearning_User`
3. 点击右上角「...」→「扩展功能」→ 确认已开启

### 4.2 配置字段

按 `02_base_schema.json` 中的定义，创建以下字段：

| 字段名 | 字段类型 | 选项/说明 |
|--------|---------|----------|
| user_id | 文本 | 唯一标识，如 `xia_xia_001` |
| name | 文本 | 姓名 |
| role | 单选 | 剪辑师 / 编导 / 摄影师 / 制片 |
| level | 单选 | L1助理 / L2铜牌 / L3银牌 / L4金牌 |
| join_date | 日期 | 入职日期 |
| mentor_id | 文本 | 导师的user_id |
| status | 单选 | 在职 / 离职 / 实习 |
| risk_level | 单选 | 🟢正常 / 🟡关注 / 🔴需干预 |
| skill_tech | 数字 | 技术能力 0-5 |
| skill_aesthetic | 数字 | 审美能力 0-5 |
| skill_content | 数字 | 内容理解 0-5 |
| skill_collab | 数字 | 协作能力 0-5 |
| skill_narrative | 数字 | 叙事逻辑 0-5 |
| skill_color | 数字 | 调色能力 0-5 |

### 4.3 录入测试数据

添加 2-3 条测试数据：

```
user_id: xia_xia_001
name: 小夏
role: 剪辑师
level: L2铜牌
join_date: 2025-08-15
mentor_id: a_jie_001
status: 在职
risk_level: 🟢正常
skill_tech: 3.2
skill_aesthetic: 2.8
skill_content: 2.5
skill_collab: 3.5
skill_narrative: 2.6
skill_color: 2.4
```

---

## 步骤 5：验证 API 调用（30分钟）

### 5.1 获取 Tenant Access Token

使用 `04_llm_integration.py` 中的 `get_tenant_access_token()` 函数：

```bash
# 安装依赖
pip install requests

# 运行测试脚本
python 04_llm_integration.py
```

如果返回 `tenant_access_token`，说明权限配置正确。

### 5.2 读取多维表格数据

运行脚本中的 `read_bitable_records()` 测试：

```python
app_token = "你的多维表格AppToken"  # 从多维表格URL中获取
records = read_bitable_records(app_token, "tblXXXX", "你的token")
print(records)
```

> **获取 AppToken**：打开多维表格 → 地址栏 URL 中 `https://xxx.feishu.cn/base/xxxxxx` 的 `xxxxxx` 部分

### 5.3 发送第一条机器人消息

运行脚本中的 `send_message_to_user()` 测试：

```python
send_message_to_user("小夏的open_id", "🤖 你好！我是你的AI学习教练。", "你的token")
```

> **获取 open_id**：在飞书客户端中 @该用户 → 右键复制链接 → 链接中包含 open_id

---

## 步骤 6：配置飞书机器人（可选，20分钟）

1. 应用详情页 →「机器人」→ 开启机器人能力
2. 设置机器人名称：`AI学习教练`
3. 设置机器人头像（可选）
4. 在飞书客户端中搜索该机器人 → 开始对话
5. 测试：发送任意消息 → 机器人应回复默认欢迎语

> **事件订阅配置**（Day 2-3 需要）：
> - 应用详情页 →「事件与回调」→ 配置请求地址
> - 需要一个公网可访问的URL（可用 ngrok 或阿里云函数计算）
> - Day 1 可先跳过，手动触发测试

---

## Day 1 验收清单

| 检查项 | 状态 |
|--------|------|
| ✅ 飞书免费企业版注册完成 | |
| ✅ 自建应用 `AgenticLearning-POC` 创建完成 | |
| ✅ App ID 和 App Secret 已保存 | |
| ✅ 所需权限已申请并通过 | |
| ✅ 测试用户（小夏、阿杰）已创建 | |
| ✅ 多维表格 `AgenticLearning_User` 已创建并含测试数据 | |
| ✅ API 调用成功（读取表格 + 发送消息） | |
| ✅ 机器人已开启并可用 | |

---

## 常见问题

**Q: 飞书免费版有什么限制？**
A: 50人以下、部分高级功能（如高级Workflow、大量API调用）受限。但对于PoC完全够用。

**Q: App Secret 丢失了怎么办？**
A: 应用详情页 →「凭证与基础信息」→ 点击「重置」生成新的 Secret。

**Q: 多维表格的 AppToken 在哪里找？**
A: 打开多维表格 → 看浏览器地址栏 → `https://xxx.feishu.cn/base/AbCdEfG` → `AbCdEfG` 就是 AppToken。

**Q: 需要域名/服务器吗？**
A: Day 1 不需要。Day 2-3 配置事件订阅时需要公网URL，可用 ngrok（免费）或阿里云函数计算。

---

## 下一步

完成 Day 1 后，继续：
- **Day 2**：搭建完整多维表格体系（`02_base_schema.json` 中定义的所有表）
- **Day 3**：创建核心 Workflow（`03_workflow_logic.md`）
- **Day 4**：接入百炼 LLM（`04_llm_integration.py`）
- **Day 5**：联调测试 + 录制演示视频
