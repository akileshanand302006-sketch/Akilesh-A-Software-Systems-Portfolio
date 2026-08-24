import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Akilesh A' },
    firstName: { type: String, default: 'Akilesh' },
    lastName: { type: String, default: 'A' },
    title: { type: String, required: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    highlights: [{ type: String }],
    interests: [{ type: String }],
    stats: [
      {
        label: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: '' },
      },
    ],
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    availability: { type: String, default: 'Open to Internship Opportunities (2026)' },
    profileImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileMeta', default: null },
    resumeFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileMeta', default: null },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
