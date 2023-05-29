package vn.viettelprinting.vpp.modules.EncryptionUtils;

import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.nio.charset.StandardCharsets;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;

public class EncryptionUtilsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
//    private  String key = "r8t-TbKl20XF5W#Q";
//    private  String iv = "ydhSi54MiLcKpPe-";
    public EncryptionUtilsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String encrypt(String inputData) {
        try {
            IvParameterSpec iv = new IvParameterSpec(BaseApplication.getINIT_VECTOR(this.reactContext));
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, BaseApplication.getCRYPT_KEY(this.reactContext), iv);
            byte[] cipherText = cipher.doFinal(inputData.getBytes(StandardCharsets.UTF_8));
            return Base64.encodeToString(cipherText, Base64.NO_WRAP);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }
    @ReactMethod(isBlockingSynchronousMethod = true)
    public  String decrypt(String inputData) {
        try {
            IvParameterSpec iv = new IvParameterSpec(BaseApplication.getINIT_VECTOR(this.reactContext));
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, BaseApplication.getCRYPT_KEY(this.reactContext), iv);
            byte[] decode = Base64.decode(inputData, Base64.NO_WRAP);
            String decryptString = new String(cipher.doFinal(decode), StandardCharsets.UTF_8);
            return decryptString;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }
    @NonNull
    @Override
    public String getName() {
        return "EncryptionUtilsModule";
    }
}
