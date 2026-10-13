import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const STORAGE_KEY = 'ipes_data'

const emptyData = {
  receitas: [],
  despesas: [],
  parcelas: [],
  clientes: [],
  lotes: [],
}

export function DataProvider({ children }) {
  const [data, setData] = useState(emptyData)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setData(JSON.parse(stored)) } catch { setData(emptyData) }
    }
  }, [])

  const save = (newData) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  const add = (collection, item) => {
    const newData = {
      ...data,
      [collection]: [{ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...data[collection]],
    }
    save(newData)
  }

  const update = (collection, id, patch) => {
    const newData = {
      ...data,
      [collection]: data[collection].map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }
    save(newData)
  }

  const remove = (collection, id) => {
    const newData = {
      ...data,
      [collection]: data[collection].filter((r) => r.id !== id),
    }
    save(newData)
  }

  return (
    <DataContext.Provider value={{ ...data, add, update, remove, setData: save }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
