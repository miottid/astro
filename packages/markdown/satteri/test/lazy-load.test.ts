import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { describe, it } from 'node:test';

describe('satteri lazy loading', () => {
	// `satteri` throws at import time on platforms without a native binding (#18446).
	it('does not import `satteri` when the package entry is loaded', () => {
		const entry = new URL('../dist/index.js', import.meta.url).href;
		const script = `
			import { registerHooks } from 'node:module';
			registerHooks({
				resolve(specifier, context, next) {
					if (specifier === 'satteri') throw new Error('satteri was imported');
					return next(specifier, context);
				},
			});
			const { satteri } = await import(${JSON.stringify(entry)});
			satteri();
		`;
		assert.doesNotThrow(() =>
			execFileSync(process.execPath, ['--input-type=module', '-e', script], { stdio: 'pipe' }),
		);
	});
});
