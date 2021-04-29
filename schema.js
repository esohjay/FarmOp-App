const Joi = require('joi')


   module.exports.livestockSchema = Joi.object({
    animal: Joi.object({
        
        batch: Joi.string().required(),
        breed: Joi.string().required(),
       
        name: Joi.string().required(),
         source: Joi.string().required(),
        
        category: Joi.string().required(),
        quantity: Joi.number().required(),
        dateOfArrival: Joi.date(),
        
        //image: Joi.string(),
        description: Joi.string().required(),
    }).required(),
    
});

module.exports.FarmStockSchema = Joi.object({
    farmstock: Joi.object({
        
        tag: Joi.string().required(),
        breed: Joi.string().required(),
        category: Joi.string(),
        sex: Joi.string().required(),
         dob: Joi.date(),
        sire: Joi.string().required(),
        healthStatus: Joi.string().required(),
        productionStage: Joi.string().required(),
        dam: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    
});



module.exports.cropSchema = Joi.object({
    crop: Joi.object({
      
        crop: Joi.string().required(),
        variety: Joi.string().required(),
       field: Joi.string().required(),
        date: Joi.date().required(), 
        description: Joi.string().required(),
         //image: Joi.string(),
        description: Joi.string().required(),
        coverage: Joi.string().required()
       
    }).required()
})

module.exports.cropSchemaEdit = Joi.object({
    crop: Joi.object({
      
        crop: Joi.string().required(),
        variety: Joi.string().required(),
       field: Joi.string().required(),
        
        description: Joi.string().required(),
         //image: Joi.string(),
        description: Joi.string().required(),
        coverage: Joi.string().required()
       
    }).required()
})

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        event: Joi.string().required(),
        leader: Joi.string().required(),
        name: Joi.string().required(),
       note: Joi.string().required(),
        date: Joi.date()
    }).required(),
    
});

module.exports.incomeSchema = Joi.object({
    income: Joi.object({
        income: Joi.string().required(),
        amount: Joi.number().required(),
       note: Joi.string().required(),
        name: Joi.string().required(),
        date: Joi.date()
    }).required(),
    
});
module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        expense: Joi.string().required(),
        amount: Joi.number().required(),
       note: Joi.string().required(),
       name: Joi.string().required(),
        date: Joi.date()
    }).required(),
    
});

module.exports.fieldSchema = Joi.object({
    field: Joi.object({
        name: Joi.string().required(),
        size: Joi.string().required(),
       location: Joi.string().required(),
       ownership: Joi.string().required(),
        soilType: Joi.string().required()
    }).required(),
    
});

module.exports.taskSchema = Joi.object({
    task: Joi.object({
        task: Joi.string().required(),
        leader: Joi.string().required(),
       startDate: Joi.date().required(),
        deadline: Joi.date().required(),
        status: Joi.string().required(),
        instructions: Joi.string().required(),
        workers: Joi.required(),
         name: Joi.string().required(),
    }).required(),
    
});
module.exports.taskSchemaEdit = Joi.object({
    task: Joi.object({
         status: Joi.string().required(),
    }).required(),
    
});

module.exports.userSchema = Joi.object({
    
        username: Joi.string().min(3).max(30).required(),
        fname: Joi.string().required(),
       lname: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPW: Joi.ref('password')

});
module.exports.mortalitySchema = Joi.object({


     mortality: Joi.object({
        cause: Joi.string().required(),
      
        amount: Joi.number().required(),
        date: Joi.date().required(),
    }).required(),
    
        
        
        
});

  module.exports.eggSchema = Joi.object({
    
        egg: Joi.object({
         quantity: Joi.number().required(),
         date: Joi.date().required()
    }).required(),
       
       

});

module.exports.feedSchema = Joi.object({
    
        feed: Joi.object({
         quantity: Joi.number().required(),
         brand: Joi.string().required()
    }).required(),
  
});
module.exports.weightSchema = Joi.object({
    
        weight: Joi.object({
         weight: Joi.number(),
         initWeight: Joi.number(),
         date: Joi.date()
    }).required(),
    });