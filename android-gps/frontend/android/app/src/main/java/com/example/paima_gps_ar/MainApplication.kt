package com.example.paima_gps_ar

import android.annotation.SuppressLint
import android.app.Application
import android.util.Log
import com.walletconnect.android.Core
import com.walletconnect.android.CoreClient
import com.walletconnect.android.relay.ConnectionType
import com.walletconnect.sign.client.Sign
import com.walletconnect.sign.client.SignClient
import com.walletconnect.web3.modal.client.Modal
import com.walletconnect.web3.modal.client.Web3Modal
import com.walletconnect.web3.modal.utils.EthUtils
import startSignDelegate

@SuppressLint("LogNotTimber")
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.d("APPX", "OM CREATE")
        initWalletConnect(this)
    }
    fun initWalletConnect(app: Application) {
        val connectionType = ConnectionType.AUTOMATIC
        val projectId = "42475eab5b4f340567edcc3c83b392a3" // Get Project ID at https://cloud.walletconnect.com/
        val appMetaData = Core.Model.AppMetaData(
            name = "Paima GPS",
            description = "Paima GPS Demo",
            url = "android-gps.paimastudios.com",
            icons = listOf("https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Gradient/Icon.png"),
            redirect = "paimagps://request",
        )

        Log.d("APPX", "APP META DATA" + appMetaData)
        CoreClient.initialize(
            onError = { error ->
                Log.d("APPX", "[error] " + error)
                // Error will be thrown if there's an issue during initialization
            },
            projectId = projectId,
            connectionType = connectionType,
            application = app,
            metaData = appMetaData
        )
        SignClient.initialize(init = Sign.Params.Init(core = CoreClient)) {
            error ->
            Log.d("APPX", "[error] " + error)
        }

        Web3Modal.initialize(
            init = Modal.Params.Init(CoreClient),
            onSuccess = {
                Log.d("APPX", "[success] ")
                // Callback will be called if initialization is successful
            },
            onError = { error ->

                Log.d("APPX", "[error] " + error)
                // Error will be thrown if there's an issue during initialization
            }
        )

        val chains = listOf(
            Modal.Model.Chain(
                chainName = "Hardhat",
                chainNamespace = "eip155",
                chainReference = "31337",
                requiredMethods = EthUtils.ethRequiredMethods + "eth_getTransactionCount",
                optionalMethods = EthUtils.ethOptionalMethods,
                events = EthUtils.ethEvents,
                token = Modal.Model.Token(name = "Local", symbol = "LOC", decimal = 18),
                rpcUrl = "http://192.168.100.6.sslip.io:8545", // "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
                blockExplorerUrl = ""
            )
        )
        Web3Modal.setChains(chains)

//        val init = Sign.Params.Init(core = CoreClient)
//        SignClient.initialize(init) { error ->
//            Log.d("APPX", "sign error " + error)
//            // Error will be thrown if there's an issue during initialization
//        }
        startSignDelegate()


    }
}