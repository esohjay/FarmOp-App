$(document).ready(function () {
  $(".ui.dropdown").dropdown();
  $(".sidebar-menu-toggler").on("click", function () {
    let target = $(this).data("target");
    $(target)
      .sidebar({
        dinPage: true,
        transition: "overlay",
        mobileTransition: "overlay",
      })
      .sidebar("toggle");
  });

  $(".tag").dropdown({
    allowAdditions: true,
  });
  $(".ui.checkbox").checkbox();
  $(".combo.dropdown").dropdown({
    action: "combo",
  });
  $(".ui.accordion").accordion();
});
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
  $('.ui.dropdown').dropdown();
  $('.ui.accordion').accordion();

  // bind "hide and show vertical menu" event to top right icon button 
  $('.ui.toggle.button').click(function() {
    $('.ui.vertical.menu').toggle("250", "linear")
  });
});