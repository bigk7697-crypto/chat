import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    googleId: { type: String, sparse: true, unique: true },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, default: 'https://ui-avatars.com/api/?name=U&background=random' },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

userSchema.methods.signToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default mongoose.models.User || mongoose.model('User', userSchema);