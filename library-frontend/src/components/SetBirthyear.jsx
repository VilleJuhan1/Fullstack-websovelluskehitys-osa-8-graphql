import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { SET_BIRTHYEAR, ALL_AUTHORS } from '../queries'
import Select from 'react-select'
import propTypes from 'prop-types'

// 8.11 Komponentti kirjailijan syntymävuoden asettamiseksi
const SetBirthyear = ({ show }) => {
  // const [name, setName] = useState('')
  const [selectedName, setSelectedName] = useState(null);   // 8.12 vetovalikko, joka sisältää kaikki kirjailijat
  const [born, setBorn] = useState('')

  const { data: authorsData } = useQuery(ALL_AUTHORS)
  const authors = authorsData ? authorsData.allAuthors : []
  const authorOptions = authors.map(author => ({
    value: author.name,
    label: author.name
  }))

  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    onCompleted: () => {
      console.log('Birthyear updated successfully')
      setBorn('')
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.error('Error setting birthyear:', messages)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Setting birthyear for:', selectedName.value, 'to', born)
    setBirthyear({ variables: { name: selectedName.value, born: parseInt(born) } })
  }

  if (!show) return null

  // 8.12 Vetovalikko käyttäen React Selectiä
  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            defaultValue={selectedName}
            onChange={setSelectedName}
            options={authorOptions}
          />
        </div>
        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update Birthyear</button>
      </form>
    </div>
  )
}

SetBirthyear.propTypes = {
  show: propTypes.bool.isRequired,
}

export default SetBirthyear