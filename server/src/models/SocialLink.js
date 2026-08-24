import mongoose from 'mongoose';

const SocialLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true, index: true },
    url: { type: String, required: true },
    icon: { type: String, default: 'Globe' },
    color: { type: String, default: '#38bdf8' },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
