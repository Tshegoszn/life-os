'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Plus,
  X,
  Lightbulb,
  FileText,
  TrendingUp,
} from 'lucide-react'

import {
  Card,
  Button,
  Badge,
  SectionHeader,
  PageWrapper,
  Input,
  Select,
} from '@/components/ui'

import { supabase } from '@/lib/supabase'

type Post = {
  id: number
  platform: 'TikTok' | 'Instagram' | 'Both'
  type: string
  caption: string
  date: string
  status: 'idea' | 'draft' | 'ready' | 'posted'
  tags: string[]
}

const PLATFORMS = [
  'TikTok',
  'Instagram',
  'Both',
]

const TYPES = [
  'Reel',
  'Carousel',
  'Story',
  'Static post',
  'TikTok video',
  'Live',
]

const STATUS_COLOR: Record<
  string,
  'gray' | 'yellow' | 'lav' | 'green'
> = {
  idea: 'gray',
  draft: 'yellow',
  ready: 'lav',
  posted: 'green',
}

const PLATFORM_BG: Record<string, string> = {
  TikTok: '#FBEAF0',
  Instagram: '#EEE8F5',
  Both: '#EAF3DE',
}

const PLATFORM_COLOR: Record<string, string> = {
  TikTok: '#EA4C89',
  Instagram: '#7B5EA7',
  Both: '#27500A',
}

