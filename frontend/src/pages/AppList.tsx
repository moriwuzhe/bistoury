import { Typography, Card, Table, Button, Space, Tag, Input } from 'antd'
import { SearchOutlined, BugOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

interface AppItem {
  id: string
  name: string
  ip: string
  status: 'running' | 'warning' | 'error'
  jdkVersion: string
  appVersion: string
  lastActive: string
}

const columns: ColumnsType<AppItem> = [
  {
    title: '应用名称',
    dataIndex: 'name',
    key: 'name',
    width: 180,
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      const color = status === 'running' ? 'success' : status === 'warning' ? 'warning' : 'error'
      const text = status === 'running' ? '正常' : status === 'warning' ? '警告' : '异常'
      return <Tag color={color}>{text}</Tag>
    },
  },
  {
    title: 'JDK版本',
    dataIndex: 'jdkVersion',
    key: 'jdkVersion',
    width: 120,
  },
  {
    title: '应用版本',
    dataIndex: 'appVersion',
    key: 'appVersion',
    width: 120,
  },
  {
    title: '最后活跃',
    dataIndex: 'lastActive',
    key: 'lastActive',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    render: () => (
      <Space>
        <Button type="primary" size="small" icon={<BugOutlined />}>诊断</Button>
        <Button size="small" icon={<EyeOutlined />}>详情</Button>
      </Space>
    ),
  },
]

const mockData: AppItem[] = [
  {
    id: '1',
    name: '订单服务',
    ip: '192.168.1.101',
    status: 'running',
    jdkVersion: '11.0.18',
    appVersion: 'v1.2.3',
    lastActive: '1分钟前',
  },
  {
    id: '2',
    name: '支付服务',
    ip: '192.168.1.102',
    status: 'running',
    jdkVersion: '1.8.0_345',
    appVersion: 'v2.0.1',
    lastActive: '2分钟前',
  },
  {
    id: '3',
    name: '用户服务',
    ip: '192.168.1.103',
    status: 'warning',
    jdkVersion: '11.0.18',
    appVersion: 'v3.1.0',
    lastActive: '5分钟前',
  },
  {
    id: '4',
    name: '商品服务',
    ip: '192.168.1.104',
    status: 'error',
    jdkVersion: '17.0.6',
    appVersion: 'v1.5.2',
    lastActive: '10分钟前',
  },
  {
    id: '5',
    name: '网关服务',
    ip: '192.168.1.105',
    status: 'running',
    jdkVersion: '11.0.18',
    appVersion: 'v4.0.0',
    lastActive: '3分钟前',
  },
]

export default function AppList() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2}>应用管理</Title>
        <p className="text-gray-500">管理所有接入的应用实例</p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="搜索应用名称/IP"
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary">刷新列表</Button>
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个应用`,
          }}
        />
      </Card>
    </div>
  )
}