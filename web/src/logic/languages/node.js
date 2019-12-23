import { _ } from "vue-underscore";

const commands = [];
const documentationUrls = [
  {
    Language: "NODE26",
    Command: null,
    Url: "https://docs.couchbase.com/nodejs-sdk/2.6/start-using-sdk.html"
  },
  {
    Language: "NODE26",
    Command: "connect",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/current/managing-connections.html"
  }
];

export default {
  getDocumentationUrl(language, command) {
    let commandName = command ? command.Name : null;
    let documentationUrl = _.findWhere(documentationUrls, {
      Language: language,
      Command: commandName
    });

    return documentationUrl;
  },
  getLanguageSpecificCommands(language) {
    let matchingCommands = _.where(commands, { Language: language });
    if (matchingCommands && matchingCommands.length > 0) {
      return matchingCommands;
    }
    return [];
  }
};
