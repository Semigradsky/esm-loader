import path from 'path';
import type { ModuleFormat } from 'module';
import { installSourceMapSupport } from '@esbuild-kit/core-utils';
import {
	getTsconfig,
	parseTsconfig,
	createPathsMatcher,
	createFilesMatcher,
} from 'get-tsconfig';
import { getPackageType } from './package-json.js';

export const applySourceMap = installSourceMapSupport();

const tsconfig = (
	process.env.ESBK_TSCONFIG_PATH
		? {
			path: path.resolve(process.env.ESBK_TSCONFIG_PATH),
			config: parseTsconfig(process.env.ESBK_TSCONFIG_PATH),
		}
		: getTsconfig()
);

export const fileMatcher = tsconfig && createFilesMatcher(tsconfig);
export const tsconfigPathsMatcher = tsconfig && createPathsMatcher(tsconfig);

export const fileProtocol = 'file://';

export const tsExtensionsPattern = /\.([cm]?ts|[tj]sx)$/;

const getFormatFromExtension = (fileUrl: string): ModuleFormat | undefined => {
	const extension = path.extname(fileUrl);

	if (extension === '.json') {
		return 'json';
	}

	if (extension === '.mjs' || extension === '.mts') {
		return 'module';
	}

	if (extension === '.cjs' || extension === '.cts') {
		return 'commonjs';
	}
};

export const getFormatFromFileUrl = (fileUrl: string) => {
	const format = getFormatFromExtension(fileUrl);

	if (format) {
		return format;
	}

	// ts, tsx, jsx
	if (tsExtensionsPattern.test(fileUrl)) {
		return getPackageType(fileUrl);
	}
};

export type MaybePromise<T> = T | Promise<T>;
