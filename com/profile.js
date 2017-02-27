import * as yo from 'yo-yo'
import {getLocalUser} from '../model/users'

export default function () {
  const user = getLocalUser()
  if (!user || !user.profile) {
    return ''
  }
  return yo`
    <div class="profile">
      <div class="card">
        <img class="profile__avi" src=${user.aviUrl} />
        <h3 class="profile__name"><a href="${user.url}">${user.profile.name}</a></h3>
        <div class="profile__bio">${user.profile.bio}</h3>
        <div class="profile__stats">Following: ${user.profile.follows.length}</h3>
      </div>
    </div>
  `
}