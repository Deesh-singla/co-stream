// 'use client'
// import { signOut } from 'next-auth/react'
// import React from 'react'

// const Logout = () => {
//     return (
//         <div>
//             <button onClick={() => signOut({ callbackUrl: "/signin" })}>signOut</button>
//         </div>
//     )
// }

// export default Logout



'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const Logout = () => {
    return (
        <div className="flex justify-center bg-black p-4">
            <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white"
            >
                Sign Out
            </button>
        </div>
    )
}

export default Logout