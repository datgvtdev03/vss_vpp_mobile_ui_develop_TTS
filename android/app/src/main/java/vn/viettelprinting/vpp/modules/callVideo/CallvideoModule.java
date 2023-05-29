package vn.viettelprinting.vpp.modules.callVideo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ipccsupportsdk.IPCCSupportSDK;
import com.ipccsupportsdk.InitSDKExeption;
import com.ipccsupportsdk.configs.LiveConfig;

public class CallvideoModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext mContext;
//    private Activity mActivity;
    private IPCCSupportSDK ipccSupportSDK;
    CallvideoModule(ReactApplicationContext context) {
        super(context);
        this.mContext = context;
    }


    @ReactMethod
   public void call(String sdt, Promise promise){
       LiveConfig config = new  LiveConfig(new String[]{"https://sbc0mycc.viettel.vn:8006", "https://sbc1mycc.viettel.vn:8006", "https://sbc2mycc.viettel.vn:8006"},
                        "",
                        "mbccs.mycc.vn",
                        "myviettelstore-xnk",
                        "",
                        "",
                        "voicecall",
                        "videocall",
                        "myCC@2021",
                        false);
       ipccSupportSDK = IPCCSupportSDK.instance;
       ipccSupportSDK.init(this.mContext.getCurrentActivity().getFragmentManager(), this.getCurrentActivity());
       ipccSupportSDK.setLiveConfig(config);
       try {
           ipccSupportSDK.showCallFragment(sdt, () -> promise.resolve(true));
       } catch (InitSDKExeption initSDKExeption) {
           initSDKExeption.printStackTrace();
       }
   }
    @ReactMethod
    public void callvideo(String sdt, Promise promise){
        LiveConfig config = new  LiveConfig(new String[]{"https://sbc0mycc.viettel.vn:8006", "https://sbc1mycc.viettel.vn:8006", "https://sbc2mycc.viettel.vn:8006"},
                        "",
                        "mbccs.mycc.vn",
                        "myviettelstore-xnk",
                        "",
                        "",
                        "voicecall",
                        "videocall",
                        "myCC@2021",
                        false
        );
        ipccSupportSDK = IPCCSupportSDK.instance;
        ipccSupportSDK.init(this.mContext.getCurrentActivity().getFragmentManager(), this.getCurrentActivity());
        ipccSupportSDK.setLiveConfig(config);
        try {
            ipccSupportSDK.showVideoCallFragment(sdt, () -> promise.resolve(true));
        } catch (InitSDKExeption initSDKExeption) {
            initSDKExeption.printStackTrace();
        }
    }
    @ReactMethod(isBlockingSynchronousMethod = true)
    public void chat(String sdt){
        LiveConfig config = new LiveConfig(new String[]{"https://sbc0mycc.viettel.vn:8006", "https://sbc1mycc.viettel.vn:8006", "https://sbc2mycc.viettel.vn:8006"},
                        "",
                        "mbccs.mycc.vn",
                        "myviettelstore-xnk",
                        "",
                        "",
                        "voicecall",
                        "videocall",
                        "myCC@2021",
                        false);
        ipccSupportSDK = IPCCSupportSDK.instance;
        ipccSupportSDK.init(this.mContext.getCurrentActivity().getFragmentManager(), this.getCurrentActivity());
        ipccSupportSDK.setLiveConfig(config);
        try {
            ipccSupportSDK.showChatView(sdt);
        } catch (InitSDKExeption initSDKExeption) {
            initSDKExeption.printStackTrace();
        }
    }
    @NonNull
    @Override
    public String getName() {
        return "CallvideoModule";
    }
}
