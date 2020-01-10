/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dialog, Field, Form, Input, Table, Select } from '@alifd/next';
import TableSelect from '@/components/TableSelect';
import { DialogType } from '@/shared/types';
import { node, service, task as store } from '@/configs/api';
import styles from './index.module.scss';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [services, setServices] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [dialogType, setDialogType] = useState(DialogType.None);
  const field = Field.useField();
  const refresh = () => {
    store.query().then(({ data }) => setDataSource(data));
  };
  const onCreate = () => {
    field.validate((errors, values) => {
      if (errors) {
        return;
      }
      store.create({
        data: {
          name: values.name,
          service_id: values.service_id,
          node_ids: values.node_ids.map(({ value }) => value),
        },
      }).then(() => {
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
      store.update({
        data: {
          id: values.id,
          name: values.name,
          node_ids: values.node_ids.map(({ value }) => value),
        },
      }).then(() => {
        setDialogType(DialogType.None);
        refresh();
      });
    });
  };
  const onServiceChange = (value) => {
    const selectedService = services.find(({ id }) => id === value);
    const tags = selectedService.tags.map(({ tag_id }) => tag_id).join(',');

    setNodes([]);
    node.filterByTags({ params: { tag: tags } }).then(({ data }) => setNodes(data));
  };
  const onToggleTask = (item) => {
    Dialog.confirm({
      title: `${item.running ? '停止' : '启动'}任务`,
      content: `确定${item.running ? '停止' : '启动'}当前任务？`,
      closeable: false,
      onOk: () => store.toggleTask({
          data: { operator: item.running ? 'stop' : 'start' },
      }, { taskId: item.id }).then(refresh),
    });
  };
  const rowSelection = useMemo(() => ({
    selectedRowKeys: selectedNodes.map(({ id }) => id),
    onSelect(selected, record) {
      if (selected) {
        setSelectedNodes([...selectedNodes, record]);
      } else {
        setSelectedNodes(selectedNodes.filter(({ id }) => id !== record.id));
      }
    },
    onSelectAll(selected, records) {
      if (selected) {
        setSelectedNodes([...records])
      } else {
        setSelectedNodes([]);
      }
    },
  }), [selectedNodes]);
  const openCreateDialog = () => {
    field.reset();
    setNodes([]);
    setSelectedNodes([]);
    setDialogType(DialogType.Create);
    service.query().then(({ data }) => setServices(data));
  };
  const openUpdateDialog = (item) => {
    field.setValues(item);
    setNodes([]);
    setSelectedNodes([]);
    setDialogType(DialogType.Update);
    store.queryNodes({}, { taskId: item.id }).then(({ data }) => {
      setNodes(data.allNodes.map(({ node_id, node_name, node_arch, node_online }) => ({
        id: node_id,
        name: node_name,
        arch: node_arch,
        online: node_online,
      })));
      setSelectedNodes(data.nodes.map(({ node_id, node_name }) => ({ id: node_id, name: node_name })));
    });
  };
  const openDeleteDialog = (item) => Dialog.confirm({
    title: '删除任务',
    content: '确定删除当前任务？',
    closeable: false,
    onOk: () => store.delete({ data: { id: item.id } }).then(refresh),
  });
  const renderStatus = (value) => {
    return value ? <span className={styles.online}>运行中</span> : <span className={styles.offline}>未运行</span>;
  };
  const renderActions = (value, i, item) => (
    <div className={styles.actions}>
      <Button type="primary" onClick={() => onToggleTask(item)}>{item.running ? '停止' : '启动'}</Button>
      <Button type="secondary" onClick={() => openUpdateDialog(item)}>编辑</Button>
      <Button type="normal" warning onClick={() => openDeleteDialog(item)}>删除</Button>
    </div>
  );

  useEffect(() => refresh(), []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button type="primary" onClick={openCreateDialog}>新建任务</Button>
      </div>
      <Table dataSource={dataSource}>
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="service_name" title="服务" />
        <Table.Column dataIndex="running" title="状态" cell={renderStatus} />
        <Table.Column title="操作" width={220} cell={renderActions} />
      </Table>
      <Dialog
        visible={dialogType === DialogType.Create}
        title="新建任务"
        closeable={false}
        onOk={onCreate}
        onCancel={() => setDialogType(DialogType.None)}
      >
        <Form field={field} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: 480 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="服务：" required requiredMessage="必填项不能为空">
            <Select name="service_id" onChange={onServiceChange}>
              {services.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="节点：" required requiredMessage="必填项不能为空">
            <TableSelect
              name="node_ids"
              value={selectedNodes.map(({ id, name }) => ({ label: name, value: id }))}
              rowSelection={rowSelection}
              dataSource={nodes}
            >
              <TableSelect.Column title="名称" dataIndex="name" />
              <TableSelect.Column title="类型" dataIndex="arch" />
            </TableSelect>
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
        <Form field={field} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: 480 }}>
          <Form.Item label="名称：" required requiredMessage="必填项不能为空">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="节点：" required requiredMessage="必填项不能为空">
            <TableSelect
              name="node_ids"
              value={selectedNodes.map(({ id, name }) => ({ label: name, value: id }))}
              rowSelection={rowSelection}
              dataSource={nodes}
            >
              <TableSelect.Column title="名称" dataIndex="name" />
              <TableSelect.Column title="类型" dataIndex="arch" />
            </TableSelect>
          </Form.Item>
        </Form>
      </Dialog>
    </div>
  );
};
