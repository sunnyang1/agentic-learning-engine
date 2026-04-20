/* ============================================
   MediaStorm Agentic Learning — Interactive Prototype
   ============================================ */

const PAGES = {
  student: [
    { id: 'student-chat', name: '💬 飞书消息流', type: 'mobile',
      desc: '学员核心入口。每日早9点 Content Agent 推送个性化学习套餐，预测 Agent 触发关怀消息，Coach Agent 发起苏格拉底对话。所有交互通过飞书消息完成，学员无需打开额外系统。' },
    { id: 'student-coach', name: '🧠 Coach 对话', type: 'mobile',
      desc: 'Coach Agent 苏格拉底式对话界面。Agent 不直接给答案，通过反问引导学员思考。支持实时纠错、引导式复盘。对话深度由 Agent 根据学员能力动态调整。' },
    { id: 'student-profile', name: '📊 成长中心', type: 'mobile',
      desc: '学员按需查看的成长数据。包含能力雷达图（实时更新）、学习历史、Agent 预测的未来成长轨迹、成就徽章系统。数据由 Agent 自动维护，无需手动打卡。' },
    { id: 'student-tasks', name: '🎯 当前任务', type: 'mobile',
      desc: 'Agent 组装的动态任务列表。非固定课程，而是根据学员当前能力、项目、时间约束实时生成的「微练习+挑战+反馈」组合。' },
    { id: 'student-self-review', name: '📝 季度自评', type: 'mobile',
      desc: '季度360度评估的学员自评环节。学员对各能力维度进行1-5分自评，撰写成长总结。数据写入 QuarterlyReview 表，自动汇总到最终评分（权重25%）。' },
    { id: 'student-certification', name: '🏅 等级认证', type: 'mobile',
      desc: '学员查看当前等级（L1-L4）、晋升进度、特权体系和认证历史。Agent 自动评估达标状态时触发晋升提醒，导师推荐后进入委员会审核。' }
  ],
  mentor: [
    { id: 'mentor-dashboard', name: '📋 Agent 辅助看板', type: 'desktop',
      desc: '导师核心工作台。展示所有学员的 Agent 预处理结果：已解答问题数、需导师判断的问题、风险预警列表。学员状态用 🟢🟡🔴 风险评级直观展示。' },
    { id: 'mentor-review', name: '✂️ 作品预审', type: 'desktop',
      desc: '人机协作评审界面。左侧展示 Agent 自动预审报告（技术检查通过/不通过项），右侧导师专注于创意层面点评。Agent 预审节省导师 30 分钟/次的基础检查时间。' },
    { id: 'mentor-evaluation', name: '📋 季度评价', type: 'desktop',
      desc: '导师对学员的季度360度评价界面。左侧展示学员能力雷达图（Agent数据自动汇总）和作品数据，右侧导师填写各维度评分、综合评价和推荐语。评价权重占50%。' },
    { id: 'mentor-points', name: '💎 导师积分', type: 'desktop',
      desc: '导师激励积分中心。展示当前积分、积分变动历史（辅导/预审/案例/学员晋升自动累计）、全公司导师排行榜、积分兑换入口（培训预算/调休/年度大奖提名）。' }
  ],
  manager: [
    { id: 'manager-insights', name: '📈 团队洞察', type: 'desktop',
      desc: '管理层全局视角。团队能力实时热力图、Agent 预警列表、人才梯队预测、培训 ROI 计算。数据由 Agent 自动汇总，无需人工统计。支持钻取到个人详情。' },
    { id: 'manager-assign', name: '🎯 智能派活', type: 'desktop',
      desc: '制片人 Lisa 的核心工具。输入项目类型+风格+难度，系统自动查询能力图谱，返回 3-5 位最佳匹配人员及匹配理由。支持一键确认派活、自动创建项目群。' }
  ],
  admin: [
    { id: 'admin-pending', name: '📝 Pending Pool', type: 'desktop',
      desc: 'AI 生成测试题的人工审核界面。课程变动 >30% 自动触发 AI 生成 6-12 题 → Pending Pool（Pending→In Review→Approved/Edit→Released）→ Owner 审阅。每道题标注 AI 考点来源和置信度。' }
  ]
};

const ROLE_LABELS = {
  student: '👤 学员端（新人剪辑师/编导）',
  mentor: '🎓 导师端（资深剪辑师/编导）',
  manager: '🏢 管理端（制片人/项目经理/Tim）',
  admin: '⚙️ 运营端（内容运营/HR/系统管理员）'
};

let currentRole = 'student';
let currentPage = 'student-chat';

/* ---------- Init ---------- */
function init() {
  renderRoleTabs();
  renderPageTabs();
  loadPage(currentPage);
}

/* ---------- Role Switch ---------- */
function switchRole(role) {
  currentRole = role;
  currentPage = PAGES[role][0].id;
  renderRoleTabs();
  renderPageTabs();
  loadPage(currentPage);
}

function renderRoleTabs() {
  document.querySelectorAll('.role-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.role === currentRole);
  });
}

/* ---------- Page Switch ---------- */
function switchPage(pageId) {
  currentPage = pageId;
  renderPageTabs();
  loadPage(pageId);
}

function renderPageTabs() {
  const container = document.getElementById('pageTabs');
  container.innerHTML = PAGES[currentRole].map(p =>
    `<button class="page-tab ${p.id === currentPage ? 'active' : ''}" onclick="switchPage('${p.id}')">${p.name}</button>`
  ).join('');
}

/* ---------- Load Page ---------- */
function loadPage(pageId) {
  const frame = document.getElementById('deviceFrame');
  const pageCfg = Object.values(PAGES).flat().find(p => p.id === pageId);

  frame.className = 'device-frame ' + (pageCfg.type === 'mobile' ? 'mobile' : 'desktop');
  frame.innerHTML = `<div class="device-content animate-in">${getPageHTML(pageId)}</div>`;

  updateInfoPanel(pageCfg);
}

function updateInfoPanel(cfg) {
  const panel = document.getElementById('pageInfo');
  panel.innerHTML = `
    <div class="info-section">
      <h4>📱 页面名称</h4>
      <p>${cfg.name}</p>
    </div>
    <div class="info-section">
      <h4>🎯 设计目标</h4>
      <p>${cfg.desc}</p>
    </div>
    <div class="info-section">
      <h4>👤 目标用户</h4>
      <p>${ROLE_LABELS[currentRole]}</p>
    </div>
    <div class="info-section">
      <h4>🔧 核心交互</h4>
      <ul>${getInteractions(currentPage)}</ul>
    </div>
    <div class="info-section">
      <h4>📐 设备规格</h4>
      <p>${cfg.type === 'mobile'
        ? '375 × 812 px（iPhone 尺寸，模拟飞书移动端消息流）'
        : '1280 × 800 px（桌面端，模拟飞书 PC 客户端/多维表格仪表盘）'}</p>
    </div>
    <div class="info-section">
      <h4>🔗 相关 Agent</h4>
      <p>${getRelatedAgents(currentPage)}</p>
    </div>
  `;
}

function getInteractions(pid) {
  const map = {
    'student-chat': '<li>点击学习卡片进入课程/练习</li><li>底部输入框与 Coach Agent 对话</li><li>接收每日自动推送的学习套餐</li><li>查看关怀提醒并选择响应</li>',
    'student-coach': '<li>发送问题触发苏格拉底对话</li><li>Agent 反问 → 学员回复 → 再追问</li><li>对话结束后自动更新能力图谱</li><li>查看思考深度评分和能力增长</li>',
    'student-profile': '<li>查看能力雷达图（6维度实时更新）</li><li>查看成长预测轨迹</li><li>点击徽章查看获取条件</li><li>查看学习历史时间线</li>',
    'student-tasks': '<li>点击任务卡片开始学习/练习</li><li>Agent 根据完成状态动态调整</li><li>查看本周挑战进度</li><li>查看导师反馈</li>',
    'student-self-review': '<li>拖动滑块对各能力维度自评（1-5分）</li><li>查看自评与Agent数据的差距提示</li><li>撰写季度成长总结</li><li>提交后触发导师评价审批流</li>',
    'student-certification': '<li>查看当前等级和晋升进度</li><li>了解下一级所需条件（能力/项目/带教）</li><li>查看已解锁特权和待解锁特权</li><li>查看历史认证记录和电子徽章</li>',
    'mentor-dashboard': '<li>点击学员卡片查看详情</li><li>点击预警项快速处理</li><li>查看 Agent 预处理周报</li><li>切换时间范围查看趋势</li>',
    'mentor-review': '<li>左侧查看 Agent 预审报告（技术检查）</li><li>右侧输入创意点评</li><li>勾选具体改进建议</li><li>一键提交评审结果</li>',
    'mentor-evaluation': '<li>左侧查看学员能力雷达和Agent数据汇总</li><li>右侧对各维度评分（1-5星）</li><li>填写综合评价和推荐语</li><li>提交后自动计算季度总分</li>',
    'mentor-points': '<li>查看当前积分和本月变动</li><li>查看积分明细（辅导/预审/案例/晋升）</li><li>查看全公司导师排行榜</li><li>点击兑换培训预算/调休/年度提名</li>',
    'manager-insights': '<li>查看团队能力热力图</li><li>点击风险预警查看详情</li><li>查看人才梯队预测</li><li>查看培训 ROI 数据</li>',
    'manager-assign': '<li>输入项目类型+风格+难度</li><li>查看系统推荐的最佳匹配人员</li><li>查看匹配理由和能力雷达对比</li><li>一键确认派活</li>',
    'admin-pending': '<li>点击题目查看 AI 生成详情</li><li>编辑题目内容</li><li>批量操作通过/拒绝</li><li>一键发布全部通过题目</li>'
  };
  return map[pid] || '<li>点击交互元素查看详情</li>';
}

