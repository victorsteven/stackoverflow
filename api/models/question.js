import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

  title: {
    type: String, 
    required: true, 
    unique: true,
    max: 255, 
  },

  body: {
    type: String, 
    required: true, 
    max: 255, 
  },
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
});

export default mongoose.model('Question', QuestionSchema)