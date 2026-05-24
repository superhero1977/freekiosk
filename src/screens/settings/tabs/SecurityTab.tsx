/**
 * FreeKiosk v1.2 - Security Tab
 * Lock mode, Auto-launch, External app behavior
 */

import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import {
  SettingsSection,
  SettingsSwitch,
  SettingsRadioGroup,
  SettingsInput,
  SettingsInfoBox,
  SettingsButton,
  SettingsModeSelector,
  UrlListEditor,
} from '../../../components/settings';
import { Colors, Spacing, Typography } from '../../../theme';

interface SecurityTabProps {
  displayMode: 'webview' | 'external_app' | 'media_player';
  isDeviceOwner: boolean;
  navigation?: any; // Navigation prop for sub-screens
  
  // Lock mode
  kioskEnabled: boolean;
  onKioskEnabledChange: (value: boolean) => void;
  
  // Power button
  allowPowerButton: boolean;
  onAllowPowerButtonChange: (value: boolean) => void;
  
  // Notifications (NFC support)
  allowNotifications: boolean;
  onAllowNotificationsChange: (value: boolean) => void;
  
  // System Info (audio fix for Samsung)
  allowSystemInfo: boolean;
  onAllowSystemInfoChange: (value: boolean) => void;
  
  // Return to Settings
  returnMode: string; // 'tap_anywhere' | 'button'
  onReturnModeChange: (value: string) => void;
  returnTapCount: string;
  onReturnTapCountChange: (value: string) => void;
  returnTapTimeout: string;
  onReturnTapTimeoutChange: (value: string) => void;
  returnButtonPosition: string; // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onReturnButtonPositionChange: (value: string) => void;
  overlayButtonVisible: boolean;
  onOverlayButtonVisibleChange: (value: boolean) => void;
  volumeUp5TapEnabled: boolean;
  onVolumeUp5TapEnabledChange: (value: boolean) => void;
  
  // Auto launch
  autoLaunchEnabled: boolean;
  onAutoLaunchChange: (value: boolean) => void;
  onOpenSystemSettings: () => void;
  
  // External app specific
  autoRelaunchApp: boolean;
  onAutoRelaunchAppChange: (value: boolean) => void;
  backButtonMode: string;
  onBackButtonModeChange: (value: string) => void;
  backButtonTimerDelay: string;
  onBackButtonTimerDelayChange: (value: string) => void;
  
