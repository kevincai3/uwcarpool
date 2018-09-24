import { CronJob } from 'cron';
import shell from 'shelljs';

function runCommand() {
  try {
    fs.accessSync('~/bin/scrap-fb', fs.constants.X_OK);
    shell.exec('~/bin/scrap-fb', (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
      runUpdates().then(rows => console.log(rows));
    });
  } catch (error) {
    console.log(error);
  }
}

const job = new CronJob('* 0 * * * *', runCommand);

export {
  job,
}
