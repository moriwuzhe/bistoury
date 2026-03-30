import { Typography, Card, Table, Tag, Space, Button, Switch } from 'antd'
import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

interface AlertItem {
  id: string
  appName: string
  level: 'critical' | 'warning' | 'info'
  content: string
  time: string
  status: 'unread' | 'processed'
}

const columns: ColumnsType<AlertItem> = [
  {
    title: '应用',
    dataIndex: 'appName',
    key: 'appName',
    width: 150,
  },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    width: 100,
    render: (level) => {
      const color = level === 'critical' ? 'error' : level === 'warning' ? 'warning' : 'info'
      const text = level === 'critical' ? '严重' : level === 'warning' ? '警告' : '信息'
      return <Tag color={color}>{text}</Tag>
    },
  },
  {
    title: '告警内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      return status === 'unread' ? <Tag color="red">未处理</Tag> : <Tag color="green">已处理</Tag>
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    render: (_, record) => (
      <Space>
        <Button type="primary" size="small">查看详情</Button>
        {record.status === 'unread' && <Button size="small">标记已处理</Button>}
      </Space>
    ),
  },
]

const mockData: AlertItem[] = [
  {
    id: '1',
    appName: '商品服务',
    level: 'critical',
    content: '检测到死锁，2个线程互相等待资源',
    time: '2026-03-30 21:00:00',
    status: 'unread',
  },
  {
    id: '2',
    appName: '用户服务',
    level: 'warning',
    content: '堆内存使用率超过85%',
    time: '2026-03-30 20:55:00',
    status: 'unread',
  },
  {
    id: '3',
    appName: '订单服务',
    level: 'warning',
    content: 'Full GC频率超过10次/分钟',
    time: '2026-03-30 20:50:00',
    status: 'processed',
  },
  {
    id: '4',
    appName: '支付服务',
    level: 'info',
    content: 'Agent成功接入',
    time: '2026-03-30 20:30:00',
    status: 'processed',
  },
]

export default function Alert() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2}>告警中心</Title>
        <p className="text-gray-500">查看和处理系统告警</p>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BellOutlined className="text-xl text-red-500" />
            <span className="text-lg">告警总开关</span>
            <Switch defaultChecked />
          </div>
          <Button type="primary">告警设置</Button>
        </div>
      </Card>

      <Card title="告警列表">
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            total: mockData.length,
            pageSize: 10,
          }}
        />
      </Card>
    </div>
  )
}