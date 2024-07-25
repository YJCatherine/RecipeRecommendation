package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class AskService {

    public String getAnswer(String question) {
        // 这里你可以集成你的逻辑，例如调用Pinecone或其他服务
        return "This is a placeholder answer for: " + question;
    }
}

