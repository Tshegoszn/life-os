import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Goal = {
  id: number
  name: string
  category: string
  target: number
  current: number
  deadline: string
  milestones: { text: string; done: boolean }[]
}

const [goals, setGoals] = useState<Goal[]>([])
const [loadingGoals, setLoadingGoals] =
  useState(true)

const [showAdd, setShowAdd] =
  useState(false)

const [expandedId, setExpandedId] =
  useState<number | null>(null)

const [newGoal, setNewGoal] =
  useState({
    name: '',
    category: 'Business',
    target: '',
    current: '',
    deadline: '',
  })

useEffect(() => {
  fetchGoals()
}, [])

const fetchGoals = async () => {
  setLoadingGoals(true)

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(error)
  } else {
    setGoals(data || [])
  }

  setLoadingGoals(false)
}

const addGoal = async () => {
  if (!newGoal.name.trim()) return

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        name: newGoal.name,
        category: newGoal.category,
        target:
          Number(newGoal.target) || 100,
        current:
          Number(newGoal.current) || 0,
        deadline:
          newGoal.deadline ||
          '2026-12-31',
        milestones: [],
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return
  }

  if (data) {
    setGoals((gs) => [...data, ...gs])
  }

  setNewGoal({
    name: '',
    category: 'Business',
    target: '',
    current: '',
    deadline: '',
  })

  setShowAdd(false)
}

const toggleMilestone = async (
  gid: number,
  mi: number
) => {
  const goal = goals.find(
    (g) => g.id === gid
  )

  if (!goal) return

  const updatedMilestones =
    goal.milestones.map((m, i) =>
      i === mi
        ? {
            ...m,
            done: !m.done,
          }
        : m
    )

  const { error } = await supabase
    .from('goals')
    .update({
      milestones: updatedMilestones,
    })
    .eq('id', gid)

  if (error) {
    console.error(error)
    return
  }

  setGoals((gs) =>
    gs.map((g) =>
      g.id === gid
        ? {
            ...g,
            milestones:
              updatedMilestones,
          }
        : g
    )
  )
}

const updateProgress = async (
  id: number,
  val: number
) => {
  const goal = goals.find(
    (g) => g.id === id
  )

  if (!goal) return

  const updatedCurrent = Math.min(
    val,
    goal.target
  )

  const { error } = await supabase
    .from('goals')
    .update({
      current: updatedCurrent,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  setGoals((gs) =>
    gs.map((g) =>
      g.id === id
        ? {
            ...g,
            current: updatedCurrent,
          }
        : g
    )
  )
}

const deleteGoal = async (
  id: number
) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  setGoals((gs) =>
    gs.filter((g) => g.id !== id)
  )
}