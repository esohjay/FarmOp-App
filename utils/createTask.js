const CTask = require("../models/cropTask");

const createTask =  function (newTasks, crop, date, name,  s, d, creator) {
    const Tasks = newTasks
    for (let ntask of Tasks) {
        const task = new CTask({
        task: ntask,
        deadline: Date.parse(date) + 1000 * 60 * 60 * 24 * d,
        startDate:  Date.parse(date) + 1000 * 60 * 60 * 24 * s,
        leader: "Not Yet Assigned",
        workers: ["Not Yet Assigned"],
        status: "Pending",
        priority: 'high',
        instructions: "Not yet Started",
        name: name, 
        creator: creator
        })
         crop.push(task)
          task.save();
         
    }
 

}

module.exports = createTask;