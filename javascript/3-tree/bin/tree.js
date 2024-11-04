#!/usr/bin/env node
import { access, constants, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
	.usage('$0 [path]', 'Inspects the provided directory', (yargs) => {
    	yargs.positional('path', {
      		describe: 'The path you want to build the tree view for. If empty, the current working directory will be inspected',
      		type: 'string',
			default: process.cwd(),
    	});
	})
	.option('depth', {
		alias: 'd',
		description: 'Tree depth',
		type: 'number',
	})
	.check((argv) => {
		const directoryPaths = argv._;
		if (directoryPaths.length > 1) {
			throw new Error("Only 0 or 1 directories may be passed.");
		} else {
		  return true;
		}
	})
	.help()
	.parse();

const { depth: treeDepth } = argv;
const { path: treeRootDirectory } = argv;

let dirCount = 0;
let filesCount = 0;
const structure = [`${basename(treeRootDirectory)}`];

const inspectDir = async (path, depth) => {
	if (depth >= treeDepth) {
		return;
	}

	const isDeep = depth > 0;

	try {
		const currentDir = await readdir(path, { withFileTypes: true });

		for await (const dirEnt of currentDir) {
			const index = currentDir.indexOf(dirEnt);
			const isLast = index === currentDir.length - 1;
			
			let structureString = "\n";

			if (isDeep) {
				structureString = structureString + "│   ".repeat(depth);
			}

			structureString = structureString + ( isLast ? "└" : "├") + "─".repeat(3) + " ";

			structure.push(structureString + dirEnt.name);

			if (dirEnt.isFile()) {
				filesCount++;
			}

			if (dirEnt.isDirectory()) {
				dirCount++;
				await inspectDir(join(dirEnt.parentPath, dirEnt.name), depth + 1);
			}
		}
	} catch (error) {
		throw new Error(error);
	}
}

try {
	await access(treeRootDirectory, constants.R_OK);

	await inspectDir(treeRootDirectory, 0);

	console.log(structure.join(""));

	console.log(`\n${dirCount} directories, ${filesCount} files`);
} catch (error) {
	throw new Error(error);
}
