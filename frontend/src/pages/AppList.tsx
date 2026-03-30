import React, { useState, useEffect, useRef } from 'react'
import {
  PageContainer,
  ProTable,
  ActionType,
  ProCard,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Descriptions,
  Modal,
  Empty,
} from '@ant-design/pro-components'
import { EyeOutlined, PlayCircleOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { Badge, DescriptionsProps } from 'antd'
import api from '../services/api'
import type { ColumnType } from 'antd/es/table'

// 应用信息类型
interface AppInfo {
  agentId: string
  appName: string
  ip: string
  hostname: string
  jdkVersion: string
  appVersion: string
  agentVersion: string
  status: 'online' | 'offline' | 'warning' | 'error'
  startTime: string
  lastHeartbeatTime: string
  jvmArgs: string
  osInfo: string
  pid: number
}

const AppList: React.FC = () => {
  const [appList, setAppList] = useState<AppInfo[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentApp, setCurrentApp] = useState<AppInfo | null>(null)
  const actionRef = useRef<ActionType>()

  // 获取应用列表
  const fetchAppList = async () => {
    try {
      // 暂时用模拟数据，后面对接真实API
      const mockData: AppInfo[] = [
        {
          agentId: 'agent-1',
          appName: '订单服务',
          ip: '192.168.1.101',
          hostname: 'app-server-01',
          jdkVersion: '11.0.18',
          appVersion: 'v1.0.2',
          agentVersion: '2.0.7',
          status: 'online',
          startTime: '2026-03-30 10:00:00',
          lastHeartbeatTime: '2026-03-31 02:15:00',
          jvmArgs: '-Xms2g -Xmx4g -XX:+UseG1GC',
          osInfo: 'Linux 4.18.0-305.el8.x86_64',
          pid: 12345,
        },
        {
          agentId: 'agent-2',
          appName: '支付服务',
          ip: '192.168.1.102',
          hostname: 'app-server-02',
          jdkVersion: '1.8.0_345',
          appVersion: 'v2.1.0',
          agentVersion: '2.0.7',
          status: 'online',
          startTime: '2026-03-30 09:30:00',
          lastHeartbeatTime: '2026-03-31 02:15:10',
          jvmArgs: '-Xms4g -Xmx8g -XX:+UseCMSCompactAtFullCollection',
          osInfo: 'Linux 4.18.0-305.el8.x86_64',
          pid: 23456,
        },
        {
          agentId: 'agent-3',
          appName: '用户服务',
          ip: '192.168.1.103',
          hostname: 'app-server-03',
          jdkVersion: '11.0.18',
          appVersion: 'v3.5.0',
          agentVersion: '2.0.7',
          status: 'warning',
          startTime: '2026-03-30 11:20:00',
          lastHeartbeatTime: '2026-03-31 02:14:50',
          jvmArgs: '-Xms1g -Xmx2g -XX:+UseZGC',
          osInfo: 'Linux 4.18.0-305.el8.x86_64',
          pid: 34567,
        },
        {
          agentId: 'agent-4',
          appName: '商品服务',
          ip: '192.168.1.104',
          hostname: 'app-server-04',
          jdkVersion: '1.8.0_345',
          appVersion: 'v1.5.0',
          agentVersion: '2.0.7',
          status: 'error',
          startTime: '2026-03-30 08:15:00',
          lastHeartbeatTime: '2026-03-31 02:10:00',
          jvmArgs: '-Xms2g -Xmx4g',
          osInfo: 'Linux 4.18.0-305.el8.x86_64',
          pid: 45678,
        },
        {
          agentId: 'agent-5',
          appName: '网关服务',
          ip: '192.168.1.105',
          hostname: 'gateway-server-01',
          jdkVersion: '11.0.18',
          appVersion: 'v2.0.0',
          agentVersion: '2.0.7',
          status: 'online',
          startTime: '2026-03-30 12:00:00',
          lastHeartbeatTime: '2026-03-31 02:15:20',
          jvmArgs: '-Xms4g -Xmx8g -XX:+UseG1GC -XX:MaxGCPauseMillis=100',
          osInfo: 'Linux 4.18.0-305.el8.x86_64',
          pid: 56789,
        },
      ]
      setAppList(mockData)
    } catch (error) {
      message.error('获取应用列表失败：' + (error as Error).message)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    fetchAppList()
    // 每隔30秒刷新一次
    const interval = setInterval(fetchAppList, 30000)
    return () => clearInterval(interval)
  }, [])

  // 状态对应的颜色
  const statusColors = {
    online: 'success',
    offline: 'default',
    warning: 'warning',
    error: 'error',
  }

  // 状态文字
  const statusText = {
    online: '在线',
    offline: '离线',
    warning: '警告',
    error: '异常',
  }

  // 表格列定义
  const columns: ColumnType<AppInfo>[] = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 150,
      render: (name, record) => (
        <Space>
          <span>{name}</span>
          <Badge status={statusColors[record.status]} text={statusText[record.status]} />
        </Space>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      width: 130,
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      width: 130,
    },
    {
      title: 'JDK版本',
      dataIndex: 'jdkVersion',
      width: 110,
    },
    {
      title: '应用版本',
      dataIndex: 'appVersion',
      width: 110,
    },
    {
      title: 'Agent版本',
      dataIndex: 'agentVersion',
      width: 110,
    },
    {
      title: '进程ID',
      dataIndex: 'pid',
      width: 80,
    },
    {
      title: '启动时间',
      dataIndex: 'startTime',
      width: 170,
    },
    {
      title: '最后心跳',
      dataIndex: 'lastHeartbeatTime',
      width: 170,
    },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentApp(record)
              setDetailModalVisible(true)
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              // 跳转到诊断页面，选中当前应用
              window.location.href = `/diagnose?agentId=${record.agentId}`
            }}
          >
            诊断
          </Button>
          <Popconfirm
            title="确定要下线该应用的Agent吗？"
            description="下线后该应用将无法继续接收诊断命令，需要重启Agent才能重新接入。"
            onConfirm={() => {
              message.success('Agent已下线')
              fetchAppList()
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              下线
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 应用详情项
  const detailItems: DescriptionsProps['items'] = currentApp ? [
    {
      key: '1',
      label: '应用名称',
      children: currentApp.appName,
    },
    {
      key: '2',
      label: '状态',
      children: <Badge status={statusColors[currentApp.status]} text={statusText[currentApp.status]} />,
    },
    {
      key: '3',
      label: 'Agent ID',
      children: currentApp.agentId,
    },
    {
      key: '4',
      label: 'IP地址',
      children: currentApp.ip,
    },
    {
      key: '5',
      label: '主机名',
      children: currentApp.hostname,
    },
    {
      key: '6',
      label: '进程ID',
      children: currentApp.pid,
    },
    {
      key: '7',
      label: 'JDK版本',
      children: currentApp.jdkVersion,
    },
    {
      key: '8',
      label: '应用版本',
      children: currentApp.appVersion,
    },
    {
      key: '9',
      label: 'Agent版本',
      children: currentApp.agentVersion,
    },
    {
      key: '10',
      label: '操作系统',
      children: currentApp.osInfo,
      span: 2,
    },
    {
      key: '11',
      label: 'JVM参数',
      children: <code>{currentApp.jvmArgs}</code>,
      span: 2,
    },
    {
      key: '12',
      label: '启动时间',
      children: currentApp.startTime,
    },
    {
      key: '13',
      label: '最后心跳时间',
      children: currentApp.lastHeartbeatTime,
    },
  ] : []

  return (
    <PageContainer
      header={{
        title: '应用管理',
        subTitle: '管理所有接入的Java应用，查看应用详情和执行诊断',
        extra: (
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={() => {
              fetchAppList()
              message.success('刷新成功')
            }}
          >
            刷新
          </Button>
        ),
      }}
    >
      <ProCard>
        <ProTable<AppInfo>
          actionRef={actionRef}
          columns={columns}
          dataSource={appList}
          rowKey="agentId"
          search={{
            optionRender: {
              label: '搜索',
              value: 'search',
            },
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          toolBarRender={() => []}
          locale={{
            emptyText: <Empty description="暂无接入的应用" />,
          }}
        />
      </ProCard>

      {/* 应用详情弹窗 */}
      <Modal
        title="应用详情"
        open={detailModalVisible}
        width={800}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="diagnose" onClick={() => {
            setDetailModalVisible(false)
            if (currentApp) {
              window.location.href = `/diagnose?agentId=${currentApp.agentId}`
            }
          }}>
            去诊断
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {currentApp && (
          <Descriptions
            bordered
            column={2}
            items={detailItems}
          />
        )}
      </Modal>
    </PageContainer>
  )
}

export default AppList
