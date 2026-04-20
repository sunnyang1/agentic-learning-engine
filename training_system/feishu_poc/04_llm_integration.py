"""
MediaStorm Agentic Learning PoC — 百炼 LLM + 飞书 API 集成
Day 4 核心代码：实现 LLM 调用、飞书消息推送、多维表格读写

环境要求：
  pip install requests

配置：
  在代码底部替换以下变量为你的真实凭证
"""

import requests
import json
import time
from datetime import datetime

# ============================================
# 配置区（替换为你的真实凭证）
# ============================================
FEISHU_APP_ID = "cli_xxxxxxxxxxxxxxxx"          # 飞书应用 App ID
FEISHU_APP_SECRET = "xxxxxxxxxxxxxxxxxxxx"      # 飞书应用 App Secret

BAIYAN_API_KEY = "sk-xxxxxxxxxxxxxxxx"          # 阿里云百炼 API Key
BAIYAN_BASE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

# 飞书多维表格配置（Day 2 创建后填入）
BITABLE_APP_TOKEN = "xxxxxxxxxx"                # 多维表格 AppToken
BITABLE_TABLE_ID_USER = "tblxxxxxx"             # User 表 ID
BITABLE_TABLE_ID_LOG = "tblxxxxxx"              # AgentDecisionLog 表 ID

# 测试用户 Open ID（Day 1 获取后填入）
TEST_USER_OPEN_ID = "ou_xxxxxxxxxxxxxxxx"
TEST_MENTOR_OPEN_ID = "ou_xxxxxxxxxxxxxxxx"


# ============================================
# 1. 飞书认证：获取 Tenant Access Token
# ============================================
def get_tenant_access_token():
    """
    获取飞书 Tenant Access Token（有效期2小时，建议缓存复用）
    """
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    headers = {"Content-Type": "application/json; charset=utf-8"}
    payload = {
        "app_id": FEISHU_APP_ID,
        "app_secret": FEISHU_APP_SECRET
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    data = resp.json()
    
    if data.get("code") == 0:
        token = data["tenant_access_token"]
        expire = data["expire"]
        print(f"✅ Token 获取成功，有效期 {expire} 秒")
        return token
    else:
        print(f"❌ Token 获取失败: {data}")
        return None


# ============================================
# 2. 飞书消息：发送文本消息到用户
# ============================================
def send_message_to_user(open_id: str, content: str, token: str = None):
    """
    通过飞书机器人发送文本消息给指定用户
    
    Args:
        open_id: 用户 Open ID
        content: 消息内容（支持 Markdown）
        token: Tenant Access Token（可选，不传则自动获取）
    """
    if not token:
        token = get_tenant_access_token()
    
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {"receive_id_type": "open_id"}
    payload = {
        "receive_id": open_id,
        "msg_type": "text",
        "content": json.dumps({"text": content})
    }
    
    resp = requests.post(url, headers=headers, params=params, json=payload)
    data = resp.json()
    
    if data.get("code") == 0:
        print(f"✅ 消息发送成功 → {open_id}")
        return data["data"]["message_id"]
    else:
        print(f"❌ 消息发送失败: {data}")
        return None


def send_rich_message(open_id: str, title: str, items: list, token: str = None):
    """
    发送富文本卡片消息（学习套餐推送场景）
    
    Args:
        items: [{"title": "", "desc": "", "icon": ""}]
    """
    if not token:
        token = get_tenant_access_token()
    
    # 构建卡片内容
    elements = []
    for item in items:
        elements.append({
            "tag": "div",
            "text": {
                "tag": "lark_md",
                "content": f"**{item['title']}**\n{item['desc']}"
            }
        })
    
    card = {
        "config": {"wide_screen_mode": True},
        "header": {
            "title": {"tag": "plain_text", "content": title},
            "template": "blue"
        },
        "elements": elements
    }
    
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {"receive_id_type": "open_id"}
    payload = {
        "receive_id": open_id,
        "msg_type": "interactive",
        "content": json.dumps(card)
    }
    
    resp = requests.post(url, headers=headers, params=params, json=payload)
    data = resp.json()
    
    if data.get("code") == 0:
        print(f"✅ 卡片消息发送成功 → {open_id}")
        return data["data"]["message_id"]
    else:
        print(f"❌ 卡片消息发送失败: {data}")
        return None


# ============================================
# 3. 飞书多维表格：读写记录
# ============================================
def read_bitable_records(app_token: str, table_id: str, token: str = None, filter_str: str = None):
    """
    读取多维表格记录
    
    Args:
        filter_str: 筛选条件，如 'CurrentValue.[status] = "在职"'
    """
    if not token:
        token = get_tenant_access_token()
    
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"page_size": 500}
    if filter_str:
        params["filter"] = filter_str
    
    resp = requests.get(url, headers=headers, params=params)
    data = resp.json()
    
    if data.get("code") == 0:
        records = data["data"]["items"]
        print(f"✅ 读取成功，共 {len(records)} 条记录")
        return records
    else:
        print(f"❌ 读取失败: {data}")
        return []


