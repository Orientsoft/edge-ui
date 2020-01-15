import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from '@alifd/next';
import { DialogType } from '@/shared/types';
import { setCurrentUser } from '@/shared/storage';
import { user } from '@/configs/api';
import styles from './index.module.scss';

export default ({ history }) => {
  const onSubmit = (values, errors) => {
    if (errors) {
      return;
    }
    user.login({ data: values }).then(({ data }) => {
      setCurrentUser(data);
      history.push('/');
    });
  };

  return (
    <div className={styles.page}>
      <Form className={styles.form} size="large" labelAlign="inset" labelTextAlign="left" style={{ width: 320 }}>
        <Form.Item label="账号：" asterisk={false} required requiredMessage="必填项不能为空">
          <Input name="name" trim />
        </Form.Item>
        <Form.Item label="密码：" asterisk={false} required requiredMessage="必填项不能为空">
          <Input name="key" trim />
        </Form.Item>
        <Form.Item>
          <Form.Submit type="primary" validate onClick={onSubmit} style={{ width: '100%' }}>登录</Form.Submit>
        </Form.Item>
      </Form>
    </div>
  );
};
