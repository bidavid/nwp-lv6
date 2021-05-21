var mongoose = require('mongoose');  
var blobSchema = new mongoose.Schema({  
  name: String,
  description: String,
  price: Number,
  jobsDone: String,
  startDate: Date,
  endDate: Date,
  members: [String],
});
mongoose.model('Project', blobSchema);