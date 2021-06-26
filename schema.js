const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension)
module.exports.livestockSchema = Joi.object({
 
  animal: Joi.object({
    batch: Joi.string().required().escapeHTML(),
    breed: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    source: Joi.string().required().escapeHTML(),
    category: Joi.string().required().escapeHTML(),
    quantity: Joi.number().required(),
      dateOfArrival: Joi.date().required(),
    //image: Joi.string(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
});



module.exports.FarmStockSchema = Joi.object({
 
  farmstock: Joi.object({
    tag: Joi.string().required().escapeHTML(),
    breed: Joi.string().required().escapeHTML(),
    category: Joi.string().escapeHTML(),
    sex: Joi.string().required().escapeHTML(),
     dob: Joi.date().required(),
    sire: Joi.string().escapeHTML(),
    healthStatus: Joi.string().required().escapeHTML(),
    productionStage: Joi.string().required().escapeHTML(),
    dam: Joi.string().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.breederSchema = Joi.object({
 
  breeder: Joi.object({
    tag: Joi.string().required().escapeHTML(),
    breed: Joi.string().required().escapeHTML(),
    category: Joi.string().escapeHTML(),
    sex: Joi.string().required().escapeHTML(),
     dob: Joi.date().required(),
    sire: Joi.string().escapeHTML(),
   
    dam: Joi.string().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.matingSchema = Joi.object({
 
  breed: Joi.object({
    exposedDate: Joi.date().required(),
   
    sire: Joi.string().required().escapeHTML(),
   
    
  }).required(),
});
module.exports.parturitionSchema = Joi.object({
 
  breed: Joi.object({
    parturitionDate: Joi.date().required(),
   
    litterNo: Joi.number().required(), 
   
    
  }).required(),
});


module.exports.cropSchema = Joi.object({
  
  crop: Joi.object({
    crop: Joi.string().required().escapeHTML(),
    variety: Joi.string().required().escapeHTML(),
    field: Joi.string().required().escapeHTML(),
    date: Joi.date().required(),
    description: Joi.string().required().escapeHTML(),
    //image: Joi.string(),
    description: Joi.string().required().escapeHTML(),
    coverage: Joi.string().required().escapeHTML(),
  }).required(),
});



module.exports.eventSchema = Joi.object({
  event: Joi.object({
    event: Joi.string().required().escapeHTML(),
    leader: Joi.string().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    note: Joi.string().required().escapeHTML(),
    date: Joi.date(),
  }).required(),
});

module.exports.incomeSchema = Joi.object({
  income: Joi.object({
    income: Joi.string().required().escapeHTML(),
    amount: Joi.number().required(),
    note: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    date: Joi.date(),
  }).required(),
});

module.exports.inputSchema = Joi.object({
  input: Joi.object({
    inputType: Joi.string().required().escapeHTML(),
     inputName: Joi.string().required().escapeHTML(),
    quantity: Joi.number().required(),
    cost: Joi.number().required(),
    note: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    date: Joi.date(),
  }).required(),
});

module.exports.treatmentSchema = Joi.object({
  treatment: Joi.object({
    dose: Joi.string().required().escapeHTML(),
     treatmentName: Joi.string().required().escapeHTML(),
    drug: Joi.string().required().escapeHTML(),
    cost: Joi.number().required(),
    note: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    date: Joi.date(),
  }).required(),
});

module.exports.expenseSchema = Joi.object({
  expense: Joi.object({
    expense: Joi.string().required().escapeHTML(),
    amount: Joi.number().required(),
    note: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    date: Joi.date(),
  }).required(),
});

module.exports.fieldSchema = Joi.object({
  field: Joi.object({
    name: Joi.string().required().escapeHTML(),
    size: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    ownership: Joi.string().required().escapeHTML(),
    soilType: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.taskSchema = Joi.object({
  task: Joi.object({
    task: Joi.string().required().escapeHTML(),
    leader: Joi.string().escapeHTML(),
     priority: Joi.string().escapeHTML(),
    startDate: Joi.date().required(),
    deadline: Joi.date().required(),
    status: Joi.string().required().escapeHTML(),
    instructions: Joi.string().required().escapeHTML(),
    workers: Joi.array().single(),
    name: Joi.string().required().escapeHTML(),
  }).required(),
});


module.exports.userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().escapeHTML(),
  fname: Joi.string().required().escapeHTML(),
  lname: Joi.string().required().escapeHTML(),
  phone: Joi.number().required(),
  email: Joi.string().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
  sex: Joi.string().escapeHTML(),
  role: Joi.string().escapeHTML(),
  roleDescription: Joi.string().escapeHTML(),
});
module.exports.mortalitySchema = Joi.object({
  mortality: Joi.object({
    cause: Joi.string().required().escapeHTML(),

    amount: Joi.number().required(),
    date: Joi.date().required(),
  }).required(),
});

module.exports.eggSchema = Joi.object({
  egg: Joi.object({
    quantity: Joi.number().required(),
    date: Joi.date().required(),
  }).required(),
});

module.exports.feedSchema = Joi.object({
  feed: Joi.object({
    quantity: Joi.number().required(),
    brand: Joi.string().required().escapeHTML(),
  }).required(),
});
module.exports.weightSchema = Joi.object({
  weight: Joi.object({
    weight: Joi.number(),
    initWeight: Joi.number(),
    date: Joi.date(),
  }).required(),
});
