import java from "@/logic/languages/java";
import nodeJS from "@/logic/languages/node";
import python from "@/logic/languages/python";

export default {
  getDocumentationUrl(language, commandName) {
    if (language == null) {
      return null;
    }
    if (language.includes("JAVA")) {
      return java.getDocumentationUrl(language, commandName);
    }
    if (language.includes("NODE")) {
      return nodeJS.getDocumentationUrl(language, commandName);
    }
    if (language.includes("PYTHON")) {
      return python.getDocumentationUrl(language, commandName);
    }
    return null;
  },
  getLanguageSpecificCommands(language) {
    if (language.includes("JAVA")) {
      return java.getLanguageSpecificCommands(language);
    }
    if (language.includes("NODE")) {
      return nodeJS.getLanguageSpecificCommands(language);
    }
    if (language.includes("PYTHON")) {
      return python.getLanguageSpecificCommands(language);
    }
    return null;
  },
  getSampleCode(language) {
    if (language.includes("JAVA")) {
      return java.getSampleCode(language);
    }
    if (language.includes("NODE")) {
      return nodeJS.getSampleCode(language);
    }
    if (language.includes("PYTHON")) {
      return python.getSampleCode(language);
    }
    return null;
  },
  getCodeSnippet(language, commands) {
    if (language.includes("JAVA")) {
      return java.getCodeSnippet(language, commands);
    }
    return null;
  }
};
