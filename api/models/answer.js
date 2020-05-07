import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var AnswerSchema = new Schema({

  body: {
    type: String,
    required: true,
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

export default mongoose.model('Answer', AnswerSchema)