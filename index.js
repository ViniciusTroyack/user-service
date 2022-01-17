//Necessary imports
import express from "express";
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcryptjs';


//Instantiating the app from express
const app = express();

//APP configuration for all routes below
app.use(express.json());

//Database for all users
const database = [];

//Token config object
const tokenConfig = {
    secret: "my_random_secret_key",
    expiresIn: "1h",
};


//User model using a yup schema
const userSchema = yup.object().shape({
    id: yup.string().default(() => { return uuidv4(); }).transform(() => { return uuidv4(); }),
    username: yup.string().required().min(3)
        .matches(
            /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
            "Enter full name"),
    email: yup.string().required().email(),
    age: yup.number().required(),
    password: yup.string().required().matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Invalid password format: minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
    createdOn: yup.date().default(() => { return new Date(); })
});


//Login model using a yup schema
const loginSchema = yup.object().shape({
    username: yup.string().required().min(3)
        .matches(
            /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
            "Invalid name format"),
    password: yup.string().required()
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Invalid password format: minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        )
});


/*
*Data validation middleware to create a new user
*Data received from the request body
*
*Param:
*   Schema for data values validation    
*/
const validate = (schema) => async (req, res, next) => {
    const userData = req.body;
    try {
        const userValidatedData = await schema.validate(userData, { abortEarly: false, stripUnknown: true });
        req.userValidatedData = userValidatedData;
        next();
    } catch (e) {
        res.status(422).json({ error: e.errors.join(', ') });
    }
};


/*
*Authorization verify middleware
*
*Middleware to protect routes for
*users not logged into the application
*/
const authenticateUser = (req, res, next) => {

    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, tokenConfig.secret, (err, decoded) => {

        if (err) {
            return res.status(401).json({ 'message': 'Invalid Token' });
        }

        let user = database.find(user => user.username === decoded.username);

        req.user = user;

        return next();
    });
};


/*
*Route for listing all users in the database
*
*Returns an array containing all users,
*/
app.get('/users', authenticateUser, (req, res) => {
    res.status(200).json(database);
});


/*
*Route to create a new user
*
*Returns an object with the data
*of the new registered user
*/
app.post('/signup', validate(userSchema), async (req, res) => {
    const newUser = req.userValidatedData;

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashedPassword;

    const { password: user_password, ...userWithoutPassword } = newUser;

    database.push(newUser);
    res.status(201).json(userWithoutPassword);
});


/*
*User login route
*
*Returns an access token for the user
*/
app.post('/login', validate(loginSchema), async (req, res) => {
    const { username, password } = req.userValidatedData;

    const user = await database.find((user) => user.username === username);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
        { username: username },
        tokenConfig.secret,
        { expiresIn: tokenConfig.expiresIn }
    );

    res.status(200).json({ token });
});


/*
*Route for password change 
*
*Returns a message containing
*the new password
*/
app.put('/users/:id/password', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const logedUser = req.user;

    const hashedPassword = await bcrypt.hash(password, 10);
    const userIndex = database.findIndex((user) => user.id === id);

    if (logedUser.id !== id) {
        return res.status(403).json({ message: "access denied" });
    } else if (userIndex === -1) {
        return res.status(404).json({ message: "User id not found" });
    }

    database[userIndex].password = hashedPassword;

    return res.status(204).send();
});


//Call for the app to act on port 3000
app.listen(3000);