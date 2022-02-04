// create puzzle tiles
for (let i = 0; i < 24; i++) {
  $("#puzzlegrid").append(`<button class="tile" id="tile-${i+1}" disabled>${i+1}</button>`);
}
// add empty tile
$("#puzzlegrid").append(`<button class="tile" id="tile-empty" disabled></button>`);

// position background image
$(".tile:not(#tile-empty)").each(function(i) {
  x = i % 5;
  y = Math.floor(i / 5);
  // tiles 11, 16, and 21 are slightly off in positioning
  $(this).css("background-position", ((i == 10 | i == 15 | i == 22 ? -41 : - 40) - x * 89) + "px " + (-40 - y * 88) + "px");
});

// randomly order tiles
$("#puzzle-start").click(function() {
 $("#puzzlegrid").addClass("in-play").html($(".tile").sort(function() { 
    return Math.random() - 0.5;
  }));
  getEmptyTileIndex();
  checkTileCanMove();
  $(this).html("Restart puzzle");
});

// get current position of empty tile
function getEmptyTileIndex() {
  var emptyTileIndex = $("#puzzlegrid").find("#tile-empty").index(); 
  return emptyTileIndex;
}

// identify tiles directly above, below, to the left and right of the empty
// tile
function checkTileCanMove() {
  $("#puzzlegrid.in-play .tile").each(function(i) {
    $(this).removeClass("can-move").prop("disabled", true);
    if (getEmptyTileIndex() % 5 == 0) {
      if (i - 1 == getEmptyTileIndex()) {
         $(this).addClass("can-move").prop("disabled", false);
      }
    } else if (getEmptyTileIndex() % 5 == 4) {
      if (i + 1 == getEmptyTileIndex()) {
         $(this).addClass("can-move").prop("disabled", false);
      }
    } else {
      if (i + 1 == getEmptyTileIndex() | i - 1 == getEmptyTileIndex()) {
         $(this).addClass("can-move").prop("disabled", false);
      }      
    }
    if (i + 5 == getEmptyTileIndex() | i - 5 == getEmptyTileIndex()) {
      $(this).addClass("can-move").prop("disabled", false);
    }
  });
};

// no action when non playable tile is clickd
$("#puzzlegrid.in-play .tile:not(.can-move)").click(function(event) {
  event.preventDefault();
});

// swap playable tile with empty tile
$("#puzzlegrid").on("click", ".tile.can-move", function() {
  var a = getEmptyTileIndex();
  var b = $(this).index();
  if (a == 0) {
    $("#tile-empty").insertBefore($(this).parent().find(".tile").eq(b)); 
    $(this).insertBefore($(this).parent().find(".tile").eq(0));  
  } else if (b == 0) {
    $("#tile-empty").insertBefore($(this).parent().find(".tile").eq(0));
    $(this).insertAfter($(this).parent().find(".tile").eq(a));  
  } else if (a - b == 1) {
    $("#tile-empty").insertAfter($(this).parent().find(".tile").eq(b-1));
  } else if (b - a == 1) {
    $("#tile-empty").insertAfter($(this).parent().find(".tile").eq(b));
  } else {
    $("#tile-empty").insertBefore($(this).parent().find(".tile").eq(b)); 
    if (a > b) {
      $(this).insertAfter($(this).parent().find(".tile").eq(a));    
    } else {
      $(this).insertBefore($(this).parent().find(".tile").eq(a));
    }
  };
  var tileArray = $(".tile");
  let result = true;
  // check if all tiles are in correct position
  for (let i = 0; i < tileArray.length; i++) {
    var tile = tileArray[i];
    var a = $(tile).attr("id").slice(5);
    if (a == "empty") {a = "25"};
    var b = ($(tile).index() + 1).toString();
    if (a !== b) {
      result = false;
      break;
    };
  };
  if (result == true) {
    alert("YOU WIN!");
  };
  checkTileCanMove();
});
