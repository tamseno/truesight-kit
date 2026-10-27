---
title: "TrueSight 动画母版 v2（Motion Kit v2）"
subtitle: "写 JSON 出 1080p60 长视频：25 个场景模板 + 跟随旁白的镜头 + 章节系统"
---

# 1. 这是什么

一套「写 JSON 就出片」的动画系统。每期只写一份 `script.json`（每个场景：用哪个模板、旁白几句、画面里放什么），引擎按旁白逐词卡点出动画，确定性逐帧渲染，配乐 + 音效混音，编码成 **1920×1080 / 60 fps** 的 MP4（正式片每帧 4 子帧运动模糊）。

- 位置：`D:\hark\truesight-kit`
- 示范片：
  - `episodes\grokbot-dev`（v2 示范，38 场景 ≈ 8 分钟：Grok Bot 做开发的完整打法，用到全部新模板）
  - `episodes\grokbot-v2`（v1 示范，22 场景）
- 原片手写场景保留在 `reference\grokbot-v1\scenes`

```
truesight-kit/
  brand.json              品牌：默认角色、配色、主题（全频道共用；每期可在 meta 里覆盖）
  assets/bgm/             配乐        assets/brand/logo.png   频道 logo（片尾用）
  core/
    engine.js             引擎：时间轴、镜头、转场、标题、字幕、章节条、QA
    style.css             视觉 token
    fonts/                Geist / Noto Sans SC / Maple Mono
    archetypes/*.js       25 个场景模板（_base.js 是共用工具）
  tools/
    make.ps1              一键：draft / preview / final
    timeline.py           旁白 → 逐词时间 → timeline.json + narration.wav
    voice_index.py        正式配音：IndexTTS-2.5 克隆频道声音，每句一个 wav（按文本缓存）
    align.py              正式配音逐词对齐：faster-whisper large-v3（CUDA）
    render.mjs            确定性逐帧渲染（可续跑、可出静帧、可 QA、可手动拖时间预览）
    mix.py                配乐（人声下约 27 dB，自动闪避）+ 合成音效
    chapters.py           从时间轴生成 YouTube 章节时间戳
    sheet.py              静帧拼图
  episodes/
    _template/            新一期从这里复制（长视频骨架）
    grokbot-dev/          v2 示范片（resources/ 里是简介要附的文件，youtube.md 是标题简介）
```

# 2. 新一期怎么做

1. 复制 `episodes\_template` 为 `episodes\<名字>`。
2. 写 `script.json`：每个场景选 `type`，写 `lines`（旁白，每句一条）和 `data`（画面内容）。
3. **草稿**（几十秒）：`.\tools\make.ps1 -Ep episodes\<名字> -Stage draft`
   → 每个场景两张静帧拼成 `sheet.jpg`，`qa.json` 列出小于 20px 的字、出框、被截断的字。
4. **预览**：`-Stage preview` → edge-tts 临时配音 + 完整 1080p60 MP4（8 分钟片约 5–8 分钟）。
5. **正式配音**：
   ```
   D:\hark\indextts\.venv\Scripts\python.exe tools\voice_index.py episodes\<名字>
   D:\hark\_sys\work\mainchat-bili-ref\.venv\Scripts\python.exe tools\align.py episodes\<名字>
   ```
   第一步每句生成一个 wav（改了哪句只重做哪句），第二步给每句做逐词时间（`match` 低于 0.8 的句子会列出来，建议重合成）。
6. **成片**：`-Stage final` → 4 子帧运动模糊、HEVC NVENC、响度 -14 LUFS。
7. **简介章节**：`python tools\chapters.py episodes\<名字>`。

拖时间看某一帧：`node tools\render.mjs ep=episodes\<名字> serve=1`，浏览器打开地址后加 `?t=12.5`。
只看某几个时刻：`node tools\render.mjs ep=… frames=600,1200 out=probe`（帧号 = 秒 × 60）。

# 3. 场景数据怎么写

```json
{ "id": "s12", "type": "code", "theme": "lavender", "chapter": "1 · Setup", "trans": "slide",
  "label": "The role", "title": "Write the role in three layers",
  "lines": ["Then write each bot's role in three layers.", "..."],
  "data": { "file": "role.md", "code": "...", "focus": [{ "lines": [3, 6], "at": "Rules" }] } }
```

