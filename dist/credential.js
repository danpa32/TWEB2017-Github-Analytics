const fs = require('fs');

const DEFAULT_AUTH_FILE_PATH = 'auth.json';

class Credentials {
  constructor(path) {
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME) {
      this.token = process.env.GITHUB_TOKEN;
      this.username = process.env.GITHUB_USERNAME;
      this.source = 'ENV';
    } else {
      const auth = JSON.parse(fs.readFileSync(path || DEFAULT_AUTH_FILE_PATH, 'utf8'));
      this.token = auth.token;
      this.username = auth.username;
      this.source = 'FILE';
    }
  }
}

module.exports = Credentials;
//# sourceMappingURL=credential.js.map
