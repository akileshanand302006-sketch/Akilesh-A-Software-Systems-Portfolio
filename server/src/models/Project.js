import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    category: { type: String, required: true, default: 'Web Applications' },
    year: { type: String, default: '2026' },
    status: { type: String, default: 'Completed' },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    tags: [{ type: String }],
    technologies: [{ type: String }],
    features: [{ type: String }],
    imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileMeta', default: null },
    imageFallback: { type: String, default: '' },
    gradient: { type: String, default: 'from-blue-500/20 to-cyan-500/20' },
    accentColor: { type: String, default: '#38bdf8' },
    github: { type: String, default: '' },
    live: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
