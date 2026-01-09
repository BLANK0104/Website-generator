const mongoose = require('mongoose');

// Force clear the model and schema cache
delete mongoose.connection.models['GeneratedWebsite'];
if (mongoose.models.GeneratedWebsite) {
  delete mongoose.models.GeneratedWebsite;
}

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
    websiteType: String,  // Changed from 'type' to avoid keyword conflict
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
}, { strict: true });

generatedWebsiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GeneratedWebsite', generatedWebsiteSchema);