function getRelatedAgents(pid) {
  const map = {
    'student-chat': '<span class="highlight">Content Agent</span>（推送学习套餐）、<span class="highlight">预测 Agent</span>（关怀提醒）、<span class="highlight">Orchestrator</span>（调度）',
    'student-coach': '<span class="highlight">Coach Agent</span>（苏格拉底对话）、<span class="highlight">诊断 Agent</span>（能力评估）、<span class="highlight">Memory</span>（上下文）',
    'student-profile': '<span class="highlight">诊断 Agent</span>（能力雷达）、<span class="highlight">预测 Agent</span>（成长预测）、<span class="highlight">Memory</span>（历史数据）',
    'student-tasks': '<span class="highlight">Content Agent</span>（路径组装）、<span class="highlight">实战 Agent</span>（任务触发）、<span class="highlight">Orchestrator</span>（调度）',
    'student-self-review': '<span class="highlight">QuarterlyReview</span>（数据模型）、<span class="highlight">诊断 Agent</span>（能力雷达对比）、<span class="highlight">飞书审批</span>（评价流程）',
    'student-certification': '<span class="highlight">LevelCertification</span>（等级状态）、<span class="highlight">诊断 Agent</span>（达标评估）、<span class="highlight">Orchestrator</span>（晋升触发）',
    'mentor-dashboard': '<span class="highlight">预测 Agent</span>（预警）、<span class="highlight">Coach Agent</span>（问题处理）、<span class="highlight">Orchestrator</span>（周报汇总）',
    'mentor-review': '<span class="highlight">诊断 Agent</span>（作品预审）、<span class="highlight">Memory</span>（历史作品数据）、<span class="highlight">Tool Registry</span>（评审工具）',
    'mentor-evaluation': '<span class="highlight">QuarterlyReview</span>（评估数据）、<span class="highlight">诊断 Agent</span>（能力数据汇总）、<span class="highlight">飞书审批</span>（评价提交）',
    'mentor-points': '<span class="highlight">MentorPoints</span>（积分统计）、<span class="highlight">MentorPointsHistory</span>（积分明细）、<span class="highlight">飞书机器人</span>（变动推送）',
    'manager-insights': '<span class="highlight">预测 Agent</span>（人才梯队）、<span class="highlight">诊断 Agent</span>（能力汇总）、<span class="highlight">Analytics Tools</span>（ROI计算）',
    'manager-assign': '<span class="highlight">诊断 Agent</span>（能力图谱查询）、<span class="highlight">预测 Agent</span>（负荷评估）、<span class="highlight">Project Tools</span>（项目创建）',
    'admin-pending': '<span class="highlight">AI Assessment Generator</span>（题目生成）、<span class="highlight">Orchestrator</span>（状态流转）、<span class="highlight">Content Tools</span>（课程内容分析）'
  };
  return map[pid] || '多个 Agent 协同工作';
}

/* ---------- Page HTML Generators ---------- */
function getPageHTML(pid) {
  const pages = {
    'student-chat': pageStudentChat(),
    'student-coach': pageStudentCoach(),
    'student-profile': pageStudentProfile(),
    'student-tasks': pageStudentTasks(),
    'student-self-review': pageStudentSelfReview(),
    'student-certification': pageStudentCertification(),
    'mentor-dashboard': pageMentorDashboard(),
    'mentor-review': pageMentorReview(),
    'mentor-evaluation': pageMentorEvaluation(),
    'mentor-points': pageMentorPoints(),
    'manager-insights': pageManagerInsights(),
    'manager-assign': pageManagerAssign(),
    'admin-pending': pageAdminPending()
  };
  return pages[pid] || `<div class="empty-state"><div class="icon">📄</div><p>页面内容加载中...</p></div>`;
}

/* ====== STUDENT: Chat (Mobile) ====== */
function pageStudentChat() {
  return `<div style="display:flex;flex-direction:column;height:100%;">
  <div class="chat-header">
    <div class="avatar" style="background:linear-gradient(135deg,var(--primary-500),var(--agent-diagnostic));">🤖</div>
    <div class="title">
      <h4>AI 学习教练</h4>
      <span class="status-online">● 在线</span>
    </div>
  </div>
  <div class="chat-body" style="flex:1;overflow-y:auto;">

    <!-- Welcome Message -->
    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--primary-500),var(--agent-diagnostic));">🤖</div>
      <div>
        <div class="msg-bubble">
          <strong>早安，小夏！</strong> ☀️<br><br>
          我是你的 AI 学习教练。今天有 <strong>2 个微练习</strong> 等你完成。<br><br>
          📋 <strong>今日学习套餐</strong>（预计 25 分钟）
          <div class="msg-card">
            <div class="msg-card-title">🎯 核心目标：提升「网感」</div>
            <div class="msg-card-body">
              <div class="list-item" style="padding:8px 0;">
                <div class="item-icon" style="background:var(--primary-50);color:var(--primary-500);font-size:16px;width:36px;height:36px;">▶</div>
                <div class="item-content">
                  <div class="item-title">《前3秒定生死：钩子设计的5种手法》</div>
                  <div class="item-desc">视频 · 12分钟 · 进阶</div>
                </div>
              </div>
              <div class="list-item" style="padding:8px 0;">
                <div class="item-icon" style="background:var(--warning-50);color:var(--warning-500);font-size:16px;width:36px;height:36px;">📋</div>
                <div class="item-content">
                  <div class="item-title">案例拆解：《我花30万买了一台电影机》</div>
                  <div class="item-desc">重点：开场钩子 + B-roll节奏</div>
                </div>
              </div>
              <div class="list-item" style="padding:8px 0;border:none;">
                <div class="item-icon" style="background:var(--agent-practice-light);color:var(--agent-practice);font-size:16px;width:36px;height:36px;">✏</div>
                <div class="item-content">
                  <div class="item-title">微练习：给3个标题打分</div>
                  <div class="item-desc">预计 8 分钟</div>
                </div>
              </div>
            </div>
            <div class="msg-card-actions">
              <button class="btn btn-primary btn-sm">开始学习</button>
              <button class="btn btn-secondary btn-sm">调整时间</button>
            </div>
          </div>
          <div style="margin-top:8px;font-size:12px;color:var(--gray-400);">
            💡 <strong>为什么推荐这些？</strong><br>
            你上周在「网感」测试中得分 72，距离目标 80 还有差距。这些内容专门针对你的短板设计。
          </div>
        </div>
        <div class="msg-time">09:00</div>
      </div>
    </div>

    <!-- Care Alert -->
    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-predictive),#FF9500);">⚠️</div>
      <div>
        <div class="msg-bubble">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span class="tag tag-orange">关怀提醒</span>
          </div>
          我注意到你昨天在《达芬奇调色》模块停留了 <strong>45 分钟</strong>，平均学员只用 15 分钟。<br><br>
          是不是遇到瓶颈了？我推荐了一个 <strong>5 分钟简化版流程</strong>，或许能帮你快速突破。
          <div class="msg-card-actions" style="margin-top:10px;">
            <button class="btn btn-primary btn-sm">查看简化流程</button>
            <button class="btn btn-secondary btn-sm">我没事，继续学</button>
          </div>
        </div>
        <div class="msg-time">昨天 20:15</div>
      </div>
    </div>

    <!-- User Reply -->
    <div class="msg-row user">
      <div class="msg-avatar" style="background:var(--primary-500);">夏</div>
      <div>
        <div class="msg-bubble">好的，我先看视频课程 👍</div>
        <div class="msg-time">09:05</div>
      </div>
    </div>

    <!-- Socratic Time -->
    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
      <div>
        <div class="msg-bubble">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span class="tag tag-purple">💬 苏格拉底时间</span>
          </div>
          学完课程后，我有个问题想和你讨论：<br><br>
          <em>"假设你要剪一条手机评测视频，前3秒画面是手机特写，没有台词。你觉得观众此刻在想什么？"</em><br><br>
          不用急着回答，慢慢想 🤔
        </div>
        <div class="msg-time">09:30</div>
      </div>
    </div>

    <!-- User thinking -->
    <div class="msg-row user">
      <div class="msg-avatar" style="background:var(--primary-500);">夏</div>
      <div>
        <div class="msg-bubble">嗯...可能在想"这是什么手机？值不值得看下去？"</div>
        <div class="msg-time">09:32</div>
      </div>
    </div>

    <!-- Coach response -->
    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
      <div>
        <div class="msg-bubble">
          🎉 <strong>完全正确！</strong><br><br>
          你自己得出了核心结论：<em>"前3秒必须制造悬念或冲击，否则观众会划走"</em><br><br>
          这比直接告诉你答案印象深刻得多。现在试着把这个思路应用到你的素材上？
          <div style="margin-top:10px;padding:10px;background:#F0FFF4;border-radius:8px;font-size:12px;color:var(--success-600);">
            ✅ 思考深度评分：8.5/10（优秀）<br>
            📈 网感理解 +0.3 级
          </div>
        </div>
        <div class="msg-time">09:33</div>
      </div>
    </div>

  </div>
  <div class="chat-input-bar">
    <input type="text" placeholder="输入消息...">
    <button class="btn btn-primary btn-icon">➤</button>
  </div>
</div>`;
}

