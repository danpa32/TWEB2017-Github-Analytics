const chai = require('chai');
const GitHubApi = require('github');
const auth = require('../auth.json');

const github = new GitHubApi({
  // debug: true,
});
github.authenticate(auth);

const { expect } = chai;
chai.should();

function getAllPages(callback) {
  let acc = [];
  function getNext(err, res) {
    if (!err) {
      acc = acc.concat(res.data);
    }
    if (!err && github.hasNextPage(res)) {
      github.getNextPage(res, getNext);
    } else {
      callback(err, acc);
    }
    return !err;
  }
  return getNext;
}

describe('Connexion to github API', () => {
  it('is possible to recuperate one page of issues from a repo', (done) => {
    const repoInfo = {
      owner: 'gohugoio',
      repo: 'hugo',
    };

    github.issues.getForRepo(repoInfo, (err, res) => {
      expect(err).to.be.null;
      expect(res.data).to.be.an('array');
      done();
    });
  });

  it('is possible to recuperate all issues from a repo', (done) => {
    const repoInfo = {
      owner: 'gohugoio',
      repo: 'hugo',
    };

    github.issues.getForRepo(repoInfo, getAllPages((err, data) => {
      expect(err).to.be.null;
      expect(data).to.be.an('array');
      done();
    }));
  });
});
