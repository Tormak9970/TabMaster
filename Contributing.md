# Contributing Guidlines

We're glad you're interesting in contributing! Here's what you should keep in mind as you help us to improve TabMaster.


# Editor Setup

We encourage you to use VSCode, as it is easy to use and set up, and will have all the needed extensions. <br/>
Required Extensions:
 - Add jsdoc comments
 - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
 - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

Helpful Extensions:
 - [JavaScript and TypeScript Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
 - [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
 - [Remote Explorer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-explorer)


# Coding Conventions

When writing code for TabMaster, you should ensure the following:
 - Use 2 space tabs
 - Always use semi-colons. Just because TypeScript lets you skip them, doesn't mean you should
 - Do no use the "any" type unless absolutely necessary (patching is exempt from this)
 - For variables, use camelCase for TypeScript, snake_case for Python
 - Functions should not be anonymous (aka arrow functions) unless they are components or it is necessary
 - Add JSDoc comments to functions


# Commits

We use commitlint to ensure that our commits are short, readable, and easy to convert into a changelog. Husky will validate your commit messages before you push a commit to help you make sure it is up to standard.<br/>
Here's what you need to know:
 - no uppercase letters or special characters
 - commit must have one of the following prefixes:
   - fix - bug fixes
   - feat - new features
   - style - styling changes
   - chore - code cleanup, progress on something, etc
   - ci - changes to the ci
   - build - build pipeline/release related
   - docs - changes to the documentation
   - refactor - refactoring
 - when writing a good commit message, keep it short. You can always add details in the commit description

# Pull Requests

PRs should follow commitlint conventions as well
