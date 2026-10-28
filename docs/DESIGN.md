---
title: "TrueSight 动画母版 v3"
subtitle: "不是一套模板，而是一座素材库：风格 × 元素 × 动作 × 布局，由 agent 每期组合出自己的画面"
---

# 1. 这是什么

写一份 `script.json`，出一部 **60 fps** 的视频：横屏长视频 1920×1080、竖屏短视频 1080×1920（YouTube Shorts / TikTok / Reels）、信息流方屏 1080×1080 或 4:5 的 1080×1350（见第 6 节）。正式片每帧 4 子帧运动模糊。引擎按旁白逐词卡点、确定性逐帧渲染，配乐和音效自动混音。

v3 的核心变化：**母版不再规定画面长什么样**。它提供四层可以自由组合的素材，由做视频的 agent 按每期内容拼出不同的画面：

| 层 | 是什么 | 数量 | 在脚本里怎么用 |
|---|---|---|---|
| 风格 look | 整部片的视觉身份：字体、配色、卡片质感、底色、动效节奏、默认转场、字幕样式 | 7 | `"meta": { "look": "editorial" }` |
| 元素 element | 画面积木：文字、数字、卡片、窗口、浏览器、手机、终端、代码、聊天气泡、通知、推文、PR、列表、表格、图表、格子阵、箭头、印章；人物、商品、评分、饼图、占比条、排行、漏斗、KPI、里程碑、世界地图、录屏片段…… | 51 | compose 场景里的 `"el"` |
| 动作 motion | 入场、文字动画、强调、循环、移动、退场，可叠加，挂在旁白的词上 | 66 | `"in": "rise@词"`, `"do": ["pulse@词"]` |
| 布局 layout | 把画面分成槽位：分栏、三栏、网格、bento、英雄位、环形、层叠…… | 17 | `"layout": "bento"` |

另外有 25 个**现成组合（recipe）**——原来的场景模板（对话、编辑器、看板、对比、反馈循环、章节卡……）。它们同样跟随风格换装，但每期最多占六成，同一个最多用 3 次，不能连着用。

- 位置：`D:\hark\truesight-kit`
- 素材目录（自动生成，含每个元素的可用示例）：`docs/CATALOG.md` / `docs/catalog.json`
- 素材样片（agent 可以直接看图）：`docs/gallery/`——`looks.jpg`（同一场景的 7 种风格）、`elements-*.jpg`、`motions-*.jpg`（每个动作 5 帧分解）、`layouts.jpg`、`formats.jpg`（同几个场景在 4 种画幅下的样子）
- agent 入口：根目录 `AGENTS.md`（Claude、Codex、Cursor、Gemini、Copilot 等都读它）；完整流程 `docs/PLAYBOOK.md`；
  技能 `truesight-video` 在 `.agents/skills/`（`.claude/skills/` 里是同一份）。`python tools/ts.py next <剧集>` 直接告诉你下一步跑什么。
- 做画面的规范：`docs/AGENT.md`
- 示范：`episodes/compose-demo`（7 个自由组合场景，neon 风格）、`episodes/grokbot-dev`（全部用旧模板做的一期，可作对照）

