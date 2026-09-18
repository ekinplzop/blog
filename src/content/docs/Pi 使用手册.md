---
title: "Pi 使用手册"
publishedDate: "2026-09-18"
tags: ["Obsidian", "速查"]
lifecycle:
  status: "evergreen"
  confidence: 0.95
  last_verified: "2026-09-18"
---

> 网页阅读版（右侧固定目录）：[Pi 使用手册.html](./Pi%20使用手册.html)

# 一、Pi简介与启动方式


# 二、 模型配置与基础调用

## 添加中转站与模型

中转站通过 `pi-provider-newapi` 扩展接入，当前已配置：`zz1cc`（zz1cc.cc.cd）、`byeapi`（api.byeapi.top）、`xtokenmirror`（api.xtokenmirror.com，GLM 系列，仅支持 OpenAI 格式）。接口格式以站点实际支持为准——`/v1/messages` 返回 403 "does not allow dispatch" 就是只支持 OpenAI 格式，模型条目把 `api` 写成 `openai-completions`、baseUrl 带 `/v1` 即可。

> 注意：直接在 `settings.json` 的 `providers` 块里写配置不会出现在模型列表中，真正生效的是下面三个文件。

| 文件 | 作用 |
| --- | --- |
| `C:\Users\LWQ\.pi\agent\extension-settings\provider-newapi.json` | 注册中转站（baseUrl 不带 `/v1`） |
| `C:\Users\LWQ\.pi\agent\auth.json` | 保存 API 密钥 |
| `C:\Users\LWQ\.pi\agent\models-store.json` | 模型目录缓存，`--list-models` 直接读这里 |

### 方式一：Pi 内命令（推荐）

在 Pi 对话中依次输入：

```text
/newapi-provider-add 名称     # 回车后输入中转站根地址，如 https://api.byeapi.top
/login 名称                   # 粘贴 API 密钥
```

之后打开 `/model` 即可看到 `名称/模型ID`，模型列表由扩展自动发现并补充元数据（上下文长度、思考支持等）。

### 方式二：直接编辑配置文件

第一步，在 `provider-newapi.json` 的 `providers` 对象中加入：

```json
"名称": {
  "baseUrl": "https://中转站地址",
  "modelApiOverrides": {}
}
```

第二步，在 `auth.json` 中加入：

```json
"名称": {
  "type": "api_key",
  "key": "sk-..."
}
```

第三步，在 `models-store.json` 中预写模型目录（不写的话，打开一次 Pi 会话扩展也会自动发现）。每个中转站一个条目：

```json
"名称": {
  "models": [
    {
      "id": "claude-opus-5",
      "name": "Claude Opus 5",
      "api": "anthropic-messages",
      "baseUrl": "https://中转站地址",
      "reasoning": true,
      "input": ["text", "image"],
      "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
      "contextWindow": 1000000,
      "maxTokens": 128000
    }
  ],
  "checkedAt": 1787840578000
}
```

`checkedAt` 是 epoch 毫秒时间戳；`api` 用 `anthropic-messages` 时 baseUrl 填根地址（不带 `/v1`）。

### 验证与使用

```powershell
pi --list-models 名称                  # 确认模型已注册
pi --provider 名称 --model 模型ID      # 指定中转站启动
pi --model "名称/模型ID"               # 等价写法
```

会话中用 `/model` 切换模型。

### 切换默认中转站

编辑 `C:\Users\LWQ\.pi\agent\settings.json` 顶层字段：

```json
"defaultProvider": "byeapi",
"defaultModel": "claude-opus-5"
```

当前默认仍为 `zz1cc / claude-opus-5`。

## 模型快速轮换（scoped models）

`Ctrl+P` 往下一个、`Alt+P` 往上一个（Windows/WSL 键位），在 scoped models 名单里快速循环切换模型。`/model` 是全量选择器，这个名单相当于常用收藏夹；不配置时全部模型都参与轮换。

三种配置方式：

