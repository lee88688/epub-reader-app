import React, { useState, useRef, useEffect } from 'react';
import ePub from 'epubjs';

export function useReader({ opfUrl }) {
  const rendition = useRef(null);

  useEffect(() => {
    const viewer = document.querySelector('#viewer');
    // console.log(viewer.clientHeight);
    const book = ePub(opfUrl);
    rendition.current = book.renderTo('viewer', {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
      snap: true
    });
    rendition.current.display(1);

    let cfi = null;
    rendition.current.on('selected', function(cfiRange, contents) {
      if (!cfi) {
        const fn = () => {
          contents.document.removeEventListener('mouseup', fn);
          rendition.current.annotations.highlight(cfi, {}, e => console.log('click'), '', { fill: 'blue' });
          cfi = null;
        };
        contents.document.addEventListener('mouseup', fn);
      }
      cfi = cfiRange;
    });
  }, [opfUrl]);

  const bookItem = (
    <div id="viewer" style={{ 'height': '100%', width: '100%' }}></div>
  );

  return {
    bookItem,
    rendition,
    nextPage: () => rendition.current ? rendition.current.next() : null,
    prevPage: () => rendition.current ? rendition.current.prev() : null
  };
}
