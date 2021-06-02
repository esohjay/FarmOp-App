if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

const animalRoutes = require("./routes/animal");
const allAnimalsRoutes = require("./routes/allAnimals");
const breedingRoutes = require("./routes/breeding");
const actionRoutes = require("./routes/livestockActions");
const newBreederRoutes = require("./routes/newBreeder");
const offspringRoutes = require("./routes/offspring");
const batchMemberRoutes = require("./routes/batchmember");
const cropRoutes = require("./routes/crop");

//for all animal task
const taskRoutes = require("./routes/task");

const mortalityRoutes = require("./routes/mortality");

const eggRoutes = require("./routes/egg");

//for events associated with each animal
const eventRoutes = require("./routes/event");

//for tasks associated with each animal
const animalTaskRoutes = require("./routes/animalTask");

//for events associated with each crop
const cropEventRoutes = require("./routes/cropEvent");

//for tasks associated with each crop
const indiviCropTaskRoutes = require("./routes/individualCTask");

const fieldRoutes = require("./routes/field");
const feedRoutes = require("./routes/feed");
const weightRoutes = require("./routes/weight");

//for all animal income
const incomeRoutes = require("./routes/income");

//for individual animal income
const animalIncomeRoutes = require("./routes/animalIncome");

//for individual animal expense
const animalExpenseRoutes = require("./routes/animalExpense");

//for all animal expense
const expenseRoutes = require("./routes/expense");

const userRoute = require("./routes/user");
const reportRoute = require("./routes/report");

//for all animal events
const animalActivitiesRoute = require("./routes/animalActivities");

//for all crop events
const cropActivitiesRoute = require("./routes/cropActivities");

//for individual crop income
const cropIncomeRoutes = require("./routes/cropIncome");

//for individual crop expense
const cropExpenseRoutes = require("./routes/cropExpense");

//for all crop expense
const cropExpenditureRoutes = require("./routes/cropexpenditure");

//for all crop income
const cropInflowRoutes = require("./routes/cropinflow");

//for all crop tasks
const cropTaskRoutes = require("./routes/cropTask");

const dbUrl = "mongodb://localhost:27017/farmapp";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = "coded";

const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/animal", animalRoutes);
app.use("/farmstock", allAnimalsRoutes);
app.use("/breeder", newBreederRoutes);
app.use("/animal/:id/batchmember", batchMemberRoutes);
app.use("/farmstock/:id", actionRoutes);
app.use("/breeder/:id/breeding", breedingRoutes);
app.use("/breeder/:id/offspring", offspringRoutes);
app.use("/crop", cropRoutes);

//for individual crop income
app.use("/crop/:id/income", cropIncomeRoutes);

//for all crop income
app.use("/cropinflow", cropInflowRoutes);

//for individual crop expense
app.use("/crop/:id/expense", cropExpenseRoutes);

//for all crop expenses
app.use("/cropexpense", cropExpenditureRoutes);

//for all animal task
app.use("/task", taskRoutes);

app.use("/animal/:id/mortality", mortalityRoutes);
app.use("/animal/:id/egg", eggRoutes);

//for events associated with each animal
app.use("/animal/:id/event", eventRoutes);

//for tasks associated with each animal
app.use("/animal/:id/task", animalTaskRoutes);

//for events associated with each crop
app.use("/crop/:id/event", cropEventRoutes);

//for events associated with each crop
app.use("/crop/:id/task", indiviCropTaskRoutes);

app.use("/field", fieldRoutes);

//for individual animal expense
app.use("/animal/:id/income", animalIncomeRoutes);

//for all animal income
app.use("/income", incomeRoutes);

//for individual animal expense
app.use("/animal/:id/expense", animalExpenseRoutes);

//for all animal expense
app.use("/expense", expenseRoutes);

app.use("/animal/:id/feed", feedRoutes);
app.use("/animal/:id/weight", weightRoutes);
app.use("/", userRoute);
app.use("/report", reportRoute);

//for all crop tasks
app.use("/croptask", cropTaskRoutes);

//for all animal events
app.use("/event", animalActivitiesRoute);

//for all crop events
app.use("/cropevent", cropActivitiesRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
