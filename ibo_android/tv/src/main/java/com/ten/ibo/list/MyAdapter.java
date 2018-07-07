package com.ten.ibo.list;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.support.v7.widget.RecyclerView;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.ten.ibo.AppManager;
import com.ten.ibo.MainActivity;
import com.ten.ibo.R;
import com.ten.ibo.util.TDevice;

import java.util.List;

/**
 * Author: cynid
 * Created on 18-7-7 下午2:51
 * Description:
 */
public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {


    // 数据集
    private List<DetailInfo> mDataset;
    private Context mContext;
    private int id;
    private View.OnFocusChangeListener mOnFocusChangeListener;
    private OnBindListener onBindListener;
    private static final String TAG = MyAdapter.class.getSimpleName();

    public interface OnBindListener {
        void onBind(View view, int i);
    }

    public MyAdapter(Context context, List<DetailInfo> dataset) {
        super();
        mContext = context;
        mDataset = dataset;
    }

    public MyAdapter(Context context, List<DetailInfo> dataset, int id) {
        super();
        mContext = context;
        mDataset = dataset;
        this.id = id;
        Log.d(TAG, "mDataset " + mDataset.size());
    }

    public MyAdapter(Context context, List<DetailInfo> dataset, int id, View.OnFocusChangeListener onFocusChangeListener) {
        super();
        mContext = context;
        mDataset = dataset;
        this.id = id;
        this.mOnFocusChangeListener = onFocusChangeListener;
    }

    public void setOnBindListener(OnBindListener onBindListener) {
        this.onBindListener = onBindListener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        int resId = R.layout.detail_list_item;
        if (this.id > 0) {
            resId = this.id;
        }
        View view = LayoutInflater.from(mContext).inflate(resId, viewGroup, false);
        FrameLayout mLayoutRoot = view.findViewById(R.id.detail_list_item_layout_root);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                (int) TDevice.px2dp(TDevice.getScreenWidth() / 5),
                (int) TDevice.px2dp(TDevice.getScreenHeight() / 2.5f)
        );
        layoutParams.setMargins(0, 10, 0, 10);
        mLayoutRoot.setLayoutParams(layoutParams);
        ViewHolder holder = new ViewHolder(view);

        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int i) {
        if (mDataset.size() == 0) {
            Log.d(TAG, "mDataset has no data!");
            return;
        }
        viewHolder.mTextDesc.setText(mDataset.get(i).getInfotext());
        viewHolder.mTextTitle.setText(mDataset.get(i).getTitle());
        Point point = ImageUtils.getGridVerPosterSize(mContext, 4);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(point.x, point.y);
        viewHolder.mPostImg.setLayoutParams(params);

        Glide.with(mContext)
                .load(mDataset.get(i).getPoster())
                .asBitmap()
                .diskCacheStrategy(DiskCacheStrategy.RESULT)
                .override(point.x, point.y)
                .into(viewHolder.mPostImg);

//        if (mDataset.get(i).getPoster() != null) {
//            ImageUtils.displayImage(viewHolder.mPostImg, mDataset.get(i).getPoster(), point.x, point.y);
//        } else {
//            viewHolder.mPostImg.setImageDrawable(AppManager.getResource().getDrawable(R.drawable.ic_post_1));
//        }
        viewHolder.itemView.setTag(i);
        viewHolder.itemView.setOnFocusChangeListener(mOnFocusChangeListener);
        if (onBindListener != null) {
            onBindListener.onBind(viewHolder.itemView, i);
        }

        viewHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MainActivity.show(mContext, 3);
            }
        });

    }

    @Override
    public int getItemCount() {
        return mDataset.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        public TextView mTextDesc;
        public ImageView mPostImg;
        public TextView mTextTitle;

        public ViewHolder(View itemView) {
            super(itemView);
            mTextDesc = (TextView) itemView.findViewById(R.id.tv_desc);
            mPostImg = (ImageView) itemView.findViewById(R.id.iv_image);
            mTextTitle = (TextView) itemView.findViewById(R.id.tv_title);
        }
    }

    public void setData(List<DetailInfo> data) {
        this.mDataset = data;
    }



}