  // URL Filtering
  urlFilterEnabled: boolean;
  onUrlFilterEnabledChange: (value: boolean) => void;
  urlFilterMode: string; // 'blacklist' | 'whitelist'
  onUrlFilterModeChange: (value: string) => void;
  urlFilterList: string[];
  onUrlFilterListChange: (patterns: string[]) => void;
  urlFilterShowFeedback: boolean;
  onUrlFilterShowFeedbackChange: (value: boolean) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  displayMode,
  isDeviceOwner,
  navigation,
  kioskEnabled,
  onKioskEnabledChange,
  allowPowerButton,
  onAllowPowerButtonChange,
  allowNotifications,
  onAllowNotificationsChange,
  allowSystemInfo,
  onAllowSystemInfoChange,
  returnMode,
  onReturnModeChange,
  returnTapCount,
  onReturnTapCountChange,
  returnTapTimeout,
  onReturnTapTimeoutChange,
  returnButtonPosition,
  onReturnButtonPositionChange,
  overlayButtonVisible,
  onOverlayButtonVisibleChange,
  volumeUp5TapEnabled,
  onVolumeUp5TapEnabledChange,
  autoLaunchEnabled,
  onAutoLaunchChange,
  onOpenSystemSettings,
  autoRelaunchApp,
  onAutoRelaunchAppChange,
  backButtonMode,
  onBackButtonModeChange,
  backButtonTimerDelay,
  onBackButtonTimerDelayChange,
  urlFilterEnabled,
  onUrlFilterEnabledChange,
  urlFilterMode,
  onUrlFilterModeChange,
  urlFilterList,
  onUrlFilterListChange,
  urlFilterShowFeedback,
  onUrlFilterShowFeedbackChange,
}) => {
  return (
    <View>
      {/* Lock Mode */}
      <SettingsSection title="锁定模式" icon="lock">
        <SettingsSwitch
          label="启用锁定模式"
          hint="防止用户退出自助终端应用。需要 PIN 码才能退出。"
          value={kioskEnabled}
          onValueChange={onKioskEnabledChange}
        />
        
        {!kioskEnabled && (
          <SettingsInfoBox variant="warning">
            <Text style={styles.infoText}>
              ⚠️ With Lock Mode disabled, users can exit the app normally
            </Text>
          </SettingsInfoBox>
        )}
        
        {kioskEnabled && (displayMode === 'webview' || displayMode === 'media_player') && isDeviceOwner && (
          <SettingsInfoBox variant="info">
            <Text style={styles.infoText}>
              ℹ️ 已启用屏幕固定：只有 5 次点击手势 + PIN 码允许退出
            </Text>
          </SettingsInfoBox>
        )}
        
        {kioskEnabled && (displayMode === 'webview' || displayMode === 'media_player') && !isDeviceOwner && (
          <SettingsInfoBox variant="warning">
            <Text style={styles.infoText}>
              ⚠️ Without Device Owner, users can exit via Back + Recent Apps gesture. Set FreeKiosk as Device Owner for complete lockdown.
            </Text>
          </SettingsInfoBox>
        )}
        
        {kioskEnabled && displayMode === 'external_app' && !isDeviceOwner && (
          <SettingsInfoBox variant="error">
            <Text style={styles.infoText}>
              ⚠️ 需要设备所有者权限：在没有设备所有者权限的情况下，外部应用模式下的锁定模式将无法工作。
            </Text>
          </SettingsInfoBox>
        )}
        
        {kioskEnabled && displayMode === 'external_app' && isDeviceOwner && (
          <SettingsInfoBox variant="info">
            <Text style={styles.infoText}>
              ℹ️ 锁定模式已启用：只有在屏幕上任意位置点击 5 次 + PIN 码允许退出外部应用
            </Text>
          </SettingsInfoBox>
        )}
        
        {/* Power Button Setting - Only show when Lock Mode is enabled and Device Owner */}
        {kioskEnabled && isDeviceOwner && (
          <>
            <View style={styles.divider} />
            <SettingsSwitch
              label="🔌 屏蔽电源菜单"
              hint="When enabled, long-pressing the power button has no effect — it can only turn the screen on/off with a short press. When disabled, long-pressing shows the power menu (Restart/Shutdown). ⚠️ Blocking the power menu may cause audio to be muted on some Samsung/OneUI devices."
              value={!allowPowerButton}
              onValueChange={(value) => onAllowPowerButtonChange(!value)}
            />
            <View style={styles.divider} />
            <SettingsSwitch
              label="📡 允许通知（NFC）"
              hint="启用通知调度以允许在外部应用中读取 NFC 标签。⚠️ 注意：启用后 Android 会显示主页按钮（无效）并可访问通知面板。"
              value={allowNotifications}
              onValueChange={onAllowNotificationsChange}
            />
            <View style={styles.divider} />
            <SettingsSwitch
              label="ℹ️ 显示系统信息栏"
              hint="在锁定应用中显示原生 Android 状态栏（时间、电池、连接状态）。这也可修复某些三星/OneUI 设备在锁定模式下音频静音的问题。"
              value={allowSystemInfo}
              onValueChange={onAllowSystemInfoChange}
            />
          </>
        )}
      </SettingsSection>
      
      {/* Auto Launch */}
      <SettingsSection title="自动启动" icon="rocket-launch">
        <SettingsSwitch
          label="开机启动"
          hint="设备启动时自动启动 FreeKiosk"
          value={autoLaunchEnabled}
          onValueChange={onAutoLaunchChange}
        />
        
        <SettingsInfoBox variant="info">
          <Text style={styles.infoText}>
            ℹ️ 请确保已在系统设置中启用"显示在其他应用上层"权限以确保可靠的自动启动。
          </Text>
        </SettingsInfoBox>
        
        <SettingsButton
          title="打开系统设置"
          icon="cog-outline"
          variant="primary"
          onPress={onOpenSystemSettings}
        />
      </SettingsSection>
      
      {/* Return to Settings */}
      <SettingsSection title="返回设置" icon="gesture-tap">
        <SettingsRadioGroup
          hint="选择返回设置的方式"
          options={[
            {
              value: 'tap_anywhere',
              label: '任意位置点击',
              icon: 'gesture-tap',
              hint: '在同一区域快速点击 N 次（点击需连续）',
            },
            {
              value: 'button',
              label: '固定按钮',
              icon: 'square-outline',
              hint: '点击角落按钮 N 次',
            },
          ]}
          value={returnMode}
          onValueChange={onReturnModeChange}
        />
        <View style={styles.divider} />
        
        <SettingsInput
          label="点击次数（2-20）"
          hint={returnMode === 'button' ? '访问设置所需的点击次数' : '在屏幕任意位置快速点击此次数以访问设置'}
          value={returnTapCount}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            onReturnTapCountChange(filtered);
          }}
          keyboardType="numeric"
          placeholder="5"
          maxLength={2}
          error={returnTapCount !== '' && (parseInt(returnTapCount, 10) < 2 || parseInt(returnTapCount, 10) > 20) ? '必须在 2 到 20 之间' : undefined}
        />
        
        <SettingsInput
          label="检测超时（500-5000 毫秒）"
          hint="完成所有点击的时间窗口。较大的值使检测更容易，但可能意外触发。"
          value={returnTapTimeout}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            onReturnTapTimeoutChange(filtered);
          }}
          keyboardType="numeric"
          placeholder="1500"
          maxLength={4}
          error={returnTapTimeout !== '' && (parseInt(returnTapTimeout, 10) < 500 || parseInt(returnTapTimeout, 10) > 5000) ? '必须在 500 到 5000 之间' : undefined}
        />
        
        {returnMode === 'button' && (
          <>
            <View style={styles.divider} />
            {displayMode === 'external_app' && (
              <>
                <SettingsRadioGroup
                  hint="按钮在屏幕上的位置"
                  options={[
                    { value: 'top-left', label: 'Top Left', icon: 'arrow-top-left' },
                    { value: 'top-right', label: 'Top Right', icon: 'arrow-top-right' },
                    { value: 'bottom-left', label: '左下', icon: 'arrow-bottom-left' },
                    { value: 'bottom-right', label: '右下', icon: 'arrow-bottom-right' },
                  ]}
                  value={returnButtonPosition}
                  onValueChange={onReturnButtonPositionChange}
                />
                <View style={styles.divider} />
              </>
            )}
            <SettingsSwitch
              label="👁️ 显示按钮"
              hint={displayMode === 'external_app' 
                ? "显示返回按钮。隐藏时，它仍然有效但不可见。" 
                : "显示视觉按钮指示器"}
              value={overlayButtonVisible}
              onValueChange={onOverlayButtonVisibleChange}
            />
          </>
        )}
        
        <>
          <View style={styles.divider} />
          <SettingsSwitch
            label="🔊 音量键替代方案"
            hint={displayMode === 'external_app'
              ? '允许多次按音量键访问设置（默认在应用模式下禁用，以避免正常音量调整时意外触发）'
              : '也允许多次按音量键访问设置'}
            value={volumeUp5TapEnabled}
            onValueChange={onVolumeUp5TapEnabledChange}
          />
        </>
        
        <SettingsInfoBox variant="info">
          <Text style={styles.infoText}>
            ℹ️ {returnMode === 'button' && displayMode === 'external_app' 
              ? `Tap the return button (${returnButtonPosition}) ${returnTapCount || '5'} times to access settings`
              : `Tap anywhere on screen ${returnTapCount || '5'} times within ${returnTapTimeout ? `${(parseInt(returnTapTimeout, 10) / 1000).toFixed(1)}s` : '1.5s'} to access settings`}
            {kioskEnabled && ' (PIN required)'}
          </Text>
        </SettingsInfoBox>
      </SettingsSection>
      
      {/* Touch Blocking Overlays - Works without Device Owner but less secure */}
      <SettingsSection title="触摸屏蔽" icon="gesture-tap-button">
        <SettingsInfoBox variant="info">
          <Text style={styles.infoText}>
            ℹ️ Block touch input on specific screen areas (e.g., navigation bars, toolbars) to prevent users from interacting with certain parts of {displayMode === 'webview' ? 'the website' : 'external apps'}.
          </Text>
        </SettingsInfoBox>
        
        {(!kioskEnabled || !isDeviceOwner) && (
          <SettingsInfoBox variant="warning">
            <Text style={styles.infoText}>
              ⚠️ Without Lock Mode + Device Owner, users can still exit the app via Home/Back buttons. For maximum security, enable both.
            </Text>
          </SettingsInfoBox>
        )}
        
        <SettingsButton
          title="配置遮挡叠加层"
          icon="rectangle-outline"
          variant="primary"
          onPress={() => navigation?.navigate('BlockingOverlays')}
        />
        
        {kioskEnabled && isDeviceOwner && (
          <SettingsInfoBox variant="success">
            <Text style={styles.infoText}>
              ✅ 锁定模式 + 设备所有者已激活。已启用最大安全性。
            </Text>
          </SettingsInfoBox>
        )}
      </SettingsSection>
      
      {/* URL Filtering - Blacklist/Whitelist (WebView mode only) */}
      {displayMode === 'webview' && (
        <SettingsSection title="网址过滤" icon="shield-lock">
          <SettingsSwitch
            label="启用网址过滤"
            hint="控制自助终端浏览器中可以访问哪些网址"
            value={urlFilterEnabled}
            onValueChange={onUrlFilterEnabledChange}
          />
          
          {urlFilterEnabled && (
            <>
              <View style={styles.divider} />
              
              <SettingsModeSelector
                label="过滤模式"
                options={[
                  {
                    value: 'blacklist',
                    label: '黑名单',
                    icon: 'close-circle',
                  },
                  {
                    value: 'whitelist',
                    label: '白名单',
                    icon: 'check-circle-outline',
                  },
                ]}
                value={urlFilterMode}
                onValueChange={onUrlFilterModeChange}
                hint={urlFilterMode === 'blacklist' 
                  ? '与这些模式匹配的网址将被阻止。主要自助终端网址始终被允许，即使匹配模式。' 
                  : '仅允许主要自助终端网址和与这些模式匹配的网址。留空列表时，只能访问您的主自助终端网址。'}
              />
              
              <View style={styles.divider} />
              
              <UrlListEditor
                urls={urlFilterList}
                onUrlsChange={onUrlFilterListChange}
                maxUrls={0}
                patternMode={true}
                placeholder={urlFilterMode === 'blacklist' ? '*facebook.com*' : '*mysite.com/*'}
                emptyTitle="No patterns added yet"
                emptyHint={urlFilterMode === 'blacklist' 
                  ? 'Add URL patterns to block' 
                  : 'Only your main kiosk URL is currently allowed. Add patterns to allow more URLs.'}
              />
              
              <SettingsInfoBox variant="info">
                <Text style={styles.infoText}>
                  {'ℹ️ 使用 * 作为通配符匹配任意字符。\n\n'}
                  {'示例：\n'}
                  {'• *facebook.com* → 匹配任何包含 facebook.com 的网址\n'}
                  {'• */privacy* → 匹配任何包含 /privacy 的路径\n'}
                  {'• https://example.com/admin/* → 匹配所有管理员页面'}
                </Text>
              </SettingsInfoBox>
              
              <SettingsInfoBox variant="success">
                <Text style={styles.infoText}>
                  {'✅ 在"常规"设置中配置的主要自助终端网址始终被允许，即使它匹配黑名单模式。您无需将其添加到白名单中。'}
                </Text>
              </SettingsInfoBox>
              
              <View style={styles.divider} />
              
              <SettingsSwitch
                label="显示屏蔽通知"
                hint="当网址被阻止时短暂显示提示消息"
                value={urlFilterShowFeedback}
                onValueChange={onUrlFilterShowFeedbackChange}
              />
            </>
          )}
        </SettingsSection>
      )}
      
      {/* External App Specific Settings */}
      {displayMode === 'external_app' && (
        <>
          {/* Auto Relaunch */}
          <SettingsSection title="外部应用行为" icon="application">
            <SettingsSwitch
              label="🔄 自动重启应用"
              hint="如果应用关闭或崩溃则自动重新启动"
              value={autoRelaunchApp}
              onValueChange={onAutoRelaunchAppChange}
            />
          </SettingsSection>
          
          {/* Back Button Behavior */}
          <SettingsSection title="返回按钮行为" icon="undo">
            <SettingsRadioGroup
              hint="按下 Android 返回键时的操作"
              options={[
                {
                  value: 'test',
                  label: '测试模式',
                  icon: 'test-tube',
                  hint: '返回键正常工作（用于测试）',
                },
                {
                  value: 'immediate',
                  label: '立即返回',
                  icon: 'flash',
                  hint: '立即重新启动应用',
                },
                {
                  value: 'timer',
                  label: '延迟返回',
                  icon: 'timer',
                  hint: '等待 X 秒后自动重新启动应用',
                },
              ]}
              value={backButtonMode}
              onValueChange={onBackButtonModeChange}
            />
            
            {backButtonMode === 'timer' && (
              <View style={styles.timerInput}>
                <SettingsInput
                  label="延迟（1-3600 秒）"
                  value={backButtonTimerDelay}
                  onChangeText={(text) => {
                    const num = text.replace(/[^0-9]/g, '');
                    onBackButtonTimerDelayChange(num);
                  }}
                  keyboardType="numeric"
                  placeholder="10"
                  maxLength={4}
                />
              </View>
            )}
          </SettingsSection>
        </>
      )}
      
      {/* Return Mechanism Info - Always visible */}
      <SettingsSection variant="info">
        <Text style={styles.infoTitle}>ℹ️ 返回设置</Text>
        <Text style={styles.infoText}>
          {displayMode === 'external_app' && returnMode === 'button'
            ? `• 在 ${returnButtonPosition} 处点击返回按钮 ${returnTapCount || '5'} 次${overlayButtonVisible ? '' : '（不可见）'}`
            : `• 在 ${returnTapTimeout ? `${(parseInt(returnTapTimeout, 10) / 1000).toFixed(1)}` : '1.5'} 秒内在屏幕任意位置点击 ${returnTapCount || '5'} 次${overlayButtonVisible ? '（可见视觉指示器）' : ''}`}
          {displayMode === 'external_app' && '\n• 或使用最近应用选择器'}
          {(displayMode === 'webview' || displayMode === 'media_player') && volumeUp5TapEnabled && `\n• 或快速按音量键 ${returnTapCount || '5'} 次`}
        </Text>
      </SettingsSection>
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
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  timerInput: {
    marginTop: Spacing.md,
    paddingLeft: Spacing.xxl,
  },
});

export default SecurityTab;
