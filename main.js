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
  console.log(`message received: '${message}'`);

  // TODO: everything needs to be refactored below:
  if (message === 'SBI-index') {
  } else if (message === 'SBI-profile') {
    // Fetch the extension settings
    chrome.storage.sync.get('profile', (extensionSettings) => {
      // If the settings were not fetched correctly, cut the treatment instantly
      if (extensionSettings == null || extensionSettings.profile == null) {
        return;
      }

      // -------
      // PROFILE
      // -------
      if (extensionSettings.profile.apply === true) {
        // Reference to the public profile settings
        const settings = extensionSettings.profile;

        // Construct the style string
        let globalStyle = '';

        // Fetch the main block
        const mainBlockFetchString = 'main[role="main"]';
        const mainBlock = document.body.querySelector(mainBlockFetchString);

        // SETTING: zeroGapPublicationsGrid
        if (settings.zeroGapPublicationsGrid) {
          // Get the publications wrapper
          const publicationsWrapperFetchString = 'div div:last-child article>div>div';
          const publicationsWrapper = mainBlock.querySelector(publicationsWrapperFetchString);

          if (publicationsWrapper != null) {
            // Profile row
            const publicationsRowClasses = `div.${Array.from(publicationsWrapper.firstChild.classList).join('.')}`;

            // Profile column
            const publicationsColumnClasses = `div.${Array.from(publicationsWrapper.firstChild.firstChild.classList).join('.')}`;

            const pathToStyle = `${mainBlockFetchString} ${publicationsWrapperFetchString}`;
            globalStyle += `${pathToStyle} ${publicationsRowClasses}{margin:0;}`;
            globalStyle += `${pathToStyle} ${publicationsColumnClasses}{margin:0;}`;
          }
        }

        // Create the HTML style element
        var globalStyleOverrideElement = document.createElement('style');
        // globalStyleOverrideElement.id = 'sbi-profile-style-override';
        globalStyleOverrideElement.appendChild(document.createTextNode(globalStyle));

        // Append the HTML style element to the web page
        document.getElementsByTagName('head')[0].appendChild(globalStyleOverrideElement);
      }
    });
  }
};
