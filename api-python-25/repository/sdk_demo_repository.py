import os
import time

from couchbase.cluster import Cluster, PasswordAuthenticator
from couchbase.n1ql import N1QLQuery
from couchbase.bucket import Bucket
from couchbase.exceptions import CouchbaseError
import couchbase.subdocument as sd

class SdkDemoRepository(object):

    def __init__(self):
        self.host = ''
        self.bucketName = ''
        self.username = ''
        self.password = ''
        self.sampleIds = []

        self.cluster = None
        self.bucket = None
        self.connected = False


    def connect(self, host, bucket, username, password):
        self.host = host
        self.bucketName = bucket
        self.username = username
        self.password = password

        connection_str = 'couchbase://{0}'.format(self.host)

        try:
            self.cluster = Cluster(connection_str)
            authenticator = PasswordAuthenticator(self.username, self.password)
            self.cluster.authenticate(authenticator)

            self.bucket = self.cluster.open_bucket(self.bucketName)
        except Exception as error:
            print('Could not open bucket: {0}.  Error: {1}'.format(self.bucketName, error))
            raise

        self.connected = True
        return self.connected

    def get_sample_doc_ids(self):
        bucket = self.bucketName
        if('-' in bucket):
            bucket = '`' + self.bucketName + '`'

        query = 'SELECT meta().id FROM {0} LIMIT 5;'.format(bucket)

        n1ql = N1QLQuery(query)

        ids = []
        for row in self.bucket.n1ql_query(n1ql):
            ids.append(row['id'])

        return ids

    def n1qlQuery(self, query):

        n1ql = N1QLQuery(query)

        results = []
        for row in self.bucket.n1ql_query(n1ql):
            results.append(row)

        return results

    def get(self, docId):

        try:
            result = self.bucket.get(docId)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV get for docId: {0}. Error: {1}'.format(docId, error))
            raise

    def getMulti(self, docIds):

        try:
            results = []
            for key, result in self.bucket.get_multi(docIds):
                results.append({
                    'id': key,
                    'document': result.value
                })
            return results
        except Exception as error:
            print('Error performing KV getMulti for docIds: {0}. Error: {1}'.format(docIds, error))
            raise

    def upsert(self, docId, docValue, options=None):

        try:
            result = self.bucket.upsert(docId, docValue)
            if result:
                return self.get(docId)
            return None
        except Exception as error:
            print('Error performing KV upsert for docId: {0}. Error: {1}'.format(docId, error))
            raise

    def insert(self, docId, docValue, options=None):

        try:
            result = self.bucket.insert(docId, docValue)
            if result:
                return self.get(docId)
            return None
        except Exception as error:
            print('Error performing KV insert for docId: {0}. Error: {1}'.format(docId, error))
            raise

    def replace(self, docId, docValue, options=None):

        try:
            result = self.bucket.replace(docId, docValue)
            if result:
                return self.get(docId)
            return None
        except Exception as error:
            print('Error performing KV replace for docId: {0}. Error: {1}'.format(docId, error))
            raise

    def remove(self, docId):

        try:
            self.bucket.remove(docId)
            return docId
        except Exception as error:
            print('Error performing KV remove for docId: {0}. Error: {1}'.format(docId, error))
            raise

    def lookupIn(self, docId, path):

        try:
            result = self.bucket.lookup_in(docId, sd.get(path))
            if result:
                return result[0]
            return None
        except Exception as error:
            print('Error performing KV lookupIn for docId: {0} & path: {1}. Error: {2}'.format(docId, path, error))
            raise

        

