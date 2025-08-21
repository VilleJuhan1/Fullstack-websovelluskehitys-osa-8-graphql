import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

// 8.16 käyttäjähallinta
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true,
    minlength: 3
  },
  // Salasana on toistaiseksi kovakoodattu
  /*
  passwordHash: {
    type: String,
    required: true,
    minlength: 6
  },
  */
})

schema.plugin(uniqueValidator)

export default mongoose.model('User', schema)