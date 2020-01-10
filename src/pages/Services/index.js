/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dialog, Form, Field, Input, Select, Table } from '@alifd/next';
import { DialogType } from '@/shared/types';
import { tag, service as store } from '@/configs/api';
import styles from './index.module.scss';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [tags, setTags] = useState([]);
  const field = Field.useField();
  const [dialogType, setDialogType] = useState(DialogType.None);
  const refresh = () => {
    store.query().then(({ data }) => setDataSource(data));
  };
  const openCreateDialog = () => {
    field.reset();
    setDialogType(DialogType.Create);
    tag.query({ params: { type: '体系' } }).then(({ data }) => setTags(data));
  };
  const openUpdateDialog = (item) => {
    field.setValues(item);
    setDialogType(DialogType.Update);
    tag.query({ params: { type: '体系' } }).then(({ data }) => setTags(data));
  };
  const onCreate = () => {
    field.validate((errors, values) => {
      if (errors) {
        return;
      }
      store.create({ data: values }).then(() => {
        setDialogType(DialogType.None);
        refresh();
      });
    });
  };
  const onUpdate = () => {
    field.validate((errors, values) => {
      if (errors) {
        return;
      }
      store.update({ data: values }).then(() => {
        setDialogType(DialogType.None);
        refresh();
      });
    });
  };
  const openInspectDialog = (item) => {
    field.setValues(item);
    setDialogType(DialogType.Inspect);
  };
  const renderTags = (value) => {
    return value.map(({ tag_name }) => tag_name).join('，');
  };
  const renderActions = (value, i, item) => (
    <div className={styles.actions}>
      <Button type="secondary" onClick={() => openUpdateDialog(item)}>编辑</Button>
      <Button type="normal" onClick={() => openInspectDialog(item)}>详情</Button>
    </div>
  );

  useEffect(() => refresh(), []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button type="primary" onClick={openCreateDialog}>新建服务</Button>
      </div>
      <Table dataSource={dataSource}>
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="image" title="镜像" />
        <Table.Column dataIndex="tags" title="标签" cell={renderTags} />
        <Table.Column dataIndex="description" title="描述" />
        <Table.Column title="操作" width={160} cell={renderActions} />
      </Table>
      <Dialog
        visible={dialogType === DialogType.Create}
        title="新建服务"
        closeable={false}
        onOk={onCreate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: 500 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="描述：">
            <Input name="description" />
          </Form.Item>
          <Form.Item label="镜像：" required requiredMessage="必填项不能为空">
            <Input name="image" />
          </Form.Item>
          <Form.Item label="标签：" required requiredMessage="必填项不能为空">
            <Select name="tagids" mode="multiple">
              {tags.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="配置：" required requiredMessage="必填项不能为空">
            <Input.TextArea rows={16} name="kubernetes" />
          </Form.Item>
        </Form>
      </Dialog>
      <Dialog
        visible={dialogType === DialogType.Update}
        title="编辑服务"
        closeable={false}
        onOk={onUpdate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: 500 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="描述：">
            <Input name="description" />
          </Form.Item>
        </Form>
      </Dialog>
      <Dialog
        visible={dialogType === DialogType.Inspect}
        title="服务详情"
        closeable={false}
        onOk={() => setDialogType(DialogType.None)}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} style={{ width: 380 }}>
          <Form.Item required requiredMessage="必填项不能为空">
            <Input.TextArea style={{ border: 'none' }} rows={22} readOnly value={JSON.stringify(field.getValue('kubernetes'), null, 4)} />
          </Form.Item>
        </Form>
      </Dialog>
    </div>
  );
};
