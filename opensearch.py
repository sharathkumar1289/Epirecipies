import os
from opensearchpy import OpenSearch, ConnectionError


OPENSEARCH_HOST = os.environ.get('OPENSEARCH_HOST', 'localhost')
OPENSEARCH_PORT = int(os.environ.get('OPENSEARCH_PORT', 9200))


client = OpenSearch(
    hosts=[{'host': OPENSEARCH_HOST, 'port': OPENSEARCH_PORT}],
    http_compress=True,  # enables gzip compression for request bodies
    http_auth=None,  # for testing only. Don't use None in production, use proper authentication
    use_ssl=False,  # for testing only. Use True in production with proper certificates
    verify_certs=False,  # for testing only. Use True in production with proper certificates
    ssl_assert_hostname=False,  # for testing only. Use True in production with proper certificates
    ssl_show_warn=False,  # for testing only. Use True in production
)


index_body = {
    "settings": {
        "index": {
            "number_of_shards": 3,
            "number_of_replicas": 1
        }
    },
    "mappings": {
        "properties": {
            "title": { "type": "text", "analyzer": "english" },
            "directions": { "type": "text", "analyzer": "english" },
            "fat": { "type": "float" },
            "date": { "type": "date" },
            "categories": { "type": "keyword" },
            "calories": { "type": "float" },
            "protein": { "type": "float" },
            "rating": { "type": "float" }
        }
    }
}

try:
    response = client.indices.create(index="recipes", body=index_body)
    print("Index 'recipes' created successfully:", response)
except ConnectionError as e:
    print(f"Failed to connect to OpenSearch at {OPENSEARCH_HOST}:{OPENSEARCH_PORT}")
    print(f"Error details: {str(e)}")
except Exception as e:
    print("Error creating index:", str(e))

