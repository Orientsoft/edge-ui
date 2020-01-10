import React, { Component, useState } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { Button, Nav } from '@alifd/next';
import Layout from '@icedesign/layout';
import routes from '@/configs/routes';
import { asideMenuConfig } from '@/configs/menu';
import styles from './index.module.scss';

function getSubMenuOrItem(menu, i) {
  if (menu.children) {
    const subMenu = menu.children.map((item, j) => getSubMenuOrItem(item, j));

    if (subMenu && subMenu.length > 0) {
      return (
        <Nav.SubNav key={i} icon={menu.icon} label={menu.name}>
          {subMenu}
        </Nav.SubNav>
      );
    }
    return null;
  }
  return (
    <Nav.Item key={menu.path}>
      <Link to={menu.path}>
        {menu.name}
      </Link>
    </Nav.Item>
  );
}

function getDefaultOpenKeys({ pathname }) {
  const menus = asideMenuConfig.map((item, i) => getSubMenuOrItem(item, i));
  const openKeys = [];

  if (Array.isArray(menus)) {
    asideMenuConfig.forEach((item, index) => {
      if (pathname.startsWith(item.path)) {
        openKeys.push(`${index}`);
      }
    });
  }
  return openKeys;
}

const Aside = withRouter(({ location }) => {
  const defaultOpenKeys = getDefaultOpenKeys(location);
  const [openKeys, setOpenKeys] = useState(defaultOpenKeys);

  return (
    <Nav style={{ width: 160 }} type="primary" selectedKeys={[location.pathname]} openKeys={openKeys} onOpen={setOpenKeys}>
      {asideMenuConfig.map((item, i) => getSubMenuOrItem(item, i))}
    </Nav>
  );
});

export default class BasicLayout extends Component {
  state = {
    user: null,
  };

  onLogout = () => {};

  render() {
    const { user } = this.state;

    return (
      <Layout fixable>
        <Layout.Header type="primary" className={styles.header}>
          <a href="/" className={styles.logo}><span className={styles.brand}>Edge</span>UI</a>
          {user ? (
            <div className={styles.actions}>
              <Button text>{user.name}</Button>
              <Button text onClick={this.onLogout}>退出</Button>
            </div>
          ) : (
            <Button type="primary">登录</Button>
          )}
        </Layout.Header>
        <Layout.Section scrollable>
          <Layout.Aside width={200} type="primary">
            <Aside />
          </Layout.Aside>
          <Layout.Main>
            <Switch>
              {routes.filter(item => item.component).map((item, i) => (
                <Route key={i} exact path={item.path} component={item.component} />
              ))}
            </Switch>
          </Layout.Main>
        </Layout.Section>
      </Layout>
    );
  }
}
