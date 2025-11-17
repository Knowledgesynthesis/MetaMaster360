import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface MetaMaster360DB extends DBSchema {
  progress: {
    key: string
    value: {
      moduleId: string
      completed: boolean
      score?: number
      lastAccessed: number
    }
  }
  userWork: {
    key: string
    value: {
      id: string
      type: string
      data: unknown
      timestamp: number
    }
  }
  settings: {
    key: string
    value: unknown
  }
}

let dbInstance: IDBPDatabase<MetaMaster360DB> | null = null

export async function getDB() {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<MetaMaster360DB>('metamaster360', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'moduleId' })
      }
      if (!db.objectStoreNames.contains('userWork')) {
        db.createObjectStore('userWork', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    },
  })

  return dbInstance
}

export async function saveProgress(moduleId: string, completed: boolean, score?: number) {
  const db = await getDB()
  await db.put('progress', {
    moduleId,
    completed,
    score,
    lastAccessed: Date.now()
  })
}

export async function getProgress(moduleId: string) {
  const db = await getDB()
  return await db.get('progress', moduleId)
}

export async function getAllProgress() {
  const db = await getDB()
  return await db.getAll('progress')
}

export async function saveUserWork(id: string, type: string, data: unknown) {
  const db = await getDB()
  await db.put('userWork', {
    id,
    type,
    data,
    timestamp: Date.now()
  })
}

export async function getUserWork(id: string) {
  const db = await getDB()
  return await db.get('userWork', id)
}

export async function getAllUserWork() {
  const db = await getDB()
  return await db.getAll('userWork')
}

export async function saveSetting(key: string, value: unknown) {
  const db = await getDB()
  await db.put('settings', value, key)
}

export async function getSetting(key: string) {
  const db = await getDB()
  return await db.get('settings', key)
}
