# Homework 4 (lesson 8). JavaScript. Simple text indexing script

## About
Here you can find the code dedicated to the 4th task of javascript block. It implements simple text indexing script in Vanilla JS using NodeJS Stream API.

## Description
NodeJS script ```indexMyText``` should do the following (using NodeJS Stream API for every step if applicable):
* take a text file path as the one and only argument
* read it and split it into separate words by spaces or new line symbols
* filter non-text symbols ('.', ',' etc.)
* index the text into an array of numbers. The position of the element in the array represents the order of all input words, sorted alphabetically. The value is the number of times a particular word appears in the text.
* write this vector into a file.

Some examples of input and output values:
```
ab, cb, bss, cb, b, cb -> [1, 1, 1, 3]

ab cb bss b -> [1, 1, 1, 1]
```

## How To
Node version: ^20.15.0

```npm install``` in your terminal before any other actions

```npm run link``` in your terminal to link CLI globally with npm so that you can test it locally

```git update-index --chmod=+x ./bin/indexMyText.js``` in your terminal in case the script somehow lacks execution permissions

```npm run lint``` in your terminal to run eslint

```indexMyText --help``` in your terminal to explore and use the tool
