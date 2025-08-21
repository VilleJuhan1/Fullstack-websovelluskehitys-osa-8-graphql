import propTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

// 8.8/8.11 Haetaan kaikki kirjailijat 5 sekunnin välein (myös syntymävuoden päivityksen jälkeen)
const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 5000
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

  const authors = result.data ? result.data.allAuthors : []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Authors.propTypes = {
  show: propTypes.bool.isRequired,
}

export default Authors
