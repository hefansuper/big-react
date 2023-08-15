// 打包react包的rollup配置项

import { getPackageJson, resolvePkgPath, getBaseRollupPlugins } from './utils';

// react包相关的信息。
const { name, module } = getPackageJson('react');
// react包的路径
const reactPkgPath = resolvePkgPath(name);
// react产物路径
const reactPkgDistPath = resolvePkgPath(name, true);

// 打成3个不同的js文件，而不是一个文件。
export default [
	// react 包
	{
		input: `${reactPkgPath}/${module}`,
		output: {
			file: `${reactPkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [...getBaseRollupPlugins()]
	},
	// jsx-runtime
	{
		input: `${reactPkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${reactPkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${reactPkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: [...getBaseRollupPlugins()]
	}
];
