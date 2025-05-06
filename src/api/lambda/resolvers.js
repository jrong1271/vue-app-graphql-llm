// resolvers.js
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || '';

const resolvers = {
  Query: {
    users: async () => {
      const result = await pool.query('SELECT * FROM public."Users"');
      return result.rows;
    },
    user: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
      return result.rows[0];
    },
    products: async () => {
      const result = await pool.query('SELECT * FROM public."Products"');
      return result.rows;
    },
    product: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM "Products" WHERE id = $1', [id]);
      return result.rows[0];
    },
    userProducts: async () => {
      const result = await pool.query('SELECT * FROM public."UserProducts"');
      return result.rows;
    },
    userProduct: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM "UserProducts" WHERE id = $1', [id]);
      return result.rows[0];
    },
  },
  UserProduct: {
    user: async (parent) => {
      const result = await pool.query(
        'SELECT * FROM "Users" WHERE id = $1',
        [parent.userId]
      );
      return result.rows[0];
    },
    product: async (parent) => {
      const result = await pool.query(
        'SELECT * FROM "Products" WHERE id = $1',
        [parent.productId]
      );
      return result.rows[0];
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const result = await pool.query(
        'SELECT * FROM public."Users" WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new Error('Invalid password');
      }

      // Create JWT payload (omit sensitive fields like password_hash)
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: '1h' } // Adjust expiry as needed
      );

      // Return both token and user information
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    },
    updatePassword: async (_, { userId, currentPassword, newPassword }) => {
      // First, get the user to verify the current password
      const userResult = await pool.query(
        'SELECT * FROM public."Users" WHERE id = $1',
        [userId]
      );
      
      const user = userResult.rows[0];
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify the current password
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash the new password
      const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      
      // Update the password in the database
      const updateResult = await pool.query(
        'UPDATE public."Users" SET password_hash = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, name, email',
        [newHashedPassword, userId]
      );
      
      return updateResult.rows[0];
    },
    addUser: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const result = await pool.query(
        'INSERT INTO public."Users" (name, email, password_hash, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [name, email, hashedPassword]
      );

      return result.rows[0];
    },
  },
};

module.exports = resolvers;