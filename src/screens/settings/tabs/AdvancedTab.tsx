/**
 * FreeKiosk v1.2 - Advanced Tab
 * SSL Certificates, Updates, Reset, Device Owner, REST API
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, AppState, NativeModules } from 'react-native';
import {
  SettingsSection,
  SettingsButton,
  SettingsInfoBox,
  BackupRestoreSection,
} from '../../../components/settings';
import { ApiSettingsSection } from '../../../components/ApiSettingsSection';
import { MqttSettingsSection } from '../../../components/MqttSettingsSection';
import { CertificateInfo } from '../../../utils/CertificateModule';
import AccessibilityModule from '../../../utils/AccessibilityModule';
import { Colors, Spacing, Typography } from '../../../theme';

const { KioskModule } = NativeModules;

interface AdvancedTabProps {
  displayMode: 'webview' | 'external_app' | 'media_player';
  isDeviceOwner: boolean;
  
  // Play Store compliance: when false, the entire Updates section is hidden
  enableSelfUpdate: boolean;
  
  // Version & updates
  currentVersion: string;
  checkingUpdate: boolean;
  downloading: boolean;
  updateAvailable: boolean;
  updateInfo: any;
  betaUpdatesEnabled: boolean;
  onBetaUpdatesChange: (value: boolean) => void;
  onCheckForUpdates: () => void;
  onDownloadUpdate: () => void;
  
  // SSL Certificates
  certificates: CertificateInfo[];
  onRemoveCertificate: (fingerprint: string, url: string) => void;
  
  // Actions
  onResetSettings: () => void;
  onExitKioskMode: () => void;
  onRemoveDeviceOwner: () => void;
  kioskEnabled: boolean;
  
  // Backup/Restore
  onRestoreComplete?: () => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  displayMode,
  isDeviceOwner,
  enableSelfUpdate,
  currentVersion,
  checkingUpdate,
  downloading,
  updateAvailable,
  updateInfo,
  betaUpdatesEnabled,
  onBetaUpdatesChange,
  onCheckForUpdates,
  onDownloadUpdate,
  certificates,
  onRemoveCertificate,
  onResetSettings,
  onExitKioskMode,
  onRemoveDeviceOwner,
  kioskEnabled,
  onRestoreComplete,
}) => {
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [accessibilityRunning, setAccessibilityRunning] = useState(false);

  const checkAccessibilityStatus = useCallback(async () => {
    try {
      const enabled = await AccessibilityModule.isAccessibilityServiceEnabled();
      const running = await AccessibilityModule.isAccessibilityServiceRunning();
      setAccessibilityEnabled(enabled);
      setAccessibilityRunning(running);
    } catch {
      // Ignore errors on iOS
    }
  }, []);

  useEffect(() => {
    checkAccessibilityStatus();
    // Re-check when the app returns from system settings
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkAccessibilityStatus();
      }
    });
    return () => subscription.remove();
  }, [checkAccessibilityStatus]);

  const handleOpenAccessibilitySettings = async () => {
    try {
      // Use KioskModule.openAndroidSettings which properly handles Lock Task Mode
      // (temporarily exits lock task before launching the settings intent)
      await KioskModule.openAndroidSettings('accessibility');
    } catch (e: any) {
      Alert.alert('错误', '无法打开无障碍设置');
    }
  };

  const handleEnableViaDeviceOwner = async () => {
    try {
      await AccessibilityModule.enableViaDeviceOwner();
      // Re-check status after enabling
      setTimeout(checkAccessibilityStatus, 1000);
      Alert.alert('成功', '无障碍服务已通过设备所有者自动启用。');
    } catch (e: any) {
      if (e.code === 'WRITE_SECURE_SETTINGS_REQUIRED') {
        Alert.alert(
          '需要权限',
          '要自动启用无障碍服务，必须通过 ADB 授予 WRITE_SECURE_SETTINGS 权限（一次性设置）：\n\n' +
          'adb shell pm grant com.freekiosk android.permission.WRITE_SECURE_SETTINGS\n\n' +
          '或者，点击下方"打开无障碍设置"手动启用。',
          [{ text: '确定' }],
        );
      } else {
        Alert.alert('错误', e.message || '通过设备所有者启用失败');
      }
    }
  };
  return (
    <View>
      {/* App Updates - Hidden in Play Store builds (compliance: no in-app updates) */}
      {enableSelfUpdate && (
      <SettingsSection title="Updates" icon="update">
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>Current Version</Text>
          <Text style={styles.versionValue}>{currentVersion}</Text>
        </View>
        
        {updateAvailable && updateInfo && (
          <SettingsInfoBox variant="success" title={`🎉 ${updateInfo.isPrerelease ? '🧪 Beta ' : ''}Update Available`}>
            <Text style={styles.infoText}>
              Version {updateInfo.version} is available!{updateInfo.isPrerelease ? ' (pre-release)' : ''}
              {updateInfo.notes && `\n\n${updateInfo.notes.substring(0, 150)}...`}
            </Text>
          </SettingsInfoBox>
        )}
        
        <View style={styles.betaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.betaLabel}>🧪 Beta Updates</Text>
            <Text style={styles.betaHint}>Receive pre-release versions before stable</Text>
          </View>
          <TouchableOpacity
            style={[styles.betaToggle, betaUpdatesEnabled && styles.betaToggleActive]}
            onPress={() => onBetaUpdatesChange(!betaUpdatesEnabled)}
          >
            <Text style={[styles.betaToggleText, betaUpdatesEnabled && styles.betaToggleTextActive]}>
              {betaUpdatesEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <SettingsButton
          title={checkingUpdate ? '检查中...' : downloading ? '下载中...' : '检查更新'}
          icon={checkingUpdate ? 'timer-sand' : downloading ? 'download' : 'magnify'}
          variant="primary"
          onPress={onCheckForUpdates}
          disabled={checkingUpdate || downloading}
          loading={checkingUpdate}
        />
        
        {updateAvailable && updateInfo && (
          <SettingsButton
            title={downloading ? '下载中...' : '下载并安装'}
            icon="download"
            variant="success"
            onPress={onDownloadUpdate}
            disabled={downloading}
            loading={downloading}
          />
        )}
        
        <Text style={styles.hint}>
          {isDeviceOwner ? '设备所有者模式：从 GitHub 手动更新。' : '从 GitHub 下载并安装更新。'}
        </Text>
      </SettingsSection>
      )}
      
      {/* SSL Certificates - WebView only */}
      {displayMode === 'webview' && (
        <SettingsSection title="Accepted SSL Certificates" icon="certificate-outline">
          <Text style={styles.hint}>
            Self-signed certificates you've accepted. They expire after 1 year.
          </Text>
          
          {certificates.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>未接受任何证书</Text>
            </View>
          ) : (
            <View style={styles.certificatesList}>
              {certificates.map((cert) => (
                <View key={cert.fingerprint} style={styles.certificateItem}>
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateUrl} numberOfLines={1}>
                      {cert.url}
                    </Text>
                    <Text style={styles.certificateFingerprint} numberOfLines={1}>
                      {cert.fingerprint.substring(0, 24)}...
                    </Text>
                    <Text style={[styles.certificateExpiry, cert.isExpired && styles.certificateExpired]}>
                      {cert.isExpired ? '⚠️ Expired: ' : 'Expires: '}
                      {cert.expiryDate}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onRemoveCertificate(cert.fingerprint, cert.url)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </SettingsSection>
      )}
      
      {/* REST API - Home Assistant Integration */}
      <ApiSettingsSection />

      {/* MQTT - Home Assistant Integration */}
      <MqttSettingsSection />

      {/* Accessibility Service - Hidden in Play Store builds (BIND_ACCESSIBILITY_SERVICE policy) */}
      {enableSelfUpdate && (
      <SettingsSection title="无障碍服务" icon="keyboard-outline">
        <View style={styles.accessibilityStatusRow}>
          <Text style={styles.accessibilityStatusLabel}>状态</Text>
          <View style={[
            styles.accessibilityStatusBadge,
            { backgroundColor: accessibilityRunning ? Colors.successLight : accessibilityEnabled ? Colors.warningLight : Colors.errorLight },
          ]}>
            <Text style={[
              styles.accessibilityStatusText,
              { color: accessibilityRunning ? Colors.successDark : accessibilityEnabled ? Colors.warningDark : Colors.errorDark },
            ]}>
              {accessibilityRunning ? '● 运行中' : accessibilityEnabled ? '● 已启用（未连接）' : '○ 已禁用'}
            </Text>
          </View>
        </View>

        <SettingsInfoBox variant="info" title="ℹ️ 为什么需要此权限？">
          <Text style={styles.infoText}>
            无障碍服务允许 FreeKiosk 发送键盘输入（遥控器、文本输入）到外部应用。{'\n\n'}
            没有它，键盘模拟仅在 FreeKiosk 自己的 WebView 内工作。
          </Text>
        </SettingsInfoBox>

        {!accessibilityRunning && (
          <>
            {isDeviceOwner ? (
              <SettingsButton
                title="通过设备所有者自动启用"
                icon="shield-check"
                variant="primary"
                onPress={handleEnableViaDeviceOwner}
              />
            ) : null}
            <SettingsButton
              title="打开无障碍设置"
              icon="open-in-new"
              variant="primary"
              onPress={handleOpenAccessibilitySettings}
            />
            <Text style={styles.hint}>
              {isDeviceOwner
                ? '如果已通过 ADB 授予 WRITE_SECURE_SETTINGS 权限，设备所有者模式可以自动启用该服务。否则，请在 Android 设置中手动启用。'
                : '在设置 → 无障碍 → 已安装的服务中启用"FreeKiosk"。'}
            </Text>
          </>
        )}

        {accessibilityRunning && (
          <Text style={styles.hint}>
            ✅ 所有应用（WebView + 外部应用）的键盘模拟功能可用。
          </Text>
        )}

        {isDeviceOwner && displayMode === 'external_app' && (
          <SettingsInfoBox variant="info" title="🔧 托管应用无障碍">
            <Text style={styles.infoText}>
              您可以在"常规"标签页的"托管应用"部分允许其他应用的无障碍服务。{'\n'}
              每个应用切换"允许无障碍服务"可通过设备所有者将其无障碍服务列入白名单。
            </Text>
          </SettingsInfoBox>
        )}
      </SettingsSection>
      )}

      {/* Backup & Restore */}
      <BackupRestoreSection onRestoreComplete={onRestoreComplete} />

      {/* Android System Settings */}
      <SettingsSection title="Android 系统设置" icon="android">
        <Text style={styles.hint}>
          打开原生 Android 设置以更改 WiFi、音量、显示等。
          当您的设备没有物理导航按钮时很有用。
        </Text>
        {kioskEnabled && (
          <SettingsInfoBox variant="info" title="🔒 自助终端模式已激活">
            <Text style={styles.infoText}>
              自助终端模式将暂时暂停以打开 Android 设置。{'}
              返回 FreeKiosk 时它将自动重新激活。
            </Text>
          </SettingsInfoBox>
        )}
        <SettingsButton
          title="打开 Android 设置"
          icon="cog"
          variant="primary"
          onPress={() => KioskModule.openAndroidSettings(null)}
        />
        <View style={styles.settingsShortcuts}>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('wifi')}
          >
            <Text style={styles.shortcutText}>📶 WiFi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('sound')}
          >
            <Text style={styles.shortcutText}>🔊 Sound</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('display')}
          >
            <Text style={styles.shortcutText}>🔆 显示</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('bluetooth')}
          >
            <Text style={styles.shortcutText}>📡 Bluetooth</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('date')}
          >
            <Text style={styles.shortcutText}>📅 日期和时间</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => KioskModule.openAndroidSettings('apps')}
          >
            <Text style={styles.shortcutText}>📱 Apps</Text>
          </TouchableOpacity>
        </View>
      </SettingsSection>

      {/* Actions */}
      <SettingsSection title="操作" icon="cog-outline">
        <SettingsButton
          title="重置所有设置"
          icon="restart"
          variant="warning"
          onPress={onResetSettings}
        />
        
        {isDeviceOwner && (
          <SettingsButton
            title="移除设备所有者"
            icon="alert"
            variant="danger"
            onPress={onRemoveDeviceOwner}
          />
        )}
        
        {kioskEnabled && (
          <SettingsButton
            title="退出自助终端模式"
            icon="exit-to-app"
            variant="danger"
            onPress={onExitKioskMode}
          />
        )}
      </SettingsSection>
      
      {/* Version footer */}
      <Text style={styles.versionFooter}>
        FreeKiosk v{currentVersion}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  versionLabel: {
    ...Typography.body,
  },
  versionValue: {
    ...Typography.label,
    color: Colors.primary,
  },
  hint: {
    ...Typography.hint,
    marginTop: Spacing.sm,
  },
  infoTitle: {
    ...Typography.label,
    color: Colors.infoDark,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    lineHeight: 22,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Spacing.inputRadius,
    marginTop: Spacing.md,
  },
  emptyStateText: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.textHint,
  },
  certificatesList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: Spacing.inputRadius,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateUrl: {
    ...Typography.label,
    fontSize: 14,
    marginBottom: 4,
  },
  certificateFingerprint: {
    ...Typography.mono,
    marginBottom: 4,
  },
  certificateExpiry: {
    ...Typography.hint,
    color: Colors.primary,
  },
  certificateExpired: {
    color: Colors.error,
    fontWeight: '600',
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: 24,
  },
  accessibilityStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  accessibilityStatusLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  accessibilityStatusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  accessibilityStatusText: {
    ...Typography.label,
    fontSize: 13,
  },
  settingsShortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  shortcutButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.inputRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceVariant,
  },
  shortcutText: {
    ...Typography.label,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  versionFooter: {
    ...Typography.hint,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  betaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  betaLabel: {
    ...Typography.label,
    fontSize: 14,
  },
  betaHint: {
    ...Typography.hint,
    fontSize: 12,
    marginTop: 2,
  },
  betaToggle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  betaToggleActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  betaToggleText: {
    ...Typography.label,
    fontSize: 12,
    color: Colors.textHint,
  },
  betaToggleTextActive: {
    color: '#2E7D32',
  },
});

export default AdvancedTab;
