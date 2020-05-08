import User from '../models/user'
import Question from '../models/question'
import Answer from '../models/answer'
import Vote from '../models/vote'
import password from '../utils/password'


import { ObjectID } from 'mongodb'


export async function seedUsers () {

  let users = [{
    _id: new ObjectID('5eb4554d1c6d02391f6ba37c'),
    username: 'thomas',
    email: 'thomas@example.com',
    password: password.hashPassword('password')
  },{
    _id: new ObjectID('5eb455993b9e97398e8aad39'),
    username: 'abdul',
    email: 'abdul@example.com',
    password: password.hashPassword('password')
  },
]
const seededUsers = await User.insertMany(users)

  return seededUsers
}

export async function seedQuestions () {

  let questions = [
    {
      title: 'How to use Hexagonal Architecture',
      body: 'first question body',
      user: new ObjectID('5eb4554d1c6d02391f6ba37c')
    },
    {
      title: 'How to convert float64 to string in Golang',
      body: 'second question body',
      user: new ObjectID('5eb4554d1c6d02391f6ba37c')
    },
  ]
  const seededQuestions = await Question.insertMany(questions)

  return seededQuestions
}

export async function seedAnswers () {

  let answers = [
    {
      question: new ObjectID('5e69758b274e95a16159c2bc'),
      user: new ObjectID('5e6b13809f86ce60e92ff11c'),
      body: 'This is the first answer'
    },
    {
      question: new ObjectID('5e69758b274e95a16159c2bc'),
      user: new ObjectID('5e6b13809f86ce60e92ff11c'),
      body: 'This is the second answer'
    },
  ]
  const seededAnswers = await Answer.insertMany(answers)

  return seededAnswers
}


export async function seedQuestionsAndAnswers () {

  const question1 = {
    title: 'How to use Hexagonal Architecture',
    body: 'first question body',
    user: new ObjectID('5eb4554d1c6d02391f6ba37c')
  }
  const seededQuestion1 = await Question.create(question1)

  const question2 = {
    title: 'How to convert float64 to string in Golang',
    body: 'second question body',
    user: new ObjectID('5eb455993b9e97398e8aad39')
  }

  const seededQuestion2 = await Question.create(question2)

  if(seededQuestion1 && seededQuestion2) {

    let answers = [{
        body: 'This is the first answer',
        question: seededQuestion1._id,
        user: new ObjectID('5eb455993b9e97398e8aad39'),
      },{
        body: 'This is the second answer',
        question: seededQuestion2._id,
        user: new ObjectID('5eb455993b9e97398e8aad39'),
      },
    ]

    const seededAnswers = await Answer.insertMany(answers)

    if(seededAnswers) {

      const gottenAnswers = await Answer.find()
                                          .select('-__v')
                                          .populate('question', '_id title body')
                                          .exec()


      if(gottenAnswers) {

        return gottenAnswers
      }
    }
  }
}


export async function seedQuestionsAndVotes () {

  const question1 = {
    title: 'How to use Hexagonal Architecture',
    body: 'first question body',
    user: new ObjectID('5eb4554d1c6d02391f6ba37c')
  }
  const seededQuestion1 = await Question.create(question1)

  const question2 = {
    title: 'How to convert float64 to string in Golang',
    body: 'second question body',
    user: new ObjectID('5eb455993b9e97398e8aad39')
  }

  const seededQuestion2 = await Question.create(question2)

  if(seededQuestion1 && seededQuestion2) {

    let votes = [{
        kind: 'upvote',
        question: seededQuestion1._id,
        user: new ObjectID('5eb455993b9e97398e8aad39'),
      },{
        kind: 'downvote',
        question: seededQuestion2._id,
        user: new ObjectID('5eb455993b9e97398e8aad39'),
      },
    ]

    const seededVotes = await Vote.insertMany(votes)

    if(seededVotes) {

      const gottenVotes = await Vote.find()
                                    .select('-__v')
                                    .populate('question', '_id title body')
                                    .exec()


      if(gottenVotes) {

        return gottenVotes
      }
    }
  }
}