/* eslint-disable no-console */
const taskStart = name => console.log(`----- task "${name}" started -----`);
const taskEnd = name => console.log(`-----  task "${name}" ended  -----`);

export {taskStart, taskEnd};