```
truesight-kit/
  CLAUDE.md               agent 入口：指向 docs/AGENT.md
  brand.json              品牌默认值（角色、配色、默认 look）
  kit.config.json         本机路径（配音 / 对齐环境、模型、代理、Chrome），从 kit.config.example.json 复制
  assets/                 配乐（bgm/gen 为生成的情绪曲库）、频道 logo
  core/
    engine.js             引擎：时间轴、镜头、转场、标题、字幕、章节条、警告收集、QA
    looks.js              7 种风格
    formats.js            4 种画幅（横屏 / 竖屏短视频 / 方屏 / 4:5）
    style.css             设计变量（所有颜色/字体/质感都是变量，由风格写入）
    lib/motion.js         动作库 + 姿态合成器（多个动作叠加在同一元素上）
    lib/elements.js       元素库（界面类：窗口、浏览器、手机、终端、代码、PR、聊天……）
    lib/elements2.js      元素库（通用题材：人物、商品、评分、饼图、占比条、排行、漏斗、KPI、里程碑、世界地图、视频片段）
    lib/icons.js          图标（共 108 个，任何题材都够用）
    lib/layout.js         布局库
    lib/catalog.js        素材目录导出 + 每个元素的示例
    archetypes/compose.js 自由组合场景
    archetypes/*.js       25 个现成组合（加上 compose 共 26 种场景）
  tools/
    ts.py                 总入口：next（这一期到哪一步、下一条命令）· new · status · guide · doctor
    make.py               一期一条命令：draft / preview / voice / final / all（make.ps1 只是转发）
    batch.py              批量出片：多期排队、配音与渲染并行、失败不中断、日志在 queue/
    cutdown.py            长视频 → 短视频草稿
    thumb.py · publish.py 缩略图 / 封面三选一；标题、简介、章节、来源、标签、TikTok 文案 + 字幕 SRT
    bgm.py                生成情绪配乐库（10 种情绪 × 3 首，原创无版权）
    ingest.py · shot.mjs  录屏 / 视频转成片段素材；网页截图（可整页滚动）
    kitcfg.py             读取本机配置
    render.mjs            逐帧渲染；look= 换风格预览；lint=1 校验；catalog=1 导出目录；qa=1 质检
    variety.py            多样性检查（这期是不是又做成了同一部片）
    review.py             成片复查：转场拼图、场景拼图、静止画面 / 响度 / 静音报告
    gallery.py            生成素材样片 docs/gallery/
    timeline.py · voice_index.py · align.py · mix.py · chapters.py · sheet.py
```

# 2. 一期怎么做

1. 复制 `episodes\_template`（短视频用 `_template-short`，或用 `cutdown.py` 从长视频生成草稿），**先选风格**（按题材气质，并且和最近两期错开），每章一个主题色。
2. 写旁白（每句一行，≤ 18 词，多用能画出来的具体名词），再给每个场景写一句“观众看到什么”。
3. 场景用 `compose` 组合为主，结构正好吻合时才用现成组合。
4. `python tools/make.py episodes\<名字> draft`：配音时间轴 → lint → 截图 + QA → `sheet.jpg` → 多样性检查，全部通过再往下。
5. `preview` 看动态 → `voice` 正式配音 + 逐词对齐 → `final`：出片后自动跑章节、成片复查（review）、三张缩略图 / 封面、发布清单 `publish.md` 和字幕 `captions.srt`。
6. 批量：脚本里写 `"status": "ready"`，一条 `python tools/batch.py all --ready --pipeline` 把所有待出片的一期接一期做完（下一期配音和这一期渲染同时进行）；晚上加 `--quiet`。
7. 脚本 meta 里的 `music`（情绪）、`thumb`（缩略图文字 / 数字 / 图片）、`publish`（标题、简介、标签、置顶评论）决定配乐和发布物料，见 `docs/AGENT.md` 第 1 节。

换风格不用改脚本：`node tools/render.mjs ep=… scenes=s03 at=.9 out=probe look=brutal`。

# 3. compose 场景一眼看懂

```json
{ "id": "s07", "type": "compose", "theme": "mint", "title": "The bot actually looks",
  "lines": ["It opens the preview, finds the clipped button, and sends it back."],
  "data": {
    "layout": { "type": "hero-r", "ratio": 0.55 },
    "els": [
      { "id": "shot", "el": "browser", "slot": "visual", "url": "preview.app", "in": "tilt@opens" },
      { "el": "text", "slot": "text", "style": "title", "text": "Clipped at *320pt*", "in": "words@clipped", "do": ["hl@clipped+0.4"] },
      { "el": "stamp", "box": [1180, 700, 360, 120], "text": "SENT BACK", "tone": "bad", "in": "stamp@sends" }
    ],
    "beats": [ { "at": "clipped", "cam": { "focus": "shot", "z": 1.06 } } ] } }
```

