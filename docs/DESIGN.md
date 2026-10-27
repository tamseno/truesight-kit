---
title: "TrueSight 动画母版 v3"
subtitle: "不是一套模板，而是一座素材库：风格 × 元素 × 动作 × 布局，由 agent 每期组合出自己的画面"
---

# 1. 这是什么

写一份 `script.json`，出一部 **1920×1080 / 60 fps** 的视频（正式片每帧 4 子帧运动模糊）。引擎按旁白逐词卡点、确定性逐帧渲染，配乐和音效自动混音。

v3 的核心变化：**母版不再规定画面长什么样**。它提供四层可以自由组合的素材，由做视频的 agent 按每期内容拼出不同的画面：

| 层 | 是什么 | 数量 | 在脚本里怎么用 |
|---|---|---|---|
| 风格 look | 整部片的视觉身份：字体、配色、卡片质感、背景纹理、动效节奏、默认转场、字幕样式 | 7 | `"meta": { "look": "editorial" }` |
| 元素 element | 画面积木：文字、数字、卡片、窗口、浏览器、手机、终端、代码、聊天气泡、通知、推文、PR、文件树、列表、表格、图表、格子阵、箭头、印章、光标、便签…… | 40 | compose 场景里的 `"el"` |
| 动作 motion | 入场、文字动画、强调、循环、移动、退场，可叠加，挂在旁白的词上 | 66 | `"in": "rise@词"`, `"do": ["pulse@词"]` |
| 布局 layout | 把画面分成槽位：分栏、三栏、网格、bento、英雄位、环形、层叠…… | 17 | `"layout": "bento"` |

另外有 26 个**现成组合（recipe）**——原来的场景模板（对话、编辑器、看板、对比、反馈循环、章节卡……）。它们同样跟随风格换装，但每期最多占六成，同一个最多用 3 次，不能连着用。

- 位置：`D:\hark\truesight-kit`
- 素材目录（自动生成，含每个元素的可用示例）：`docs/CATALOG.md` / `docs/catalog.json`
- 素材样片（agent 可以直接看图）：`docs/gallery/`——`looks.jpg`（同一场景的 7 种风格）、`elements-*.jpg`、`motions-*.jpg`（每个动作 5 帧分解）、`layouts.jpg`
- agent 制作规范：`docs/AGENT.md`（Claude Code 在项目里会通过根目录 `CLAUDE.md` 自动读到）
- 示范：`episodes/compose-demo`（7 个自由组合场景，neon 风格）、`episodes/grokbot-dev`（全部用旧模板做的一期，可作对照）

```
truesight-kit/
  CLAUDE.md               agent 入口：指向 docs/AGENT.md
  brand.json              品牌默认值（角色、配色、默认 look）
  assets/                 配乐、频道 logo
  core/
    engine.js             引擎：时间轴、镜头、转场、标题、字幕、章节条、警告收集、QA
    looks.js              7 种风格
    style.css             设计变量（所有颜色/字体/质感都是变量，由风格写入）
    lib/motion.js         动作库 + 姿态合成器（多个动作叠加在同一元素上）
    lib/elements.js       元素库
    lib/layout.js         布局库
    lib/catalog.js        素材目录导出 + 每个元素的示例
    archetypes/compose.js 自由组合场景
    archetypes/*.js       26 个现成组合
  tools/
    make.ps1              draft / preview / voice / final 一键
    render.mjs            逐帧渲染；look= 换风格预览；lint=1 校验；catalog=1 导出目录；qa=1 质检
    variety.py            多样性检查（这期是不是又做成了同一部片）
    gallery.py            生成素材样片 docs/gallery/
    timeline.py · voice_index.py · align.py · mix.py · chapters.py · sheet.py
```

# 2. 一期怎么做

1. 复制 `episodes\_template`，**先选风格**（按题材气质，并且和最近两期错开），每章一个主题色。
2. 写旁白（每句一行，≤ 18 词，多用能画出来的具体名词），再给每个场景写一句“观众看到什么”。
3. 场景用 `compose` 组合为主，结构正好吻合时才用现成组合。
4. `make.ps1 -Stage draft` → `render.mjs lint=1`（卡点词、素材名、构建错误）→ `variety.py`（多样性硬规则）→ 看 `sheet.jpg`。
5. `-Stage preview` 看动态 → `-Stage voice` 正式配音 + 逐词对齐 → `-Stage final -Fresh` 出片 + 章节时间戳。

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

| 风格 | 气质 | 字体 | 背景 | 动效节奏 |
|---|---|---|---|---|
| clean | 友好的产品发布感 | Geist | 漂移的粉彩光斑 | 默认弹簧 |
| editorial | 杂志/分析：衬线标题、细线、纸面、单一红色强调 | Georgia + Geist | 纸面横线 | 慢、稳、无倾斜 |
| blueprint | 工程图：深蓝网格、青色线框、DIN 窄体、等宽标注 | Bahnschrift + JetBrains Mono | 移动的蓝图网格 | 利落、无模糊 |
| neon | 夜间产品片：近黑、发光边、电紫和青 | Geist + JetBrains Mono | 缓慢扫动的光束 | 有冲劲 |
| brutal | 新粗野主义：饱和纯色、4px 黑描边、硬投影、粗黑体 | Arial Black | 网点 | 硬、快、无模糊 |
| glass | 高端消费科技：磨砂玻璃卡片、饱和色场、几何字体 | Century Gothic + Geist | 浓郁光斑 | 柔和 |
| terminal | 黑客终端：黑绿荧光、全等宽、扫描线、硬切 | JetBrains Mono | CRT 扫描线 | 极快、硬切 |

风格通过设计变量生效：所有元素和现成组合只用变量（`var(--ink)`、`var(--surface)`、`var(--fd)`…），所以换风格时整部片一起换装。每期还可以在 `meta.tokens` 里改单个变量（比如强调色），在 `meta.feel` 里调动效节奏。系统字体（Georgia、Bahnschrift 等）只在本机引用，不进仓库。

# 5. 通用规范（所有风格共享）

- **画布**：1920×1080；内容区 x 88–1832，有标题时 y 240–872，无标题 y 110–910；字幕在 968–1036。
- **字号下限**：正文 ≥ 26，次要 ≥ 22，全大写标签 ≥ 20；`qa=1` 自动检查（装饰性文字用 `data-noqa` 免检）。
- **镜头**：每场景默认 1.8% 慢推；关键帧缩放 ≤ 1.08；≤ 1.04 的轻推不会裁切内容区，≥ 1.07 的刻意特写才允许裁切；镜头不会把内容推到标题下。
- **转场**：旧画面 0.3 秒内退场；`lift` `slide` `zoom` `push` `whip`（甩镜）`wipe`（章节）`cut`。
- **节奏**：每 2–4 秒画面有新东西；元素在说到它的那个词出现；一个词上只放一个强调。
- **音效**：全部合成，12 种，每种 3 个变体；compose 元素按类型自动配音效，也可指定 `sfx`。
- **禁用**：卡通回弹、粒子爆炸、所有元素同时淡入、无变化的停顿、只为装饰的红绿色、两个场景文字重影。

# 6. 已知限制

- 风格用到的系统字体只保证本机可用；换机器需要同样的 Windows 字体，或在 `looks.js` 里换成仓库自带字体。
- `phone` / `browser` 默认是示意 mock；有真实截图时用 `image` 属性。
- 数字和引用需要标来源（现成组合自带；compose 里用 `source` 元素）。
