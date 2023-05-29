
import './App.css';
import {useEffect, useState} from "react";
import TodoList from "./components/TodoList";
import InputField from "./components/IinputField";
import {useDispatch, useSelector} from "react-redux";
//импортируем экшены из редъюсера
import {addNewTodo, addTodo, fetchTodos, removeTodo} from "./components/store/todoSlice";

function App() {


    const {status,error}=useSelector(state=>state.todos)

    const [text,setText]=useState("")
    //передаем в диспатч экшн и пейлоад
    const dispatch=useDispatch()
    const addTask=()=>dispatch(addNewTodo(text));

    useEffect(()=>{
       dispatch(fetchTodos());
    },[dispatch])


  return (
    <div className="App">
    <InputField text={text} setText={setText} addTodo={addTask}/>
        {status==="loading"&&<h2>Loading</h2>}
        {error&&<h2>An error occured:{error}</h2>}
        <TodoList/>


    </div>
  )
}

export default App;
