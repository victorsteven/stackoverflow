import _ from 'lodash'
import { ObjectID } from 'mongodb';
import Vote from '../models/vote';
import validate from '../utils/validate'


class VoteController {

  constructor(userService, questionService, voteService){
    this.userService = userService
    this.questionService = questionService
    this.voteService = voteService
  }

  async upvote(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized here",
      });
    }

    //check the request param
    const { quesId } = req.params 
    console.log("the passed id: ", quesId)
    if(!ObjectID.isValid(quesId)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {
      
      let userId = tokenMetadata._id

      //verify that the user sending this request exist:
      const user = await this.userService.getUser(userId)
      
      //check if the question exists, if any error, it will handled in the catch block
      const ques  = await this.questionService.getQuestion(quesId)

      const vote = new Vote({
        question: ques._id,
        user: user._id,
        kind: 'upvote'
      })

      //get the vote if exists:
      const formerVote = await this.voteService.getVote(user._id, ques._id)
      if (formerVote && formerVote.kind === 'upvote') {
        return res.status(400).json({
          status: 400,
          error: "cannot upvote multiple times"
        })
      } else if(formerVote && formerVote.kind === 'downvote') {
        //delete the downvote and upvote it
        const del = await this.voteService.deleteVote(formerVote._id)
        if(del) {
          const createVote = await this.voteService.createVote(vote)
          return res.status(201).json({
            status: 201,
            data: createVote
          })
        }
      } else { //new entry
        const createVote = await this.voteService.createVote(vote)
        return res.status(201).json({
          status: 201,
          data: createVote
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }


  async downvote(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { quesId } = req.params 
    if(!ObjectID.isValid(quesId)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {
      
      let userId = tokenMetadata._id

      //verify that the user sending this request exist:
      const user = await this.userService.getUser(userId)
      
      //check if the question exists, if any error, it will handled in the catch block
      const ques  = await this.questionService.getQuestion(quesId)

      const vote = new Vote({
        question: ques._id,
        user: user._id,
        kind: 'downvote'
      })

      //get the vote if exists:
      const formerVote = await this.voteService.getVote(user._id, ques._id)
      if (formerVote && formerVote.kind === 'downvote') {
        return res.status(400).json({
          status: 400,
          error: "cannot downvote multiple times"
        })
      } else if(formerVote && formerVote.kind === 'upvote') {
        //delete the upvote and downvote it
        const del = await this.voteService.deleteVote(formerVote._id)
        if(del) {
          const createVote = await this.voteService.createVote(vote)
          return res.status(201).json({
            status: 201,
            data: createVote
          })
        }
      } else { //new entry
        const createVote = await this.voteService.createVote(vote)
        return res.status(201).json({
          status: 201,
          data: createVote
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default VoteController