import { Dropdown } from '../models'


export const ROLES_OPTIONS: Dropdown[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'USER', label: 'Usuario' },
]

export const FULL_ROLES_OPTIONS: Dropdown[] = [
    ...ROLES_OPTIONS,
    { value: 'SUPER', label: 'Superuser' }
]

export const LANG_LEVEL_OPTIONS: Dropdown[] = [
    { value: 'A0', label: 'A0' },
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'Nativo' }
]
