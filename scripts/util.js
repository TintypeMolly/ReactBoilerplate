import spawn from "cross-spawn";

/* eslint-disable no-console */
const taskStart = name => console.log(`----- task "${name}" started -----`);
const taskEnd = name => console.log(`-----  task "${name}" ended  -----`);
/* eslint-enable no-console */

const catchPromiseReject = promise => promise.catch(error => {
  // eslint-disable-next-line no-console
  console.log(error);
  process.exit(1);
});

const spawnPromise = (command, args, options) => new Promise((resolve, reject) => {
  const childProcess = spawn(command, args, options);
  childProcess.stdout.on("data", data => {
    process.stdout.write(data);
  });
  childProcess.stderr.on("data", data => {
    process.stderr.write(data);
  });
  childProcess.on("close", code => {
    if (code === 0) {
      resolve(code);
    } else {
      reject(`Child process "${command}" exited with code ${code}`);
    }
  });
  childProcess.on("error", err => {
    reject(err);
  });
});

export {
  taskStart,
  taskEnd,
  catchPromiseReject,
  spawnPromise as spawn,
};
