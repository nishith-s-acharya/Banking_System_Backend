# 🏦 Banking System — Mistakes Log
> **Trigger keyword: `enchain`** — Use this word to generate this README of all mistakes made during the project.

---

## ⚡ Mistake 7 — `select:false` password not fetched in login
**File:** `src/controllers/auth.controllers.js`

### ❌ Wrong
```js
const user = await userModel.findOne({email});
// user.password = undefined → bcrypt.compare(password, undefined) → ERROR!
// Error: Illegal arguments: string, undefined
```

### ✅ Correct
```js
const user = await userModel.findOne({email}).select("+password");
// explicitly request the password field even though select:false
```

### 💡 Lesson
When a schema field has `select: false`, it is **excluded from ALL queries** by default (for security). But during login, you NEED the password to compare it. Use `.select("+password")` to explicitly include it only when required.


**File:** `src/db/db.js`

### ❌ Wrong
```js
await mongoose.connnect(process.env.MONGO_DB_URI); // 3 n's
```

### ✅ Correct
```js
await mongoose.connect(process.env.MONGO_DB_URI); // 2 n's
```

### 💡 Lesson
Always double-check method spellings. A typo like `connnect` causes the catch block to fire, printing "Failed to connect to the Database" — which can be confusing to debug.

---

## Mistake 2 — Space before `=` in `.env` file
**File:** `.env`

### ❌ Wrong
```env
MONGO_DB_URI =mongodb+srv://...   ← space before =
```

### ✅ Correct
```env
MONGO_DB_URI=mongodb+srv://...    ← no space
```

### 💡 Lesson
In `.env` files, **never put a space before or after the `=` sign**. A space causes `dotenv` to fail parsing the variable name, making `process.env.MONGO_DB_URI` return `undefined`.

---

## Mistake 3 — `timestamps: true` placed inside schema fields
**File:** `src/models/users.models.js`

### ❌ Wrong
```js
const userSchema = new mongoose.Schema({
    name: { ... },
    email: { ... },
    password: { ... },
    timestamps: true   // ← WRONG: Mongoose treats this as a field of type `true`
})
```

### ✅ Correct
```js
const userSchema = new mongoose.Schema({
    name: { ... },
    email: { ... },
    password: { ... },
}, { timestamps: true })  // ← Correct: second argument = schema options
```

### 💡 Lesson
`timestamps` is a **schema option**, not a field. It must be passed as the **second argument** to `mongoose.Schema()`. When placed inside the fields object, Mongoose throws:
```
TypeError: Invalid schema configuration: `true` is not a valid type at path `timestamps`
```

---

## Mistake 4 — Misplaced closing `}` in controller function
**File:** `src/controllers/auth.controllers.js`

### ❌ Wrong
```js
async function registerController(req, res) {
    ...
    const user = await userModel.create({ name, email, password })};  // ← } closes function here!
    const token = jwt.sign(...);   // ← this code is OUTSIDE the function now
    res.status(201).json({ ... })  // ← this too
                                   // ← missing closing } for the function
module.exports = { registerController }
```

### ✅ Correct
```js
async function registerController(req, res) {
    ...
    const user = await userModel.create({ name, email, password });  // ← just a semicolon
    const token = jwt.sign(...);
    res.status(201).json({ ... })
}   // ← function closes here properly

module.exports = { registerController }
```

### 💡 Lesson
Be careful with `}` and `};` — a misplaced `}` closes the function early, leaving code dangling outside the function body. This causes syntax errors or unexpected behavior.

---

## Mistake 5 — Wrong middleware order in Express
**File:** `src/app.js`

### ❌ Wrong
```js
const app = express();
app.use("/api/auth", authRouter);  // ← router registered FIRST
app.use(express.json());           // ← body parser too late!
app.use(cookieParser());           // ← cookie parser too late!
```

### ✅ Correct
```js
const app = express();
app.use(express.json());           // ← parse body FIRST
app.use(cookieParser());           // ← parse cookies FIRST
app.use("/api/auth", authRouter);  // ← THEN register routes
```

### 💡 Lesson
Express processes middleware **top to bottom**. If routes are registered before `express.json()`, then `req.body` will be `undefined` inside your controllers. **Always register body/cookie parsers before routes.**

---

## Mistake 6 — Using `next` in async Mongoose pre-hook (Mongoose 6+)
**File:** `src/models/users.models.js`

### ❌ Wrong
```js
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // next is undefined → TypeError!
    this.password = await bcrypt.hash(this.password, 10);
    next(); // also undefined → TypeError!
})
```

### ✅ Correct
```js
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // just return
    this.password = await bcrypt.hash(this.password, 10);
    // No next() needed — Mongoose handles async hooks automatically
})
```

### 💡 Lesson
In **Mongoose 6+**, when using `async` functions in pre-hooks, `next` is **not passed as a parameter**. The async function's resolved Promise signals Mongoose to continue. Calling `next()` will throw `TypeError: next is not a function`.

| Mongoose Version | Style |
|---|---|
| v5 (old) | `pre("save", function(next) { ...; next(); })` |
| v6+ (new) | `pre("save", async function() { ... })` |

---

## Summary Table

| # | File | Mistake | Fix |
|---|---|---|---|
| 1 | `db.js` | `mongoose.connnect` (3 n's) | `mongoose.connect` (2 n's) |
| 2 | `.env` | `KEY =value` (space before =) | `KEY=value` (no space) |
| 3 | `users.models.js` | `timestamps:true` inside schema fields | Move to 2nd argument: `{timestamps:true}` |
| 4 | `auth.controllers.js` | Misplaced `}` closing function early | Place `}` after all function code |
| 5 | `app.js` | Router registered before middleware | Register `express.json()` before routes |
| 6 | `users.models.js` | `async` pre-hook using `next()` | Remove `next`, just `return` |
