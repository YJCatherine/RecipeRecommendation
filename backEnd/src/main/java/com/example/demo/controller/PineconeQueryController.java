package com.example.demo.controller;

import com.example.demo.service.PineconeQueryService;
import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PineconeQueryController {

    @Autowired
    private PineconeQueryService pineconeQueryService;

    @PostMapping("/query")
    public ResponseEntity<QueryResponseWithUnsignedIndices> query(@RequestBody List<Float> queryVector) {
        QueryResponseWithUnsignedIndices response = pineconeQueryService.queryPinecone(queryVector);
        return ResponseEntity.ok(response);
    }
}
