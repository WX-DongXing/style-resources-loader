import path from 'path';
import {glob} from 'glob';
import type {LoaderContext, StyleResourcesLoaderNormalizedOptions} from '../types';

import {isStyleFile} from './type-guards';

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
const isLegacyWebpack = (ctx: any): ctx is {options: {context: string}} => !!ctx.options;

const getRootContext = (ctx: LoaderContext) => {
    /* istanbul ignore if: will be deprecated soon */
    if (isLegacyWebpack(ctx)) {
        return ctx.options.context;
    }

    return ctx.rootContext;
};

export const matchFiles = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {patterns, globOptions = {}} = options;

    const formatPattern = patterns.map(pattern => {
        const rootContext = getRootContext(ctx);

        return path.isAbsolute(pattern) ? pattern : path.resolve(rootContext, pattern);
    });
    const files = await glob(formatPattern, {...globOptions, withFileTypes: false});

    /**
     * Glob always returns Unix-style file paths which would have cache invalidation problems on Windows.
     * Use `path.resolve()` to convert Unix-style file paths to system-compatible ones.
     *
     * @see {@link https://github.com/yenshih/style-resources-loader/issues/17\}
     */
    return files.filter(isStyleFile).map(file => path.resolve(file));
};