export default function ContentPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] =
    useState(true)

  const [activeTab, setActiveTab] =
    useState('calendar')

  const [showAdd, setShowAdd] =
    useState(false)

  const [newPost, setNewPost] =
    useState<Omit<Post, 'id'>>({
      platform: 'Instagram',
      type: 'Reel',
      caption: '',
      date: '',
      status: 'idea',
      tags: [],
    })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoadingPosts(true)

    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error)
    } else {
      setPosts(data || [])
    }

    setLoadingPosts(false)
  }

  const addPost = async () => {
    if (!newPost.caption.trim()) return

    const { data, error } = await supabase
      .from('content_posts')
      .insert([
        {
          platform: newPost.platform,
          type: newPost.type,
          caption: newPost.caption,
          date: newPost.date,
          status: newPost.status,
          tags: newPost.tags,
        },
      ])
      .select()

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setPosts((ps) => [...data, ...ps])
    }

    setNewPost({
      platform: 'Instagram',
      type: 'Reel',
      caption: '',
      date: '',
      status: 'idea',
      tags: [],
    })

    setShowAdd(false)
  }

  const updateStatus = async (
    id: number
  ) => {
    const order: Post['status'][] = [
      'idea',
      'draft',
      'ready',
      'posted',
    ]

    const current = posts.find(
      (p) => p.id === id
    )

    if (!current) return

    const newStatus =
      order[
        (order.indexOf(current.status) + 1) %
          order.length
      ]

    const { error } = await supabase
      .from('content_posts')
      .update({
        status: newStatus,
      })
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              status: newStatus,
            }
          : p
      )
    )
  }

  const deletePost = async (
    id: number
  ) => {
    const { error } = await supabase
      .from('content_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    setPosts((ps) =>
      ps.filter((p) => p.id !== id)
    )
  }

  return (
    <PageWrapper
      title="Content Planner"
      subtitle="Create content that converts and inspires 📱"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: 'Posted this month',
            value: String(
              posts.filter(
                (p) => p.status === 'posted'
              ).length
            ),
          },
          {
            label: 'Ready to post',
            value: String(
              posts.filter(
                (p) => p.status === 'ready'
              ).length
            ),
          },
          {
            label: 'In draft',
            value: String(
              posts.filter(
                (p) => p.status === 'draft'
              ).length
            ),
          },
          {
            label: 'Total posts',
            value: String(posts.length),
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.05,
            }}
          >
            <Card>
              <div
                className="text-[11px] mb-1"
                style={{
                  color: '#C73E74',
                }}
              >
                {s.label}
              </div>

              <div className="text-xl font-semibold">
                {s.value}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 border-b"
        style={{
          borderColor: '#F5C8E2',
        }}
      >
        <div className="flex">
          <button
            onClick={() =>
              setActiveTab('calendar')
            }
            className="px-4 py-2 text-xs border-b-2"
            style={{
              borderBottomColor:
                activeTab === 'calendar'
                  ? '#EA4C89'
                  : 'transparent',
              color:
                activeTab === 'calendar'
                  ? '#EA4C89'
                  : '#888',
            }}
          >
            Calendar
          </button>
        </div>

        <Button
          onClick={() =>
            setShowAdd((v) => !v)
          }
        >
          <Plus size={13} />
          New post
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden mb-4"
          >
            <Card>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Select
                  label="Platform"
                  value={newPost.platform}
                  onChange={(v) =>
                    setNewPost((x) => ({
                      ...x,
                      platform:
                        v as Post['platform'],
                    }))
                  }
                  options={PLATFORMS.map(
                    (p) => ({
                      value: p,
                      label: p,
                    })
                  )}
                />

                <Select
                  label="Type"
                  value={newPost.type}
                  onChange={(v) =>
                    setNewPost((x) => ({
                      ...x,
                      type: v,
                    }))
                  }
                  options={TYPES.map((t) => ({
                    value: t,
                    label: t,
                  }))}
                />

                <Input
                  label="Date"
                  value={newPost.date}
                  onChange={(v) =>
                    setNewPost((x) => ({
                      ...x,
                      date: v,
                    }))
                  }
                  type="date"
                />

                <Select
                  label="Status"
                  value={newPost.status}
                  onChange={(v) =>
                    setNewPost((x) => ({
                      ...x,
                      status:
                        v as Post['status'],
                    }))
                  }
                  options={[
                    {
                      value: 'idea',
                      label: 'Idea',
                    },
                    {
                      value: 'draft',
                      label: 'Draft',
                    },
                    {
                      value: 'ready',
                      label: 'Ready',
                    },
                    {
                      value: 'posted',
                      label: 'Posted',
                    },
                  ]}
                />
              </div>

              <textarea
                value={newPost.caption}
                onChange={(e) =>
                  setNewPost((x) => ({
                    ...x,
                    caption:
                      e.target.value,
                  }))
                }
                placeholder="Write your caption..."
                rows={4}
                className="w-full border rounded-2xl px-3 py-2 text-xs mb-3"
                style={{
                  borderColor: '#F5C8E2',
                  background: '#FFF7FB',
                }}
              />

              <Button onClick={addPost}>
                Save post
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {loadingPosts ? (
          <div
            className="text-sm p-4 rounded-2xl"
            style={{
              background: '#FFF7FB',
              color: '#888',
              border:
                '0.5px solid #F5C8E2',
            }}
          >
            Loading content...
          </div>
        ) : (
          posts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.04,
              }}
            >
              <Card hover>
                <div className="flex items-start gap-3">
                  <div
                    className="w-1 self-stretch rounded-full"
                    style={{
                      background:
                        PLATFORM_COLOR[
                          p.platform
                        ],
                    }}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            PLATFORM_BG[
                              p.platform
                            ],
                          color:
                            PLATFORM_COLOR[
                              p.platform
                            ],
                        }}
                      >
                        {p.platform}
                      </span>

                      <Badge color="gray">
                        {p.type}
                      </Badge>

                      <span
                        className="text-[10px]"
                        style={{
                          color: '#888',
                        }}
                      >
                        📅 {p.date}
                      </span>
                    </div>

                    <p
                      className="text-xs mb-2"
                      style={{
                        color: '#555',
                      }}
                    >
                      {p.caption}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px]"
                          style={{
                            color:
                              '#D8C1E8',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() =>
                        updateStatus(
                          p.id
                        )
                      }
                    >
                      <Badge
                        color={
                          STATUS_COLOR[
                            p.status
                          ]
                        }
                      >
                        {p.status}
                      </Badge>
                    </button>

                    <button
                      onClick={() =>
                        deletePost(
                          p.id
                        )
                      }
                    >
                      <X
                        size={12}
                        style={{
                          color:
                            '#C73E74',
                        }}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </PageWrapper>
  )
}