/* ====== STUDENT: Coach (Mobile) ====== */
function pageStudentCoach() {
  return `<div style="display:flex;flex-direction:column;height:100%;">
  <div class="chat-header">
    <div class="avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
    <div class="title">
      <h4>Coach Agent · 苏格拉底教练</h4>
      <span class="status-online">● 引导思考模式</span>
    </div>
  </div>
  <div class="chat-body" style="flex:1;overflow-y:auto;">

    <div class="msg-row user">
      <div class="msg-avatar" style="background:var(--primary-500);">夏</div>
      <div>
        <div class="msg-bubble">这段怎么剪才有网感？</div>
        <div class="msg-time">14:20</div>
      </div>
    </div>

    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
      <div>
        <div class="msg-bubble">
          这是个好问题。在给你方向之前，我想先理解你的想法：<br><br>
          <strong>1.</strong> 你觉得这条视频的目标观众是谁？他们在什么场景下看这条视频？<br><br>
          <strong>2.</strong> 前3秒如果没有钩子，观众划走的概率会增加多少？（参考你上周学的「3秒定生死」原则）
        </div>
        <div class="msg-time">14:20</div>
      </div>
    </div>

    <div class="msg-row user">
      <div class="msg-avatar" style="background:var(--primary-500);">夏</div>
      <div>
        <div class="msg-bubble">我觉得观众是数码爱好者，可能是在地铁上刷手机看</div>
        <div class="msg-time">14:22</div>
      </div>
    </div>

    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
      <div>
        <div class="msg-bubble">
          很好！地铁上刷手机——这意味着什么？<br><br>
          想想上周拆解的案例《我花30万买了一台电影机》：<br>
          • 它的前3秒用了什么手法？<br>
          • 如果改成"大家好，今天我们来评测一台电影机"，效果会有什么不同？<br><br>
          参考这个案例的时间轴：
          <div class="msg-card" style="margin-top:10px;">
            <div class="msg-card-title">📹 案例参考</div>
            <div class="msg-card-body">
              <strong>0:00-0:03</strong> 开场钩子：直接展示电影机画面 + 悬念台词<br>
              <strong>0:03-0:15</strong> 快速切换 B-roll，配合鼓点音乐<br>
              <strong>0:15-0:30</strong> 抛出冲突："这台机器值不值30万？"
            </div>
            <div class="msg-card-actions">
              <button class="btn btn-secondary btn-sm">查看完整拆解 →</button>
            </div>
          </div>
        </div>
        <div class="msg-time">14:23</div>
      </div>
    </div>

    <div class="msg-row user">
      <div class="msg-avatar" style="background:var(--primary-500);">夏</div>
      <div>
        <div class="msg-bubble">哦！我懂了。地铁上刷手机的人注意力很短，所以前3秒必须给视觉冲击或者制造悬念，不能慢慢铺垫</div>
        <div class="msg-time">14:25</div>
      </div>
    </div>

    <div class="msg-row agent">
      <div class="msg-avatar" style="background:linear-gradient(135deg,var(--agent-coach),#FF8E53);">🧠</div>
      <div>
        <div class="msg-bubble">
          🎉 <strong>完全正确！</strong><br><br>
          你自己得出了核心结论。这比直接告诉你答案印象深刻得多。<br><br>
          现在试着把这个思路应用到你的素材上：你的手机评测视频，前3秒可以怎么设计？
          <div style="margin-top:10px;padding:10px;background:#F0FFF4;border-radius:8px;font-size:12px;color:var(--success-600);">
            ✅ 思考深度评分：8.5/10（优秀）<br>
            📈 网感理解 +0.3 级
          </div>
        </div>
        <div class="msg-time">14:26</div>
      </div>
    </div>

  </div>
  <div class="chat-input-bar">
    <input type="text" placeholder="继续思考...">
    <button class="btn btn-primary btn-icon">➤</button>
  </div>
</div>`;
}

/* ====== STUDENT: Profile (Mobile) ====== */
function pageStudentProfile() {
  return `<div style="padding:20px;background:#fff;min-height:100%;">
  <!-- Profile Header -->
  <div style="text-align:center;margin-bottom:24px;">
    <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary-500),var(--agent-diagnostic));margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600;">夏</div>
    <h3 style="font-size:20px;font-weight:600;">小夏</h3>
    <p style="font-size:13px;color:var(--gray-400);margin-top:4px;">剪辑助理 · 入职第 12 天</p>
    <div style="margin-top:8px;">
      <span class="tag tag-blue">🥉 铜牌剪辑师</span>
    </div>
  </div>

  <!-- Radar Chart -->
  <div class="card" style="margin-bottom:16px;">
    <h4 style="font-size:15px;font-weight:600;margin-bottom:16px;">📊 能力雷达图</h4>
    <div class="radar-placeholder">
      <svg viewBox="0 0 200 200">
        <!-- Grid -->
        <polygon points="100,20 170,65 170,135 100,180 30,135 30,65" fill="none" stroke="var(--gray-200)" stroke-width="1"/>
        <polygon points="100,50 140,73 140,127 100,150 60,127 60,73" fill="none" stroke="var(--gray-200)" stroke-width="0.5"/>
        <polygon points="100,80 110,87 110,113 100,120 90,113 90,87" fill="none" stroke="var(--gray-200)" stroke-width="0.5"/>
        <!-- Data -->
        <polygon points="100,50 100,73 140,100 100,135 60,120 60,80" fill="rgba(51,112,255,0.12)" stroke="#3370FF" stroke-width="2"/>
        <circle cx="100" cy="50" r="3" fill="#3370FF"/>
        <circle cx="100" cy="73" r="3" fill="#3370FF"/>
        <circle cx="140" cy="100" r="3" fill="#3370FF"/>
        <circle cx="100" cy="135" r="3" fill="#3370FF"/>
        <circle cx="60" cy="120" r="3" fill="#3370FF"/>
        <circle cx="60" cy="80" r="3" fill="#3370FF"/>
        <!-- Labels -->
        <text x="100" y="14" text-anchor="middle" font-size="10" fill="var(--gray-400)">技术</text>
        <text x="180" y="65" text-anchor="start" font-size="10" fill="var(--gray-400)">审美</text>
        <text x="180" y="145" text-anchor="start" font-size="10" fill="var(--gray-400)">内容</text>
        <text x="100" y="196" text-anchor="middle" font-size="10" fill="var(--gray-400)">协作</text>
        <text x="20" y="145" text-anchor="end" font-size="10" fill="var(--gray-400)">叙事</text>
        <text x="20" y="65" text-anchor="end" font-size="10" fill="var(--gray-400)">调色</text>
      </svg>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;font-size:12px;">
      <div style="text-align:center;"><div style="font-weight:700;color:var(--primary-500);">L2.5</div><div style="color:var(--gray-400);">技术</div></div>
      <div style="text-align:center;"><div style="font-weight:700;color:var(--primary-500);">L3.0</div><div style="color:var(--gray-400);">审美</div></div>
      <div style="text-align:center;"><div style="font-weight:700;color:var(--warning-500);">L1.5</div><div style="color:var(--gray-400);">内容</div></div>
      <div style="text-align:center;"><div style="font-weight:700;color:var(--primary-500);">L3.5</div><div style="color:var(--gray-400);">协作</div></div>
      <div style="text-align:center;"><div style="font-weight:700;color:var(--primary-500);">L2.0</div><div style="color:var(--gray-400);">叙事</div></div>
      <div style="text-align:center;"><div style="font-weight:700;color:var(--warning-500);">L1.8</div><div style="color:var(--gray-400);">调色</div></div>
    </div>
  </div>

  <!-- Growth Prediction -->
  <div class="card" style="margin-bottom:16px;">
    <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;">🔮 成长预测</h4>
    <p style="font-size:13px;color:var(--gray-500);line-height:1.7;">
      如果保持当前学习节奏，预计 <strong style="color:var(--primary-500);">6 周后</strong> 达到 <strong>银牌剪辑师</strong>（L2.5）<br><br>
      📈 <strong>最大进步：</strong>网感（L1.0 → L2.3，+1.3 级）<br>
      ⚠️ <strong>待加强：</strong>情感叙事（L1.8，低于银牌要求 L2.5）
    </p>
    <div style="margin-top:12px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span>当前进度</span><span>L2.2</span></div>
      <div class="progress-bar"><div class="fill fill-blue" style="width:55%;"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-400);margin-top:4px;"><span>L1</span><span>目标: L2.5</span></div>
    </div>
  </div>

  <!-- Badges -->
  <div class="card" style="margin-bottom:16px;">
    <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;">🏆 成就徽章</h4>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
      <div style="text-align:center;"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FFA500);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">🥇</div><div style="font-size:11px;">网感进步之星</div></div>
      <div style="text-align:center;"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#C0C0C0,#808080);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">📚</div><div style="font-size:11px;">7天学习达人</div></div>
      <div style="text-align:center;"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#CD7F32,#8B4513);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">✅</div><div style="font-size:11px;">首测通过</div></div>
      <div style="text-align:center;opacity:0.3;"><div style="width:56px;height:56px;border-radius:50%;background:var(--gray-100);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 4px;">🔒</div><div style="font-size:11px;">银牌剪辑师</div></div>
    </div>
  </div>

  <!-- Learning History -->
  <div class="card">
    <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;">📚 学习历史</h4>
    <div style="font-size:12px;color:var(--gray-400);">
      <div style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:var(--success-500);">✓</span> Day 12 · 完成《前3秒定生死》课程</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:var(--success-500);">✓</span> Day 11 · 通过「网感」微测试（85分）</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:var(--success-500);">✓</span> Day 10 · 提交第一个练习作品</div>
      <div style="display:flex;gap:8px;"><span style="color:var(--success-500);">✓</span> Day 7 · 完成新手村毕业测评</div>
    </div>
  </div>

  <div class="bottom-nav">
    <button class="bottom-nav-item"><span class="icon">💬</span><span>消息</span></button>
    <button class="bottom-nav-item active"><span class="icon">📊</span><span>成长</span></button>
    <button class="bottom-nav-item"><span class="icon">🎯</span><span>任务</span></button>
    <button class="bottom-nav-item"><span class="icon">👤</span><span>我的</span></button>
  </div>
</div>`;
}

