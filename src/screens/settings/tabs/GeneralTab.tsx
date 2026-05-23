/**
 * FreeKiosk v1.2 - General Tab
 * Display mode, URL/App selection, PIN configuration
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import {
  SettingsSection,
  SettingsInput,
  SettingsSwitch,
  SettingsModeSelector,
  SettingsInfoBox,
  SettingsButton,
  UrlListEditor,
  ScheduleEventList,
  ManagedAppsSection,
  SettingsRadioGroup,
} from '../../../components/settings';
import { ManagedApp } from '../../../types/managedApps';
import { Colors, Spacing, Typography } from '../../../theme';
import AppLauncherModule, { AppInfo } from '../../../utils/AppLauncherModule';
import { ScheduledEvent } from '../../../types/planner';
import type { MediaItem, MediaFitMode } from '../../../types/mediaPlayer';
import { generateMediaItemId, detectMediaType, isLocalMedia, getMediaDisplayName } from '../../../types/mediaPlayer';
import FilePickerModule from '../../../utils/FilePickerModule';
import type { PickedFile } from '../../../utils/FilePickerModule';

interface GeneralTabProps {
  // Display mode
  displayMode: 'webview' | 'external_app' | 'media_player';
  onDisplayModeChange: (mode: 'webview' | 'external_app' | 'media_player') => void;
  
  // WebView settings
  url: string;
  onUrlChange: (url: string) => void;
  
  // External app settings
  externalAppPackage: string;
  onExternalAppPackageChange: (pkg: string) => void;
  onPickApp: () => void;
  loadingApps: boolean;
  
  // External app sub-mode (single vs multi)
  externalAppMode: 'single' | 'multi';
  onExternalAppModeChange: (mode: 'single' | 'multi') => void;
  
  // Managed apps (multi-app mode)
  managedApps: ManagedApp[];
  onManagedAppsChange: (apps: ManagedApp[]) => void;
  
  // Permissions
  hasOverlayPermission: boolean;
  onRequestOverlayPermission: () => void;
  hasUsageStatsPermission: boolean;
  onRequestUsageStatsPermission: () => void;
  isDeviceOwner: boolean;
  
  // PIN
  pin: string;
  onPinChange: (pin: string) => void;
  isPinConfigured: boolean;
  pinModeChanged: boolean;
  pinMaxAttemptsText: string;
  onPinMaxAttemptsChange: (text: string) => void;
  onPinMaxAttemptsBlur: () => void;
  pinMode: 'numeric' | 'alphanumeric';
  onPinModeChange: (mode: 'numeric' | 'alphanumeric') => void;
  
  // Dashboard mode (webview only)
  dashboardModeEnabled: boolean;
  onDashboardModeEnabledChange: (value: boolean) => void;

  // Auto reload (webview only)
  autoReload: boolean;
  onAutoReloadChange: (value: boolean) => void;
  
  // PDF Viewer (webview only)
  pdfViewerEnabled: boolean;
  onPdfViewerEnabledChange: (value: boolean) => void;
  
  // Printing (webview only)
  printEnabled: boolean;
  onPrintEnabledChange: (value: boolean) => void;
  printPaperSize: string;
  onPrintPaperSizeChange: (value: string) => void;
  
  // URL Rotation (webview only)
  urlRotationEnabled: boolean;
  onUrlRotationEnabledChange: (value: boolean) => void;
  urlRotationList: string[];
  onUrlRotationListChange: (urls: string[]) => void;
  urlRotationInterval: string;
  onUrlRotationIntervalChange: (value: string) => void;
  
  // URL Planner (webview only)
  urlPlannerEnabled: boolean;
  onUrlPlannerEnabledChange: (value: boolean) => void;
  urlPlannerEvents: ScheduledEvent[];
  onUrlPlannerEventsChange: (events: ScheduledEvent[]) => void;
  onAddRecurringEvent: () => void;
  onAddOneTimeEvent: () => void;
  onEditEvent: (event: ScheduledEvent) => void;
  
  // WebView Back Button (webview only)
  webViewBackButtonEnabled: boolean;
  onWebViewBackButtonEnabledChange: (value: boolean) => void;
  webViewBackButtonXPercent: string;
  onWebViewBackButtonXPercentChange: (value: string) => void;
  webViewBackButtonYPercent: string;
  onWebViewBackButtonYPercentChange: (value: string) => void;
  onResetWebViewBackButtonPosition: () => void;
  
  // Inactivity Return to Home (webview only)
  inactivityReturnEnabled: boolean;
  onInactivityReturnEnabledChange: (value: boolean) => void;
  inactivityReturnDelay: string;
  onInactivityReturnDelayChange: (value: string) => void;
  inactivityReturnResetOnNav: boolean;
  onInactivityReturnResetOnNavChange: (value: boolean) => void;
  inactivityReturnClearCache: boolean;
  onInactivityReturnClearCacheChange: (value: boolean) => void;
  inactivityReturnScrollTop: boolean;
  onInactivityReturnScrollTopChange: (value: boolean) => void;
  
  // Media Player settings
  mediaPlayerItems: MediaItem[];
  onMediaPlayerItemsChange: (items: MediaItem[]) => void;
  mediaPlayerAutoPlay: boolean;
  onMediaPlayerAutoPlayChange: (value: boolean) => void;
  mediaPlayerLoop: boolean;
  onMediaPlayerLoopChange: (value: boolean) => void;
  mediaPlayerShuffle: boolean;
  onMediaPlayerShuffleChange: (value: boolean) => void;
  mediaPlayerImageDuration: string;
  onMediaPlayerImageDurationChange: (value: string) => void;
  mediaPlayerShowControls: boolean;
  onMediaPlayerShowControlsChange: (value: boolean) => void;
  mediaPlayerFitMode: MediaFitMode;
  onMediaPlayerFitModeChange: (value: MediaFitMode) => void;
  mediaPlayerBgColor: string;
  onMediaPlayerBgColorChange: (value: string) => void;
  mediaPlayerTransition: boolean;
  onMediaPlayerTransitionChange: (value: boolean) => void;
  mediaPlayerTransitionDuration: string;
  onMediaPlayerTransitionDurationChange: (value: string) => void;
  mediaPlayerMute: boolean;
  onMediaPlayerMuteChange: (value: boolean) => void;
  onPickMediaFromDevice: (type: 'video' | 'image' | 'any') => void;
  pickingMedia: boolean;
  
  // HTTP Basic Auth (webview only)
  basicAuthUsername: string;
  onBasicAuthUsernameChange: (value: string) => void;
  basicAuthPassword: string;
  onBasicAuthPasswordChange: (value: string) => void;

  // Navigation
  onBackToKiosk: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  displayMode,
  onDisplayModeChange,
  url,
  onUrlChange,
  externalAppPackage,
  onExternalAppPackageChange,
  onPickApp,
  loadingApps,
  externalAppMode,
  onExternalAppModeChange,
  managedApps,
  onManagedAppsChange,
  hasOverlayPermission,
  onRequestOverlayPermission,
  hasUsageStatsPermission,
  onRequestUsageStatsPermission,
  isDeviceOwner,
  pin,
  onPinChange,
  isPinConfigured,
  pinModeChanged,
  pinMaxAttemptsText,
  onPinMaxAttemptsChange,
  onPinMaxAttemptsBlur,
  pinMode,
  onPinModeChange,
  dashboardModeEnabled,
  onDashboardModeEnabledChange,
  autoReload,
  onAutoReloadChange,
  pdfViewerEnabled,
  onPdfViewerEnabledChange,
  printEnabled,
  onPrintEnabledChange,
  printPaperSize,
  onPrintPaperSizeChange,
  urlRotationEnabled,
  onUrlRotationEnabledChange,
  urlRotationList,
  onUrlRotationListChange,
  urlRotationInterval,
  onUrlRotationIntervalChange,
  urlPlannerEnabled,
  onUrlPlannerEnabledChange,
  urlPlannerEvents,
  onUrlPlannerEventsChange,
  onAddRecurringEvent,
  onAddOneTimeEvent,
  onEditEvent,
  webViewBackButtonEnabled,
  onWebViewBackButtonEnabledChange,
  webViewBackButtonXPercent,
  onWebViewBackButtonXPercentChange,
  webViewBackButtonYPercent,
  onWebViewBackButtonYPercentChange,
  onResetWebViewBackButtonPosition,
  inactivityReturnEnabled,
  onInactivityReturnEnabledChange,
  inactivityReturnDelay,
  onInactivityReturnDelayChange,
  inactivityReturnResetOnNav,
  onInactivityReturnResetOnNavChange,
  inactivityReturnClearCache,
  onInactivityReturnClearCacheChange,
  inactivityReturnScrollTop,
  onInactivityReturnScrollTopChange,
  mediaPlayerItems,
  onMediaPlayerItemsChange,
  mediaPlayerAutoPlay,
  onMediaPlayerAutoPlayChange,
  mediaPlayerLoop,
  onMediaPlayerLoopChange,
  mediaPlayerShuffle,
  onMediaPlayerShuffleChange,
  mediaPlayerImageDuration,
  onMediaPlayerImageDurationChange,
  mediaPlayerShowControls,
  onMediaPlayerShowControlsChange,
  mediaPlayerFitMode,
  onMediaPlayerFitModeChange,
  mediaPlayerBgColor,
  onMediaPlayerBgColorChange,
  mediaPlayerTransition,
  onMediaPlayerTransitionChange,
  mediaPlayerTransitionDuration,
  onMediaPlayerTransitionDurationChange,
  mediaPlayerMute,
  onMediaPlayerMuteChange,
  onPickMediaFromDevice,
  pickingMedia,
  basicAuthUsername,
  onBasicAuthUsernameChange,
  basicAuthPassword,
  onBasicAuthPasswordChange,
  onBackToKiosk,
}) => {
  return (
    <View>
      {/* Display Mode Selection */}
      <SettingsSection title="显示模式" icon="cellphone">
        <SettingsModeSelector
          options={[
            { value: 'webview', label: '网站', icon: 'web' },
            { value: 'media_player', label: '媒体', icon: 'play-circle-outline' },
            { value: 'external_app', label: '应用', icon: 'android' },
          ]}
          value={displayMode}
          onValueChange={(value) => onDisplayModeChange(value as 'webview' | 'external_app' | 'media_player')}
          hint="网站、媒体播放器（视频/图片）或 Android 应用"
        />
        
        {/* Device Owner warning for External App */}
        {displayMode === 'external_app' && !isDeviceOwner && (
          <SettingsInfoBox variant="error" title="🔒 建议使用设备所有者模式">
            <Text style={styles.infoText}>未使用设备所有者模式：{`
`}
              • 导航按钮仍可访问{`
`}
              • 用户可自由退出应用{`
`}
              • 锁定模式可能无法正常工作
            </Text>
          </SettingsInfoBox>
        )}
      </SettingsSection>
      
      {/* How to Use */}
      <SettingsSection variant="info">
        <Text style={styles.infoTitle}>ℹ️ 使用说明</Text>
        <Text style={styles.infoText}>
          {displayMode === 'media_player' 
            ? '• 添加视频或图片网址以构建播放列表\n• 配置播放选项（循环、随机等）\n• 设置安全的 PIN 码\n• 启用"锁定模式"进入完整自助终端模式\n• 点击 5 次以访问设置'
            : `• 配置要显示的网页 URL\n• 设置安全的 PIN 码\n• 启用"锁定模式"进入完整自助终端模式\n• 连续点击隐藏按钮 5 次以访问设置（默认：右下角）\n• 输入 PIN 码解锁`}
        </Text>
      </SettingsSection>
      
      {/* ===== MEDIA PLAYER SETTINGS ===== */}
      {displayMode === 'media_player' && (
        <>
          {/* Media Items / Playlist */}
          <SettingsSection title="媒体播放列表" icon="play-circle-outline">
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                {'🎬 从设备或通过网址添加媒体。\n'}
                {'支持：MP4、WebM、OGG（视频）• JPG、PNG、GIF、WebP、SVG（图片）\n\n'}
                {'📱 本地文件将被复制到应用存储以确保可靠播放。'}
              </Text>
            </SettingsInfoBox>
            
            {/* Pick from device buttons */}
            <View style={styles.pickButtonsRow}>
              <TouchableOpacity
                style={[styles.pickButton, pickingMedia && styles.pickButtonDisabled]}
                onPress={() => !pickingMedia && onPickMediaFromDevice('any')}
                disabled={pickingMedia}
              >
                <Text style={styles.pickButtonText}>
                  {pickingMedia ? '⏳ 选择中...' : '📁 从设备选择'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickButtonSmall, { backgroundColor: Colors.info }, pickingMedia && styles.pickButtonDisabled]}
                onPress={() => !pickingMedia && onPickMediaFromDevice('video')}
                disabled={pickingMedia}
              >
                <Text style={styles.pickButtonSmallText}>🎥</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickButtonSmall, { backgroundColor: Colors.secondary }, pickingMedia && styles.pickButtonDisabled]}
                onPress={() => !pickingMedia && onPickMediaFromDevice('image')}
                disabled={pickingMedia}
              >
                <Text style={styles.pickButtonSmallText}>🖼️</Text>
              </TouchableOpacity>
            </View>
            
            {mediaPlayerItems.map((item, index) => (
              <View key={item.id} style={styles.mediaItemCard}>
                <View style={styles.mediaItemHeader}>
                  <Text style={styles.mediaItemIndex}>{index + 1}</Text>
                  <View style={[
                    styles.mediaItemTypeBadge,
                    { backgroundColor: item.type === 'video' ? Colors.info : Colors.secondary }
                  ]}>
                    <Text style={styles.mediaItemTypeText}>
                      {item.type === 'video' ? '🎥 Video' : '🖼️ Image'}
                    </Text>
                  </View>
                  {item.isLocal && (
                    <View style={styles.localBadge}>
                      <Text style={styles.localBadgeText}>📱 Local</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.mediaItemDeleteBtn}
                    onPress={() => {
                      const toDelete = mediaPlayerItems.find(i => i.id === item.id);
                      // If it's a local file, also delete the copied file
                      if (toDelete?.isLocal && toDelete.url.startsWith('file://')) {
                        FilePickerModule.deleteMediaFile(toDelete.url).catch(() => {});
                      }
                      const updated = mediaPlayerItems.filter(i => i.id !== item.id);
                      onMediaPlayerItemsChange(updated);
                    }}
                  >
                    <Text style={styles.mediaItemDeleteText}>✗</Text>
                  </TouchableOpacity>
                </View>
                
                {item.isLocal ? (
                  <View style={styles.localFileInfo}>
                    <Text style={styles.localFileName} numberOfLines={1}>
                      {getMediaDisplayName(item)}
                    </Text>
                    <Text style={styles.localFilePath} numberOfLines={1}>
                      {item.url}
                    </Text>
                  </View>
                ) : (
                  <SettingsInput
                    label="网址"
                    value={item.url}
                    onChangeText={(text) => {
                      const updated = mediaPlayerItems.map(i => 
                        i.id === item.id ? { ...i, url: text, type: detectMediaType(text) } : i
                      );
                      onMediaPlayerItemsChange(updated);
                    }}
                    placeholder="https://example.com/video.mp4"
                    keyboardType="url"
                  />
                )}
                
                {item.type === 'image' && (
                  <SettingsInput
                    label="显示时长（秒）"
                    value={item.duration ? String(item.duration) : ''}
                    onChangeText={(text) => {
                      const dur = parseInt(text, 10);
                      const updated = mediaPlayerItems.map(i => 
                        i.id === item.id ? { ...i, duration: isNaN(dur) ? undefined : dur } : i
                      );
                      onMediaPlayerItemsChange(updated);
                    }}
                    placeholder={mediaPlayerImageDuration || '10'}
                    keyboardType="numeric"
                    hint="留空使用默认时长"
                  />
                )}
              </View>
            ))}
            
            <SettingsButton
              title="添加网址条目"
              icon="plus-circle"
              variant="success"
              onPress={() => {
                const newItem: MediaItem = {
                  id: generateMediaItemId(),
                  url: '',
                  type: 'video',
                  isLocal: false,
                };
                onMediaPlayerItemsChange([...mediaPlayerItems, newItem]);
              }}
            />
            
            {mediaPlayerItems.length === 0 && (
              <SettingsInfoBox variant="warning">
                <Text style={styles.infoText}>
                  ⚠️ Add at least one media item to use the Media Player
                </Text>
              </SettingsInfoBox>
            )}
          </SettingsSection>
          
          {/* Playback Settings */}
          <SettingsSection title="播放" icon="play">
            <SettingsSwitch
              label="自动播放"
              value={mediaPlayerAutoPlay}
              onValueChange={onMediaPlayerAutoPlayChange}
              hint="屏幕加载时自动开始播放"
            />
            
            <SettingsSwitch
              label="循环播放列表"
              value={mediaPlayerLoop}
              onValueChange={onMediaPlayerLoopChange}
              hint="播放列表结束后从头重新开始"
            />
            
            <SettingsSwitch
              label="随机播放"
              value={mediaPlayerShuffle}
              onValueChange={onMediaPlayerShuffleChange}
              hint="以随机顺序播放项目"
            />
            
            <SettingsSwitch
              label="视频静音"
              value={mediaPlayerMute}
              onValueChange={onMediaPlayerMuteChange}
              hint="无音频播放所有视频"
            />
            
            <View style={styles.rotationSpacer} />
            <SettingsInput
              label="默认图片显示时长（秒）"
              value={mediaPlayerImageDuration}
              onChangeText={onMediaPlayerImageDurationChange}
              placeholder="10"
              keyboardType="numeric"
              hint="每张图片的显示时长（1-3600秒）。可在上方单独覆盖设置。"
            />
          </SettingsSection>
          
          {/* Display Settings */}
          <SettingsSection title="显示选项" icon="monitor">
            <SettingsSwitch
              label="显示播放控件"
              value={mediaPlayerShowControls}
              onValueChange={onMediaPlayerShowControlsChange}
              hint="显示播放/暂停、上/下一个控件（点击屏幕切换）"
            />
            
            <View style={styles.rotationSpacer} />
            <SettingsRadioGroup
              label="内容适配模式"
              options={[
                { value: 'contain', label: '包含（适配屏幕）' },
                { value: 'cover', label: '覆盖（填充屏幕，可能裁剪）' },
                { value: 'fill', label: '填充（拉伸适配）' },
              ]}
              value={mediaPlayerFitMode}
              onValueChange={(v) => onMediaPlayerFitModeChange(v as MediaFitMode)}
            />
            
            <View style={styles.rotationSpacer} />
            <SettingsInput
              label="背景色"
              value={mediaPlayerBgColor}
              onChangeText={onMediaPlayerBgColorChange}
              placeholder="#000000"
              hint="媒体未覆盖区域的十六进制颜色（例如 #000000 表示黑色）"
            />
            
            <View style={styles.rotationSpacer} />
            <SettingsSwitch
              label="淡入淡出过渡"
              value={mediaPlayerTransition}
              onValueChange={onMediaPlayerTransitionChange}
              hint="媒体项目之间的平滑淡入淡出过渡"
            />
            
            {mediaPlayerTransition && (
              <SettingsInput
                label="过渡持续时间（毫秒）"
                value={mediaPlayerTransitionDuration}
                onChangeText={onMediaPlayerTransitionDurationChange}
                placeholder="500"
                keyboardType="numeric"
                hint="淡入淡出效果的持续时间（0-3000毫秒）"
              />
            )}
          </SettingsSection>
        </>
      )}
      
      {/* URL Input (WebView mode) */}
      {displayMode === 'webview' && (
        <SettingsSection title="要显示的 URL" icon="link-variant">
          <SettingsSwitch
            label="使用仪表盘模式"
            value={dashboardModeEnabled}
            onValueChange={onDashboardModeEnabledChange}
            hint="用多网址仪表盘替换单个网址"
          />

          {dashboardModeEnabled ? (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                Dashboard mode is active. Configure your tiles in the Dashboard tab.
              </Text>
            </SettingsInfoBox>
          ) : (
            <>
              <SettingsInput
                label=""
                value={url}
                onChangeText={onUrlChange}
                placeholder="https://example.com"
                keyboardType="url"
                hint="示例：https://www.freekiosk.app"
              />

              {url.trim().toLowerCase().startsWith('http://') && (
                <SettingsInfoBox variant="warning">
                  <Text style={styles.infoText}>
                    ⚠️ SECURITY: This URL uses HTTP (unencrypted).{`
`}
                    Your data can be intercepted. Use HTTPS instead.
                  </Text>
                </SettingsInfoBox>
              )}
            </>
          )}
        </SettingsSection>
      )}
      
      {/* HTTP Basic Auth (WebView mode only) */}
      {displayMode === 'webview' && (
        <SettingsSection title="网站认证" icon="lock-outline">
          <SettingsInput
            label="用户名"
            value={basicAuthUsername}
            onChangeText={onBasicAuthUsernameChange}
            placeholder="留空表示禁用"
            hint="HTTP 基本认证的用户名（401 质询）"
            autoCapitalize="none"
          />
          {basicAuthUsername.trim().length > 0 && (
            <SettingsInput
              label="密码"
              value={basicAuthPassword}
              onChangeText={onBasicAuthPasswordChange}
              placeholder="Password"
              secureTextEntry={true}
              hint="存储在设备密钥链中（非明文）"
              autoCapitalize="none"
            />
          )}
          <SettingsInfoBox variant="info">
            <Text style={styles.infoText}>
              When a website returns a 401 Unauthorized response, FreeKiosk will automatically reply with these credentials. Leave username empty to disable.
            </Text>
          </SettingsInfoBox>
        </SettingsSection>
      )}

      {/* URL Rotation (WebView mode only) */}
      {displayMode === 'webview' && (
        <SettingsSection title="网址轮播" icon="sync">
          {dashboardModeEnabled && (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                URL Rotation is disabled in Dashboard mode.
              </Text>
            </SettingsInfoBox>
          )}
          {!dashboardModeEnabled && (
            <>
              <SettingsSwitch
                label="启用轮播"
                value={urlRotationEnabled}
                onValueChange={onUrlRotationEnabledChange}
                hint="自动循环多个网址"
              />

              {urlRotationEnabled && (
                <>
                  <View style={styles.rotationSpacer} />
                  <UrlListEditor
                    urls={urlRotationList}
                    onUrlsChange={onUrlRotationListChange}
                  />

                  <View style={styles.rotationSpacer} />
                  <SettingsInput
                    label="轮播间隔（秒）"
                    value={urlRotationInterval}
                    onChangeText={onUrlRotationIntervalChange}
                    placeholder="30"
                    keyboardType="numeric"
                    hint="每次网址切换之间的时间（最少 5 秒）"
                  />

                  {urlRotationList.length < 2 && (
                    <SettingsInfoBox variant="warning">
                      <Text style={styles.infoText}>
                        ⚠️ Add at least 2 URLs to enable rotation
                      </Text>
                    </SettingsInfoBox>
                  )}
                </>
              )}
            </>
          )}
        </SettingsSection>
      )}
      
      {/* URL Planner (WebView mode only) */}
      {displayMode === 'webview' && (
        <SettingsSection title="网址计划" icon="calendar-clock">
          <SettingsSwitch
            label="启用定时网址"
            value={urlPlannerEnabled}
            onValueChange={onUrlPlannerEnabledChange}
            hint="在定时时间显示特定网址"
          />
          
          {urlPlannerEnabled && (
            <>
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  📌 Scheduled events take priority over URL Rotation.{`
`}
                  One-time events take priority over recurring events.
                </Text>
              </SettingsInfoBox>
              
              <View style={styles.rotationSpacer} />
              
              <ScheduleEventList
                events={urlPlannerEvents}
                onEventsChange={onUrlPlannerEventsChange}
                onAddRecurring={onAddRecurringEvent}
                onAddOneTime={onAddOneTimeEvent}
                onEditEvent={onEditEvent}
              />
            </>
          )}
        </SettingsSection>
      )}
      
      {/* External App Sub-Mode Selection */}
      {displayMode === 'external_app' && (
        <>
          <SettingsSection title="应用模式" icon="apps">
            <SettingsModeSelector
              options={[
                { value: 'single', label: 'Single App', icon: 'cellphone' },
                { value: 'multi', label: 'Multi App', icon: 'view-grid', badge: 'BETA', badgeColor: Colors.warning },
              ]}
              value={externalAppMode}
              onValueChange={(value) => onExternalAppModeChange(value as 'single' | 'multi')}
              hint={externalAppMode === 'single'
                ? 'Launch a single app in kiosk mode (classic behavior)'
                : 'Display a home screen grid with multiple apps'}
            />
          </SettingsSection>
          
          {/* Single App: classic package name + picker */}
          {externalAppMode === 'single' && (
            <SettingsSection title="应用" icon="cellphone-link">
              <SettingsInput
                label="包名"
                value={externalAppPackage}
                onChangeText={onExternalAppPackageChange}
                placeholder="com.example.app"
                hint="输入包名或选择应用"
              />
              
              <SettingsButton
                title={loadingApps ? 'Loading...' : 'Choose an Application'}
                icon="format-list-bulleted"
                variant="success"
                onPress={onPickApp}
                disabled={loadingApps}
                loading={loadingApps}
              />
            </SettingsSection>
          )}
          
          {/* Multi App: managed apps grid */}
          {externalAppMode === 'multi' && (
            <SettingsSection title="应用列表" icon="view-grid">
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  {'📱 Add apps to display on the home screen grid.\n'}
                  {'Users can choose which app to launch.\n\n'}
                  {'Toggle options per app: show on home screen, launch on boot, keep alive, accessibility.'}
                </Text>
              </SettingsInfoBox>
              <ManagedAppsSection
                managedApps={managedApps}
                onManagedAppsChange={onManagedAppsChange}
                isDeviceOwner={isDeviceOwner}
              />
            </SettingsSection>
          )}
          
          {/* Managed Apps for Single App mode (optional, for background/accessibility features) */}
          {externalAppMode === 'single' && (
            <SettingsSection title="额外托管应用" icon="apps">
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  {'📋 Optional: add extra apps for background monitoring, boot launch, or accessibility whitelist.\n'}
                  {'These apps will NOT appear on the home screen in single app mode.'}
                </Text>
              </SettingsInfoBox>
              <ManagedAppsSection
                managedApps={managedApps}
                onManagedAppsChange={onManagedAppsChange}
                isDeviceOwner={isDeviceOwner}
              />
            </SettingsSection>
          )}
          
          {/* Overlay Permission */}
          <SettingsSection
            variant={hasOverlayPermission ? 'success' : 'warning'}
          >
            <View style={styles.permissionRow}>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: hasOverlayPermission ? Colors.successDark : Colors.warningDark }]}>
                  {hasOverlayPermission ? '✓ Return Button Enabled' : '⚠️ Overlay 需要权限'}
                </Text>
                <Text style={styles.permissionHint}>
                  {hasOverlayPermission
                    ? "The return button will be functional on the external app."
                    : "Enable permission to use the return button on the app."}
                </Text>
              </View>
            </View>
            
            {!hasOverlayPermission && (
              <SettingsButton
                title="启用权限"
                variant="success"
                onPress={onRequestOverlayPermission}
              />
            )}
          </SettingsSection>
          
          {/* Usage Stats Permission - required for auto-relaunch monitoring */}
          <SettingsSection
            variant={hasUsageStatsPermission ? 'success' : 'warning'}
          >
            <View style={styles.permissionRow}>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: hasUsageStatsPermission ? Colors.successDark : Colors.warningDark }]}>
                  {hasUsageStatsPermission ? '✓ Usage Access Granted' : '⚠️ Usage Access Required'}
                </Text>
                <Text style={styles.permissionHint}>
                  {hasUsageStatsPermission
                    ? "Auto-relaunch monitoring is active. FreeKiosk can detect when the external app closes."
                    : "Required for auto-relaunch. Without this, FreeKiosk cannot detect when the external app closes or crashes."}
                </Text>
              </View>
            </View>
            
            {!hasUsageStatsPermission && (
              <SettingsButton
                title="Grant Usage Access"
                variant="warning"
                onPress={onRequestUsageStatsPermission}
              />
            )}
          </SettingsSection>
        </>
      )}
      
      {/* Password Configuration */}
      <SettingsSection title="Password" icon="pin">
        <SettingsSwitch
          label="高级密码模式"
          hint="启用带特殊字符的字母数字密码。禁用则仅限数字 PIN 码（4-6位）。"
          value={pinMode === 'alphanumeric'}
          onValueChange={(enabled) => onPinModeChange(enabled ? 'alphanumeric' : 'numeric')}
        />
        
        <SettingsInput
          label=""
          value={pin}
          onChangeText={onPinChange}
          placeholder={isPinConfigured && !pinModeChanged ? '••••' : '1234'}
          keyboardType={pinMode === 'alphanumeric' ? 'default' : 'numeric'}
          secureTextEntry
          maxLength={pinMode === 'alphanumeric' ? undefined : 6}
          autoCapitalize={pinMode === 'alphanumeric' ? 'none' : undefined}
          error={pinModeChanged && !pin ? '⚠️ New password required after mode change' : undefined}
          hint={pinModeChanged
            ? '⚠️ Mode changed - You MUST enter a new password'
            : isPinConfigured
              ? '✓ Password configured - Leave empty to keep current password'
              : pinMode === 'alphanumeric'
                ? 'Minimum 4 characters. Can include letters, numbers, and special characters.'
                : 'Numeric PIN: 4-6 digits (default: 1234)'}
        />
        
        <View style={styles.pinAttemptsContainer}>
          <SettingsInput
            label="🔒 锁定前最大尝试次数（15分钟）"
            value={pinMaxAttemptsText}
            onChangeText={onPinMaxAttemptsChange}
            onBlur={onPinMaxAttemptsBlur}
            keyboardType="numeric"
            maxLength={3}
            placeholder="5"
            hint="允许的错误密码尝试次数（1-100）"
          />
        </View>
      </SettingsSection>
      
      {/* Inactivity Return to Home - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="Inactivity Return" icon="timer-sand">
          <SettingsSwitch
            label="无操作返回起始页"
            value={inactivityReturnEnabled}
            onValueChange={onInactivityReturnEnabledChange}
            hint="屏幕在规定时间内未被触摸时自动返回起始网址"
          />
          
          {inactivityReturnEnabled && (
            <>
              <View style={styles.rotationSpacer} />
              <SettingsInput
                label="无操作超时（秒）"
                value={inactivityReturnDelay}
                onChangeText={onInactivityReturnDelayChange}
                placeholder="60"
                keyboardType="numeric"
                hint="返回起始页前的时间（秒）（5-3600）"
              />
              
              <View style={styles.rotationSpacer} />
              <SettingsSwitch
                label="页面加载时重置计时器"
                value={inactivityReturnResetOnNav}
                onValueChange={onInactivityReturnResetOnNavChange}
                hint="WebView 中加载新页面时重新开始无操作计时"
              />
              
              <SettingsSwitch
                label="返回时清除缓存"
                value={inactivityReturnClearCache}
                onValueChange={onInactivityReturnClearCacheChange}
                hint="返回起始页时清除 WebView 缓存（完全重新加载）"
              />
              
              <SettingsSwitch
                label="在起始页滚动到顶部"
                value={inactivityReturnScrollTop}
                onValueChange={onInactivityReturnScrollTopChange}
                hint="已在起始页时平滑滚动回页面顶部"
              />
              
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  ℹ️ The timer resets on every touch interaction.{`\n`}
                  If already on the start page and scroll-to-top is enabled, the page will scroll up.{`\n`}
                  Disabled during URL Rotation, URL Planner, and Screensaver.
                </Text>
              </SettingsInfoBox>
            </>
          )}
        </SettingsSection>
      )}
      
      {/* Auto Reload - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="Auto Reload" icon="refresh">
          <SettingsSwitch
            label="出错时重新加载"
            hint="网络错误时自动重新加载页面"
            value={autoReload}
            onValueChange={onAutoReloadChange}
          />
        </SettingsSection>
      )}
      
      {/* PDF Viewer - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="PDF Viewer" icon="file-pdf-box">
          <SettingsSwitch
            label="内联 PDF 查看器"
            hint="在浏览器中直接显示 PDF 文件而不是下载"
            value={pdfViewerEnabled}
            onValueChange={onPdfViewerEnabledChange}
          />
          
          {pdfViewerEnabled && (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                {'📄 PDF links will open in a built-in viewer with page navigation and zoom controls.\n\n'}
                {'⚠️ Enabling this feature allows file access in the WebView for the local PDF renderer. Only enable if your kiosk website links to PDF files.'}
              </Text>
            </SettingsInfoBox>
          )}
        </SettingsSection>
      )}
      
      {/* Printing - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="打印" icon="printer">
          <SettingsSwitch
            label="允许打印"
            hint="启用网页的 window.print() 支持（标签打印机、收据等）"
            value={printEnabled}
            onValueChange={onPrintEnabledChange}
          />
          
          {printEnabled && (
            <>
              <View style={styles.rotationSpacer} />
              <SettingsRadioGroup
                label="默认纸张大小"
                options={[
                  { value: 'A4',     label: 'A4（210 × 297 毫米）' },
                  { value: 'A5',     label: 'A5（148 × 210 毫米）' },
                  { value: 'A3',     label: 'A3（297 × 420 毫米）' },
                  { value: 'LETTER', label: 'Letter（8.5 × 11 英寸）' },
                  { value: 'LEGAL',  label: 'Legal（8.5 × 14 英寸）' },
                ]}
                value={printPaperSize}
                onValueChange={onPrintPaperSizeChange}
              />
            </>
          )}

          {printEnabled && (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                {'🖨️ Web pages can trigger the Android print dialog via window.print().\n\n'}
                {'In Device Owner (kiosk) mode, the system print spooler is automatically whitelisted to allow the print dialog to appear.\n\n'}
                {'Supports WiFi, Bluetooth, USB printers, and Save as PDF.'}
              </Text>
            </SettingsInfoBox>
          )}
        </SettingsSection>
      )}
      
      {/* WebView Back Button - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="Web Navigation Button" icon="arrow-left-circle">
          <SettingsSwitch
            label="启用返回按钮"
            hint="显示浮动按钮以在网页历史中返回（不是应用导航）"
            value={webViewBackButtonEnabled}
            onValueChange={onWebViewBackButtonEnabledChange}
          />
          
          {webViewBackButtonEnabled && (
            <>
              <View style={styles.rotationSpacer} />
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  ℹ️ This button only navigates within the web page history.{`
`}
                  It will NOT exit the kiosk mode or return to settings.
                </Text>
              </SettingsInfoBox>
              
              <View style={styles.rotationSpacer} />
              <SettingsInput
                label="X 轴位置（%）"
                value={webViewBackButtonXPercent}
                onChangeText={onWebViewBackButtonXPercentChange}
                placeholder="2"
                keyboardType="numeric"
                hint="水平位置：0%（左侧）到 100%（右侧）"
              />
              
              <SettingsInput
                label="Y 轴位置（%）"
                value={webViewBackButtonYPercent}
                onChangeText={onWebViewBackButtonYPercentChange}
                placeholder="10"
                keyboardType="numeric"
                hint="垂直位置：0%（顶部）到 100%（底部）"
              />
              
              <SettingsButton
                title="Reset to Default Position"
                icon="restore"
                variant="outline"
                onPress={onResetWebViewBackButtonPosition}
              />
            </>
          )}
        </SettingsSection>
      )}
      
      {/* Background Apps - WebView mode only */}
      {displayMode === 'webview' && (
        <SettingsSection title="Background Apps" icon="apps">
          <SettingsInfoBox variant="info">
            <Text style={styles.infoText}>
              {'📋 Optional: add apps to launch and keep running in the background while the kiosk WebView is displayed.\n\n'}
              {'Example: keep a music or audio receiver app alive alongside your web dashboard.'}
            </Text>
          </SettingsInfoBox>
          <ManagedAppsSection
            managedApps={managedApps}
            onManagedAppsChange={onManagedAppsChange}
            isDeviceOwner={isDeviceOwner}
            showHomeScreenToggle={false}
          />
        </SettingsSection>
      )}

      {/* 返回自助终端 Button */}
      <SettingsButton
        title="返回自助终端"
        icon="arrow-u-left-top"
        variant="outline"
        onPress={onBackToKiosk}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  infoText: {
    ...Typography.body,
    lineHeight: 22,
  },
  infoTitle: {
    ...Typography.label,
    color: Colors.infoDark,
    marginBottom: Spacing.sm,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    ...Typography.label,
    marginBottom: 4,
  },
  permissionHint: {
    ...Typography.hint,
  },
  pinAttemptsContainer: {
    marginTop: Spacing.lg,
  },
  rotationSpacer: {
    height: Spacing.md,
  },
  mediaItemCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mediaItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mediaItemIndex: {
    ...Typography.label,
    color: Colors.textSecondary,
    width: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  mediaItemTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  mediaItemTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mediaItemDeleteBtn: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaItemDeleteText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  pickButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButtonDisabled: {
    opacity: 0.5,
  },
  pickButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  pickButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButtonSmallText: {
    fontSize: 20,
  },
  localBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: Colors.successLight,
    marginLeft: 6,
  },
  localBadgeText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  localFileInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  localFileName: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  localFilePath: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 11,
  },
});

export default GeneralTab;
