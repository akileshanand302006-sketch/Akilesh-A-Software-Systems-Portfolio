import mongoose from 'mongoose';

const FileMetaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    category: {
      type: String,
      enum: ['PROFILE_IMAGE', 'PROJECT_IMAGE', 'RESUME', 'CERTIFICATE', 'OTHER'],
      default: 'OTHER',
      index: true,
    },
    gridFSId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FileMeta || mongoose.model('FileMeta', FileMetaSchema);