| 方式 | 操作 | 生效范围 |
| --- | --- | --- |
| `/scoped-models` | 会话内交互勾选 | 写入 settings.json，持久 |
| `pi --models "zz1cc/*,byeapi/*"` | 启动参数，支持通配符 | 仅本次启动 |
| `settings.json` 的 `enabledModels` | 直接编辑 | 每次启动 |

通配符按 `中转站/模型ID` 匹配，也可以只写模型 ID 部分。四种典型写法：

```json
["zz1cc/*", "byeapi/claude-opus-5", "*sonnet*", "byeapi/claude-opus-4-8:high"]
```

- `zz1cc/*`：一个站的全部模型
- `byeapi/claude-opus-5`：精确指定
- `*sonnet*`：名字含 sonnet 的全部模型
- `byeapi/claude-opus-4-8:high`：同时钉死思考档位

当前配置（opus-5 / sonnet-5 双线路，同模型相邻方便换线）：

```text
zz1cc/claude-opus-5 → byeapi/claude-opus-5 → zz1cc/claude-sonnet-5 → byeapi/claude-sonnet-5
```

### /scoped-models 选择器键位

| 按键 | 作用 |
| --- | --- |
| `↑` `↓` | 移动光标（PageUp/PageDown 翻页） |
| 直接打字 | 搜索过滤，比如输 opus 只剩 opus 系列 |
| `Enter` | 勾选 / 取消当前高亮的模型 |
| `Ctrl+P` | 整个中转站一组全开/全关 |
| `Ctrl+A` / `Ctrl+X` | 全选 / 全部清空 |
| `Alt+↑` `Alt+↓` | 调整该模型在轮换里的顺序 |
| `Ctrl+S` | 保存到 settings.json |
| `Esc` | 关闭（不保存） |

两点注意：名单在**会话启动时**解析，改完要重开 Pi 才生效；`Esc` 直接退出不落盘，改完必须按 `Ctrl+S`。

## 打开历史对话

| 操作 | 说明 |
| --- | --- |
| `/resume` | 会话内打开历史会话列表（当前项目） |
| `pi -r` | 启动时直接进会话选择器 |
| `pi -c` | 直接续上最近一次会话 |
| `/name 名字` | 给当前会话命名，列表里好找 |
| `/tree` | 在当前会话内跳回某个节点继续（不是跨会话） |

`/session` 只是显示当前会话信息（文件、ID、token、费用），不是打开历史。建议开工时有意识 `/name` 一下，之后 `pi -r` 里好找。

## 对话中粘贴图片

| 方式 | 操作 | 说明 |
| --- | --- | --- |
| 剪贴板粘贴 | 截图后按 `Alt+V`（Windows/WSL 键位） | 路径由扩展自动转为图像附件 |
| 消息内引用 | 输入 `@图片.png`，Tab 补全路径 | 同上 |
| 启动时携带 | `pi @image.png "分析这张图"` | 同上 |
| 拖拽 | 把图片文件拖进终端窗口 | 插入路径后同上 |

> 注意（2026-08-27）：中转站（zz1cc、byeapi 的 Claude-kiro 通道）会丢弃工具结果里的图片，`Alt+V` 和 `@` 引用原本只插入路径文本、靠模型 `read` 查看，图会被剥掉。已装 `image-path-attach` 扩展（`C:\Users\LWQ\.pi\agent\extensions\image-path-attach.ts`）：发送前自动把消息里的图片路径转成图像附件，两种方式现在都能直接看图。

说明：

- 键位 ID 为 `app.clipboard.pasteImage`，默认 `Ctrl+V`，Windows/WSL 下改为 `Alt+V` 以避开终端冲突；改键位编辑 `C:\Users\LWQ\.pi\agent\keybindings.json` 后 `/reload` 生效。
- 按 `Alt+V` 没反应通常是终端拦截了组合键，改用 `@` 引用即可。

# 三、 skill与mcp生态

## ctx：context-mode

