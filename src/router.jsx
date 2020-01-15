import React, { Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import BasicLayout from '@/layouts/BasicLayout';
import Login from '@/pages/Login';

export default (
  <Router>
    <Suspense fallback="加载中...">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={BasicLayout} />
      </Switch>
    </Suspense>
  </Router>
);
