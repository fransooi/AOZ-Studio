'use babel';

import { BufferedProcess, CompositeDisposable } from 'atom';
import path from 'path';

const HTML_FILE_EXTS = ['.html', '.htm'];
const MIN_PORT = 1025;
const MAX_PORT = 65535;

const getRandomPort = () => {
  return Math.floor(Math.random() * (MAX_PORT - MIN_PORT)) + MIN_PORT;
};

const getTargetPath = () => {
  // If the active pane corresponds to an HTML file, use its path.
  const activePaneItem = atom.workspace.getActivePaneItem();
  if (activePaneItem) {
    const activeFile = activePaneItem.buffer.file;
    if (activeFile) {
      const activeFilePath = activeFile.path;
      if (HTML_FILE_EXTS.indexOf(path.extname(activeFilePath)) !== -1) {
        return activeFilePath;
      }
    }
  }

  // Otherwise, use the active project path.
  return atom.project.getPaths()[0];
};

export default {
  localWebServerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'local-web-server:start': () => this.start()
    }));
    console.log('Subscribed to start command');
  },

  deactivate() {
    this.subscriptions.dispose();
    console.log('Unsubscribed from start command');
  },

  serialize() {
    return null;
  },

  start() {
    const packagePath = atom.packages.resolvePackagePath('local-web-server');
    const targetPath = getTargetPath();
    const port = getRandomPort()

    console.log(`Starting Local Web Server on port ${port} for path ${targetPath}`);

    const command = `${packagePath}/node_modules/.bin/live-server`;
    const args = [`--port=${port}`];
    const cwd = path.dirname(targetPath);
    const filename = path.basename(targetPath);
    if (filename) {
      args.push(`--open=${filename}`);
    }
    const stdout = (output) => console.log(output);
    const exit = (code) => console.log(`live-server exited with code ${code}`);
    const process = new BufferedProcess({command, args, stdout, exit, options: {
      cwd,
    }});
  }

};
