import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import type { Project, ProjectStatus, Task } from '../types'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function projectBadge(status: ProjectStatus) {
  switch (status) {
    case 'completed':
      return { label: 'Completed', className: 'ontrack' }
    case 'active':
      return { label: 'Active', className: 'progress' }
    default:
      return { label: 'Planned', className: 'behind' }
  }
}

function taskBadge(task: Task) {
  if (task.status === 'done') return { label: 'Done', className: 'ontrack' }
  if (task.status === 'in-progress') return { label: 'In Progress', className: 'progress' }
  if (task.due_date && new Date(task.due_date) < new Date()) {
    return { label: 'Urgent', className: 'urgent' }
  }
  return { label: 'To Do', className: 'behind' }
}

function progressPct(tasks: Task[]) {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)

  async function loadProjects() {
    setLoading(true)
    try {
      const data = await api.get<Project[]>('/projects')
      setProjects(data)
      setError(null)
    } catch (err) {
      setError('Could not load projects. Is the Laravel API running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const allTasks = projects
    .flatMap((p) => p.tasks.map((t) => ({ ...t, projectName: p.name })))
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
    .slice(0, 4)

  return (
    <div className="dash-wrap">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-dot" /> Apollo
        </div>
        <div className="nav-item active">Dashboard</div>
        <div className="section-label">Settings</div>
        <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
          Log out
        </div>
        <div className="sidebar-footer">
          <div className="avatar-sm">{user ? initials(user.name) : '?'}</div>
          <div>
            <div className="name">{user?.name}</div>
            <div className="mail">{user?.email}</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="main-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <div className="header-actions">
            <button className="btn-solid" onClick={() => setShowNewProject(true)}>
              + New Project
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="section-title">Recent Tasks</div>
        {allTasks.length === 0 && !loading ? (
          <p className="empty-note">No tasks yet — add a project and a task to get started.</p>
        ) : (
          <div className="task-grid">
            {allTasks.map((task) => {
              const badge = taskBadge(task)
              return (
                <div className="task-card" key={task.id}>
                  <div className="top-row">
                    <strong>{task.title}</strong>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                  </div>
                  <div className="meta">
                    <span>{task.projectName}</span>
                    <span>{task.due_date ? `Due ${task.due_date}` : 'No due date'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="section-title">Active Projects</div>
        {loading ? (
          <p className="empty-note">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="empty-note">You don't have any projects yet.</p>
        ) : (
          <div className="proj-grid">
            {projects.map((project) => {
              const badge = projectBadge(project.status)
              const pct = progressPct(project.tasks)
              return (
                <Link className="proj-card" to={`/projects/${project.id}`} key={project.id}>
                  <div className="title-row">
                    <strong>{project.name}</strong>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                  </div>
                  <p className="desc">{project.description}</p>
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="proj-footer">
                    <span>{project.tasks.length} tasks</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onCreated={() => {
            setShowNewProject(false)
            loadProjects()
          }}
        />
      )}
    </div>
  )
}

function NewProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('planned')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/projects', { name, description, status })
      onCreated()
    } catch (err) {
      setError('Could not create project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>New Project</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-solid" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
