# 飞书机器人配置指南 — Day 1-2

> **目标**：配置飞书机器人，实现消息推送和对话交互
> **预计时间**：30-60 分钟

---

## 一、开启机器人能力

1. 进入你的自建应用详情页：`AgenticLearning-POC`
2. 左侧菜单 →「机器人」→ 开启「机器人能力」
3. 配置：
   - 机器人名称：`AI学习教练`
   - 机器人描述：`MediaStorm新人培训的AI学习伴侣`
   - 可见范围：**全部成员**（或指定测试成员）

---

## 二、配置事件订阅（接收用户消息）

### 2.1 配置请求地址

1. 应用详情页 →「事件与回调」→ 请求地址配置
2. 需要填写一个 **公网可访问的 HTTPS URL**

**方案A：ngrok（本地开发，免费）**
```bash
# 安装 ngrok
brew install ngrok  # macOS

# 注册账号获取 authtoken：https://ngrok.com
ngrok config add-authtoken YOUR_TOKEN

# 启动 tunnel（假设本地服务跑在 5000 端口）
ngrok http 5000

# 终端会显示：https://xxxx.ngrok-free.app → 这就是你的请求地址
```

**方案B：阿里云函数计算（推荐，稳定）**
```bash
# 创建 HTTP 函数
# 教程：https://help.aliyun.com/document_detail/73329.html
# 函数代码参考：见下方「最小事件接收服务」
```

**方案C：飞书捷径（最简单，但功能有限）**
- 如果不需要复杂交互，可用飞书捷径替代代码

### 2.2 配置事件类型

在「事件与回调」中订阅以下事件：

| 事件 | 用途 |
|------|------|
| `im.message.receive_v1` | 接收用户发送给机器人的消息 |
| `approval.instance.status_change_v1` | 审批状态变更（用于季度评价） |

### 2.3 配置 Encrypt Key（可选但推荐）

1. 在「事件与回调」中生成 Encrypt Key
2. 保存到配置文件，用于验证飞书推送的合法性

---

## 三、最小事件接收服务（Python Flask）

```python
from flask import Flask, request, jsonify
import hashlib
import json

app = Flask(__name__)

# 配置（替换为你的真实值）
ENCRYPT_KEY = "your-encrypt-key"
VERIFICATION_TOKEN = "your-verification-token"

@app.route('/feishu/webhook', methods=['POST'])
def feishu_webhook():
    data = request.json
    
    # 1. URL 验证（首次配置请求地址时）
    if data.get("type") == "url_verification":
        return jsonify({"challenge": data["challenge"]})
    
    # 2. 处理消息事件
    event = data.get("event", {})
    
    if event.get("type") == "im.message.receive_v1":
        message = event["message"]
        sender = event["sender"]["sender_id"]["open_id"]
        content = json.loads(message["content"])
        text = content.get("text", "")
        
        print(f"收到消息 from {sender}: {text}")
        
        # 路由到不同 Agent
        if "网感" in text or "调色" in text or "节奏" in text:
            # 路由到 Coach Agent
            response = coach_agent_socratic(text)
        elif "套餐" in text or "学习" in text:
            # 路由到内容 Agent
            pkg = content_agent_assemble_package(sender, ["网感"])
            response = f"今日套餐：{pkg['goal']}"
        else:
            response = "我是你的AI学习教练 💡\n你可以问我：\n• 网感/调色/节奏相关问题\n• 今日学习套餐\n• 能力评估"
        
        # 回复用户
        send_message_to_user(sender, response)
    
    return jsonify({"code": 0})

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 四、测试机器人

### 4.1 基础测试

1. 在飞书客户端搜索 `AI学习教练`
2. 点击「开始使用」
3. 发送任意消息
4. 检查是否收到回复

### 4.2 测试用例

| 测试 | 输入 | 预期输出 |
|------|------|---------|
| 欢迎语 | `你好` | 自我介绍 + 可用功能列表 |
| Coach对话 | `怎么提升网感？` | 苏格拉底式反问，不直接给答案 |
| 内容推送 | `今日学习套餐` | 个性化套餐卡片 |
| 关怀提醒 | （系统触发） | 疲劳/卡顿/未登录预警消息 |

---

## 五、机器人消息模板

### 5.1 学习套餐卡片

```json
{
  "config": {"wide_screen_mode": true},
  "header": {
    "title": {"tag": "plain_text", "content": "☀️ 早安！今日学习套餐"},
    "template": "blue"
  },
  "elements": [
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "**🎯 核心目标：提升「网感」**\n预计 25 分钟"
      }
    },
    {
      "tag": "hr"
    },
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "▶ **《前3秒定生死：钩子设计的5种手法》**\n视频 · 12分钟 · 进阶"
      }
    },
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "📋 **案例拆解：《我花30万买了一台电影机》**\n重点：开场钩子 + B-roll节奏"
      }
    },
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "✏ **微练习：给3个标题打分**\n预计 8 分钟"
      }
    },
    {
      "tag": "note",
      "elements": [
        {
          "tag": "plain_text",
          "content": "💡 为什么推荐这些？你上周在「网感」测试中得分72，距离目标80还有差距。"
        }
      ]
    },
    {
      "tag": "action",
      "actions": [
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "开始学习"},
          "type": "primary",
          "value": {"action": "start_learning"}
        },
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "调整时间"},
          "type": "default",
          "value": {"action": "adjust_time"}
        }
      ]
    }
  ]
}
```

### 5.2 风险预警卡片

```json
{
  "config": {"wide_screen_mode": true},
  "header": {
    "title": {"tag": "plain_text", "content": "⚠️ 关怀提醒"},
    "template": "orange"
  },
  "elements": [
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "我注意到你昨天在《达芬奇调色》模块停留了 **45 分钟**，平均学员只用 15 分钟。\n\n是不是遇到瓶颈了？"
      }
    },
    {
      "tag": "action",
      "actions": [
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "查看简化流程"},
          "type": "primary",
          "value": {"action": "view_simplified"}
        },
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "我没事，继续学"},
          "type": "default",
          "value": {"action": "continue"}
        }
      ]
    }
  ]
}
```

### 5.3 季度评估通知

```json
{
  "config": {"wide_screen_mode": true},
  "header": {
    "title": {"tag": "plain_text", "content": "📝 Q2 季度评估开始"},
    "template": "blue"
  },
  "elements": [
    {
      "tag": "div",
      "text": {
        "tag": "lark_md",
        "content": "请先完成自评问卷，你的自评将占总评的 **25%**。\n\n📊 Agent 已为你汇总了本季度的客观数据：\n• 完成项目：3 个\n• 课程完成率：87%\n• 平均学习时长：35 分钟/天"
      }
    },
    {
      "tag": "action",
      "actions": [
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "开始自评"},
          "type": "primary",
          "value": {"action": "start_self_review"}
        }
      ]
    }
  ]
}
```

---

## 六、下一步

机器人配置完成后：
1. **Day 3**：将机器人接入 Workflow（`03_workflow_logic.md`）
2. **Day 4**：接入百炼 LLM（`04_llm_integration.py`）
3. **Day 5**：完整联调 + 录制演示视频
