import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type SkinStep = {
  id: number
  text: string
  done: boolean
  am: boolean
}

type WellnessItem = {
  id: number
  text: string
  done: boolean
}

type SleepEntry = {
  id: number
  date: string
  hours: number
  quality: number
}

const [skincare, setSkincare] =
  useState<SkinStep[]>([])

const [wellness, setWellness] =
  useState<WellnessItem[]>([])

const [sleep, setSleep] =
  useState<SleepEntry[]>([])

const [loadingSelfCare, setLoadingSelfCare] =
  useState(true)

const [water, setWater] = useState(5)

const [showAddSleep, setShowAddSleep] =
  useState(false)

const [
  showAddWellness,
  setShowAddWellness,
] = useState(false)

const [newSleep, setNewSleep] =
  useState({
    date: '',
    hours: '',
    quality: '3',
  })

const [newWellness, setNewWellness] =
  useState('')

useEffect(() => {
  fetchSelfCare()
}, [])

const fetchSelfCare = async () => {
  setLoadingSelfCare(true)

  const [
    skincareRes,
    wellnessRes,
    sleepRes,
  ] = await Promise.all([
    supabase
      .from('skincare')
      .select('*')
      .order('created_at', {
        ascending: false,
      }),

    supabase
      .from('wellness')
      .select('*')
      .order('created_at', {
        ascending: false,
      }),

    supabase
      .from('sleep_entries')
      .select('*')
      .order('date', {
        ascending: false,
      }),
  ])

  if (skincareRes.error)
    console.error(skincareRes.error)

  if (wellnessRes.error)
    console.error(wellnessRes.error)

  if (sleepRes.error)
    console.error(sleepRes.error)

  setSkincare(
    skincareRes.data || []
  )

  setWellness(
    wellnessRes.data || []
  )

  setSleep(
    sleepRes.data || []
  )

  setLoadingSelfCare(false)
}

const toggleSkinStep = async (
  id: number
) => {
  const current = skincare.find(
    (s) => s.id === id
  )

  if (!current) return

  const { error } = await supabase
    .from('skincare')
    .update({
      done: !current.done,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  setSkincare((sk) =>
    sk.map((x) =>
      x.id === id
        ? {
            ...x,
            done: !x.done,
          }
        : x
    )
  )
}

const toggleWellness = async (
  id: number
) => {
  const current = wellness.find(
    (w) => w.id === id
  )

  if (!current) return

  const { error } = await supabase
    .from('wellness')
    .update({
      done: !current.done,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  setWellness((ws) =>
    ws.map((x) =>
      x.id === id
        ? {
            ...x,
            done: !x.done,
          }
        : x
    )
  )
}

const addSleepEntry = async () => {
  if (
    !newSleep.date ||
    !newSleep.hours
  )
    return

  const { data, error } =
    await supabase
      .from('sleep_entries')
      .insert([
        {
          date: newSleep.date,
          hours: Number(
            newSleep.hours
          ),
          quality: Number(
            newSleep.quality
          ),
        },
      ])
      .select()

  if (error) {
    console.error(error)
    return
  }

  if (data) {
    setSleep((s) => [
      ...data,
      ...s,
    ])
  }

  setNewSleep({
    date: '',
    hours: '',
    quality: '3',
  })

  setShowAddSleep(false)
}

const addWellnessItem =
  async () => {
    if (!newWellness.trim())
      return

    const { data, error } =
      await supabase
        .from('wellness')
        .insert([
          {
            text:
              newWellness.trim(),
            done: false,
          },
        ])
        .select()

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setWellness((w) => [
        ...data,
        ...w,
      ])
    }

    setNewWellness('')
    setShowAddWellness(false)
  }

const amDone = skincare.filter(
  (s) => s.am && s.done
).length

const amTotal = skincare.filter(
  (s) => s.am
).length

const pmDone = skincare.filter(
  (s) => !s.am && s.done
).length

const pmTotal = skincare.filter(
  (s) => !s.am
).length

const wellnessDone =
  wellness.filter((w) => w.done)
    .length

const avgSleep =
  sleep.length > 0
    ? sleep.reduce(
        (a, b) => a + b.hours,
        0
      ) / sleep.length
    : 0

const avgQuality =
  sleep.length > 0
    ? sleep.reduce(
        (a, b) =>
          a + b.quality,
        0
      ) / sleep.length
    : 0

const QUALITY_EMOJI = [
  '',
  '😩',
  '😔',
  '😐',
  '😊',
  '🤩',
]