/* ====== STUDENT: Tasks (Mobile) ====== */
function pageStudentTasks() {
  return `<div style="padding:20px;background:#fff;min-height:100%;">
  <h3 style="font-size:22px;font-weight:600;margin-bottom:20px;">🎯 当前任务</h3>

  <div style="margin-bottom:8px;">
    <span style="font-size:13px;color:var(--gray-400);">2026年4月20日 周一</span>
  </div>

  <!-- Progress Card -->
  <div style="background:linear-gradient(135deg,var(--primary-500),var(--agent-diagnostic));border-radius:16px;padding:20px;color:#fff;margin-bottom:20px;">
    <div style="font-size:13px;opacity:0.9;margin-bottom:8px;">今日进度</div>
    <div style="font-size:36px;font-weight:700;margin-bottom:8px;">2 / 3</div>
    <div style="font-size:13px;opacity:0.9;">已完成 2 个任务，还剩 1 个</div>
    <div style="margin-top:12px;background:rgba(255,255,255,0.2);height:6px;border-radius:3px;overflow:hidden;">
      <div style="width:66%;height:100%;background:#fff;border-radius:3px;"></div>
    </div>
  </div>

  <h4 style="font-size:14px;font-weight:600;color:var(--gray-400);margin-bottom:12px;">今日微练习</h4>

  <!-- Completed Task 1 -->
  <div class="card" style="margin-bottom:12px;padding:0;overflow:hidden;">
    <div style="padding:16px;display:flex;gap:12px;align-items:flex-start;">
      <div class="item-icon" style="background:var(--success-50);color:var(--success-500);font-size:20px;width:44px;height:44px;">✅</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:15px;font-weight:500;">观看《前3秒定生死》课程</div>
          <span class="tag tag-green">已完成</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">视频 · 12分钟 · 09:05 完成</div>
      </div>
    </div>
  </div>

  <!-- Completed Task 2 -->
  <div class="card" style="margin-bottom:12px;padding:0;overflow:hidden;">
    <div style="padding:16px;display:flex;gap:12px;align-items:flex-start;">
      <div class="item-icon" style="background:var(--success-50);color:var(--success-500);font-size:20px;width:44px;height:44px;">✅</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:15px;font-weight:500;">案例拆解：《我花30万买了一台电影机》</div>
          <span class="tag tag-green">已完成</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">阅读 · 15分钟 · 09:30 完成</div>
      </div>
    </div>
  </div>

  <!-- In Progress Task -->
  <div style="background:#fff;border-radius:12px;border:2px solid var(--primary-500);margin-bottom:20px;overflow:hidden;box-shadow:var(--shadow-sm);">
    <div style="padding:16px;display:flex;gap:12px;align-items:flex-start;">
      <div class="item-icon" style="background:var(--warning-50);color:var(--warning-500);font-size:20px;width:44px;height:44px;">⏳</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:15px;font-weight:500;">微练习：给3个标题打分</div>
          <span class="tag tag-blue">进行中</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">练习 · 预计 8 分钟</div>
        <div style="margin-top:10px;">
          <button class="btn btn-primary btn-sm">继续练习</button>
        </div>
      </div>
    </div>
  </div>

  <h4 style="font-size:14px;font-weight:600;color:var(--gray-400);margin-bottom:12px;">本周挑战</h4>
  <div class="card" style="margin-bottom:12px;">
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div class="item-icon" style="background:var(--agent-diagnostic-light);color:var(--agent-diagnostic);font-size:20px;width:44px;height:44px;">🎯</div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:500;">挑战：用悬念式开场剪辑30秒素材</div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">与当前项目「科技评测」相关</div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center;">
          <div class="progress-bar" style="flex:1;"><div class="fill fill-orange" style="width:30%;"></div></div>
          <span style="font-size:12px;color:var(--gray-400);">30%</span>
        </div>
      </div>
    </div>
  </div>

  <h4 style="font-size:14px;font-weight:600;color:var(--gray-400);margin-bottom:12px;">待审反馈</h4>
  <div class="card">
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div class="item-icon" style="background:var(--danger-50);color:var(--danger-500);font-size:20px;width:44px;height:44px;">💬</div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:500;">导师阿杰的评审反馈</div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">关于「情感段落节奏」作业的点评</div>
        <div style="margin-top:10px;">
          <button class="btn btn-secondary btn-sm">查看反馈</button>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-nav">
    <button class="bottom-nav-item"><span class="icon">💬</span><span>消息</span></button>
    <button class="bottom-nav-item"><span class="icon">📊</span><span>成长</span></button>
    <button class="bottom-nav-item active"><span class="icon">🎯</span><span>任务</span></button>
    <button class="bottom-nav-item"><span class="icon">👤</span><span>我的</span></button>
  </div>
</div>`;
}

/* ====== MENTOR: Dashboard (Desktop) ====== */
function pageMentorDashboard() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>📋 Agent 辅助看板</h2>
      <p>本周 Agent 已处理 85% 基础工作，你只需关注高价值判断</p>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-secondary btn-sm">本周</button>
      <button class="btn btn-primary btn-sm">+ 新增辅导</button>
    </div>
  </div>

  <!-- Key Metrics -->
  <div class="dashboard-grid">
    <div class="card">
      <div class="card-header"><h4>👥 我的学员</h4><span class="tag tag-blue">3 人</span></div>
      <div class="metric-value">3</div>
      <div class="metric-change up">↑ 本月新增 1 人</div>
    </div>
    <div class="card">
      <div class="card-header"><h4>⏱️ 本周节省时长</h4><span class="tag tag-green">Agent 辅助</span></div>
      <div class="metric-value">4.5<span class="unit">h</span></div>
      <div class="metric-change up">↑ 比上周多 1.2h</div>
    </div>
    <div class="card">
      <div class="card-header"><h4>✅ Agent 已解答</h4><span class="tag tag-green">自动处理</span></div>
      <div class="metric-value">28</div>
      <div class="metric-change up">占本周提问总量的 85%</div>
    </div>
  </div>

  <!-- Main Content -->
  <div style="margin-top:24px;display:grid;grid-template-columns:2fr 1fr;gap:16px;">
    <!-- Student Table -->
    <div class="card">
      <div class="card-header"><h4>📊 学员状态概览</h4></div>
      <table class="data-table">
        <thead>
          <tr><th>学员</th><th>当前等级</th><th>本周进度</th><th>风险</th><th>待你判断</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>小夏</strong></td>
            <td>L2.2 铜牌</td>
            <td>5/6 任务完成</td>
            <td><span class="status-dot status-yellow"></span> 关注</td>
            <td><span class="tag tag-orange">3 个问题</span></td>
          </tr>
          <tr>
            <td><strong>小李</strong></td>
            <td>L1.5 助理</td>
            <td>2/5 任务完成</td>
            <td><span class="status-dot status-red"></span> 需干预</td>
            <td><span class="tag tag-red">1 个预警</span></td>
          </tr>
          <tr>
            <td><strong>小林</strong></td>
            <td>L3.0 银牌</td>
            <td>6/6 任务完成</td>
            <td><span class="status-dot status-green"></span> 正常</td>
            <td><span class="tag tag-green">0 待处理</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Alerts -->
    <div class="card">
      <div class="card-header"><h4>🚨 待处理预警</h4></div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="alert alert-warning" style="border-left:3px solid var(--warning-500);">
          <div style="font-weight:600;margin-bottom:4px;">小夏 · 情感叙事连续低分</div>
          <div style="font-size:12px;">连续3次练习得分 &lt; 70，建议 1 对 1 深度辅导</div>
          <button class="btn btn-primary btn-sm mt-3">安排辅导</button>
        </div>
        <div class="alert alert-danger" style="border-left:3px solid var(--danger-500);">
          <div style="font-weight:600;margin-bottom:4px;">小李 · 连续3天未登录</div>
          <div style="font-size:12px;">Agent 关怀消息未回复，需人工介入</div>
          <button class="btn btn-primary btn-sm mt-3">联系学员</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Weekly Summary -->
  <div class="card" style="margin-top:16px;">
    <div class="card-header"><h4>📝 Agent 预处理周报（本周）</h4></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center;">
      <div>
        <div style="font-size:32px;font-weight:700;color:var(--primary-500);">28</div>
        <div style="font-size:13px;color:var(--gray-400);">Agent 已解答</div>
      </div>
      <div>
        <div style="font-size:32px;font-weight:700;color:var(--warning-500);">5</div>
        <div style="font-size:13px;color:var(--gray-400);">需你判断</div>
      </div>
      <div>
        <div style="font-size:32px;font-weight:700;color:var(--success-500);">2</div>
        <div style="font-size:13px;color:var(--gray-400);">作品已预审</div>
      </div>
      <div>
        <div style="font-size:32px;font-weight:700;color:var(--danger-500);">1</div>
        <div style="font-size:13px;color:var(--gray-400);">风险预警</div>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== MENTOR: Review (Desktop) ====== */
function pageMentorReview() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>✂️ 作品预审 · 小夏</h2>
      <p>项目：情感类纪录片《故乡的味道》初剪</p>
    </div>
    <div style="display:flex;gap:8px;">
      <span class="tag tag-blue">初剪版本</span>
      <span class="tag tag-orange">待评审</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <!-- Left: Agent Pre-check -->
    <div class="card">
      <div class="card-header"><h4>🤖 Agent 自动预审报告</h4><span class="tag tag-blue">AI 生成</span></div>

      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:14px;">品牌规范检查</span>
          <span class="tag tag-green">✅ 通过</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);padding-left:16px;">字体、LOGO、标准色均符合规范</div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:14px;">导出设置检查</span>
          <span class="tag tag-green">✅ 通过</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);padding-left:16px;">码率、分辨率、格式均符合交付标准</div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:14px;">字幕样式检查</span>
          <span class="tag tag-orange">⚠️ 轻微偏差</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);padding-left:16px;">02:15 处字幕大小不统一（标准 24px，实际 22px）</div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:14px;">技术完整性</span>
          <span class="tag tag-green">✅ 通过</span>
        </div>
        <div style="font-size:12px;color:var(--gray-400);padding-left:16px;">无黑帧、音画同步、品牌元素完整</div>
      </div>

      <div class="alert alert-info" style="margin-top:16px;">
        <div style="font-weight:600;margin-bottom:4px;">📝 创意关注点（供你参考）</div>
        <div style="font-size:12px;">
          情感段落（01:45-02:30）的节奏与参考案例《XXXX》差异较大。<br>
          该学员「情感叙事」能力当前 L1.8，可能需要更多引导。
        </div>
      </div>
    </div>

    <!-- Right: Mentor Review -->
    <div class="card">
      <div class="card-header"><h4>🎓 导师创意点评</h4><span class="tag tag-purple">人工</span></div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">整体评价</label>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm">👍 优秀</button>
          <button class="btn btn-secondary btn-sm" style="border-color:var(--primary-500);color:var(--primary-500);">✓ 合格</button>
          <button class="btn btn-secondary btn-sm">🔄 需修改</button>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">创意点评</label>
        <textarea style="width:100%;height:100px;border:1px solid var(--gray-200);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit;" placeholder="写下你的创意点评..."></textarea>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">具体改进建议</label>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;"><input type="checkbox"> 情感转折时机需要调整</label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;"><input type="checkbox"> B-roll 与 A-roll 比例可优化</label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;"><input type="checkbox"> 结尾情绪收束可以更克制</label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;"><input type="checkbox" checked> 字幕样式统一（Agent 已标注）</label>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">下次辅导目标</label>
        <input type="text" style="width:100%;border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;font-size:13px;" value="重点练习情感段落的节奏把控">
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-secondary btn-sm">保存草稿</button>
        <button class="btn btn-primary btn-sm">提交评审</button>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== MANAGER: Insights (Desktop) ====== */
