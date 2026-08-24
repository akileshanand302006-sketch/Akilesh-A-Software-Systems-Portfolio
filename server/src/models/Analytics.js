import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['page_view', 'project_click', 'resume_view', 'resume_download', 'contact_submit', 'theme_change'],
      index: true,
    },
    target: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipHash: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
