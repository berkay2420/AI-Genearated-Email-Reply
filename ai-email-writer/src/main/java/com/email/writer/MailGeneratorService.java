package com.email.writer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.processing.Generated;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiAPIURL;

    @Value("${gemini.api.key}")
    private String geminiAPIKey;

    private List<GeneratedEmails> mails;


    //Constructor
    public MailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.mails = new ArrayList<>();
    }


    public String generateMailReply(EmailRequest emailRequest){
        //Prompt
        String prompt = buildPrompt(emailRequest);

        //Map because we need key,value to use api
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        //Making a request
        String response = webClient.post()
                .uri(geminiAPIURL + "?key=" + geminiAPIKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        String extracted = extractResponseContent(response);
        GeneratedEmails newMail = new GeneratedEmails(extracted, LocalDateTime.now(),emailRequest.getLanguage(), emailRequest.getTone());

        mails.add(newMail);
        System.out.println("Current Mail List: " + mails);

        //Return the extracted response
        return extracted;
        
    }

    private String extractResponseContent(String response) {
        try{
            System.out.println("Response From System: " + response);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }catch (Exception e){
            return "Error while processing message " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(
                "You are an assistant that writes email replies.\n" +
                        "Follow these instructions carefully:\n" +
                        "1. Write only the reply message body (do NOT include a subject line).\n"
        );

        if(emailRequest.getLanguage() != null && !emailRequest.getLanguage().isEmpty()){
            prompt.append("2. Use ").append(emailRequest.getLanguage()).append(" language in the reply.\n");
        }
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            //use the "tone" if given
            prompt.append("3. Use a ").append(emailRequest.getTone()).append(" tone in the reply.\n");
        }

        prompt.append("\n--- Original Email Content ---\n")
                .append(emailRequest.getEmailContent())
                .append("\n--- End of Original Email ---\n")
                .append("\nNow write the reply below:\n");

        return prompt.toString();
    }

    public List<GeneratedEmails> listMails(){
        return mails;
    }

    public GeneratedEmails saveGeneratedMail(){
        GeneratedEmails lastMail = mails.getLast();
        System.out.println("The last mail is: " + lastMail);
        return lastMail;
    }
}
