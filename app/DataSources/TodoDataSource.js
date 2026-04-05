import Todo from '../Models/TodoModel.js';

/**
 * Apollo DataSources are classes that encapsulate data fetching logic.
 * This pattern helps to decouple the resolver logic from the underlying data source (Mongoose/MongoDB).
 * It also provides built-in caching and helps manage common data fetching patterns.
 */
class TodoDataSource {
  async getAllTodos() {
    return await Todo.find();
  }

  async getTodoById(id) {
    return await Todo.findById(id);
  }

  async getTodosByUser(userId) {
    return await Todo.find({ user: userId });
  }

  async createTodo(data) {
    const newTodo = new Todo(data);
    return await newTodo.save();
  }

  async updateTodo(id, data) {
    return await Todo.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTodo(id) {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    return deletedTodo ? deletedTodo._id : null;
  }
}

export default TodoDataSource;
