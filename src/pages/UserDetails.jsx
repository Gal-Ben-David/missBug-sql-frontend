import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug/bug.service.remote.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)
    const { userId } = useParams()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const fetchedUser = await userService.getById(userId)
            setUser(fetchedUser)

            const fetchedBugs = await bugService.query()
            setBugs(fetchedBugs.filter(bug => bug.creatorId === +userId))

        } catch (err) {
            console.error('Cannot load user', err)
            showErrorMsg('Cannot load user')
        }
    }

    if (!user) return <h1>loadings....</h1>
    return (
        user && <div>
            <h3>User Details 👤</h3>
            <h4>{user.fullname}</h4>
            <h5>id: {user._id}</h5>
            <h5>{bugs && bugs.length > 0 ? 'User Bugs' : 'No Bugs'}</h5>
            <pre>
                {bugs && bugs.length !== 0 &&
                    <BugList bugs={bugs} />
                }
            </pre>
            <Link to="/bug">Back</Link>
        </div>)

}