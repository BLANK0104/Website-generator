const mongoose = require('mongoose');

const generatedWebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userInput: {
    type: String,
    required: true
  },
  specifications: {
    websiteType: String,
    siteName: String,
    industry: String,
    pages: [{
      name: String,
      title: String,
      description: String
    }],
    components: [String],
    features: [String],
    backend: {
      contactForm: Boolean,
      authentication: Boolean,
      admin: Boolean,
      database: Boolean
    },
    designStyle: String,
    colorScheme: String
  },
  files: [{
    path: String,
    content: String
  }],
  summary: {
    siteName: String,
    type: String,
    pageCount: Number,
    pages: [String],
    features: [String],
    hasBackend: Boolean,
    hasForms: Boolean,
    hasAuth: Boolean,
    hasAdmin: Boolean,
    components: [String]
  },
  projectPath: String,
  status: {
    type: String,
    enum: ['generated', 'saved', 'deployed'],
    default: 'generated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

generatedWebsiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Delete existing model if it exists to avoid OverwriteModelError
if (mongoose.models.GeneratedWebsite) {
  delete mongoose.models.GeneratedWebsite;
}

module.exports = mongoose.model('GeneratedWebsite', generatedWebsiteSchema);