function pageManagerInsights() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>📈 团队 Agent 洞察仪表盘</h2>
      <p>数据实时更新 · 最后更新：刚刚</p>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-secondary btn-sm">本月</button>
      <button class="btn btn-primary btn-sm">导出报告</button>
    </div>
  </div>

  <!-- Top Metrics -->
  <div class="dashboard-grid">
    <div class="card">
      <div class="card-header"><h4>👥 团队健康度</h4></div>
      <div style="display:flex;gap:20px;align-items:center;">
        <div style="width:90px;height:90px;border-radius:50%;background:conic-gradient(var(--success-500) 0% 93%, var(--warning-500) 93% 98%, var(--danger-500) 98% 100%);display:flex;align-items:center;justify-content:center;">
          <div style="width:70px;height:70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">93%</div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span class="status-dot status-green"></span><span style="font-size:13px;">正常 93人</span></div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span class="status-dot status-yellow"></span><span style="font-size:13px;">关注 5人</span></div>
          <div style="display:flex;align-items:center;gap:6px;"><span class="status-dot status-red"></span><span style="font-size:13px;">需干预 2人</span></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h4>📚 本月学习活跃度</h4></div>
      <div class="metric-value">87%</div>
      <div class="metric-change up">↑ 比上月 +5%</div>
      <div style="margin-top:8px;font-size:12px;color:var(--gray-400);">人均学习时长 38 分钟/天</div>
    </div>
    <div class="card">
      <div class="card-header"><h4>🤖 Agent 自主解决率</h4></div>
      <div class="metric-value">72%</div>
      <div class="metric-change up">↑ 比上月 +4%</div>
      <div style="margin-top:8px;font-size:12px;color:var(--gray-400);">目标：70% ✅</div>
    </div>
  </div>

  <!-- Middle Section -->
  <div style="margin-top:24px;display:grid;grid-template-columns:2fr 1fr;gap:16px;">
    <!-- Skill Heatmap -->
    <div class="card">
      <div class="card-header"><h4>📊 团队能力热力图</h4></div>
      <table class="data-table">
        <thead>
          <tr><th>能力维度</th><th>团队平均</th><th>最高</th><th>最低</th><th>趋势</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>技术能力</strong></td><td>L2.8</td><td>L4.0 阿杰</td><td>L1.5 小李</td><td style="color:var(--success-500);">↗ 上升</td></tr>
          <tr><td><strong>审美能力</strong></td><td>L3.2</td><td>L4.0 阿杰</td><td>L2.0 小张</td><td>→ 持平</td></tr>
          <tr><td><strong>内容理解</strong></td><td>L2.1</td><td>L3.5 小林</td><td>L1.0 小王</td><td style="color:var(--danger-500);">↘ 下降</td></tr>
          <tr><td><strong>协作能力</strong></td><td>L3.5</td><td>L4.0 Lisa</td><td>L2.5 小陈</td><td style="color:var(--success-500);">↗ 上升</td></tr>
          <tr><td><strong>叙事逻辑</strong></td><td>L2.6</td><td>L3.8 小林</td><td>L1.5 小李</td><td>→ 持平</td></tr>
          <tr><td><strong>调色能力</strong></td><td>L2.4</td><td>L4.0 阿杰</td><td>L1.2 小王</td><td style="color:var(--success-500);">↗ 上升</td></tr>
        </tbody>
      </table>
      <div class="alert alert-danger" style="margin-top:12px;">
        ⚠️ <strong>团队短板预警：</strong>「内容理解」维度团队平均 L2.1，低于目标 L2.5。建议补充网感类课程和案例拆解。
      </div>
    </div>

    <!-- Talent Pipeline -->
    <div class="card">
      <div class="card-header"><h4>🔮 人才梯队预测</h4></div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:6px;">预计 3 个月后可晋升银牌</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span class="tag tag-blue">小夏 L2.2</span>
            <span class="tag tag-blue">小林 L3.0</span>
            <span class="tag tag-blue">小张 L2.4</span>
            <span class="tag tag-blue">小陈 L2.3</span>
            <span class="tag tag-blue">小刘 L2.5</span>
          </div>
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:6px;">预计 6 个月后有金牌潜力</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span class="tag tag-purple">阿杰 L3.8</span>
            <span class="tag tag-purple">小林 L3.0</span>
            <span class="tag tag-purple">Lisa L3.5</span>
          </div>
        </div>
        <div class="alert alert-danger">
          <div style="font-weight:600;margin-bottom:4px;">🔴 高风险流失</div>
          <div style="font-size:12px;">小王（情感类项目连续失败 3 次，能力 L1.2，建议 HR 介入）</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ROI Card -->
  <div class="card" style="margin-top:16px;">
    <div class="card-header"><h4>💰 培训 ROI（本月）</h4></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center;">
      <div>
        <div style="font-size:13px;color:var(--gray-400);margin-bottom:4px;">培训投入</div>
        <div style="font-size:28px;font-weight:700;">¥8,200</div>
      </div>
      <div>
        <div style="font-size:13px;color:var(--gray-400);margin-bottom:4px;">减少返工成本</div>
        <div style="font-size:28px;font-weight:700;color:var(--success-500);">¥4,400</div>
      </div>
      <div>
        <div style="font-size:13px;color:var(--gray-400);margin-bottom:4px;">节省导师时间</div>
        <div style="font-size:28px;font-weight:700;color:var(--success-500);">¥6,000</div>
      </div>
      <div>
        <div style="font-size:13px;color:var(--gray-400);margin-bottom:4px;">ROI</div>
        <div style="font-size:28px;font-weight:700;color:var(--primary-500);">3.2</div>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== MANAGER: Smart Assignment (Desktop) ====== */
function pageManagerAssign() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>🎯 智能派活</h2>
      <p>基于能力图谱 + 项目需求，自动推荐最佳人选</p>
    </div>
  </div>

  <!-- Input Form -->
  <div class="card" style="margin-bottom:16px;">
    <div class="card-header"><h4>📋 项目信息</h4></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      <div>
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">项目类型</label>
        <select style="width:100%;border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;font-size:13px;background:#fff;">
          <option>情感类纪录片</option>
          <option>科技评测</option>
          <option>商业广告</option>
          <option>Vlog</option>
        </select>
      </div>
      <div>
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">风格要求</label>
        <select style="width:100%;border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;font-size:13px;background:#fff;">
          <option>慢节奏叙事</option>
          <option>快节奏科技感</option>
          <option>轻松活泼</option>
          <option>严肃专业</option>
        </select>
      </div>
      <div>
        <label style="font-size:13px;font-weight:500;color:var(--gray-500);display:block;margin-bottom:6px;">难度等级</label>
        <select style="width:100%;border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;font-size:13px;background:#fff;">
          <option>银牌及以上</option>
          <option>铜牌及以上</option>
          <option>不限</option>
        </select>
      </div>
    </div>
    <div style="margin-top:16px;">
      <button class="btn btn-primary">🔍 智能匹配</button>
    </div>
  </div>

  <!-- Results -->
  <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;">推荐结果（按匹配度排序）</h4>

  <div style="display:flex;flex-direction:column;gap:12px;">
    <!-- Match 1 -->
    <div class="card" style="border:2px solid var(--primary-500);">
      <div style="display:flex;gap:16px;align-items:flex-start;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--primary-500),var(--agent-diagnostic));display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:600;flex-shrink:0;">杰</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:16px;font-weight:600;">阿杰 <span class="tag tag-blue">剪辑指导 L4.0</span></div>
              <div style="font-size:13px;color:var(--gray-400);margin-top:2px;">擅长：快节奏科技评测 · 3年经验 · 20+百万播放作品</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:32px;font-weight:700;color:var(--primary-500);">92%</div>
              <div style="font-size:12px;color:var(--gray-400);">匹配度</div>
            </div>
          </div>
          <div style="margin-top:12px;padding:12px;background:var(--primary-50);border-radius:8px;">
            <div style="font-size:12px;font-weight:600;color:var(--primary-700);margin-bottom:4px;">📝 匹配理由</div>
            <div style="font-size:12px;color:var(--gray-500);line-height:1.6;">
              • 技术能力 L4.0（要求 L3.0+）✅<br>
              • 审美能力 L4.0，擅长快节奏剪辑 ✅<br>
              • 当前负荷 75%，有承接能力 ✅<br>
              • 历史同类项目成功率 95% ✅
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match 2 -->
    <div class="card">
      <div style="display:flex;gap:16px;align-items:flex-start;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--success-500),#20C997);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:600;flex-shrink:0;">林</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:16px;font-weight:600;">小林 <span class="tag tag-green">银牌 L3.0</span></div>
              <div style="font-size:13px;color:var(--gray-400);margin-top:2px;">擅长：叙事逻辑 · 2年经验 · 情感类项目专家</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:32px;font-weight:700;color:var(--success-500);">88%</div>
              <div style="font-size:12px;color:var(--gray-400);">匹配度</div>
            </div>
          </div>
          <div style="margin-top:12px;padding:12px;background:var(--gray-50);border-radius:8px;">
            <div style="font-size:12px;color:var(--gray-500);line-height:1.6;">
              • 叙事逻辑 L3.8，情感类项目成功率 90%<br>
              • 当前负荷 60%，时间充裕<br>
              • 适合需要强叙事能力的项目
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match 3 -->
    <div class="card">
      <div style="display:flex;gap:16px;align-items:flex-start;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--warning-500),#FF6B6B);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:600;flex-shrink:0;">夏</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:16px;font-weight:600;">小夏 <span class="tag tag-orange">铜牌 L2.2</span></div>
              <div style="font-size:13px;color:var(--gray-400);margin-top:2px;">新人 · 入职12天 · 网感进步快</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:32px;font-weight:700;color:var(--warning-500);">65%</div>
              <div style="font-size:12px;color:var(--gray-400);">匹配度</div>
            </div>
          </div>
          <div style="margin-top:12px;padding:12px;background:var(--warning-50);border-radius:8px;">
            <div style="font-size:12px;color:var(--warning-700);line-height:1.6;">
              ⚠️ 等级低于要求（要求银牌 L2.5+），但网感进步快（L1.0→L2.3）。建议作为辅助剪辑或安排导师带教。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
    <button class="btn btn-secondary">重新匹配</button>
    <button class="btn btn-primary">✓ 确认派活给阿杰</button>
  </div>
