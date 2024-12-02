import { httpService } from '../http.service'

export const bugService = {
    query,
    getById,
    save,
    remove,
    addBugMsg,
    getDefaultFilter,
    getFilterFromParams,
    getEmptyBug,
    getDefaultSort,
    getSortFromParams,
    getPDF
}

async function query(filterBy = {}) {
    return httpService.get(`bug`, filterBy)
}

function getById(bugId) {
    return httpService.get(`bug/${bugId}`)
}

async function remove(bugId) {
    return httpService.delete(`bug/${bugId}`)
}
async function save(bug) {
    var savedBug
    if (bug._id) {
        savedBug = await httpService.put(`bug/${bug._id}`, bug)
    } else {
        savedBug = await httpService.post('bug', bug)
    }
    return savedBug
}

async function addBugMsg(bugId, txt) {
    const savedMsg = await httpService.post(`bug/${bugId}/msg`, { txt })
    return savedMsg
}

function getEmptyBug(title = '', severity = 0, label = []) {
    return { title, severity, label }
}

function getDefaultFilter() {
    return { title: '', severity: 0, label: '', pageIdx: 0 }
}

function getDefaultSort() {
    return { selector: '', dir: 1 }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        title: searchParams.get('title') || defaultFilter.title,
        severity: searchParams.get('severity') || defaultFilter.severity,
        label: searchParams.get('label') || defaultFilter.label,
        pageIdx: +searchParams.get('pageIdx') || defaultFilter.pageIdx
    }
}

function getSortFromParams(searchParams = {}) {
    const defaultSort = getDefaultSort()
    return {
        selector: searchParams.get('selector') || defaultSort.selector,
        dir: +searchParams.get('dir') || defaultSort.dir
    }
}

function getPDF() {
    return axios.get(BASE_URL + 'downloadPDF')
        .then(res => res.data)
        .then(() => {
            console.log('PDF!')
        })
}

function _setNextPrevBugId(bug) {
    return query().then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}