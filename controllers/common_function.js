exports.action_menu_edit_del = (id, url_name) => {
  let menu =
    "<div class='list-icons'> " +
    "<div class='dropdown'> " +
    "<a href='#' class='list-icons-item' data-toggle='dropdown'> " +
    "<i class='icon-menu9'></i> " +
    "</a> " +
    "<div class='dropdown-menu dropdown-menu-right'> " +
    "<a href='/admin/quiz/" +
    url_name +
    "/edit/" +
    id +
    "' class='dropdown-item'><i class='icon-pencil5'></i> Edit</a> " +
    "<a data-delete-id='" +
    id +
    "' href='javascript:void(0);' id='delete' class='dropdown-item'><i class='icon-trash-alt'></i> Delete</a> " +
    "</div> " +
    "</div> " +
    "</div>";
  return menu;
};

exports.action_menu_edit_del2 = (id, url_name) => {
  let menu =
    "<div class='list-icons'> " +
    "<div class='dropdown'> " +
    "<a href='#' class='list-icons-item' data-toggle='dropdown'> " +
    "<i class='icon-menu9'></i> " +
    "</a> " +
    "<div class='dropdown-menu dropdown-menu-right'> " +
    "<a href='/admin/quiz/" +
    url_name +
    "/edit/" +
    id +
    "' class='dropdown-item'><i class='icon-pencil5'></i> Edit</a> " +
    "<a data-delete-id='" +
    id +
    "' href='javascript:void(0);' id='delete' class='dropdown-item'><i class='icon-trash-alt'></i> Delete</a> " +
    "</div> " +
    "</div> " +
    "</div>";
  return menu;
};
