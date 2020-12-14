function onOpen(e) {
  DocumentApp.getUi().createAddonMenu().addItem('Start', 'showSidebar').addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar').setTitle('Text To Speech');
  DocumentApp.getUi().showSidebar(ui);
}

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var text = [];
  if (selection) {
    var elements = selection.getSelectedElements();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        // Only translate elements that can be edited as text; skip images and
        // other non-text elements.
        if (element.editAsText) {
          var elementText = element.asText().getText();
          // This check is necessary to exclude images, which return a blank
          // text element.
          if (elementText) {
            text.push(elementText);
          }
        }
      }
    }
  }
  if (!text.length) throw new Error('Please select some text.');
  return text.join('\n');
}

function getPreferences() {
  var up = PropertiesService.getUserProperties();
  return {
    lang: up.getProperty('lang'),
    voice: up.getProperty('voice'),
    accessKeyId: up.getProperty('accessKeyId'),
    secretAccessKey: up.getProperty('secretAccessKey')
  };
}

function savePrefs(prefs) {
    PropertiesService.getUserProperties()
        .setProperty('lang', prefs.lang)
        .setProperty('voice', prefs.voice)
        .setProperty('accessKeyId', prefs.accessKeyId)
        .setProperty('secretAccessKey', prefs.secretAccessKey);
}



