---
title: "TrueSight 动画母版（Motion Kit v1）"
subtitle: "从《Grok Bot × Claude Opus 5.5》28 个场景拆出来的可复用动画系统"
---

# 1. 这是什么

一套「写 JSON 就出片」的动画系统。下期视频只需要写一份 `script.json`（每个场景：用哪个模板、旁白几句、画面里放什么），引擎会自动按旁白时间卡点出动画、渲染、配乐、编码成 MP4。

- 位置：`D:\hark\truesight-kit`
- 示范片：`episodes\grokbot-v2`（用母版把这期重做了一遍，22 个场景，全部由模板生成，零手写场景代码）
- 原片 28 个手写场景保留在 `reference\grokbot-v1\scenes`，需要特殊画面时可以抄

```
truesight-kit/
  brand.json              品牌：角色、配色、主题（全频道共用）
  core/
    engine.js             引擎：时间轴、转场、标题、字幕、章节条、STEP 角标、QA
    style.css             视觉 token
    fonts/                Geist / Noto Sans SC / Maple Mono
    archetypes/*.js       15 个场景模板
  tools/
    make.ps1              一键：draft / preview / final
    timeline.py           旁白 → 逐词时间 → timeline.json + narration.wav
    render.mjs            确定性逐帧渲染（可续跑、可出静帧、可 QA、可手动拖时间预览）
    mix.py                配乐（低于人声约 27 dB，自动闪避）+ 音效
    sheet.py              静帧拼图
  episodes/
    _template/            新一期从这里复制
    grokbot-v2/           示范片
  reference/grokbot-v1/   原片源码
```

# 2. 新一期怎么做（5 步）

1. 复制 `episodes\_template` 为 `episodes\<新名字>`。
2. 写 `script.json`：每个场景选一个 `type`，写 `lines`（旁白，每句 ≤ 18 词）和 `data`（画面内容）。
3. 出草稿：`.\tools\make.ps1 -Ep episodes\<名字> -Stage draft`
   → 30 秒内得到每个场景两张静帧拼图 `sheet.jpg` + 小字/出框检查 `qa.json`。
4. 出预览：`-Stage preview` → 临时配音 + 完整 60fps 预览 MP4（这台机器 4 分钟片约几分钟）。
5. 出成片：先用 IndexTTS-2.5 生成正式配音（每句一个 wav + 逐词时间 json 放进 `tts\`），再 `-Stage final` → 4 子帧运动模糊、HEVC NVENC、响度 -14 LUFS。

需要手动拖时间看某一帧：`node tools\render.mjs ep=episodes\<名字> serve=1`，浏览器打开它给的地址，改 `?t=12.5`。

# 3. 场景数据怎么写

```json
{ "id": "s12", "type": "roster", "theme": "paper",
  "chapter": "2 · Five roles", "step": 2, "trans": "slide",
  "label": "The roster", "title": "Five bots, one job each",
  "lines": ["Step two. The Director turns your request into a storyboard.", "..."],
  "data": { "items": [ { "cast": "director", "role": "PLAN", "desc": "Request → storyboard", "at": "Director" } ] } }
```

| 字段 | 作用 |
|---|---|
| `type` | 用哪个模板（第 6 节）。不写 type 就找 `scenes/<id>.js` 手写场景 |
| `theme` | 背景主题：paper / mint / lavender / lilac / sky / sand / ice / peach / night |
| `chapter` | 顶部章节进度条按它分段（同名连续场景算一章） |
| `step` | 右上角显示 `STEP n / N`；不写就不显示 |
| `trans` | 进入本场景的转场：lift（默认）/ slide / zoom / cut |
| `label` `title` | 左上角小标签 + 大标题（逐字弹入）；不写 title 就是全屏场景 |
| `lines` | 旁白，每句一条 |
| `at` | **卡点**：写旁白里的一个词/短语，元素就在这个词说出来时出现；也可以写秒数；不写就自动均匀分布 |
| `*文字*` | 任何文字里用星号包起来 = 黄色荧光笔扫过 |

`meta.say` 可以写发音替换（只影响配音，不影响字幕），例如 `{"Grok": "Grock"}`。

# 4. 视觉规范（token）

**画布与网格**：1920×1080 · 左右边距 88 · 标题区 64–200 · 内容区 240–872 · 来源标签 892 · 字幕 968–1036。

**颜色**：墨色 `#15161c` · 次要灰 `#6b6e7b` · 红 `#f0443a`（错/风险）· 绿 `#1fbf75`（对/通过）· 蓝 `#3a6cf4` · 琥珀 `#f5a524` · 紫 `#8b5cf6` · 荧光黄 `#ffd66b`。红绿只表达对错，不做装饰。

