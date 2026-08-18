'use strict';

const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const processes = [
  spawn(npm, ['run', 'dev:server'], { cwd: root, stdio: 'inherit' }),
  spawn(npm, ['run', 'dev:client'], { cwd: root, stdio: 'inherit' }),
];

let stopping = false;

function stop(signal) {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => child.kill(signal));
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

processes.forEach((child) => {
  child.on('exit', (code) => {
    if (!stopping && code !== 0) {
      stop('SIGTERM');
      process.exitCode = code || 1;
    }
  });
});
