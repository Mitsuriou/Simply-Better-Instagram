let lastURL = '';

/**
 * Filter the page URL and send a message to the tab running the script based on the URL patterns
 * @param {String} pageUrl The URL of the page loaded in the tab running the script
 * @param {Number} tabId The identifier of the tab running the script
 * @returns
 */
const urlFiltering = function (pageUrl, tabId) {
  // If the URL does not match with Instagram's one, stop here
  if (!pageUrl.includes('https://www.instagram.com')) {
    return;
  }

  // Routes that are currently skipped
  const explore = new RegExp('https://www.instagram.com/explore/.*');
  const inbox = new RegExp('https://www.instagram.com/direct/.*');
  const accounts = new RegExp('https://www.instagram.com/accounts/.*');
  const pictures = new RegExp('https://www.instagram.com/p/.+');
  const postIGVT = new RegExp('https://www.instagram.com/tv/[^/]+/');
  const stories = new RegExp('https://www.instagram.com/stories/.+');
  const reel = new RegExp('https://www.instagram.com/reel/[^/]+/');

  // Profile and its submenus
  const profilePublications = new RegExp('https://www.instagram.com/[^/]+/');
  const profileReels = new RegExp('https://www.instagram.com/[^/]+/reels/.*');
  const profileIGTV = new RegExp('https://www.instagram.com/[^/]+/channel/');
  const profileSaved = new RegExp('https://www.instagram.com/[^/]+/saved/');
  const profileTagged = new RegExp('https://www.instagram.com/[^/]+/tagged/');

  // Any URL that currently needs to be ignored
  if (
    explore.test(pageUrl) ||
    inbox.test(pageUrl) ||
    accounts.test(pageUrl) ||
    pictures.test(pageUrl) ||
    postIGVT.test(pageUrl) ||
    stories.test(pageUrl) ||
    reel.test(pageUrl)
  ) {
    console.info('URL filtered');
  } else if (profileReels.test(pageUrl)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-reels-feed',
      url: pageUrl,
    });
  }
  // Profile: IGTV feed
  else if (profileIGTV.test(pageUrl)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-igtv-feed',
      url: pageUrl,
    });
  }
  // Profile: saved posts
  else if (profileSaved.test(pageUrl)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-saved-feed',
      url: pageUrl,
    });
  }
  // Profile: Tagged feed
  else if (profileTagged.test(pageUrl)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-tagged-feed',
      url: pageUrl,
    });
  }
  // Profile: Publications feed
  else if (profilePublications.test(pageUrl)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-publications-feed',
      url: pageUrl,
    });
  }
  // Index page
  else if (pageUrl === 'https://www.instagram.com' || pageUrl === 'https://www.instagram.com/' || pageUrl.startsWith('https://www.instagram.com/?')) {
    chrome.tabs.sendMessage(tabId, {
      message: 'SBI-index',
      url: pageUrl,
    });
  }
  // Any other URL (this part should no be reachable)
  else {
    console.error(`Simply Better Instagram extension: unhandled URL found: '${pageUrl}'`);
  }
};

// Function executed when the extension is installed or updated, or Google Chrome is updated
chrome.runtime.onInstalled.addListener(() => {
  // Set the extension settings to default
  chrome.storage.sync.set({
    settings: {
      general: {
        apply: false, // false
        showHTMLPlayerControls: false, // false
        headerbarContentTakesFullPageWidth: false, // false
      },
      index: {
        apply: false, // false
        hideRightPanel: false, // false
        reduceStoriesBarGaps: false, // false
        reduceGapBetweenPublications: false, // false
        biggerPublications: false, // false
      },
      profile: {
        apply: true, // false
        zeroGapPublicationsGrid: true, // false
        zeroGapReelsGrid: true, // false
        zeroGapIGTVGrid: true, // false
        imagesByRow: 3, // 3
        profileLinkWidthFix: false, // false
        backgroundColor: '#fafafa', // '#fafafa'
        fontColor: '',
        linksColor: '',
        buttonsBackgroundColor: '',
        buttonsFontColor: '',
        inactiveTabsFontColor: '',
        activeTabFontColor: '',
        roundSpinnedReelsButton: true,
        roundProfilePicture: true,
        betterVerifiedUserBadge: false,
        hideSuggestionsButton: false,
      },
    },
    other: {
      todo: true,
    },
  });
});

// Event listener when a page is loaded for the first time
chrome.webNavigation.onCompleted.addListener(function (details) {
  if (details.url) {
    urlFiltering(details.url, details.tabId);
  }
});

// Event listener when a page's URL is changed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    lastURL = changeInfo.url;
  }
  if (changeInfo.status === 'complete') {
    urlFiltering(lastURL, tabId);
  }
});
