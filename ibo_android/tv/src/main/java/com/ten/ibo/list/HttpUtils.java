package com.ten.ibo.list;

import android.app.Activity;
import android.os.Handler;
import android.util.Log;

import com.ten.ibo.AppManager;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Author: cynid
 * Created on 18-7-7 下午2:44
 * Description:
 */
public class HttpUtils {

    private static final String REQUEST_TAG = HttpUtils.class.getSimpleName();
    private static final String USER_AGENT = "Python-urllib/3.4";

    public static Request buildRequest(String url) {
        if (AppManager.isNetworkAvailable()) {
            int maxAge = 60 * 60 * 24; // read from cache for 1 day
            Request request = new Request.Builder()
                    .tag(REQUEST_TAG)
                    .header("User-agent", USER_AGENT)
                    .url(url)
                    .build();
            return request;
        } else {
            int maxStale = 60 * 60 * 24 * 28; // tolerate 4-weeks stale
            Request request = new Request.Builder()
                    .tag(REQUEST_TAG)
                    .header("User-agent", USER_AGENT)
                    .url(url)
                    .build();
            return request;
        }
    }

    public static void asyncGet(String url, Activity activity, Callback callback) {
        Request request = buildRequest(url);
        asyncGet(request, activity, callback);
    }

    public static String syncGet(String url) {
        Request request = buildRequest(url);
        Log.d(REQUEST_TAG, "sync request Url: " + request.toString());
        try {
            Response response = AppManager.getHttpClient().newCall(request).execute();
            if (response.code() == 200) {
                String ret = new String(response.body().bytes(), "utf-8");
                return ret;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void asyncGet(String url, Callback callback) {
        Request request = buildRequest(url);
        asyncGet(request, callback);
    }

    public static void asyncGet(Request request, Callback callback) {
        Log.d(REQUEST_TAG, "async request Url: " + request.toString());
        AppManager.getHttpClient().newCall(request).enqueue(callback);

    }

    public static void asyncGet(Request request, final Activity activity, final Callback callback) {
        Log.d(REQUEST_TAG, "async request Url: " + request.toString());
        AppManager.getHttpClient().newCall(request).enqueue(new Callback() {
            Handler mainHandler = new Handler(activity.getMainLooper());

            @Override
            public void onFailure(final Call call, final IOException e) {
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        callback.onFailure(call, e);
                    }
                });
            }

            @Override
            public void onResponse(final Call call, final Response response) throws IOException {
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            callback.onResponse(call, response);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });
    }

}
