import User from '../Models/UserModel.js';

class UserDataSource {
  async getAllUsers() {
    return await User.find().select('-password');
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async findUserByEmailOrName(email, name) {
    return await User.findOne({ $or: [{ email }, { name }] });
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return !!deletedUser;
  }
}

export default UserDataSource;
