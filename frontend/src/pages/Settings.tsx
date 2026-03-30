import { Typography, Card, Form, Input, Switch, Button, Space, Divider } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function Settings() {
  const [form] = Form.useForm()

  const onSave = () => {
    form.validateFields().then(values => {
      console.log('保存配置：', values)
      // 调用保存接口
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2}>系统设置</Title>
        <p className="text-gray-500">配置系统全局参数</p>
      </div>

      <Card title="基础配置" className="mb-6">
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          initialValues={{
            siteName: 'Bistoury 增强版',
            agentRegisterEnabled: true,
            autoCleanHistoryDays: 30,
            commandTimeout: 30,
          }}
        >
          <Form.Item
            label="站点名称"
            name="siteName"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Agent注册"
            name="agentRegisterEnabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="历史数据保留天数"
            name="autoCleanHistoryDays"
            rules={[{ required: true, message: '请输入保留天数' }]}
          >
            <Input type="number" min="1" max="365" />
          </Form.Item>

          <Form.Item
            label="命令超时时间(秒)"
            name="commandTimeout"
            rules={[{ required: true, message: '请输入超时时间' }]}
          >
            <Input type="number" min="5" max="300" />
          </Form.Item>
        </Form>
      </Card>

      <Card title="告警配置">
        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          initialValues={{
            alertEnabled: true,
            webhookUrl: '',
            alertThresholdCpu: 80,
            alertThresholdMemory: 85,
            alertThresholdGc: 10,
          }}
        >
          <Form.Item
            label="启用告警"
            name="alertEnabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Webhook地址" name="webhookUrl">
            <Input placeholder="企业微信/钉钉/飞书机器人地址" />
          </Form.Item>

          <Divider />

          <Form.Item
            label="CPU使用率阈值(%)"
            name="alertThresholdCpu"
            rules={[{ required: true, message: '请输入阈值' }]}
          >
            <Input type="number" min="50" max="100" />
          </Form.Item>

          <Form.Item
            label="内存使用率阈值(%)"
            name="alertThresholdMemory"
            rules={[{ required: true, message: '请输入阈值' }]}
          >
            <Input type="number" min="50" max="100" />
          </Form.Item>

          <Form.Item
            label="GC频率阈值(次/分钟)"
            name="alertThresholdGc"
            rules={[{ required: true, message: '请输入阈值' }]}
          >
            <Input type="number" min="1" max="100" />
          </Form.Item>
        </Form>
      </Card>

      <div className="mt-6 flex justify-end">
        <Space>
          <Button>重置</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
            保存配置
          </Button>
        </Space>
      </div>
    </div>
  )
}