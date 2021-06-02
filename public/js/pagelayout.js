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
