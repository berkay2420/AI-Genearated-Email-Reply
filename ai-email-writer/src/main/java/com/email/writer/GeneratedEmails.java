package com.email.writer;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GeneratedEmails {
    public String generatedMail;
    public LocalDateTime createdAt;
    public String language;
    public  String tone;

    public GeneratedEmails(String generatedMail, LocalDateTime createdAt, String language, String tone){
        this.generatedMail = generatedMail;
        this.createdAt = createdAt;
        this.language = language;
        this.tone = tone;

    }
}