| 字段 | 作用 |
|---|---|
| `type` | 用哪个模板（第 6 节）。不写 type 就找 `scenes/<id>.js` 手写场景 |
| `theme` | 背景：paper / mint / lavender / lilac / sky / sand / ice / peach（浅色）· night（星空）· ink / dusk（深色，代码章节和章节卡用） |
| `chapter` | 顶部章节进度条按它分段；`chapters.py` 也按它出 YouTube 章节 |
| `step` | 右上角 `STEP n / N`；不写不显示 |
| `trans` | 进入本场景的转场：`lift`（默认）/ `slide` / `zoom` / `push` / `whip`（甩镜）/ `wipe`（章节擦除）/ `cut` |
| `label` `title` | 左上角小标签 + 大标题；不写 title 就是全屏场景 |
| `lines` | 旁白，每句一条；可以是 `[]`（纯音乐，配 `min_dur`） |
| `min_dur` | 场景最短秒数（章节卡建议 3.4，片尾 14+） |
| `cam` | 手动镜头：`[{ "at": "词", "x": 960, "y": 540, "z": 1.06 }]`；`false` 关闭模板自带镜头 |
| `nosub` | 不显示字幕 |
| `at` | **卡点**：写旁白里的词/短语，元素在这个词说出来时出现；也可写秒数；不写就均匀分布 |
| `*文字*` | 荧光笔；`` `文字` `` 行内代码样式 |

`meta` 里可以写：`say`（只影响配音的发音替换，如 `{"Grok": "Grock"}`）、`cast`（本期角色，覆盖 brand.json）、`colors`（如 `{"accent": "#5a5cf0"}`）、`themes`（新增背景）、`edge_voice` / `edge_rate`（草稿配音）。

角色 `cast` 写法：`{ "ios": { "name": "iOS Bot", "role": "iOS app", "c": "#2fc7a4", "shape": "square" } }`，形状 circle / tri / hex / square / diamond。

# 4. 视觉规范

**画布与网格**：1920×1080 · 左右边距 88 · 标题区 64–200 · 内容区 240–872 · 来源标签 892 · 字幕 968–1036。

**颜色**：墨色 `#15161c` · 次要灰 `#6b6e7b` · 红 `#f0443a`（错/风险）· 绿 `#1fbf75`（对/通过）· 品牌强调色 `--accent`（默认 `#5a5cf0`，每期可换）· 荧光黄 `#ffd66b`。红绿只表达对错。

**背景**：每个主题 = 底色径向渐变 + 3 个缓慢漂移的柔光斑（mesh gradient）+ 暗角 + 5% 胶片颗粒；场景切换时光斑颜色平滑过渡。浅色主题按章节换色，观众靠颜色感知进度；`ink` 深色给代码/章节卡，`night` 给夜间/结尾。

**字体**：Geist（英文）· Noto Sans SC（中文）· Maple Mono（代码、文件名、时间、编号）。

**字号下限**（1080p，按手机可读）：全屏金句 96–120 · 场景标题 62 · 大数字 110–230 · 卡片标题 34–40 · 正文 26–36 · 次要说明 ≥ 22 · 全大写标签 ≥ 20。代码 26–30。渲染静帧时 `qa=1` 自动列出不达标的字（手机状态栏、代码行号这类装饰用 `data-noqa` 免检）。

**卡片**：白底 · 圆角 24 · 三层柔阴影（深色主题下更深）· 窗口卡红黄绿标题栏 · 深色编辑器/终端 `#14151d`，在深色主题上带蓝紫色辉光。

# 5. 动效规范

