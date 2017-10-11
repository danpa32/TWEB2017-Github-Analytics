const fs = require('fs');

const GithubAPI = require('../src/github-api');
const credential = require('../auth.json');

const github = new GithubAPI(credential);

const REPO_INFO = {
  owner: 'gohugoio',
  repo: 'hugo',
};

const PUBLISH_INFO = {
  repo: 'TWEB2017-Github-Analytics-Client',
  owner: 'danpa32',
  branch: 'gh-pages',
  path: 'repo.json',
  message: 'New version of the data',
};

function digest(input) {
  const output = {
    date_crawl: new Date(),
    owner: REPO_INFO.owner,
    repo: REPO_INFO.repo,
    issues: [],
  };
  for (let i = 0; i < input.length; i += 1) {
    output.issues.push({
      idIssue: input[i].id,
      user: {
        id: input[i].user.id,
        login: input[i].user.login,
      },
      state: input[i].state,
    });
  }
  return output;
}

function publish(data, callback) {
  github.pushFile(
    PUBLISH_INFO.owner, PUBLISH_INFO.repo, PUBLISH_INFO.branch,
    PUBLISH_INFO.path, JSON.stringify(data), PUBLISH_INFO.message, callback,
  );
}

github.fetchAllIssues(REPO_INFO.owner, REPO_INFO.repo, (err, acc) => {
  if (err) {
    return;
  }
  console.log('DATA FETCHED');

  publish(digest(acc), (error) => {
    if (error) {
      console.log('ERROR PUBLISHING THE FILE');
    } else {
      console.log('All DONE');
    }
  });
});
