const fs = require('fs');

const DEFAULT_AUTH_FILE_PATH = 'auth.json';

class Credentials {
  constructor(path) {
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME) {
      this.token = process.env.GITHUB_TOKEN;
      this.username = process.env.GITHUB_USERNAME;
      this.source = 'ENV';
    } else {
      const usedPath = path || DEFAULT_AUTH_FILE_PATH;
      if (fs.existsSync(usedPath)) {
        const auth = JSON.parse(fs.readFileSync(usedPath, 'utf8'));
        this.token = auth.token;
        this.username = auth.username;
        this.source = 'FILE';
      } else {
        throw new Error('No credential found');
      }
    }
  }
}

module.exports = Credentials;
