import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Habit = {
  id: number
  name: string
  days: number[]
  streak: number
  category: 'morning' | 'evening' | 'daily'
}

const [habits, setHabits] = useState<Habit[]>([])
const [loadingHabits, setLoadingHabits] =
  useState(true)

const [morning, setMorning] =
  useState([
    {
      id: 1,
      text: 'Wake up by 6:30am',
      done: true,
    },
    {
      id: 2,
      text: 'Drink warm lemon water',
      done: true,
    },
  ])

const [evening, setEvening] =
  useState([
    {
      id: 1,
      text: 'Tidy workspace',
      done: false,
    },
    {
      id: 2,
      text: "Review today's wins",
      done: false,
    },
  ])

const [showAdd, setShowAdd] =
  useState(false)

const [newHabit, setNewHabit] =
  useState({
    name: '',
    category:
      'daily' as Habit['category'],
  })

useEffect(() => {
  fetchHabits()
}, [])

const fetchHabits = async () => {
  setLoadingHabits(true)

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(error)
  } else {
    setHabits(data || [])
  }

  setLoadingHabits(false)
}

const toggleDay = async (
  hid: number,
  di: number
) => {
  const habit = habits.find(
    (h) => h.id === hid
  )

  if (!habit) return

  const updatedDays = habit.days.map(
    (d, i) =>
      i === di ? (d ? 0 : 1) : d
  )

  const updatedStreak =
    updatedDays.filter(Boolean).length

  const { error } = await supabase
    .from('habits')
    .update({
      days: updatedDays,
      streak: updatedStreak,
    })
    .eq('id', hid)

  if (error) {
    console.error(error)
    return
  }

  setHabits((hs) =>
    hs.map((h) =>
      h.id === hid
        ? {
            ...h,
            days: updatedDays,
            streak: updatedStreak,
          }
        : h
    )
  )
}

const addHabit = async () => {
  if (!newHabit.name.trim()) return

  const { data, error } = await supabase
    .from('habits')
    .insert([
      {
        name: newHabit.name,
        days: [
          0, 0, 0, 0, 0, 0, 0,
        ],
        streak: 0,
        category:
          newHabit.category,
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return
  }

  if (data) {
    setHabits((hs) => [
      ...data,
      ...hs,
    ])
  }

  setNewHabit({
    name: '',
    category: 'daily',
  })

  setShowAdd(false)
}

const totalDots = habits.reduce(
  (a, h) => a + h.days.length,
  0
)

const filledDots = habits.reduce(
  (a, h) =>
    a + h.days.filter(Boolean).length,
  0
)

const weekPct = Math.round(
  (filledDots / totalDots) * 100
)

const todayIdx =
  new Date().getDay() === 0
    ? 6
    : new Date().getDay() - 1

const todayDone = habits.filter(
  (h) => h.days[todayIdx]
).length

