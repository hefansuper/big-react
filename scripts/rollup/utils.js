import path from 'path';
import fs from 'fs';

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