**主题背景**：9 套浅色径向渐变 + 1 套 night（深蓝 + 星星，只给"夜间/结尾"用）。同一章节保持同一主题，换章节换主题，观众靠颜色感知进度。

**字体**：Geist（英文标题/正文）· Noto Sans SC（中文）· Maple Mono（代码、文件名、时间）。

**字号阶梯**（1080p，按手机可读定的下限）：

| 用途 | 字号 |
|---|---|
| 全屏金句 statement | 104–120 |
| 场景大标题 | 60 |
| 大数字 | 76–110 |
| 卡片标题 | 32–38 |
| 正文 / 列表 | 26–34 |
| 次要说明 | ≥ 22 |
| 全大写标签 / 角标 | ≥ 20 |

原片大量 14–17px 的小字在手机上看不清，母版全部提到下限以上，并且渲染时 `qa=1` 会自动列出不达标的文字。

**卡片**：白底 · 圆角 22 · 三层柔阴影 · 窗口卡带红黄绿三点标题栏 · 深色终端卡 `#16171f`。

**质感**：背景漂浮虚化圆点（视差）· 5% 胶片颗粒 · night 主题星星闪烁。

# 5. 动效规范

| 项 | 规范 |
|---|---|
| 主缓动 | expo-out（快进慢停）；双向用 cubic in-out |
| 弹簧 | 临界阻尼附近 z = 0.62，只有一点点过冲，**禁止卡通回弹** |
| 标准入场 | 上移 36px + 0.965→1 缩放 + 10° 前倾回正 + 6px 模糊变清，弹簧 1 秒 |
| 小元素 | pop：0.55→1 弹簧，可带 -30° 旋转回正（勾、叉、徽章） |
| 列表 | 先全部半透明占位（0.35–0.45），讲到哪条哪条变实；当前条加浅色底高亮 |
| 删除线 | 红线从左往右画，0.35 秒；被删的行同时降到 55% 透明 |
| 荧光笔 | 讲到时从左往右扫，0.45 秒 |
| 数字 | 从 0 计数到目标值，expo-out，约 0.9 秒 |
| 标题 | 逐字弹入，每字间隔 22ms |
| 字幕 | 底部深色胶囊，卡拉 OK 逐词变白，长句按标点自动断成 ≤ 54 字符一段 |
| 转场 | 0.5 秒重叠；lift（上浮模糊淡出）/ slide（横推）/ zoom（推近）/ cut（硬切，用在"Here's the catch"这类转折） |
| 相机 | 每个场景全程慢推 1.8% |
| 角色 | 一直轻微浮动、随机眨眼；被点名的角色眼睛看镜头，其他角色看向它 |
| 节奏 | 每 2–4 秒画面必须有新东西；全屏金句场景第一行最晚 0.3 秒出现 |
| 音效 | tick（列表）、pop（出现）、swoosh/whoosh（转场）、ding（完成）、click（按钮），全部很轻，和 BGM 一起压在人声下 |

**禁用清单**（和片中讲的 house style 一致，频道自己也遵守）：渐变背景上的居中标题 · 所有元素同时淡入 · 粒子爆炸 · 弹跳缓动 · 无画面变化的停顿 · 只是装饰的红绿色。

# 6. 15 个场景模板

