package com.ten.ibo;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import com.ten.ibo.widget.togglebutton.ToggleButtonBase;

public class HomeActivity extends Activity {

    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home2);

        mContext = this;

    }

    public void onclick1(View view) {
        MainActivity.show(mContext, 1);
    }

    public void onclick2(View view) {
        MainActivity.show(mContext, 2);
    }

    public void onclick3(View view) {
        MainActivity.show(mContext, 3);
    }


    public void onCheckedChanged(@NonNull ToggleButtonBase compoundButton, boolean b) {
//        if (buttonsManager != null)
//            buttonsManager.onCheckedChanged(compoundButton, b);
    }

}
