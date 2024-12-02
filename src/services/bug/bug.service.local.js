
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
// import { userService } from '../user'
import { userService } from '../user.service.js'

const STORAGE_KEY = 'bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    addBugMsg
}
window.cs = bugService


async function query(filterBy = { txt: '', price: 0 }) {
    var bugs = await storageService.query(STORAGE_KEY)
    const { txt, minSpeed, maxPrice, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        bugs = bugs.filter(bug => regex.test(bug.vendor) || regex.test(bug.description))
    }
    if (minSpeed) {
        bugs = bugs.filter(bug => bug.speed >= minSpeed)
    }
    if (sortField === 'vendor' || sortField === 'owner') {
        bugs.sort((bug1, bug2) =>
            bug1[sortField].localeCompare(bug2[sortField]) * +sortDir)
    }
    if (sortField === 'price' || sortField === 'speed') {
        bugs.sort((bug1, bug2) =>
            (bug1[sortField] - bug2[sortField]) * +sortDir)
    }

    bugs = bugs.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))
    return bugs
}

function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}

async function remove(bugId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, bugId)
}

async function save(bug) {
    var savedBug
    if (bug._id) {
        const bugToSave = {
            _id: bug._id,
            price: bug.price,
            speed: bug.speed,
        }
        savedBug = await storageService.put(STORAGE_KEY, bugToSave)
    } else {
        const bugToSave = {
            vendor: bug.vendor,
            price: bug.price,
            speed: bug.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedBug = await storageService.post(STORAGE_KEY, bugToSave)
    }
    return savedBug
}

async function addBugMsg(bugId, txt) {
    // Later, this is all done by the backend
    const bug = await getById(bugId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    bug.msgs.push(msg)
    await storageService.put(STORAGE_KEY, bug)

    return msg
}