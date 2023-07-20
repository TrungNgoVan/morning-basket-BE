const { Counter } = require('../models/counterModel')

const getNextSequenceValue = async (sequenceName) => {
    try {
        const sequenceDocument = await Counter.findByIdAndUpdate(
            { _id: sequenceName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )
        return sequenceDocument.seq
    } catch (err) {
        console.log(err)
        return 0
    }
}

module.exports = {
    getNextSequenceValue,
}
