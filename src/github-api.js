const request = require('superagent');

class GithubAPI {
  constructor(credential) {
    this.credential = credential;
    this.BASE_URL = 'https://api.github.com';
  }

  get(url, done, query) {
    request
      .get(url)
      .auth(this.credential.username, this.credential.token)
      .query(query)
      .set('Accept', 'application/vnd.github.v3+json')
      .end(done);
  }

  fetchAll(url, done, query) {
    let acc = [];

    const wrapClass = this;

    function fetchNext(err, res) {
      if (!err) {
        acc = acc.concat(res.body);
      }
      if (!err && res.links && res.links.next) {
        wrapClass.get(res.links.next, fetchNext);
      } else {
        done(err, acc);
      }
    }

    const mergedQuery = Object.assign({ per_page: '100' }, query);
    this.get(url, fetchNext, mergedQuery);
  }

  fetchAllIssues(owner, repo, done) {
    const ENDPOINT = `${this.BASE_URL}/repos/${owner}/${repo}/issues`;
    this.fetchAll(ENDPOINT, done, { state: 'all' });
  }

  put(url, data, done) {
    request
      .put(url)
      .auth(this.credential.username, this.credential.token)
      .send(data)
      .set('Accept', 'application/vnd.github.v3+json')
      .end(done);
  }

  pushFile(owner, repo, branch, path, content, message, done) {
    const ENDPOINT = `${this.BASE_URL}/repos/${owner}/${repo}/contents/${path}`;

    const buf = Buffer.from(content);
    const params = {
      path,
      message,
      branch,
      committer: {
        name: 'Crawler',
        email: 'christopher.meier@heig-vd.ch',
      },
      content: buf.toString('base64'),
    };

    // Sendfile
    this.put(ENDPOINT, params, (err, res) => {
      if (err && err.status === 422) {
        // The file already exists
        // Recuperate the sha of the existing file
        this.get(ENDPOINT, (error, response) => {
          if (error) {
            done(error, response);
          } else {
            // Replace the upstream file with new one.
            params.sha = response.body.sha;
            this.put(ENDPOINT, params, done);
          }
        }, { ref: params.branch });
      } else {
        done(err, res);
      }
    });
  }
}

module.exports = GithubAPI;
