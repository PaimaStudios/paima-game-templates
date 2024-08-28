package com.example.paima_gps_ar

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.material3.Card
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.absoluteOffset
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavDeepLink
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import com.example.paima_gps_ar.ui.theme.MyApplicationTheme
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.GoogleMapComposable
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import com.walletconnect.web3.modal.client.Modal
import com.walletconnect.web3.modal.client.Web3Modal
import com.walletconnect.web3.modal.ui.components.button.rememberWeb3ModalState
import com.walletconnect.web3.modal.ui.components.internal.Web3ModalComponent
import kotlinx.coroutines.launch
import kotlin.random.Random
import androidx.navigation.compose.composable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.TextField
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType
import java.util.Date

@SuppressLint("LogNotTimber")
class MainActivity : ComponentActivity() {
    private lateinit var markers: MutableState<List<MarkerState>>
    private var listOfMarkers: List<MarkerState> = mutableListOf()
    private lateinit var paimaBridge: PaimaBridge
    private lateinit var webView: WebView

    @SuppressLint("RestrictedApi")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Start Paima Bridge
        val w = PaimaBridge.createJSRuntime(this);
        webView = w.first;
        paimaBridge = w.second;

        Web3Modal.register(this)

        // Check for intent.
        Log.d("APPX", "deeplink " + intent.dataString)
        paimaBridge.updateLocations()
        setContent { StartUI() }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        Log.d("APPX", "[intent] $intent");
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @SuppressLint("RestrictedApi")
    @Composable
    fun StartUI () {
        // General
        val navController = rememberNavController()
        val coroutineScope = rememberCoroutineScope()

        // Wallet Connect
        val web3modalState = rememberWeb3ModalState(
            coroutineScope = coroutineScope,
            navController = navController
        )
        val modalSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

        // Google Maps
        val openMarker = remember { mutableIntStateOf(-1) }
        markers = remember { mutableStateOf(listOfMarkers) }
        val address = remember { mutableStateOf("") }
        val showDialog = remember { mutableStateOf(false) }

        // Create Dummy Data
        if (markers.value.size === 0) {
            for (i in 1..10) {
//                val randomx = 0.009 - Random(i * 11).nextInt(100) / 5000.0f
//                val randomy = 0.009 - Random(i + 1000).nextInt(100) / 5000.0f
//                val latLng = LatLng(40.7128 + (randomx * i), -74.0060 + (randomy * i))
//                markers.value = remember { markers.value + MarkerState(latLng) }
            }
        }

        LaunchedEffect(Unit) {
            PaimaBridge.PaimaBridgeEvents.wcEventModels.collect { event ->
                Log.d("APPX", "[Location Events] $event")
                event.locations.forEach() { location ->
                    val latLng = LatLng(location.latitude!!, location.longitude!!)
                    markers.value += MarkerState(latLng)
                }
            }
        }
        // Listen to Wallet Connect Events
        // As alternative to deeplinks
        LaunchedEffect(Unit) {
            WalletConnectModalDelegate.wcEventModels.collect { event ->
                Log.d("APPX", "[WalletConnect Event] $event")
                if (event is Modal.Model.SessionRequestResponse && event.result is Modal.Model.JsonRpcResponse.JsonRpcResult) {
                    val signature =  (event.result as Modal.Model.JsonRpcResponse.JsonRpcResult).result;
                    paimaBridge.signFinish(signature);
                }
                if (event is Modal.Model.ApprovedSession.WalletConnectSession) {
                    address.value = event.accounts.get(0)
                    showDialog.value = false; // Manually close dialog
                }
            }
        }

        // UI
        MyApplicationTheme {
            Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->

                if (showDialog.value) {
                    ModalBottomSheet(onDismissRequest = {
                        showDialog.value = false
                    }) {
                        NavHost(
                            navController = navController,
                            startDestination = "x"
                        ) {
                            composable("x") {
                                Web3ModalComponent(
                                    shouldOpenChooseNetwork = true,
                                    closeModal = { coroutineScope.launch { modalSheetState.hide() } }
                                )
                            }
                            // TODO Deeplinks are not working at the timne
                            composable("z", deepLinks = listOf(NavDeepLink("paimamw://request"))) {
                            }
                        }
                    }
                }

                Box(modifier = Modifier.padding(innerPadding)) {
                    StartMap(markers, openMarker)
                    if (openMarker.intValue > 0) {
                        OpenDetail(openMarker)
                    }
                }



                if (address.value == "") {
                    Button(
                        onClick = {
                            showDialog.value = !showDialog.value
                        },
                        modifier = Modifier.absoluteOffset(Dp(20.0f), Dp(20.0f))
                    ) {
                        Text("Connect Wallet")
                    }
                } else {
                    Box(Modifier.background(color = Color(0xAAFFFFAA)).fillMaxWidth().height(40.dp)) {
                        Text(
                            fontSize = TextUnit(10f, TextUnitType.Sp),
                            maxLines = 1,
                            text =address.value,
                            modifier = Modifier.absoluteOffset(Dp(20.0f), Dp(5.0f)),
                        )
                    }
                }

                Button(
                    onClick = {
                        paimaBridge.updateLocations()
                    },
                    modifier = Modifier.absoluteOffset(Dp(20.0f), Dp(80.0f))
                ) {
                    Text("⟳")
                }
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun OpenDetail( openMarker: MutableState<Int>) {
        ModalBottomSheet(onDismissRequest = { openMarker.value = 0 }) {
            Box(modifier = Modifier.height(Dp(140f))) {
                Text(
                    text = "Best Restaurant in the Area",
                    Modifier.offset(Dp(10.0f),Dp(80.0f))
                )
                Text(
                    text = "★★★★★",
                    Modifier.offset(Dp(10.0f),Dp(100.0f))
                )
                // Get random dynamic image
                val id: Int = LocalContext.current.resources
                    .getIdentifier(
                        "d" + openMarker.value,
                        "drawable",
                        LocalContext.current.packageName
                    )
                Image(
                    modifier = Modifier.offset(Dp(10f), Dp(10f)),
                    painter = painterResource(id),
                    contentDescription = ""
                )
            }
        }
    }

    @Composable
    @GoogleMapComposable
    fun DrawMarker(markerState: MarkerState, openMarker: MutableState<Int>) {
        val showDialog = remember { mutableStateOf(false) }
        Marker(
            onClick = { _ ->
                paimaBridge.updateLocations()

                showDialog.value = !showDialog.value
                val i: Int = ((Math.abs(markerState.position.latitude * 1000) + Math.abs(markerState.position.longitude * 1000)).toInt() % 10) + 1
                openMarker.value = i;
                Log.d("APPX", "Clicked on Marker" + openMarker.value)
                false
            },
            state = markerState,
            title = "Restaurant",
            snippet = "Details"
        )
    }

    @Composable
    fun StartMap(markers: MutableState<List<MarkerState>>,
                 openMarker: MutableState<Int>) {
        val nyc = LatLng(40.7128, -74.0060)
        val cameraPositionState = rememberCameraPositionState {
            position = CameraPosition.fromLatLngZoom(nyc, 12f)
        }

        val lon = remember { mutableDoubleStateOf(0.0) }
        val lat = remember { mutableDoubleStateOf(0.0) }
        val create = remember { mutableStateOf("waiting") }
        val text = remember { mutableStateOf("") }

        if (create.value === "yes") {
            webView.evaluateJavascript("window.connect('" + text.value + "', 'description', "+ lat.doubleValue +", " + lon.doubleValue + " )") {
                    res -> Log.d("APPX", "connect response " + res)
            }

            create.value = "waiting"
            text.value = ""

            val latLon = LatLng(lat.doubleValue, lon.doubleValue)
            Log.d("APPX", "Create new marker @ " + latLon)
            markers.value = remember { markers.value + MarkerState(latLon) }
            lon.doubleValue = 0.0
            lat.doubleValue = 0.0
        }
        if (create.value === "no") {
            create.value = "waiting"
            text.value = ""
            lon.doubleValue = 0.0
            lat.doubleValue = 0.0
        }

        if (lon.doubleValue != 0.0) {
            // Call Paima for posting transaction
            DialogNewMarker(
                text = text,
                onDismissRequest = {
                    create.value = "no"
                },
                onConfirmation = {
                    create.value = "yes"
                }
            )
        }

        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            onMapClick = { latLon ->
                paimaBridge.updateLocations()

                lat.doubleValue = latLon.latitude
                lon.doubleValue = latLon.longitude
            }
        ) {
            for (marker in markers.value) {
                DrawMarker(marker, openMarker)
            }
        }
    }


    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun DialogNewMarker(
        onDismissRequest: () -> Unit,
        onConfirmation: () -> Unit,
        text: MutableState<String>,
    ) {
        Dialog(onDismissRequest = {
            onDismissRequest()
        }) {
            // Draw a rectangle shape with rounded corners inside the dialog
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(375.dp)
                    .padding(16.dp),
                shape = RoundedCornerShape(16.dp),
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = "This is a dialog with buttons and an image.",
                        modifier = Modifier.padding(16.dp),
                    )

                    TextField(
                        value = text.value,
                        onValueChange = { it: String -> text.value = it },
                        label = { Text("title") }
                    )
                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                    ) {
                        TextButton(
                            onClick = { onDismissRequest() },
                            modifier = Modifier.padding(8.dp),
                        ) {
                            Text("Dismiss")
                        }
                        TextButton(
                            onClick = {
                                if (text.value != "") {
                                    onConfirmation()
                                }
                            },
                            modifier = Modifier.padding(8.dp),
                        ) {
                            Text("Confirm")
                        }
                    }
                }
            }
        }
    }

}