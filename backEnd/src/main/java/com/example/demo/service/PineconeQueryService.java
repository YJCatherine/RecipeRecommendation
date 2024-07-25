package com.example.demo.service;

import io.pinecone.clients.Index;
import io.pinecone.clients.Pinecone;
import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PineconeQueryService {

    @Value("${pinecone.api.key}")
    private String apiKey;

    @Value("${pinecone.index.name}")
    private String indexName;

    @Value("${pinecone.namespace}")
    private String namespace;

    public QueryResponseWithUnsignedIndices queryPinecone(List<Float> queryVector) {
        Pinecone pc = new Pinecone.Builder(apiKey).build();
        Index index = pc.getIndexConnection(indexName);
        return index.query(3, queryVector, null, null, null, namespace, null, true, false);
    }
}
