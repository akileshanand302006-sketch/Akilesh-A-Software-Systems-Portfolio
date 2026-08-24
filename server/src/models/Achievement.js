import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Trophy' },
    category: { type: String, default: 'Academic' },
    order: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
