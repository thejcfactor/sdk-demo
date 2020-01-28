import os
import time

from couchbase.cluster import Cluster, PasswordAuthenticator
from couchbase.n1ql import N1QLQuery
from couchbase.bucket import Bucket
from couchbase.exceptions import CouchbaseError
import couchbase.subdocument as sd
import couchbase.fulltext as fts

class SdkDemoRepository(object):

    def __init__(self):
        self.host = ''
        self.bucket_name = ''
        self.username = ''
        self.password = ''
        self.sampleIds = []

        self.cluster = None
        self.bucket = None
        self.connected = False


    def connect(self, host, bucket, username, password):
        self.host = host
        self.bucket_name = bucket
        self.username = username
        self.password = password

        connection_str = 'couchbase://{0}'.format(self.host)

        try:
            self.cluster = Cluster(connection_str)
            authenticator = PasswordAuthenticator(self.username, self.password)
            self.cluster.authenticate(authenticator)

            self.bucket = self.cluster.open_bucket(self.bucket_name)
        except Exception as error:
            print('Could not open bucket: {0}.  Error: {1}'.format(self.bucket_name, error))
            raise

        self.connected = True
        return self.connected

    def get_sample_doc_ids(self):
        bucket = self.bucket_name
        if('-' in bucket):
            bucket = '`' + self.bucket_name + '`'

        query = 'SELECT meta().id FROM {0} LIMIT 5;'.format(bucket)

        n1ql = N1QLQuery(query)

        ids = []
        for row in self.bucket.n1ql_query(n1ql):
            ids.append(row['id'])

        return ids

    def n1ql_query(self, query, prepare=False, parameters=None):

        n1ql = N1QLQuery(query)

        if parameters and len(parameters) > 0:
            n1ql = N1QLQuery(query, *parameters)

        if prepare:
            n1ql.adhoc = False

        results = []
        for row in self.bucket.n1ql_query(n1ql):
            results.append(row)

        return results

    def get(self, doc_id):

        try:
            result = self.bucket.get(doc_id)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV get for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def get_multi(self, doc_ids):

        try:
            results = []
            for key, result in self.bucket.get_multi(doc_ids):
                results.append({
                    'id': key,
                    'document': result.value
                })
            return results
        except Exception as error:
            print('Error performing KV getMulti for docIds: {0}. Error: {1}'.format(doc_ids, error))
            raise

    def get_replica(self, doc_id):

        try:
            result = self.bucket.get(doc_id, replica=True)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV getReplica for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def touch(self, doc_id, expiry):
        try:
            result = self.bucket.touch(doc_id, ttl=expiry)
            if result.success:
                return result.value

            return None
        except Exception as error:
            print('Error performing KV touch for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def get_and_touch(self, doc_id, expiry):

        try:
            result = self.bucket.get(doc_id, ttl=expiry)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV getAndTouch for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def upsert(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.upsert(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV upsert for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def insert(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.insert(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV insert for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def replace(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.replace(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV replace for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def remove(self, doc_id):

        try:
            self.bucket.remove(doc_id)
            return doc_id
        except Exception as error:
            print('Error performing KV remove for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def lookup_in(self, doc_id, path):

        try:
            result = self.bucket.lookup_in(doc_id, sd.get(path))
            if result:
                return result[0]
            return None
        except Exception as error:
            print('Error performing KV lookupIn for docId: {0} & path: {1}. Error: {2}'.format(doc_id, path, error))
            raise

    def mutate_in(self, doc_id, path, value):

        try:
            result = self.bucket.mutate_in(doc_id, sd.upsert(path, value))
            if result:
                response =  self.lookup_in(doc_id, path)
                return response
            return None
        except Exception as error:
            print('Error performing KV mutateIn for docId: {0} & path: {1}. Error: {2}'.format(doc_id, path, error))
            raise

    def fts(self, term, index_name, fuzziness):
        if not index_name:
            index_name = 'default'

        try:
            query = fts.TermQuery(term, fuzziness=fuzziness) if fuzziness else fts.TermQuery(term)
            results = self.bucket.search(index_name, query, limit=10, highlight_style='html')
            response = []
            for result in results:
                response.append({
                    'id': result['id'],
                    'hit': result['locations']
                })
            return response
        except Exception as error:
            print('Error performing FTS. Error: {0}'.format(error))
            raise
        


        

