package com.ten.ibo.widget.togglebutton;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.ten.ibo.R;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class ToggleButtonBase extends LinearLayout {

    private int mBindToId;
    protected Drawable mImage;
    protected Drawable mImageOn;
    protected Drawable mImageOff;
    protected String mDescText;
    protected TextView mDescView;
    protected ImageButton mImageButton; // image variant
    protected boolean mIsChecked;
    protected String mTextOn;
    protected String mTextOff;
    protected Button mTextButton; // text variant
    protected LinearLayout mToggleButtonWrapper;
    private List<OnCheckedChangeListener> mCheckedListeners = new ArrayList<>();
    private boolean mIsDisabled;

    public interface OnCheckedChangeListener {
        void onCheckedChanged(ToggleButtonBase button, boolean isChecked);
    }

    @TargetApi(21)
    public ToggleButtonBase(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    public ToggleButtonBase(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public ToggleButtonBase(Context context, AttributeSet attrs) {
        super(context, attrs);

        TypedArray a = context.getTheme().obtainStyledAttributes(
                attrs,
                R.styleable.ToggleButtonBase,
                0, 0);

        try {
            mImage = a.getDrawable(R.styleable.ToggleButtonBase_image);
            mImageOn = a.getDrawable(R.styleable.ToggleButtonBase_imageOn);
            mImageOff = a.getDrawable(R.styleable.ToggleButtonBase_imageOff);
            mTextOn = a.getString(R.styleable.ToggleButtonBase_textOn);
            mTextOff = a.getString(R.styleable.ToggleButtonBase_textOff);
            mDescText = a.getString(R.styleable.ToggleButtonBase_desc);
            mBindToId = a.getResourceId(R.styleable.ToggleButtonBase_bindTo, 0);
            String handlerName = a.getString(R.styleable.ToggleButtonBase_onCheckedChanged);
            if (handlerName != null) {
                setOnCheckedChangeListener(new DeclaredOnCheckedChangeListener(this, handlerName));
            }
        } finally {
            a.recycle();
        }

        init();
    }

    public ToggleButtonBase(Context context) {
        super(context);
        init();
    }

    private void init() {
        inflate();
        applyCommonProps();
        setOnFocus();
        setOnClick();
        initElems();
        makeUnfocused();
    }

    @Override
    public void setOnClickListener(OnClickListener l) {
        // NOTE: android doesn't allow multiple onClick listeners
        if (mCheckedListeners.size() > 0) {
            return;
        }
        super.setOnClickListener(l);
    }

    private void setOnClick() {
        // NOTE: android doesn't allow multiple onClick listeners
        super.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                toggle();
            }
        });
    }

    private void setOnFocus() {
        setOnFocusChangeListener(new OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    makeFocused();
                } else {
                    makeUnfocused();
                }
            }
        });
    }

    private void inflate() {
        inflate(getContext(), R.layout.toggle_button_base, this);
        mDescView = (TextView) findViewById(R.id.description);
        mImageButton = (ImageButton) findViewById(R.id.image_button);
        mTextButton = (Button) findViewById(R.id.text_button);
        mToggleButtonWrapper = (LinearLayout) findViewById(R.id.toggle_button_wrapper);
    }

    private void applyCommonProps() {
        setOrientation(LinearLayout.VERTICAL);
        setClickable(true);
        setFocusable(true);
        setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS);
        // NOTE: disable background when using style attribute
        setBackgroundDrawable(getResources().getDrawable(R.color.transparent));
    }

    private void makeUnfocused() {
        mDescView.setText("");
        onButtonUnfocused();
        //mImageButton.setBackgroundResource(R.color.transparent);
    }

    private void makeFocused() {
        mDescView.setText(mDescText);
        onButtonFocused();
        //mImageButton.setBackgroundResource(R.color.white_50);
    }

    private void initElems() {
        if (isChecked()) {
            onButtonChecked();
            callCheckedListener(true);
            uncheckBindToView();
        } else {
            onButtonUnchecked();
            callCheckedListener(false);
        }
    }

    private void uncheckBindToView() {
        View bindToView = getRootView().findViewById(mBindToId);
        if (bindToView != null)
            ((ToggleButtonBase) bindToView).uncheck();
    }

    public void setChecked(boolean isChecked) {
        mIsChecked = isChecked;
        initElems();
    }

    private void uncheck() {
        mIsChecked = false;
        initElems();
    }

    private void callCheckedListener(boolean isChecked) {
        for (OnCheckedChangeListener listener : mCheckedListeners) {
            if (listener != null)
                listener.onCheckedChanged(this, isChecked);
        }
    }

    protected boolean isChecked() {
        return mIsChecked;
    }

    private void toggle() {
        mIsChecked = !mIsChecked;
        initElems();
    }

    public void resetState() {
        mIsChecked = false;
        initElems();
    }

    public boolean isDisabled() {
        return mIsDisabled;
    }

    public void disable() {
        setFocusable(false);
        setClickable(false);
        makeTextDisabled();
        makeImageDisabled();
        mIsDisabled = true;
    }

    public void enable() {
        setFocusable(true);
        setClickable(true);
        makeTextEnabled();
        makeImageEnabled();
        mIsDisabled = false;
    }

    private void makeTextEnabled() {
        if (mTextButton != null)
            mTextButton.setTextColor(Color.WHITE);
    }

    private void makeTextDisabled() {
        if (mTextButton != null)
            mTextButton.setTextColor(Color.DKGRAY);
    }

    private void makeImageEnabled() {
        if (mImageButton == null) {
            return;
        }

        Drawable image = mImageButton.getDrawable();
        if (image == null) {
            return;
        }
        image.setAlpha(255);
    }

    private void makeImageDisabled() {
        if (mImageButton == null) {
            return;
        }

        Drawable image = mImageButton.getDrawable();
        if (image == null) {
            return;
        }
        image.setAlpha(80);
    }

    protected void onButtonFocused() {
        if (mTextButton != null)
            mTextButton.setBackgroundResource(R.color.white_50);

        if (mImageButton != null)
            mImageButton.setBackgroundResource(R.color.white_50);
    }

    protected void onButtonUnfocused() {
        if (mTextButton != null)
            mTextButton.setBackgroundResource(R.color.transparent);

        if (mImageButton != null)
            mImageButton.setBackgroundResource(R.color.transparent);
    }

    protected void onButtonChecked() {
        if (mTextButton != null)
            mTextButton.setText(mTextOn);

        if (mImageButton != null)
            mImageButton.setImageDrawable(mImageOn);
    }

    protected void onButtonUnchecked() {
        if (mTextButton != null)
            mTextButton.setText(mTextOff);

        if (mImageButton != null)
            mImageButton.setImageDrawable(mImageOff);
    }

    public void setText(int label) {
        mTextButton.setText(label);
    }

    public CharSequence getText() {
        return mTextButton.getText();
    }

    public void setOnCheckedChangeListener(OnCheckedChangeListener listener) {
        mCheckedListeners.add(listener);
    }

    //private void applyDefaultDimens() {
    //    ViewGroup.LayoutParams layoutParams = getLayoutParams();
    //    if (layoutParams == null) {
    //        float width = getResources().getDimension(R.dimen.exo_media_button_width);
    //        float height = getResources().getDimension(R.dimen.exo_media_button_height);
    //        int realWidth = Utils.convertDpToPixel(width, getContext());
    //        int realHeight = Utils.convertDpToPixel(height, getContext());
    //        layoutParams = new ViewGroup.LayoutParams(new LayoutParams(realWidth, realHeight));
    //        setLayoutParams(layoutParams);
    //        return;
    //    }
    //}

    /**
     * An implementation of Listener that attempts to lazily load a
     * named handling method from a parent or ancestor context.
     */
    private class DeclaredOnCheckedChangeListener implements OnCheckedChangeListener {
        private final View mHostView;
        private final String mMethodName;

        private Method mResolvedMethod;
        private Context mResolvedContext;

        public DeclaredOnCheckedChangeListener(@NonNull View hostView, @NonNull String methodName) {
            mHostView = hostView;
            mMethodName = methodName;
        }

        @Override
        public void onCheckedChanged(@NonNull ToggleButtonBase compoundButton, boolean b) {
            if (mResolvedMethod == null) {
                resolveMethod(mHostView.getContext(), mMethodName);
            }

            try {
                mResolvedMethod.invoke(mResolvedContext, compoundButton, b);
            } catch (IllegalAccessException e) {
                throw new IllegalStateException(
                        "Could not execute non-public method for app:onCheckedChanged", e);
            } catch (InvocationTargetException e) {
                throw new IllegalStateException(
                        "Could not execute method for app:onCheckedChanged", e);
            }
        }

        @NonNull
        private void resolveMethod(@Nullable Context context, @NonNull String name) {
            while (context != null) {
                try {
                    if (!context.isRestricted()) {
                        final Method method = context.getClass().getMethod(mMethodName, ToggleButtonBase.class, boolean.class);
                        if (method != null) {
                            mResolvedMethod = method;
                            mResolvedContext = context;
                            return;
                        }
                    }
                } catch (NoSuchMethodException e) {
                    // Failed to find method, keep searching up the hierarchy.
                }

                if (context instanceof ContextWrapper) {
                    context = ((ContextWrapper) context).getBaseContext();
                } else {
                    // Can't search up the hierarchy, null out and fail.
                    context = null;
                }
            }

            final int id = mHostView.getId();
            final String idText = id == NO_ID ? "" : " with id '"
                    + mHostView.getContext().getResources().getResourceEntryName(id) + "'";
            throw new IllegalStateException("Could not find method " + mMethodName
                    + "(ToggleButtonBase, boolean) in a parent or ancestor Context for app:onCheckedChanged "
                    + "attribute defined on view " + mHostView.getClass() + idText);
        }
    }

}
