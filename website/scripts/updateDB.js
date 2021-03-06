import { runUpdates } from '../src/pythonClient.js';
import shell from 'shelljs';
import fs from 'fs';
import db from '../src/data/db/db.js';

function runCommand() {
  try {
    const path = '../../bin/scrap-fb';
    fs.accessSync(path, fs.constants.X_OK);
    shell.exec(path, (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
      runUpdates()
        .then(rows => console.log(rows))
        .then(() => {
          db.destroy();
        });
    });
  } catch (error) {
    console.log(error);
    db.destroy();
  }
}

runCommand();
