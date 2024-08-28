package com.example.paima_gps_ar

import android.annotation.SuppressLint
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.walletconnect.web3.modal.client.Web3Modal
import com.walletconnect.web3.modal.client.models.request.Request
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch


@Suppress("DEPRECATION")
@SuppressLint("LogNotTimber")
class PaimaBridge internal constructor(private val wv: WebView, private val activity: MainActivity) {
    private var waiting: String = ""

    class PaimaBridge_Location(val locations: List<LocationModel>){}

    object PaimaBridgeEvents {
        private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
        private val _wcEventModels: MutableSharedFlow<PaimaBridge_Location> = MutableSharedFlow()
        val wcEventModels: SharedFlow<PaimaBridge_Location> = _wcEventModels.asSharedFlow()

        fun emit(data: PaimaBridge_Location) {
            scope.launch {
                _wcEventModels.emit(data)
            }
        }
    }

    companion object {
        @SuppressLint("SetJavaScriptEnabled")
        fun createJSRuntime(activity: MainActivity): Pair<WebView, PaimaBridge> {
            val wv = WebView(activity.baseContext)
            val settings: WebSettings = wv.settings
            settings.javaScriptEnabled = true
            settings.allowFileAccessFromFileURLs = true //Maybe you don't need this rule
            settings.allowUniversalAccessFromFileURLs = true
            val wvi = PaimaBridge(wv, activity)
            wv.addJavascriptInterface(wvi, "Android")
            val url = "file:///android_asset/index.html"
            wv.webViewClient = object : WebViewClient() {
                @Deprecated("Deprecated in Java")
                override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                    Log.d("APPX", "[shouldOverrideUrlLoading] $url")
                    view.loadUrl(url)
                    return true
                }

                override fun onPageFinished(view: WebView, url: String) {
                    Log.d("APPX", "[onPageFinished] $url")
                }
            }
            wv.webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                    Log.d("APPX", "[JSRuntime] " + consoleMessage.message())
                    return true
                }
            }
            wv.loadUrl(url)
            return Pair(wv, wvi)
        }
    }

    fun signFinish (signature: String) {
        val script = "window.asyncCallback('$waiting', '$signature');"
        Log.d("APPX", "$script FINISH SIGNATURE $wv")
        wv.evaluateJavascript(script) { res ->
            Log.d("APPX", "[signFinish] $res")
        }
    }

    @JavascriptInterface
    fun updateLocations() {
        try {
            val script = "window.getLocations();"
            wv.evaluateJavascript(script) { res ->
                Log.d("APPX", "[updateLocations] $res")
            }
        } catch (e:Error) {
            Log.d("APPX", "[not ready] $e")
        }
    }

    @JavascriptInterface
    fun locationUpdate(payload: String) {
        activity.runOnUiThread {
            Log.d("APPX", "locationUpdate $payload")
            val typeToken = object : TypeToken<List<LocationModel>>() {}.type
            val gson = Gson()
            var location = gson.fromJson<List<LocationModel>>(payload, typeToken)
            Log.d("APPX", "$location")

            PaimaBridgeEvents.emit(PaimaBridge_Location(locations = location))
        }
    }

    @JavascriptInterface
    fun query(name: String, code: String, args: String) {
        //Your code here
            activity.runOnUiThread {
                try {
                    Log.d("APPX", "query $name $code $args")
                    var script = ""
                    if (name == "updateFee") {
                        script = "window.asyncCallback('$code', '1');"
                    }
                    if (name == "getTransactionCount") {
                        val wallet = Web3Modal.getAccount()
                        val address = wallet?.address ?: ""
                        Web3Modal.request(
                            request = Request(
                                method = "eth_getTransactionCount",
                                params = "[\"$address\",\"latest\"]",
                            ),
                            onSuccess = { res ->
                                Log.d("APPX", "[r-success] $res")
                            },
                            onError = { error ->
                                Log.d("APPX", "[r-error] $error")
                            })
                        Web3Modal
                    }
                    if (name == "getAddress") {
                        val wallet = Web3Modal.getAccount()
                        val address = wallet?.address ?: ""
                        script = "window.asyncCallback('$code', '$address');"
                    }
                    if (name == "signMessage") {
                        val wallet = Web3Modal.getAccount()
                        val address = wallet?.address ?: ""

                        Web3Modal.request(
                            request = Request(
                                method = "personal_sign",
                                params = "[\"$args\",\"$address\"]",
                            ),
                            onSuccess = { res -> // :Sign.Model.SentRequest ->
                                Log.d("APPX", "[r-success] $res")
                            },
                            onError = { error ->
                                Log.d("APPX", "[r-error] $error")
                            })
                        waiting = code
                    }
                    if (script != "") {
                        Log.d("APPX", "[BRIDGE] $script")
                        wv.evaluateJavascript(script) { res ->
                            Log.d("APPX", "res-final $res")
                        }
                    }
                } catch (e: Error) {
                    Log.d("APPX", "[error-wv]$e")
                }
            }
    }
}