import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  
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
  
    setNotes(notes.concat(noteObject))
    setNewNote('')
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
    setNotes(notes.concat(noteObject)) 
    name.value = ""   
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