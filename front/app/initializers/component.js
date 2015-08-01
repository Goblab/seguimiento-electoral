export function initialize(container) {
  // application.inject('route', 'foo', 'service:foo');
  container.injection('component', 'store', 'store:main');
  container.injection('view', 'store', 'store:main');
}

export default {
  name: 'component',
  initialize: initialize
};
