import com.walletconnect.sign.client.Sign
import com.walletconnect.sign.client.SignClient

val dappDelegate = object : SignClient.DappDelegate {
    override fun onSessionApproved(approvedSession: Sign.Model.ApprovedSession) {
        // Triggered when Dapp receives the session approval from wallet
    }

    override fun onSessionRejected(rejectedSession: Sign.Model.RejectedSession) {
        // Triggered when Dapp receives the session rejection from wallet
    }

    override fun onSessionAuthenticateResponse(sessionAuthenticateResponse: Sign.Model.SessionAuthenticateResponse) {
        // Triggered when Dapp receives the session authenticate response from wallet
    }

    override fun onSessionUpdate(updatedSession: Sign.Model.UpdatedSession) {
        // Triggered when Dapp receives the session update from wallet
    }

    override fun onSessionExtend(session: Sign.Model.Session) {
        // Triggered when Dapp receives the session extend from wallet
    }

    override fun onSessionEvent(sessionEvent: Sign.Model.SessionEvent) {
        // Triggered when the peer emits events that match the list of events agreed upon session settlement
    }

    override fun onSessionDelete(deletedSession: Sign.Model.DeletedSession) {
        // Triggered when Dapp receives the session delete from wallet
    }

    override fun onSessionRequestResponse(response: Sign.Model.SessionRequestResponse) {
        // Triggered when Dapp receives the session request response from wallet
    }

    override fun onProposalExpired(proposal: Sign.Model.ExpiredProposal) {
        // Triggered when a proposal becomes expired
    }

    override fun onRequestExpired(request: Sign.Model.ExpiredRequest) {
        // Triggered when a request becomes expired
    }

    override fun onConnectionStateChange(state: Sign.Model.ConnectionState) {
        //Triggered whenever the connection state is changed
    }

    override fun onError(error: Sign.Model.Error) {
        // Triggered whenever there is an issue inside the SDK
    }
}

fun startSignDelegate() {
    SignClient.setDappDelegate(dappDelegate);
}