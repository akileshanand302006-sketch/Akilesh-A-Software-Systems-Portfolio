import mongoose from 'mongoose';

const CodingProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true, index: true },
    username: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: 'Code' },
    color: { type: String, default: '#38bdf8' },
    borderColor: { type: String, default: 'rgba(56, 189, 248, 0.3)' },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    badges: [{ type: String }],
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CodingProfile || mongoose.model('CodingProfile', CodingProfileSchema);
