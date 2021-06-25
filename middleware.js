const {
  livestockSchema,
  FarmStockSchema,
  taskSchemaEdit,
  cropSchemaEdit,
  livestockSchemaEdit,
  mortalitySchema,
  eggSchema,
  cropSchema,
  eventSchema,
  taskSchema,
  userSchema,
  fieldSchema,
  expenseSchema,
  incomeSchema,
  weightSchema,
  feedSchema,
  matingSchema,
  parturitionSchema,
  breederSchema,
  inputSchema,
  treatmentSchema
} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.validateLivestock = (req, res, next) => {
  const { error } = livestockSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateFarmstock = (req, res, next) => {
  const { error } = FarmStockSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateBreeder = (req, res, next) => {
  const { error } = breederSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateInput = (req, res, next) => {
  const { error } = inputSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateTreatment = (req, res, next) => {
  const { error } = treatmentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateMating = (req, res, next) => {
  const { error } = matingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateParturition = (req, res, next) => {
  const { error } = parturitionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateFeed = (req, res, next) => {
  const { error } = feedSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateWeight = (req, res, next) => {
  const { error } = weightSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateLivestockEdit = (req, res, next) => {
  const { error } = livestockSchemaEdit.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateEgg = (req, res, next) => {
  const { error } = eggSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateMortality = (req, res, next) => {
  const { error } = mortalitySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateCrop = (req, res, next) => {
  const { error } = cropSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateCropEdit = (req, res, next) => {
  const { error } = cropSchemaEdit.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateEvent = (req, res, next) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateTaskEdit = (req, res, next) => {
  const { error } = taskSchemaEdit.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateField = (req, res, next) => {
  const { error } = fieldSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateIncome = (req, res, next) => {
  const { error } = incomeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateExpense = (req, res, next) => {
  const { error } = expenseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAnAdmin = async (req, res, next) => {
  if (req.user === undefined || (req.user && req.user.isAdmin === false)) {
    req.flash(
      "error",
      "You don't have permision to do this, login as an admin"
    );
    return res.redirect("/user/login");
  }

  next();
};
module.exports.sortDlisplay = async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length) {
    // initialize an empty array to store our db options (objects) in
    let dbOptions;
    const options = {
      page: req.query.page || 1,
      limit: 100,
      sort: { createdAt: -1 },
    };

    let {
      asc,
      des,
      byname,
      bycategory,
      bydate,
      bydatedes,
      byamount,
      dline,
      sDate,
      bytask,
      byquantity,
    } = req.query;

    if (asc) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { date: -1 },
        
      };
    }
    if (des) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { date: 1 },
      };
    }
    if (dline) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { deadline: -1 },
      };
    }
    if (sDate) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { startDate: -1 },
      };
    }
    if (bytask) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { task: -1 },
      };
    }
    if (byamount) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { amount: 1 },
      };
    }
    if (byquantity) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { quantity: 1 },
      };
    }
    if (byname) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { name: -1 },
      };
    }
    if (bycategory) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { category: -1 },
      };
    }
    if (bydate) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { createdAt: -1 },
      };
    }
    if (bydatedes) {
      dbOptions = {
        page: req.query.page || 1,
        limit: 100,
        sort: { createdAt: 1 },
        
      };
    }
    res.locals.dbOption = dbOptions
    

    //queryKeys.splice(queryKeys.indexOf("page"), 1);
    //const delimiter = queryKeys.length ? "&" : "?";

    //res.locals.paginateUrl =
    // req.originalUrl.replace(/(\?|\&)page=\d+/g, "") + `${delimiter}`;
  }

  next();
};

