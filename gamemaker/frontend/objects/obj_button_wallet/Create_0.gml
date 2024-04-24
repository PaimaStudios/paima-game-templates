/// @description Set description and action

event_inherited();

if (mode == 0) {
    button_text = "EVM";
} else if (mode == 1) {
    button_text = "Ethers";
} else if (mode == 2) {
    button_text = "Truffle";
} else if (mode == 3) {
    button_text = "Cardano";
} else if (mode == 4) {
    button_text = "Polkadot";
} else if (mode == 5) {
    button_text = "Algorand";
}

function activate_button() {
    // Cheap trick to avoid intermediaries: pass `self` so `.mode` works.
    // Otherwise we'd have to create a JS object {"mode":N} on the JS side.
    show_debug_message("userWalletLogin starting...");
    PaimaMW("userWalletLogin")({"mode": mode})[$"then"](function(result) {
        show_debug_message("userWalletLogin finished");
        if (result.success) {
            show_debug_message(" -> success");
        } else {
            show_debug_message(" -> error #{0}: {1}", result.errorCode, result.errorMessage);
        }
    });
    show_debug_message("userWalletLogin started");
}
