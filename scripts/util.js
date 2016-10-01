/* eslint-disable no-console */
const taskStart = name => console.log(`----- task "${name}" started -----`);
const taskEnd = name => console.log(`-----  task "${name}" ended  -----`);
/* eslint-enable no-console */

const catchPromiseReject = promise => {
  return promise.catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  });
};

export {
  taskStart,
  taskEnd,
  catchPromiseReject,
};
