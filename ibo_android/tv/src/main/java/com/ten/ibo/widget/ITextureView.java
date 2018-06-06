package com.ten.ibo.widget;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.widget.RelativeLayout;

import com.ten.ibo.R;

import java.io.IOException;

/**
 * The type Texture view.
 */
public class ITextureView extends TextureView {

    private static final String TAG = ITextureView.class.getName();

    private Context mContext;
    private Uri mUri;
    private MediaPlayer mMediaPlayer;
    private SurfaceView mSurfaceView;
    private SurfaceHolder mHolder;

    /**
     * Instantiates a new Texture view.
     *
     * @param context the context
     */
    public ITextureView(Context context) {
        super(context);
        this.mContext = context;
        this.setSurfaceTextureListener(new IListener());

        mSurfaceView = new SurfaceView(mContext);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(450, 450);
        mSurfaceView.setLayoutParams(params);

        //初始化播放器
        initMediaPlayer();

        mHolder = mSurfaceView.getHolder();
        mHolder.addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                // 这里可以给视频设置加载背景,避免视频加载时出现黑屏
//                relativeLayout.setVisibility(View.GONE);
//                mSurfaceView.setBackgroundResource(R.drawable.loading);

            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
                    mMediaPlayer.stop();
                    mMediaPlayer.release();
                    mMediaPlayer = null;
                }
            }
        });

        Log.d(TAG, "构造函数");
    }

    private void initMediaPlayer() {
        if (mMediaPlayer == null) {
            mMediaPlayer = new MediaPlayer();
        }

        mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
        //mMediaPlayer.setDisplay(holder);
        mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {

            @Override
            public void onCompletion(MediaPlayer mp) {
                Log.d(TAG, "播放完成");
                mMediaPlayer.seekTo(0);
//                pause();
            }
        });


        try {
//            if (mMediaPlayer != null) {
//                mMediaPlayer.stop();
//            }

//                mMediaPlayer.setSurface(mSurface);

            mMediaPlayer.reset();
            String path = "http://112.253.22.160/8/r/v/h/p/rvhphwjmrxmhiegyiycrpzbiugddeu/hc.yinyuetai.com/BDC4016304D6A40327F669C336A3540F.mp4?sc=98da9102851e2e4c&br=781&vid=3201576&aid=21561&area=HT&vst=0&ptp=mv&rd=yinyuetai.com";
            mMediaPlayer.setDataSource(path);
            mMediaPlayer.prepareAsync();
            mMediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    Log.d(TAG, "准备完毕");
                    mMediaPlayer.setDisplay(mHolder);
                    mMediaPlayer.start();
                    mMediaPlayer.seekTo(0);
                    mMediaPlayer.setOnSeekCompleteListener(new MediaPlayer.OnSeekCompleteListener() {
                        @Override
                        public void onSeekComplete(MediaPlayer mp) {
                            mMediaPlayer.pause();
                            //当视频seekTo到0 秒时,去掉加载的背景图片,显示暂停在0秒的视频,避免黑屏
                            mSurfaceView.setBackgroundResource(0);
//                                relativeLayout.setVisibility(View.VISIBLE);
//                                LogUtils.d(TAG, "path::::::2" + path);
                        }
                    });
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    /**
     * Sets uri.
     *
     * @param uri the uri
     */
    public void setUri(Uri uri) {
        this.mUri = uri;
    }


    public class IListener implements TextureView.SurfaceTextureListener {

        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
            Log.d(TAG, "HERE");

        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

        }

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
//            mMediaPlayer.release();
            return false;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture surface) {

        }
    }

}
