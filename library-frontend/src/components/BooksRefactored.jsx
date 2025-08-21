import propTypes from 'prop-types'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FILTERED_BOOKS, ALL_BOOKS } from '../queries'

// 8.9/8.17/8.21 refaktoroitu Books-komponentti, joka käyttää useQuery-hookia tilan päivittämiseen
const Books = (props) => {
  const [genre, setGenre] = useState(null)
  
  // Genret haetaan kaikista kirjoista, ei vain suodatetuista
  const allBooksResult = useQuery(ALL_BOOKS, {
    fetchPolicy: 'cache-and-network'
  })
  
  // 8.19 Filterin avulla haetaan genren mukaan suodatetut kirjat
  const result = useQuery(FILTERED_BOOKS, {
    variables: { genre },
    fetchPolicy: 'cache-and-network', // Käytetään ensisijaisesti välimuistia, mutta haetaan myös verkosta
    notifyOnNetworkStatusChange: true 
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

  // Filterin mukaan suodatetut kirjat 
  const books = result.data ? result.data.allBooks : []

  // Genrejen määrittely kaikkien kirjojen perusteella
  const allBooks = allBooksResult.data ? allBooksResult.data.allBooks : []
  const uniqueGenres = [...new Set(allBooks.flatMap(book => book.genres))].sort()
  
  // 8.22 Fetchpolicy määrittää, että genren muuttuessa kysely suoritetaan uudelleen
  const handleGenreChange = async (event) => {
    const selectedGenre = event.target.value || null
    setGenre(selectedGenre)
  }

  // Palauttaa taulukon, jossa lajitellut kirjat ja niiden tiedot
  return (
    <div>
      <h2>books {genre ? `(filtered by: ${genre})` : '(all books)'}</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Filter by genre</h3>
      <select onChange={handleGenreChange} value={genre || ''}>
        <option value="">All genres</option>
        {uniqueGenres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
    </div>
  )
}

Books.propTypes = {
  show: propTypes.bool.isRequired,
}

export default Books
