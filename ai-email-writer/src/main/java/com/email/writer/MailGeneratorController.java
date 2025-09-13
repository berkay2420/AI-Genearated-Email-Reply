package com.email.writer;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class MailGeneratorController {

    private final MailGeneratorService mailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){

        String response = mailGeneratorService.generateMailReply(emailRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/emails")
    public List<GeneratedEmails>  listMails() {
        return mailGeneratorService.listMails();
    }

    @PostMapping("/save-mail")
    public  GeneratedEmails saveGeneratedMail(){
        return mailGeneratorService.saveGeneratedMail();
    }
}

