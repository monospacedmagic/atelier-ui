# Amethyst-UI Contributing Guide

Hi! We, the maintainers, are really excited that you are interested in contributing to Amethyst-UI. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Financial Contribution](#financial-contribution)

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

- Try to search for your issue, it may have already been answered or even fixed in the development branch (`dev`).

- Check if the issue is reproducible with the latest stable version of Amethyst-UI. If you are using a pre-release, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- Use only the minimum amount of code necessary to reproduce the unexpected behavior. A good bug report should isolate specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you expect the method or methods to do, and how did the observed behavior differ? The more precisely you isolate the issue, the faster we can investigate.

- Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities — fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid support and we cannot make guarantees about how fast your issue can be resolved.

## Pull Request Guidelines

- The `master` branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- If adding new feature:
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  - If you are resolving a special issue, add `(fix: #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide detailed description of the bug in the PR. Live demo preferred.

### Helpful Tip on Merging branches

When you submit your Pull Request you need to be sure that it contains only the files that you've modified.

Two cases can arise, the easiest one is that you worked on your feature and when you submit your Pull Request no conflict is spotted by GitHub. In this case, just do your commits as usual, push your branch and submit your Pull Request.

The other case is when you need to use some updated code of the `dev` branch or when you have a conflict. To achieve this you need to rebase your feature's branch onto `dev` with the following steps:

Be sure to commit all your work first and then:
```
git fetch
git checkout dev
git pull
git checkout my_branch
git reset --soft HEAD~X // where X is the number of commits that you did
```
At this point you might need to stash your changes
```
git stash
```
Then
```
git rebase dev
```
And may be reapply your stash
```
git stash pop
```
```
git commit -m "my commit message"
git push -f
```
This will rewrite the history of your branch and ensure that your Pull Request doesn't contain the files of other merged features.

And yes you lose your commit history. But this doesn't matter because the Pull Request will be Squashed and Merged.

#### Troubleshooting
Sometimes things break, and its hard to figure out what is going on: Here are a couple things that will help you to restore to a clean environment, which almost always fixes things:

- clear your site data in the browser console
- read the entire stack trace of errors and track it back to a file you recognize
- if you see any kind of warning anywhere, resolve it or escalate to the core team
- you must not be running multiple instances of the api, auth or client packages
- increase the memory available to node for running Quasar: 
  `NODE_OPTIONS=--max_old_space_size=4096 quasar dev`
- are your critical libraries (node, yarn) up to date?

As a last resort, try killing all the node and cargo processes (on mac and linux) - but be warned, this will kill any and all processes you have running.

```
$ ps auxww | grep node | grep -v grep | awk '{ print $2 }' | xargs kill -9
$ ps auxww | grep cargo | grep -v grep | awk '{ print $2 }' | xargs kill -9
```

## Development Setup
TO BE UPDATED. 

