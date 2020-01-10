import React, { useState, useEffect } from 'react';
import { Table, Pagination, Select } from '@alifd/next';
import styles from './index.module.scss';

const PopupContent = ({ dataSource, pageSize = 20, ...props }) => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const total = Array.isArray(dataSource) ? dataSource.length : 0;

  useEffect(() => {
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    if (Array.isArray(dataSource)) {
      setData(dataSource.slice(start, end));
    } else {
      setData([]);
    }
  }, [current, dataSource, pageSize]);

  return (
    <div className={styles.popup}>
      <Table size="small" dataSource={data} useVirtual {...props} />
      <Pagination
        className={styles.pagination}
        shape="arrow-only"
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={(index) => setCurrent(index)}
        hideOnlyOnePage
        showJump={false}
      />
    </div>
  );
};

const TableSelect = ({ name, value, ...contentProps }) => (
  <Select
    name={name}
    mode="multiple"
    value={value}
    popupContent={<PopupContent {...contentProps} />}
  />
);

TableSelect.Column = Table.Column;

export default TableSelect;
