const GithubAPI = require('./github-api');
const Credential = require('./credential');

const credential = new Credential();
const github = new GithubAPI(credential);

const REPO_INFO = {
  owner: 'nodejs',
  repo: 'node',
};

const PUBLISH_INFO = {
  repo: 'TWEB2017-Github-Analytics-Client',
  owner: 'danpa32',
  branch: 'gh-pages',
  path: 'repo.json',
  message: 'AGENT: New version of the data',
};

function digest(input) {
  const output = {
    date_crawl: new Date(),
    owner: REPO_INFO.owner,
    repo: REPO_INFO.repo,
    authors: [],
  };
  const authorsMap = new Map();

  for (let i = 0; i < input.length; i += 1) {
    const userId = input[i].user.id;
    let authorIssues = authorsMap.get(userId);
    if (authorIssues === undefined) {
      authorIssues = {
        id: userId,
        login: input[i].user.login,
        open: 0,
        closed: 0,
      };
      authorsMap.set(userId, authorIssues);
    }

    authorIssues[input[i].state] += 1;
  }

  output.authors = Array.from(authorsMap.values());

  return output;
}

function publish(data, callback) {
  github.pushFile(
    PUBLISH_INFO.owner,
    PUBLISH_INFO.repo,
    PUBLISH_INFO.branch,
    PUBLISH_INFO.path,
    JSON.stringify(data),
    PUBLISH_INFO.message,
    callback,
  );
}

console.log('STARTING CRAWL');
github.fetchAllIssues(REPO_INFO.owner, REPO_INFO.repo, (err, acc) => {
  if (err) {
    console.error('ERROR FETCHING DATA: %O', err);
    return;
  }
  console.log('DATA FETCHED');

  publish(digest(acc), (error) => {
    if (error) {
      console.error('ERROR PUBLISHING THE FILE: %O', error);
    } else {
      console.log('All DONE');
    }
  });
});
