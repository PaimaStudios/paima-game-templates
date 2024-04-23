/// @description Draw button UI

draw_self();  // We're handling it.
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color(c_black);
draw_text(floor(x + sprite_width / 2), floor(y + sprite_height / 2), button_text);
