import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['academic', 'project', 'experience'], default: 'academic' },
    role: { type: String, required: true },
    organization: { type: String, required: true },
    location: { type: String, default: 'Coimbatore, Tamil Nadu, India' },
    period: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    skills: [{ type: String }],
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
