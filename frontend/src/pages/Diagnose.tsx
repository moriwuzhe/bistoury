import { useState } from 'react'
import { Card, Select, Button, Input, Space, Table, Tag, Typography, Divider, Empty } from 'antd'
import { PlayCircleOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

// 模拟应用列表
const appList = [
  { id: '1', name: '订单服务', ip: '192.168.1.101' },
  { id: '2', name: '支付服务', ip: '192.168.1.102' },
  { id: '3', name: '用户服务', ip: '192.168.1.103' },
]

// 常用命令列表
const commonCommands = [
  { label: '线程栈', value: 'thread' },
  { label: 'JVM信息', value: 'jvm' },
  { label: '内存使用', value: 'memory' },
  { label: 'GC信息', value: 'gc' },
  { label: '系统属性', value: 'sysprop' },
  { label: '环境变量', value: 'env' },
  { label: '类加载信息', value: 'classloader' },
]

// 历史命令记录
interface HistoryItem {
  id: string
  appName: string
  command: string
  executeTime: string
  status: 'success' | 'failed' | 'running'
}

const historyColumns: ColumnsType<HistoryItem> = [
  {
    title: '应用',
    dataIndex: 'appName',
    key: 'appName',
    width: 150,
  },
  {
    title: '命令',
    dataIndex: 'command',
    key: 'command',
    ellipsis: true,
  },
  {
    title: '执行时间',
    dataIndex: 'executeTime',
    key: 'executeTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      const color = status === 'success' ? 'success' : status === 'failed' ? 'error' : 'processing'
      const text = status === 'success' ? '成功' : status === 'failed' ? '失败' : '执行中'
      return <Tag color={color}>{text}</Tag>
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    render: (_, record) => (
      <Button size="small" type="link" icon={<CopyOutlined />}>
        复制结果
      </Button>
    ),
  },
]

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    appName: '订单服务',
    command: 'thread',
    executeTime: '2026-03-30 21:00:00',
    status: 'success',
  },
  {
    id: '2',
    appName: '支付服务',
    command: 'jvm',
    executeTime: '2026-03-30 20:55:00',
    status: 'success',
  },
  {
    id: '3',
    appName: '用户服务',
    command: 'trace com.example.service.UserService getUserById',
    executeTime: '2026-03-30 20:50:00',
    status: 'failed',
  },
]

export default function Diagnose() {
  const [selectedApp, setSelectedApp] = useState<string>('')
  const [command, setCommand] = useState<string>('')
  const [commandResult, setCommandResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // 执行命令
  const handleExecute = () => {
    if (!selectedApp || !command) return
    setLoading(true)
    // 模拟执行
    setTimeout(() => {
      setCommandResult(`=== 命令执行结果 [${command}] ===
线程信息：
ID  NAME                      STATE         %CPU  TIME
1   main                      RUNNABLE      0.0   0:00
2   Reference Handler         WAITING       0.0   0:00
3   Finalizer                 WAITING       0.0   0:00
4   Signal Dispatcher         RUNNABLE      0.0   0:00
...
共 42 个线程，1 个死锁线程被检测到！

死锁详情：
线程 "Thread-0" 持有 <0x000000076acb5380> (java.lang.Object)，等待 <0x000000076acb5390> (java.lang.Object)
线程 "Thread-1" 持有 <0x000000076acb5390> (java.lang.Object)，等待 <0x000000076acb5380> (java.lang.Object)`)
      setLoading(false)
    }, 2000)
  }

  // 选择常用命令
  const handleSelectCommand = (cmd: string) => {
    setCommand(cmd)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2}>诊断中心</Title>
        <p className="text-gray-500">对目标应用执行 Arthas 诊断命令，实时获取结果</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧诊断面板 */}
        <div className="col-span-8">
          <Card title="诊断操作" className="h-full">
            <Space direction="vertical" className="w-full" size="large">
              <div className="flex gap-4 items-center">
                <Select
                  placeholder="选择要诊断的应用"
                  style={{ width: 300 }}
                  value={selectedApp}
                  onChange={setSelectedApp}
                >
                  {appList.map(app => (
                    <Option key={app.id} value={app.id}>
                      {app.name} ({app.ip})
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={handleExecute}
                  loading={loading}
                  disabled={!selectedApp || !command}
                >
                  执行命令
                </Button>
              </div>

              <div>
                <Text strong>常用命令：</Text>
                <Space className="ml-2" wrap>
                  {commonCommands.map(cmd => (
                    <Button
                      key={cmd.value}
                      size="small"
                      onClick={() => handleSelectCommand(cmd.value)}
                    >
                      {cmd.label}
                    </Button>
                  ))}
                </Space>
              </div>

              <TextArea
                rows={4}
                placeholder="输入要执行的 Arthas 命令，例如：thread、jvm、trace com.example.demo.TestService testMethod..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              />

              <Divider>执行结果</Divider>

              {commandResult ? (
                <div>
                  <div className="flex justify-between mb-2">
                    <Text strong>返回结果</Text>
                    <Button size="small" icon={<ClearOutlined />} onClick={() => setCommandResult('')}>
                      清空
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                    {commandResult}
                  </pre>
                </div>
              ) : (
                <Empty description="执行命令后将在这里显示结果" />
              )}
            </Space>
          </Card>
        </div>

        {/* 右侧历史记录 */}
        <div className="col-span-4">
          <Card title="历史记录" extra={<Button type="link" size="small">查看全部</Button>}>
            <Table
              columns={historyColumns}
              dataSource={mockHistory}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}