import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );

      if (!response.ok) {
        throw new Error("Server Error!");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      //запрос на удаление на сервере
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);
      //локальное удаление
      dispatch(removeTodo({ id }));
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const todo = getState().todos.todos.find((todo) => todo.id === id);
    try {
      const responce = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !todo.completed }),
        }
      );
      if (!responce.ok) throw new Error("Cant toggle task");
      dispatch(toggleTodoComplete({ id }));
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async (text, { rejectWithValue, dispatch }) => {
    try {
      const todo = { title: text, userId: 1, completed: false };
      const responce = await fetch(
        `https://jsonplaceholder.typicode.com/todos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todo),
        }
      );
      if (!responce.ok) throw new Error("Cant create todo");
      const data = await responce.json();
      dispatch(addTodo(data))
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};
const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggleTodoComplete(state, action) {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledTodo.completed = !toggledTodo.completed;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = "loading";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: setError,
    [deleteTodo.rejected]: setError,
    [toggleStatus.rejected]: setError,
  },
});
//экспортируем экшены из слайса, потом им будем передавать в диспатч
const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;
//экспортируем редьюсер и его передаем в стор
export default todoSlice.reducer;
