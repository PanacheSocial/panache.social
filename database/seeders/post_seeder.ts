import User from '#common/models/user'
import Post from '#social/models/post'
import Profile from '#social/models/profile'
import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'

type CreateOpt<T extends abstract new (...args: any) => any> = Partial<
  ModelAttributes<InstanceType<T>>
>
export default class extends BaseSeeder {
  randomBool(prob: number): boolean {
    return Math.random() < prob
  }
  generateUser(): CreateOpt<typeof User> {
    return {
      id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      gender: faker.person.sex(),
      locale: faker.location.language().alpha2,
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  }

  generatePost(
    profileId: string,
    roomId: string
  ): Partial<ModelAttributes<InstanceType<typeof Post>>> {
    const createdAt = DateTime.fromJSDate(faker.date.recent())
    return {
      id: faker.database.mongodbObjectId(),
      title: faker.lorem.words(5),
      text: faker.lorem.paragraphs(3),
      createdAt: createdAt,
      updatedAt: createdAt,
      likesCount: Math.floor(Math.random() * 100),
      profileId: profileId,
      link: faker.internet.url(),
      linkTitle: faker.lorem.words(3),
      roomId: roomId,
    }
  }

  generateRoom(): Partial<ModelAttributes<InstanceType<typeof Room>>> {
    return {
      id: faker.database.mongodbObjectId(),
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      lang: faker.location.language().alpha2,
      slug: faker.lorem.slug(10),
    }
  }
  async run() {
    console.log('Creating rooms')
    const rooms = await Room.createMany(Array.from({ length: 10 }, this.generateRoom))

    console.log('Creating users')
    const users = await User.createMany(Array.from({ length: 150 }, this.generateUser))

    console.log('Creating profiles')
    const profiles = await Profile.createMany(
      users.map((u) => ({
        userId: u.id,
        username: u.username,
        avatar: faker.image.avatar(),
      }))
    )

    const profilesRooms: CreateOpt<typeof RoomMember>[] = []

    for (const profile of profiles) {
      // randomly assign 10-20 members to each room

      for (const room of rooms) {
        if (!this.randomBool(0.6)) {
          continue
        }

        profilesRooms.push({
          role: 'member',
          profileId: profile.id,
          roomId: room.id,
        })
      }
    }

    console.log('Creating room members')
    const members = await RoomMember.createMany(profilesRooms)

    const posts: CreateOpt<typeof Post>[] = []

    for (const m of members) {
      const postsCount = Math.floor(Math.random() * 5)
      for (let i = 0; i < postsCount; i++) {
        posts.push(this.generatePost(m.profileId, m.roomId))
      }
    }

    console.log('Creating posts', posts.length)
    await Post.createMany(posts)

    // randomly create 100-200 posts
  }
}
