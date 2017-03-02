import * as yo from 'yo-yo'
import {getLocalUser} from '../model/users'

export default function () {
  const user = getLocalUser()
  if (!user || !user.profile) {
    return yo`
      <div class="profile">
        <div class="card">
          <h3 class="profile__name">Welcome to app://Social</h3>
          <div class="profile__bio">
            A peer-to-peer alternative to Twitter.<br>
            <br>
            <button>Create a profile</button> to get started
          </div>
        </div>
      </div>
    `
  }
  return yo`
    <div class="profile">
      <div class="card">
        <img class="profile__avi" src=${user.aviUrl} />
        <h3 class="profile__name"><a href="${user.url}">${user.profile.name}</a></h3>
        <div class="profile__bio">${user.profile.bio}</div>
        <div class="profile__stats">Following: ${user.profile.follows.length}</h3>
      </div>
    </div>
  `
}