`context-mode` 为 Pi 提供 MCP 工具与扩展钩子。它将大文件、日志和网页等原始输出留在本地沙箱中，只把分析结果传给模型；同时记录文件编辑、Git 操作、报错和任务状态，便于长会话续接。

### 已安装位置

- Pi 扩展：`npm:context-mode`
- 全局命令：`context-mode`
- Pi MCP 配置：`C:\Users\LWQ\.pi\agent\mcp.json`

### 安装与配置

```powershell
npm install -g context-mode
pi install npm:context-mode
```

在 `C:\Users\LWQ\.pi\agent\mcp.json` 中加入以下配置。已有其他 MCP 时，在原有 `mcpServers` 对象中加入 `context-mode`，不要覆盖其他服务。

```json
{
  "mcpServers": {
    "context-mode": {
      "command": "context-mode"
    }
  }
}
```

重启 Pi 后生效。

### 在 Pi 中使用

在 Pi 对话中直接输入下列命令，Pi 会调用对应的 MCP 工具：

```text
ctx doctor    # 检查运行时、MCP 服务和索引能力
ctx stats     # 查看本次会话的调用次数与上下文节省情况
ctx index     # 索引本地文件或目录，供后续检索
ctx search    # 搜索已索引的内容
ctx purge     # 删除已索引内容
ctx upgrade   # 更新并重新配置 context-mode
```

常见提示词：

```text
使用 context-mode 分析 seq 1 10000，不要把完整输出放进上下文。只告诉我数字总数、最小值和最大值；完成后运行 ctx stats。
```

```text
索引当前项目的文档与日志，然后搜索 authentication middleware 的实现位置和调用关系；完成后运行 ctx stats。
```

## 已接入的 skills 速查

Pi 通过 `settings.json` 的 `skills` 字段直接复用 zcode 的技能目录（`C:/Users/LWQ/.zcode/skills`），两边同一套 Agent Skills 标准。忘了名字就：输入框打 `/skill:` 看补全列表，或直接问模型「你有哪些 skills」。

| 名字 | 干什么用 |
| --- | --- |
| api-relay-audit | 审计 AI 中转站/代理 API（提示注入、泄密、扣量等） |
| defuddle | 抓网页正文转干净 Markdown（去广告导航） |
| gpt-image | GPT Image 生图/改图/海报/带文字的图 |
| humanizer-zh-academic | 降中文论文 AI 味（短文） |
| humanizer-zh-academic-full | 降 AI 味完整版（长文逐段精改） |
| imagegen | 生成/编辑位图插画、去背景 |
| json-canvas | 创建/编辑 Obsidian Canvas 白板（.canvas） |
| lwq-coding-style | 按 LWQ 竞赛风格写代码/题解 |
| markdown-response-format | 强制回答直接渲染 Markdown、公式独立双美元 |
| obsidian-bases | 写 Obsidian Bases 数据库视图（.base） |
| obsidian-cli | 用 CLI 操作 Obsidian 库（笔记、JS、截图） |
| obsidian-markdown | 写 Obsidian 风味 Markdown（wikilink、callout） |
| openai-docs | 查 OpenAI/Codex 官方文档（zcode 场景） |
| pdf | PDF 读取/生成/排版检查 |
| playwright | 终端自动化真实浏览器 |
| plugin-creator | 做插件脚手架（zcode 场景） |
| rapidocr | OCR 图片/PDF 文字（中文效果好） |
| rtk-command-compression | 压缩命令输出省上下文 |
| skill-creator | 创建/打磨 skill 本身 |
| skill-installer | 从清单或 GitHub 安装 skill |
| subtitle-proofreader | 校对中文课程字幕 SRT（数学/考研） |

Pi 原生还有：`context-mode`（ctx 系列命令）、`autoresearch-*`、`web-access`、`mcp-scripting` 等。zcode 插件缓存里的 skills（browser-use、computer-use 等）依赖 zcode 专属 MCP 工具，没有接入的价值。

用法：`/skill:名字 参数` 强制加载；提示词里点名「使用 xx skill」；任务描述匹配时模型偶尔自动触发（不保证）。