| 项 | 规范 |
|---|---|
| **镜头** | 每个场景一个虚拟摄影机：全程 1.8% 慢推 + 模板按旁白自动打关键帧，讲到哪张卡/哪几行代码就轻推过去（缩放 1.02–1.08，向目标偏 15–40%），expo in-out 运动。有标题的场景镜头不会把内容推到标题下面；≤ 1.04 的轻推永远不裁切内容区（左右 88–1832、下沿 872），≥ 1.07 的刻意特写才允许裁切 |
| **景深** | 当前讲到的卡片清晰，其他卡片降到 55–60% 透明 + 1.5px 虚化（cards / roster） |
| 主缓动 | expo-out（快进慢停）；双向 cubic in-out；镜头 expo in-out |
| 弹簧 | 临界阻尼附近 z = 0.62，一点点过冲，**禁止卡通回弹** |
| 标准入场 | 上移 36px + 0.965→1 缩放 + 10° 前倾回正 + 6px 模糊变清，弹簧 1 秒 |
| 列表 | 先半透明占位，讲到哪条哪条变实；当前条浅色底高亮 |
| 删除线 / 荧光笔 / 数字 | 0.35 秒画线 · 0.45 秒扫过 · 0.9 秒从 0 计数（千分位） |
| 标题 | 逐字弹入，每字 22ms；上一个场景的标题随旧画面一起退场 |
| 字幕 | 底部深色胶囊，卡拉 OK 逐词变白，长句按标点断成 ≤ 54 字符一段 |
| **转场** | 旧画面 0.3 秒内退场（不和新画面文字重影）。`lift` 默认 · `slide` 同章节内推进 · `zoom` 金句 · `push` 竖向 · `whip` 两个画面一起被甩过去 + 运动模糊（话题急转）· `wipe` 斜切色块扫过（进入章节卡）· `cut` 硬切（转折） |
| 角色 | 一直轻微浮动、随机眨眼；被点名的角色看镜头，其他角色看向它 |
| 节奏 | 每 2–4 秒画面必须有新东西；全屏金句第一行最晚 0.3 秒出现 |
| **音效** | 全部合成、每种 3 个变体防止听出循环：tick（列表）· pop（出现）· click（按钮）· swoosh / swish / whoosh（滤波噪声扫频）· notify（消息）· type（打字）· ding / success（完成）· error（失败）· impact（章节冲击）· riser（上扬，在提示点结束）。全部压在人声下 |

**禁用清单**：渐变背景上的居中标题（金句场景除外）· 所有元素同时淡入 · 粒子爆炸 · 弹跳缓动 · 无画面变化的停顿 · 只是装饰的红绿色 · 两个场景的文字重影。

# 6. 25 个场景模板

**长视频结构**

| 模板 | 用途 | 关键 data |
|---|---|---|
| `hero` | 开场标题。有成片：成片先占满全屏再缩到右侧；没成片：右侧悬浮 UI 卡片堆叠 | `proof` 或 `stack[{kind: msg/tool/pr/note}]`, `logos`, `title`, `meta` |
| `chapter` | 章节开场：巨大章节号 + 标题 + 全片章节导轨（自动列出所有章节卡），配 `trans: "wipe"` + `theme: "ink"` | `title`, `sub`, `short`（导轨上的短名） |
| `statement` | 全屏金句，逐词弹入，老的一行退成灰 | `lines[{text, at}]`, `eyebrow`, `sub`, `size`, `color` |
| `endcard` | 片尾 15–20 秒：YouTube 片尾元素占位框 + logo + 订阅 | `slots`, `channel`, `logo`, `line` |

**界面复刻（开发/AI 工具类内容）**

| 模板 | 用途 | 关键 data |
|---|---|---|
| `chat` | Agent 应用对话：侧栏角色列表、打字指示、工具运行（转圈→打勾）、技能 chip、证据截图、审批卡、汇总数字卡；自动滚动 | `bot`, `messages[{from, text, tool, chips, shots, approval, report, at}]` |
| `code` | 编辑器：语法高亮（md/js/ts/py/sh/yaml）、逐行出现或打字、讲到哪几行高亮哪几行（其余变暗 + 镜头推近 + 自动滚动）、diff 红绿行、右侧注释卡连线 | `file`, `code`, `lang`, `reveal`, `focus[{lines, at}]`, `notes[{line, text}]`, `diff` |
| `terminal` | 左清单打勾 + 右终端打字 + 进度条 | `list`, `term.cmd/out/progress` |
| `board` | 看板 / PR 追踪：卡片按旁白在泳道间移动，巡检扫描线扫过，标红退回或打勾前进 | `cols`, `items[{id, title, who, col, moves[{col, at, flag/ok}]}]`, `sweeps` |
| `compare` | 前后对比：两台手机（或图片）+ 右侧审查记录；不合格圈出问题、打回，下一轮换成修好的画面并盖章 | `left`, `right`, `checks[{text, verdict, swap}]`, `stamp` |
| `post` | 推文/引用作为证据，关键句讲到时荧光笔扫过，右侧解读或数据，自动来源标签 | `author`, `text`, `hlAt`, `side`/`stats`, `source` |

**图解**

