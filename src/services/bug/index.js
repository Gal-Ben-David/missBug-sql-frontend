const { DEV, VITE_LOCAL } = import.meta.env

import { bugService as local } from './bug.service.local'
import { bugService as remote } from './bug.service.remote'

function getEmptyBug() {
    return {
        // vendor: makeId(),
        // speed: getRandomIntInclusive(80, 240),
        // msgs: [],
    }
}

function getDefaultFilter() {
    return {
        // txt: '',
        // minSpeed: '',
        // sortField: '',
        // sortDir: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const bugService = { getEmptyBug, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.bugService = bugService
