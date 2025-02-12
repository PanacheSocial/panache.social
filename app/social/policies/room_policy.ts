import Room from '#social/models/room'
import { BasePolicy } from '@adonisjs/bouncer'
import RoomMember from '#social/models/room_member'
import type User from '#common/models/user'

export default class RoomPolicy extends BasePolicy {
  async updateLogo(user: User, room: Room) {
    if (user.role === 'admin') {
      return true
    }

    const member = await RoomMember.query()
      .where('room_id', room.id)
      .where('profile_id', user.currentProfileId!)
      .first()

    return member?.role === 'moderator'
  }
}
