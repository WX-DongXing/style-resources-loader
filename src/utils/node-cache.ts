import NodeCache from 'node-cache';
import {stat, readFile} from 'node:fs/promises';

export interface CacheFile {
    time: string;
    source: string;
}

export const cache = new NodeCache();

export const getFileSource = async (file: string): Promise<string> => {
    const {birthtime, atime, mtime, ctime} = await stat(file);
    const time = `${birthtime.toString()}_${atime.toString()}_${mtime.toString()}_${ctime.toString()}`;

    const cacheFile = cache.get<CacheFile>(file);

    const needCache = cacheFile?.time !== time;

    if (needCache || !cache.get<CacheFile>(file)) {
        const source = await readFile(file, 'utf-8');

        cache.set<CacheFile>(file, {time, source});

        return source;
    }

    return cacheFile.source;
};
