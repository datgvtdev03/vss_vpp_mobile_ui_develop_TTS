package vn.viettelprinting.vpp.modules.printer.thermal.hprt.tp809;

import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.pdf.PdfRenderer;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.os.ParcelFileDescriptor;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import print.Print;


public class HprtTp809PrinterModule extends ReactContextBaseJavaModule {
    final String LOCATION_PERMISSION_NOT_GRANTED = "-100";
    final String IP_OR_PORT_EMPTY = "-200";
    final String CONNECTION_FAILED = "-300";
    final String INVALID_FILE_PATH = "-400";
    final String INVALID_FILE_EXTENSION = "-500";
    final String PRINT_FILE_ERROR = "-600";
    final String READ_FILE_ERROR = "-700";
    final String STATUS_UNKNOWN = "-801";
    final String STATUS_READY = "800";
    final String STATUS_COVER_OPEN = "-802";
    final String STATUS_NO_PAPER = "-803";
    final String STATUS_PAPER_NEAR_END = "-804";
    final String STATUS_NOT_CONNECTED = "-805";
    final String CLOSE_SUCCESS = "900";
    final String CLOSE_FAILURE = "-900";

    ReactApplicationContext reactContext;
    Print Printer = new Print();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public HprtTp809PrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "HprtTp809Printer";
    }

    @ReactMethod
    public void connectViaWifi(String name, final String ip, final String port, final Promise promise) {
        if (ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject(getName(), LOCATION_PERMISSION_NOT_GRANTED);
        } else if (ip.trim().length() == 0 || port.trim().length() == 0) {
            promise.reject(getName(), IP_OR_PORT_EMPTY);
        } else {
            try {
                if (Printer != null) {
                    Print.PortClose();
                    Printer = new Print();
                }
                new Thread() {
                    @Override
                    public void run() {
                        super.run();
                        try {
                            int connectStatus = Print.PortOpen(reactContext, "WiFi," + ip.trim() + "," + port.trim());
                            if (connectStatus != 0) {
                                Printer = null;
                                promise.reject(getName(), CONNECTION_FAILED);
                            } else {
                                promise.resolve(null);
                            }
                        } catch (Exception e) {
                            promise.reject(getName(), CONNECTION_FAILED);
                        }
                    }
                }.start();
            } catch (Exception e) {
                promise.reject(getName(), CONNECTION_FAILED);
            }
        }
    }

    @ReactMethod
    public void getCurrentPrinterStatus(Promise promise) {
        if (!Print.IsOpened()) {
            promise.resolve(STATUS_NOT_CONNECTED);
            return;
        }
        try {
            byte[] bytes = Print.GetRealTimeStatus((byte) 2);
            if ((bytes[0] & 4) == 4) {
                promise.resolve(STATUS_COVER_OPEN);
                return;
            }
            byte[] bytes1 = Print.GetRealTimeStatus((byte) 4);
            if ((bytes1[0] & 96) == 96) {
                promise.resolve(STATUS_NO_PAPER);
                return;
            }
            if ((bytes1[0] & 12) == 12) {
                promise.resolve(STATUS_PAPER_NEAR_END);
                return;
            }
            promise.resolve(STATUS_READY);
        } catch (Exception e) {
            promise.resolve(STATUS_UNKNOWN);
        }
    }

    @ReactMethod
    public void print(ReadableMap options, Promise promise) {
        Log.i(this.getClass().getName(), "start print");
        if (!Print.IsOpened()) {
            promise.reject(getName(), STATUS_NOT_CONNECTED);
            return;
        }
        final String filePath = options.getString("filePath");
        if (filePath == null) {
            promise.reject(getName(), INVALID_FILE_PATH);
            return;
        }
        if (!(filePath.endsWith("png") || filePath.endsWith("jpg") || filePath.endsWith("jpeg") || filePath.endsWith("bmp") || filePath.endsWith("pdf"))) {
            promise.reject(getName(), INVALID_FILE_EXTENSION);
            return;
        }

        final List<Bitmap> bitmaps;
        if (filePath.endsWith("pdf")) {
            bitmaps = convertPdfToBitmap(filePath);
        } else {
            bitmaps = Collections.singletonList(BitmapFactory.decodeFile(filePath));
        }
//        final Bitmap bmp = BitmapFactory.decodeFile(filePath);
        try {
            Print.LanguageEncode = "gb2312";
            final int BITMAP_BLACKW = 0;
            final int BITMAP_SHAKE = 1;
            final int BITMAP_GATHER = 2;
            final int lightness = 0;
            final int[] result = {-1};
            // Print first page

            for (int i = 0; i < bitmaps.size(); i++) {
                Bitmap bmp = bitmaps.get(i);
                Print.PrintBitmap(bmp, BITMAP_BLACKW, lightness); // print black-white, lightness = 0
//                    result[0] = result[0] < 0 ? printImage : result[0] + Math.max(printImage, 0);
                Print.PrintAndFeed(500);

                if (i == bitmaps.size()-1) {
                    Print.CutPaper(Print.PARTIAL_CUT);
                }

                bmp.recycle();
                Thread.sleep(300);
            }


            if (result[0] >= 0) {
                promise.resolve(result[0]);
            } else {
                promise.reject(getName(), PRINT_FILE_ERROR);
            }
        } catch (Exception e) {
            promise.reject(getName(), READ_FILE_ERROR);
        }
    }

    private ArrayList<Bitmap> convertPdfToBitmap(String pdfPath) {
        ParcelFileDescriptor mFileDescriptor;
        PdfRenderer pdfRender = null;
        PdfRenderer.Page page = null;
        ArrayList mlist = new ArrayList<Bitmap>();
        try {
            mFileDescriptor = ParcelFileDescriptor.open(new File(pdfPath), ParcelFileDescriptor.MODE_READ_ONLY);
            if (mFileDescriptor != null) {
                pdfRender = new PdfRenderer(mFileDescriptor);
            }


            assert pdfRender != null;
            if (pdfRender.getPageCount() > 0) {
                for (int i = 0; i < pdfRender.getPageCount(); i++) {
                    if (null != page)
                        page.close();
                    page = pdfRender.openPage(i);
                    Bitmap bmp = Bitmap.createBitmap(574, (574 * page.getHeight()) / page.getWidth(), Bitmap.Config.ARGB_8888);
                    Canvas canvas = new Canvas(bmp);
                    canvas.drawColor(Color.WHITE);
                    canvas.drawBitmap(bmp, 0, 0, null);
                    page.render(bmp, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                    mlist.add(bmp);
                }
            }
            if (null != page)
                page.close();
            mFileDescriptor.close();
            pdfRender.close();
            return mlist;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return mlist;
    }

    @ReactMethod
    public void disconnect(final Promise promise) {
        try {
            if (Printer != null) {
                Print.PortClose();
            }
            promise.resolve(CLOSE_SUCCESS);
        } catch (Exception e) {
            promise.reject(getName(), CLOSE_FAILURE);
        }
    }
}
