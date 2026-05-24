/**
 * MqttSettingsSection.tsx
 * Settings section for MQTT / Home Assistant integration
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import SettingsSection from './settings/SettingsSection';
import SettingsSwitch from './settings/SettingsSwitch';
import SettingsInput from './settings/SettingsInput';
import Icon from './Icon';
import { StorageService } from '../utils/storage';
import { mqttClient } from '../utils/MqttModule';
import { getSecureMqttPassword, saveSecureMqttPassword } from '../utils/secureStorage';
import { ApiService } from '../utils/ApiService';

interface MqttSettingsSectionProps {
  onSettingsChanged?: () => void;
}

export const MqttSettingsSection: React.FC<MqttSettingsSectionProps> = ({
  onSettingsChanged,
}) => {
  const [mqttEnabled, setMqttEnabled] = useState(false);
  const [brokerUrl, setBrokerUrl] = useState('');
  const [port, setPort] = useState('1883');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientId, setClientId] = useState('');
  const [baseTopic, setBaseTopic] = useState('freekiosk');
  const [discoveryPrefix, setDiscoveryPrefix] = useState('homeassistant');
  const [statusInterval, setStatusInterval] = useState('30');
  const [allowControl, setAllowControl] = useState(true);
  const [deviceName, setDeviceName] = useState('');
  const [motionAlwaysOn, setMotionAlwaysOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Check connection status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const connected = await mqttClient.isConnected();
      setIsConnected(connected);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen for connection changes
  useEffect(() => {
    const unsubscribe = mqttClient.onConnectionChanged((connected) => {
      setIsConnected(connected);
      setIsLoading(false);
      if (connected) {
        setConnectionError(null);
      }
      // Clear connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    });

    return () => {
      unsubscribe();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  // Listen for connection errors from native
  useEffect(() => {
    const unsubscribe = mqttClient.onConnectionError((message) => {
      setConnectionError(message);
    });
    return unsubscribe;
  }, []);

  const loadSettings = async () => {
    const [
      enabled,
      broker,
      mqttPort,
      user,
      mqttClientId,
      topic,
      prefix,
      interval,
      control,
      mqttDeviceName,
      mqttPassword,
      mqttMotionAlwaysOn,
    ] = await Promise.all([
      StorageService.getMqttEnabled(),
      StorageService.getMqttBrokerUrl(),
      StorageService.getMqttPort(),
      StorageService.getMqttUsername(),
      StorageService.getMqttClientId(),
      StorageService.getMqttBaseTopic(),
      StorageService.getMqttDiscoveryPrefix(),
      StorageService.getMqttStatusInterval(),
      StorageService.getMqttAllowControl(),
      StorageService.getMqttDeviceName(),
      getSecureMqttPassword(),
      StorageService.getMqttMotionAlwaysOn(),
    ]);

    setMqttEnabled(enabled);
    setBrokerUrl(broker);
    setPort(mqttPort.toString());
    setUsername(user);
    setClientId(mqttClientId);
    setBaseTopic(topic);
    setDiscoveryPrefix(prefix);
    setStatusInterval(interval.toString());
    setAllowControl(control);
    setPassword(mqttPassword);
    setMotionAlwaysOn(mqttMotionAlwaysOn);

    // Pre-fill Device Name with Android model if never set
    if (!mqttDeviceName) {
      try {
        const model = await mqttClient.getDeviceModel();
        if (model) {
          setDeviceName(model);
          await StorageService.saveMqttDeviceName(model);
        }
      } catch (e) {
        console.log('[MqttSettings] Could not get device model for pre-fill:', e);
      }
    } else {
      setDeviceName(mqttDeviceName);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setConnectionError(null);
    try {
      // Stop existing client first to avoid ALREADY_RUNNING error
      await ApiService.stopMqtt();
      await ApiService.autoStartMqtt();

      // Set a timeout — if no connection event within 15s, stop loading
      connectionTimeoutRef.current = setTimeout(() => {
        setIsLoading((current) => {
          if (current) {
            setConnectionError('Connection timed out after 15 seconds. Check broker URL, port, and network connectivity.');
            return false;
          }
          return current;
        });
      }, 15000);
    } catch (error: any) {
      console.error('[MqttSettings] Failed to connect MQTT:', error);
      setConnectionError(error.message || 'Unknown error');
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await ApiService.stopMqtt();
      setIsConnected(false);
    } catch (error: any) {
      console.error('[MqttSettings] Failed to disconnect MQTT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMqttEnabledChange = async (enabled: boolean) => {
    setMqttEnabled(enabled);
    await StorageService.saveMqttEnabled(enabled);

    if (!enabled && isConnected) {
      setIsLoading(true);
      try {
        await ApiService.stopMqtt();
        setIsConnected(false);
      } catch (error: any) {
        console.error('[MqttSettings] Failed to stop MQTT:', error);
      } finally {
        setIsLoading(false);
      }
    }

    onSettingsChanged?.();
  };

  const handleBrokerUrlChange = async (value: string) => {
    setBrokerUrl(value);
    await StorageService.saveMqttBrokerUrl(value);
    onSettingsChanged?.();
  };

  const handlePortChange = async (value: string) => {
    setPort(value);
    const portNum = parseInt(value, 10);
    if (!isNaN(portNum) && portNum >= 1 && portNum <= 65535) {
      await StorageService.saveMqttPort(portNum);
      onSettingsChanged?.();
    }
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    await StorageService.saveMqttUsername(value);
    onSettingsChanged?.();
  };

  const handlePasswordChange = async (value: string) => {
    setPassword(value);
    await saveSecureMqttPassword(value);
    onSettingsChanged?.();
  };

  const handleClientIdChange = async (value: string) => {
    setClientId(value);
    await StorageService.saveMqttClientId(value);
    onSettingsChanged?.();
  };

  const handleBaseTopicChange = async (value: string) => {
    setBaseTopic(value);
    await StorageService.saveMqttBaseTopic(value);
    onSettingsChanged?.();
  };

  const handleDiscoveryPrefixChange = async (value: string) => {
    setDiscoveryPrefix(value);
    await StorageService.saveMqttDiscoveryPrefix(value);
    onSettingsChanged?.();
  };

  const handleStatusIntervalChange = async (value: string) => {
    setStatusInterval(value);
    const seconds = parseInt(value, 10);
    if (!isNaN(seconds) && seconds >= 5 && seconds <= 3600) {
      await StorageService.saveMqttStatusInterval(seconds);
      onSettingsChanged?.();
    }
  };

  const handleAllowControlChange = async (value: boolean) => {
    setAllowControl(value);
    await StorageService.saveMqttAllowControl(value);
    onSettingsChanged?.();
  };

  const deviceNameBeforeEditRef = useRef(deviceName);

  const handleDeviceNameChange = async (value: string) => {
    setDeviceName(value);
    await StorageService.saveMqttDeviceName(value);
    onSettingsChanged?.();
  };

  const handleDeviceNameFocus = () => {
    deviceNameBeforeEditRef.current = deviceName;
  };

  const handleDeviceNameBlur = () => {
    // Only prompt reconnect if the name actually changed and MQTT is connected
    if (isConnected && deviceName !== deviceNameBeforeEditRef.current) {
      Alert.alert(
        '需要重新连接',
        '设备名称更改将在重新连接 MQTT 后生效。是否立即重新连接？',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Reconnect',
            onPress: async () => {
              await handleDisconnect();
              setTimeout(() => handleConnect(), 500);
            },
          },
        ]
      );
    }
    deviceNameBeforeEditRef.current = deviceName;
  };

  const handleMotionAlwaysOnChange = async (value: boolean) => {
    setMotionAlwaysOn(value);
    await StorageService.saveMqttMotionAlwaysOn(value);
    onSettingsChanged?.();
  };

  const getStatusColor = () => {
    if (isLoading) return '#FF9800';
    return isConnected ? '#4CAF50' : '#F44336';
  };

  const getStatusText = () => {
    if (isLoading) return '连接中...';
    return isConnected ? '已连接' : '已断开';
  };

  return (
    <SettingsSection
      title="MQTT"
      icon="lan-connect"
    >
      <SettingsSwitch
        label="启用 MQTT"
        value={mqttEnabled}
        onValueChange={handleMqttEnabledChange}
        icon="lan-connect"
      />

      {mqttEnabled && (
        <>
          {/* Connection Status + Connect/Disconnect Button */}
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor() }
              ]} />
              <Text style={styles.statusText}>
                {getStatusText()}
              </Text>
              {isLoading && <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />}
            </View>

            {connectionError && (
              <Text style={styles.errorText}>{connectionError}</Text>
            )}

            {/* Connect / Disconnect button */}
            {!isLoading && (
              <View style={styles.connectButtonRow}>
                {isConnected ? (
                  <TouchableOpacity
                    style={[styles.connectButton, styles.disconnectButton]}
                    onPress={handleDisconnect}
                  >
                    <Icon name="lan-disconnect" size={16} color="#FFF" />
                    <Text style={styles.connectButtonText}>断开连接</Text>
                  </TouchableOpacity>
                ) : brokerUrl.trim().length > 0 ? (
                  <TouchableOpacity
                    style={styles.connectButton}
                    onPress={handleConnect}
                  >
                    <Icon name="lan-connect" size={16} color="#FFF" />
                    <Text style={styles.connectButtonText}>连接</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.connectHint}>输入代理 URL 以连接</Text>
                )}
              </View>
            )}
          </View>

          {/* Broker URL */}
          <SettingsInput
            label="Broker URL"
            value={brokerUrl}
            onChangeText={handleBrokerUrlChange}
            placeholder="e.g. 192.168.1.100"
            keyboardType="url"
            icon="server-network"
            hint="MQTT 代理主机名或 IP 地址（必填）"
          />

          {/* Port */}
          <SettingsInput
            label="端口"
            value={port}
            onChangeText={handlePortChange}
            placeholder="1883"
            keyboardType="numeric"
            icon="numeric"
            hint="端口 1-65535（默认：1883）"
          />

          {/* Username */}
          <SettingsInput
            label="用户名（可选）"
            value={username}
            onChangeText={handleUsernameChange}
            placeholder="如不需要请留空"
            icon="account"
          />

          {/* Password */}
          <SettingsInput
            label="密码（可选）"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="如不需要请留空"
            secureTextEntry
            icon="lock"
            hint={password.length > 0 ? "Password is saved. Leave untouched to keep current password." : undefined}
          />

          {/* Client ID */}
          <SettingsInput
            label="客户端 ID（可选）"
            value={clientId}
            onChangeText={handleClientIdChange}
            placeholder="留空则自动生成"
            icon="identifier"
          />

          {/* Device Name */}
          <SettingsInput
            label="设备名称（可选）"
            value={deviceName}
            onChangeText={handleDeviceNameChange}
            onFocus={handleDeviceNameFocus}
            onBlur={handleDeviceNameBlur}
            placeholder="例如 大厅, 入口, 厨房"
            icon="rename-box"
            hint="MQTT 主题和 HA 设备名称中使用的友好名称。留空则使用 Android ID。"
          />

          {/* Base Topic */}
          <SettingsInput
            label="基础主题"
            value={baseTopic}
            onChangeText={handleBaseTopicChange}
            placeholder="freekiosk"
            icon="tag"
            hint="此设备的 MQTT 基础主题"
          />

          {/* 发现前缀 */}
          <SettingsInput
            label="发现前缀"
            value={discoveryPrefix}
            onChangeText={handleDiscoveryPrefixChange}
            placeholder="homeassistant"
            icon="home-search"
            hint="Home Assistant MQTT 发现前缀"
          />

          {/* Status Interval */}
          <SettingsInput
            label="状态间隔（秒）"
            value={statusInterval}
            onChangeText={handleStatusIntervalChange}
            placeholder="30"
            keyboardType="numeric"
            icon="timer-outline"
            hint="发布状态的频率（5-3600 秒）"
          />

          {/* 允许远程控制 */}
          <SettingsSwitch
            label="允许远程控制"
            value={allowControl}
            onValueChange={handleAllowControlChange}
            icon="remote"
            hint="启用通过 MQTT 发送的命令（亮度、重新加载等）"
          />

          {/* 持续运动检测 */}
          <SettingsSwitch
            label="持续运动检测"
            value={motionAlwaysOn}
            onValueChange={handleMotionAlwaysOnChange}
            icon="motion-sensor"
            hint="持续运行基于摄像头的运动检测（耗电较高）。不启用则仅在屏保期间检测运动。"
          />

          {/* Home Assistant Info Box */}
          <View style={styles.hintContainer}>
            <Icon name="home-assistant" size={20} color="#41BDF5" />
            <Text style={styles.hintText}>
              设备通过 MQTT 发现自动在 Home Assistant 中被发现。请确保您的 HA MQTT 集成已配置。
            </Text>
          </View>
        </>
      )}
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  loader: {
    marginLeft: 8,
  },
  connectButtonRow: {
    marginTop: 10,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  connectButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  connectHint: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 13,
    color: '#F44336',
    marginTop: 8,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  hintText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
});
