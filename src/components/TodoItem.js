import React from 'react';
import {deleteTodo, toggleStatus, toggleTodoComplete} from "./store/todoSlice";
import {useDispatch} from "react-redux";

const TodoItem = ({id,title,completed}) => {
    const dispatch=useDispatch()

    return (
        <li>
            <input type="checkbox" checked={completed} onChange={()=>dispatch(toggleStatus(id))}/>
            <span>{title}</span>
            <button onClick={()=>dispatch(deleteTodo(id))} >Удалить</button>
        </li>
    );
};

export default TodoItem;