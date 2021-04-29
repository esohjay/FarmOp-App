
      $('.ui.dropdown')
  .dropdown()
   $('.tag')
  .dropdown({
    allowAdditions: true
  })
  $(document).ready(function() {
  $('.computer.only .dropdown.item')
    .popup({
      inline     : true,
      hoverable  : true,
      position   : 'bottom left',
      delay: {
        show: 300,
        hide: 800
      }
    })
  ;
 
  $('.ui.accordion').accordion();

  // bind "hide and show vertical menu" event to top right icon button 
  $('.ui.toggle.button').click(function() {
    $('.ui.vertical.menu').toggle("250", "linear")
  });
});

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })

  $(function () {
    $("#test").click(function () {
      $(".test").modal('show')
    });
    $(".test").modal({
  closable: true
})
  })

   $(function () {
    $(".eventBtns").click(function () {
      $(".eventBtn").modal('show')
    });
    $(".eventBtn").modal({
  closable: true
})
  })

   $(function () {
    $(".taskBtns").click(function () {
      $(".taskBtn").modal('show')
    });
    $(".taskBtn").modal({
  closable: true
})
  })

  $(function () {
    $(".incomeBtns").click(function () {
      $(".incomeBtn").modal('show')
    });
    $(".incomeBtn").modal({
  closable: true
})
  })
  $(function () {
    $(".expenseBtns").click(function () {
      $(".expenseBtn").modal('show')
    });
    $(".expenseBtn").modal({
  closable: true
})
  })
  $(function () {
    $(".mortalityBtns").click(function () {
      $(".mortalityBtn").modal('show')
    });
    $(".mortalityBtn").modal({
  closable: true
})
  })
  $(function () {
    $(".eggBtns").click(function () {
      $(".eggBtn").modal('show')
    });
    $(".eggBtn").modal({
  closable: true
})
  })

  $(function () {
    $(".feedBtns").click(function () {
      $(".feedBtn").modal('show')
    });
    $(".feedBtn").modal({
  closable: true
})
  })
  $(function () {
    $(".livestockBtns").click(function () {
      $(".livestockBtn").modal('show')
    });
    $(".livestockBtn").modal({
  closable: true
})
  })

  $(function () {
    $(".weightBtns").click(function () {
      $(".weightBtn").modal('show')
    });
    $(".weightBtn").modal({
  closable: true
})
  })




$('.regFormValidate')
  .form({
    fields: {
      inline: true,
      username: {
        identifier: 'username',
        rules: [
          {
            type   : 'regExp[/^[a-z0-9_-]{4,16}$/]',
            prompt : 'Please enter a 4-16 letter username'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          },
          {
            type   : 'minLength[6]',
            prompt : 'Your password must be at least {ruleValue} characters'
          },
          
        ]
      },
      confirmpw: {
        identifier: 'confirmPW',
        rules: [
          {
            type   : 'match[password]',
            prompt : 'Must be the same with password'
          },
          
        ]
      },
      email: {
        identifier  : 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid e-mail'
          }
        ]
      },
      
      firstname: {
        identifier: 'fname',
        rules: [
          {
            type   : 'empty',
            prompt : 'Enter your First name'
          },
          
        ]
      },
      lastname: {
        identifier: 'lname',
        rules: [
          {
            type   : 'empty',
            prompt : 'Enter your Last name'
          },
          
        ]
      },
      phone: {
        identifier: 'phone',
        rules: [
          {
            type   : 'empty',
            prompt : 'Input your phone number'
          }
        ]
      }
    }
  });
$('.myFormValidate')
  .form({
    fields: {
      age     : 'empty',
      sex   : 'empty',
      tag : 'empty',
      source :  'empty',
      pstage   :  'empty',
      hStatus    : 'empty',
       qty  : 'empty',
        category  : 'empty',
        field : 'empty',
        coverage: 'empty',
        name: 'empty',
        description : 'empty',
        variety: 'empty',
        date: 'empty',
        imageadd: 'empty',
        event: 'empty',
        leader: 'empty',
        remark: 'empty',
        income: 'empty',
        expense: 'empty',
        receipt: 'empty',
        amount: 'empty',
        note: 'empty',
        task: 'empty',
        startDate: 'empty',
        deadline: 'empty',
        worker: 'empty',
        status: 'empty',
        location: 'empty',
        ownership: 'empty',
         size: 'empty',
        soilType: 'empty',
        cause: 'empty',
        egg: 'empty',
        eggDay: 'empty',
        brand: 'empty',
        quantity: 'empty'
    }
  })
;
$(document).ready(function(){
  $(".owl-carousel").owlCarousel({item: 1});
});