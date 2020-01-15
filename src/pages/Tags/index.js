import React, { useState, useEffect } from 'react';
import { Button, Dialog, Form, Field, Input, Select, Table } from '@alifd/next';
import { DialogType } from '@/shared/types';
import { tag as store } from '@/configs/api';
import styles from './index.module.scss';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const field = Field.useField();
  const [dialogType, setDialogType] = useState(DialogType.None);
  const [isLoading, setIsLoading] = useState(false);
  const refresh = () => {
    setIsLoading(true);
    store.query().then(({ data }) => {
      setIsLoading(false);
      setDataSource(data);
    });
  };
  const openUpdateDialog = (item) => {
    field.setValues(item);
    setDialogType(DialogType.Update);
  };
  const onCreate = () => {
    field.validate((errors, values) => {
      if (errors) {
        return;
      }
      store.create({ data: values }).then(() => {
        field.reset();
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
  const openDeleteDialog = (item) => Dialog.confirm({
    title: '删除标签',
    content: '确定删除当前标签？',
    closeable: false,
    onOk: () => store.delete({ data: { id: item.id } }).then(refresh),
  });
  const renderActions = (value, i, item) => (
    <div className={styles.actions}>
      <Button type="secondary" onClick={() => openUpdateDialog(item)}>编辑</Button>
      <Button type="normal" warning onClick={() => openDeleteDialog(item)}>删除</Button>
    </div>
  );

  useEffect(() => refresh(), []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button type="primary" onClick={() => setDialogType(DialogType.Create)}>新建标签</Button>
      </div>
      <Table dataSource={dataSource} loading={isLoading}>
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="type" title="类型" />
        <Table.Column title="操作" width={160} cell={renderActions} />
      </Table>
      <Dialog
        visible={dialogType === DialogType.Create}
        title="新建标签"
        closeable={false}
        onOk={onCreate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ width: 300 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="类型：">
            <Select name="type" defaultValue="体系">
              <Select.Option value="体系">体系</Select.Option>
              <Select.Option value="业务">业务</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Dialog>
      <Dialog
        visible={dialogType === DialogType.Update}
        title="编辑标签"
        closeable={false}
        onOk={onUpdate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ width: 300 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
        </Form>
      </Dialog>
    </div>
  );
};
