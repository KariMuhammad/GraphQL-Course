import User from '../Models/UserModel.js';
import Todo from '../Models/TodoModel.js';
import { users as factoryUsers, todos as factoryTodos } from './factories.js';
import { hashPassword } from '../Utils/auth.js';

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Todo.deleteMany({});
        
        const createdUsersMap = new Map();

        // Create users
        for (const userData of factoryUsers) {
            const hashedPassword = await hashPassword(userData.password);
            const user = new User({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: 'user'
            });
            const savedUser = await user.save();
            createdUsersMap.set(userData.id, savedUser._id);
        }

        // Create todos
        for (const todoData of factoryTodos) {
            const userId = createdUsersMap.get(todoData.userId);
            if (userId) {
                const todo = new Todo({
                    title: todoData.title,
                    status: todoData.completed ? 'completed' : 'pending',
                    user: userId
                });
                await todo.save();
            }
        }

        console.log('Database seeded successfully and linked correctly');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

export default seedData;