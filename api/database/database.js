import mongoose from 'mongoose'
import { dbconn } from './config';

//mongoose uses callback by default. but we want the javascript global promise
mongoose.Promise = global.Promise;

const conn = dbconn()

const mongoDB = process.env.MONGODB_URI || conn;

mongoose.connect(mongoDB, {useNewUrlParser: true});

export default mongoose