- 元素放哪：`slot`（布局槽位）、`box: [x, y, w, h]`、或 `x/y/w/h`。
- 动作写法：`"名字@旁白里的词"`，可加偏移 `+0.3`，也可写秒数；`in` 入场、`do` 强调/移动、`out` 退场、`loop` 循环，可以同时用。
- `beats`：镜头推近某元素、景深聚焦（其他元素虚化）、在某个词上触发额外动作或音效。
- 详细规则和 10 种常用画面套路见 `docs/AGENT.md`。

# 4. 风格（look）

| 风格 | 气质 | 字体 | 底色 | 动效节奏 |
|---|---|---|---|---|
| clean | 友好的产品发布感 | Geist | 漂移的粉彩光斑 | 默认弹簧 |
| editorial | 杂志/分析：衬线标题、细线描边卡片、暖纸色、单一红色强调 | Georgia + Geist | 暖纸色柔光 | 慢、稳、无倾斜 |
| blueprint | 工程夜色：深蓝渐变、青色描边、DIN 窄体、等宽标注 | Bahnschrift + JetBrains Mono | 深蓝柔光 | 利落、无模糊 |
| neon | 夜间产品片：近黑、发光边、电紫和青 | Geist + JetBrains Mono | 近黑带紫青辉光 | 有冲劲 |
| brutal | 新粗野主义：饱和纯色、4px 黑描边、硬投影、粗黑体 | Arial Black | 饱和纯色 | 硬、快、无模糊 |
| glass | 高端消费科技：磨砂玻璃卡片、饱和色场、几何字体 | Century Gothic + Geist | 浓郁光斑 | 柔和 |
| terminal | 黑客终端：黑绿荧光、全等宽、硬切 | JetBrains Mono | 黑绿柔光 | 极快、硬切 |

风格通过设计变量生效：所有元素和现成组合只用变量（`var(--ink)`、`var(--surface)`、`var(--fd)`…），所以换风格时整部片一起换装。每期还可以在 `meta.tokens` 里改单个变量（比如强调色），在 `meta.feel` 里调动效节奏。系统字体（Georgia、Bahnschrift 等）只在本机引用，不进仓库。

# 5. 通用规范（所有风格共享）

- **画布**（横屏）：1920×1080；内容区 x 88–1832，有标题时 y 240–872，无标题 y 110–910；字幕在 968–1036。其他画幅见第 6 节和 `core/formats.js`。
- **字号下限**：正文 ≥ 26，次要 ≥ 22，全大写标签 ≥ 20；`qa=1` 自动检查（装饰性文字用 `data-noqa` 免检）。
- **镜头**：每场景默认 1.8% 慢推；关键帧缩放 ≤ 1.08；≤ 1.04 的轻推不会裁切内容区，≥ 1.07 的刻意特写才允许裁切；镜头不会把内容推到标题下。
- **转场**：旧画面 0.3 秒内退场；`lift` `slide` `zoom` `push` `whip`（甩镜）`wipe`（章节）`cut`。
- **节奏**：每 2–4 秒画面有新东西；元素在说到它的那个词出现；一个词上只放一个强调。
- **画面不能干等**：compose 场景在念旁白时超过 4.5 秒画面没有任何新变化，lint 会报 `dead air`，加一拍（focus / cam / do）或拆场景。
- **wipe 转场**：一条斜带连续扫过，带子后面露出新场景，前面还是旧场景（背景、字幕一起分开），不会整屏停在一块色板上。
- **QA 对比度检查**：文字和它所在卡片底色对比度低于 2.2 会列进 `qa.json`（比如深色风格里浅色字压在浅色卡片上）。
- **转场后不留空画面**：compose 场景没有标题时，第一个撑得起画面的元素（不是小标签）会跟着转场一起到（哪怕它的词稍后才说）；有标题时标题栏先撑住第一秒，只有等待超过约 1.2 秒才会整组提前（保留组内先后）；确实想留一拍空白时在场景 data 里写 `"open": "late"`。背景色跟着转场走：硬切瞬间换、wipe 在遮挡板下换、whip 在模糊里换。前后两个场景标题相同，标题栏保持不动。
- **音效**：全部合成，12 种，每种 3 个变体；compose 元素按类型自动配音效，也可指定 `sfx`。
- **禁用**：卡通回弹、粒子爆炸、所有元素同时淡入、无变化的停顿、只为装饰的红绿色、两个场景文字重影。
- **背景只用柔和的色彩**（渐变、漂移光斑、暗角、颗粒）。任何风格都不用网格、点阵、扫描线、雷达式光束、横线纸面这类纹理背景，也不能用 shape / html 元素叠一层全屏纹理。

