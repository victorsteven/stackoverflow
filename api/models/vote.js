import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var VoteSchema = new Schema({

  kind: {
    type: String, 
    required: true, 
    max: 20, 
  },
  question: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Question' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
});

export default mongoose.model('Vote', VoteSchema)