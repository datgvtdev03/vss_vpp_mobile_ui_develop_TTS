package vn.viettelprinting.vpp;
import com.facebook.react.bridge.JSIModulePackage; // <- add
import com.swmansion.reanimated.ReanimatedJSIModulePackage; // <- add

import android.annotation.TargetApi;
import android.app.Application;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.microsoft.codepush.react.CodePush;

import vn.viettelprinting.vpp.modules.LoadingNativePackage;
import vn.viettelprinting.vpp.modules.SplashScreenPackage;
import vn.viettelprinting.vpp.modules.callVideo.CallvideoPackage;
import vn.viettelprinting.vpp.modules.printer.laser.LaserPrinterPackage;
import vn.viettelprinting.vpp.modules.printer.thermal.hprt.tp809.HprtTp809PrinterPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new LoadingNativePackage());
            packages.add(new SplashScreenPackage());
            packages.add(new LaserPrinterPackage());
            packages.add(new HprtTp809PrinterPackage());
            packages.add(new CallvideoPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
        @Override
        protected JSIModulePackage getJSIModulePackage() {
          return new ReanimatedJSIModulePackage(); // <- add
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Constants.applicationContext = this;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      createNotificationChannel();
    }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("vn.viettelprinting.vpp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  @TargetApi(26)
  private void createNotificationChannel() {
    NotificationManager notificationManager =
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    int importance = NotificationManager.IMPORTANCE_HIGH;

    String fbChannelId = this.getResources().getString(R.string.default_notification_channel_id);
    CharSequence fbChannelName = this.getResources().getString(R.string.default_notification_channel_id);
    NotificationChannel fbNotificationChannel = new NotificationChannel(fbChannelId, fbChannelName, importance);
    fbNotificationChannel.enableLights(true);
    fbNotificationChannel.enableVibration(true);
    fbNotificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
        fbNotificationChannel.setAllowBubbles(true);
    }
    fbNotificationChannel.setShowBadge(true);

    notificationManager.createNotificationChannel(fbNotificationChannel);
  }
}
