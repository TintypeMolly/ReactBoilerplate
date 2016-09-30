/* eslint-disable no-console */
const taskStart = name => console.log(`----- task "${name}" started -----`);
const taskEnd = name => console.log(`-----  task "${name}" ended  -----`);
/* eslint-enable no-console */

const handleWebpackError = (err, stats) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
  const jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0) {
    for (const err of jsonStats.errors) {
      console.error(err); // eslint-disable-line no-console
    }
    process.exit(1);
  }
};

export {
  taskStart,
  taskEnd,
  handleWebpackError,
};
