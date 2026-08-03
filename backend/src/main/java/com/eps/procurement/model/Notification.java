package com.eps.procurement.model;

/** An in-app notification for a user. */
public class Notification {
    public String id;
    public String userId;
    public String type;
    public String title;
    public String message;
    public boolean read;
    public String createdAt;
    public String link;

    public Notification() {}

    public Notification(String id, String userId, String type, String title, String message,
                        boolean read, String createdAt, String link) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
        this.link = link;
    }
}
