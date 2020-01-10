import React, { useState, useEffect } from 'react';
import { Button, Dialog, Form, Field, Input, Message, Select, Table } from '@alifd/next';
import moment from 'moment';
import { DialogType } from '@/shared/types';
import { arch, tag, node as store } from '@/configs/api';
import styles from './index.module.scss';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [archs, setArchs] = useState([]);
  const [tags, setTags] = useState([]);
  const field = Field.useField();
  const [dialogType, setDialogType] = useState(DialogType.None);
  const refresh = () => {
    store.query().then(({ data }) => setDataSource(data));
  };
  const openCreateDialog = () => {
    field.reset();
    setDialogType(DialogType.Create);
    arch.query().then(({ data }) => setArchs(data));
    tag.query({ params: { type: '体系' } }).then(({ data }) => setTags(data));
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
  const onCopyURL = (item) => {
    const editor = document.createElement('textarea');
    const url = location.origin + item.url;

    editor.value = url;
    editor.style.width = 0;
    editor.style.height = 0;
    document.body.appendChild(editor);
    editor.select();
    if (document.execCommand('copy')) {
      Message.success('链接已复制');
    } else {
      Dialog.alert({
        title: '复制链接',
        content: (
          <div>
            <p>无法复制以下链接到剪贴板：</p>
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          </div>
        ),
        closeable: false,
      });
    }
    document.body.removeChild(editor);
  };
  const renderDate = (value) => {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  };
  const renderStatus = (value) => {
    return value ? <span className={styles.online}>在线</span> : <span className={styles.offline}>离线</span>;
  };
  const renderActions = (value, i, item) => (
    <div className={styles.actions}>
      <Button type="secondary" onClick={() => openUpdateDialog(item)}>编辑</Button>
      <Button type="normal" onClick={() => onCopyURL(item)}>复制链接</Button>
    </div>
  );

  useEffect(() => refresh(), []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button type="primary" onClick={openCreateDialog}>新建节点</Button>
      </div>
      <Table dataSource={dataSource}>
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="updatedAt" title="操作时间" cell={renderDate} />
        <Table.Column dataIndex="parallel" title="并发数量" />
        <Table.Column dataIndex="online" title="状态" cell={renderStatus} />
        <Table.Column title="操作" width={190} cell={renderActions} />
      </Table>
      <Dialog
        visible={dialogType === DialogType.Create}
        title="新建节点"
        closeable={false}
        onOk={onCreate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ width: 380 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空" pattern={/^[a-zA-Z][\w-]*$/} patternMessage="名称只能包含字母、数字或减号且必须以字母开头">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="型号：" required requiredMessage="必填项不能为空">
            <Select name="arch_class_id">
              {archs.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="标签：" required requiredMessage="必填项不能为空">
            <Select name="tag_id">
              {tags.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="并发数量：" required requiredMessage="必填项不能为空">
            <Input defaultValue={1} min={1} htmlType="number" name="parallel" />
          </Form.Item>
          <Form.Item label="部署数量：" required requiredMessage="必填项不能为空">
            <Input defaultValue={1} min={1} htmlType="number" name="count" />
          </Form.Item>
        </Form>
      </Dialog>
      <Dialog
        visible={dialogType === DialogType.Update}
        title="编辑节点"
        closeable={false}
        onOk={onUpdate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ width: 380 }}>
          <Form.Item label="并发数量：" required requiredMessage="必填项不能为空">
            <Input min={1} htmlType="number" name="parallel" />
          </Form.Item>
        </Form>
      </Dialog>
    </div>
  );
};
