/*
 * Copyright (C) 2014 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

package com.ten.ibo;

import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.SurfaceTexture;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.VideoView;

//import com.ten.ibo.widget.ITextureView;

import com.ten.ibo.widget.togglebutton.ToggleButtonBase;

import java.io.IOException;

/*
 * MainActivity class that loads {@link MainFragment}.
 */
public class MainActivity extends Activity implements SurfaceHolder.Callback {

    private Context mContext;
    private RelativeLayout mParent;
//    private ITextureView mITextureView;

    private String videoUrl = "http://ivi.bupt.edu.cn/hls/cctv5.m3u8"; //http://vd3.bdstatic.com/mda-if5vf4ajrxgbrxui/sc/mda-if5vf4ajrxgbrxui.mp4";
//    private String videoUrl = "http://ivi.bupt.edu.cn/hls/cctv5hd.m3u8"; //http://vd3.bdstatic.com/mda-if5vf4ajrxgbrxui/sc/mda-if5vf4ajrxgbrxui.mp4";
//    private String videoUrl = "http://vd3.bdstatic.com/mda-if5vf4ajrxgbrxui/sc/mda-if5vf4ajrxgbrxui.mp4";
//    private String videoUrl = "http://vd3.bdstatic.com/mda-ig0wemib2civ2hfe/sc/mda-ig0wemib2civ2hfe.mp4";


    MediaPlayer mediaPlayer;
    VideoView videoView;
    SurfaceView surfaceView;

    public static void show(Context context, int type) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.putExtra("type", type);
        context.startActivity(intent);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = getBaseContext();

        int type = getIntent().getIntExtra("type", 1);


        switch (type) {
            case 1:
                videoView = findViewById(R.id.videoview);
                playByVideoView();
                break;
            case 2:
                initview();
                break;
            case 3:
                initSurfaceView();
                break;
        }


    }

    private void initSurfaceView() {

        surfaceView = findViewById(R.id.surfaceview);
        surfaceView.getHolder().addCallback(this);

    }


    private void playByVideoView() {
        String url = videoUrl;//"http://tanzi27niu.cdsb.mobi/wps/wp-content/uploads/2017/05/2017-05-17_17-33-30.mp4";
        videoView.setVideoURI(Uri.parse(url));
        videoView.start();
    }

    private void initview() {
//        mParent = (RelativeLayout) findViewById(R.id.parent);
////
////        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(450, 450);
////
////        mITextureView = new ITextureView(mContext);
////        mITextureView.setLayoutParams(params);
////
////        mParent.addView(mITextureView);
////
////        mITextureView.setOnClickListener(new View.OnClickListener() {
////            @Override
////            public void onClick(View v) {
////                ObjectAnimator.ofFloat(mITextureView, "rotationY", 0, 180, 0).setDuration(3000).start();
////            }
////        });


        TextureView textureView = findViewById(R.id.textureview);


        textureView.setSurfaceTextureListener(new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {

                if (mediaPlayer == null) {
                    mediaPlayer = new MediaPlayer();
                    mediaPlayer.setSurface(new Surface(surface));//设置播放窗口
                    new PlayVideo().start();
//                    play();

                }

            }

            @Override
            public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {
            }

            @Override
            public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
//                mediaPlayer.pause();
//                mediaPlayer.stop();
//                mediaPlayer.reset();

                return false;
            }

            @Override
            public void onSurfaceTextureUpdated(SurfaceTexture surface) {
            }
        });

    }







    private void playVideo(String url) {
        try {

            mediaPlayer.reset();
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);

            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mediaPlayer.start();
                }
            });

            mediaPlayer.setDataSource(this, Uri.parse(url));
//            mediaPlayer.prepare(); // 同步
            mediaPlayer.prepareAsync(); // 异步

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {

//        holder.setType(SurfaceHolder.SURFACE_TYPE_GPU);
//        holder.setType(SurfaceHolder.SURFACE_TYPE_HARDWARE);
        holder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);


        mediaPlayer = new MediaPlayer();
//        mediaPlayer.setOnVideoSizeChangedListener(this);
        mediaPlayer.setDisplay(holder);

        playVideo(videoUrl);


    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        super.onDestroy();
//        if (mediaPlayer.isPlaying()) {
//            mediaPlayer.stop();
//        }
        mediaPlayer.release();
        mediaPlayer = null;
    }






    private class PlayVideo extends Thread {
        @Override
        public void run() {

            play();

        }
    }


    protected void play() {
        try {
            String url = videoUrl;//"https://disp.titan.mgtv.com/vod.do?fmt=4&pno=2210&fid=9D24CEA05FDB16879E7E2C4AA1269A19&file=/c1/2018/04/28_0/9D24CEA05FDB16879E7E2C4AA1269A19_20180428_1_1_1253.mp4";
//                String url = "http://wgdcnccdn.inter.qiyi.com/videos/v0/20180429/a9/8a/89fdb5bcc5d1e5babb36322830dd38c0.f4v?key=0b1eb3059afdb8d84feb217638ee40670&dis_k=8235bcfd3011a0e2af9ad8c687d6c697&dis_t=1525067439&src=iqiyi.com&uuid=af2ac1ab-5ae6aeaf-8c&rn=1525067439242&qd_ip=af2ac1ab&qyid=471806807baf0c157a7d9463726cf668&qd_tm=1525067435912&qd_vipdyn=0&cross-domain=1&pri_idc=netcnc_gd_cnc&pv=0.1&qd_aid=1021748700&qd_stert=0&qypid=1021748700_01080031010000000000&qd_p=af2ac1ab&qd_uid=0&qd_src=01010031010000000000&qd_index=1&qd_vip=0&qd_tvid=1021748700&qd_vipres=0&qd_k=a8ec7486285d5970dc0aadec00e63018";
//                String url = "http://tanzi27niu.cdsb.mobi/wps/wp-content/uploads/2017/05/2017-05-17_17-33-30.mp4";
            mediaPlayer.setDataSource(url);//添加播放地址
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
//            mediaPlayer.prepare();
//            mediaPlayer.start();

            mediaPlayer.prepareAsync();//进入准备装填
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mediaPlayer.start();
                }
            });//准备播放完成监听

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @Override
    protected void onDestroy() {

        // 回收mediaPlayer
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }

        super.onDestroy();

    }



}
