import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bugService } from '../services/bug/'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        async function fetchBug() {
            try {
                const loadedBug = await bugService.getById(bugId)
                console.log('loadedBug', loadedBug)
                setBug(...loadedBug)
            } catch (err) {
                console.error('Cannot load bug', err)
            }
        }
        fetchBug()
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return (
        <div>
            <h3>Bug Details 🐛</h3>
            <h4>{bug.name}</h4>
            <h4 >{bug.description || 'No description available'}</h4>
            <p>Severity: <span>{bug.severity}</span></p>
            <Link to={"/bug"}>Back to List</Link>
        </div>
    )
}

