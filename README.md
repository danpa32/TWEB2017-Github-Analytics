# TWEB2017-Github-Analytics-Agent

This project was realized during the TWEB course at the HEIG-VD and is composed of two parts : a client (website) and an agent. The goal of the project is very simple: display information about the issues of a repository from github.

The client that display the data recuperated by this agent can be found [here](https://github.com/danpa32/TWEB2017-Github-Analytics-Client). 

The agent uses the GitHub API v3 to recuperate the data. It runs thanks to Heroku and is scheduled to run every 24 hours. It shares the data by pushing a JSON file containing the result of the request to the root folder of the website.

The website is hosted on GitHub Pages and can be found [here](https://danpa32.github.io/TWEB2017-Github-Analytics-Client/).

## Agent

This repository contains the agent part of the project. It uses Node.js to recuperate the data and Gulp to ease the test process.

## Build and run

1. You need to place yourself in the **TWEB2017-Github-Analytics-Agent repository**
2. Execute `npm install` in the terminal
3. Execute `gulp lint` and `gulp tests` in the terminal to check the code.
    * You must have installed the gulp client with the command `npm install -g gulp-cli`
4. Execute `npm start` to start the agent.
