const GithubAPI = require('../src/github-api');
const Credential = require('../src/credential');

const should = require('chai').should();

const credential = new Credential();

describe('Github API', () => {
  it('is possible to create one', () => {
    const cred = {
      username: 'testUsername',
      token: 'testToken',
    };
    const github = new GithubAPI(cred);

    should.exist(github);
    github.credential.username.should.equal(cred.username);
    github.credential.token.should.equal(cred.token);
  });


  it('is possible to publish a file and then update it', (done) => {
    const PUBLISH_INFO = {
      repo: 'TWEB2017-Github-Analytics-Client',
      owner: 'danpa32',
      branch: 'gh-pages',
      path: 'test.json',
      message: 'New version of the data',
    };
    const github = new GithubAPI(credential);

    const data = {
      date: new Date(),
      message: 'it works',
    };

    github.pushFile(
      PUBLISH_INFO.owner, PUBLISH_INFO.repo, PUBLISH_INFO.branch,
      PUBLISH_INFO.path, JSON.stringify(data), PUBLISH_INFO.message, (err, res) => {
        should.not.exist(err);
        should.exist(res);

        // Update
        data.message = 'it updates';
        github.pushFile(
          PUBLISH_INFO.owner, PUBLISH_INFO.repo, PUBLISH_INFO.branch,
          PUBLISH_INFO.path, JSON.stringify(data), PUBLISH_INFO.message, (error, response) => {
            should.not.exist(error);
            should.exist(response);
            done();
          },
        );
      },
    );
  });

  it('is possible to recuperate one page of issues from a repo', (done) => {
    const REPO_INFO = {
      owner: 'gohugoio',
      repo: 'hugo',
    };
    const github = new GithubAPI(credential);

    const URL = `${github.BASE_URL}/repos/${REPO_INFO.owner}/${REPO_INFO.repo}/issues`;

    github.get(URL, (err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.body.should.be.an('array');
      done();
    });
  });

  it('is possible to recuperate all pages of issues from a repo using the given method', (done) => {
    const REPO_INFO = {
      owner: 'gohugoio',
      repo: 'hugo',
    };
    const github = new GithubAPI(credential);

    github.fetchAllIssues(REPO_INFO.owner, REPO_INFO.repo, (err, acc) => {
      should.not.exist(err);
      should.exist(acc);
      acc.should.be.an('array');
      done();
    });
  });
});
