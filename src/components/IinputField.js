import React from 'react';

const InputField = ({text,setText,addTodo}) => {
    return (
        <>
            <input type="text" value={text} onChange={(e)=>setText(e.target.value)}/>
            <button onClick={addTodo}>Добавить задачу</button>
        </>

    );
};

export default InputField;