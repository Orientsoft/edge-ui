import React, { useState, useEffect } from 'react';
import { Button, Dialog, Form, Field, Input, Pagination, Message, Select, Table } from '@alifd/next';
import moment from 'moment';
import { DialogType } from '@/shared/types';
import { arch, tag, node as store } from '@/configs/api';
import styles from './index.module.scss';

const PAGE_SIZE = 10;

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [archs, setArchs] = useState([]);
  const [tags, setTags] = useState([]);
  const [businessTags, setBusinessTags] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const field = Field.useField();
  const [dialogType, setDialogType] = useState(DialogType.None);
  const refresh = () => {
    setIsLoading(true);
    store.query({
      params: {
        pageSize: PAGE_SIZE,
        page: current,
      },
    }).then(({ data }) => {
      setIsLoading(false);
      setDataSource(data.nodes);
      setTotal(data.total);
    });
  };
  const openCreateDialog = () => {
    field.reset();
    setDialogType(DialogType.Create);
    arch.query().then(({ data }) => setArchs(data));
    tag.query({ params: { type: '体系' } }).then(({ data }) => setTags(data));
    tag.query({ params: { type: '业务' } }).then(({ data }) => setBusinessTags(data));
  };
  const openUpdateDialog = (item) => {
    field.setValues({
      id: item.id,
      tag: item.buss_tags.map(({ id }) => id),
      parallel: item.parallel,
    });
    setDialogType(DialogType.Update);
    tag.query({ params: { type: '业务' } }).then(({ data }) => setBusinessTags(data));
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
      <Button type="normal" disabled={item.online} onClick={() => onCopyURL(item)}>复制链接</Button>
    </div>
  );

  useEffect(() => refresh(), [current]);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button type="primary" onClick={openCreateDialog}>新建节点</Button>
      </div>
      <Table dataSource={dataSource} loading={isLoading}>
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="arch_class_name" title="型号" />
        <Table.Column dataIndex="tags.name" title="体系标签" />
        <Table.Column dataIndex="updatedAt" title="操作时间" cell={renderDate} />
        <Table.Column dataIndex="parallel" title="并发数量" />
        <Table.Column dataIndex="online" title="状态" cell={renderStatus} />
        <Table.Column title="操作" width={190} cell={renderActions} />
      </Table>
      <Pagination
        className={styles.pagination}
        shape="arrow-only"
        current={current}
        total={total}
        pageSize={PAGE_SIZE}
        onChange={(index) => setCurrent(index)}
        hideOnlyOnePage
        showJump={false}
      />
      <Dialog
        visible={dialogType === DialogType.Create}
        title="新建节点"
        closeable={false}
        onOk={onCreate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ width: 380 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空" pattern={/^[a-z]+$/} patternMessage="名称只能包含字母">
            <Input name="name" trim />
          </Form.Item>
          <Form.Item label="型号：" required requiredMessage="必填项不能为空">
            <Select name="arch_class_id">
              {archs.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="体系标签：" required requiredMessage="必填项不能为空">
            <Select name="tag_id">
              {tags.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="业务标签：" required requiredMessage="必填项不能为空">
            <Select name="buss_tag_ids" mode="multiple">
              {businessTags.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="并发数量：" required requiredMessage="必填项不能为空">
            <Input defaultValue={1} min={1} htmlType="number" name="parallel" />
          </Form.Item>
          <Form.Item label="创建数量：" required requiredMessage="必填项不能为空">
            <Input defaultValue={1} min={1} max={20} htmlType="number" name="count" />
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
          <Form.Item label="业务标签：" required requiredMessage="必填项不能为空">
            <Select name="tag" mode="multiple">
              {businessTags.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="并发数量：" required requiredMessage="必填项不能为空">
            <Input min={1} htmlType="number" name="parallel" />
          </Form.Item>
        </Form>
      </Dialog>
    </div>
  );
};
