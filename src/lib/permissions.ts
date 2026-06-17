import type { Role } from './types'

type Permission =
  | 'manage_members'
  | 'manage_roles'
  | 'validate_annonces'
  | 'manage_votes'
  | 'manage_tresorerie'
  | 'manage_communications'
  | 'manage_secretariat'
  | 'view_finances'
  | 'create_annonces'
  | 'comment_annonces'
  | 'create_suggestions'
  | 'participate_votes'
  | 'view_documents'
  | 'manage_documents'
  | 'manage_evenements'
  | 'manage_galerie'

const rolePermissions: Record<Role, Permission[]> = {
  president: [
    'manage_members', 'manage_roles', 'validate_annonces', 'manage_votes',
    'manage_tresorerie', 'manage_communications', 'manage_secretariat',
    'view_finances', 'create_annonces', 'comment_annonces', 'create_suggestions',
    'participate_votes', 'view_documents', 'manage_documents', 'manage_evenements',
    'manage_galerie',
  ],
  secretaire_general: [
    'manage_secretariat', 'manage_documents', 'view_documents', 'view_finances',
    'create_annonces', 'comment_annonces', 'create_suggestions', 'participate_votes',
    'manage_evenements', 'manage_galerie',
  ],
  tresorier: [
    'manage_tresorerie', 'view_finances', 'view_documents',
    'create_annonces', 'comment_annonces', 'create_suggestions', 'participate_votes',
    'manage_evenements', 'manage_galerie',
  ],
  communicateur: [
    'manage_communications', 'create_annonces', 'comment_annonces',
    'create_suggestions', 'participate_votes', 'view_documents',
    'manage_evenements', 'manage_galerie',
  ],
  membre: [
    'comment_annonces', 'create_suggestions', 'participate_votes',
    'view_documents',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? []
}