## pi-httpproxy：代理扩展

`pi-httpproxy` 为 Pi 提供域名白名单全局 HTTP 代理，解决国内访问 Google、GitHub、Anthropic 等被墙服务的问题。白名单内的域名走代理，其他请求直连。

### 已安装位置

- Pi 扩展：`C:\Users\LWQ\.pi\agent\extensions\pi-httpproxy\`
- 配置文件：`C:\Users\LWQ\.pi\proxy-domains.json`
- undici 依赖：`C:\Users\LWQ\.pi\agent\npm\node_modules\undici\`

### 配置文件

编辑 `C:\Users\LWQ\.pi\proxy-domains.json`：

```json
{
  "proxy": "http://127.0.0.1:7890",
  "tapTelegramEnv": true,
  "domains": [
    "Google",
    "google.com",
    "*.google.com",
    "googleapis.com",
    "*.googleapis.com",
    
    "GitHub",
    "github.com",
    "*.github.com",
    "githubusercontent.com",
    "*.githubusercontent.com",
    
    "AI services",
    "openai.com",
    "*.openai.com",
    "anthropic.com",
    "*.anthropic.com",
    "claude.ai",
    "*.claude.ai"
  ]
}
```

- `proxy`：HTTP 代理地址，通常是本地 Clash/v2ray 的端口（`http://127.0.0.1:7890`）
- `domains`：白名单域名，支持精确匹配（`google.com`）、子域名（`.google.com`）、通配符（`*.google.com`）
- `tapTelegramEnv`：默认 `true`，强制 pi-telegram 扩展走代理

### 使用方式

#### 1. 正常启动（自动加载）

```bash
pi
# 启动时显示：
# [pi-httpproxy] enabled: proxy=http://127.0.0.1:7890 (source=user, alive=true), domains=38 rule(s)
```

#### 2. 调试模式（查看路由决策）

```bash
export PI_PROXY_DEBUG=1
pi
# 每个请求会显示 [proxy] 或 [direct] 标记，用于调试白名单规则
```

#### 3. 热重载配置

修改 `proxy-domains.json` 后，在 Pi 会话中输入：

```
/httpproxy-reload
```

立即生效，无需重启 Pi。

### 当前白名单（38 条规则）

- **Google 系列**：google.com, googleapis.com, gstatic.com, googleusercontent.com, recaptcha.net
- **GitHub 系列**：github.com, githubusercontent.com, githubassets.com, ghcr.io
- **Telegram 系列**：telegram.org, t.me, telegram.me, cdn-telegram.org, telesco.pe
- **AI 服务**：openai.com, oaiusercontent.com, anthropic.com, claude.ai
- **Hugging Face**：huggingface.co, hf.co
- **Brave Search**：brave.com, bravesoftware.com
- **其他**：npmjs.com, gravatar.com, imgur.com

### 添加自定义域名

编辑 `C:\Users\LWQ\.pi\proxy-domains.json`，在 `domains` 数组里添加：

```json
"自定义域名说明",
"example.com",
"*.example.com"
```

保存后运行 `/httpproxy-reload` 生效。

### 实际效果

- ✅ Pi 访问 GitHub raw 文件、API 不再超时
- ✅ `web-access` 技能可以抓取 Google、Wikipedia 等网站
- ✅ 国内中转站（zz1cc、byeapi、xtokenmirror）自动直连，速度不受影响
- ✅ 所有插件（browser-use、mcp 等）自动受益

### 注意事项

1. **代理服务器必须运行**：确保 Clash/v2ray 在 `127.0.0.1:7890` 监听
2. **修复过的 bug**：原扩展查找 undici 的路径有误，已在 `loadUndici()` 中添加 `join(AGENT_DIR, "agent", "npm", "node_modules", "undici", "index.js")` 候选路径
3. **不要把中转站加入白名单**：zz1cc.cc.cd、byeapi.top 等国内中转站应该直连，加入白名单反而会变慢
