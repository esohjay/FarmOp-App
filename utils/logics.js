module.exports.calcAge = function (dob) {
   const birthDay = Date.parse(dob)
   const today = Date.now()
   const age = today - birthDay  
   return  Math.round(age / (1000 * 60 * 60 * 24) )
    
}

module.exports.calcParturition = function (name, matingDate) {
   const mateDay = Date.parse(matingDate)
   const today = Date.now()
   if(name === "Rabbit"){
       const parturition = mateDay + (1000 * 60 * 60 * 24 * 30)
       return parturition.toDateString()
   }
   
    
}

module.exports.setImage = function (name, cond) {
   switch(cond){
        case "Chicken":
          name = { 
            url: "https://cdn.pixabay.com/photo/2020/02/15/04/19/chicken-4849979_960_720.jpg",
             filename: cond };
          break;
          case "Cattle":
          name = { 
            url: "https://cdn.pixabay.com/photo/2016/11/19/12/50/cow-1839118_960_720.jpg",
             filename: cond };
          break;
          case "Goat":
          name = { 
            url: "https://cdn.pixabay.com/photo/2016/08/16/01/19/goat-1596880_960_720.jpg",
             filename: cond };
          break;
          case "Sheep":
          name = { 
            url: "https://cdn.pixabay.com/photo/2019/09/23/19/47/sheep-4499562_960_720.jpg",
             filename: cond };
          break;
          case "Catfish":
          name = { 
            url: "https://cdn.pixabay.com/photo/2020/04/05/16/46/line-of-thorny-catfish-5006846_960_720.jpg",
             filename: cond };
          break;
          case "Rabbit":
          name = { 
            url: "https://cdn.pixabay.com/photo/2015/04/26/15/48/rabbit-740621_960_720.jpg",
             filename: cond };
          break;
          case "Snail":
          name = { 
            url: "https://cdn.pixabay.com/photo/2019/06/03/09/47/snail-4248497_960_720.jpg",
             filename: cond };
          break;
          case "Grasscutter":
          name = { 
            url: "https://cdn.pixabay.com/photo/2017/07/09/22/16/rat-2488378_960_720.jpg",
             filename: cond };
          break;
          case "Guinea Pig":
          name = { 
            url: "https://cdn.pixabay.com/photo/2020/05/16/15/02/animal-5177874_960_720.jpg",
             filename: cond };
          break;
          case "Horse":
          name = { 
            url: "https://cdn.pixabay.com/photo/2016/05/25/13/55/horses-1414889_960_720.jpg",
             filename: cond };
          break;
          case "Donkey":
          name = { 
            url: "https://cdn.pixabay.com/photo/2019/03/17/14/18/donkey-4061043_960_720.jpg",
             filename: cond };
          break;
           case "Guinea Fowl":
          name = { 
            url: "https://cdn.pixabay.com/photo/2020/09/28/08/35/guinea-fowl-5609070_960_720.jpg",
             filename: cond };
          break;
          case "Ostrich":
          name = { 
            url: "https://cdn.pixabay.com/photo/2019/03/03/17/26/bouquet-4032396_960_720.jpg",
             filename: cond };
          break;
          case "Turkey":
          name = { 
            url: "https://cdn.pixabay.com/photo/2016/01/21/20/40/turkey-1154793_960_720.jpg",
             filename: cond };
          break;
          case "Pig":
          name = { 
            url: "https://cdn.pixabay.com/photo/2018/11/23/23/10/pig-3834738_960_720.jpg",
             filename: cond };
          break;
      }
      return name
}

module.exports.setImageAnimal = function (name, cond) {
   switch(cond){
        case "Chicken":
          name = "https://cdn.pixabay.com/photo/2020/02/15/04/19/chicken-4849979_960_720.jpg";
          break;
          case "Cattle":
          name = "https://cdn.pixabay.com/photo/2016/11/19/12/50/cow-1839118_960_720.jpg";
          break;
          case "Goat":
          name ="https://cdn.pixabay.com/photo/2016/08/16/01/19/goat-1596880_960_720.jpg";
          break;
          case "Sheep":
          name = "https://cdn.pixabay.com/photo/2019/09/23/19/47/sheep-4499562_960_720.jpg";
          break;
          case "Catfish":
          name = "https://cdn.pixabay.com/photo/2020/04/05/16/46/line-of-thorny-catfish-5006846_960_720.jpg";
          break;
          case "Rabbit":
          name = "https://cdn.pixabay.com/photo/2015/04/26/15/48/rabbit-740621_960_720.jpg";
          break;
          case "Snail":
          name = "https://cdn.pixabay.com/photo/2019/06/03/09/47/snail-4248497_960_720.jpg";
          break;
          case "Grasscutter":
          name = "https://cdn.pixabay.com/photo/2017/07/09/22/16/rat-2488378_960_720.jpg";
          break;
          case "Guinea Pig":
          name ="https://cdn.pixabay.com/photo/2020/05/16/15/02/animal-5177874_960_720.jpg";
          break;
          case "Horse":
          name = "https://cdn.pixabay.com/photo/2016/05/25/13/55/horses-1414889_960_720.jpg";
          break;
          case "Donkey":
          name = "https://cdn.pixabay.com/photo/2019/03/17/14/18/donkey-4061043_960_720.jpg";
          break;
           case "Guinea Fowl":
          name = "https://cdn.pixabay.com/photo/2020/09/28/08/35/guinea-fowl-5609070_960_720.jpg";
          break;
          case "Ostrich":
          name = "https://cdn.pixabay.com/photo/2019/03/03/17/26/bouquet-4032396_960_720.jpg";
          break;
          case "Turkey":
          name = "https://cdn.pixabay.com/photo/2016/01/21/20/40/turkey-1154793_960_720.jpg";
          break;
          case "Pig":
          name = "https://cdn.pixabay.com/photo/2018/11/23/23/10/pig-3834738_960_720.jpg";
          break;
      }
      return name
}