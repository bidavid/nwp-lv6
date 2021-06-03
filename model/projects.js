var mongoose = require('mongoose');
const Schema = mongoose.Schema
var blobSchema = new mongoose.Schema({  
  name: String,
  description: String,
  price: Number,
  jobsDone: String,
  startDate: Date,
  endDate: Date,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  archived: Boolean
});
mongoose.model('Project', blobSchema);