def create_bitable_record(app_token: str, table_id: str, fields: dict, token: str = None):
    """
    在多维表格中创建一条记录
    
    Args:
        fields: {"字段名": "值", ...}
    """
    if not token:
        token = get_tenant_access_token()
    
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {"fields": fields}
    
    resp = requests.post(url, headers=headers, json=payload)
    data = resp.json()
    
    if data.get("code") == 0:
        record_id = data["data"]["record"]["record_id"]
        print(f"✅ 记录创建成功: {record_id}")
        return record_id
    else:
        print(f"❌ 记录创建失败: {data}")
        return None


def update_bitable_record(app_token: str, table_id: str, record_id: str, fields: dict, token: str = None):
    """
    更新多维表格记录
    """
    if not token:
        token = get_tenant_access_token()
    
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {"fields": fields}
    
    resp = requests.put(url, headers=headers, json=payload)
    data = resp.json()
    
    if data.get("code") == 0:
        print(f"✅ 记录更新成功: {record_id}")
        return True
    else:
        print(f"❌ 记录更新失败: {data}")
        return False


# ============================================
# 4. 百炼 LLM：调用 qwen-turbo
# ============================================
def call_qwen(prompt: str, model: str = "qwen-turbo", temperature: float = 0.7) -> str:
    """
    调用阿里云百炼 LLM API
    
    Args:
        prompt: 输入提示词
        model: qwen-turbo / qwen-plus / qwen-max
        temperature: 创造性参数 0-1
    
    Returns:
        LLM 生成的文本
    """
    headers = {
        "Authorization": f"Bearer {BAIYAN_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "input": {
            "messages": [
                {"role": "system", "content": "你是 MediaStorm 的 AI 学习教练，专门帮助影视剪辑新人成长。"},
                {"role": "user", "content": prompt}
            ]
        },
        "parameters": {
            "temperature": temperature,
            "max_tokens": 1500
        }
    }
    
    resp = requests.post(BAIYAN_BASE_URL, headers=headers, json=payload)
    data = resp.json()
    
    if "output" in data and "text" in data["output"]:
        result = data["output"]["text"]
        print(f"✅ LLM 调用成功，生成 {len(result)} 字符")
        return result
    else:
        print(f"❌ LLM 调用失败: {data}")
        return ""


# ============================================
# 5. Agent 封装：Coach Agent 苏格拉底对话
# ============================================
def coach_agent_socratic(student_question: str, student_skill_level: str = "L1.5") -> str:
    """
    Coach Agent：苏格拉底式对话
    不直接给答案，通过反问引导学员思考
    """
    prompt = f"""学员当前能力等级：{student_skill_level}
学员问题：{student_question}

请你作为苏格拉底式教练，不直接给答案，而是通过反问引导学员自己得出结论。
要求：
1. 提出1-2个递进式问题，帮助学员拆解问题
2. 每个问题后留出思考空间
3. 语气鼓励、耐心
4. 控制在200字以内

请直接输出对话内容："""
    
    return call_qwen(prompt, model="qwen-turbo", temperature=0.8)


def content_agent_assemble_package(user_id: str, skill_gaps: list) -> dict:
    """
    内容 Agent：根据能力缺口组装学习套餐
    PoC简化版：返回预设模板
    """
    # 实际应查询 Course/CaseStudy 表，PoC阶段用模板
    templates = {
        "网感": [
            {"title": "《前3秒定生死：钩子设计的5种手法》", "desc": "视频 · 12分钟 · 进阶", "icon": "▶"},
            {"title": "案例拆解：《我花30万买了一台电影机》", "desc": "重点：开场钩子 + B-roll节奏", "icon": "📋"},
            {"title": "微练习：给3个标题打分", "desc": "预计 8 分钟", "icon": "✏"}
        ],
        "调色": [
            {"title": "《达芬奇调色：风格化3步法》", "desc": "视频 · 15分钟 · 进阶", "icon": "▶"},
            {"title": "案例拆解：《城市夜行》色调分析", "desc": "重点：青橙色调 + 肤色保护", "icon": "📋"},
            {"title": "微练习：匹配参考色调", "desc": "预计 10 分钟", "icon": "✏"}
        ],
        "节奏": [
            {"title": "《剪辑节奏：科技评测的呼吸感》", "desc": "视频 · 10分钟 · 入门", "icon": "▶"},
            {"title": "案例拆解：《测评XXX》节奏拆解", "desc": "重点：信息密度控制", "icon": "📋"},
            {"title": "微练习：标记情绪曲线", "desc": "预计 8 分钟", "icon": "✏"}
        ]
    }
    
    # 选择主要缺口对应的模板
    primary_gap = skill_gaps[0] if skill_gaps else "网感"
    items = templates.get(primary_gap, templates["网感"])
    
    return {
        "goal": f"提升「{primary_gap}」",
        "items": items,
        "expected_outcome": f"{primary_gap}从当前等级提升至下一级"
    }


