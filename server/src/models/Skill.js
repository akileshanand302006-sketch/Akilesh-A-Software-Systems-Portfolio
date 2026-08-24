import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    categoryIcon: { type: String, default: 'Code' },
    categoryColor: { type: String, default: '#38bdf8' },
    order: { type: Number, default: 0, index: true },
    skills: [
      {
        name: { type: String, required: true },
        icon: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
