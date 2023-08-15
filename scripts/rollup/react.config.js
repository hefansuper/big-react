// 打包react包的rollup配置项

import { getPackageJson, resolvePkgPath } from './utils';

// react包相关的信息。
const { name, module } = getPackageJson('react');
// react包的路径
const reactPkgPath = resolvePkgPath(name);
// react产物路径
const reactPkgDistPath = resolvePkgPath(name, true);

export default [
	// react
	{
		input: `${reactPkgPath}/${module}`,
		output: {
			file: `${reactPkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		}
	}
];
