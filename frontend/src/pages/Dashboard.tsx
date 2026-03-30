import { useQuery } from 'react-query'
import { Typography, Button, Card, Row, Col, Statistic, Tag, Spin, Alert } from 'antd'
import {
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CloudServerOutlined
} from '@ant-design/icons'
import { agentApi } from '../services/api'

const { Title } = Typography

export default function Dashboard() {
  // 获取应用统计数据
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    'agentStats',
    () => agentApi.getStats(),
    {
      fallbackData: {
        data: {
          total: 42,
          running: 38,
          warning: 3,
          error: 1
        }
      }
    }
  )

  // 获取应用列表
  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useQuery(
    'agentList',
    () => agentApi.getList(),
    {
      fallbackData: {
        data: [
          { id: 1, name: '订单服务', ip: '192.168.1.101', status: 'running', lastActive: '1分钟前' },
          { id: 2, name: '支付服务', ip: '192.168.1.102', status: 'running', lastActive: '2分钟前' },
          { id: 3, name: '用户服务', ip: '192.168.1.103', status: 'warning', lastActive: '5分钟前' },
          { id: 4, name: '商品服务', ip: '192.168.1.104', status: 'error', lastActive: '10分钟前' },
        ]
      }
    }
  )

  const appStats = statsData?.data || { total: 0, running: 0, warning: 0, error: 0 }
  const recentAgents = agentsData?.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'success'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircleOutlined />
      case 'warning': return <WarningOutlined />
      case 'error': return <ExclamationCircleOutlined />
      default: return <WarningOutlined />
    }
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <Title level={2}>总览</Title>
        <p className="text-gray-500">欢迎使用 Bistoury 增强版诊断平台</p>
      </div>

      {/* 错误提示 */}
      {(statsError || agentsError) && (
        <Alert
          message="后端接口连接异常"
          description="当前使用模拟数据展示，后端服务恢复后自动切换为真实数据"
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {/* 加载状态 */}
      <Spin spinning={statsLoading || agentsLoading} tip="数据加载中...">
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="应用总数"
                value={appStats.total}
                prefix={<CloudServerOutlined className="text-blue-600" />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="运行正常"
                value={appStats.running}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="警告"
                value={appStats.warning}
                valueStyle={{ color: '#cf8d00' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="异常"
                value={appStats.error}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="最近接入的应用" extra={<Button type="primary" size="small">查看全部</Button>}>
          <div className="grid grid-cols-2 gap-4">
            {recentAgents.map((app: any) => (
              <Card key={app.id} size="small" hoverable>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.ip}</div>
                    <div className="text-xs text-gray-400 mt-1">最后活跃：{app.lastActive}</div>
                  </div>
                  <Tag color={getStatusColor(app.status)} icon={getStatusIcon(app.status)}>
                    {app.status === 'running' ? '正常' : app.status === 'warning' ? '警告' : '异常'}
                  </Tag>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="small" type="primary">诊断</Button>
                  <Button size="small">详情</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </Spin>
    </div>
  )
}