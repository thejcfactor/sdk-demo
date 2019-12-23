import { _ } from "vue-underscore";

const commands = [];
const documentationUrls = [
  {
    Language: "PYTHON25",
    Command: null,
    Url: "https://docs.couchbase.com/python-sdk/2.5/start-using-sdk.html"
  },
  {
    Language: "PYTHON25",
    Command: "connect",
    Url: "https://docs.couchbase.com/python-sdk/2.5/managing-connections.html"
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
