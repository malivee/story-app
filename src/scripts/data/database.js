import { openDB } from 'idb';

const DB_NAME = 'storypost-db';
const STORE_NAME = 'loved-stories';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const database = {
  async love(story) {
     const lovedStory = {
    ...story,
    isLoved: true,
  };
    return (await dbPromise).put(STORE_NAME, lovedStory);
  },
  async unlove(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async isLoved(id) {
    return Boolean(await (await dbPromise).get(STORE_NAME, id));
  },
  async getData() {
    return (await dbPromise).getAll(STORE_NAME);
  },
};

export default database;
