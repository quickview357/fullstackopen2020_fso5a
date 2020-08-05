import React, { useState, useEffect  } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')


  const name = useFormInput('quang')
  const surname = useFormInput('ho')

  const addNote = (event)=>{
    event.preventDefault()
    
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
  
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })    
  }
  
  const handleNoteChange = (event)=> {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const addNote2 = (event)=>{
    const noteObject = {
      content: name.value + " " + surname.value,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))        
      })    
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input onChange={handleNoteChange} value={newNote}/>
        <button type="submit">save</button>        
      </form>  


      <br></br>
      <input {...name}/>
      <input {...surname}/>
      <button type="button" onClick = {addNote2}>save2</button>
    </div>
  )
}

function useFormInput(initialValue){
  const [value, setValue] = useState(initialValue)

  let handleChange = (event)=>{
    setValue(event.target.value)   
  }

  return {
    value,
    onChange: handleChange
  }
}

export default App 