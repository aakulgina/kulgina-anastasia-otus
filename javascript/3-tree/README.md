# Homework 2 (lesson 3). JavaScript. Tree

## About
Here you can find the code dedicated to the second task of javascript block. It implements ```tree``` script in Vanilla JS.

## Description
NodeJS script ```tree``` should take directory path with ```--depth``` or ```-d``` flag and depth number value as arguments and return a structure tree like the following: 
```
tree ./node -d 2
node
├── cluster
│   └── index.js
├── domain
│   └── error.js
2 directories, 2 files
```

File system calls should be async.

## How To
Node version: ^20.15.0

```npm install``` in your terminal before any other actions

```npm run link``` in your terminal to link CLI globally with npm so that you can test it locally

```git update-index --chmod=+x ./bin/tree.js``` in your terminal in case the script somehow lacks execution permissions

```npm run lint``` in your terminal to run eslint

```customTree --help``` in your terminal to explore and use the tool
