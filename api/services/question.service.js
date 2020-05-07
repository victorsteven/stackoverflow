import Question from '../models/question'
import { ObjectID } from 'mongodb';


class QuestionService {
  constructor() {
    this.question = Question
  }

  async createQuestion(question) {


    try {

      //check if the question has been asked before
       const record = await this.question.findOne({ title: question.title })
       if (record) {
         throw new Error('record already exists');
       } 

      const createdQuestion = await this.question.create(question);

      return createdQuestion
      
    } catch(error) {
      throw error;
    }
  }


   async getQuestion(questionId) {

    try {

      let questionIdObj = new ObjectID(questionId)

      const gottenQuestion = await this.question.findOne({ _id: questionIdObj }).select('-__v').exec()
      if (!gottenQuestion) {
        throw new Error('no record found');
      }

      return gottenQuestion

    } catch(error) {
      throw error;
    }
  }

   async getQuestions() {

    try {

      return await this.question.find().select('-user').select('-__v').exec()

    } catch(error) {
      throw error;
    }
  }

   async updateQuestion(question) {

    try {

      const updatedQuestion = await this.question.findOneAndUpdate(
        { _id: question._id}, 
        { $set: question },
        { "new": true},
      );

      return updatedQuestion

    } catch(error) {
      if(error.message.includes("duplicate")){
        throw new Error("record already exists")
      }
      throw error;
    }
  }
}

export default QuestionService