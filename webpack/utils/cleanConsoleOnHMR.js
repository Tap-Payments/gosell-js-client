/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
if (IS_DEV_SERVER) {
  if (module.hot) {
    module.hot.accept();
    module.hot.addStatusHandler((status) => {
      if (status === 'prepare') console.clear();
    });
  }
}
