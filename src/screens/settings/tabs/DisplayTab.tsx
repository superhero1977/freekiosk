/**
 * FreeKiosk v1.2 - Display Tab
 * Brightness, Status Bar, Keyboard settings
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import {
  SettingsSection,
  SettingsSwitch,
  SettingsSlider,
  SettingsRadioGroup,
  SettingsInfoBox,
  SettingsInput,
} from '../../../components/settings';
import ScreenScheduleRuleCard from '../../../components/settings/ScreenScheduleRuleCard';
import { Colors, Spacing, Typography } from '../../../theme';
import { ScreenScheduleRule } from '../../../types/screenScheduler';
import type { MediaItem } from '../../../types/mediaPlayer';
import { getMediaDisplayName } from '../../../types/mediaPlayer';

interface DisplayTabProps {
  displayMode: 'webview' | 'external_app' | 'media_player';
  
  // Brightness management (allow system to manage)
  brightnessManagementEnabled: boolean;
  onBrightnessManagementEnabledChange: (value: boolean) => void;
  
  // Default brightness
  defaultBrightness: number;
  onDefaultBrightnessChange: (value: number) => void;
  
  // Auto-brightness
  autoBrightnessEnabled: boolean;
  onAutoBrightnessEnabledChange: (value: boolean) => void;
  autoBrightnessMin: number;
  onAutoBrightnessMinChange: (value: number) => void;
  autoBrightnessMax: number;
  onAutoBrightnessMaxChange: (value: number) => void;
  autoBrightnessOffset: number;
  onAutoBrightnessOffsetChange: (value: number) => void;
  currentLightLevel: number;
  hasLightSensor: boolean;
  
  // Status bar
  statusBarEnabled: boolean;
  onStatusBarEnabledChange: (value: boolean) => void;
  statusBarOnOverlay: boolean;
  onStatusBarOnOverlayChange: (value: boolean) => void;
  statusBarOnReturn: boolean;
  onStatusBarOnReturnChange: (value: boolean) => void;
  
  // Status bar items
  showBattery: boolean;
  onShowBatteryChange: (value: boolean) => void;
  showWifi: boolean;
  onShowWifiChange: (value: boolean) => void;
  showBluetooth: boolean;
  onShowBluetoothChange: (value: boolean) => void;
  showVolume: boolean;
  onShowVolumeChange: (value: boolean) => void;
  showTime: boolean;
  onShowTimeChange: (value: boolean) => void;
  
  // Keyboard mode
  keyboardMode: string;
  onKeyboardModeChange: (value: string) => void;
  
  // WebView Zoom Level
  zoomLevel: number;
  onZoomLevelChange: (value: number) => void;
  disableUserZoom: boolean;
  onDisableUserZoomChange: (value: boolean) => void;
  
  // 自定义 User Agent
  customUserAgent: string;
  onCustomUserAgentChange: (value: string) => void;
  
  // Screensaver
  screensaverEnabled: boolean;
  onScreensaverEnabledChange: (value: boolean) => void;
  screensaverBrightness: number;
  onScreensaverBrightnessChange: (value: number) => void;
  inactivityDelay: string;
  onInactivityDelayChange: (value: string) => void;

  // Screensaver style (dim/url/video)
  screensaverType: 'dim' | 'url' | 'video';
  onScreensaverTypeChange: (value: 'dim' | 'url' | 'video') => void;
  screensaverUrl: string;
  onScreensaverUrlChange: (value: string) => void;
  screensaverVideoItems: MediaItem[];
  onScreensaverVideoItemsChange: (items: MediaItem[]) => void;
  screensaverVideoLoop: boolean;
  onScreensaverVideoLoopChange: (value: boolean) => void;
  onPickScreensaverMedia: (type: 'video' | 'image' | 'any') => void;
  pickingScreensaverMedia: boolean;

  // Motion detection
  motionEnabled: boolean;
  onMotionEnabledChange: (value: boolean) => void;
  motionSensitivity: 'low' | 'medium' | 'high';
  onMotionSensitivityChange: (value: 'low' | 'medium' | 'high') => void;
  motionCameraPosition: 'front' | 'back';
  onMotionCameraPositionChange: (value: 'front' | 'back') => void;
  availableCameras: Array<{position: 'front' | 'back', id: string}>;
  
  // Screen Sleep Scheduler
  screenSchedulerEnabled: boolean;
  onScreenSchedulerEnabledChange: (value: boolean) => void;
  screenSchedulerRules: ScreenScheduleRule[];
  onScreenSchedulerRulesChange: (rules: ScreenScheduleRule[]) => void;
  screenSchedulerWakeOnTouch: boolean;
  onScreenSchedulerWakeOnTouchChange: (value: boolean) => void;
  onAddScheduleRule: () => void;
  onEditScheduleRule: (rule: ScreenScheduleRule) => void;
  
  // 保持屏幕常亮
  keepScreenOn: boolean;
  onKeepScreenOnChange: (value: boolean) => void;

  // 熄屏自动唤醒
  autoWakeOnScreenOff: boolean;
  onAutoWakeOnScreenOffChange: (value: boolean) => void;
}

const DisplayTab: React.FC<DisplayTabProps> = ({
  displayMode,
  brightnessManagementEnabled,
  onBrightnessManagementEnabledChange,
  defaultBrightness,
  onDefaultBrightnessChange,
  autoBrightnessEnabled,
  onAutoBrightnessEnabledChange,
  autoBrightnessMin,
  onAutoBrightnessMinChange,
  autoBrightnessMax,
  onAutoBrightnessMaxChange,
  autoBrightnessOffset,
  onAutoBrightnessOffsetChange,
  currentLightLevel,
  hasLightSensor,
  statusBarEnabled,
  onStatusBarEnabledChange,
  statusBarOnOverlay,
  onStatusBarOnOverlayChange,
  statusBarOnReturn,
  onStatusBarOnReturnChange,
  showBattery,
  onShowBatteryChange,
  showWifi,
  onShowWifiChange,
  showBluetooth,
  onShowBluetoothChange,
  showVolume,
  onShowVolumeChange,
  showTime,
  onShowTimeChange,
  keyboardMode,
  onKeyboardModeChange,
  zoomLevel,
  onZoomLevelChange,
  disableUserZoom,
  onDisableUserZoomChange,
  customUserAgent,
  onCustomUserAgentChange,
  screensaverEnabled,
  onScreensaverEnabledChange,
  screensaverBrightness,
  onScreensaverBrightnessChange,
  inactivityDelay,
  onInactivityDelayChange,
  screensaverType,
  onScreensaverTypeChange,
  screensaverUrl,
  onScreensaverUrlChange,
  screensaverVideoItems,
  onScreensaverVideoItemsChange,
  screensaverVideoLoop,
  onScreensaverVideoLoopChange,
  onPickScreensaverMedia,
  pickingScreensaverMedia,
  motionEnabled,
  onMotionEnabledChange,
  motionSensitivity,
  onMotionSensitivityChange,
  motionCameraPosition,
  onMotionCameraPositionChange,
  availableCameras,
  screenSchedulerEnabled,
  onScreenSchedulerEnabledChange,
  screenSchedulerRules,
  onScreenSchedulerRulesChange,
  screenSchedulerWakeOnTouch,
  onScreenSchedulerWakeOnTouchChange,
  keepScreenOn,
  onKeepScreenOnChange,
  autoWakeOnScreenOff,
  onAutoWakeOnScreenOffChange,
  onAddScheduleRule,
  onEditScheduleRule,
}) => {
  const handleCameraPositionChange = (value: string) => {
    if (value === 'front' || value === 'back') {
      onMotionCameraPositionChange(value);
    }
  };

  const handleMotionSensitivityChange = (value: string) => {
    if (value === 'low' || value === 'medium' || value === 'high') {
      onMotionSensitivityChange(value);
    }
  };

  // Generate camera options from available cameras (deduplicated by position)
  const uniquePositions = Array.from(new Set(availableCameras.map(cam => cam.position)));
  const cameraOptions = uniquePositions.map(position => ({
    label: position === 'front' ? '前置摄像头' : '后置摄像头',
    value: position,
  }));

  // Check whether the selected camera is available on this device
  const selectedCameraAvailable = availableCameras.some(cam => cam.position === motionCameraPosition);

  return (
    <View>
      {/* 应用亮度控制 toggle - WebView mode only (external app mode doesn't manage brightness) */}
      {displayMode !== 'external_app' && (
        <SettingsSection title="亮度控制" icon="brightness-6">
          <SettingsSwitch
            label="应用亮度控制"
            hint={brightnessManagementEnabled
              ? "FreeKiosk manages screen brightness"
              : "System manages brightness (Tasker, Android settings, etc.)"}
            value={brightnessManagementEnabled}
            onValueChange={onBrightnessManagementEnabledChange}
          />
          {!brightnessManagementEnabled && (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                💡 Brightness is managed by the system. External tools like Tasker can control brightness without interference from FreeKiosk.
              </Text>
            </SettingsInfoBox>
          )}
        </SettingsSection>
      )}

      {/* Default Brightness - Only in WebView mode and when app manages brightness */}
      {displayMode !== 'external_app' && brightnessManagementEnabled && (
        <SettingsSection title="手动亮度" icon="brightness-6">
          <SettingsSlider
            label=""
            hint={autoBrightnessEnabled 
              ? "自动亮度激活时已禁用" 
              : "屏幕亮度级别（0% - 100%）"}
            value={defaultBrightness}
            onValueChange={onDefaultBrightnessChange}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            disabled={autoBrightnessEnabled}
          />
          {autoBrightnessEnabled && (
            <SettingsInfoBox variant="warning">
              <Text style={styles.infoText}>⚠️ 自动亮度激活时手动亮度控制已禁用</Text>
            </SettingsInfoBox>
          )}
        </SettingsSection>
      )}
      
      {/* Auto-Brightness - WebView only, and only when app manages brightness */}
      {displayMode !== 'external_app' && brightnessManagementEnabled && (
        <SettingsSection title="自动亮度" icon="brightness-auto">
          <SettingsSwitch
            label="启用自动亮度"
            hint="根据环境光线自动调整屏幕亮度"
            value={autoBrightnessEnabled}
            onValueChange={onAutoBrightnessEnabledChange}
            disabled={!hasLightSensor}
          />
          
          {!hasLightSensor && (
            <SettingsInfoBox variant="error">
              <Text style={styles.infoText}>⚠️ 此设备没有光线传感器</Text>
            </SettingsInfoBox>
          )}
          
          {hasLightSensor && autoBrightnessEnabled && (
            <>
              <SettingsSlider
                label="最低亮度"
                hint="黑暗环境下的最低亮度"
                value={autoBrightnessMin}
                onValueChange={onAutoBrightnessMinChange}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                presets={[
                  { label: '5%', value: 0.05 },
                  { label: '10%', value: 0.1 },
                  { label: '20%', value: 0.2 },
                ]}
              />
              
              <SettingsSlider
                label="最高亮度"
                hint="明亮环境下的最高亮度"
                value={autoBrightnessMax}
                onValueChange={onAutoBrightnessMaxChange}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                presets={[
                  { label: '80%', value: 0.8 },
                  { label: '90%', value: 0.9 },
                  { label: '100%', value: 1.0 },
                ]}
              />
              
              <SettingsSlider
                label="亮度偏移"
                hint="添加到计算的自动亮度值（例如 +10% 使其始终稍亮）"
                value={autoBrightnessOffset}
                onValueChange={onAutoBrightnessOffsetChange}
                minimumValue={0}
                maximumValue={0.5}
                step={0.05}
                presets={[
                  { label: '0%', value: 0 },
                  { label: '+10%', value: 0.1 },
                  { label: '+20%', value: 0.2 },
                ]}
              />
              
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  💡 当前光线级别： {currentLightLevel.toFixed(1)} lux
                </Text>
              </SettingsInfoBox>
            </>
          )}
        </SettingsSection>
      )}
      
      {/* Screen Always On - WebView mode only (external app mode: system manages screen) */}
      {displayMode !== 'external_app' && (
      <SettingsSection title="屏幕常亮" icon="monitor">
        <SettingsSwitch
          label="保持屏幕常亮"
          hint={keepScreenOn
            ? "屏幕始终保持开启（标准自助终端行为）"
            : "系统管理屏幕超时——无操作后屏幕将像普通设备一样关闭"}
          value={keepScreenOn}
          onValueChange={onKeepScreenOnChange}
        />
        {!keepScreenOn && (
          <SettingsInfoBox variant="warning">
            <Text style={styles.infoText}>⚠️ 设备将使用 Android 显示超时设置自动关闭屏幕。{`\n`}
              请在 Android 设置 → 显示 → 屏幕超时中配置超时时间。{`\n`}
              当屏幕管理交由系统控制时，屏保将被禁用。
            </Text>
          </SettingsInfoBox>
        )}
        <SettingsSwitch
          label="熄屏自动唤醒"
          hint={autoWakeOnScreenOff
            ? "屏幕关闭时将自动重新打开（例如按电源键）"
            : "通过电源键或系统关闭屏幕后保持关闭"}
          value={autoWakeOnScreenOff}
          onValueChange={onAutoWakeOnScreenOffChange}
        />
        {autoWakeOnScreenOff && (
          <SettingsInfoBox variant="info">
            <Text style={styles.infoText}>当屏幕关闭时（例如短按电源键），经过短暂闪烁后将自动重新打开。适用于无法物理遮挡电源键的自助终端设备。</Text>
          </SettingsInfoBox>
        )}
      </SettingsSection>
      )}
      
      {/* Screensaver - available in all display modes (keepScreenOn required for webview/media_player) */}
      {(displayMode === 'external_app' || keepScreenOn) && (
        <SettingsSection title="屏保" icon="weather-night">
          <SettingsSwitch
            label="启用屏保"
            hint="在一段时间无操作后激活屏保"
            value={screensaverEnabled}
            onValueChange={onScreensaverEnabledChange}
          />

          {screensaverEnabled && (
            <>
              {/* Screensaver Style (dim / url / video) */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>屏保样式</Text>
                <SettingsRadioGroup
                  options={[
                    { label: '仅调暗（默认）', value: 'dim', hint: '仅调暗亮度（当前行为）' },
                    { label: '网页', value: 'url', hint: '显示网页（时钟、仪表盘、HTML）' },
                    { label: '视频 / 图片', value: 'video', hint: '播放视频或图片幻灯片' },
                  ]}
                  value={screensaverType}
                  onValueChange={(v) => onScreensaverTypeChange(v as 'dim' | 'url' | 'video')}
                />

                {screensaverType === 'url' && (
                  <>
                    <SettingsInput
                      label="屏保网址"
                      value={screensaverUrl}
                      onChangeText={onScreensaverUrlChange}
                      placeholder="https://example.com/clock"
                      keyboardType="url"
                      autoCapitalize="none"
                      hint="页面以只读方式显示；点击任意位置唤醒"
                    />
                    {screensaverUrl.trim().length > 0 && (() => {
                      try { new URL(screensaverUrl.trim()); return null; } catch {
                        return (
                          <SettingsInfoBox variant="error">
                            <Text style={styles.infoText}>
                              ⚠️ 无效的网址。请输入以 https:// 或 http:// 开头的完整网址
                            </Text>
                          </SettingsInfoBox>
                        );
                      }
                    })()}
                  </>
                )}

                {screensaverType === 'video' && (
                  <>
                    <SettingsInfoBox variant="info">
                      <Text style={styles.infoText}>
                        {'🎬 Pick a video or image from your device.\n'}
                        {'Multiple items play as a slideshow.'}
                      </Text>
                    </SettingsInfoBox>
                    <TouchableOpacity
                      style={[styles.ssPickButton, pickingScreensaverMedia && styles.ssPickButtonDisabled]}
                      onPress={() => !pickingScreensaverMedia && onPickScreensaverMedia('any')}
                      disabled={pickingScreensaverMedia}
                    >
                      <Text style={styles.ssPickButtonText}>
                        {pickingScreensaverMedia ? '⏳ Picking…' : '📁 从设备选择'}
                      </Text>
                    </TouchableOpacity>

                    {screensaverVideoItems.map((item, index) => (
                      <View key={item.id} style={styles.ssMediaCard}>
                        <Text style={styles.ssMediaIndex}>{index + 1}</Text>
                        <Text style={styles.ssMediaName} numberOfLines={1}>
                          {item.type === 'video' ? '🎥 ' : '🖼️ '}{getMediaDisplayName(item)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            onScreensaverVideoItemsChange(screensaverVideoItems.filter(i => i.id !== item.id));
                          }}
                        >
                          <Text style={styles.ssMediaDelete}>✗</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <SettingsSwitch
                      label="循环播放列表"
                      hint="播放列表结束后从头开始"
                      value={screensaverVideoLoop}
                      onValueChange={onScreensaverVideoLoopChange}
                    />

                    {screensaverVideoItems.length === 0 && (
                      <SettingsInfoBox variant="warning">
                        <Text style={styles.infoText}>
                          ⚠️ No media selected. The screensaver will appear blank until you pick at least one item.
                        </Text>
                      </SettingsInfoBox>
                    )}
                  </>
                )}

                {(screensaverType === 'url' || screensaverType === 'video') && screensaverBrightness < 0.1 && brightnessManagementEnabled && (
                  <SettingsInfoBox variant="warning">
                    <Text style={styles.infoText}>
                      ⚠️ 屏保亮度低于 10%。请调高（见下方滑块）使内容可见，或切换为仅调暗模式。
                    </Text>
                  </SettingsInfoBox>
                )}
              </View>

              {/* Screensaver Brightness - only when app manages brightness */}
              {brightnessManagementEnabled && (
                <View style={styles.subSection}>
                  <Text style={styles.subSectionTitle}>Screensaver Brightness</Text>
                  <SettingsSlider
                    label=""
                    hint="屏保激活时的屏幕亮度"
                    value={screensaverBrightness}
                    onValueChange={onScreensaverBrightnessChange}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    presets={[
                      { label: '黑屏', value: 0 },
                      { label: '非常暗（5%）', value: 0.05 },
                      { label: '暗（10%）', value: 0.1 },
                    ]}
                  />
                </View>
              )}
              
              {/* Inactivity Delay */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Inactivity Delay</Text>
                <SettingsInput
                  label=""
                  value={inactivityDelay}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text)) {
                      onInactivityDelayChange(text);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholder="10"
                  hint="屏保激活前的等待时间（分钟）"
                />
              </View>
              
              {/* Motion Detection */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>运动检测</Text>
                <SettingsSwitch
                  label="启用检测"
                  hint="摄像头检测到运动时唤醒屏幕"
                  value={motionEnabled}
                  onValueChange={onMotionEnabledChange}
                />
                
                {motionEnabled && (
                  <>
                    <SettingsRadioGroup
                      label="灵敏度"
                      hint="较高的灵敏度会在较小的运动时触发"
                      options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                      ]}
                      value={motionSensitivity}
                      onValueChange={handleMotionSensitivityChange}
                    />

                    {availableCameras.length === 0 && (
                      <SettingsInfoBox variant="error">
                        <Text style={styles.infoText}>
                          ⚠️ No camera detected on this device
                        </Text>
                      </SettingsInfoBox>
                    )}
                    
                    {availableCameras.length === 1 && (
                      <SettingsInfoBox variant="info">
                        <Text style={styles.infoText}>
                          📹 使用{availableCameras[0].position === 'front' ? '前置' : '后置'}摄像头（唯一可用的摄像头）
                        </Text>
                      </SettingsInfoBox>
                    )}
                    
                    {availableCameras.length > 1 && (
                      <>
                        <SettingsRadioGroup
                          label="摄像头位置"
                          hint="选择用于运动检测的摄像头"
                          options={cameraOptions}
                          value={motionCameraPosition}
                          onValueChange={handleCameraPositionChange}
                        />
                        
                        {!selectedCameraAvailable && (
                          <SettingsInfoBox variant="warning">
                            <Text style={styles.infoText}>
                              ⚠️ 所选摄像头在此设备上不可用
                            </Text>
                          </SettingsInfoBox>
                        )}
                      </>
                    )}

                  </>
                )}
              </View>
              
              {/* How it works */}
              <View style={styles.subSection}>
                <Text style={styles.infoTitle}>ℹ️ 工作原理</Text>
                <Text style={styles.infoText}>
                  • 屏保在无操作 {inactivityDelay || '10'} 分钟后激活{`
`}
                  {displayMode === 'external_app'
                    ? `• FreeKiosk 进入前台显示屏保；外部应用在唤醒时恢复
`
                    : ''}
                  • 触摸屏幕唤醒设备{`
`}
                  {motionEnabled && `• 摄像头前的运动也会唤醒屏幕
`}
                  • 亮度会自动恢复正常
                </Text>
              </View>
            </>
          )}
        </SettingsSection>
      )}
      
      {/* Screen Sleep Scheduler */}
      <SettingsSection title="屏幕休眠计划" icon="power-sleep">
        <SettingsSwitch
          label="启用屏幕定时"
          hint="在定时时间自动关闭/开启屏幕以节能"
          value={screenSchedulerEnabled}
          onValueChange={onScreenSchedulerEnabledChange}
        />
        
        {screenSchedulerEnabled && (
          <>
            {/* Schedule Rules List */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>计划规则</Text>
              {screenSchedulerRules.length === 0 ? (
                <SettingsInfoBox variant="info">
                  <Text style={styles.infoText}>
                    尚未配置规则。添加规则以定义屏幕何时应关闭。
                  </Text>
                </SettingsInfoBox>
              ) : (
                <View style={styles.rulesContainer}>
                  {screenSchedulerRules.map((rule) => (
                    <ScreenScheduleRuleCard
                      key={rule.id}
                      rule={rule}
                      onToggle={(id, enabled) => {
                        onScreenSchedulerRulesChange(
                          screenSchedulerRules.map(r =>
                            r.id === id ? { ...r, enabled } : r
                          )
                        );
                      }}
                      onEdit={onEditScheduleRule}
                      onDelete={(id) => {
                        Alert.alert(
                          '删除规则',
                          '确定要删除此计划规则吗？',
                          [
                            { text: '取消', style: 'cancel' },
                            {
                              text: '删除',
                              style: 'destructive',
                              onPress: () => {
                                onScreenSchedulerRulesChange(
                                  screenSchedulerRules.filter(r => r.id !== id)
                                );
                              },
                            },
                          ]
                        );
                      }}
                    />
                  ))}
                </View>
              )}
              
              <TouchableOpacity style={styles.addRuleButton} onPress={onAddScheduleRule}>
                <Text style={styles.addRuleButtonText}>➕ Add Schedule Rule</Text>
              </TouchableOpacity>
            </View>
            
            {/* 触摸唤醒 option */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Wake Options</Text>
              <SettingsSwitch
                label="触摸唤醒"
                hint="在定时休眠期间触摸屏幕时允许临时唤醒"
                value={screenSchedulerWakeOnTouch}
                onValueChange={onScreenSchedulerWakeOnTouchChange}
              />
              {!screenSchedulerWakeOnTouch && (
                <SettingsInfoBox variant="warning">
                  <Text style={styles.infoText}>
                    ⚠️ 休眠期间触摸无法唤醒屏幕。使用计划的唤醒时间或 REST API 来重新打开屏幕。
                  </Text>
                </SettingsInfoBox>
              )}
            </View>
            
            {/* How it works */}
            <View style={styles.subSection}>
              <Text style={styles.infoTitle}>ℹ️ 屏幕计划工作原理</Text>
              <Text style={styles.infoText}>
                • Screen turns OFF automatically at the scheduled sleep time{`\n`}
                • Screen turns ON automatically at the scheduled wake time{`\n`}
                • Multiple rules can cover different days/times{`\n`}
                • Overnight rules (e.g., 22:00→07:00) are supported{`\n`}
                {screenSchedulerWakeOnTouch
                  ? '• Touch the screen to temporarily wake it during sleep\n'
                  : '• Touch wake is disabled during sleep periods\n'
                }
                {`\n`}
                {'📱 Device Owner: screen is truly locked (lockNow) + native alarm for wake\n'}
                {'📱 Non Device Owner: brightness set to 0 + black overlay\n'}
                {'⏰ Wake alarm uses Android AlarmManager for reliable timing'}
              </Text>
            </View>
          </>
        )}
      </SettingsSection>
      
      {/* Status Bar */}
      <SettingsSection title="系统状态栏" icon="chart-bar">
        <SettingsSwitch
          label="显示状态栏"
          hint="在屏幕顶部显示电池、Wi-Fi、蓝牙、音量和时间"
          value={statusBarEnabled}
          onValueChange={onStatusBarEnabledChange}
        />
        
        {statusBarEnabled && (
          <View style={styles.subSection}>
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                📐 布局：项目位于左右两侧以避开中心摄像头区域
              </Text>
            </SettingsInfoBox>
            
            {/* Customize Status Bar Items */}
            <Text style={styles.subSectionTitle}>🎨 自定义项目</Text>
            
            <View style={styles.itemsGrid}>
              <SettingsSwitch
                label="🔋 电池"
                value={showBattery}
                onValueChange={onShowBatteryChange}
              />
              
              <SettingsSwitch
                label="📶 Wi-Fi"
                value={showWifi}
                onValueChange={onShowWifiChange}
              />
              
              <SettingsSwitch
                label="📘 蓝牙"
                value={showBluetooth}
                onValueChange={onShowBluetoothChange}
              />
              
              <SettingsSwitch
                label="🔊 音量"
                value={showVolume}
                onValueChange={onShowVolumeChange}
              />
              
              <SettingsSwitch
                label="🕐 时间"
                value={showTime}
                onValueChange={onShowTimeChange}
              />
            </View>
            
            {/* External App specific options */}
            {displayMode === 'external_app' && (
              <View style={styles.externalAppOptions}>
                <Text style={styles.subSectionTitle}>📱 External App Mode Options</Text>
                
                <SettingsSwitch
                  label="在外部应用上（叠加层）"
                  hint="在外部应用上方显示状态栏叠加层"
                  value={statusBarOnOverlay}
                  onValueChange={onStatusBarOnOverlayChange}
                />
                
                <SettingsSwitch
                  label="在返回界面"
                  hint='在"外部应用运行中"界面显示状态栏'
                  value={statusBarOnReturn}
                  onValueChange={onStatusBarOnReturnChange}
                />
              </View>
            )}
            
            {(displayMode === 'webview' || displayMode === 'media_player') && (
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  {displayMode === 'webview' ? 'WebView' : '媒体播放器'} 模式：状态栏显示在网页内容上方
                </Text>
              </SettingsInfoBox>
            )}
          </View>
        )}
      </SettingsSection>
      
      {/* Web Page Zoom - Only in WebView mode */}
      {displayMode === 'webview' && (
        <SettingsSection title="网页缩放" icon="magnify">
          <SettingsSlider
            label=""
            hint={`Zoom level: ${zoomLevel}% — Adjusts how web pages are rendered. 100% matches Chrome's default.`}
            value={zoomLevel}
            onValueChange={(val) => onZoomLevelChange(Math.round(val))}
            minimumValue={50}
            maximumValue={200}
            step={5}
            formatValue={(val) => `${Math.round(val)}%`}
            presets={[
              { label: '75%', value: 75 },
              { label: '100%', value: 100 },
              { label: '125%', value: 125 },
              { label: '150%', value: 150 },
            ]}
          />
          {zoomLevel !== 100 && (
            <SettingsInfoBox variant="info">
              <Text style={styles.infoText}>
                🔍 Zoom is set to {zoomLevel}%. Tap the "100%" preset to reset to default.
              </Text>
            </SettingsInfoBox>
          )}
          <SettingsSwitch
            label="禁用用户缩放"
            hint="禁止网页上的双指缩放和双击缩放。上述管理员缩放级别仍然有效。"
            value={disableUserZoom}
            onValueChange={onDisableUserZoomChange}
          />
        </SettingsSection>
      )}
      
      {/* 自定义 User Agent - Only in WebView mode */}
      {displayMode === 'webview' && (
        <SettingsSection title="用户代理" icon="web">
          <SettingsInput
            label="自定义 User Agent"
            hint={customUserAgent.trim() ? '自定义 UA 已激活。清除此字段以使用默认值。' : '留空以使用默认的现代 Chrome 用户代理字符串。某些托管服务商（例如 SiteGround）会阻止旧版或可疑的用户代理。'}
            value={customUserAgent}
            onChangeText={onCustomUserAgentChange}
            placeholder="Mozilla/5.0 (Linux; Android 13; ...) Chrome/131..."
            autoCapitalize="none"
            multiline={true}
          />
          {customUserAgent.trim() !== '' && (
            <SettingsInfoBox variant="warning">
              <Text style={styles.infoText}>
                ⚠️ 自定义 User Agent 已激活。某些网站可能在使用非标准 UA 字符串时出现异常行为。
              </Text>
            </SettingsInfoBox>
          )}
        </SettingsSection>
      )}
      
      {/* Keyboard Mode - Only in WebView mode */}
      {displayMode === 'webview' && (
        <SettingsSection title="键盘模式" icon="keyboard-outline">
          <SettingsRadioGroup
            hint="控制输入字段显示的键盘类型"
            options={[
              {
                value: 'default',
                label: '默认',
                hint: '尊重网站设置（推荐）',
              },
              {
                value: 'force_numeric',
                label: '强制数字',
                hint: '所有字段显示数字键盘',
              },
              {
                value: 'smart',
                label: '智能检测',
                hint: '仅检测并转换数字字段',
              },
            ]}
            value={keyboardMode}
            onValueChange={onKeyboardModeChange}
          />
        </SettingsSection>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  subSectionTitle: {
    ...Typography.labelSmall,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  itemsGrid: {
    gap: Spacing.xs,
  },
  externalAppOptions: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  infoText: {
    ...Typography.body,
    color: Colors.infoDark,
  },
  infoTitle: {
    ...Typography.label,
    color: Colors.infoDark,
    marginBottom: Spacing.sm,
  },
  rulesContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  addRuleButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  addRuleButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  ssPickButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  ssPickButtonDisabled: {
    opacity: 0.5,
  },
  ssPickButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  ssMediaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginVertical: Spacing.xs,
  },
  ssMediaIndex: {
    fontWeight: '600',
    marginRight: Spacing.sm,
    color: Colors.textSecondary,
    minWidth: 20,
  },
  ssMediaName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  ssMediaDelete: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.sm,
  },
});

export default DisplayTab;