# 6. 画幅：长视频、Shorts / TikTok、信息流

同一套库覆盖所有视频类型，脚本里写 `"meta": { "format": "…" }`（不写就是 landscape）：

| 画幅 | 画布 | 用在哪 | 字幕 |
|---|---|---|---|
| `landscape` | 1920×1080 | YouTube 长视频 | 胶囊式逐词字幕 |
| `vertical`（别名 `short`） | 1080×1920 | YouTube Shorts、TikTok、Reels | 短视频大字幕：一次 1–3 个词、描边、正在说的词高亮 |
| `square` | 1080×1080 | Instagram / LinkedIn / X 信息流 | 胶囊式 |
| `portrait` | 1080×1350 | Instagram / Facebook 信息流（4:5） | 胶囊式 |

一律 60 fps。选了画幅之后自动跟着变的：画布尺寸、标题位置（窄画布自动换行）、内容区、元素放大倍数（竖屏 1.5 倍，手机上字更大）、字幕样式、进度条、各平台的安全区、编码（横屏 HEVC，其余 H.264，TikTok / Reels 更兼容）。

- **布局自动重排**：内容区是竖的时候，左右分栏类布局（split、hero、row、thirds、cols、bento、grid、cascade、columns-hero）自动变成上下堆叠，槽位名不变——用槽位搭的场景换画幅不用改。手写的 `box` 是画布像素，不会重排，超出画布时 lint 会警告。
- **哪些现成组合能跨画幅**：`compose`、`chapter`、`endcard`、`statement`、`chat`。其余现成组合标为 landscape only，在别的画幅里会缩小放进内容区并警告，短视频里应改用 compose（code、list、terminal、table、pr、phone 元素都能替代）。
- **竖屏安全区**（`qa=1` 自动检查）：顶部 200 px（平台顶栏）、底部 470 px（标题、简介、按钮）、中线以下右侧 132 px（点赞 / 评论 / 分享那一列）。内容区 x 72–948、y 236–1290 本身就在安全区内，大字幕在 y ≈ 1372。

**做一条好短视频的规矩**

1. 20–60 秒，5–9 个场景，每个 2.5–6 秒，全部用 compose；一个画面只讲一件事、只有一个主角。
2. 第一秒就是钩子：第一帧已经亮出观点或数字，不要从空画面淡入、不要片头、不要标题卡；第一句 ≤ 8 个词。
3. 一般不用标题栏，把空间留给画面；字要大（display / huge），每行 1–4 个词。
4. 语速略快（edge_rate +5%–+10%），每 1.5–3 秒画面有变化；转场用 cut / whip / zoom，不用章节卡。
5. 不做片尾页（Shorts 没有结束画面）：最后一句接回第一句形成循环，或者只放一个行动号召标签。
6. 手机上高对比的风格最好读：brutal、neon、clean、terminal。
7. 从长视频剪短视频：挑 5–8 个最强的 compose 场景复制进新一期，改成 vertical，旁白重写到 30–45 秒；用槽位搭的场景直接重排，手写 box 的重新摆。

示范：`episodes/grokbot-short`（brutal 风格，7 个场景，约 29 秒）；模板：`episodes/_template-short`。

# 7. 已知限制

- 风格用到的系统字体只保证本机可用；换机器需要同样的 Windows 字体，或在 `looks.js` 里换成仓库自带字体。
- `phone` / `browser` 默认是示意 mock；有真实截图时用 `image` 属性。
- 数字和引用需要标来源（现成组合自带；compose 里用 `source` 元素）。
