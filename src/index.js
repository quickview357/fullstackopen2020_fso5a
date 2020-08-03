import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => {
    setCounter(counter + 1)
  }
  
  const setToZero = () => setCounter(0)

  const getParam = (event, a)=>{
    console.log(event)
    console.log(a);
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>

      <button onClick={(event)=>getParam(event, 123)}>
        param
      </button>

    </div>
  )
}
ReactDOM.render(
  <App />, 
  document.getElementById('root')
)