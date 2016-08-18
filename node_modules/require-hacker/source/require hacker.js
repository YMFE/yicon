// Hacking too much time

// Based on Node.js Module class sources:
// https://github.com/nodejs/node/blob/master/lib/module.js

import fs     from 'fs'
import path   from 'path'
import Module from 'module'

import Log from './tools/log'
import { exists, starts_with, ends_with } from './helpers'

import serialize from './tools/serialize-javascript'

const require_hacker = 
{
	preceding_path_resolvers: [],
	path_resolvers: [],

	global_hook_resolved_modules: {},

	global_hooks_enabled: true,

	occupied_file_extensions: new Set(),

	// logging
	log: new Log('require-hacker', { debug: false }), // this.options.debug

	// installs a require() path resolver 
	//
	// resolve - a function which takes two parameters:
	//
	//             the path to be resolved
	//             the module in which the require() call was originated
	//
	//           must return either a new path to the require()d module
	//           or it can return nothing to fall back to the original require()d module path
	//
	// returns an object with an .unmount() method
	//
	resolver(resolve)
	{
		validate.resolve(resolve)

		const resolver = (path, module) =>
		{
			// resolve the path for this require() call
			const resolved_path = resolve(path, module)
			
			// if no path was resolved - do nothing
			if (!exists(resolved_path))
			{
				return
			}

			// return the path to be require()d 
			return resolved_path
		}

		require_hacker.preceding_path_resolvers.push(resolver)

		const result =
		{
			unmount: () =>
			{
				// javascript arrays still have no .remove() method in the XXI-st century
				require_hacker.preceding_path_resolvers = require_hacker.preceding_path_resolvers.filter(x => x !== resolver)
			}
		}

		return result
	},

	// installs a global require() hook for all paths 
	//
	// (if these paths are certain to exist in the filesystem
	//  and if you need only a specific file extension
	//  then use the .hook(extension, resolve) method instead)
	//
	// id - a meaningful textual identifier
	//
	// resolve - a function which takes two parameters:
	//
	//             the path to be resolved
	//             the module in which the require() call was originated
	//
	//           must return either a javascript CommonJS module source code
	//           (i.e. "module.exports = ...", etc)
	//           or it can return nothing to fall back to the original Node.js loader
	//
	// returns an object with an .unmount() method
	//
	// options:
	//
	//   precede_node_loader:
	//     
	//     true  - this require() hook will intercept all require() calls
	//             before they go into the original Node.js loader
	//    
	//     false - this require() hook will only intercept those require() calls
	//             which failed to be resolved by the original Node.js loader
	//
	//     default value: true
	//
	global_hook(id, resolve, options = {})
	{
		validate.global_hook(id, resolve)

		const resolver = (path, module) =>
		{
			// log.debug(`Global require() hook "${id}" fired`)

			// get CommonJS module source code for this require() call
			const source = resolve(path, module)
			
			// if no CommonJS module source code returned - skip this require() hook
			if (!exists(source))
			{
				return
			}
			
			// CommonJS module source code returned, 
			// so put it into a hash for a corresponding key

			const resolved_path = `${path}.${id}`
			
			// flush require() cache
			delete require.cache[resolved_path]

			// put the CommonJS module source code into the hash
			require_hacker.global_hook_resolved_modules[resolved_path] = source

			// return the path to be require()d 
			// in order to get the CommonJS module source code
			return resolved_path
		}

		if (options.precede_node_loader === false)
		{
			require_hacker.path_resolvers.push(resolver)
		}
		else
		{
			require_hacker.preceding_path_resolvers.push(resolver)
		}

		const hook = this.hook(id, path => 
		{
			const source = require_hacker.global_hook_resolved_modules[path]
			delete require_hacker.global_hook_resolved_modules[path]
			return source
		})

		const result =
		{
			unmount: () =>
			{
				// javascript arrays still have no .remove() method in the XXI-st century
				require_hacker.preceding_path_resolvers = require_hacker.preceding_path_resolvers.filter(x => x !== resolver)
				require_hacker.path_resolvers = require_hacker.path_resolvers.filter(x => x !== resolver)
				hook.unmount()
			}
		}

		return result
	},

	// installs a require() hook for the extension
	//
	// extension - a file extension to hook into require()s of
	//             (examples: 'css', 'jpg', 'js')
	//
	// resolve   - a function that takes two parameters: 
	//
	//               the path requested in the require() call 
	//               the module in which the require() call was originated
	//
	//             must return either a javascript CommonJS module source code
	//             (i.e. "module.exports = ...", etc)
	//             or it can return nothing to fall back to the original Node.js loader
	//
	hook(extension, resolve)
	{
		this.log.debug(`Hooking into *.${extension} files loading`)
		
		// validation
		validate.extension(extension)
		validate.resolve(resolve)

		// occupy file extension
		this.occupied_file_extensions.add(extension)

		// dotted extension
		const dot_extension = `.${extension}`

		// keep original extension loader
		const original_loader = Module._extensions[dot_extension]

		// display a warning in case of extension loader override
		if (original_loader)
		{
			// output a debug message in case of extension loader override,
			// not a warning, so that it doesn't scare people
			this.log.debug(`-----------------------------------------------`)
			this.log.debug(`Overriding an already existing require() hook `)
			this.log.debug(`for file extension ${dot_extension}`)
			this.log.debug(`-----------------------------------------------`)
		}

		// the list of cached modules
		const cached_modules = new Set()

		// Node.js inner API check
		/* istanbul ignore if */
		if (!Module._extensions)
		{
			throw new Error('Incompatilbe Node.js version detected: "Module._extensions" array is missing. File an issue on GitHub.')
		}

		// set new loader for this extension
		Module._extensions[dot_extension] = (module, filename) =>
		{
			this.log.debug(`require() hook fired for ${filename}`)

			// var source = fs.readFileSync(filename, 'utf8')
			const source = resolve(filename, module)

			if (!exists(source))
			{
				this.log.debug(`Fallback to original loader`)

				// this message would appear if there was no loader 
				// for the extension of the filename
				if (path.extname(filename) !== dot_extension)
				{
					this.log.info(`Trying to load "${path.basename(filename)}" as a "*${dot_extension}"`)
				}

				// load the file with the original loader
				return (original_loader || Module._extensions['.js'])(module, filename)
			}

			// add this file path to the list of cached modules
			cached_modules.add(filename)

			// Node.js inner API check
			/* istanbul ignore if */
			if (!module._compile)
			{
				throw new Error('Incompatilbe Node.js version detected: "Module.prototype._compile" function is missing. File an issue on GitHub.')
			}

			// compile javascript module from its source
			// https://github.com/nodejs/node/blob/master/lib/module.js#L379
			module._compile(source, filename)
		}

		const result = 
		{
			// uninstall the hook
			unmount: () =>
			{
				// clear require() cache for this file extension
				for (let path of cached_modules)
				{
					delete require.cache[path]
				}

				// mount the original loader for this file extension
				Module._extensions[dot_extension] = original_loader

				// free file extension
				this.occupied_file_extensions.delete(extension)
			}
		}

		return result
	},

	// returns a CommonJS modules source.
	to_javascript_module_source(anything)
	{
		// if the asset source wasn't found - return an empty CommonJS module
		if (!exists(anything))
		{
			return 'module.exports = undefined'
		}

		// if it's already a common js module source
		if (typeof anything === 'string' && is_a_module_declaration(anything))
		{
			return anything
		}

		// generate javascript module source code based on the `source` variable
		return 'module.exports = ' + serialize(anything)
	},

	// resolves a requireable `path` to a real filesystem path relative to the `module`
	// (resolves `npm link`, etc)
	resolve(path_to_resolve, module)
	{
		// Module._resolveFilename existence check is perfomed outside of this method
		try
		{
			require_hacker.global_hooks_enabled = false
			return original_resolveFilename(path_to_resolve, module)
		}
		finally
		{
			require_hacker.global_hooks_enabled = true
		}
	}
}

