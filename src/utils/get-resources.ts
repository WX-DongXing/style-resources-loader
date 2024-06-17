import {getFileSource} from './node-cache';

import type {LoaderContext, StyleResource, StyleResourcesLoaderNormalizedOptions} from '../types';

import {matchFiles} from './match-files';
import {resolveImportUrl} from './resolve-import-url';

export const getResources = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {resolveUrl} = options;

    const files = await matchFiles(ctx, options);

    files.forEach(file => ctx.dependency(file));

    const resources = await Promise.all(
        files.map(async file => {
            const content = await getFileSource(file);
            const resource: StyleResource = {file, content};

            return resolveUrl ? resolveImportUrl(ctx, resource) : resource;
        }),
    );

    return resources;
};
