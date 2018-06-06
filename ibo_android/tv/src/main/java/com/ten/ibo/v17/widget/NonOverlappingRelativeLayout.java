package com.ten.ibo.v17.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.RelativeLayout;

class NonOverlappingRelativeLayout extends RelativeLayout {

    public NonOverlappingRelativeLayout(Context context) {
        this(context, null);
    }

    public NonOverlappingRelativeLayout(Context context, AttributeSet attrs) {
        super(context, attrs, 0);
    }

    public NonOverlappingRelativeLayout(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    /**
     * Avoid creating hardware layer when Transition is animating alpha.
     */
    @Override
    public boolean hasOverlappingRendering() {
        return false;
    }
}
