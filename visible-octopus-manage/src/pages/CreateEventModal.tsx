import React, { useCallback } from "react";
import { Button, Form, Input, Modal, ModalFuncProps, Radio } from "antd";
import { useForm } from "antd/lib/form/Form";
import { createRandomId } from "../utils/util";

interface CreateEventModalProps extends ModalFuncProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: { xpath?: string };
}

const CreateEventModal = ({visible, onOk, onCancel, initialValues = {}, ...rest}: CreateEventModalProps) => {

  const [form] = useForm();

  const options = [
    { value: 'click', label: '点击' },
    { value: 'show',  label: '曝光' },
  ];

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);
  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    console.log(values);
    return Promise.resolve(values)
      .then(async (values) => {
        const returnValue = {
          ...values,
          id: createRandomId(),
          url: document.location.href,
        };
        return returnValue;
      })
      .then(onOk)
  }, []);


  if (!visible) return null;
  return (
    <Modal title="新建事件" visible={visible} {...rest} destroyOnClose
      footer={<>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>提交</Button>
      </>}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelAlign="right" preserve={false}
        form={form}>
        <Form.Item label="事件名称" name="name" rules={[{ required: true, message: '请填写事件名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item initialValue={initialValues?.xpath} label="xpath" name="xpath">
          <Input disabled readOnly />
        </Form.Item>
        <Form.Item label="事件类型" name="type" rules={[{ required: true, message: '请选择事件类型' }]}>
          <Radio.Group options={options}></Radio.Group>
        </Form.Item>
        <Form.Item initialValue={document.location.href} label="url" name="url">
          <Input disabled readOnly />
        </Form.Item>
        <Form.Item label="事件描述" name="desc" >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateEventModal);