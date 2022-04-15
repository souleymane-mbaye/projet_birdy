import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import CloseFriend from '../../components/closeFriend/CloseFriend'

export default function Follower() {
    //A completer
    
  return (
    <div>
        <Topbar/>
        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
    </div>
  )
}
