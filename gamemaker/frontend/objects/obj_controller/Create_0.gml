/// @description Init room controller.

walletAddress = "";
walletStatus = "";
experience = "";
blockHeight = 0;

timer = 0;

game_set_speed(30, gamespeed_fps);

function on_wallet_connected(walletAddress) {
    self.walletAddress = walletAddress;
    update_status_label();
}

function update_log_label() {
    inst_log.text = PaimaMW("exportLogs")();
}

function update_status_label() {
    inst_state_label.text = $"Status:\nBlock height: {blockHeight}\nWallet: {walletAddress}\nExperience: {experience}\n";
}

update_status_label();
