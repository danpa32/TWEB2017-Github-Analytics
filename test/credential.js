const fs = require('fs');
const Credentials = require('../src/credential');

const should = require('chai').should();

describe('Credential', () => {
  it('is possible to recuperate credential from environment variable', () => {
    const USERNAME = 'testUsername';
    const TOKEN = 'testToken';

    process.env.GITHUB_USERNAME = USERNAME;
    process.env.GITHUB_TOKEN = TOKEN;

    const cred = new Credentials();
    should.exist(cred);
    cred.should.have.property('token', TOKEN);
    cred.should.have.property('username', USERNAME);
    cred.should.have.property('source', 'ENV');
  });

  it('is possible to recuperate credential from file', () => {
    const USERNAME = 'testUsername';
    const TOKEN = 'testToken';
    const PATH = '.testAuth.json';

    // Ensure there is no ENV variable.
    delete process.env.GITHUB_USERNAME;
    delete process.env.GITHUB_TOKEN;

    // Create auth file.
    fs.writeFileSync(PATH, JSON.stringify({ username: USERNAME, token: TOKEN }));

    const cred = new Credentials(PATH);
    should.exist(cred);
    cred.should.have.property('token', TOKEN);
    cred.should.have.property('username', USERNAME);
    cred.should.have.property('source', 'FILE');

    // Delete auth file.
    fs.unlinkSync(PATH);
  });
});
