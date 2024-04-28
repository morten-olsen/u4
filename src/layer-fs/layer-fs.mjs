import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const createLayerFs = () => {
  let changes = new Map();

  return {
    getChanges: () => changes,
    apply: async (target = '/') => {
      for (const [path, change] of changes.entries()) {
        const targetPath = resolve(target, path);
        switch (change.type) {
          case 'delete':
            await fs.rm(targetPath, { force: true });
            break;
          case 'set':
            await fs.mkdir(dirname(targetPath), { recursive: true });
            await fs.writeFile(targetPath, change.data);
            break;
        }
      }
    },
    writeFile: async (path, data) => {
      changes.set(path, {
        type: 'set',
        data,
      });
    },
    rm: async (path) => {
      changes.set(path, {
        type: 'delete',
      });
    },
    readFile: async (path) => {
      if (!changes.has(path)) {
        return fs.readFile(path);
      }
      if (changes.get(path).type === 'set') {
        return changes.get(path).data;
      }
      return undefined;
    },
    readdir: async (path) => {
      let actualFiles = await fs.readdir(path);
      actualFiles = actualFiles.filter(file => !changes.has(file));
      const changes = changes
        .keys()
        .filter(file => dirname(file) === path && file.type !== 'delete');
    },
    existsSync: (path) => {
      if (changes.has(path) && changes.get(path).type === 'delete') {
        return false;
      }
      if (changes.has(path).type === 'set') {
        return true;
      }
      return existsSync(path);
    },
  }
}

/**
 * @typedef {ReturnType<typeof createLayerFs>} LayerFs
 */

export { createLayerFs };