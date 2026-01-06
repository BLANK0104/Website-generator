const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  generatedCode: {
    html: {
      type: String,
      required: true
    },
    css: {
      type: String,
      required: true
    },
    javascript: {
      type: String,
      default: ''
    }
  },
  components: [{
    type: String
  }],
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    isResponsive: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  }
});

// Update the updatedAt timestamp before saving
ProjectSchema.pre('save', function(next) {
  this.metadata.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
