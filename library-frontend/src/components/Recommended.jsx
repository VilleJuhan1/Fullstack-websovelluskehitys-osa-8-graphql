import propTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { FILTERED_BOOKS } from '../queries'

// 8.20 Lempikirjat genren mukaan
const Recommended = (props) => {
  //console.log('Recommended component props:', props)
  const result = useQuery(FILTERED_BOOKS, {
    variables: { genre: props.user?.favoriteGenre },
    skip: !props.user?.favoriteGenre
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }
  if (!result.data || !result.data.allBooks) {
    return <div>No recommended books found.</div>
  }
  //console.log('Recommended books result:', result.data)
  const books = result.data ? result.data.allBooks : []

  return (
    <div>
      <h2>Recommended books in genre: {props.user?.favoriteGenre || 'No favorite genre'}</h2>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Recommended.propTypes = {
  user: propTypes.shape({
    favoriteGenre: propTypes.string.isRequired
  }).isRequired,
  show: propTypes.bool.isRequired
}

export default Recommended