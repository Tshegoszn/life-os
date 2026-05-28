import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const [tasks, setTasks] = useState<
  {
    id: number
    text: string
    done: boolean
  }[]
>([])

const [loadingTasks, setLoadingTasks] =
  useState(true)

const [newTask, setNewTask] =
  useState('')

const [mood, setMood] = useState(3)
const [water, setWater] = useState(5)
const [aiInput, setAiInput] =
  useState('')

useEffect(() => {
  fetchTasks()
}, [])

const fetchTasks = async () => {
  setLoadingTasks(true)

  const { data, error } = await supabase
    .from('dashboard_tasks')
    .select('*')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(error)
  } else {
    setTasks(data || [])
  }

  setLoadingTasks(false)
}

const toggleTask = async (
  id: number
) => {
  const current = tasks.find(
    (t) => t.id === id
  )

  if (!current) return

  const { error } = await supabase
    .from('dashboard_tasks')
    .update({
      done: !current.done,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  setTasks((t) =>
    t.map((x) =>
      x.id === id
        ? {
            ...x,
            done: !x.done,
          }
        : x
    )
  )
}

const addTask = async () => {
  if (!newTask.trim()) return

  const { data, error } = await supabase
    .from('dashboard_tasks')
    .insert([
      {
        text: newTask.trim(),
        done: false,
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return
  }

  if (data) {
    setTasks((t) => [...data, ...t])
  }

  setNewTask('')
}

const doneTasks =
  tasks.filter((t) => t.done).length