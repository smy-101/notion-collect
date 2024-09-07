import { exec } from 'child_process';
import { Plugin } from 'vite';

export default function runCommandPlugin(command: string): Plugin {
  return {
    name: 'vite-plugin-run-command',
    closeBundle() {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  };
}
