/*
 * Copyright (C) 2017 The Android Open Source Project
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

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;

/**
 * Handles video playback with media controls.
 */
public class PlaybackVideoFragment extends Fragment {

//    private PlaybackTransportControlGlue<MediaPlayerAdapter> mTransportControlGlue;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Movie movie =
                (Movie) getActivity().getIntent().getSerializableExtra(DetailsActivity.MOVIE);

//        VideoSupportFragmentGlueHost glueHost =
//                new VideoSupportFragmentGlueHost(PlaybackVideoFragment.this);
//
//        MediaPlayerAdapter playerAdapter = new MediaPlayerAdapter(getActivity());
//        playerAdapter.setRepeatAction(PlaybackControlsRow.RepeatAction.INDEX_NONE);
//
//        mTransportControlGlue = new PlaybackTransportControlGlue<>(getActivity(), playerAdapter);
//        mTransportControlGlue.setHost(glueHost);
//        mTransportControlGlue.setTitle("视频标题"); //movie.getTitle()
//        mTransportControlGlue.setSubtitle("视频小标题"); //movie.getDescription()
//        mTransportControlGlue.playWhenPrepared();
        try {
//            playerAdapter.setDataSource(Uri.parse("http://183.60.197.29/14/e/d/u/l/edulzybvmedgxfwdnlnsienkvyvpij/hc.yinyuetai.com/46950162D8735703854117E830E2B2DB.mp4?sc=d3ff5015dc2ada56&br=779&vid=3196360&aid=38959&area=KR&vst=2"));
        } catch (Exception e) {
            Log.d("TAG", e.getMessage());
        }
//        playerAdapter.setDataSource(Uri.parse(movie.getVideoUrl()));
    }

    @Override
    public void onPause() {
        super.onPause();
//        if (mTransportControlGlue != null) {
//            mTransportControlGlue.pause();
//        }
    }
}