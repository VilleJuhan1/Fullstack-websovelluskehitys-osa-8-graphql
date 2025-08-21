import { GraphQLError } from 'graphql' // 8.15 GraphQL virheiden käsittelyyn
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Author from '../models/author.js'
import Book from '../models/book.js'
import User from '../models/user.js'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

// Refaktoroidut resolverit
const resolvers = {
  Query: {
    // 8.1 authorCount, palauttaa kirjailijoiden lukumäärän
    authorCount: async (root, args, context) => {
      return await Author.collection.countDocuments()
    },
    // 8.1 bookCount, palauttaa kirjojen lukumäärän
    bookCount: async (root, args, context) => {
      return await Book.collection.countDocuments()
    },
    // 8.2 allBooks, palauttaa kaikki kirjat...
    // 8.5 suodatettuna authorin ja genren mukaan, jos annettu
    allBooks: async (root, args, context) => {
      const { author, genre } = args
      const filter = {}
      if (author) {
        filter.author = await Author.findOne({ name: author })
        filter.author = filter.author ? filter.author._id : null
      }
      if (genre) {
        filter.genres = genre
      }
      if (!filter.author && !filter.genres) {
        return await Book.find({})
      }
      return await Book.find(filter)
    },
    // 8.3 allAuthors, palauttaa kaikki kirjailijat
    allAuthors: async (root, args, context) => {
      return await Author.find({})
    },
    // Palauttaa kaikki käyttäjät (lähinnä testaukseen)
    allUsers: async (root, args, context) => {
      return await User.find({})
    },
    // Palauttaa nykyisen käyttäjän
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: async (root, args, context) => {
      return await Author.findById(root.author)
    }
  },
  Author: {
    bookCount: async (root, args, context) => {
      return await Book.countDocuments({ author: root._id })
    }
  },
  Mutation: {
    // 8.6 uuden kirjan lisääminen, jos käyttäjä on kirjautunut sisään
    addBook: async (root, args, context) => { 
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        let newAuthor = new Author({
          name: args.author,
          id: new mongoose.Types.ObjectId(),
          born: null,
        })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new Error("Failed to save new author")
        }
        author = newAuthor
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        id: new mongoose.Types.ObjectId(),
        author: author._id,
        genres: args.genres,
      })
      await book.save()
      
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      console.log("Book added:", book)

      return book
    },
    // Kirjailijan syntymävuoden asettaminen, vain jos käyttäjä on kirjautunut sisään
    editAuthor: async (root, args, context) => {  
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new Error("Failed to update author")
      }
      return author
    },
    createUser: async (root, args, context) => {  // Luo uuden käyttäjän
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args, context) => { // Kirjaa käyttäjän sisään ja palauttaa JWT-tokenin ja käyttäjätiedot
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== process.env.PASSWORD) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { 
        token: jwt.sign(userForToken, process.env.JWT_SECRET), 
        user: user 
      }
    },
  },
  // 8.23 Subscription
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },

}
// Exportataan resolverit omasta tiedostosta koodin luettavuuden parantamiseksi
export default resolvers