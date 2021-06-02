$(".message .close").on("click", function () {
  $(this).closest(".message").transition("fade");
});

$(function () {
  $("#test").click(function () {
    $(".test").modal("show");
  });
  $(".test").modal({
    closable: true,
  });
});

$(function () {
  $(".eventBtns").click(function () {
    $(".eventBtn").modal("show");
  });
  $(".eventBtn").modal({
    closable: true,
  });
});

$(function () {
  $(".taskBtns").click(function () {
    $(".taskBtn").modal("show");
  });
  $(".taskBtn").modal({
    closable: true,
  });
});

$(function () {
  $(".incomeBtns").click(function () {
    $(".incomeBtn").modal("show");
  });
  $(".incomeBtn").modal({
    closable: true,
  });
});
$(function () {
  $(".expenseBtns").click(function () {
    $(".expenseBtn").modal("show");
  });
  $(".expenseBtn").modal({
    closable: true,
  });
});
$(function () {
  $(".mortalityBtns").click(function () {
    $(".mortalityBtn").modal("show");
  });
  $(".mortalityBtn").modal({
    closable: true,
  });
});
$(function () {
  $(".eggBtns").click(function () {
    $(".eggBtn").modal("show");
  });
  $(".eggBtn").modal({
    closable: true,
  });
});

$(function () {
  $(".feedBtns").click(function () {
    $(".feedBtn").modal("show");
  });
  $(".feedBtn").modal({
    closable: true,
  });
});
$(function () {
  $(".livestockBtns").click(function () {
    $(".livestockBtn").modal("show");
  });
  $(".livestockBtn").modal({
    closable: true,
  });
});

$(function () {
  $(".weightBtns").click(function () {
    $(".weightBtn").modal("show");
  });
  $(".weightBtn").modal({
    closable: true,
  });
});

$(".regFormValidate").form({
  fields: {
    inline: true,
    username: {
      identifier: "username",
      rules: [
        {
          type: "regExp[/^[a-z0-9_-]{4,16}$/]",
          prompt: "Please enter a 4-16 letter username",
        },
      ],
    },
    password: {
      identifier: "password",
      rules: [
        {
          type: "empty",
          prompt: "Please enter a password",
        },
        {
          type: "minLength[6]",
          prompt: "Your password must be at least {ruleValue} characters",
        },
      ],
    },
    confirmpw: {
      identifier: "confirmPW",
      rules: [
        {
          type: "match[password]",
          prompt: "Must be the same with password",
        },
      ],
    },
    email: {
      identifier: "email",
      rules: [
        {
          type: "email",
          prompt: "Please enter a valid e-mail",
        },
      ],
    },

    firstname: {
      identifier: "fname",
      rules: [
        {
          type: "empty",
          prompt: "Enter your First name",
        },
      ],
    },
    lastname: {
      identifier: "lname",
      rules: [
        {
          type: "empty",
          prompt: "Enter your Last name",
        },
      ],
    },
    phone: {
      identifier: "phone",
      rules: [
        {
          type: "empty",
          prompt: "Input your phone number",
        },
      ],
    },
  },
});
$(".myFormValidate").form({
  fields: {
    age: "empty",
    sex: "empty",
    tag: "empty",
    source: "empty",
    pstage: "empty",
    hStatus: "empty",
    qty: "empty",
    category: "empty",
    field: "empty",
    coverage: "empty",
    name: "empty",
    description: "empty",
    variety: "empty",
    date: "empty",
    //imageadd: "empty",
    event: "empty",
    leader: "empty",
    remark: "empty",
    income: "empty",
    expense: "empty",
    receipt: "empty",
    amount: "empty",
    note: "empty",
    task: "empty",
    startDate: "empty",
    deadline: "empty",
    worker: "empty",
    status: "empty",
    location: "empty",
    ownership: "empty",
    size: "empty",
    soilType: "empty",
    cause: "empty",
    egg: "empty",
    eggDay: "empty",
    brand: "empty",
    quantity: "empty",
  },
});

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({ item: 1 });
});

let newPasswordValue;
let confirmationValue;
const submitBtn = document.getElementById("update-profile");
const newPassword = document.getElementById("new-password");
const confirmation = document.getElementById("password-confirmation");
const validationMessage = document.getElementById("validation-message");
function validatePasswords(message, add, remove) {
  validationMessage.textContent = message;
  validationMessage.classList.add(add);
  validationMessage.classList.remove(remove);
}
confirmation.addEventListener("input", (e) => {
  e.preventDefault();
  newPasswordValue = newPassword.value;
  confirmationValue = confirmation.value;
  if (newPasswordValue !== confirmationValue) {
    validatePasswords("Passwords must match!", "color-red", "color-green");
    submitBtn.setAttribute("disabled", true);
  } else {
    validatePasswords("Passwords match!", "color-green", "color-red");
    submitBtn.removeAttribute("disabled");
  }
});
