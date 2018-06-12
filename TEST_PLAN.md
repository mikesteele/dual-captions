## Manual Test Plan
This is a manual test plan for integration testing of dual-captions. It should be performed before any release to the Chrome Web Store.

### Test Plan tests (meta)
#### Netflix 
##### Top
Verify that Bleach - English subtitles has "top" captions. Find "player-timedtext-text-container" in the DOM. It should have a top style.
##### Bottom - 1
Verify that Cosmos: A Spacetime Odyssey - Spanish subtitles has bottom captions. Find "player-timedtext-text-container" in the DOM. It should have a bottom style.
##### Bottom - 2
Verify that Cosmos: A Spacetime Odyssey - English \[CC\] subtitles has bottom captions. Find "player-timedtext-text-container" in the DOM. It should have a bottom style.

### YouTube
#### Basic tests
##### Basic test
Search "Ted Talk", choose a video with CC. Turn DC on. DC should work.

##### No automatic captions
Automatic captions should not work. Search "Ted Talk", choose a video without CC. Turn DC on. DC should not work.

##### Space between
Search "Ted Talk", choose a video with CC. Turn DC on. DC should work. Turn on Extra Space. Video should now have extra space.

##### Delayed rendering
Search "Ted Talk", choose a video with CC. Turn DC on. DC should work. Turn off delayed rendering. Delayed rendering should be off.

#### Multitab tests
###### Should read settings from page
Make two tabs. Load two different Ted Talks with CC. Start DC in both, but make the first tab have "French" subtitles with no extra space, and the second "Spanish" with extra space. Switch between the tabs. Settings should be maintained. Open the popup on each page. The popup should correctly match the page settings. Now turn the second tab off. Switch between tabs. Popup should correctly match the DC status on both pages.

#### Error tests
##### no-dc
Open a non-YouTube page. Attempting to turn on DC should give no-dc error.

##### no-player
Open youtube.com/robots.txt. Attempting to turn on DC should give no-player error.

### Netflix
Repeat the YouTube tests. Because Netflix has various subtypes of captions, run the tests on both Cosmos: A Spacetime Odyssey - Spanish CC (bottom), Cosmos: A Spacetime Odyssey - English \[CC\] (CC, top) and Bleach ().

#### Pausing
Pause a Netflix video. DC should re-render and stay visible as the app displays the video title, etc.
