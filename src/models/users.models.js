const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required to create a account!"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address!"],
        unique: [true, "Email already exists!"]
    },
    password: {
        type: String,
        required: [true, "Password is required to create a account!"],
        min_lenth: [6, "password must be at least 6 characters long!"],
        select: false
    },
}, { timestamps: true })


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;