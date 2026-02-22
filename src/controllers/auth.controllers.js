const userModel = require("../models/users.models.js");
const jwt = require("jsonwebtoken");
async function registerController(req, res) {
    const { name, email, password } = req.body;
    const isEmailExist = await userModel.findOne({ email: email });
    if (isEmailExist) {
        return res.status(422).json({ message: "Email already exists with email", success: false });
    }
    const user = await userModel.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token)
    res.status(201).json({ message: "User registered successfully", success: true, user: { _id: user._id, name: user.name, email: user.email }, token })
}
/*
 * -User Login Controller
 
 */
async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "User not found with this email", success: false })
    }
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return res.status(401).json({ message: "Invalid password", success: false })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token)
    res.status(200).json({ message: "User logged in successfully", success: true, user: { _id: user._id, name: user.name, email: user.email }, token })

}



module.exports = { registerController, loginController }