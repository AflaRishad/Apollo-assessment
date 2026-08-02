export interface User {
  id: number
  name: string
  email: string
}
export type ProjectStatus = 'planned' | 'active' | 'completed'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export interface Task {
  id: number
  project_id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
  updated_at: string
}
export interface Project {
  id: number
  user_id: number
  name: string
  description: string | null
  status: ProjectStatus
  tasks: Task[]
  created_at: string
  updated_at: string
}
export interface AuthResponse {
  user: User
  token: string
}
