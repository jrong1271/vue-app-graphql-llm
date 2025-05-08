// resolvers.js
import { query } from './db.js' // Add .js extension
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || ''

const resolvers = {
  Query: {
    // Fetch all todos
    todos: async () => {
      const result = await query('SELECT * FROM todos ORDER BY created_at ASC')
      return result.rows
    },
    // Fetch a single todo by ID
    todo: async (_, { id }) => {
      const result = await query('SELECT * FROM todos WHERE id = $1', [id])
      return result.rows[0]
    },
    users: async () => {
      const result = await query('SELECT * FROM public."Users"')
      return result.rows
    },
    user: async (_, { id }) => {
      const result = await query('SELECT * FROM "Users" WHERE id = $1', [id])
      return result.rows[0]
    },
    products: async () => {
      const result = await query('SELECT * FROM public."Products"')
      return result.rows
    },
    product: async (_, { id }) => {
      const result = await query('SELECT * FROM "Products" WHERE id = $1', [id])
      return result.rows[0]
    },
    userProducts: async () => {
      const result = await query('SELECT * FROM public."UserProducts"')
      return result.rows
    },
    userProduct: async (_, { id }) => {
      const result = await query('SELECT * FROM "UserProducts" WHERE id = $1', [id])
      return result.rows[0]
    },
  },
  UserProduct: {
    user: async (parent) => {
      const result = await query('SELECT * FROM "Users" WHERE id = $1', [parent.userId])
      return result.rows[0]
    },
    product: async (parent) => {
      const result = await query('SELECT * FROM "Products" WHERE id = $1', [parent.productId])
      return result.rows[0]
    },
  },
  Mutation: {
    // Add a new todo
    addTodo: async (_, { label }) => {
      const result = await query(
        'INSERT INTO todos (label, checked, created_at, updated_at) VALUES ($1, FALSE, NOW(), NOW()) RETURNING *',
        [label],
      )
      return result.rows[0]
    },
    // Update a todo's checked status
    updateTodo: async (_, { id, checked }) => {
      const result = await query(
        'UPDATE todos SET checked = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [checked, id],
      )
      return result.rows[0]
    },
    // Delete a todo
    deleteTodo: async (_, { id }) => {
      const result = await query('DELETE FROM todos WHERE id = $1 RETURNING *', [id])
      return result.rows[0]
    },
    login: async (_, { email, password }) => {
      const result = await query('SELECT * FROM public."Users" WHERE email = $1', [email])

      const user = result.rows[0]
      if (!user) {
        throw new Error('User not found')
      }

      const valid = await bcrypt.compare(password, user.password_hash)
      if (!valid) {
        throw new Error('Invalid password')
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: '1h' },
      )

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }
    },
    updatePassword: async (_, { userId, currentPassword, newPassword }) => {
      const userResult = await query('SELECT * FROM public."Users" WHERE id = $1', [userId])

      const user = userResult.rows[0]
      if (!user) {
        throw new Error('User not found')
      }

      const isValid = await bcrypt.compare(currentPassword, user.password_hash)
      if (!isValid) {
        throw new Error('Current password is incorrect')
      }

      const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

      const updateResult = await query(
        'UPDATE public."Users" SET password_hash = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, name, email',
        [newHashedPassword, userId],
      )

      return updateResult.rows[0]
    },
    addUser: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

      const result = await query(
        'INSERT INTO public."Users" (name, email, password_hash, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [name, email, hashedPassword],
      )

      return result.rows[0]
    },
  },
}

export default resolvers
