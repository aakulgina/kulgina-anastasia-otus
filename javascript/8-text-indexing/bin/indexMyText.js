#!/usr/bin/env node
import readline from 'node:readline/promises';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { access, constants, rm } from 'node:fs/promises';
import { join, parse, resolve } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
	.usage('$0 <file>', 'Proceeds the given file to build its vector. The vector describes the text in terms of how many times each particular word appears in the text.', (yargs) => {
    	yargs.positional('file', {
      		describe: 'The path to the file you want to build index for.',
      		type: 'string',
    	});
	})
	.check((argv) => {
		if (argv._.length > 0 && argv.file) {
			throw new Error("Only 1 file path may be passed.");
		} else {
		  return true;
		}
	})
	.help()
	.parse();

const { file: fileToIndex } = argv;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

async function indexMyText(inputFilePath, fileDir, outputFileBase) {
	const reader = createReadStream(inputFilePath, { highWaterMark: 16 });
	const writer = createWriteStream(join(fileDir, outputFileBase), { highWaterMark: 16 });

	const dict = {};

	reader.addListener('data', (data) => {
		const arr = data
			.toString()
			.split(/(?<=.|\r|\n|\s)[^\wА-Яа-яЁё]|\r|\n|\s+/)
			.filter(str => str.length);

		if (arr.length) {
			arr.forEach(word => {
				if (dict[word]) {
					dict[word] += 1;
				} else {
					dict[word] = 1;
				}
			})
		}
	});

	reader.addListener('close', () => {
		const vector = Object
			.entries(dict)
			.sort(([word1], [word2]) => {
				if (word1.toLowerCase() > word2.toLowerCase()) return 1;
				if (word1.toLowerCase() < word2.toLowerCase()) return -1;
				return 0;
			})
			.map(item => item[1]);
		writer.write(`[${vector.join(', ')}]`, 'utf-8');
	});
}

try {
	const { ext: fileExtension, base, dir, name } = parse(fileToIndex);

	if (fileExtension !== '.txt') {
		throw new Error("The path argument should represent a file with .txt extension");
	}

	const fileDirectory = resolve(dir || process.cwd());
	const inputFilePath = join(fileDirectory, base);
	const resultFileBase = `${name}_indexed.txt`;

	await access(inputFilePath, constants.R_OK);

	await access(fileDirectory, constants.W_OK);

	const resultFilePath = join(fileDirectory, resultFileBase);

	const areWeReadyToProceedTheFile = async () => {
		if (existsSync(resultFilePath)) {
			let decision = await rl.question('The destination file already exists. Do you want to replace it? [y/n]   ');
	
			while (decision[0].toLowerCase() !== 'y' && decision[0].toLowerCase() !== 'n') {
				decision = await rl.question('The destination file already exists. Do you want to replace it? [y/n]   ');
			}
	
			if (decision[0].toLowerCase() === 'n') {
				return false;
				
			} else {
				await rm(resultFilePath);
	
				return true;
			}
		}
	
		return true;
	}

	const checkResult = await areWeReadyToProceedTheFile();
	rl.close();

	if (checkResult) {
		await indexMyText(inputFilePath, fileDirectory, resultFileBase);

		console.log(`\nFind your file's index at ${resultFilePath}\n`);
	} else {
		console.log('\nSorry, your file cannot be proceeded. Please change destination file path and try again\n');
	}
} catch (error) {
	throw new Error(error);
}
