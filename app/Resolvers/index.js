import User from "../Models/UserModel.js";
import Todo from "../Models/TodoModel.js";
import { hashPassword, verifyPassword, generateToken } from "../Utils/auth.js";
import { requireAuth, requireRole } from "../Utils/context.js";

const resolvers = {
  Query: {
    // Get all users
    users: async (parent, args, { dataSources }) => {
      try {
        return await dataSources.users.getAllUsers();
      } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },
    // Get user by ID
    user: async (parent, { id }, { dataSources }) => {
      try {
        return await dataSources.users.getUserById(id);
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
    // Get all todos
    todos: async (parent, args, { dataSources }) => {
      try {
        return await dataSources.todos.getAllTodos();
      } catch (error) {
        throw new Error(`Failed to fetch todos: ${error.message}`);
      }
    },
    // Get todo by ID
    todo: async (parent, { id }, { dataSources }) => {
      try {
        return await dataSources.todos.getTodoById(id);
      } catch (error) {
        throw new Error(`Failed to fetch todo: ${error.message}`);
      }
    },
    // Get todos by specific user (Task requirement 5)
    todosByUser: async (parent, { userId }, { dataSources }) => {
      try {
        return await dataSources.todos.getTodosByUser(userId);
      } catch (error) {
        throw new Error(`Failed to fetch user todos: ${error.message}`);
      }
    },
  },

  Mutation: {
    // User Registration
    register: async (parent, { request }, { dataSources }) => {
      try {
        const { name, email, password } = request;

        const existingUser = await dataSources.users.findUserByEmailOrName(
          email,
          name,
        );
        if (existingUser) {
          return { success: false, message: "User already exists", user: null };
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await dataSources.users.createUser({
          name,
          email,
          password: hashedPassword,
          role: "user",
        });

        return {
          success: true,
          message: "User registered successfully",
          user: newUser,
        };
      } catch (error) {
        return {
          success: false,
          message: `Registration failed: ${error.message}`,
          user: null,
        };
      }
    },

    // User Login
    login: async (parent, { request }, { dataSources }) => {
      try {
        const { email, password } = request;
        const user = await dataSources.users.findUserByEmail(email);

        if (!user || !(await verifyPassword(password, user.password))) {
          return {
            success: false,
            message: "Invalid email or password",
            token: "",
          };
        }

        const token = generateToken(user._id.toString(), user.email, user.role);
        return { success: true, message: "Login successful", token };
      } catch (error) {
        return {
          success: false,
          message: `Login failed: ${error.message}`,
          token: "",
        };
      }
    },

    // Update User
    updateUser: async (parent, { request }, context) => {
      const { dataSources } = context;
      const currentUser = requireAuth(context);
      const { id, update } = request;

      // Only allow updating self or admin
      if (currentUser.userId !== id && currentUser.role !== "admin") {
        throw new Error("Unauthorized to update this user");
      }

      try {
        if (update.password) {
          update.password = await hashPassword(update.password);
        }
        const updatedUser = await dataSources.users.updateUser(id, update);
        return {
          success: true,
          message: "User updated successfully",
          user: updatedUser,
        };
      } catch (error) {
        return {
          success: false,
          message: `Update failed: ${error.message}`,
          user: null,
        };
      }
    },

    // Delete User
    deleteUser: async (parent, { id }, context) => {
      const { dataSources } = context;
      const currentUser = requireRole(context, "admin");

      try {
        await dataSources.users.deleteUser(id);
        return { success: true, message: "User deleted successfully" };
      } catch (error) {
        return { success: false, message: `Delete failed: ${error.message}` };
      }
    },

    // Add Todo
    addTodo: async (parent, { request }, context) => {
      const { dataSources } = context;
      requireAuth(context);

      try {
        const newTodo = await dataSources.todos.createTodo({
          ...request,
          user: request.userId,
        });
        return {
          success: true,
          message: "Todo created successfully",
          todo: newTodo,
        };
      } catch (error) {
        return {
          success: false,
          message: `Creation failed: ${error.message}`,
          todo: null,
        };
      }
    },

    // Update Todo
    updateTodo: async (parent, { request }, context) => {
      const { dataSources } = context;
      const currentUser = requireAuth(context);
      const { id, update } = request;

      const todo = await dataSources.todos.getTodoById(id);
      if (!todo) throw new Error("Todo not found");

      // Check ownership
      if (
        todo.user.toString() !== currentUser.userId &&
        currentUser.role !== "admin"
      ) {
        throw new Error("Unauthorized to update this todo");
      }

      try {
        const updatedTodo = await dataSources.todos.updateTodo(id, update);
        return {
          success: true,
          message: "Todo updated successfully",
          todo: updatedTodo,
        };
      } catch (error) {
        return {
          success: false,
          message: `Update failed: ${error.message}`,
          todo: null,
        };
      }
    },

    // Delete Todo
    deleteTodo: async (parent, { id }, context) => {
      const { dataSources } = context;
      const currentUser = requireAuth(context);

      const todo = await dataSources.todos.getTodoById(id);
      if (!todo) throw new Error("Todo not found");

      if (
        todo.user.toString() !== currentUser.userId &&
        currentUser.role !== "admin"
      ) {
        throw new Error("Unauthorized to delete this todo");
      }

      try {
        const deletedId = await dataSources.todos.deleteTodo(id);
        return {
          success: true,
          message: "Todo deleted successfully",
          deletedId,
        };
      } catch (error) {
        return {
          success: false,
          message: `Delete failed: ${error.message}`,
          deletedId: null,
        };
      }
    },
  },

  // Relationship resolvers
  User: {
    todos: async (parent, args, { dataSources }) => {
      return await dataSources.todos.getTodosByUser(parent._id);
    },
  },

  Todo: {
    user: async (parent, args, { dataSources }) => {
      return await dataSources.users.getUserById(parent.user);
    },
  },
};

export default resolvers;
