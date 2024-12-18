import { bugService } from '../services/bug/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'


import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export function BugIndex() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams))
    const [sortBy, setSortBy] = useState(bugService.getSortFromParams(searchParams))

    useEffect(() => {
        setSearchParams({ ...filterBy, ...sortBy })
        loadBugs()
    }, [filterBy, sortBy])

    async function loadBugs() {
        try {
            const bugs = await bugService.query(filterBy, sortBy)
            console.log('bugs', bugs)
            setBugs(bugs)
        } catch (err) {
            console.error('Failed to load bugs', err)
        }
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSort(sortBy) {
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return

        setFilterBy(prevFilter => {

            let nextPageIdx = +prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0

            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }

    async function onRemoveBug(bugId) {
        setBugs((prevBugs) => prevBugs.filter(bug => bug.id !== bugId))
        try {
            await bugService.remove(bugId)
            console.log('Deleted Successfully!')
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
            labels: prompt('Enter labels separated by commas').split(',')
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs([...bugs, savedBug])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {
            const savedBug = await bugService.save(bugToSave)

            const bugsToUpdate = bugs.map((currBug) =>
                currBug.id === savedBug.id ? savedBug : currBug
            )
            setBugs(bugsToUpdate)
        } catch (err) {
            console.error('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
            </section>
            <main>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <BugSort sortBy={sortBy} onSetSort={onSetSort} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <section>
                    <button onClick={() => onChangePage(-1)}>-</button>
                    {filterBy.pageIdx + 1}
                    <button onClick={() => onChangePage(1)}>+</button>
                </section>

                <button type='button' onClick={() => bugService.getPDF()}>Download PDF</button>
            </main>
        </main>
    )
}
