import React, { useState, useEffect  } from 'react'
import noteService  from './services/note'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  //const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(initialNotes  => {
        console.log('promise fulfilled')
        setNotes(initialNotes)
      })
      .catch(error => {
        console.log(error)
        alert(
          "Could not load data"
        )
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
    noteService
      .create(noteObject)
      .then(returnedNote  => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
      .catch(error => {
        console.log(error)
        alert(
          "Could not load data"
        )
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
    noteService
      .create(noteObject)
      .then(returnedNote  => {
        setNotes(notes.concat(returnedNote))        
      }) 
      .catch(error => {
        console.log(error)
        alert(
          "Could not load data"
        )
      })   
  }

  const toggleImportance = (id)=>{
    console.log(`You have just set importance for note ${id}`);
    //put data to server to edit
    const note = notes.find(n => n.id === id)
    const changeNote = {...note, important: !note.important}
    noteService
      .update(id, changeNote)
      .then(returnedNote  => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote)) 
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })   
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance = {() => toggleImportance(note.id)}
            />
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