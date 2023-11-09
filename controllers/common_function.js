exports.action_menu_edit_del = (id, url_name) => {
  let menu =
    "<div class='list-icons'>" +
      "<div class='dropdown'>" +
        "<a href='#' class='list-icons-item' data-toggle='dropdown'>" +
          "<i class='icon-menu9'></i>" +
        "</a>" +
        "<div class='my_dropdown dropdown-menu dropdown-menu-right'> " +
          "<a href='/" + url_name + "/edit/" + id + "' class='my_dropdown_edit dropdown-item'>Edit</a>" +
          "<a data-delete-id='" + id + "' href='javascript:void(0);' id='delete' class='my_dropdown_delete dropdown-item'>Delete</a> " +
        "</div>" + 
      "</div>" +
    "</div>";

  return menu;
};

exports.action_menu_edit_del_question = (id, url_name) => {
  let menu =
    "<div class='list-icons'>" +
      "<div class='dropdown'>" +
        "<a href='#' class='list-icons-item' data-toggle='dropdown'>" +
          "<i class='icon-menu9'></i>" +
        "</a>" +
        "<div class='my_dropdown dropdown-menu dropdown-menu-right'>" +
          "<a data-delete-id='" + id + "' href='javascript:void(0);' id='delete' class='my_dropdown_delete dropdown-item'>Delete</a>" +
        "</div>" +
      "</div>" +
    "</div>";

  return menu;
};

// exports.action_menu_edit_del_question = (id, url_name) => {
//   let menu =
//     "<div class='list-icons'>" +
//       "<div class='dropdown'>" +
//         "<a href='#' class='list-icons-item' data-toggle='dropdown'>" +
//           "<i class='icon-menu9'></i>" +
//         "</a>" +
//         "<div class='my_dropdown dropdown-menu dropdown-menu-right'>" +
//           "<a href='/" + url_name + "/edit/" + id + "' class='my_dropdown_edit dropdown-item'>Edit</a>" + 
//           "<a data-delete-id='" + id + "' href='javascript:void(0);' id='delete' class='my_dropdown_delete dropdown-item'>Delete</a>" +
//         "</div>" +
//       "</div>" +
//     "</div>";

//   return menu;
// };