| 模板 | 用途 | 关键 data |
|---|---|---|
| `flow` | 节点 + 曲线连线 + 流动光点：路由、管线、决策分支 | `cols`, `edges`, `note` |
| `loop` | 循环：节点绕椭圆，弧线箭头逐段画出，发光令牌持续绕圈，中心写退出条件和轮次 | `nodes`, `center`, `rounds` |
| `table` | 对比表：逐行出现，✓/✕/文字单元格，最后高亮答案列 + 结论条 | `cols`, `rows[{label, cells}]`, `highlight` |
| `versus` | 错的划掉 / 对的打勾；只写 left 就是禁用清单；可带结论条 | `left`, `right`, `verdict` |
| `cards` | 风险 → 解法，2–4 列，解法从下方升起，当前卡片清晰其余虚化 | `items[{title, sub, icon, fix}]`, `source` |
| `roster` | 角色卡一排，点名即亮（其余景深虚化），轨道小球跟着走 | `items[{cast, role, desc, lines/code/big}]` |
| `stepper` | 状态机：圆点逐个打勾 + 大字显示当前状态 | `steps[{label, file}]`, `caption` |
| `rules` | 编号规则文件，讲到哪条亮哪条，右侧代码标签 | `file`, `tag`, `items[{text, sub, code}]` |
| `checklist` | 结尾行动清单 + 解锁条 + 简介资源 | `items`, `gate`, `resources` |

**数据与时间**

| 模板 | 用途 | 关键 data |
|---|---|---|
| `stats` | 大数字计数（千分位）+ 对比条 + 来源标签 | `items[{label, value, suffix, fmt}]`, `bars`, `source` |
| `swarm` | 规模可视化：大计数器 + 格子阵，先亮手动的几个，再由角色带动整片瀑布式点亮 | `from`, `to`, `label`, `at`, `toAt`, `source` |
| `scorecard` | 评分表：第 1 轮不及格标红、退回最差几条，第 2 轮通过盖章 | `rows[{r1, r2, issue}]`, `side` |
| `clock` | 一天/一夜的时间轴 + 大时钟，播放头扫过事件 | `from`, `to`, `events` |
| `timeline` | 日期时间轴：轨道填充到每个事件，卡片上下交错，可加「今天」 | `events[{date, label, sub}]`, `now` |
| `grid` | 分镜/画廊格子按节拍弹出，底部审批按钮 | `items[{label, glyph}]`, `footer` |

模板覆盖不了的画面照旧写 `scenes/<id>.js` 手写场景，引擎优先用手写的；手写场景同样可以用 `ctx.cam()` / `ctx.focus()` 打镜头。

# 7. v2 相比 v1 升级了什么

1. **镜头语言**：每个场景有虚拟摄影机，模板按旁白自动推近正在讲的元素；`cam` 字段可手动打点。
2. **10 个新模板**：chapter / chat / code / board / compare / loop / table / timeline / swarm / endcard——覆盖长视频结构和开发工具类内容。
3. **长视频章节系统**：章节卡 + 全片章节导轨 + wipe 转场 + `chapters.py` 自动出 YouTube 章节。
4. **背景质感**：mesh 柔光斑漂移 + 暗角；新增 `ink` / `dusk` 深色主题。
5. **转场重做**：旧画面快速退场不重影，标题随旧场景退出；新增 whip / push / wipe。
6. **构图**：versus / cards / board / flow / stats / checklist 放大并按内容收紧居中，不再半屏空着；字号全部过手机下限（QA 新增截断检测）。
7. **景深**：当前元素清晰，其他元素虚化退后。
8. **音效重做**：滤波扫频的 whoosh、带音高下滑的 pop、非谐波铃声、打字声、冲击、上扬，每种 3 个变体。
9. **每期独立角色和强调色**：`meta.cast` / `meta.colors`，不用改 brand.json。
10. **正式配音逐词对齐**：`align.py`（faster-whisper），字幕和卡点对准真实配音；草稿和正式配音的时间文件分开（`.edge.json` / `.json`），重跑草稿不会覆盖正式对齐。
11. 修复：渲染进程第一帧被重置到 0 秒的竞争问题。

# 8. 已知限制

- `hero` 的成片模式需要干净的成片帧（`media/proof/%04d.jpg`）；没有就用 `stack` 模式。
- `compare` 的手机画面是示意 mock；有真实截图时用 `image` 字段。
- 数据类场景（stats / post / swarm）一律带来源标签；第三方报道的数据发布前再核一遍。
