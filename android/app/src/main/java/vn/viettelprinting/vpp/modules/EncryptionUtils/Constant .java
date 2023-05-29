package vn.viettelprinting.vpp.modules.EncryptionUtils;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;



 class Constant {

    public static final String PREF_VEC = "PREF_VEC";
    public static final String PREF_KSPEC = "PREF_KSPEC";


    public static String getKey(Context context, String KEY) {
        SharedPreferences sharedPref = context.getSharedPreferences("vppapp", Context.MODE_PRIVATE);
        return sharedPref.getString(KEY, "");
    }
}
