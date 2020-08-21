import React, { useState, useEffect  } from 'react'
import noteService  from './services/note'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import './index.css'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  },[])



  console.log('render', notes.length, 'notes')
  const name = useFormInput('quang')
  const surname = useFormInput('ho')

  // const addNote = (event)=>{
  //   event.preventDefault()    
  //   const noteObject = {
  //     content: newNote,
  //     date: new Date().toISOString(),
  //     important: Math.random() < 0.5,
  //     id: notes.length + 1,
  //   }
  //   noteService
  //     .create(noteObject)
  //     .then(returnedNote  => {
  //       setNotes(notes.concat(returnedNote))
  //       setNewNote('')
  //     })
  //     .catch(error => {
  //       setErrorMessage('token error')
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //     })          
  // }
  const addNote = async (event)=>{
    event.preventDefault() 

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
    try{
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    }
    catch(ex){
      console.log(ex)
      setErrorMessage('token error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }      
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
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })   
  }

  //
  //login handle
  //
  const handleLogin = async (event)=>{
    event.preventDefault();
    try{
      const user = await loginService.login({username, password})
      //write token to local storage
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      //set token for note service 
      noteService.setToken(user.token)
      //set user info
      setUser(user)
      //reset
      setUserName('')
      setPassword('')
    }
    catch(ex){
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }      
  }

  //
  //declare login form and add note form like as varible
  //
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        User name: <input type="text" value={username} name="username" onChange={({target})=>setUserName(target.value)}></input>
      </div>
      <div>
        Password: <input type="password" value={password} name="Password" onChange={(event)=>setPassword(event.target.value)}></input>
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input onChange={handleNoteChange} value={newNote}/>
      <button type="submit">Save</button>        
    </form>
  )
  
  //
  //component return
  //
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}></Notification>
      { 
        user === null ?
        loginForm():
        <div>
          <p>{user.username} - {user.name} has been login</p>
          {noteForm()}
        </div>        
      }
      <ul>
        {notes.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance = {() => toggleImportance(note.id)}
            />
        )}
      </ul>    

      <br></br>
      <input {...name}/>
      <input {...surname}/>
      <button type="button" onClick = {addNote2}>save2</button>
      <Footer></Footer>
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