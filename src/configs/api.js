import API, { GET, POST, PATCH, DELETE } from '@pixcai/make-api';

API.request.defaults.timeout = 600000;
API.request.defaults.withCredentials = true;

export const tag = {
  query: GET('/tag'),
  create: POST('/tag'),
  update: PATCH('/tag'),
  delete: DELETE('/tag'),
  filterByNodes: GET('/tag/node'),
};

export const service = {
  query: GET('/service'),
  create: POST('/service'),
  update: PATCH('/service'),
  delete: DELETE('/service'),
};

export const node = {
  query: GET('/node'),
  create: POST('/node'),
  update: PATCH('/node'),
  delete: DELETE('/node'),
  filterByTags: GET('/node/tag'),
  createTags: POST('/node/tag'),
};

export const task = {
  query: GET('/task'),
  create: POST('/task'),
  update: PATCH('/task'),
  delete: DELETE('/task'),
  queryNodes: GET('/task/:taskId'),
  toggleTask: POST('/task/:taskId'),
};

export const arch = {
  query: GET('/arch'),
  create: POST('/arch'),
  update: PATCH('/arch'),
  delete: DELETE('/arch'),
};

export const user = {
  login: POST('/login'),
  logout: GET('/logout'),
};