</div>`;
}

/* ====== ADMIN: Pending Pool (Desktop) ====== */
function pageAdminPending() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>📝 Pending Pool · 测试题审阅</h2>
      <p>AI 生成题目需经 Owner 审阅后才能发布</p>
    </div>
    <div style="display:flex;gap:8px;">
      <span class="tag tag-orange">待审 3 门课程</span>
      <span class="tag tag-blue">已审 12 门</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:280px 1fr;gap:16px;">
    <!-- Left: Course List -->
    <div class="card" style="align-self:start;">
      <div class="card-header"><h4>📚 待审课程列表</h4></div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="padding:12px;background:var(--primary-50);border-radius:8px;border:2px solid var(--primary-500);cursor:pointer;">
          <div style="font-size:14px;font-weight:500;">《情感段落节奏处理》</div>
          <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">Owner：阿杰 | 生成 8 题 | 待审</div>
        </div>
        <div style="padding:12px;background:#fff;border-radius:8px;border:1px solid var(--gray-200);cursor:pointer;">
          <div style="font-size:14px;font-weight:500;">《B-roll 快速切换技巧》</div>
          <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">Owner：小林 | 生成 6 题 | 待审</div>
        </div>
        <div style="padding:12px;background:#fff;border-radius:8px;border:1px solid var(--gray-200);cursor:pointer;">
          <div style="font-size:14px;font-weight:500;">《调色风格统一方法论》</div>
          <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">Owner：阿杰 | 生成 10 题 | 待审</div>
        </div>
      </div>
    </div>

    <!-- Right: Question Review -->
    <div class="card">
      <div class="card-header">
        <h4>《情感段落节奏处理》— 题目审阅</h4>
        <span style="font-size:12px;color:var(--gray-400);">Owner：阿杰 | 生成时间：2026-04-19 14:30</span>
      </div>

      <div class="alert alert-success" style="margin-bottom:16px;">
        <strong>AI 自检结果：</strong>难度分布 易:中:难 = 3:3:2 ✅ | 覆盖全部 Learning Objectives ✅ | 无歧义措辞 ✅
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        <!-- Q1 -->
        <div style="padding:16px;border:1px solid var(--gray-200);border-radius:12px;background:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="tag tag-blue">概念理解</span>
              <span class="tag tag-green">难度：中</span>
            </div>
            <span style="font-size:12px;color:var(--gray-400);">Q1</span>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:10px;">
            情感类纪录片中，"B-roll 与 A-roll 的比例建议"是多少？
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--gray-500);margin-bottom:10px;">
            <div>A. 1:1</div>
            <div>B. 2:1</div>
            <div style="color:var(--success-500);font-weight:600;">C. 3:1 ✅</div>
            <div>D. 4:1</div>
          </div>
          <div style="font-size:12px;color:var(--gray-400);padding:8px;background:var(--gray-50);border-radius:6px;">
            📍 AI 考点来源：课程 03:20 处提到的 B-roll/A-roll 比例
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
            <button class="btn btn-secondary btn-xs">✏️ 编辑</button>
            <button class="btn btn-primary btn-xs">✅ 通过</button>
            <button class="btn btn-ghost btn-xs" style="color:var(--danger-500);">❌ 删除</button>
          </div>
        </div>

        <!-- Q2 -->
        <div style="padding:16px;border:1px solid var(--gray-200);border-radius:12px;background:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="tag tag-orange">场景应用</span>
              <span class="tag tag-orange">难度：高</span>
              <span class="tag tag-red">建议人工复核</span>
            </div>
            <span style="font-size:12px;color:var(--gray-400);">Q2</span>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:10px;">
            你正在剪辑一条 8 分钟的手机评测视频，前 3 分钟节奏紧凑、信息密集。导演反馈"后 5 分钟观众流失严重"。作为剪辑师，你会从哪三个维度调整节奏？
          </div>
          <div style="font-size:12px;color:var(--gray-400);padding:8px;background:var(--gray-50);border-radius:6px;margin-bottom:10px;">
            📍 AI 参考答案关键词：信息密度稀释、情绪曲线设计、B-roll 穿插节奏、段落过渡钩子
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
            <button class="btn btn-secondary btn-xs">✏️ 编辑</button>
            <button class="btn btn-primary btn-xs">✅ 通过</button>
            <button class="btn btn-ghost btn-xs" style="color:var(--danger-500);">❌ 删除</button>
          </div>
        </div>

        <!-- Q3 -->
        <div style="padding:16px;border:1px solid var(--gray-200);border-radius:12px;background:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="tag tag-purple">对比分析</span>
              <span class="tag tag-orange">难度：高</span>
            </div>
            <span style="font-size:12px;color:var(--gray-400);">Q3</span>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:10px;">
            以下两个标题，你认为哪个更适合情感类纪录片？为什么？<br>
            A. "故乡的味道：一碗面的记忆"<br>
            B. "这碗面让我哭了三个小时"
          </div>
          <div style="padding:10px;background:var(--warning-50);border-radius:6px;margin-bottom:10px;">
            <div style="font-size:12px;color:var(--warning-600);">
              ⚠️ Owner 批注：措辞太正式，建议改成更口语化的对比
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
            <button class="btn btn-secondary btn-xs">✏️ 编辑</button>
            <button class="btn btn-primary btn-xs">✅ 通过</button>
            <button class="btn btn-ghost btn-xs" style="color:var(--danger-500);">❌ 删除</button>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--gray-200);">
        <div style="font-size:13px;color:var(--gray-500);">
          总计：8 题 | 已通过：2 | 待审：5 | 已删除：1
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm">保存草稿</button>
          <button class="btn btn-primary btn-sm">🚀 一键发布全部通过题目</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== STUDENT: Self Review (Mobile) ====== */
function pageStudentSelfReview() {
  const dims = [
    { name: '技术能力', agent: 3.2, desc: '剪辑软件熟练度、技术规范执行' },
    { name: '审美能力', agent: 2.8, desc: '色彩搭配、画面构图、视觉风格' },
    { name: '内容理解', agent: 2.5, desc: '网感、叙事逻辑、信息密度控制' },
    { name: '协作能力', agent: 3.5, desc: '沟通效率、反馈响应、团队配合' },
    { name: '叙事逻辑', agent: 2.6, desc: '故事结构、情绪曲线、节奏把控' },
    { name: '调色能力', agent: 2.4, desc: '色彩风格一致性、达芬奇调色' }
  ];
  const sliders = dims.map((d, i) => `
    <div class="form-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="form-label">${d.name}</span>
        <span style="font-size:12px;color:var(--gray-400);">Agent数据: ${d.agent}</span>
      </div>
      <div class="form-hint">${d.desc}</div>
      <div class="score-slider">
        <input type="range" min="1" max="5" step="0.5" value="3" id="slider-${i}" oninput="document.getElementById('score-${i}').innerText=this.value">
        <span class="score-value" id="score-${i}">3</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-300);margin-top:4px;">
        <span>待提升</span><span>合格</span><span>优秀</span>
      </div>
    </div>
  `).join('');

  return `<div style="display:flex;flex-direction:column;height:100%;">
  <div class="chat-header">
    <div style="font-size:20px;">📝</div>
    <div class="title">
      <h4>Q2 季度自评</h4>
      <span class="subtitle">2026年第二季度 · 能力雷达图自评</span>
    </div>
    <span class="tag tag-blue">待提交</span>
  </div>
  <div style="flex:1;overflow-y:auto;background:var(--gray-50);">
    <!-- Info Banner -->
    <div class="alert alert-info" style="margin:16px;border-radius:12px;">
      <div style="font-weight:600;margin-bottom:4px;">💡 自评说明</div>
      <div style="font-size:12px;">你的自评将占季度总评的 <strong>25%</strong>。请根据本季度的实际成长情况进行打分，Agent 数据仅作为参考。</div>
    </div>

    <!-- Radar Preview -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📊 能力雷达图预览</div>
      <div class="radar-placeholder">
        <svg viewBox="0 0 200 200">
          <polygon points="100,20 170,70 150,150 50,150 30,70" fill="none" stroke="#EBECF0" stroke-width="1"/>
          <polygon points="100,50 140,80 130,130 70,130 60,80" fill="rgba(51,112,255,0.15)" stroke="#3370FF" stroke-width="2"/>
          <circle cx="100" cy="50" r="3" fill="#3370FF"/><text x="100" y="40" text-anchor="middle" font-size="9" fill="#646A73">技术</text>
          <circle cx="140" cy="80" r="3" fill="#3370FF"/><text x="155" y="80" text-anchor="start" font-size="9" fill="#646A73">审美</text>
          <circle cx="130" cy="130" r="3" fill="#3370FF"/><text x="145" y="135" text-anchor="start" font-size="9" fill="#646A73">内容</text>
          <circle cx="70" cy="130" r="3" fill="#3370FF"/><text x="55" y="135" text-anchor="end" font-size="9" fill="#646A73">协作</text>
          <circle cx="60" cy="80" r="3" fill="#3370FF"/><text x="45" y="80" text-anchor="end" font-size="9" fill="#646A73">叙事</text>
          <circle cx="100" cy="100" r="3" fill="#3370FF"/><text x="100" y="115" text-anchor="middle" font-size="9" fill="#646A73">调色</text>
        </svg>
      </div>
    </div>

    <!-- Sliders -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;border:1px solid var(--gray-100);overflow:hidden;">
      <div style="padding:16px 16px 0;font-size:14px;font-weight:600;">⭐ 各维度自评（1-5分）</div>
      ${sliders}
    </div>

    <!-- Summary -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <label class="form-label">📝 季度成长总结</label>
      <div class="form-hint">分享本季度最大的成长、遇到的挑战、以及对下季度的期望</div>
      <textarea style="width:100%;height:100px;border:1px solid var(--gray-200);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit;" placeholder="例如：本季度我独立完成了3个项目，最大的突破是..."></textarea>
      <div style="font-size:12px;color:var(--gray-400);margin-top:6px;text-align:right;">0 / 500 字</div>
    </div>

    <!-- Submit -->
    <div style="padding:0 16px 24px;">
      <button class="btn btn-primary" style="width:100%;padding:12px;">提交自评并触发导师评价</button>
      <div style="font-size:12px;color:var(--gray-400);text-align:center;margin-top:8px;">提交后导师将收到飞书审批待办</div>
    </div>
  </div>
