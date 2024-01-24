// https://vitejs.dev/guide/api-plugin.html#universal-hooks=
import {type Plugin} from 'vite';
import fs from 'fs/promises';
import path from 'path';

const writeToDisk: () => Plugin = () => ({
    name: 'write-to-disk',
    apply: 'serve',
    configResolved: async config => {
        config.logger.info('Writing contents of public folder to disk', {timestamp: true});
        await fs.cp(config.publicDir, config.build.outDir, {recursive: true});
    },
    handleHotUpdate: async ({file, server: {config}, read}) => {
        if (path.dirname(file).startsWith(config.publicDir)) {
            const destPath = path.join(config.build.outDir, path.relative(config.publicDir, file));
            config.logger.info(`Writing contents of ${file} to disk`, {timestamp: true});
            await fs.access(path.dirname(destPath)).catch(() => fs.mkdir(path.dirname(destPath), {recursive: true}));
            await fs.writeFile(destPath, await read());
        }
    },
});

export default writeToDisk;