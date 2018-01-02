import { User } from 'domain.adamperyman.com'

export default {
  Query: {
    user: async (parent, args) => {
      const { _id } = args

      const user = await User.findOne({ _id: _id })

      return user
    },
    users: async () => {
      const users = await User.find().lean()

      return users
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { name } = args

      const newUser = await User.create({
        name
      })

      return newUser._id
    },
    deleteUser: async (parent, args) => {
      const { _id } = args

      const result = await User.remove({ _id })

      return result
    }
  }
}
