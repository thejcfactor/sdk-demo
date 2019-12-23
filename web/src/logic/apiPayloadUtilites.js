import { _ } from "vue-underscore";

export default {
  getCommandPayload(command, inputOptions, language) {
    let commandPayload = {
      Url: `/api/${language.toLowerCase()}/${command.ApiUrl}`,
      Payload: null
    };

    if (command.Name == "n1ql") {
      commandPayload.Payload = this.getN1qlCommandPayload(inputOptions);
    } else if (command.Name == "get") {
      commandPayload.Payload = this.getGetCommandPayload(inputOptions);
    } else if (command.Name == "getMulti") {
      commandPayload.Payload = this.getGetMultiCommandPayload(inputOptions);
    } else if (command.Name == "getReplica") {
      commandPayload.Payload = this.getGetReplicaCommandPayload(inputOptions);
    } else if (command.Name == "insert") {
      commandPayload.Payload = this.getInsertCommandPayload(inputOptions);
    } else if (command.Name == "upsert") {
      commandPayload.Payload = this.getUpsertCommandPayload(inputOptions);
    } else if (command.Name == "replace") {
      commandPayload.Payload = this.getReplaceCommandPayload(inputOptions);
    } else if (command.Name == "remove") {
      commandPayload.Payload = this.getRemoveCommandPayload(inputOptions);
    } else if (command.Name == "lookupIn") {
      commandPayload.Payload = this.getLookupInCommandPayload(inputOptions);
    } else if (command.Name == "fts") {
      /*else if (command.Name == "mutateIn") {
        commandPayload.Payload = this.getMutateInCommandPayload(inputOptions);
      } else if (command.Name == "touch") {
        commandPayload.Payload = this.getTouchCommandPayload(inputOptions);
      } else if (command.Name == "getAndTouch") {
        commandPayload.Payload = this.getGetAndTouchCommandPayload(inputOptions);
      } */
      commandPayload.Payload = this.getFTSCommandPayload(inputOptions);
    } else if (command.Name == "acid") {
      commandPayload.Payload = this.getACIDCommandPayload(inputOptions);
    } else if (command.Name == "acid-beer-sample") {
      commandPayload.Payload = this.getACIDBeerSampleCommandPayload(
        inputOptions
      );
    }

    return commandPayload;
  },
  getN1qlCommandPayload(inputOptions) {
    let queryInput = _.findWhere(inputOptions, { Name: "query" });
    return {
      query: queryInput.Value
    };
  },
  getGetCommandPayload(inputOptions) {
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    return {
      docId: docId.Value
    };
  },
  getGetMultiCommandPayload(inputOptions) {
    let docIds = _.findWhere(inputOptions, { Name: "docIds" });
    return {
      docIds: docIds.Value
    };
  },
  getGetReplicaCommandPayload(inputOptions) {
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    return {
      docId: docId.Value
    };
  },
  getInsertCommandPayload(inputOptions) {
    //TODO:  add persistTo, replicateTo options
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    let doc = _.findWhere(inputOptions, { Name: "content" });
    return {
      docId: docId.Value,
      doc: JSON.stringify(JSON.parse(doc.Value))
    };
  },
  getUpsertCommandPayload(inputOptions) {
    //TODO:  add persistTo, replicateTo options
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    let doc = _.findWhere(inputOptions, { Name: "content" });
    return {
      docId: docId.Value,
      doc: JSON.stringify(JSON.parse(doc.Value))
    };
  },
  getReplaceCommandPayload(inputOptions) {
    //TODO:  add persistTo, replicateTo options
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    let doc = _.findWhere(inputOptions, { Name: "content" });
    return {
      docId: docId.Value,
      doc: JSON.stringify(JSON.parse(doc.Value))
    };
  },
  getRemoveCommandPayload(inputOptions) {
    //TODO:  add persistTo, replicateTo options
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    return {
      docId: docId.Value
    };
  },
  getLookupInCommandPayload(inputOptions) {
    //TODO:  add persistTo, replicateTo options
    let docId = _.findWhere(inputOptions, { Name: "docId" });
    let path = _.findWhere(inputOptions, { Name: "path" });
    let resultType = _.findWhere(inputOptions, { Name: "resultType" });
    return {
      docId: docId.Value,
      path: path.Value,
      resultType: resultType.Value
    };
  },
  /*getMutateInCommandPayload(inputOptions) {
      return {
        docIdmutatein: commandText.DocIds,
        pathMutatein: commandText.Option1,
        doc: commandText.Option2
      };
    },
    getTouchCommandPayload(inputOptions) {
      return {
        docIdtouch: commandText.DocIds,
        expiry: commandText.Option1
      };
    },
    getGetAndTouchCommandPayload(inputOptions) {
      return {
        docIdgetAndTouch: commandText.DocIds,
        expiry: commandText.Option1
      };
    },*/
  getFTSCommandPayload(inputOptions) {
    let ftsMatch = _.findWhere(inputOptions, { Name: "ftsSearchTerm" });
    let ftsField = _.findWhere(inputOptions, { Name: "ftsDescription" });
    let ftsIndexToUse = _.findWhere(inputOptions, { Name: "ftsIndex" });
    return {
      ftsMatch: ftsMatch.Value,
      ftsField: ftsField.Value,
      ftsIndexToUse: ftsIndexToUse.Value
    };
  },
  getACIDCommandPayload(inputOptions) {
    let doc1Id = _.findWhere(inputOptions, { Name: "doc1Id" });
    let doc1 = _.findWhere(inputOptions, { Name: "doc1Content" });
    let doc2Id = _.findWhere(inputOptions, { Name: "doc2Id" });
    let doc2 = _.findWhere(inputOptions, { Name: "doc2Content" });
    let rollback = _.findWhere(inputOptions, { Name: "rollback" });
    return {
      doc1Id: doc1Id.Value,
      doc1: doc1.Value,
      doc2Id: doc2Id.Value,
      doc2: doc2.Value,
      rollback: rollback.Value.toString()
    };
  },
  getACIDBeerSampleCommandPayload(inputOptions) {
    let newBeerId = _.findWhere(inputOptions, { Name: "newBeerId" });
    let newBeer = _.findWhere(inputOptions, { Name: "newBeer" });
    let breweryId = _.findWhere(inputOptions, { Name: "breweryId" });
    let rollback = _.findWhere(inputOptions, { Name: "rollback" });
    console.log(inputOptions);
    return {
      newBeerId: newBeerId.Value,
      newBeer: newBeer.Value,
      breweryId: breweryId.Value,
      rollback: rollback.Value.toString()
    };
  }
};
