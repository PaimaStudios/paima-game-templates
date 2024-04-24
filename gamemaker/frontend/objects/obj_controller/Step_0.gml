/// @description Controller step

if (timer % 60 == 0) {
    PaimaMW("getLatestProcessedBlockHeight")()[$"then"](method(self, function (result) {
        if (result.success) {
            self.blockHeight = result.result;
            update_status_label();
        } else {
            PaimaMW("pushLog")($"getLatestProcessedBlockHeight error: {result.message}");
        }
    }));
}

update_log_label();

timer += 1;
