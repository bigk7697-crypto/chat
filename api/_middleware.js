import jwt from 'jsonwebtoken';
import User from '../../lib/models/User';
import connectDB from '../../lib/db';

export async function auth(req) {
  // Ensure DB connection
  await connectDB();
  const token = req.headers.cookie
    ?.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    return { user };
  } catch (err) {
    return { status: 401, body: { error: 'Invalid token' } };
  }
}