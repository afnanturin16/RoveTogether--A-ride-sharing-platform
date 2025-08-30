const userModel = require('../models/user.model');

module.exports.createUser = async ({ firstname, lastname, email, password, role }) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    console.log("UserService - Creating user with role:", role);
    console.log("UserService - Role type:", typeof role);

    const userData = {
        fullname: { firstname, lastname },
        email,
        password,
        role: role || 'user'
    };

    console.log("UserService - Final user data:", { ...userData, password: '[HIDDEN]' });

    const user = await userModel.create(userData);

    console.log("UserService - User created:", { 
        _id: user._id, 
        email: user.email, 
        role: user.role,
        fullname: user.fullname 
    });

    return user;
};