module.exports.searchAndFilter = async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length) {
    // initialize an empty array to store our db queries (objects) in
    const dbQueries = [];

    // destructure all potential properties from req.query

    let {
      search,
      amount,
      date,
      batch,
      breed,
      sire,
      dam,
      name,
      category,
      dateFilter,
      sex,
      age,
      event,
      status,
      task,
      healthStatus,
      productionStage,
    } = req.query;

    // check if search exists, if it does then we know that the user
    // submitted the search/filter form with a search query
    if (search) {
      // convert search to a regular expression and
      // escape any special characters
      search = new RegExp(escapeRegExp(search), "gi");
      // create a db query object and push it into the dbQueries array
      // now the database will know to search the title, description, and location
      // fields, using the search regular expression
      //dbQueries is an array which consist of 2 objects, 1st object consist of another object with $or operator that consist of an array, d 2nd {} of dbQueries consist of 1 {} i.e {creator: req.user._id}
      dbQueries.push({
        $and: [{ $or: [
          { name: search },
          { crop: search },
          { source: search },
          { variety: search },
          { field: search },
          { tag: search },
          { batch: search },
        ]},
        {creator: req.user.farmId}]
       
      });
    }

    if (name) {
      //filter(name);
      dbQueries.push({$and: [{name: { $in: name }}, {creator: req.user.farmId} ]  });
    }
    if (sex) {
      dbQueries.push({$and: [{sex: { $in: sex }}, {creator: req.user.farmId} ]  });
    }
    if (batch) {
      dbQueries.push({$and: [{batch: { $in: batch }}, {creator: req.user.farmId} ]  });
    }
   if (event) {
      dbQueries.push({$and: [{event: { $in: event }}, {creator: req.user.farmId} ]  });
    }
     if (task) {
      dbQueries.push({$and: [{task: { $in: task }}, {creator: req.user.farmId} ]  });
    }
    if (status) {
      dbQueries.push({$and: [{status: { $in: status }}, {creator: req.user.farmId} ]  });
    }
     if (sire) {
      dbQueries.push({$and: [{sire: { $in: sire }}, {creator: req.user.farmId} ]  });
    }
     if (dam) {
      dbQueries.push({$and: [{dam: { $in: dam }}, {creator: req.user.farmId} ]  });
    }
     if (breed) {
      dbQueries.push({$and: [{breed: { $in: breed }}, {creator: req.user.farmId} ]  });
    }
     if (category) {
      dbQueries.push({$and: [{category: { $in: category }}, {creator: req.user.farmId} ]  });
    }
     if (productionStage) {
      dbQueries.push({$and: [{productionStage: { $in: productionStage }}, {creator: req.user.farmId} ]  });
    }
    if (healthStatus) {
      dbQueries.push({$and: [{healthStatus: { $in: healthStatus }}, {creator: req.user.farmId} ]  });
    }

    if (amount) {
      /*
				check individual min/max values and create a db query object for each
				then push the object into the dbQueries array
				min will search for all post documents with price
				greater than or equal to ($gte) the min value
				max will search for all post documents with price
				less than or equal to ($lte) the min value
			*/
      if (amount.min) dbQueries.push({$and:  [{amount: { $gte: amount.min }}, {creator: req.user.farmId}]});
      if (amount.max) dbQueries.push({$and:  [{amount: { $gte: amount.max }}, {creator: req.user.farmId}]});
    }
    if (date) {
      /*
				check individual min/max values and create a db query object for each
				then push the object into the dbQueries array
				min will search for all post documents with price
				greater than or equal to ($gte) the min value
				max will search for all post documents with price
				less than or equal to ($lte) the min value
			*/
      if (date.from) dbQueries.push({$and:  [{date: { $gte: new Date(date.from) }}, {creator: req.user.farmId}]});
      if (date.to) dbQueries.push({$and:  [{date: { $gte: new Date(date.to) }}, {creator: req.user.farmId}]});
    }

    if (dateFilter) {
      dbQueries.push({$and:  [{date: { $gte: new Date(dateFilter) }}, {creator: req.user.farmId}]});
    }
    if (age) {
      dbQueries.push({$and: [{age: { $in: age }}, {creator: req.user.farmId} ]  });
    }
    // pass database query to next middleware in route's middleware chain
    // which is the postIndex method from /controllers/postsController.js
    res.locals.dbQuery ={ $and:  dbQueries} 
  }
  // pass req.query to the view as a local variable to be used in the searchAndFilter.ejs partial
  // this allows us to maintain the state of the searchAndFilter form
  res.locals.query = req.query;
  // build the paginateUrl for paginatePosts partial
  // first remove 'page' string value from queryKeys array, if it exists
  queryKeys.splice(queryKeys.indexOf("page"), 1);
  /*
		now check if queryKeys has any other values, if it does then we know the user submitted the search/filter form
		if it doesn't then they are on /farmstock or a specific page from /farmstock, e.g., /farmstock?page=2
		we assign the delimiter based on whether or not the user submitted the search/filter form
		e.g., if they submitted the search/filter form then we want page=N to come at the end of the query string
		e.g., /farmstock?search=surfboard&page=N
		but if they didn't submit the search/filter form then we want it to be the first (and only) value in the query string,
		which would mean it needs a ? delimiter/prefix
		e.g., /farmstock?page=N
		*N represents a whole number greater than 0, e.g., 1
	*/
  const delimiter = queryKeys.length ? "&" : "?";
  // build the paginateUrl local variable to be used in the paginatePosts.ejs partial
  // do this by taking the originalUrl and replacing any match of ?page=N or &page=N with an empty string
  // then append the proper delimiter and page= to the end
  // the actual page number gets assigned in the paginatePosts.ejs partial
  res.locals.paginateUrl =
    req.originalUrl.replace(/(\?|\&)page=\d+/g, "") + `${delimiter}page=`;

  // move to the next middleware (postIndex method)

  next();
};

module.exports.isValidPassword = async (req, res, next) => {
  const { user } = await User.authenticate()(
    req.user.username,
    req.body.currentPassword
  );
  if (user) {
    // add user to res.locals
    res.locals.user = user;
    // go to next middleware
    next();
  } else {
    // flash an error
    req.flash("error", "Password is incorrect");
    // short circuit the route middleware and redirect to /profile
    return res.redirect("/user/profile");
  }
};

module.exports.changePassword = async (req, res, next) => {
  // destructure new password values from req.body object
  const { newPassword, passwordConfirmation } = req.body;

  // check if new password values exist
  if (newPassword && passwordConfirmation) {
    // destructure user from res.locals
    const { user } = res.locals;
    // check if new passwords match
    if (newPassword === passwordConfirmation) {
      // set new password on user object
      await user.setPassword(newPassword);
      // go to next middleware
      next();
    } else {
      // flash error
      req.flash("error", "Password do not match");
      // short circuit the route middleware and redirect to /profile
      return res.redirect("/user/profile");
    }
  } else {
    // go to next middleware
    next();
  }
};