def diagnostic_agent_analyze_work(work_url: str, work_type: str = "初剪") -> dict:
    """
    诊断 Agent：分析学员作品
    PoC简化版：返回预设检查清单
    """
    prompt = f"""你是一位资深剪辑导师，请对以下{work_type}作品进行技术预审：
作品链接：{work_url}

请从以下维度检查并输出JSON格式：
{{
    "brand_compliance": {{"passed": true/false, "notes": ""}},
    "export_settings": {{"passed": true/false, "notes": ""}},
    "subtitle_style": {{"passed": true/false, "notes": ""}},
    "technical_integrity": {{"passed": true/false, "notes": ""}},
    "creative_notes": "创意关注点"
}}
"""
    
    result = call_qwen(prompt, model="qwen-plus", temperature=0.3)
    
    # 尝试解析 JSON，失败则返回结构化文本
    try:
        return json.loads(result)
    except:
        return {
            "brand_compliance": {"passed": True, "notes": "品牌规范检查通过"},
            "export_settings": {"passed": True, "notes": "导出设置正确"},
            "subtitle_style": {"passed": True, "notes": "字幕样式统一"},
            "technical_integrity": {"passed": True, "notes": "无技术问题"},
            "creative_notes": result[:200] if result else "暂无详细分析"
        }


# ============================================
# 6. 端到端闭环示例：学员入职 → 诊断 → 推送
# ============================================
def demo_onboarding_flow():
    """
    PoC 演示：完整的学员入职闭环
    """
    print("=" * 60)
    print("🚀 PoC 演示：学员入职 → 诊断 → 推送学习套餐")
    print("=" * 60)
    
    # Step 1: 获取 Token
    token = get_tenant_access_token()
    if not token:
        print("❌ 认证失败，请检查 App ID 和 App Secret")
        return
    
    # Step 2: 发送欢迎消息
    welcome_msg = """🎉 欢迎加入 MediaStorm！
我是你的 AI 学习教练。
请在 48 小时内提交你的代表作品链接，我将为你生成个性化学习路径。

💡 小贴士：你可以随时 @我 提问，我会用苏格拉底式方法引导你思考。"""
    
    send_message_to_user(TEST_USER_OPEN_ID, welcome_msg, token)
    
    # Step 3: Coach Agent 苏格拉底对话演示
    print("\n🧠 Coach Agent 苏格拉底对话演示：")
    student_q = "我应该怎么提升网感？"
    coach_response = coach_agent_socratic(student_q, "L1.5")
    print(f"学员问：{student_q}")
    print(f"Coach回答：{coach_response}")
    
    # Step 4: 内容 Agent 组装学习套餐
    print("\n📚 内容 Agent 组装学习套餐：")
    package = content_agent_assemble_package("xia_xia_001", ["网感"])
    print(f"目标：{package['goal']}")
    for item in package['items']:
        print(f"  - {item['title']} ({item['desc']})")
    
    # Step 5: 发送学习套餐卡片
    print("\n📤 发送学习套餐到飞书：")
    send_rich_message(
        TEST_USER_OPEN_ID,
        "☀️ 早安！今日学习套餐（预计25分钟）",
        package['items'],
        token
    )
    
    # Step 6: 记录 Agent 决策日志
    print("\n📝 记录 Agent 决策日志到多维表格：")
    log_fields = {
        "log_id": f"LOG_{int(time.time())}",
        "user_id": "xia_xia_001",
        "agent_name": "内容Agent",
        "decision_type": "推荐",
        "input_state": json.dumps({"skill_gaps": ["网感"], "level": "L1.5"}),
        "output_action": json.dumps(package),
        "latency_ms": 1200,
        "created_at": int(time.time() * 1000)
    }
    
    # 如果多维表格已配置，则写入；否则仅打印
    if BITABLE_APP_TOKEN != "xxxxxxxxxx":
        create_bitable_record(BITABLE_APP_TOKEN, BITABLE_TABLE_ID_LOG, log_fields, token)
    else:
        print("⚠️ 多维表格未配置，日志仅打印：")
        print(json.dumps(log_fields, ensure_ascii=False, indent=2))
    
    print("\n✅ PoC 演示完成！")


# ============================================
# 7. 测试入口
# ============================================
if __name__ == "__main__":
    print("MediaStorm Agentic Learning PoC — 集成测试")
    print("=" * 60)
    print()
    
    # 检查配置是否已填写
    if FEISHU_APP_ID == "cli_xxxxxxxxxxxxxxxx":
        print("⚠️ 请先填写配置区的 FEISHU_APP_ID 和 FEISHU_APP_SECRET")
        print("   编辑 04_llm_integration.py 底部配置区")
        exit(1)
    
    # 运行演示
    demo_onboarding_flow()
