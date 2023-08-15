// 打包react包的rollup配置项

import { getPackageJson, resolvePkgPath, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

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
		plugins: [
			...getBaseRollupPlugins(),
			// 生成package.json
			generatePackageJson({
				// 入口
				inputFolder: reactPkgPath,
				// 出口
				outputFolder: reactPkgDistPath,
				// package.json中需要的字段，不是所有的字段都需要，比如shared字段就不需要。
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
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
