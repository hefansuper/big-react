import path from 'path';
import fs from 'fs';
// 将对应的变量在不同的环境中替换为不同的值。
import replace from '@rollup/plugin-replace';

// 打包ts成js
import ts from 'rollup-plugin-typescript2';
// 将commonjs打成es modules。
import cjs from '@rollup/plugin-commonjs';

// 包的路径
const pkgPath = path.resolve(__dirname, '../../packages');
// 打包后的dist文件的路径。文件名字为node_modules是node的规范。
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 获取包的路径，兼容包与dist
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

// 获取package.json中的字段.
export function getPackageJson(pkgName) {
	const packageJsonPath = `${resolvePkgPath(pkgName)}/package.json`;
	const string = fs.readFileSync(packageJsonPath, {
		encoding: 'utf-8'
	});
	return JSON.parse(string);
}

// 获取公共的rollup打包的方法。

// typescript 配置。
// replace 将__DEV__替换为false或者true，来区隔环境。
export function getBaseRollupPlugins({
	alias = {
		__DEV__: true
	},
	typescript = {}
} = {}) {
	return [replace(alias), cjs(), ts(typescript)];
}
