import Vote from '../models/vote'


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