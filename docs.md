## ObserverController

The ObserverController is the heart of Dual Captions.

At its simplest, it watches for new captions to appear, translates them, and adds the translated caption underneath.

The ObserverController is responsible for:

1. Managing the MutationObserver that watches for new captions to be added to the DOM.
2. Translating new captions when they are added to the DOM.
3. Responding to messages sent from the Dual Captions pop-up.
4. Avoiding adding the same caption to the DOM multiple times.
5. Making as few calls to translate API as possible, by leveraging a TranslationCache.

File: /lib/dual-captions.js

## Adapter

Adapters are site-specific. They know which element is the player, what makes an element a caption, and where to append translated captions.

The Adapter is responsible for:

1. Querying the player that the ObserverContoller will observe.
2. Providing a way to indentify if a MutationRecord means a caption was added to the DOM.
3. Styling a translated caption to match the true captions.
4. Appending a translated caption to the DOM.

