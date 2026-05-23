# FreeKiosk 简体中文版

## 项目说明
此版本是 FreeKiosk React Native 自助终端应用的简体中文翻译版本。所有用户界面文本已从英文翻译为简体中文，同时保持代码功能完整。

## 翻译范围

### ✅ 已翻译内容
- **Android 原生字符串资源** (`strings.xml`)
- **React Native UI 组件** (`.tsx`/`.ts` 文件)
- **用户界面文本**:
  - 标签 (label)
  - 标题 (title)
  - 提示 (hint)
  - 占位符 (placeholder)
  - 按钮文本
  - 警告信息
  - 使用说明
  - 错误消息
  - 确认对话框

### ✅ 保留内容
- **代码标识符** (变量名、函数名、属性名)
- **技术单位** (lux、ms、% 等)
- **URL 和路径**
- **API 键和配置值**
- **文件格式和扩展名**

## 主要修改文件

### 核心界面文件
1. **`src/screens/settings/tabs/GeneralTab.tsx`** - 通用设置标签页
   - 显示模式选择器（网站/媒体/应用）
   - 媒体播放列表设置
   - URL 配置、PDF 查看器、打印设置
   - 设备所有者模式警告

2. **`src/screens/settings/tabs/DisplayTab.tsx`** - 显示设置标签页
   - 屏幕亮度控制（手动/自动）
   - 屏幕常亮设置
   - 屏保配置（调暗/自定义网址/视频播放列表）
   - 运动检测、屏幕休眠计划
   - 状态栏项目配置

3. **`src/screens/settings/tabs/SecurityTab.tsx`** - 安全设置标签页
   - PIN 码配置
   - 锁定模式设置
   - 隐藏按钮位置配置
   - 自动启动、仪表盘模式
   - 返回设置方式（点击任意位置/固定按钮）

4. **`src/components/PinInput.tsx`** - PIN 码输入组件
   - 输入提示、验证按钮
   - 账户锁定警告
   - 尝试次数剩余提示

### 辅助组件
5. **`src/screens/PinScreen.tsx`** - PIN 码屏幕
6. **`src/components/settings/BackupRestoreSection.tsx`** - 备份恢复组件
7. **`src/components/settings/ScheduleEventList.tsx`** - 计划事件列表
8. **`src/screens/settings/BlockingOverlaysScreen.tsx`** - 遮挡叠加层管理
9. **`src/components/ExternalAppOverlay.tsx`** - 外部应用叠加层
10. **`src/components/WebViewComponent.tsx`** - 网页视图组件

### Android 原生资源
11. **`android/app/src/main/res/values/strings.xml`** - 主应用字符串
12. **`android/app/src/debug/res/values/strings.xml`** - 调试版字符串

## 翻译原则

### 1. 技术术语统一
- **kiosk** → **自助终端**
- **PIN** → **PIN 码** (保留英文缩写)
- **URL** → **网址**
- **WebView** → **网页视图**
- **screensaver** → **屏保**
- **brightness** → **亮度**

### 2. 功能描述准确
- **Display Mode** → **显示模式**
- **Lock Mode** → **锁定模式**
- **Dashboard Mode** → **仪表盘模式**
- **Auto-Brightness** → **自动亮度**
- **Motion Detection** → **运动检测**

### 3. 操作说明清晰
- **Tap 5 times** → **点击 5 次**
- **Enter PIN code** → **输入 PIN 码**
- **Configure the URL** → **配置网址**
- **Enable Lock Mode** → **启用锁定模式**

## 构建说明

### 环境要求
- Node.js 16+
- React Native CLI
- Android Studio (Android 构建)
- Java Development Kit (JDK)

### 构建步骤
```bash
# 1. 安装依赖
npm install

# 2. 启动 Metro 服务器
npm start

# 3. 构建 Android 应用 (新终端)
npm run android

# 4. 或构建 iOS 应用 (需要 macOS)
npm run ios
```

### 调试
- **开发模式**: 摇动设备或按 `Ctrl+M` (Windows/Linux) 或 `Cmd+M` (macOS)
- **日志查看**: `adb logcat *:S ReactNative:V ReactNativeJS:V`
- **热重载**: 在开发菜单中启用

## 功能验证

### ✅ 已验证功能
1. **PIN 码系统**: 输入、验证、锁定机制
2. **显示模式切换**: 网站、媒体、应用模式
3. **亮度控制**: 手动/自动亮度调节
4. **屏保功能**: 调暗、自定义网址、视频播放列表
5. **安全设置**: 锁定模式、隐藏按钮、自动启动
6. **媒体播放**: 视频/图片播放列表、播放控制

### 🔧 配置建议
1. **设备所有者模式**: 建议启用以获得完整自助终端功能
2. **屏幕常亮**: 启用以保持屏幕始终开启
3. **PIN 码保护**: 设置 4-6 位 PIN 码防止未授权访问
4. **自动亮度**: 根据环境光线自动调节屏幕亮度

## 许可证
原始项目许可证保持不变。此翻译版本仅用于界面本地化。

## 问题反馈
如发现翻译错误或功能问题，请提交 Issue 或 Pull Request。

---
*翻译完成时间: 2026-05-23*