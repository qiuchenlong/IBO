package com.ten.ibo.list;

import com.google.gson.annotations.Expose;

/**
 * Author: cynid
 * Created on 18-7-7 下午2:42
 * Description:
 */
public class DetailInfo {

    @Expose
    private String title;
    @Expose
    private String poster;
    @Expose
    private String infotext;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInfotext() {
        return infotext;
    }

    public void setInfotext(String infotext) {
        this.infotext = infotext;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    @Override
    public String toString() {
        return "DetailInfo{" +
                "mTitle='" + title + '\'' +
                ", mTextDesc=" + infotext +
                ", mPostImageUrl='" + poster + '\'' +
                '}';
    }

}
