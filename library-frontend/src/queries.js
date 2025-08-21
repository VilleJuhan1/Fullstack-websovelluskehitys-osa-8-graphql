import { gql } from '@apollo/client'

// 8.17 Muokattu vastaamaan backendin rakennetta
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
// Käytetään sekä Books-komponentin filterinä että käyttäjälle suositelluissa kirjoissa (Recommended)
export const FILTERED_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        favoriteGenre
      }
    }
  }
`

export const ADDED_BOOK = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`