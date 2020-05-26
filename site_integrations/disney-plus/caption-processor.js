/**
 *  On Disney+, caption files are sent in chunks.
 *
 *  This captionProcessor joins a chunk into the loaded captions.
 */

const DisneyPlusCaptionProcessor = (existingCaptions, newCaptions) => {
  // It's OK if these are out of order or duplicates for the moment.
  // May need modifications if Provider.getCaptionToRender() changes
  const captions = [...existingCaptions, ...newCaptions];
  return captions;
}

module.exports = DisneyPlusCaptionProcessor;
