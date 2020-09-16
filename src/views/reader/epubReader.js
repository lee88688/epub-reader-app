import React, { useState, useRef, useEffect } from 'react';
import ePub from 'epubjs';

export function useReader({ opfUrl }) {
  const rendition = useRef(null);

  useEffect(() => {
    const viewer = document.querySelector('#viewer');
    console.log(viewer.clientHeight);
    const book = ePub(opfUrl);
    rendition.current = book.renderTo('viewer', {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
      snap: true
    });
    rendition.current.display(1);
  }, [opfUrl]);

  return (
    <div id="viewer" style={{ 'height': '100%', width: '100%' }}></div>
  );
}
