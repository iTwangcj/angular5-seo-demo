// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false, // true: 开启打包测试，false: 关闭
	basePath: 'http://127.0.0.1:1796/api', // 后端服务API地址
	// basePath: 'http://test.mock.com/api', // 本地域名代理

	token: '94C8AA2452BCCD82EE129B46F7C4BE79',
	session: '8E32A82FA7897BAA1C7F2BBF920B0FF1',
	loginNum: '012D183C9482AA15E7631B8BFC63AA5C',
	expireTime: '4B9AAFABBEE6FAF908E6DC7F24971B71',
	permission: '673DC350025B72D155CFA0F7A03BF03F'
};