| 模板 | 用途 | 原片里对应 | 关键 data |
|---|---|---|---|
| `hero` | 开场：成片先占满全屏 2–3 秒，再缩到右侧，标题从左边进 | e01 | `proof.frames/image`, `logos`, `title`, `meta` |
| `statement` | 全屏金句，逐词弹入，可多行，老的一行退成灰 | 新增 | `lines[{text, at}]`, `eyebrow`, `sub` |
| `versus` | 错的划掉 / 对的打勾；只写 left 就是禁用清单；可带底部结论条 | e02 e05 e08 e12 | `left`, `right`, `verdict` |
| `post` | 推文/引用作为证据，关键句讲到时荧光笔扫过，右侧"这意味着什么"或数据，自动来源标签 | e02 e04 | `author`, `text`, `hlAt`, `side`/`stats`, `source` |
| `flow` | 节点 + 曲线连线 + 流动光点：路由、共享、管线 | e04 e07 | `cols`, `edges`, `note` |
| `terminal` | 左清单打勾 + 右终端打字 + 进度条 | e09 e18 e21 | `list`, `term.cmd/out/progress` |
| `stats` | 大数字计数 + 对比条 + 来源标签 | e10 e20 | `items`, `bars`, `source` |
| `rules` | 编号规则文件，讲到哪条亮哪条 | e11 | `file`, `items[{text, code}]` |
| `stepper` | 状态机：圆点逐个打勾 + 大字显示当前状态 | e15 | `steps[{label, file}]`, `caption` |
| `grid` | 分镜/画廊格子按节拍弹出，底部审批按钮 | e17 | `items[{label, glyph}]`, `footer` |
| `scorecard` | 评分表：第 1 轮不及格标红、只退回最差 3 条，第 2 轮通过盖章 | e23 | `rows[{r1, r2, issue}]`, `side` |
| `clock` | 时间线 + 大时钟，播放头扫过事件 | e24 | `from`, `to`, `events` |
| `cards` | 问题 → 解法，2–4 列，解法从底部升起 | e26 | `items[{title, fix}]` |
| `checklist` | 结尾行动清单 + 解锁条 + 简介资源 | e27 e28 | `items`, `gate`, `resources` |
| `roster` | 角色卡一排，点名即亮，轨道上的小球跟着走 | e03 e13 | `items[{cast, role, desc, lines/code/big}]` |

模板覆盖不了的画面（比如原片 e01 的床和闹钟插画、e16 的弹簧曲线），照旧写 `scenes/<id>.js` 手写场景，引擎优先用手写的。原片 28 个场景都可以直接拿来改。

# 7. 相比原片升级了什么

1. **成片先行**：`hero` 前 2.6 秒直接放成片画面（带 REC 时间码和"Made overnight"标签），然后缩进卡片，解决"前 3 秒没证据"。
2. **章节进度条**：顶部分段进度条，每段一章，看得到"还剩多少"。
3. **STEP 角标**：右上角 `STEP 3 / 6`，解决原片步骤没编号的问题。
4. **来源标签**：所有数据、引用场景自动带 Source 标签。
5. **全屏金句场景**：原片 28 个场景都是"左上标题 + 卡片"同一种构图，母版加入全屏大字场景用于钩子、转折、结尾，打破单调。
6. **4 种转场**：原片只有一种，现在可按语气选，转折处用硬切。
7. **手机字号下限 + 自动 QA**：渲染静帧时自动列出小于 20–22px 的字和出框文字。
8. **内容区垂直居中**：条目少时卡片自动收紧居中，不再出现半张空卡片。
9. **按词卡点**：`at` 写旁白里的词即可，不用手算秒数；换配音后时间自动重算。
10. **结尾闭环**：示范片结尾用 night 主题金句回扣开头。

# 8. 已知限制

- 示范片用的是临时配音（edge-tts），只为对时间；正式片按原流程走 IndexTTS-2.5。
- 示范片开场的"成片"素材借用了原片画面（带原片字幕），正式使用时换成干净的成片帧。
- `stats` 里"用户报告的硬件"等数据沿用原片说法，发布前仍需核实来源。
