import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String, 
    required: true, 
    max: 100,
    unique: true
  },
  email: {
    type: String, 
    required: true, 
    max: 100, 
    unique: true
  },
  password: {
    type: String, required: true, max: 255
  },
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

export default mongoose.model('User', UserSchema)