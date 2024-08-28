package com.example.paima_gps_ar

import com.google.gson.annotations.SerializedName

data class LocationModel (

    @SerializedName("latitude"    ) var latitude    : Double? = null,
    @SerializedName("longitude"   ) var longitude   : Double? = null,
    @SerializedName("title"       ) var title       : String? = null,
    @SerializedName("description" ) var description : String? = null,
    @SerializedName("wallet"      ) var wallet      : String? = null

)