</div>`;
}

/* ====== STUDENT: Certification (Mobile) ====== */
function pageStudentCertification() {
  return `<div style="display:flex;flex-direction:column;height:100%;">
  <div class="chat-header">
    <div style="font-size:20px;">🏅</div>
    <div class="title">
      <h4>等级认证</h4>
      <span class="subtitle">当前：铜牌剪辑师（L2）</span>
    </div>
  </div>
  <div style="flex:1;overflow-y:auto;background:var(--gray-50);">
    <!-- Current Level Card -->
    <div style="background:linear-gradient(135deg,#CD7F32,#E8A87C);margin:16px;border-radius:16px;padding:20px;color:#fff;box-shadow:var(--shadow-md);">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:32px;">🥉</div>
        <div>
          <div style="font-size:12px;opacity:0.8;">当前等级</div>
          <div style="font-size:20px;font-weight:700;">铜牌剪辑师 L2</div>
          <div style="font-size:12px;opacity:0.8;margin-top:2px;">入职 8 个月 · 独立项目 5 个</div>
        </div>
      </div>
    </div>

    <!-- Progress to L3 -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;">🎯 晋升银牌剪辑师（L3）进度</div>
      <div class="step-bar" style="margin-bottom:16px;">
        <div class="step done">1</div>
        <div class="step-line done"></div>
        <div class="step done">2</div>
        <div class="step-line" style="background:linear-gradient(90deg,var(--success-500) 60%,var(--gray-100) 60%);"></div>
        <div class="step current">3</div>
        <div class="step-line"></div>
        <div class="step pending">4</div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-400);">
        <span>能力达标</span><span>项目数量</span><span>带教记录</span><span>导师推荐</span>
      </div>
      <div style="margin-top:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;">能力雷达图平均分</span>
          <span style="font-size:13px;font-weight:600;">3.0 / 3.0 ✅</span>
        </div>
        <div class="progress-bar"><div class="fill fill-green" style="width:100%"></div></div>
      </div>
      <div style="margin-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;">独立完成项目</span>
          <span style="font-size:13px;font-weight:600;">5 / 8 个</span>
        </div>
        <div class="progress-bar"><div class="fill fill-blue" style="width:62%"></div></div>
      </div>
      <div style="margin-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;">带教记录时长</span>
          <span style="font-size:13px;font-weight:600;">8 / 20 小时</span>
        </div>
        <div class="progress-bar"><div class="fill fill-orange" style="width:40%"></div></div>
      </div>
    </div>

    <!-- All Levels -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;">🏔️ 四级成长体系</div>
      <div style="display:flex;justify-content:space-around;align-items:flex-start;">
        <div style="text-align:center;opacity:0.5;">
          <div class="cert-badge bronze" style="width:48px;height:48px;font-size:20px;margin:0 auto;">🥉</div>
          <div style="font-size:11px;font-weight:600;margin-top:6px;">L1 助理</div>
          <div style="font-size:10px;color:var(--gray-400);">已达成</div>
        </div>
        <div style="text-align:center;">
          <div class="cert-badge bronze" style="width:56px;height:56px;font-size:24px;margin:0 auto;box-shadow:0 0 0 3px rgba(205,127,50,0.3);">🥉</div>
          <div style="font-size:12px;font-weight:600;margin-top:6px;color:var(--warning-600);">L2 铜牌</div>
          <div style="font-size:10px;color:var(--gray-400);">当前</div>
        </div>
        <div style="text-align:center;opacity:0.6;">
          <div class="cert-badge silver locked" style="width:48px;height:48px;font-size:20px;margin:0 auto;">🥈</div>
          <div style="font-size:11px;font-weight:600;margin-top:6px;">L3 银牌</div>
          <div style="font-size:10px;color:var(--gray-400);">待解锁</div>
        </div>
        <div style="text-align:center;opacity:0.4;">
          <div class="cert-badge gold locked" style="width:48px;height:48px;font-size:20px;margin:0 auto;">🥇</div>
          <div style="font-size:11px;font-weight:600;margin-top:6px;">L4 金牌</div>
          <div style="font-size:10px;color:var(--gray-400);">远景</div>
        </div>
      </div>
    </div>

    <!-- Privileges -->
    <div style="background:#fff;margin:0 16px 16px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;">🔓 已解锁特权</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">✅</span><span style="font-size:13px;">独立承接项目</span></div>
        <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;">✅</span><span style="font-size:13px;">案例拆解发布到案例库</span></div>
        <div style="display:flex;align-items:center;gap:10px;opacity:0.4;"><span style="font-size:18px;">🔒</span><span style="font-size:13px;">带教新人（L3解锁）</span></div>
        <div style="display:flex;align-items:center;gap:10px;opacity:0.4;"><span style="font-size:18px;">🔒</span><span style="font-size:13px;">培训预算申请（L3解锁）</span></div>
        <div style="display:flex;align-items:center;gap:10px;opacity:0.4;"><span style="font-size:18px;">🔒</span><span style="font-size:13px;">参与项目评审（L4解锁）</span></div>
      </div>
    </div>

    <!-- History -->
    <div style="background:#fff;margin:0 16px 24px;border-radius:12px;padding:16px;border:1px solid var(--gray-100);">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📜 认证历史</div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--success-50);display:flex;align-items:center;justify-content:center;font-size:16px;">🥉</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">晋升铜牌剪辑师（L2）</div>
            <div style="font-size:11px;color:var(--gray-400);">2026年1月 · 通过季度Review委员会审核</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--gray-50);display:flex;align-items:center;justify-content:center;font-size:16px;">🌱</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">入职 · 剪辑助理（L1）</div>
            <div style="font-size:11px;color:var(--gray-400);">2025年8月 · 完成新手村课程</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== MENTOR: Evaluation (Desktop) ====== */
function pageMentorEvaluation() {
  const evalItems = [
    { dim: '技术能力', hint: '剪辑软件熟练度、技术规范执行、导出设置准确性' },
    { dim: '审美能力', hint: '色彩搭配、画面构图、视觉风格一致性' },
    { dim: '内容理解', hint: '网感、叙事逻辑、信息密度控制、受众意识' },
    { dim: '协作能力', hint: '沟通效率、反馈响应速度、团队配合度' },
    { dim: '叙事逻辑', hint: '故事结构、情绪曲线设计、节奏把控' },
    { dim: '调色能力', hint: '色彩风格统一、达芬奇调色熟练度' }
  ];
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5-n);
  const evalRows = evalItems.map((e, i) => `
    <div style="padding:14px 0;border-bottom:1px solid var(--gray-100);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:14px;font-weight:600;">${e.dim}</span>
        <span class="star-rating" style="font-size:18px;cursor:pointer;" id="stars-${i}">
          <span onclick="this.parentElement.innerHTML='${stars(1)}'" style="cursor:pointer;">★</span>
          <span onclick="this.parentElement.innerHTML='${stars(2)}'" style="cursor:pointer;">★</span>
          <span onclick="this.parentElement.innerHTML='${stars(3)}'" style="cursor:pointer;">★</span>
          <span onclick="this.parentElement.innerHTML='${stars(4)}'" style="cursor:pointer;">☆</span>
          <span onclick="this.parentElement.innerHTML='${stars(5)}'" style="cursor:pointer;">☆</span>
        </span>
      </div>
      <div style="font-size:12px;color:var(--gray-400);margin-bottom:8px;">${e.hint}</div>
      <input type="text" style="width:100%;border:1px solid var(--gray-200);border-radius:6px;padding:8px 10px;font-size:12px;" placeholder="具体评价（可选）...">
    </div>
  `).join('');

  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>📋 季度评价 · 小夏</h2>
      <p>Q2 2026 · 学员自评已提交 · 你的评价权重 50%</p>
    </div>
    <div style="display:flex;gap:8px;">
      <span class="tag tag-green">学员自评已提交</span>
      <span class="tag tag-orange">待你评价</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:360px 1fr;gap:16px;">
    <!-- Left: Student Data -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="card">
        <div class="card-header"><h4>👤 学员信息</h4></div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--primary-500);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:600;">夏</div>
          <div>
            <div style="font-size:16px;font-weight:600;">小夏</div>
            <div style="font-size:13px;color:var(--gray-400);">剪辑师 · 入职 8 个月 · L2 铜牌</div>
          </div>
        </div>
        <div style="font-size:13px;color:var(--gray-500);line-height:1.7;">
          <div>📊 本季度完成项目：<strong>3 个</strong></div>
          <div>📚 课程完成率：<strong>87%</strong></div>
          <div>⏱️ 平均学习时长：<strong>35 分钟/天</strong></div>
          <div>🎯 能力平均增长：<strong>+0.4 级</strong></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h4>📊 Agent 数据汇总</h4></div>
        <div class="radar-placeholder" style="width:160px;height:160px;">
          <svg viewBox="0 0 200 200">
            <polygon points="100,20 170,70 150,150 50,150 30,70" fill="none" stroke="#EBECF0" stroke-width="1"/>
            <polygon points="100,55 145,82 132,128 68,128 55,82" fill="rgba(51,112,255,0.12)" stroke="#3370FF" stroke-width="1.5"/>
            <circle cx="100" cy="55" r="2.5" fill="#3370FF"/><text x="100" y="42" text-anchor="middle" font-size="9" fill="#8F959E">技术3.2</text>
            <circle cx="145" cy="82" r="2.5" fill="#3370FF"/><text x="160" y="82" text-anchor="start" font-size="9" fill="#8F959E">审美2.8</text>
            <circle cx="132" cy="128" r="2.5" fill="#3370FF"/><text x="148" y="133" text-anchor="start" font-size="9" fill="#8F959E">内容2.5</text>
            <circle cx="68" cy="128" r="2.5" fill="#3370FF"/><text x="52" y="133" text-anchor="end" font-size="9" fill="#8F959E">协作3.5</text>
            <circle cx="55" cy="82" r="2.5" fill="#3370FF"/><text x="40" y="82" text-anchor="end" font-size="9" fill="#8F959E">叙事2.6</text>
          </svg>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--gray-400);text-align:center;">Agent 自动汇总 · 季度平均数据</div>
      </div>

      <div class="card">
        <div class="card-header"><h4>📝 学员自评摘要</h4></div>
        <div style="font-size:13px;color:var(--gray-600);line-height:1.7;padding:10px;background:var(--gray-50);border-radius:8px;">
          "本季度最大的成长是独立完成了《城市夜行》项目，学会了用达芬奇做风格化调色。最大的挑战是情感类纪录片的节奏把控，希望下季度能在这方面有突破。"
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--gray-400);">自评总分：3.2 / 5.0</div>
      </div>
    </div>

    <!-- Right: Evaluation Form -->
    <div class="card">
      <div class="card-header">
        <h4>🎓 导师评价</h4>
        <span class="tag tag-purple">权重 50%</span>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--gray-500);margin-bottom:8px;">整体印象</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm">🌟 超出预期</button>
          <button class="btn btn-secondary btn-sm" style="border-color:var(--primary-500);color:var(--primary-500);">✓ 符合预期</button>
          <button class="btn btn-secondary btn-sm">📈 有待提升</button>
          <button class="btn btn-secondary btn-sm">⚠️ 需关注</button>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--gray-500);margin-bottom:8px;">各维度评分（1-5星）</div>
        ${evalRows}
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;color:var(--gray-500);display:block;margin-bottom:6px;">综合评价</label>
        <textarea style="width:100%;height:80px;border:1px solid var(--gray-200);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit;" placeholder="对小夏本季度的综合表现进行评价..."></textarea>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;color:var(--gray-500);display:block;margin-bottom:6px;">推荐语（用于晋升审核）</label>
        <textarea style="width:100%;height:60px;border:1px solid var(--gray-200);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit;" placeholder="是否推荐该学员晋升？请说明理由..."></textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-secondary btn-sm">保存草稿</button>
        <button class="btn btn-primary btn-sm">提交评价</button>
      </div>
    </div>
  </div>
