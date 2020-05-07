import Vote from '../models/vote'
import { ObjectID } from 'mongodb';


class VoteService {

  constructor() {
    this.vote = Vote;
  }


  async createVote(vote) {

    try {

        const createdVote = await this.vote.create(vote);

        return createdVote

    } catch(error) {
      throw error;
    }
  }

  //  async upvote(vote) {

  //   try {

  //     const record = await this.vote.findOne({ user: vote.user, question: vote.question })
  //     if (record && vote.kind === 'upvote') {

  //       throw new Error('record already exists');

  //     } else {

  //       const createdVote = await this.vote.create(vote);

  //       return createdVote

  //     }
  //   } catch(error) {
  //     throw error;
  //   }
  // }

  // async downvote(vote) {

  //   try {

  //     const record = await this.vote.findOne({ user: vote.user, question: vote.question })
  //     if (record && vote.kind === 'downvote') {

  //       throw new Error('record already exists');

  //     } else if(record && vote.kind === 'upvote') {

  //       const createdVote = await this.vote.create(vote);

  //       return createdVote
        
  //     }
  //   } catch(error) {
  //     throw error;
  //   }
  // }

  //This answer can both be seen by the user and the admin
  //  async getVote(voteId) {

  //   try {

  //     let voteIdObj = new ObjectID(voteId)

  //     const gottenVote = await this.vote.findOne({ _id: voteIdObj })
  //                                         .populate('user', '_id, username')
  //                                         .populate('question', '_id body')
  //                                         .exec()
  //     if (!gottenVote) {
  //       throw new Error('no record found');
  //     }

  //     return gottenVote

  //   } catch(error) {
  //     throw error;
  //   }
  // }

  async getVote(userId, quesId) {

    try {

      const record = await this.vote.findOne({ user: userId, question: quesId })

      if(record) {

        return record

      }
    } catch(error) {
      throw error;
    }
  }

  async deleteVote(voteId) {

    try {

      const deleted = await this.vote.deleteOne({ _id: voteId })
      if (deleted.deletedCount === 0) {
        throw new Error('something went wrong');
      }
      return deleted

    } catch(error) {
      throw error;
    }
  }
}

export default VoteService