// validation
const validate =
{
	extension(extension)
	{
		// if (typeof extension !== 'string')
		// {
		// 	throw new Error(`Expected string extension. Got ${extension}`)
		// }

		if (path.extname(`test.${extension}`) !== `.${extension}`)
		{
			throw new Error(`Invalid file extension "${extension}"`)
		}

		// check if the file extension is already occupied
		if (require_hacker.occupied_file_extensions.has(extension))
		{
			throw new Error(`File extension "${extension}" is already occupied by require-hacker`)
		}
	},

	resolve(resolve)
	{
		if (typeof resolve !== 'function')
		{
			throw new Error(`Resolve should be a function. Got "${resolve}"`)
		}
	},

	global_hook(id, resolver)
	{
		if (!id)
		{
			throw new Error(`You must specify global hook id`)
		}

		if (path.extname(`test.${id}`) !== `.${id}`)
		{
			throw new Error(`Invalid global hook id "${id}". Expected a valid file extension.`)
		}

		// check if the file extension is already occupied
		if (require_hacker.occupied_file_extensions.has(id))
		{
			throw new Error(`File extension "${id}" is already occupied by require-hacker`)
		}

		validate.resolve(resolver)
	}
}

// Node.js inner API check
/* istanbul ignore if */
if (!Module._resolveFilename)
{
	throw new Error('Incompatilbe Node.js version detected: "Module._resolveFilename" function is missing. File an issue on GitHub.')
}

// Node.js inner API check
/* istanbul ignore if */
if (!Module._findPath)
{
	throw new Error('Incompatilbe Node.js version detected: "Module._findPath" function is missing. File an issue on GitHub.')
}

// the module in which the require() call originated
let require_caller

// instrument Module._resolveFilename
// https://github.com/nodejs/node/blob/master/lib/module.js#L322
//
// `arguments` would conflict with Babel, therefore `...parameters`
//
// const native_module = require('native_module')
const original_resolveFilename = Module._resolveFilename
Module._resolveFilename = function(...parameters)
{
	const request = parameters[0]
	const parent = parameters[1]

	// take note of the require() caller
	// (the module in which this require() call originated)
	require_caller = parent

	return original_resolveFilename.apply(this, parameters)
}

// instrument Module._findPath
// https://github.com/nodejs/node/blob/master/lib/module.js#L335-L341
//
// `arguments` would conflict with Babel, therefore `...parameters`
//
const original_findPath = Module._findPath
Module._findPath = (...parameters) =>
{
	const request = parameters[0]
	// const paths = parameters[1]

	// preceeding resolvers
	if (require_hacker.global_hooks_enabled)
	{
		for (let resolver of require_hacker.preceding_path_resolvers)
		{
			const resolved_path = resolver(request, require_caller)
			if (exists(resolved_path))
			{
				return resolved_path
			}
		}
	}

	// original Node.js loader
	const filename = original_findPath.apply(undefined, parameters)
	if (filename !== false)
	{
		return filename
	}

	// rest resolvers
	if (require_hacker.global_hooks_enabled)
	{
		for (let resolver of require_hacker.path_resolvers)
		{
			const resolved = resolver.resolve(request, require_caller)
			if (exists(resolved))
			{
				return resolved
			}
		}
	}

	return false
}

// detect if it is a CommonJS module declaration
function is_a_module_declaration(text)
{
	return text.indexOf('module.exports = ') === 0 ||
		/\s+module\.exports = .+/.test(text)
}

export default require_hacker