</div>`;
}

/* ====== MENTOR: Points (Desktop) ====== */
function pageMentorPoints() {
  return `<div class="desktop-page">
  <div class="page-header">
    <div>
      <h2>💎 导师积分中心</h2>
      <p>积分自动累计 · 每季度末可兑换</p>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-secondary btn-sm">本月</button>
      <button class="btn btn-primary btn-sm">兑换记录</button>
    </div>
  </div>

  <!-- Top: Points Card -->
  <div class="points-card" style="margin-bottom:20px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div class="points-value">286</div>
        <div class="points-label">当前积分</div>
        <div style="font-size:12px;opacity:0.6;margin-top:4px;">本月 +68 分 · 排名 #3</div>
      </div>
      <div style="display:flex;gap:12px;">
        <div style="text-align:center;">
          <div style="font-size:24px;font-weight:700;">12</div>
          <div style="font-size:11px;opacity:0.7;">辅导小时</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:24px;font-weight:700;">8</div>
          <div style="font-size:11px;opacity:0.7;">预审通过</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:24px;font-weight:700;">2</div>
          <div style="font-size:11px;opacity:0.7;">案例拆解</div>
        </div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <!-- Left: Points History -->
    <div class="card">
      <div class="card-header"><h4>📜 积分变动明细</h4><span class="tag tag-blue">自动累计</span></div>
      <div style="display:flex;flex-direction:column;gap:0;">
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--success-50);color:var(--success-600);">+10</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">一对一辅导 · 小夏</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-18 · 时长 1 小时</div>
          </div>
          <span class="tag tag-green">+10</span>
        </div>
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--primary-50);color:var(--primary-600);">+2</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">作品预审通过 · 小林</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-17 · 《故乡的味道》初剪</div>
          </div>
          <span class="tag tag-blue">+2</span>
        </div>
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--success-50);color:var(--success-600);">+10</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">一对一辅导 · 小张</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-15 · 时长 1 小时</div>
          </div>
          <span class="tag tag-green">+10</span>
        </div>
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--agent-practice-light);color:var(--agent-practice);">+20</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">案例拆解发布</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-12 · 《B-roll快速切换技巧》</div>
          </div>
          <span class="tag tag-purple">+20</span>
        </div>
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--primary-50);color:var(--primary-600);">+2</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">作品预审通过 · 小夏</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-10 · 《城市夜行》初剪</div>
          </div>
          <span class="tag tag-blue">+2</span>
        </div>
        <div class="lb-row">
          <div class="lb-avatar" style="background:var(--success-50);color:var(--success-600);">+10</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">一对一辅导 · 小李</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-08 · 时长 1 小时</div>
          </div>
          <span class="tag tag-green">+10</span>
        </div>
        <div class="lb-row" style="border-bottom:none;">
          <div class="lb-avatar" style="background:var(--warning-50);color:var(--warning-600);">+50</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">学员晋升奖励 · 小刘升至L2</div>
            <div style="font-size:12px;color:var(--gray-400);">2026-04-05 · 所带学员通过等级认证</div>
          </div>
          <span class="tag tag-orange">+50</span>
        </div>
      </div>
    </div>

    <!-- Right: Leaderboard -->
    <div class="card">
      <div class="card-header"><h4>🏆 导师积分排行榜</h4><span class="tag tag-gray">本月</span></div>
      <div style="display:flex;flex-direction:column;gap:0;">
        <div class="lb-row" style="background:var(--warning-50);">
          <div class="lb-rank top">🥇</div>
          <div class="lb-avatar">阿杰</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;">阿杰</div>
            <div style="font-size:12px;color:var(--gray-400);">资深剪辑师 · 带教学员 4 人</div>
          </div>
          <div style="font-size:16px;font-weight:700;color:var(--warning-600);">342</div>
        </div>
        <div class="lb-row" style="background:var(--gray-50);">
          <div class="lb-rank top">🥈</div>
          <div class="lb-avatar">Lisa</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;">Lisa</div>
            <div style="font-size:12px;color:var(--gray-400);">制片人 · 案例拆解 5 个</div>
          </div>
          <div style="font-size:16px;font-weight:700;color:var(--gray-500);">315</div>
        </div>
        <div class="lb-row" style="background:var(--agent-practice-light);">
          <div class="lb-rank top">🥉</div>
          <div class="lb-avatar" style="background:var(--primary-500);color:#fff;">我</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;">你（当前）</div>
            <div style="font-size:12px;color:var(--gray-400);">剪辑师 · 辅导 12 小时</div>
          </div>
          <div style="font-size:16px;font-weight:700;color:var(--primary-600);">286</div>
        </div>
        <div class="lb-row">
          <div class="lb-rank">4</div>
          <div class="lb-avatar">小林</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:500;">小林</div>
            <div style="font-size:12px;color:var(--gray-400);">编导 · 预审通过 15 次</div>
          </div>
          <div style="font-size:15px;font-weight:600;color:var(--gray-700);">240</div>
        </div>
        <div class="lb-row">
          <div class="lb-rank">5</div>
          <div class="lb-avatar">小陈</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:500;">小陈</div>
            <div style="font-size:12px;color:var(--gray-400);">摄影师 · 辅导 8 小时</div>
          </div>
          <div style="font-size:15px;font-weight:600;color:var(--gray-700);">198</div>
        </div>
        <div class="lb-row" style="border-bottom:none;">
          <div class="lb-rank">6</div>
          <div class="lb-avatar">小王</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:500;">小王</div>
            <div style="font-size:12px;color:var(--gray-400);">剪辑师 · 案例拆解 2 个</div>
          </div>
          <div style="font-size:15px;font-weight:600;color:var(--gray-700);">156</div>
        </div>
      </div>

      <!-- Redeem Section -->
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-100);">
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;">🎁 积分兑换</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <div style="flex:1;min-width:140px;padding:12px;border:1px solid var(--gray-200);border-radius:8px;text-align:center;">
            <div style="font-size:20px;margin-bottom:4px;">📚</div>
            <div style="font-size:13px;font-weight:500;">1天培训预算</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:2px;">100 积分</div>
            <button class="btn btn-primary btn-sm" style="margin-top:8px;width:100%;">兑换</button>
          </div>
          <div style="flex:1;min-width:140px;padding:12px;border:1px solid var(--gray-200);border-radius:8px;text-align:center;">
            <div style="font-size:20px;margin-bottom:4px;">☕</div>
            <div style="font-size:13px;font-weight:500;">半天调休</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:2px;">500 积分</div>
            <button class="btn btn-secondary btn-sm" style="margin-top:8px;width:100%;" disabled>差 214 分</button>
          </div>
          <div style="flex:1;min-width:140px;padding:12px;border:1px solid var(--gray-200);border-radius:8px;text-align:center;">
            <div style="font-size:20px;margin-bottom:4px;">🏆</div>
            <div style="font-size:13px;font-weight:500;">年度大奖提名</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:2px;">1000 积分</div>
            <button class="btn btn-secondary btn-sm" style="margin-top:8px;width:100%;" disabled>差 714 分</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

/* ---------- Start ---------- */
init();
