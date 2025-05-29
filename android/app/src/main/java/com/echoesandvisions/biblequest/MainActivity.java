package com.echoesandvisions.biblequest;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "BibleQuest";
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private int retryCount = 0;
    private Handler mainHandler;
    private WebView webView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView.setWebContentsDebuggingEnabled(true);

        try {
            Log.i(TAG, "BibleQuest initializing...");
            mainHandler = new Handler(Looper.getMainLooper());

            webView = this.getBridge().getWebView();

            if (webView != null) {
                Log.d(TAG, "WebView initialized successfully");
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                
                Log.d(TAG, "WebView settings configured");

                webView.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                        Log.d(TAG, "WebView Console: " + consoleMessage.message() +
                                " -- From line " + consoleMessage.lineNumber() +
                                " of " + consoleMessage.sourceId());
                        return true;
                    }

                    @Override
                    public void onProgressChanged(WebView view, int newProgress) {
                        Log.d(TAG, "Loading progress: " + newProgress + "%");
                    }
                });

                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                        super.onPageStarted(view, url, favicon);
                        Log.i(TAG, "Started loading: " + url);
                    }

                    @Override
                    public void onPageFinished(WebView view, String url) {
                        super.onPageFinished(view, url);
                        retryCount = 0;
                        Log.i(TAG, "Finished loading: " + url);
                        view.setVisibility(View.VISIBLE);
                    }

                    @Override
                    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                        Log.e(TAG, "WebView error: " + error.getDescription() + " for URL: " + request.getUrl());
                        if (isNetworkAvailable()) {
                            if (retryCount < MAX_RETRY_ATTEMPTS) {
                                retryCount++;
                                Log.w(TAG, "Retrying... Attempt " + retryCount + " of " + MAX_RETRY_ATTEMPTS);
                                mainHandler.postDelayed(view::reload, 2000);
                            } else {
                                showErrorPage(view, error.getDescription().toString(), request.getUrl().toString());
                            }
                        } else {
                            showOfflinePage(view);
                        }
                    }

                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                        Log.d(TAG, "Loading URL: " + request.getUrl());
                        return false;
                    }
                });

                // Make sure the WebView is visible
                webView.setVisibility(View.VISIBLE);
            } else {
                Log.e(TAG, "Bridge WebView is null - this is a critical error");
                Toast.makeText(this, "Failed to initialize app", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Log.e(TAG, "Initialization error: " + e.getMessage(), e);
            Toast.makeText(this, "Error initializing app: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo ni = cm.getActiveNetworkInfo();
        return ni != null && ni.isConnected();
    }

    private void showErrorPage(WebView view, String error, String url) {
        String html = "<html><body style='text-align:center;padding:20px'>" +
                "<h2>Loading Error</h2><p>" + error + "</p><p>" + url + "</p>" +
                "<button onclick='window.location.reload()'>Retry</button>" +
                "</body></html>";
        view.loadData(html, "text/html", "UTF-8");
    }

    private void showOfflinePage(WebView view) {
        String html = "<html><body style='text-align:center;padding:20px'>" +
                "<h2>No Internet</h2><p>Check your connection.</p>" +
                "<button onclick='window.location.reload()'>Retry</button>" +
                "</body></html>";
        view.loadData(html, "text/html", "UTF-8");
    }

    @Override
    public void onResume() {
        super.onResume();
        if (webView != null && !isNetworkAvailable()) {
            showOfflinePage(webView);
        }
    }
}


