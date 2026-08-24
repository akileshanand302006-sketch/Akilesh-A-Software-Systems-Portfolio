import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
