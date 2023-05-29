package vn.viettelprinting.vpp.modules.EncryptionUtils;



import android.content.Context;
import android.text.TextUtils;


import javax.crypto.spec.SecretKeySpec;




import static java.nio.charset.StandardCharsets.UTF_8;

public class BaseApplication {

    private static BaseApplication mInstance;

    public static synchronized BaseApplication getInstance() {
        return mInstance;
    }

    //public static final String CRYPT_KEY_PREF = "CRYPT_KEY_PREF";
    //private static SecretKeySpec skeySpec;// = new SecretKeySpec("r8t-TbKl20XF5W#Q".getBytes(UTF_8), "AES");
    public static SecretKeySpec getCRYPT_KEY(Context context) {
        String key = vn.viettelprinting.vpp.modules.EncryptionUtils.Constant.getKey(context,vn.viettelprinting.vpp.modules.EncryptionUtils.Constant.PREF_KSPEC);
        if (!TextUtils.isEmpty(key)) {
            return new SecretKeySpec(key.getBytes(UTF_8), "AES");
        }
        return new SecretKeySpec("error".getBytes(UTF_8), "AES");
    }

    public static byte[] getINIT_VECTOR(Context context) {
        String key = vn.viettelprinting.vpp.modules.EncryptionUtils.Constant.getKey(context, vn.viettelprinting.vpp.modules.EncryptionUtils.Constant.PREF_VEC);
        if (!TextUtils.isEmpty(key)) {
            return key.getBytes(UTF_8);
        } else {
            return "".getBytes(UTF_8);
        }
    }

}
