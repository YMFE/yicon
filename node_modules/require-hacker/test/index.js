import path from 'path'
import chai from 'chai'

import fs from 'fs'

import require_hacker from '../source/index'

import Log from '../source/tools/log'

chai.should()

// logging
const log = new Log('testing', { debug: true })

describe('require hacker', function()
{
	beforeEach(function()
	{
	})

	after(function()
	{
	})

	it('should hook into js extension loading', function()
	{
		// mount require() hook
		const hook = require_hacker.hook('js', path =>
		{
			return `module.exports = "${fs.readFileSync(path).toString()}"`
		})

		// unmount require() hook
		hook.unmount()
	})

	it('shouldn\'t allow already occupied file extension override', function()
	{
		const test_hook = () => require_hacker.hook('test', path => {})
		const test_global_hook = () => require_hacker.global_hook('test', path => {})

		// mount require() hook
		const hook = test_hook()

		// verify that it guards the file extension
		test_hook.should.throw('occupied')

		// verify that it guards the file extension
		test_global_hook.should.throw('occupied')

		// unmount require() hook
		hook.unmount()

		// mount a global require() hook
		const global_hook = test_global_hook()

		// verify that it guards the file extension
		test_hook.should.throw('occupied')

		// verify that it guards the file extension
		test_global_hook.should.throw('occupied')

		// unmount the global require() hook
		global_hook.unmount()
	})

	it('should hook into file extension loading', function()
	{
		// mount require() hook
		const hook = require_hacker.hook('txt', path =>
		{
			return `module.exports = "${fs.readFileSync(path).toString()}"`
		})

		// will output text file contents
		require('./test.txt').should.equal('Hot threesome interracial with double penetration')

		// unmount require() hook
		hook.unmount()

		// will throw "SyntaxError: Unexpected token ILLEGAL"
		const would_fail = () => require('./another test.txt')
		would_fail.should.throw(SyntaxError)
	})

	it('should hook into arbitrary path loading', function()
	{
		// mount require() hook
		const hook = require_hacker.global_hook('textual', path =>
		{
			if (path.indexOf('http://xhamster.com') >= 0)
			{
				return `module.exports = "Free porn"`
			}
		})

		// will output text file contents
		require('http://xhamster.com').should.equal('Free porn')

		// unmount require() hook
		hook.unmount()

		// will throw "Error: Cannot find module"
		const would_fail = () => require('http://xhamster.com')
		would_fail.should.throw('Cannot find module')
	})

	it('should hook into arbitrary path loading (preceding Node.js original loader)', function()
	{
		// mount require() hook
		const hook = require_hacker.global_hook('javascript', path =>
		{
			if (path.indexOf('/dummy.js') >= 0)
			{
				return `module.exports = "Free porn"`
			}
		})

		// will output text file contents
		require('./dummy.js').should.equal('Free porn')

		// unmount require() hook
		hook.unmount()

		// usual Node.js loader takes precedence
		require('./dummy.js').should.equal('Hot lesbians making out')
		// clear require() cache (just in case)
		delete require.cache[path.resolve(__dirname, './dummy.js')]

		// mount require() hook
		const ignoring_hook = require_hacker.global_hook('javascript', path =>
		{
			return
		})

		// usual Node.js loader takes precedence
		require('./dummy.js').should.equal('Hot lesbians making out')
		// clear require() cache (just in case)
		delete require.cache[path.resolve(__dirname, './dummy.js')]
		
		// unmount require() hook
		ignoring_hook.unmount()
	})

	it('should validate options', function()
	{
		// mount require() hook
		const hook = (id, resolve) => () => require_hacker.global_hook(id, resolve)

		hook().should.throw('You must specify global hook id')

		hook('.js').should.throw('Invalid global hook id')

		hook('js').should.throw('Resolve should be a function')

		hook('js', true).should.throw('Resolve should be a function')

		const hook_extension = (extension, handler) => () => require_hacker.hook(extension, handler)

		hook_extension('.js').should.throw('Invalid file extension')
	})

	it('should fall back', function()
	{
		// mount require() hook
		const hook = require_hacker.hook('js', path =>
		{
			return
		})

		// will output text file contents
		require('./dummy.js').should.equal('Hot lesbians making out')

		// unmount require() hook
		hook.unmount()
	})

	it('should resolve', function()
	{
		// for example, it can prefix all require() paths

		let resolver = require_hacker.resolver(path => '/gay_xxx/dummy.js')

		// path separators get messed up between different OSes
		;(() => require('./dummy.js')).should.throw('gay_xxx')

		resolver.unmount()

		require('./dummy.js').should.equal('Hot lesbians making out')

		// return nothing should take no effect

		resolver = require_hacker.resolver(path => { return })

		require('./dummy.js').should.equal('Hot lesbians making out')

		resolver.unmount()
	})

	it('should convert to javascript module source', function()
	{
		require_hacker.to_javascript_module_source().should.equal('module.exports = undefined')
		require_hacker.to_javascript_module_source('a').should.equal('module.exports = "a"')
		require_hacker.to_javascript_module_source('module.exports = "a"').should.equal('module.exports = "a"')
		require_hacker.to_javascript_module_source({ a: 1 }).should.equal('module.exports = {"a":1}')
	})

	it('should resolve paths', function()
	{
		require_hacker.resolve('./test.txt', module).should.equal(path.resolve(__dirname, 'test.txt'))
		require_hacker.resolve('../package', module).should.equal(path.resolve(__dirname, '../package.json'))
		require_hacker.resolve('babel-runtime/core-js', module).should.equal(path.resolve(__dirname, '../node_modules/babel-runtime/core-js.js'))
	})
})