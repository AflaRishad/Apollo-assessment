import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { Project, ProjectStatus, Task, TaskStatus } from '../types'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

  async function load() {
    try {
      const data = await api.get<Project>(`/projects/${id}`)
      setProject(data)
      setError(null)
    } catch (err) {
      setError('Could not load this project.')
    }
  }

  useEffect(() => {
    load()
    
  }, [id])

  async function toggleTask(task: Task) {
    if (!project) return
    const next: TaskStatus =
      task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done'
    await api.patch(`/projects/${project.id}/tasks/${task.id}`, { status: next })
    load()
  }

  async function deleteTask(taskId: number) {
    if (!project) return
    await api.del(`/projects/${project.id}/tasks/${taskId}`)
    load()
  }

  async function updateStatus(status: ProjectStatus) {
    if (!project) return
    await api.patch(`/projects/${project.id}`, { status })
    load()
  }

  async function deleteProject() {
    if (!project) return
    if (!confirm('Delete this project? This cannot be undone.')) return
    await api.del(`/projects/${project.id}`)
    navigate('/')
  }

  if (error) return <div className="pd-page"><p className="form-error">{error}</p></div>
  if (!project) return <div className="pd-page"><p className="empty-note">Loading…</p></div>

  return (
    <div className="pd-page">
      <div className="pd-card">
        <Link className="pd-back" to="/">
          <span className="pd-check" /> Back to dashboard
        </Link>

        <div className="pd-header">
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          <div className="pd-header-actions">
            <select
              value={project.status}
              onChange={(e) => updateStatus(e.target.value as ProjectStatus)}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn-ghost" onClick={deleteProject}>
              Delete Project
            </button>
          </div>
        </div>

        <div className="pd-tabs">
          <button className="pd-tab active">Tasks</button>
          <button className="pd-tab pd-tab-action" onClick={() => setShowAddTask(true)}>
            <span className="pd-check" /> Add task
          </button>
        </div>

        <div className="pd-tasklist">
          {project.tasks.length === 0 && <p className="empty-note">No tasks yet.</p>}
          {project.tasks.map((task) => (
            <div className={`pd-task ${task.status === 'done' ? 'done' : ''}`} key={task.id}>
              <div className="pd-task-left" onClick={() => toggleTask(task)} style={{ cursor: 'pointer' }}>
                <span className={`pd-check ${task.status === 'done' ? 'done' : ''}`} />
                <span className="pd-task-title">{task.title}</span>
              </div>
              <div className="pd-task-right">
                <span>{task.due_date ? `Due ${task.due_date}` : 'No due date'}</span>
                {task.status !== 'done' && (
                  <span className={`pd-status ${task.status === 'in-progress' ? 'progress' : 'todo'}`}>
                    {task.status === 'in-progress' ? 'In progress' : 'To do'}
                  </span>
                )}
                <button
                  className="btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTask(task.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddTask && (
        <AddTaskModal
          projectId={project.id}
          onClose={() => setShowAddTask(false)}
          onCreated={() => {
            setShowAddTask(false)
            load()
          }}
        />
      )}
    </div>
  )
}

function AddTaskModal({
  projectId,
  onClose,
  onCreated,
}: {
  projectId: number
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        status: 'todo',
        due_date: dueDate || null,
      })
      onCreated()
    } catch (err) {
      setError('Could not create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Add Task</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label>Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-solid" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
