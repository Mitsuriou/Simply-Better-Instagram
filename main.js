// Listen from any message coming from the background worker script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  mainHandler(request.message);
});

/**
 * Main handler for Simply Better Instagram. This function is responsible of accessing
 * and modifying the DOM directly
 * @param {String} message The message coming from the background worker script
 */
const mainHandler = function (message) {
  // TODO: find a way to wait until the page is fully loaded before doing anything

  // Fetch the settings before doing anything
  chrome.storage.sync.get(['settings'], (storageData) => {
    // If the settings were not fetched correctly, cut the treatment instantly
    if (storageData == null || storageData.settings == null) {
      return;
    }

    // Constant for shorter variable names later
    const extensionSettings = storageData.settings;

    // Construct the style string
    let globalStyle = '';

    // ----------------
    // GENERAL SETTINGS
    // ----------------
    if (extensionSettings.general.apply === true) {
      // Fetch the main block
      const mainBlockFetchString = 'main[role="main"]';
      const mainBlock = document.body.querySelector(mainBlockFetchString);

      // SETTING: Make the header bar's content take the full page's width
      if (extensionSettings.general.headerbarContentTakesFullPageWidth === true) {
        // Search the header bar (navbar)
        const navbarBlock = mainBlock.nextSibling;

        // Search the container to modify
        const classToTarget = `div.${Array.from(navbarBlock.childNodes.item(1).firstChild.firstChild.classList).join('.')}`;
        globalStyle += `${classToTarget}{max-width:none;}`;
      }
    }

    // ----------
    // INDEX PAGE
    // ----------
    if (message === 'SBI-index' && extensionSettings.index.apply === true) {
      // Fetch the main block
      const mainBlockFetchString = 'main[role="main"]';
      const mainBlock = document.body.querySelector(mainBlockFetchString);

      // SETTING: Hide right panel
      if (extensionSettings.index.hideRightPanel === true) {
        // Remove the right panel's DIV
        mainBlock.firstChild.lastChild.remove();

        // Override the style of the left DIV
        const leftPanelClasses = `section.${Array.from(mainBlock.firstChild.classList).join('.')}`;
        globalStyle += `${mainBlockFetchString}>${leftPanelClasses}{max-width:max-content;}`;
      }

      // SETTING: Reduce the gaps above and below the stories bar
      if (extensionSettings.index.reduceStoriesBarGaps === true) {
        // Search the section container to update the top padding
        const sectionClasses = `section.${Array.from(mainBlock.firstChild.classList).join('.')}`;
        globalStyle += `${mainBlockFetchString} ${sectionClasses}{padding-top: 4px;}`;

        // Search the bar to update the bottom margin
        const barClasses = `div.${Array.from(mainBlock.firstChild.firstChild.firstChild.classList).join('.')}`;
        globalStyle += `${mainBlockFetchString} ${barClasses}{margin-bottom: 4px;}`;
      }

      // SETTING: Reduce the gap between publications
      if (extensionSettings.index.reduceGapBetweenPublications === true) {
        // Search one publication and read its first class
        const classToTarget = `article.${Array.from(mainBlock.firstChild.firstChild.childNodes.item(1).firstChild.firstChild.classList)[0]}`;
        globalStyle += `${mainBlockFetchString} ${classToTarget}{margin-bottom: 4px;}`;
      }

      // SETTING: Bigger publications
      if (extensionSettings.index.biggerPublications === true) {
        // Override the style of the left DIV
        const leftPanelClasses = `div.${Array.from(mainBlock.firstChild.firstChild.classList).join('.')}`;
        console.log(mainBlock.firstChild.firstChild);
        console.log(leftPanelClasses);
        globalStyle += `${mainBlockFetchString} ${leftPanelClasses}{max-width:none;}`;
      }
    }
    // -------
    // PROFILE
    // -------
    else if (message === 'SBI-publications-feed' && extensionSettings.profile.apply === true) {
      // Fetch the main block
      const mainBlockFetchString = 'main[role="main"]';
      const mainBlock = document.body.querySelector(mainBlockFetchString);

      // SETTING: zeroGapPublicationsGrid
      if (extensionSettings.profile.zeroGapPublicationsGrid) {
        // Get the publications wrapper
        const publicationsWrapperFetchString = 'div div:last-child article>div>div';
        const publicationsWrapper = mainBlock.querySelector(publicationsWrapperFetchString);

        if (publicationsWrapper != null) {
          // Publications row
          const publicationsRowClasses = `div.${Array.from(publicationsWrapper.firstChild.classList).join('.')}`;

          // Publications column
          const publicationsColumnClasses = `div.${Array.from(publicationsWrapper.firstChild.firstChild.classList).join('.')}`;

          globalStyle += `${mainBlockFetchString} ${publicationsWrapperFetchString} ${publicationsRowClasses}{margin:0;}`;
          globalStyle += `${mainBlockFetchString} ${publicationsWrapperFetchString} ${publicationsColumnClasses}{margin:0;}`;
        }
      }
    } else if (message === 'SBI-reels-feed') {
      // TODO:
    } else if (message === 'SBI-igtv-feed') {
      // TODO:
    } else if (message === 'SBI-tagged-feed') {
      // TODO:
    } else if (message === 'SBI-saved-feed') {
      // TODO:
    }

    // Create the HTML style element
    var globalStyleOverrideElement = document.createElement('style');
    // globalStyleOverrideElement.id = 'sbi-profile-style-override';
    globalStyleOverrideElement.appendChild(document.createTextNode(globalStyle));

    // Append the HTML style element to the web page
    document.getElementsByTagName('head')[0].appendChild(globalStyleOverrideElement);
  });
};
